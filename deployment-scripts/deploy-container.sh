#!/bin/bash

# AI Playground Container Deployment Script
# For AMD Instinct GPUs with ROCm

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default values
MODEL_NAME=""
PORT=1234
GPU_COUNT=1
CONTAINER_REGISTRY="your-registry"
CONTAINER_TAG="latest"
ENABLE_HEALTH_CHECK=true
ENABLE_MONITORING=true

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}  AI Playground Container Deploy${NC}"
    echo -e "${BLUE}================================${NC}"
}

# Function to show usage
show_usage() {
    cat << EOF
Usage: $0 [OPTIONS]

Options:
    --model MODEL_NAME       Model name to deploy (required)
    --port PORT             Port to expose (default: 1234)
    --gpu-count COUNT       Number of GPUs to use (default: 1)
    --registry REGISTRY     Container registry (default: your-registry)
    --tag TAG              Container tag (default: latest)
    --no-health-check      Disable health checks
    --no-monitoring        Disable monitoring
    --help                 Show this help message

Examples:
    $0 --model "microsoft/DialoGPT-medium" --port 1234
    $0 --model "gpt2" --gpu-count 2 --port 8080
    $0 --model "llama2-7b" --registry "my-registry" --tag "v1.0"

EOF
}

# Function to check system requirements
check_system_requirements() {
    print_status "Checking system requirements..."
    
    # Check if running as root
    if [[ $EUID -eq 0 ]]; then
        print_error "This script should not be run as root"
        exit 1
    fi
    
    # Check OS
    if [[ ! -f /etc/os-release ]]; then
        print_error "Unsupported operating system"
        exit 1
    fi
    
    source /etc/os-release
    if [[ "$ID" != "ubuntu" && "$ID" != "rhel" && "$ID" != "centos" ]]; then
        print_warning "OS $ID may not be fully supported. Ubuntu 20.04/22.04 or RHEL 8/9 recommended."
    fi
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        print_status "Run: curl -fsSL https://get.docker.com -o get-docker.sh && sudo sh get-docker.sh"
        exit 1
    fi
    
    # Check if user is in docker group
    if ! groups $USER | grep -q docker; then
        print_warning "User $USER is not in docker group. Adding..."
        sudo usermod -aG docker $USER
        print_status "Please log out and back in, or run: newgrp docker"
        print_status "Then run this script again."
        exit 1
    fi
    
    # Check AMD GPU
    if ! lspci | grep -i amd &> /dev/null; then
        print_warning "No AMD GPU detected. Container will run on CPU only."
    else
        print_status "AMD GPU detected:"
        lspci | grep -i amd
    fi
    
    # Check system memory
    TOTAL_MEM=$(free -g | awk '/^Mem:/{print $2}')
    if [[ $TOTAL_MEM -lt 16 ]]; then
        print_warning "System has less than 16GB RAM. Performance may be limited."
    else
        print_status "System memory: ${TOTAL_MEM}GB"
    fi
    
    # Check disk space
    FREE_DISK=$(df -BG . | awk 'NR==2 {print $4}' | sed 's/G//')
    if [[ $FREE_DISK -lt 50 ]]; then
        print_warning "Less than 50GB free disk space. Consider freeing up space."
    else
        print_status "Free disk space: ${FREE_DISK}GB"
    fi
}

# Function to check if container is already running
check_existing_container() {
    local container_name="ai-playground-${MODEL_NAME//\//-}"
    
    if docker ps -q -f name="$container_name" | grep -q .; then
        print_warning "Container $container_name is already running."
        read -p "Do you want to stop and remove it? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            print_status "Stopping existing container..."
            docker stop "$container_name" || true
            docker rm "$container_name" || true
        else
            print_status "Exiting..."
            exit 0
        fi
    fi
}

# Function to pull container image
pull_container_image() {
    local image_name="${CONTAINER_REGISTRY}/ai-playground:${MODEL_NAME//\//-}-${CONTAINER_TAG}"
    
    print_status "Pulling container image: $image_name"
    
    if ! docker pull "$image_name"; then
        print_error "Failed to pull container image. Building locally..."
        build_container_image
    fi
}

