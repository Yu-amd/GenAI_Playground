import React, { useState } from 'react';
import { 
  ComputerDesktopIcon, 
  CloudIcon, 
  ServerIcon, 
  CubeIcon,
  InformationCircleIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

interface DeploymentGuideProps {
  isOpen: boolean;
  onClose: () => void;
  modelInfo?: {
    name: string;
    size: string;
    requirements: string;
  };
}

const DeploymentGuide: React.FC<DeploymentGuideProps> = ({ 
  isOpen, 
  onClose, 
  modelInfo = {
    name: 'Your Model',
    size: '7B',
    requirements: '16GB VRAM, 32GB RAM'
  }
}) => {
  const [activeTab, setActiveTab] = useState('manual');

  if (!isOpen) return null;

  const tabs = [
    { id: 'manual', name: 'Manual Install', icon: ComputerDesktopIcon },
    { id: 'container', name: 'Container Deploy', icon: CubeIcon },
    { id: 'aws', name: 'AWS EC2', icon: CloudIcon },
    { id: 'azure', name: 'Azure VM', icon: CloudIcon },
    { id: 'amd-cloud', name: 'AMD Developer Cloud', icon: CloudIcon },
    { id: 'kubernetes', name: 'Kubernetes', icon: CubeIcon },
    { id: 'docs', name: 'Documentation', icon: DocumentTextIcon }
  ];

  const renderManualInstall = () => (
    <div className="space-y-6">
      <div className="bg-blue-600/10 border border-blue-500/20 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-300 mb-2">Manual Installation (On-Premises)</h3>
        <p className="text-sm text-gray-300 mb-3">
          Traditional installation with manual ROCm setup, dependency installation, and model configuration. 
          Use this if you prefer full control over the environment or need custom configurations.
        </p>
        <ul className="text-sm text-gray-300 space-y-1">
          <li>• Manual ROCm installation and configuration</li>
          <li>• Step-by-step dependency installation</li>
          <li>• Full control over system environment</li>
          <li>• Custom model optimization options</li>
          <li>• Suitable for production environments with specific requirements</li>
        </ul>
      </div>
      <div className="bg-blue-600/10 border border-blue-500/20 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-300 mb-2">AMD Instinct GPU Requirements</h3>
        <ul className="text-sm text-gray-300 space-y-1">
          <li>• AMD Instinct MI series GPU (MI50, MI60, MI100, MI200, MI300)</li>
          <li>• ROCm 5.x or later</li>
          <li>• Ubuntu 20.04/22.04 or RHEL 8/9</li>
          <li>• 32GB+ system RAM</li>
          <li>• 100GB+ free disk space</li>
        </ul>
      </div>
      <div className="bg-yellow-600/10 border border-yellow-500/20 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-yellow-300 mb-2">System Preparation</h3>
        <div className="space-y-3">
          <div>
            <h4 className="font-medium text-gray-300 mb-2">Check AMD GPU</h4>
            <pre className="bg-gray-900 p-3 rounded text-sm overflow-x-auto">
{`# Check if AMD GPU is detected
lspci | grep -i amd

# Check GPU memory
rocm-smi --showproductname
rocm-smi --showmeminfo`}
            </pre>
          </div>
          <div>
            <h4 className="font-medium text-gray-300 mb-2">Install ROCm</h4>
            <pre className="bg-gray-900 p-3 rounded text-sm overflow-x-auto">
{`# Add ROCm repository
wget https://repo.radeon.com/amdgpu-install/5.7.3/ubuntu/jammy/amdgpu-install_5.7.3.50703-1_all.deb
sudo apt install ./amdgpu-install_5.7.3.50703-1_all.deb

# Install ROCm
sudo amdgpu-install --usecase=hiplibsdk,rocm

# Add user to video group
sudo usermod -a -G video $LOGNAME

# Reboot system
sudo reboot`}
            </pre>
          </div>
        </div>
      </div>
      <div className="bg-green-600/10 border border-green-500/20 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-green-300 mb-2">Install Dependencies</h3>
        <pre className="bg-gray-900 p-4 rounded-lg text-sm overflow-x-auto">
{`# Update system
sudo apt update && sudo apt upgrade -y

# Install Python and pip
sudo apt install python3 python3-pip python3-venv -y

# Install system dependencies
sudo apt install git curl wget build-essential cmake -y

# Install Docker (optional)
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER`}
        </pre>
      </div>
      <div className="bg-blue-600/10 border border-blue-500/20 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-300 mb-2">Setup Model Environment</h3>
        <pre className="bg-gray-900 p-4 rounded-lg text-sm overflow-x-auto">
{`# Create project directory
mkdir -p ~/ai-playground
cd ~/ai-playground

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install PyTorch with ROCm support
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/rocm5.6

# Install other dependencies
pip install transformers accelerate bitsandbytes
pip install flask fastapi uvicorn

# Verify ROCm installation
python3 -c "import torch; print(f'PyTorch: {torch.__version__}'); print(f'ROCm available: {torch.backends.mps.is_available()}')"`}
        </pre>
      </div>
      <div className="bg-yellow-600/10 border border-yellow-500/20 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-yellow-300 mb-2">Download and Setup Model</h3>
        <pre className="bg-gray-900 p-4 rounded-lg text-sm overflow-x-auto">
{`# Clone the playground repository
git clone https://github.com/your-repo/ai-playground.git
cd ai-playground

# Download model (example for ${modelInfo.name})
python3 -c "
from transformers import AutoTokenizer, AutoModelForCausalLM
model_name = '${modelInfo.name}'
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(
    model_name,
    torch_dtype=torch.float16,
    device_map='auto'
)
model.save_pretrained('./models/${modelInfo.name}')
tokenizer.save_pretrained('./models/${modelInfo.name}')
"`}
        </pre>
      </div>
      <div className="bg-green-600/10 border border-green-500/20 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-green-300 mb-2">Start Inference Server</h3>
        <pre className="bg-gray-900 p-4 rounded-lg text-sm overflow-x-auto">
{`# Create server script
cat > server.py << 'EOF'
from transformers import AutoTokenizer, AutoModelForCausalLM
import torch
from flask import Flask, request, jsonify

app = Flask(__name__)

# Load model
model_name = './models/${modelInfo.name}'
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(
    model_name,
    torch_dtype=torch.float16,
    device_map='auto'
)

@app.route('/v1/chat/completions', methods=['POST'])
def chat_completion():
    data = request.json
    messages = data.get('messages', [])
    
    # Format messages for model
    prompt = tokenizer.apply_chat_template(messages, tokenize=False)
    inputs = tokenizer(prompt, return_tensors='pt').to(model.device)
    
    # Generate response
    with torch.no_grad():
        outputs = model.generate(
            **inputs,
            max_new_tokens=512,
            temperature=0.7,
            do_sample=True
        )
    
    response = tokenizer.decode(outputs[0][inputs['input_ids'].shape[1]:], skip_special_tokens=True)
    
    return jsonify({
        'choices': [{
            'message': {'content': response, 'role': 'assistant'},
            'finish_reason': 'stop'
        }]
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=1234)
EOF

# Start server
python3 server.py`}
        </pre>
      </div>
      <div className="bg-blue-600/10 border border-blue-500/20 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-300 mb-2">Quick Deploy Script</h3>
        <p className="text-sm text-gray-300 mb-3">
          Use our automated deployment script for quick setup:
        </p>
        <pre className="bg-gray-900 p-3 rounded text-sm overflow-x-auto">
{`# Download and run deployment script
curl -fsSL https://raw.githubusercontent.com/your-repo/ai-playground/main/deployment-scripts/deploy-onprem.sh | bash`}
        </pre>
      </div>
    </div>
  );

  const renderContainer = () => (
    <div className="space-y-6">
      <div className="bg-green-600/10 border border-green-500/20 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-green-300 mb-2">🚀 Container Deployment (Recommended)</h3>
        <p className="text-sm text-gray-300 mb-3">
          The fastest way to deploy {modelInfo.name} using pre-built containers. 
          Works on-premises, cloud, or anywhere with Docker. No manual ROCm installation required!
        </p>
        <ul className="text-sm text-gray-300 space-y-1">
          <li>• Pre-configured ROCm environment in container</li>
          <li>• Model pre-downloaded and optimized</li>
          <li>• Automatic GPU detection and setup</li>
          <li>• Ready-to-use inference API</li>
          <li>• Health monitoring included</li>
          <li>• Works on-premises, AWS, Azure, or any Linux system</li>
        </ul>
        <div className="mt-3 p-3 bg-yellow-600/10 rounded border border-yellow-500/20">
          <h4 className="font-medium text-yellow-300 mb-2">💡 When to Use Each Method:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong className="text-green-300">Container Deploy:</strong>
              <ul className="text-gray-300 mt-1 space-y-1">
                <li>• Quick deployment and testing</li>
                <li>• Standard environments</li>
                <li>• Production with monitoring</li>
                <li>• Multi-instance deployments</li>
              </ul>
            </div>
            <div>
              <strong className="text-blue-300">Manual Install:</strong>
              <ul className="text-gray-300 mt-1 space-y-1">
                <li>• Custom configurations</li>
                <li>• Specific ROCm versions</li>
                <li>• Performance optimization</li>
                <li>• Air-gapped environments</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-600/10 border border-blue-500/20 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-300 mb-2">📥 Download Deployment Scripts</h3>
        <p className="text-sm text-gray-300 mb-3">
          First, download the deployment scripts to your server:
        </p>
        <pre className="bg-gray-900 p-4 rounded-lg text-sm overflow-x-auto">
{`# Clone the repository
git clone https://github.com/your-repo/ai-playground.git
cd ai-playground/deployment-scripts

# Make scripts executable
chmod +x *.sh

# Verify scripts are available
ls -la *.sh`}
        </pre>
        <div className="mt-3 text-sm text-gray-400">
          <strong>Available Scripts:</strong>
          <ul className="mt-2 space-y-1">
            <li>• <code>quick-start.sh</code> - Simplest one-command deployment</li>
            <li>• <code>deploy-container.sh</code> - Full-featured deployment script</li>
            <li>• <code>docker-compose.yml</code> - Production orchestration</li>
            <li>• <code>env.example</code> - Configuration template</li>
          </ul>
        </div>
      </div>

      <div className="bg-blue-600/10 border border-blue-500/20 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-300 mb-2">Prerequisites</h3>
        <div className="space-y-3">
          <div>
            <h4 className="font-medium text-gray-300 mb-2">System Requirements</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• AMD Instinct GPU (MI50, MI60, MI100, MI200, MI300)</li>
              <li>• Ubuntu 20.04/22.04 or RHEL 8/9</li>
              <li>• Docker installed</li>
              <li>• 32GB+ system RAM</li>
              <li>• 100GB+ free disk space</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-300 mb-2">Install Docker</h4>
            <pre className="bg-gray-900 p-3 rounded text-sm overflow-x-auto">
{`# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Log out and back in, or run:
newgrp docker

# Verify installation
docker --version`}
            </pre>
          </div>
        </div>
      </div>

      <div className="bg-yellow-600/10 border border-yellow-500/20 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-yellow-300 mb-2">Quick Deploy Script</h3>
        <p className="text-sm text-gray-300 mb-3">
          Run this single command to deploy everything:
        </p>
        <pre className="bg-gray-900 p-4 rounded-lg text-sm overflow-x-auto">
{`# Navigate to deployment scripts directory
cd ai-playground/deployment-scripts

# Deploy with one command
./quick-start.sh "${modelInfo.name}" 1234`}
        </pre>
        <div className="mt-3 text-sm text-gray-400">
          <strong>What this does:</strong>
          <ul className="mt-2 space-y-1">
            <li>• Downloads the pre-built container image</li>
            <li>• Sets up GPU access and networking</li>
            <li>• Starts the inference server</li>
            <li>• Configures health monitoring</li>
            <li>• Opens the API endpoint</li>
          </ul>
        </div>
        <div className="mt-3 p-3 bg-blue-600/10 rounded border border-blue-500/20">
          <h4 className="font-medium text-blue-300 mb-2">Alternative: Direct Download</h4>
          <p className="text-sm text-gray-300 mb-2">
            If you don't want to clone the full repository, you can download just the scripts:
          </p>
          <pre className="bg-gray-900 p-3 rounded text-sm overflow-x-auto">
{`# Download scripts directly
curl -fsSL https://raw.githubusercontent.com/your-repo/ai-playground/main/deployment-scripts/quick-start.sh -o quick-start.sh
curl -fsSL https://raw.githubusercontent.com/your-repo/ai-playground/main/deployment-scripts/deploy-container.sh -o deploy-container.sh
chmod +x *.sh

# Run deployment
./quick-start.sh "${modelInfo.name}" 1234`}
          </pre>
        </div>
      </div>

      <div className="bg-green-600/10 border border-green-500/20 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-green-300 mb-2">Manual Container Deployment</h3>
        <div className="space-y-3">
          <div>
            <h4 className="font-medium text-gray-300 mb-2">Using Full Deployment Script</h4>
            <pre className="bg-gray-900 p-4 rounded-lg text-sm overflow-x-auto">
{`# Navigate to scripts directory
cd ai-playground/deployment-scripts

# Deploy with full options
./deploy-container.sh \\
  --model "${modelInfo.name}" \\
  --port 1234 \\
  --gpu-count 1`}
            </pre>
          </div>
          <div>
            <h4 className="font-medium text-gray-300 mb-2">Using Docker Compose (Recommended for Production)</h4>
            <pre className="bg-gray-900 p-4 rounded-lg text-sm overflow-x-auto">
{`# Navigate to scripts directory
cd ai-playground/deployment-scripts

# Copy environment template
cp env.example .env

# Edit configuration
nano .env

# Deploy with Docker Compose
docker-compose up -d

# Deploy with monitoring
docker-compose --profile monitoring up -d`}
            </pre>
          </div>
        </div>
      </div>

      <div className="bg-blue-600/10 border border-blue-500/20 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-300 mb-2">Verify Deployment</h3>
        <div className="space-y-3">
          <div>
            <h4 className="font-medium text-gray-300 mb-2">Check Container Status</h4>
            <pre className="bg-gray-900 p-3 rounded text-sm overflow-x-auto">
{`# Check if container is running
docker ps | grep ai-playground

# Check container logs
docker logs ai-playground-${modelInfo.name}

# Check GPU usage
docker exec ai-playground-${modelInfo.name} rocm-smi`}
            </pre>
          </div>
          <div>
            <h4 className="font-medium text-gray-300 mb-2">Test API Endpoint</h4>
            <pre className="bg-gray-900 p-3 rounded text-sm overflow-x-auto">
{`# Test health endpoint
curl http://localhost:1234/health

# Test inference
curl -X POST http://localhost:1234/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -d '{
    "messages": [{"role": "user", "content": "Hello!"}],
    "max_tokens": 100
  }'`}
            </pre>
          </div>
        </div>
      </div>

      <div className="bg-yellow-600/10 border border-yellow-500/20 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-yellow-300 mb-2">Container Management</h3>
        <div className="space-y-3">
          <div>
            <h4 className="font-medium text-gray-300 mb-2">Useful Commands</h4>
            <pre className="bg-gray-900 p-3 rounded text-sm overflow-x-auto">
{`# Stop the container
docker stop ai-playground-${modelInfo.name}

# Start the container
docker start ai-playground-${modelInfo.name}

# Restart the container
docker restart ai-playground-${modelInfo.name}

# Remove the container
docker rm -f ai-playground-${modelInfo.name}

# Update to latest version
docker pull your-registry/ai-playground:${modelInfo.name}-rocm
docker-compose down && docker-compose up -d`}
            </pre>
          </div>
          <div>
            <h4 className="font-medium text-gray-300 mb-2">Monitoring</h4>
            <pre className="bg-gray-900 p-3 rounded text-sm overflow-x-auto">
{`# Monitor container resources
docker stats ai-playground-${modelInfo.name}

# Monitor GPU usage
watch -n 1 'docker exec ai-playground-${modelInfo.name} rocm-smi'

# Check logs in real-time
docker logs -f ai-playground-${modelInfo.name}`}
            </pre>
          </div>
        </div>
      </div>

      <div className="bg-green-600/10 border border-green-500/20 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-green-300 mb-2">Production Deployment</h3>
        <div className="space-y-3">
          <div>
            <h4 className="font-medium text-gray-300 mb-2">Load Balancer Setup</h4>
            <pre className="bg-gray-900 p-4 rounded-lg text-sm overflow-x-auto">
{`# Navigate to scripts directory
cd ai-playground/deployment-scripts

# Deploy with load balancer
docker-compose --profile load-balancer up -d

# Or deploy multiple instances manually
for i in {1..3}; do
  ./deploy-container.sh \\
    --model "${modelInfo.name}" \\
    --port $((1233 + $i)) \\
    --gpu-count 1
done`}
            </pre>
          </div>
          <div>
            <h4 className="font-medium text-gray-300 mb-2">Monitoring Stack</h4>
            <pre className="bg-gray-900 p-4 rounded-lg text-sm overflow-x-auto">
{`# Navigate to scripts directory
cd ai-playground/deployment-scripts

# Deploy with monitoring
docker-compose --profile monitoring up -d

# Access Grafana dashboard
# URL: http://localhost:3000
# Username: admin
# Password: admin`}
            </pre>
          </div>
        </div>
      </div>

      <div className="bg-blue-600/10 border border-blue-500/20 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-300 mb-2">📚 Documentation</h3>
        <p className="text-sm text-gray-300 mb-3">
          For detailed documentation and troubleshooting:
        </p>
        <pre className="bg-gray-900 p-3 rounded text-sm overflow-x-auto">
{`# View detailed documentation
cat README_CONTAINER.md

# Or open in browser
xdg-open README_CONTAINER.md`}
        </pre>
        <div className="mt-3 text-sm text-gray-400">
          <strong>Documentation includes:</strong>
          <ul className="mt-2 space-y-1">
            <li>• Complete setup instructions</li>
            <li>• Troubleshooting guide</li>
            <li>• Performance optimization tips</li>
            <li>• Production deployment examples</li>
            <li>• Security best practices</li>
          </ul>
        </div>
      </div>
    </div>
  );

  const renderAWS = () => (
    <div className="space-y-6">
      <div className="bg-blue-600/10 border border-blue-500/20 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-300 mb-2">AWS AMD Instinct Instances</h3>
        <ul className="text-sm text-gray-300 space-y-1">
          <li>• g5g.xlarge - AMD EPYC + 1x AMD Instinct MI25</li>
          <li>• g5g.2xlarge - AMD EPYC + 1x AMD Instinct MI25</li>
          <li>• g5g.4xlarge - AMD EPYC + 1x AMD Instinct MI25</li>
          <li>• g5g.8xlarge - AMD EPYC + 1x AMD Instinct MI25</li>
          <li>• g5g.16xlarge - AMD EPYC + 1x AMD Instinct MI25</li>
        </ul>
      </div>
      <div className="bg-yellow-600/10 border border-yellow-500/20 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-yellow-300 mb-2">Launch EC2 Instance</h3>
        <div className="space-y-3">
          <div>
            <h4 className="font-medium text-gray-300 mb-2">Instance Configuration</h4>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>• Instance Type: g5g.xlarge (recommended for {modelInfo.name})</li>
              <li>• AMI: Ubuntu Server 22.04 LTS (HVM)</li>
              <li>• Storage: 100GB GP3 SSD</li>
              <li>• Security Group: Allow ports 22 (SSH), 1234 (API)</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-300 mb-2">Launch Command</h4>
            <pre className="bg-gray-900 p-3 rounded text-sm overflow-x-auto">
{`aws ec2 run-instances \
  --image-id ami-0c7217cdde317cfec \
  --count 1 \
  --instance-type g5g.xlarge \
  --key-name your-key-pair \
  --security-group-ids sg-xxxxxxxxx \
  --subnet-id subnet-xxxxxxxxx \
  --block-device-mappings '[{"DeviceName":"/dev/sda1","Ebs":{"VolumeSize":100,"VolumeType":"gp3"}}]' \
  --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=AI-Playground-AMD}]'`}
            </pre>
          </div>
        </div>
      </div>
      <div className="bg-green-600/10 border border-green-500/20 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-green-300 mb-2">Connect and Setup</h3>
        <pre className="bg-gray-900 p-4 rounded-lg text-sm overflow-x-auto">
{`# Connect to instance
ssh -i your-key.pem ubuntu@your-instance-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install ROCm (pre-installed on g5g instances)
sudo apt install rocm-hip-sdk

# Verify AMD GPU
rocm-smi --showproductname
rocm-smi --showmeminfo`}
        </pre>
      </div>
      <div className="bg-blue-600/10 border border-blue-500/20 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-300 mb-2">Deploy with Terraform</h3>
        <p className="text-sm text-gray-300 mb-3">
          Use our Terraform configuration for automated deployment:
        </p>
        <pre className="bg-gray-900 p-3 rounded text-sm overflow-x-auto">
{`# Clone repository
git clone https://github.com/your-repo/ai-playground.git
cd ai-playground/deployment-scripts/terraform

# Configure variables
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your settings

# Deploy
terraform init
terraform plan
terraform apply`}
        </pre>
      </div>
      <div className="bg-green-600/10 border border-green-500/20 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-green-300 mb-2">Quick Deploy Script</h3>
        <pre className="bg-gray-900 p-4 rounded-lg text-sm overflow-x-auto">
{`# Download and run AWS deployment script
curl -fsSL https://raw.githubusercontent.com/your-repo/ai-playground/main/deployment-scripts/deploy-aws.sh | bash

# Or run with custom parameters
./deploy-aws.sh --instance-type g5g.xlarge --model ${modelInfo.name}`}
        </pre>
      </div>
    </div>
  );

  const renderAzure = () => (
    <div className="space-y-6">
      <div className="bg-blue-600/10 border border-blue-500/20 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-300 mb-2">Azure AMD Instinct Instances</h3>
        <ul className="text-sm text-gray-300 space-y-1">
          <li>• Standard_NC4as_T4_v3 - 4 vCPUs, 14GB RAM, 1x AMD Instinct MI25</li>
          <li>• Standard_NC8as_T4_v3 - 8 vCPUs, 28GB RAM, 1x AMD Instinct MI25</li>
          <li>• Standard_NC16as_T4_v3 - 16 vCPUs, 56GB RAM, 1x AMD Instinct MI25</li>
          <li>• Standard_NC32as_T4_v3 - 32 vCPUs, 112GB RAM, 1x AMD Instinct MI25</li>
        </ul>
      </div>
      <div className="bg-yellow-600/10 border border-yellow-500/20 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-yellow-300 mb-2">Create VM with Azure CLI</h3>
        <pre className="bg-gray-900 p-4 rounded-lg text-sm overflow-x-auto">
{`# Create resource group
az group create --name ai-playground-rg --location eastus

# Create VM with AMD GPU
az vm create \
  --resource-group ai-playground-rg \
  --name ai-playground-amd \
  --image Canonical:0001-com-ubuntu-server-jammy:22_04-lts:latest \
  --size Standard_NC4as_T4_v3 \
  --admin-username azureuser \
  --generate-ssh-keys \
  --custom-data cloud-init.yaml`}
        </pre>
      </div>
      <div className="bg-green-600/10 border border-green-500/20 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-green-300 mb-2">Cloud Init Configuration</h3>
        <pre className="bg-gray-900 p-4 rounded-lg text-sm overflow-x-auto">
{`# cloud-init.yaml
#cloud-config
package_update: true
package_upgrade: true
packages:
  - python3
  - python3-pip
  - git
  - curl
  - rocm-hip-sdk

runcmd:
  - usermod -a -G video azureuser
  - curl -fsSL https://raw.githubusercontent.com/your-repo/ai-playground/main/deployment-scripts/deploy-onprem.sh | bash`}
        </pre>
      </div>
    </div>
  );

  const renderAMDCloud = () => (
    <div className="space-y-6">
      <div className="bg-blue-600/10 border border-blue-500/20 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-300 mb-2">AMD Developer Cloud</h3>
        <p className="text-sm text-gray-300 mb-3">
          AMD's own cloud platform with optimized AMD Instinct GPU instances. 
          Pre-configured with ROCm and development tools for the best AMD GPU performance.
        </p>
        <ul className="text-sm text-gray-300 space-y-1">
          <li>• Native AMD Instinct GPU instances</li>
          <li>• Pre-installed ROCm environment</li>
          <li>• Optimized for AMD hardware</li>
          <li>• Developer-friendly tools and SDKs</li>
          <li>• Pay-as-you-go pricing</li>
        </ul>
      </div>

      <div className="bg-yellow-600/10 border border-yellow-500/20 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-yellow-300 mb-2">Available Instances</h3>
        <div className="space-y-3">
          <div>
            <h4 className="font-medium text-gray-300 mb-2">AMD Instinct GPU Instances</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• MI25 instances - 16GB HBM2 memory</li>
              <li>• MI50 instances - 32GB HBM2 memory</li>
              <li>• MI60 instances - 32GB HBM2 memory</li>
              <li>• MI100 instances - 32GB HBM2 memory</li>
              <li>• MI200 instances - 128GB HBM2e memory</li>
              <li>• MI300 instances - 192GB HBM3 memory</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-300 mb-2">Instance Specifications</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• AMD EPYC processors</li>
              <li>• Ubuntu 20.04/22.04 LTS</li>
              <li>• ROCm 5.x pre-installed</li>
              <li>• PyTorch with ROCm support</li>
              <li>• Development tools and compilers</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-green-600/10 border border-green-500/20 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-green-300 mb-2">Create AMD Developer Cloud Instance</h3>
        <div className="space-y-3">
          <div>
            <h4 className="font-medium text-gray-300 mb-2">Sign Up and Access</h4>
            <pre className="bg-gray-900 p-3 rounded text-sm overflow-x-auto">
{`# Visit AMD Developer Cloud
https://www.amd.com/en/developer/cloud.html

# Sign up for AMD Developer Cloud account
# Verify your account and add payment method

# Access the cloud console
# Navigate to VM instances section`}
            </pre>
          </div>
          <div>
            <h4 className="font-medium text-gray-300 mb-2">Launch Instance</h4>
            <pre className="bg-gray-900 p-4 rounded-lg text-sm overflow-x-auto">
{`# Select instance type based on model requirements
# For ${modelInfo.name} (${modelInfo.size}), recommended:

# Small models (< 7B parameters):
# - MI25 instance: 16GB VRAM
# - 4 vCPUs, 16GB RAM, 100GB storage

# Medium models (7B-30B parameters):
# - MI50/MI60 instance: 32GB VRAM  
# - 8 vCPUs, 32GB RAM, 200GB storage

# Large models (> 30B parameters):
# - MI200/MI300 instance: 128GB+ VRAM
# - 16+ vCPUs, 64GB+ RAM, 500GB+ storage

# Select Ubuntu 22.04 LTS with ROCm 5.x
# Choose your preferred region
# Launch the instance`}
            </pre>
          </div>
        </div>
      </div>

      <div className="bg-blue-600/10 border border-blue-500/20 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-300 mb-2">Connect and Setup</h3>
        <div className="space-y-3">
          <div>
            <h4 className="font-medium text-gray-300 mb-2">SSH Connection</h4>
            <pre className="bg-gray-900 p-3 rounded text-sm overflow-x-auto">
{`# Connect to your AMD Developer Cloud instance
ssh ubuntu@your-instance-ip

# Verify AMD GPU and ROCm installation
lspci | grep -i amd
rocm-smi

# Check PyTorch ROCm support
python3 -c "import torch; print(f'PyTorch: {torch.__version__}'); print(f'ROCm available: {torch.backends.mps.is_available()}')"`}
            </pre>
          </div>
          <div>
            <h4 className="font-medium text-gray-300 mb-2">Install Dependencies</h4>
            <pre className="bg-gray-900 p-3 rounded text-sm overflow-x-auto">
{`# Update system
sudo apt update && sudo apt upgrade -y

# Install additional dependencies
sudo apt install -y git curl wget build-essential

# Install Python packages
pip3 install transformers accelerate bitsandbytes
pip3 install flask fastapi uvicorn

# Verify installation
python3 -c "import transformers; print('Transformers installed successfully')"`}
            </pre>
          </div>
        </div>
      </div>

      <div className="bg-yellow-600/10 border border-yellow-500/20 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-yellow-300 mb-2">Deploy Model</h3>
        <div className="space-y-3">
          <div>
            <h4 className="font-medium text-gray-300 mb-2">Quick Deploy with Scripts</h4>
            <pre className="bg-gray-900 p-4 rounded-lg text-sm overflow-x-auto">
{`# Download deployment scripts
git clone https://github.com/your-repo/ai-playground.git
cd ai-playground/deployment-scripts

# Make scripts executable
chmod +x *.sh

# Deploy using container method (recommended)
./quick-start.sh "${modelInfo.name}" 1234

# Or deploy using manual method
./deploy-onprem.sh`}
            </pre>
          </div>
          <div>
            <h4 className="font-medium text-gray-300 mb-2">Manual Model Setup</h4>
            <pre className="bg-gray-900 p-4 rounded-lg text-sm overflow-x-auto">
{`# Create project directory
mkdir -p ~/ai-playground
cd ~/ai-playground

# Download and setup model
python3 -c "
from transformers import AutoTokenizer, AutoModelForCausalLM
import torch

model_name = '${modelInfo.name}'
print(f'Downloading {model_name}...')

tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(
    model_name,
    torch_dtype=torch.float16,
    device_map='auto'
)

print('Model loaded successfully!')
"`}
            </pre>
          </div>
        </div>
      </div>

      <div className="bg-green-600/10 border border-green-500/20 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-green-300 mb-2">Start Inference Server</h3>
        <pre className="bg-gray-900 p-4 rounded-lg text-sm overflow-x-auto">
{`# Create server script
cat > server.py << 'EOF'
from transformers import AutoTokenizer, AutoModelForCausalLM
import torch
from flask import Flask, request, jsonify
import os

app = Flask(__name__)

# Load model
model_name = '${modelInfo.name}'
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(
    model_name,
    torch_dtype=torch.float16,
    device_map='auto'
)

if tokenizer.pad_token is None:
    tokenizer.pad_token = tokenizer.eos_token

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'model': model_name,
        'gpu_available': torch.cuda.is_available(),
        'gpu_count': torch.cuda.device_count() if torch.cuda.is_available() else 0
    })

@app.route('/v1/chat/completions', methods=['POST'])
def chat_completion():
    try:
        data = request.json
        messages = data.get('messages', [])
        max_tokens = data.get('max_tokens', 100)
        temperature = data.get('temperature', 0.7)
        
        # Format messages for model
        if hasattr(tokenizer, 'apply_chat_template'):
            prompt = tokenizer.apply_chat_template(messages, tokenize=False)
        else:
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
    port = int(os.getenv('PORT', 1234))
    app.run(host='0.0.0.0', port=port, debug=False)
EOF

# Start server
python3 server.py`}
        </pre>
      </div>

      <div className="bg-blue-600/10 border border-blue-500/20 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-300 mb-2">Test and Monitor</h3>
        <div className="space-y-3">
          <div>
            <h4 className="font-medium text-gray-300 mb-2">Test API Endpoint</h4>
            <pre className="bg-gray-900 p-3 rounded text-sm overflow-x-auto">
{`# Test health endpoint
curl http://localhost:1234/health

# Test inference
curl -X POST http://localhost:1234/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -d '{
    "messages": [{"role": "user", "content": "Hello!"}],
    "max_tokens": 100
  }'`}
            </pre>
          </div>
          <div>
            <h4 className="font-medium text-gray-300 mb-2">Monitor Performance</h4>
            <pre className="bg-gray-900 p-3 rounded text-sm overflow-x-auto">
{`# Monitor GPU usage
rocm-smi

# Monitor system resources
htop

# Monitor in real-time
watch -n 1 rocm-smi`}
            </pre>
          </div>
        </div>
      </div>

      <div className="bg-yellow-600/10 border border-yellow-500/20 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-yellow-300 mb-2">AMD Developer Cloud Benefits</h3>
        <div className="space-y-3">
          <div>
            <h4 className="font-medium text-gray-300 mb-2">Optimized for AMD Hardware</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Native AMD Instinct GPU support</li>
              <li>• Pre-optimized ROCm stack</li>
              <li>• Latest AMD drivers and firmware</li>
              <li>• AMD-specific performance tuning</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-300 mb-2">Developer Tools</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• AMD ROCm Profiler</li>
              <li>• AMD ROCm Debugger</li>
              <li>• Performance analysis tools</li>
              <li>• AMD-specific documentation</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-300 mb-2">Cost Optimization</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Pay-as-you-go pricing</li>
              <li>• Spot instances for cost savings</li>
              <li>• Reserved instances for long-term use</li>
              <li>• AMD partner discounts</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const renderKubernetes = () => (
    <div className="space-y-6">
      <div className="bg-blue-600/10 border border-blue-500/20 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-300 mb-2">Kubernetes with AMD Instinct</h3>
        <ul className="text-sm text-gray-300 space-y-1">
          <li>• AMD GPU Operator for Kubernetes</li>
          <li>• ROCm device plugin</li>
          <li>• Multi-node GPU clusters</li>
          <li>• Auto-scaling capabilities</li>
        </ul>
      </div>
      <div className="bg-yellow-600/10 border border-yellow-500/20 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-yellow-300 mb-2">Install AMD GPU Operator</h3>
        <pre className="bg-gray-900 p-4 rounded-lg text-sm overflow-x-auto">
{`# Add AMD Helm repository
helm repo add amd-gpu-operator https://rocm.github.io/amd-gpu-operator
helm repo update

# Install AMD GPU Operator
helm install amd-gpu-operator amd-gpu-operator/amd-gpu-operator \
  --namespace gpu-operator \
  --create-namespace \
  --set rocm.enabled=true`}
        </pre>
      </div>
      <div className="bg-green-600/10 border border-green-500/20 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-green-300 mb-2">Deploy Model Service</h3>
        <pre className="bg-gray-900 p-4 rounded-lg text-sm overflow-x-auto">
{`# model-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ai-playground-model
spec:
  replicas: 1
  selector:
    matchLabels:
      app: ai-playground-model
  template:
    metadata:
      labels:
        app: ai-playground-model
    spec:
      containers:
      - name: model-server
        image: your-registry/ai-playground:latest
        ports:
        - containerPort: 1234
        resources:
          limits:
            amd.com/gpu: 1
          requests:
            amd.com/gpu: 1
        env:
        - name: MODEL_NAME
          value: "${modelInfo.name}"
---
apiVersion: v1
kind: Service
metadata:
  name: ai-playground-service
spec:
  selector:
    app: ai-playground-model
  ports:
  - port: 80
    targetPort: 1234
  type: LoadBalancer`}
        </pre>
      </div>
      <div className="bg-blue-600/10 border border-blue-500/20 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-300 mb-2">Apply Deployment</h3>
        <pre className="bg-gray-900 p-4 rounded-lg text-sm overflow-x-auto">
{`# Apply the deployment
kubectl apply -f model-deployment.yaml

# Check deployment status
kubectl get pods -l app=ai-playground-model
kubectl get services ai-playground-service`}
        </pre>
      </div>
    </div>
  );

  const renderDocumentation = () => (
    <div className="space-y-6">
      <div className="bg-blue-600/10 border border-blue-500/20 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-300 mb-2">AMD ROCm Documentation</h3>
        <div className="space-y-3">
          <div>
            <h4 className="font-medium text-gray-300 mb-2">Official AMD Resources</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• <a href="https://rocmdocs.amd.com/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">ROCm Documentation</a> - Complete AMD GPU computing platform docs</li>
              <li>• <a href="https://rocmdocs.amd.com/en/latest/Installation_Guide/Installation-Guide.html" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">Installation Guide</a> - Step-by-step ROCm installation</li>
              <li>• <a href="https://rocmdocs.amd.com/en/latest/deploy/linux/prerequisites.html" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">System Requirements</a> - Hardware and software prerequisites</li>
              <li>• <a href="https://rocmdocs.amd.com/en/latest/deploy/linux/prerequisites.html#supported-gpus" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">Supported GPUs</a> - List of compatible AMD Instinct cards</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-yellow-600/10 border border-yellow-500/20 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-yellow-300 mb-2">PyTorch with ROCm</h3>
        <div className="space-y-3">
          <div>
            <h4 className="font-medium text-gray-300 mb-2">PyTorch Resources</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• <a href="https://pytorch.org/get-started/locally/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">PyTorch Installation</a> - Install PyTorch with ROCm support</li>
              <li>• <a href="https://pytorch.org/docs/stable/notes/rocm.html" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">PyTorch ROCm Notes</a> - ROCm-specific PyTorch documentation</li>
              <li>• <a href="https://github.com/pytorch/pytorch/blob/main/RELEASE.md" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">Release Notes</a> - Latest PyTorch ROCm updates</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-300 mb-2">Verification Commands</h4>
            <pre className="bg-gray-900 p-3 rounded text-sm overflow-x-auto">
{`# Check PyTorch ROCm installation
python3 -c "import torch; print(f'PyTorch: {torch.__version__}'); print(f'ROCm available: {torch.backends.mps.is_available()}')"

# Check GPU detection
python3 -c "import torch; print(f'GPU count: {torch.cuda.device_count()}'); print(f'GPU name: {torch.cuda.get_device_name(0) if torch.cuda.is_available() else \"No GPU\"}')"`}
            </pre>
          </div>
        </div>
      </div>

      <div className="bg-green-600/10 border border-green-500/20 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-green-300 mb-2">Model Deployment Guides</h3>
        <div className="space-y-3">
          <div>
            <h4 className="font-medium text-gray-300 mb-2">Hugging Face Transformers</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• <a href="https://huggingface.co/docs/transformers/installation" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">Transformers Installation</a> - Install with ROCm support</li>
              <li>• <a href="https://huggingface.co/docs/transformers/main_classes/model#transformers.PreTrainedModel.from_pretrained" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">Model Loading Guide</a> - Load models on AMD GPUs</li>
              <li>• <a href="https://huggingface.co/docs/transformers/main_classes/pipelines" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">Pipelines</a> - Easy model inference</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-300 mb-2">Performance Optimization</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• <a href="https://huggingface.co/docs/transformers/perf_infer_gpu_one" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">GPU Inference Optimization</a> - Optimize for AMD Instinct</li>
              <li>• <a href="https://huggingface.co/docs/accelerate/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">Accelerate Library</a> - Multi-GPU and distributed training</li>
              <li>• <a href="https://github.com/TimDettmers/bitsandbytes" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">BitsAndBytes</a> - Quantization for memory efficiency</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-blue-600/10 border border-blue-500/20 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-300 mb-2">Troubleshooting Guides</h3>
        <div className="space-y-3">
          <div>
            <h4 className="font-medium text-gray-300 mb-2">Common Issues</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• <a href="https://rocmdocs.amd.com/en/latest/deploy/linux/troubleshooting.html" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">ROCm Troubleshooting</a> - Common installation and runtime issues</li>
              <li>• <a href="https://rocmdocs.amd.com/en/latest/deploy/linux/troubleshooting.html#gpu-not-detected" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">GPU Detection Issues</a> - Fix GPU not found problems</li>
              <li>• <a href="https://rocmdocs.amd.com/en/latest/deploy/linux/troubleshooting.html#memory-issues" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">Memory Issues</a> - Resolve VRAM and system memory problems</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-300 mb-2">Diagnostic Commands</h4>
            <pre className="bg-gray-900 p-3 rounded text-sm overflow-x-auto">
{`# Check ROCm installation
rocm-smi

# Check GPU memory
rocm-smi --showmeminfo

# Check system memory
free -h

# Check ROCm version
dpkg -l | grep rocm

# Check PyTorch GPU support
python3 -c "import torch; print(torch.version.hip)"`}
            </pre>
          </div>
        </div>
      </div>

      <div className="bg-yellow-600/10 border border-yellow-500/20 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-yellow-300 mb-2">Community Resources</h3>
        <div className="space-y-3">
          <div>
            <h4 className="font-medium text-gray-300 mb-2">Forums and Support</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• <a href="https://community.amd.com/t5/rocm/bd-p/rocm" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">AMD ROCm Community</a> - Official AMD support forum</li>
              <li>• <a href="https://github.com/RadeonOpenCompute/ROCm/issues" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">ROCm GitHub Issues</a> - Bug reports and feature requests</li>
              <li>• <a href="https://discuss.pytorch.org/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">PyTorch Forums</a> - PyTorch community support</li>
              <li>• <a href="https://huggingface.co/forums" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">Hugging Face Forums</a> - Transformers and model support</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-300 mb-2">Tutorials and Examples</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• <a href="https://github.com/ROCmSoftwarePlatform/pytorch-examples" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">PyTorch ROCm Examples</a> - Official example code</li>
              <li>• <a href="https://github.com/ROCmSoftwarePlatform/ROCm-examples" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">ROCm Examples</a> - Various ROCm programming examples</li>
              <li>• <a href="https://huggingface.co/docs/transformers/training" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">Model Training Guide</a> - Train models on AMD GPUs</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-green-600/10 border border-green-500/20 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-green-300 mb-2">Performance Benchmarks</h3>
        <div className="space-y-3">
          <div>
            <h4 className="font-medium text-gray-300 mb-2">Benchmark Resources</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• <a href="https://rocmdocs.amd.com/en/latest/deploy/linux/benchmarking.html" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">ROCm Benchmarking</a> - Performance testing tools</li>
              <li>• <a href="https://github.com/ROCmSoftwarePlatform/rocBLAS" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">rocBLAS Benchmarks</a> - BLAS performance tests</li>
              <li>• <a href="https://mlcommons.org/en/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">MLCommons</a> - Industry standard AI benchmarks</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-300 mb-2">Performance Monitoring</h4>
            <pre className="bg-gray-900 p-3 rounded text-sm overflow-x-auto">
{`# Monitor GPU usage
watch -n 1 rocm-smi

# Monitor system resources
htop

# Monitor PyTorch GPU memory
python3 -c "
import torch
print(f'GPU Memory: {torch.cuda.memory_allocated()/1024**3:.2f} GB')
print(f'GPU Memory Cached: {torch.cuda.memory_reserved()/1024**3:.2f} GB')
"`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'manual':
        return renderManualInstall();
      case 'container':
        return renderContainer();
      case 'aws':
        return renderAWS();
      case 'azure':
        return renderAzure();
      case 'amd-cloud':
        return renderAMDCloud();
      case 'kubernetes':
        return renderKubernetes();
      case 'docs':
        return renderDocumentation();
      default:
        return renderManualInstall();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl w-full max-w-4xl mx-auto p-8 overflow-y-auto max-h-[90vh]" onClick={e => e.stopPropagation()}>
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-all text-2xl"
          onClick={onClose}
          title="Close"
        >
          &times;
        </button>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
            <ServerIcon className="w-7 h-7 text-blue-400" />
            Model Deployment Guide
          </h2>
          <p className="text-gray-400">
            Deploy {modelInfo.name} ({modelInfo.size}) on AMD Instinct GPUs
          </p>
        </div>
        {/* Model Info */}
        <div className="mb-6 p-4 bg-blue-600/10 rounded-lg border border-blue-500/20">
          <h3 className="text-lg font-semibold text-blue-300 mb-2">Model Requirements</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Model:</span>
              <span className="text-white ml-2">{modelInfo.name}</span>
            </div>
            <div>
              <span className="text-gray-400">Size:</span>
              <span className="text-white ml-2">{modelInfo.size}</span>
            </div>
            <div>
              <span className="text-gray-400">Requirements:</span>
              <span className="text-white ml-2">{modelInfo.requirements}</span>
            </div>
          </div>
        </div>
        {/* Tabs */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 border-b border-gray-700">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition-all ${
                    activeTab === tab.id
                      ? 'bg-blue-600/20 text-blue-400 border-b-2 border-blue-500'
                      : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.name}
                </button>
              );
            })}
          </div>
        </div>
        {/* Content */}
        <div className="space-y-6">
          {renderContent()}
        </div>
        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <InformationCircleIcon className="w-4 h-4" />
                Need help? Check our documentation
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeploymentGuide;
