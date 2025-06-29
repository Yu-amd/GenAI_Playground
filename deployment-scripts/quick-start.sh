#!/bin/bash

# AI Playground Quick Start Script
# The simplest way to deploy an AI model with AMD Instinct GPUs

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}  AI Playground Quick Start${NC}"
    echo -e "${BLUE}================================${NC}"
}

# Default values
MODEL_NAME=${1:-"gpt2"}
PORT=${2:-1234}

# Validate input
if [[ -z "$MODEL_NAME" ]]; then
    echo "Usage: $0 [MODEL_NAME] [PORT]"
    echo "Example: $0 gpt2 1234"
    echo "Example: $0 microsoft/DialoGPT-medium 8080"
    exit 1
fi

print_header
print_status "Starting quick deployment of $MODEL_NAME on port $PORT"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_warning "Docker not found. Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    print_status "Docker installed. Please log out and back in, then run this script again."
    exit 0
fi

# Check if user is in docker group
if ! groups $USER | grep -q docker; then
    print_warning "Adding user to docker group..."
    sudo usermod -aG docker $USER
    print_status "Please log out and back in, or run: newgrp docker"
    print_status "Then run this script again."
    exit 0
fi

# Create .env file
print_status "Creating configuration file..."
cat > .env << EOF
MODEL_NAME=$MODEL_NAME
PORT=$PORT
GPU_COUNT=1
MAX_MEMORY=16GB VRAM, 32GB RAM
ENABLE_HEALTH_CHECK=true
ENABLE_MONITORING=true
LOG_LEVEL=INFO
EOF

# Check if container is already running
CONTAINER_NAME="ai-playground-${MODEL_NAME//\//-}"
if docker ps -q -f name="$CONTAINER_NAME" | grep -q .; then
    print_warning "Container $CONTAINER_NAME is already running."
    read -p "Do you want to stop and restart it? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_status "Stopping existing container..."
        docker stop "$CONTAINER_NAME" || true
        docker rm "$CONTAINER_NAME" || true
    else
        print_status "Container is already running at http://localhost:$PORT"
        exit 0
    fi
fi

# Deploy using the container script
print_status "Deploying model..."
./deploy-container.sh --model "$MODEL_NAME" --port "$PORT"

print_status "Quick deployment completed! 🚀"
echo
echo -e "${BLUE}Your model is now available at:${NC}"
echo "  Health Check: http://localhost:$PORT/health"
echo "  API Endpoint: http://localhost:$PORT/v1/chat/completions"
echo
echo -e "${BLUE}Test it with:${NC}"
echo "  curl -X POST http://localhost:$PORT/v1/chat/completions \\"
echo "    -H 'Content-Type: application/json' \\"
echo "    -d '{\"messages\": [{\"role\": \"user\", \"content\": \"Hello!\"}], \"max_tokens\": 100}'"
echo
echo -e "${BLUE}To stop:${NC}"
echo "  docker stop $CONTAINER_NAME"
echo
echo -e "${BLUE}To view logs:${NC}"
echo "  docker logs -f $CONTAINER_NAME" 