# Function to build container image locally
build_container_image() {
    print_status "Building container image locally..."
    
    # Create temporary Dockerfile
    cat > Dockerfile.tmp << EOF
FROM rocm/pytorch:rocm5.6_ubuntu20.04_py3.9_pytorch_2.0.1

# Install system dependencies
RUN apt-get update && apt-get install -y \\
    curl \\
    wget \\
    git \\
    build-essential \\
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
RUN pip install --no-cache-dir \\
    transformers \\
    accelerate \\
    bitsandbytes \\
    flask \\
    fastapi \\
    uvicorn \\
    torchvision \\
    torchaudio

# Create app directory
WORKDIR /app

# Copy model loading script
COPY <<EOF /app/load_model.py
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM
import os

def load_model(model_name):
    print(f"Loading model: {model_name}")
    
    # Load tokenizer
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    
    # Load model with optimizations
    model = AutoModelForCausalLM.from_pretrained(
        model_name,
        torch_dtype=torch.float16,
        device_map='auto',
        low_cpu_mem_usage=True
    )
    
    return model, tokenizer

if __name__ == "__main__":
    model_name = os.getenv('MODEL_NAME', 'gpt2')
    model, tokenizer = load_model(model_name)
    print("Model loaded successfully!")
EOF

# Copy inference server
COPY <<EOF /app/server.py
from flask import Flask, request, jsonify
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM
import os
import time

app = Flask(__name__)

# Global variables for model and tokenizer
model = None
tokenizer = None

def load_model():
    global model, tokenizer
    model_name = os.getenv('MODEL_NAME', 'gpt2')
    
    print(f"Loading model: {model_name}")
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    
    model = AutoModelForCausalLM.from_pretrained(
        model_name,
        torch_dtype=torch.float16,
        device_map='auto',
        low_cpu_mem_usage=True
    )
    
    # Add padding token if not present
    if tokenizer.pad_token is None:
        tokenizer.pad_token = tokenizer.eos_token
    
    print("Model loaded successfully!")

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'model': os.getenv('MODEL_NAME', 'unknown'),
        'gpu_available': torch.cuda.is_available(),
        'gpu_count': torch.cuda.device_count() if torch.cuda.is_available() else 0
    })

