# AI Playground Container Deployment

The **simplest way** to deploy AI models on AMD Instinct GPUs with pre-built containers. No manual installation required!

## 🚀 Quick Start (1 Command)

```bash
# Deploy any model with one command
./quick-start.sh gpt2 1234

# Or use the full deployment script
./deploy-container.sh --model "microsoft/DialoGPT-medium" --port 8080
```

## ✨ Features

- **Pre-built ROCm Environment**: No manual ROCm installation needed
- **Model Pre-optimized**: Models are pre-downloaded and optimized for AMD Instinct
- **Automatic GPU Detection**: Automatically detects and configures AMD Instinct GPUs
- **Health Monitoring**: Built-in health checks and monitoring
- **Production Ready**: Load balancing, logging, and restart policies
- **One-Click Deployment**: Single command to deploy any model

## 📋 Prerequisites

- AMD Instinct GPU (MI50, MI60, MI100, MI200, MI300)
- Ubuntu 20.04/22.04 or RHEL 8/9
- Docker installed
- 32GB+ system RAM
- 100GB+ free disk space

## 🛠️ Installation

### 1. Install Docker (if not already installed)

```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Log out and back in, or run:
newgrp docker
```

### 2. Download Deployment Scripts

```bash
git clone https://github.com/your-repo/ai-playground.git
cd ai-playground/deployment-scripts
chmod +x *.sh
```

## 🚀 Deployment Methods

### Method 1: Quick Start (Recommended)

The absolute simplest way to deploy:

```bash
# Deploy GPT-2 on port 1234
./quick-start.sh gpt2 1234

# Deploy DialoGPT on port 8080
./quick-start.sh microsoft/DialoGPT-medium 8080

# Deploy Llama2 on port 9000
./quick-start.sh meta-llama/Llama-2-7b-chat-hf 9000
```

### Method 2: Full Deployment Script

More control and options:

```bash
# Basic deployment
./deploy-container.sh --model "gpt2" --port 1234

# Advanced deployment
./deploy-container.sh \
  --model "microsoft/DialoGPT-medium" \
  --port 8080 \
  --gpu-count 2 \
  --registry "my-registry" \
  --tag "v1.0"
```

### Method 3: Docker Compose

For production deployments with monitoring:

```bash
# Copy environment file
cp env.example .env

# Edit configuration
nano .env

# Deploy with Docker Compose
docker-compose up -d

# Deploy with monitoring
docker-compose --profile monitoring up -d

# Deploy with load balancer
docker-compose --profile load-balancer up -d
```

## 📊 Available Models

The container system supports any Hugging Face model:

### Text Generation Models
- `gpt2` - OpenAI's GPT-2
- `microsoft/DialoGPT-medium` - Microsoft's conversational model
- `EleutherAI/gpt-neo-125M` - EleutherAI's GPT-Neo
- `facebook/opt-125m` - Meta's OPT model

### Large Language Models
- `meta-llama/Llama-2-7b-chat-hf` - Meta's Llama 2 (requires access)
- `tiiuae/falcon-7b` - Technology Innovation Institute's Falcon
- `microsoft/DialoGPT-large` - Large conversational model

### Custom Models
- Any model from Hugging Face Hub
- Local models (mounted as volumes)
- Fine-tuned models

## 🔧 Configuration

### Environment Variables

Create a `.env` file or set environment variables:

```bash
# Model Configuration
MODEL_NAME=gpt2
PORT=1234
GPU_COUNT=1
MAX_MEMORY=16GB VRAM, 32GB RAM

# Container Registry
CONTAINER_REGISTRY=your-registry
CONTAINER_TAG=latest

# Features
ENABLE_HEALTH_CHECK=true
ENABLE_MONITORING=true
LOG_LEVEL=INFO
```

### Docker Compose Configuration

```yaml
version: '3.8'
services:
  ai-playground:
    image: your-registry/ai-playground:${MODEL_NAME}-rocm
    ports:
      - "${PORT}:1234"
    environment:
      - MODEL_NAME=${MODEL_NAME}
      - GPU_COUNT=${GPU_COUNT}
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: ${GPU_COUNT}
              capabilities: [gpu]
```

## 🔍 Monitoring and Management

### Health Checks

```bash
# Check if service is healthy
curl http://localhost:1234/health

# Response:
{
  "status": "healthy",
  "model": "gpt2",
  "gpu_available": true,
  "gpu_count": 1
}
```

### Container Management

```bash
# View logs
docker logs -f ai-playground-gpt2

# Stop container
docker stop ai-playground-gpt2

# Start container
docker start ai-playground-gpt2

# Restart container
docker restart ai-playground-gpt2

# Remove container
docker rm -f ai-playground-gpt2
```

### Performance Monitoring

```bash
# Monitor container resources
docker stats ai-playground-gpt2

# Monitor GPU usage
docker exec ai-playground-gpt2 rocm-smi

# Monitor in real-time
watch -n 1 'docker exec ai-playground-gpt2 rocm-smi'
```

## 🧪 Testing the API

### Basic Inference

```bash
curl -X POST http://localhost:1234/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"role": "user", "content": "Hello!"}],
    "max_tokens": 100
  }'
```

### Advanced Inference

```bash
curl -X POST http://localhost:1234/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "system", "content": "You are a helpful assistant."},
      {"role": "user", "content": "What is artificial intelligence?"}
    ],
    "max_tokens": 200,
    "temperature": 0.7,
    "top_p": 0.9
  }'
```

## 🏗️ Production Deployment

### Load Balancing

Deploy multiple instances behind a load balancer:

```bash
# Deploy 3 instances
for i in {1..3}; do
  ./deploy-container.sh \
    --model "gpt2" \
    --port $((1233 + $i)) \
    --gpu-count 1
done

# Configure nginx load balancer
docker-compose --profile load-balancer up -d
```

### Monitoring Stack

Enable comprehensive monitoring:

```bash
# Deploy with monitoring
docker-compose --profile monitoring up -d

# Access Grafana
# URL: http://localhost:3000
# Username: admin
# Password: admin
```

### High Availability

```bash
# Deploy with restart policies
docker run -d \
  --name ai-playground-gpt2 \
  --restart unless-stopped \
  --gpus all \
  -p 1234:1234 \
  your-registry/ai-playground:gpt2-rocm
```

## 🔧 Troubleshooting

### Common Issues

#### Container Won't Start

```bash
# Check container logs
docker logs ai-playground-gpt2

# Check if GPU is detected
lspci | grep -i amd

# Check Docker GPU support
docker run --rm --gpus all nvidia/cuda:11.0-base nvidia-smi
```

#### Model Loading Issues

```bash
# Check model download
docker exec ai-playground-gpt2 ls -la /app/models

# Check disk space
df -h

# Check memory usage
free -h
```

#### Performance Issues

```bash
# Check GPU utilization
docker exec ai-playground-gpt2 rocm-smi

# Check container resources
docker stats ai-playground-gpt2

# Check system resources
htop
```

### Debug Mode

Run container in debug mode:

```bash
docker run -it --rm \
  --gpus all \
  -p 1234:1234 \
  -e MODEL_NAME=gpt2 \
  -e DEBUG=true \
  your-registry/ai-playground:gpt2-rocm bash
```

## 📈 Performance Optimization

### GPU Memory Optimization

```bash
# Use quantization for large models
docker run -d \
  --name ai-playground-llama2 \
  --gpus all \
  -p 1234:1234 \
  -e MODEL_NAME=meta-llama/Llama-2-7b-chat-hf \
  -e QUANTIZATION=int8 \
  your-registry/ai-playground:llama2-rocm
```

### Multi-GPU Deployment

```bash
# Deploy with multiple GPUs
./deploy-container.sh \
  --model "gpt2" \
  --gpu-count 2 \
  --port 1234
```

### Batch Processing

```bash
# Enable batch processing
docker run -d \
  --name ai-playground-gpt2 \
  --gpus all \
  -p 1234:1234 \
  -e MODEL_NAME=gpt2 \
  -e BATCH_SIZE=4 \
  your-registry/ai-playground:gpt2-rocm
```

## 🔒 Security

### Network Security

```bash
# Deploy with custom network
docker network create ai-network

docker run -d \
  --name ai-playground-gpt2 \
  --network ai-network \
  --gpus all \
  -p 127.0.0.1:1234:1234 \
  your-registry/ai-playground:gpt2-rocm
```

### Resource Limits

```bash
# Set resource limits
docker run -d \
  --name ai-playground-gpt2 \
  --gpus all \
  --memory=32g \
  --cpus=8 \
  -p 1234:1234 \
  your-registry/ai-playground:gpt2-rocm
```

## 📚 Examples

### Complete Deployment Example

```bash
#!/bin/bash

# Deploy GPT-2 with monitoring
echo "Deploying GPT-2..."

# Deploy the model
./deploy-container.sh --model "gpt2" --port 1234

# Wait for startup
sleep 30

# Test the API
curl -X POST http://localhost:1234/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"role": "user", "content": "Hello, how are you?"}],
    "max_tokens": 50
  }'

echo "Deployment complete!"
```

### Production Deployment Example

```bash
#!/bin/bash

# Production deployment with monitoring and load balancing

# Deploy multiple instances
for i in {1..3}; do
  ./deploy-container.sh \
    --model "gpt2" \
    --port $((1233 + $i)) \
    --gpu-count 1
done

# Deploy monitoring
docker-compose --profile monitoring up -d

# Deploy load balancer
docker-compose --profile load-balancer up -d

echo "Production deployment complete!"
```

## 🤝 Support

### Getting Help

- **Documentation**: Check the Documentation tab in the deployment guide
- **Issues**: Report issues on GitHub
- **Community**: Join the AMD ROCm community forum

### Useful Commands

```bash
# Get help
./deploy-container.sh --help

# Check system requirements
./deploy-container.sh --model test --check-only

# Update container
docker pull your-registry/ai-playground:gpt2-rocm

# Backup configuration
docker cp ai-playground-gpt2:/app/config ./backup/
```

## 🎯 Next Steps

1. **Deploy your first model**: Use `./quick-start.sh gpt2 1234`
2. **Customize configuration**: Edit the `.env` file
3. **Add monitoring**: Enable Grafana monitoring
4. **Scale up**: Deploy multiple instances
5. **Optimize performance**: Tune GPU and memory settings

---

**Happy deploying! 🚀**

The containerized deployment system makes it incredibly easy to deploy AI models on AMD Instinct GPUs with minimal setup and maximum performance. 