@app.route('/v1/chat/completions', methods=['POST'])
def chat_completion():
    if model is None or tokenizer is None:
        return jsonify({'error': 'Model not loaded'}), 500
    
    try:
        data = request.json
        messages = data.get('messages', [])
        max_tokens = data.get('max_tokens', 100)
        temperature = data.get('temperature', 0.7)
        
        # Format messages for model
        if hasattr(tokenizer, 'apply_chat_template'):
            prompt = tokenizer.apply_chat_template(messages, tokenize=False)
        else:
            # Fallback for models without chat template
            prompt = " ".join([msg['content'] for msg in messages])
        
        # Tokenize input
        inputs = tokenizer(prompt, return_tensors='pt', padding=True, truncation=True)
        
        # Move to GPU if available
        if torch.cuda.is_available():
            inputs = {k: v.cuda() for k, v in inputs.items()}
        
        # Generate response
        with torch.no_grad():
            outputs = model.generate(
                **inputs,
                max_new_tokens=max_tokens,
                temperature=temperature,
                do_sample=True,
                pad_token_id=tokenizer.eos_token_id
            )
        
        # Decode response
        response = tokenizer.decode(outputs[0][inputs['input_ids'].shape[1]:], skip_special_tokens=True)
        
        return jsonify({
            'choices': [{
                'message': {'content': response, 'role': 'assistant'},
                'finish_reason': 'stop'
            }]
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    load_model()
    port = int(os.getenv('PORT', 1234))
    app.run(host='0.0.0.0', port=port, debug=False)
EOF

    # Build the image
    local image_name="${CONTAINER_REGISTRY}/ai-playground:${MODEL_NAME//\//-}-${CONTAINER_TAG}"
    docker build -f Dockerfile.tmp -t "$image_name" .
    
    # Clean up
    rm -f Dockerfile.tmp
}

# Function to run container
run_container() {
    local container_name="ai-playground-${MODEL_NAME//\//-}"
    local image_name="${CONTAINER_REGISTRY}/ai-playground:${MODEL_NAME//\//-}-${CONTAINER_TAG}"
    
    print_status "Starting container: $container_name"
    
    # Prepare environment variables
    local env_vars=(
        "-e MODEL_NAME=${MODEL_NAME}"
        "-e PORT=${PORT}"
        "-e ENABLE_HEALTH_CHECK=${ENABLE_HEALTH_CHECK}"
        "-e ENABLE_MONITORING=${ENABLE_MONITORING}"
    )
    
    # Prepare GPU access
    local gpu_args=""
    if lspci | grep -i amd &> /dev/null; then
        gpu_args="--gpus all"
        print_status "Enabling GPU access for AMD Instinct"
    else
        print_warning "No AMD GPU detected, running on CPU"
    fi
    
    # Run container
    docker run -d \
        --name "$container_name" \
        $gpu_args \
        --shm-size=8g \
        -p "${PORT}:${PORT}" \
        "${env_vars[@]}" \
        --restart unless-stopped \
        "$image_name" \
        python /app/server.py
    
    print_status "Container started successfully!"
}

# Function to verify deployment
verify_deployment() {
    local container_name="ai-playground-${MODEL_NAME//\//-}"
    
    print_status "Verifying deployment..."
    
    # Wait for container to be ready
    print_status "Waiting for container to be ready..."
    sleep 10
    
    # Check if container is running
    if ! docker ps -q -f name="$container_name" | grep -q .; then
        print_error "Container is not running. Checking logs..."
        docker logs "$container_name"
        exit 1
    fi
    
    # Check health endpoint
    print_status "Checking health endpoint..."
    if curl -f "http://localhost:${PORT}/health" &> /dev/null; then
        print_status "Health check passed!"
    else
        print_warning "Health check failed. Container may still be starting..."
        sleep 10
        if curl -f "http://localhost:${PORT}/health" &> /dev/null; then
            print_status "Health check passed after retry!"
        else
            print_error "Health check failed. Checking logs..."
            docker logs "$container_name"
            exit 1
        fi
    fi
    
    # Test inference
    print_status "Testing inference..."
    local test_response=$(curl -s -X POST "http://localhost:${PORT}/v1/chat/completions" \
        -H "Content-Type: application/json" \
        -d '{"messages": [{"role": "user", "content": "Hello!"}], "max_tokens": 10}')
    
    if echo "$test_response" | grep -q "choices"; then
        print_status "Inference test passed!"
    else
        print_warning "Inference test failed, but container is running."
        echo "Response: $test_response"
    fi
}

# Function to show deployment info
show_deployment_info() {
    local container_name="ai-playground-${MODEL_NAME//\//-}"
    
    print_status "Deployment completed successfully!"
    echo
    echo -e "${BLUE}Deployment Information:${NC}"
    echo "  Container Name: $container_name"
    echo "  Model: $MODEL_NAME"
    echo "  Port: $PORT"
    echo "  Health Check: http://localhost:${PORT}/health"
    echo "  API Endpoint: http://localhost:${PORT}/v1/chat/completions"
    echo
    echo -e "${BLUE}Useful Commands:${NC}"
    echo "  View logs: docker logs -f $container_name"
    echo "  Stop container: docker stop $container_name"
    echo "  Start container: docker start $container_name"
    echo "  Remove container: docker rm -f $container_name"
    echo
    echo -e "${BLUE}Test the API:${NC}"
    echo "  curl -X POST http://localhost:${PORT}/v1/chat/completions \\"
    echo "    -H 'Content-Type: application/json' \\"
    echo "    -d '{\"messages\": [{\"role\": \"user\", \"content\": \"Hello!\"}], \"max_tokens\": 100}'"
    echo
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --model)
            MODEL_NAME="$2"
            shift 2
            ;;
        --port)
            PORT="$2"
            shift 2
            ;;
        --gpu-count)
            GPU_COUNT="$2"
            shift 2
            ;;
        --registry)
            CONTAINER_REGISTRY="$2"
            shift 2
            ;;
        --tag)
            CONTAINER_TAG="$2"
            shift 2
            ;;
        --no-health-check)
            ENABLE_HEALTH_CHECK=false
            shift
            ;;
        --no-monitoring)
            ENABLE_MONITORING=false
            shift
            ;;
        --help)
            show_usage
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            show_usage
            exit 1
            ;;
    esac
done

# Validate required parameters
if [[ -z "$MODEL_NAME" ]]; then
    print_error "Model name is required. Use --model MODEL_NAME"
    show_usage
    exit 1
fi

# Main deployment process
main() {
    print_header
    print_status "Starting deployment of $MODEL_NAME on port $PORT"
    
    check_system_requirements
    check_existing_container
    pull_container_image
    run_container
    verify_deployment
    show_deployment_info
    
    print_status "Deployment completed! 🚀"
}

# Run main function
main "$@" 