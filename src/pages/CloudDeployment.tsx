import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  FaRocket, 
  FaServer, 
  FaCog, 
  FaChartLine, 
  FaCheckCircle,
  FaArrowLeft,
  FaPlay,
  FaStop,
  FaTrash,
  FaCopy,
  FaDollarSign,
  FaInfoCircle,
  FaPlus,
  FaDownload
} from 'react-icons/fa';
import { IconContext } from 'react-icons';
import PlaygroundLogo from '../components/PlaygroundLogo';
import bannerWave from '../assets/banner_wave.png';
import { GPUCloudManager } from '../components/GPUCloudManager';
import { ModelDeploymentManager } from '../components/ModelDeploymentManager';
import CombinedCloudManager from '../components/CombinedCloudManager';

// Cloud provider deployment configurations
const cloudDeployments = {
  'amd-developer-cloud': {
    name: 'AMD Developer Cloud',
    description: 'Gain hands-on experience with a variety of workloads on the ROCm software stack using AMD Developer Cloud at highly competitive pricing. Deploy your AI models on AMD Instinct™ MI300X accelerators with pre-configured ROCm environment.',
    features: [
      'Hands-on ROCm Software Stack Experience',
      'MI300X Instances with 192GB HBM3',
      'Pre-configured ROCm 6.0+ Environment',
      'Highly Competitive Pricing ($2.50/hour)',
      '24/7 Developer Support',
      'Global Data Center Locations'
    ],
    deploymentSteps: [
      {
        title: '1. Hands-on ROCm Experience Setup',
        description: 'Start your hands-on journey with the ROCm software stack on AMD Developer Cloud.',
        details: [
          'Access pre-configured ROCm development environments',
          'Choose MI300X (192GB VRAM) or MI250X (128GB VRAM)',
          'Select from US East, US West, Europe, or Asia Pacific',
          'Configure instance size based on your workload requirements'
        ]
      },
      {
        title: '2. Model Deployment',
        description: 'Deploy your AI model with optimized ROCm containers.',
        details: [
          'Use pre-built ROCm containers for popular frameworks',
          'Support for PyTorch, TensorFlow, and ONNX models',
          'Automatic model optimization for AMD GPUs'
        ]
      },
      {
        title: '3. Endpoint Configuration',
        description: 'Set up REST API endpoints for model inference.',
        details: [
          'Configure load balancing and auto-scaling',
          'Set up monitoring and logging',
          'Configure security and access controls'
        ]
      }
    ],
    handsOnExperience: {
      title: 'Hands-on ROCm Software Stack Experience',
      description: 'Developers can gain practical experience with the complete ROCm ecosystem at highly competitive pricing.',
      benefits: [
        'Access to latest ROCm software stack versions',
        'Pre-configured development environments',
        'Real-world workload testing capabilities',
        'Cost-effective learning and experimentation',
        'Direct access to AMD technical resources'
      ]
    },
    blueprints: [
      {
        name: 'PyTorch LLM Deployment',
        description: 'Deploy large language models with PyTorch on MI300X',
        framework: 'PyTorch',
        gpu: 'MI300X',
        complexity: 'Medium',
        estimatedTime: '15-20 minutes'
      },
      {
        name: 'TensorFlow Computer Vision',
        description: 'Deploy computer vision models with TensorFlow',
        framework: 'TensorFlow',
        gpu: 'MI250X',
        complexity: 'Easy',
        estimatedTime: '10-15 minutes'
      },
      {
        name: 'ONNX Model Server',
        description: 'Deploy ONNX models with optimized inference',
        framework: 'ONNX',
        gpu: 'MI300X',
        complexity: 'Easy',
        estimatedTime: '8-12 minutes'
      }
    ],
    pricing: {
      mi300x: '$2.50/hour',
      mi250x: '$1.80/hour',
      mi100: '$0.95/hour'
    },
    regions: ['US East', 'US West', 'Europe', 'Asia Pacific']
  },
  'vultr': {
    name: 'Vultr',
    description: 'Deploy on Vultr\'s AMD Instinct™ MI325X and MI300X instances with global data center coverage.',
    features: [
      'MI325X & MI300X GPU Instances',
      'Global Data Center Network',
      'Competitive Pricing',
      'Easy API Integration',
      '99.99% Uptime SLA'
    ],
    handsOnExperience: null,
    deploymentSteps: [
      {
        title: '1. Instance Provisioning',
        description: 'Provision GPU instances across Vultr\'s global network.',
        details: [
          'Choose MI325X (latest) or MI300X instances',
          'Select from 32 global data center locations',
          'Configure networking and security groups'
        ]
      },
      {
        title: '2. Container Deployment',
        description: 'Deploy your models using Docker containers.',
        details: [
          'Use Vultr\'s optimized GPU containers',
          'Support for custom Docker images',
          'Automatic container orchestration'
        ]
      },
      {
        title: '3. Load Balancer Setup',
        description: 'Configure load balancing for high availability.',
        details: [
          'Set up Vultr Load Balancer',
          'Configure health checks and failover',
          'SSL certificate management'
        ]
      }
    ],
    blueprints: [
      {
        name: 'MI325X LLM Deployment',
        description: 'Deploy large language models on latest MI325X',
        framework: 'PyTorch',
        gpu: 'MI325X',
        complexity: 'Medium',
        estimatedTime: '20-25 minutes'
      },
      {
        name: 'MI300X Inference Server',
        description: 'High-performance inference server setup',
        framework: 'ONNX',
        gpu: 'MI300X',
        complexity: 'Medium',
        estimatedTime: '15-20 minutes'
      }
    ],
    pricing: {
      mi325x: '$3.20/hour',
      mi300x: '$2.80/hour'
    },
    regions: ['US East', 'US West', 'Europe', 'Asia']
  },
  'oracle-cloud-infrastructure': {
    name: 'Oracle Cloud Infrastructure',
    description: 'Deploy on Oracle\'s bare metal AMD Instinct™ MI300X instances for enterprise workloads.',
    features: [
      'Bare Metal MI300X Instances',
      'Enterprise Security & Compliance',
      'High Performance Networking',
      'Oracle Support Integration',
      'Hybrid Cloud Capabilities'
    ],
    handsOnExperience: null,
    deploymentSteps: [
      {
        title: '1. Bare Metal Provisioning',
        description: 'Provision dedicated bare metal GPU instances.',
        details: [
          'Dedicated MI300X bare metal servers',
          'High-performance networking (25Gbps)',
          'Enterprise security and compliance'
        ]
      },
      {
        title: '2. Enterprise Deployment',
        description: 'Deploy with enterprise-grade security.',
        details: [
          'Oracle Cloud Guard security monitoring',
          'Identity and Access Management (IAM)',
          'Vault for secret management'
        ]
      },
      {
        title: '3. Monitoring & Support',
        description: 'Set up comprehensive monitoring and support.',
        details: [
          'Oracle Cloud Monitoring integration',
          '24/7 enterprise support',
          'Performance optimization services'
        ]
      }
    ],
    blueprints: [
      {
        name: 'Enterprise LLM Platform',
        description: 'Enterprise-grade LLM deployment with security',
        framework: 'PyTorch',
        gpu: 'MI300X',
        complexity: 'Hard',
        estimatedTime: '30-45 minutes'
      },
      {
        name: 'High-Performance Inference',
        description: 'Bare metal inference server setup',
        framework: 'ONNX',
        gpu: 'MI300X',
        complexity: 'Medium',
        estimatedTime: '25-35 minutes'
      }
    ],
    pricing: {
      mi300x: '$3.50/hour',
      mi250x: '$2.20/hour'
    },
    regions: ['US East', 'US West', 'Europe', 'Asia Pacific']
  },
  'microsoft-azure': {
    name: 'Microsoft Azure',
    description: 'Deploy on Azure\'s AMD Instinct MI210-series virtual machines for HPC and AI workloads.',
    features: [
              'MI210 Series VM Instances',
      'Azure Integration & Services',
      'Enterprise Features',
      'Global Azure Network',
      'DevOps & CI/CD Integration'
    ],
    deploymentSteps: [
      {
        title: '1. VM Instance Setup',
        description: 'Configure AMD Instinct VM instances.',
        details: [
          'Select MI250 or MI210 series VMs',
          'Configure Azure networking and security',
          'Set up managed disks and storage'
        ]
      },
      {
        title: '2. Azure Services Integration',
        description: 'Integrate with Azure AI and ML services.',
        details: [
          'Azure Machine Learning integration',
          'Azure Container Registry for images',
          'Azure Monitor for observability'
        ]
      },
      {
        title: '3. DevOps Pipeline',
        description: 'Set up CI/CD pipelines for model deployment.',
        details: [
          'Azure DevOps integration',
          'Automated deployment pipelines',
          'Blue-green deployment strategies'
        ]
      }
    ],
    blueprints: [
      {
        name: 'Azure ML Integration',
        description: 'Deploy with Azure Machine Learning',
        framework: 'PyTorch',
        gpu: 'MI250',
        complexity: 'Medium',
        estimatedTime: '25-30 minutes'
      },
      {
        name: 'Container-based Inference',
        description: 'Deploy using Azure Container Instances',
        framework: 'ONNX',
        gpu: 'MI210',
        complexity: 'Easy',
        estimatedTime: '15-20 minutes'
      }
    ],
    pricing: {
      mi250: '$2.10/hour',
      mi210: '$1.60/hour'
    },
    regions: ['Global']
  },
  'hot-aisle': {
    name: 'Hot Aisle',
    description: 'Deploy on Hot Aisle\'s bare metal AMD MI300X enterprise accelerators with on-demand access.',
    features: [
      'Bare Metal MI300X Access',
      'On-demand Provisioning',
      'Competitive Pricing',
      'Direct Technical Support',
      'Custom Configurations'
    ],
    deploymentSteps: [
      {
        title: '1. Bare Metal Provisioning',
        description: 'Provision dedicated MI300X bare metal servers.',
        details: [
          'Dedicated MI300X enterprise accelerators',
          'On-demand provisioning (5-10 minutes)',
          'Custom hardware configurations available'
        ]
      },
      {
        title: '2. Direct Access Setup',
        description: 'Set up direct access to bare metal hardware.',
        details: [
          'Direct hardware access for optimization',
          'Custom kernel and driver configurations',
          'Performance tuning capabilities'
        ]
      },
      {
        title: '3. Support & Optimization',
        description: 'Get direct support and performance optimization.',
        details: [
          'Direct technical support team',
          'Performance optimization services',
          'Custom deployment assistance'
        ]
      }
    ],
    blueprints: [
      {
        name: 'Bare Metal LLM Deployment',
        description: 'Optimized LLM deployment on bare metal',
        framework: 'PyTorch',
        gpu: 'MI300X',
        complexity: 'Hard',
        estimatedTime: '35-45 minutes'
      },
      {
        name: 'High-Performance Inference',
        description: 'Bare metal inference server setup',
        framework: 'ONNX',
        gpu: 'MI300X',
        complexity: 'Medium',
        estimatedTime: '20-30 minutes'
      }
    ],
    pricing: {
      mi300x: '$2.90/hour',
      mi250x: '$2.00/hour'
    },
    regions: ['US East', 'US West']
  },
  'tensorwave': {
    name: 'TensorWave',
    description: 'Deploy on TensorWave\'s next-generation AMD accelerators with memory-optimized infrastructure.',
    features: [
      'Next-gen AMD GPU Infrastructure',
      'Memory-Optimized Instances',
      'Scalable Architecture',
      'AI-Focused Platform',
      'Performance-Tuned Environment'
    ],
    deploymentSteps: [
      {
        title: '1. AI-Optimized Setup',
        description: 'Configure AI-optimized GPU instances.',
        details: [
          'Memory-optimized MI300X instances',
          'AI-focused infrastructure design',
          'Scalable architecture setup'
        ]
      },
      {
        title: '2. Model Optimization',
        description: 'Optimize models for TensorWave infrastructure.',
        details: [
          'Automatic model optimization',
          'Memory-efficient deployment',
          'Performance tuning services'
        ]
      },
      {
        title: '3. Scaling & Management',
        description: 'Set up auto-scaling and management.',
        details: [
          'Auto-scaling based on demand',
          'Intelligent resource management',
          'Cost optimization features'
        ]
      }
    ],
    blueprints: [
      {
        name: 'Memory-Optimized LLM',
        description: 'Deploy large models with memory optimization',
        framework: 'PyTorch',
        gpu: 'MI300X',
        complexity: 'Medium',
        estimatedTime: '25-35 minutes'
      },
      {
        name: 'Scalable Inference Platform',
        description: 'Auto-scaling inference server setup',
        framework: 'ONNX',
        gpu: 'MI250X',
        complexity: 'Medium',
        estimatedTime: '20-25 minutes'
      }
    ],
    pricing: {
      mi300x: '$3.10/hour',
      mi250x: '$2.30/hour'
    },
    regions: ['US East', 'US West']
  }
};

const amdTutorialVideos = [
  {
    title: 'Running Models from Hugging Face on AMD GPUs',
    description: 'How to use Hugging Face Transformers for NLP inference on ROCm.',
    thumbnail: 'https://img.youtube.com/vi/placeholder1/0.jpg',
    url: 'https://rocm.docs.amd.com/en/latest/how-to/rocm-for-ai/inference/index.html',
  },
  {
    title: 'LLM Inference Frameworks on MI300X',
    description: 'Using vLLM and other frameworks for large language model inference.',
    thumbnail: 'https://img.youtube.com/vi/placeholder2/0.jpg',
    url: 'https://rocm.docs.amd.com/en/latest/how-to/rocm-for-ai/inference/index.html',
  },
  {
    title: 'PyTorch Inference Performance Testing',
    description: 'Benchmarking and optimizing PyTorch inference on AMD Instinct GPUs.',
    thumbnail: 'https://img.youtube.com/vi/placeholder3/0.jpg',
    url: 'https://rocm.docs.amd.com/en/latest/how-to/rocm-for-ai/inference/index.html',
  },
  {
    title: 'Deploying Your Model on AMD Developer Cloud',
    description: 'Step-by-step guide to deploying trained models in production.',
    thumbnail: 'https://img.youtube.com/vi/placeholder4/0.jpg',
    url: 'https://rocm.docs.amd.com/en/latest/how-to/rocm-for-ai/inference/index.html',
  },
  {
    title: 'Model Quantization Techniques',
    description: 'How to use quantization to optimize models for inference.',
    thumbnail: 'https://img.youtube.com/vi/placeholder5/0.jpg',
    url: 'https://rocm.docs.amd.com/en/latest/how-to/rocm-for-ai/inference-optimization/index.html',
  },
  {
    title: 'Profiling and Debugging with ROCm Tools',
    description: 'Using ROCProfiler and ROCm Compute Profiler for performance analysis.',
    thumbnail: 'https://img.youtube.com/vi/placeholder6/0.jpg',
    url: 'https://rocm.docs.amd.com/en/latest/how-to/rocm-for-ai/inference-optimization/index.html',
  },
  {
    title: 'Fine-tuning LLMs on AMD GPUs',
    description: 'How to fine-tune large language models using ROCm.',
    thumbnail: 'https://img.youtube.com/vi/placeholder7/0.jpg',
    url: 'https://rocm.docs.amd.com/en/latest/how-to/rocm-for-ai/training/index.html',
  },
  {
    title: 'Optimizing Model Inference with vLLM',
    description: 'Tuning vLLM for best performance on MI300X.',
    thumbnail: 'https://img.youtube.com/vi/placeholder8/0.jpg',
    url: 'https://rocm.docs.amd.com/en/latest/how-to/rocm-for-ai/inference-optimization/index.html',
  },
  {
    title: 'Auto-tuning with PyTorch TunableOp',
    description: 'Using PyTorch\'s TunableOp for automatic kernel optimization.',
    thumbnail: 'https://img.youtube.com/vi/placeholder9/0.jpg',
    url: 'https://rocm.docs.amd.com/en/latest/how-to/rocm-for-ai/inference-optimization/index.html',
  },
  {
    title: 'HIP Performance Optimization',
    description: 'Best practices for memory and parallel execution in HIP.',
    thumbnail: 'https://img.youtube.com/vi/placeholder10/0.jpg',
    url: 'https://rocm.docs.amd.com/en/latest/how-to/rocm-for-ai/inference-optimization/index.html',
  },
];

const CloudDeployment: React.FC = () => {
  const { cloudId } = useParams<{ cloudId: string }>();

  const [selectedBlueprint, setSelectedBlueprint] = useState<string>('');
  const [deploymentStatuses, setDeploymentStatuses] = useState<Record<string, 'idle' | 'deploying' | 'deployed' | 'error'>>({});
  const [deploymentLogs, setDeploymentLogs] = useState<Record<string, string[]>>({});
  const [showAccessCommands, setShowAccessCommands] = useState(false);
  const [gettingStartedTab, setGettingStartedTab] = useState<'setup' | 'tutorials' | 'deploy'>('setup');
  const [instanceTab, setInstanceTab] = useState<'mi300x' | 'mi250x'>('mi300x');

  const cloudConfig = cloudDeployments[cloudId as keyof typeof cloudDeployments];

  if (!cloudConfig) {
    return (
      <div className="min-h-screen bg-neutral-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Cloud Provider Not Found</h1>
          <Link to="/gpu-cloud" className="text-blue-400 hover:underline">
            ← Back to GPU Cloud
          </Link>
        </div>
      </div>
    );
  }

  const handleOneClickDeploy = async (blueprintName: string) => {
    setSelectedBlueprint(blueprintName);
    setDeploymentStatuses(prev => ({ ...prev, [blueprintName]: 'deploying' }));
    setDeploymentLogs(prev => ({ ...prev, [blueprintName]: [] }));
    setShowAccessCommands(false);

    // Simulate deployment process
    const logs = [
      `Starting deployment of ${blueprintName}...`,
      'Provisioning cloud resources...',
      'Configuring GPU instances...',
      'Deploying model containers...',
      'Setting up load balancers...',
      'Configuring monitoring...',
      'Deployment completed successfully!'
    ];

    for (let i = 0; i < logs.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setDeploymentLogs(prev => ({
        ...prev,
        [blueprintName]: [...(prev[blueprintName] || []), logs[i]]
      }));
    }

    setDeploymentStatuses(prev => ({ ...prev, [blueprintName]: 'deployed' }));
  };

  const handleStopDeployment = () => {
    if (selectedBlueprint) {
      setDeploymentStatuses(prev => ({ ...prev, [selectedBlueprint]: 'idle' }));
      setDeploymentLogs(prev => ({ ...prev, [selectedBlueprint]: [] }));
    }
    setShowAccessCommands(false);
  };

  const handleDeleteDeployment = () => {
    if (selectedBlueprint) {
      setDeploymentStatuses(prev => ({ ...prev, [selectedBlueprint]: 'idle' }));
      setDeploymentLogs(prev => ({ ...prev, [selectedBlueprint]: [] }));
    }
    setSelectedBlueprint('');
    setShowAccessCommands(false);
  };

  const handleAccessInstance = () => {
    setShowAccessCommands(true);
  };

  const handleDeployInstance = (instanceType: string) => {
    // Simulate instance deployment
    console.log(`Deploying ${instanceType} instance...`);
    // Here you would integrate with the actual AMD Developer Cloud API
    alert(`Deploying ${instanceType} instance. This would connect to AMD Developer Cloud API.`);
  };

  const getAccessCommands = () => {
    const instanceId = `inst-${Date.now().toString(36)}`;
    const region = cloudConfig.regions[0];
    
    return {
      ssh: `ssh -i ~/.ssh/your-key.pem ubuntu@${instanceId}.${cloudId}.${region}.cloud.com`,
      scp: `scp -i ~/.ssh/your-key.pem -r ./your-model ubuntu@${instanceId}.${cloudId}.${region}.cloud.com:/home/ubuntu/`,
      api: `curl -X POST https://${instanceId}.${cloudId}.${region}.cloud.com/predict -H "Content-Type: application/json" -d '{"input": "Hello, world!"}'`,
      jupyter: `ssh -i ~/.ssh/your-key.pem -L 8888:localhost:8888 ubuntu@${instanceId}.${cloudId}.${region}.cloud.com`,
      monitoring: `https://${instanceId}.${cloudId}.${region}.cloud.com:3000`
    };
  };

  return (
    <IconContext.Provider value={{ size: '1em', className: 'inline-block ml-2' }}>
      <div className='min-h-screen bg-neutral-900 text-white font-sans flex flex-col'>
        {/* Banner */}
        <div className='relative w-full h-56 md:h-72 lg:h-80 overflow-hidden'>
          <img
            src={bannerWave}
            alt='Banner'
            className='w-full h-full object-cover'
          />
          <nav className='absolute top-0 left-0 w-full flex justify-between items-center pt-8 px-8 z-10'>
            <PlaygroundLogo />
            <div className='flex gap-16'>
              <Link
                to='/models'
                className="text-2xl font-bold transition relative px-2 opacity-80 hover:opacity-100 after:content-[''] after:block after:h-1 after:rounded after:mt-1 after:w-0 after:bg-red-500 hover:after:w-full"
              >
                Models
              </Link>
              <Link
                to='/blueprints'
                className="text-2xl font-bold transition relative px-2 opacity-80 hover:opacity-100 after:content-[''] after:block after:h-1 after:rounded after:mt-1 after:w-0 after:bg-red-500 hover:after:w-full"
              >
                Blueprints
              </Link>
              <Link
                to='/gpu-cloud'
                className="text-2xl font-bold transition relative px-2 opacity-80 hover:opacity-100 after:content-[''] after:block after:h-1 after:rounded after:mt-1 after:w-0 after:bg-red-500 hover:after:w-full"
              >
                GPU Clouds
              </Link>
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className='w-full max-w-[1400px] mx-auto py-12 px-8 flex-1'>
          {/* Header */}
          <div className='mb-8'>
            <div className='flex items-center mb-6'>
              <div className='w-16 h-16 bg-white/10 rounded-lg flex items-center justify-center mr-4'>
                <FaServer className='text-2xl text-blue-400' />
              </div>
              <div>
                <h1 className='text-4xl font-bold text-white'>{cloudConfig.name}</h1>
                <p className='text-lg text-gray-300'>{cloudConfig.description}</p>
              </div>
            </div>
          </div>



          {/* Main Content */}
          {cloudId === 'amd-developer-cloud' && (
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
              {/* Left Column - Tabbed Getting Started Content */}
              <div className='lg:col-span-2'>
                {/* Tabbed Box */}
                <div className='bg-white/5 backdrop-blur-md border border-white/20 rounded-2xl p-0'>
                                      <div className='flex border-b border-white/10'>
                      <button
                        className={`flex-1 py-4 px-6 rounded-tl-2xl text-sm font-semibold transition-colors ${gettingStartedTab === 'setup' ? 'bg-blue-700/30 text-white' : 'text-gray-300 hover:text-white'}`}
                        onClick={() => setGettingStartedTab('setup')}
                      >
                        <FaServer className="inline mr-2" />
                        AMD Developer Cloud Setup
                      </button>
                      <button
                        className={`flex-1 py-4 px-6 text-sm font-semibold transition-colors ${gettingStartedTab === 'tutorials' ? 'bg-blue-700/30 text-white' : 'text-gray-300 hover:text-white'}`}
                        onClick={() => setGettingStartedTab('tutorials')}
                      >
                        <FaPlay className="inline mr-2" />
                        Developer Tutorial Videos
                      </button>
                      <button
                        className={`flex-1 py-4 px-6 rounded-tr-2xl text-sm font-semibold transition-colors ${gettingStartedTab === 'deploy' ? 'bg-blue-700/30 text-white' : 'text-gray-300 hover:text-white'}`}
                        onClick={() => setGettingStartedTab('deploy')}
                      >
                        <FaRocket className="inline mr-2" />
                        Deploy
                        <span className='ml-2 px-2 py-0.5 rounded-full bg-yellow-400 text-xs font-semibold text-gray-900 align-middle'>Coming Soon</span>
                      </button>
                    </div>
                  <div className='p-8'>
                    {gettingStartedTab === 'setup' && (
                      <div>
                        <h3 className='text-xl font-bold text-white mb-4'>AMD Developer Cloud Setup</h3>
                        <p className='text-sm text-gray-400 mb-6'>Configure your AMD Developer Cloud account</p>
                        
                        {/* Step-by-step instructions */}
                        <div className='mb-6'>
                          <h4 className='text-sm font-semibold text-white mb-3'>Step-by-Step Instructions:</h4>
                          <div className='space-y-3 text-sm text-gray-300'>
                            <div className='flex items-start'>
                              <div className='w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3 mt-0.5 text-xs font-bold text-white'>1</div>
                              <div>
                                <span className='font-medium text-white'>Create AMD Developer Cloud account</span>
                                <p className='text-gray-400 mt-1'>Sign up at developer.amd.com and verify your email address</p>
                              </div>
                            </div>
                            <div className='flex items-start'>
                              <div className='w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3 mt-0.5 text-xs font-bold text-white'>2</div>
                              <div>
                                <span className='font-medium text-white'>Set up SSH key pairs</span>
                                <p className='text-gray-400 mt-1'>Generate SSH keys and add them to your AMD Developer Cloud profile</p>
                              </div>
                            </div>
                            <div className='flex items-start'>
                              <div className='w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3 mt-0.5 text-xs font-bold text-white'>3</div>
                              <div>
                                <span className='font-medium text-white'>Configure billing and quotas</span>
                                <p className='text-gray-400 mt-1'>Set up payment method and review instance quotas for your account</p>
                              </div>
                            </div>
                            <div className='flex items-start'>
                              <div className='w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3 mt-0.5 text-xs font-bold text-white'>4</div>
                              <div>
                                <span className='font-medium text-white'>Access ROCm documentation</span>
                                <p className='text-gray-400 mt-1'>Review ROCm documentation and compatibility guides for your workloads</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Account Setup Video */}
                        <div className='bg-gray-900/50 rounded-lg p-4'>
                          <div className='flex items-center justify-between mb-3'>
                            <h4 className='text-sm font-semibold text-white'>Account Setup Video</h4>
                            <span className='text-red-400 text-xs font-medium'>YouTube</span>
                          </div>
                          <div className='relative bg-black rounded-lg overflow-hidden aspect-video'>
                            <div className='absolute inset-0 flex items-center justify-center'>
                              <div className='text-center'>
                                <div className='w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-3'>
                                  <svg className='w-8 h-8 text-white' fill='currentColor' viewBox='0 0 24 24'>
                                    <path d='M8 5v14l11-7z'/>
                                  </svg>
                                </div>
                                <p className='text-white text-sm font-medium'>AMD Developer Cloud Setup Guide</p>
                                <p className='text-gray-400 text-xs mt-1'>5:23 • 2.1K views</p>
                              </div>
                            </div>
                            <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3'>
                              <div className='flex items-center justify-between'>
                                <div className='flex items-center space-x-2'>
                                  <div className='w-6 h-6 bg-gray-600 rounded-full'></div>
                                  <span className='text-white text-xs'>AMD Developer</span>
                                </div>
                                <button className='bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded-full font-medium transition-colors'>
                                  Watch Now
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {gettingStartedTab === 'tutorials' && (
                      <div>
                        <h3 className='text-xl font-bold text-white mb-4'>Developer Tutorial Videos</h3>
                        <p className='text-sm text-gray-400 mb-6'>Step-by-step video guides for AI workloads</p>
                        
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                          {amdTutorialVideos.slice(0, 6).map((video, idx) => (
                            <div key={idx} className='bg-gray-900/60 rounded-lg p-3 border border-gray-700 flex flex-col'>
                              <div className='aspect-w-16 aspect-h-9 mb-2 rounded overflow-hidden bg-black'>
                                <img src={video.thumbnail} alt={video.title} className='object-cover w-full h-full'/>
                              </div>
                              <h4 className='text-white font-semibold text-sm mb-1 line-clamp-2'>{video.title}</h4>
                              <p className='text-gray-400 text-xs mb-2 line-clamp-2'>{video.description}</p>
                              <a href={video.url} target='_blank' rel='noopener noreferrer' className='mt-auto inline-block bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded text-xs font-medium text-center'>
                                Watch Video
                              </a>
                            </div>
                          ))}
                        </div>
                        
                        <div className='mt-4 text-center'>
                          <a 
                            href="https://www.amd.com/en/developer/resources/rocm-hub/dev-ai.html" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className='text-purple-400 hover:text-purple-300 text-sm font-medium'
                          >
                            View All Tutorials →
                          </a>
                        </div>
                                              </div>
                      )}
                      
                      {gettingStartedTab === 'deploy' && (
                        <div>
                          <h3 className='text-xl font-bold text-white mb-4'>Quickstart Blueprints</h3>
                          <p className='text-sm text-gray-400 mb-6'>Deploy pre-configured AMD GPU instances with popular frameworks</p>
                          
                          {/* Instance Deployment Tabs */}
                          <div className='bg-white/5 backdrop-blur-md border border-white/20 rounded-2xl p-0'>
                            <div className='flex border-b border-gray-700'>
                              <button
                                className={`flex-1 py-3 px-4 text-sm font-semibold transition-colors ${instanceTab === 'mi300x' ? 'bg-blue-700/30 text-white' : 'text-gray-300 hover:text-white'}`}
                                onClick={() => setInstanceTab('mi300x')}
                              >
                                <FaServer className="inline mr-2" />
                                MI300X Instance
                              </button>
                              <button
                                className={`flex-1 py-3 px-4 text-sm font-semibold transition-colors ${instanceTab === 'mi250x' ? 'bg-blue-700/30 text-white' : 'text-gray-300 hover:text-white'}`}
                                onClick={() => setInstanceTab('mi250x')}
                              >
                                <FaServer className="inline mr-2" />
                                MI250X Instance
                              </button>
                            </div>
                            <div className='p-6'>
                              {instanceTab === 'mi300x' && (
                                <div>
                                  <div className='flex items-center justify-between mb-4'>
                                    <div>
                                      <h4 className='text-lg font-bold text-white'>AMD Instinct™ MI300X</h4>
                                      <p className='text-sm text-gray-400'>192GB HBM3 Memory • Latest ROCm Support</p>
                                    </div>
                                    <div className='text-right'>
                                      <div className='text-xl font-bold text-white'>$2.50/hour</div>
                                      <div className='text-sm text-gray-400'>Highly Available</div>
                                    </div>
                                  </div>
                                  
                                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                                    <div className='bg-gray-800/50 rounded-lg p-3'>
                                      <h5 className='text-sm font-semibold text-white mb-2'>Specifications</h5>
                                      <div className='space-y-1 text-xs text-gray-300'>
                                        <div className='flex justify-between'>
                                          <span>GPU Memory:</span>
                                          <span className='text-white'>192GB HBM3</span>
                                        </div>
                                        <div className='flex justify-between'>
                                          <span>Memory Bandwidth:</span>
                                          <span className='text-white'>5.3 TB/s</span>
                                        </div>
                                        <div className='flex justify-between'>
                                          <span>FP16 Performance:</span>
                                          <span className='text-white'>383 TFLOPS</span>
                                        </div>
                                        <div className='flex justify-between'>
                                          <span>ROCm Version:</span>
                                          <span className='text-white'>6.0+</span>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    <div className='bg-gray-800/50 rounded-lg p-3'>
                                      <h5 className='text-sm font-semibold text-white mb-2'>Pre-configured Environments</h5>
                                      <div className='space-y-1 text-xs'>
                                        <div className='flex items-center text-gray-300'>
                                          <FaCheckCircle className='text-green-400 mr-2' />
                                          PyTorch 2.1+ with ROCm
                                        </div>
                                        <div className='flex items-center text-gray-300'>
                                          <FaCheckCircle className='text-green-400 mr-2' />
                                          TensorFlow 2.15+ with ROCm
                                        </div>
                                        <div className='flex items-center text-gray-300'>
                                          <FaCheckCircle className='text-green-400 mr-2' />
                                          JAX with ROCm
                                        </div>
                                        <div className='flex items-center text-gray-300'>
                                          <FaCheckCircle className='text-green-400 mr-2' />
                                          ONNX Runtime
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className='flex gap-3'>
                                    <button
                                      onClick={() => handleDeployInstance('mi300x')}
                                      className='flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded text-sm font-semibold transition-colors flex items-center justify-center'
                                    >
                                      <FaRocket className="mr-2" />
                                      Deploy MI300X Instance
                                    </button>
                                    <button className='bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded text-sm font-semibold transition-colors'>
                                      View Pricing
                                    </button>
                                  </div>
                                </div>
                              )}
                              
                              {instanceTab === 'mi250x' && (
                                <div>
                                  <div className='flex items-center justify-between mb-4'>
                                    <div>
                                      <h4 className='text-lg font-bold text-white'>AMD Instinct™ MI250X</h4>
                                      <p className='text-sm text-gray-400'>128GB HBM2e Memory • Cost-Effective Option</p>
                                    </div>
                                    <div className='text-right'>
                                      <div className='text-xl font-bold text-white'>$1.80/hour</div>
                                      <div className='text-sm text-gray-400'>Available</div>
                                    </div>
                                  </div>
                                  
                                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                                    <div className='bg-gray-800/50 rounded-lg p-3'>
                                      <h5 className='text-sm font-semibold text-white mb-2'>Specifications</h5>
                                      <div className='space-y-1 text-xs text-gray-300'>
                                        <div className='flex justify-between'>
                                          <span>GPU Memory:</span>
                                          <span className='text-white'>128GB HBM2e</span>
                                        </div>
                                        <div className='flex justify-between'>
                                          <span>Memory Bandwidth:</span>
                                          <span className='text-white'>3.2 TB/s</span>
                                        </div>
                                        <div className='flex justify-between'>
                                          <span>FP16 Performance:</span>
                                          <span className='text-white'>383 TFLOPS</span>
                                        </div>
                                        <div className='flex justify-between'>
                                          <span>ROCm Version:</span>
                                          <span className='text-white'>5.7+</span>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    <div className='bg-gray-800/50 rounded-lg p-3'>
                                      <h5 className='text-sm font-semibold text-white mb-2'>Pre-configured Environments</h5>
                                      <div className='space-y-1 text-xs'>
                                        <div className='flex items-center text-gray-300'>
                                          <FaCheckCircle className='text-green-400 mr-2' />
                                          PyTorch 2.0+ with ROCm
                                        </div>
                                        <div className='flex items-center text-gray-300'>
                                          <FaCheckCircle className='text-green-400 mr-2' />
                                          TensorFlow 2.13+ with ROCm
                                        </div>
                                        <div className='flex items-center text-gray-300'>
                                          <FaCheckCircle className='text-green-400 mr-2' />
                                          JAX with ROCm
                                        </div>
                                        <div className='flex items-center text-gray-300'>
                                          <FaCheckCircle className='text-green-400 mr-2' />
                                          ONNX Runtime
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className='flex gap-3'>
                                    <button
                                      onClick={() => handleDeployInstance('mi250x')}
                                      className='flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded text-sm font-semibold transition-colors flex items-center justify-center'
                                    >
                                      <FaRocket className="mr-2" />
                                      Deploy MI250X Instance
                                    </button>
                                    <button className='bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded text-sm font-semibold transition-colors'>
                                      View Pricing
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Model & Blueprint Deployments - Only show when Deploy tab is active */}
                      {gettingStartedTab === 'deploy' && (
                        <div className='mt-8'>
                          <CombinedCloudManager />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

            {/* Right Column - Info & Pricing */}
            <div className='space-y-8'>
              {/* Cloud Info - Only show when Deploy tab is NOT active */}
              {gettingStartedTab !== 'deploy' && (
                <div className='bg-white/5 backdrop-blur-md border border-white/20 rounded-2xl p-6'>
                  <h3 className='text-lg font-semibold text-white mb-4'>Cloud Provider</h3>
                  <div className='space-y-3'>
                    <div>
                      <span className='text-sm text-gray-400'>Name:</span>
                      <div className='text-white font-medium'>{cloudConfig.name}</div>
                    </div>
                    <div>
                      <span className='text-sm text-gray-400'>Description:</span>
                      <div className='text-gray-300 text-sm mt-1'>{cloudConfig.description}</div>
                    </div>
                    <div>
                      <span className='text-sm text-gray-400'>Available Regions:</span>
                      <div className='flex flex-wrap gap-1 mt-1'>
                        {cloudConfig.regions.map((region, index) => (
                          <span key={index} className='px-2 py-1 bg-gray-700 rounded text-xs text-gray-300'>
                            {region}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Key Features - Only show when Deploy tab is NOT active */}
              {gettingStartedTab !== 'deploy' && (
                <div className='bg-white/5 backdrop-blur-md border border-white/20 rounded-2xl p-6'>
                  <h3 className='text-lg font-semibold text-white mb-4'>Key Features</h3>
                  <div className='space-y-3'>
                    {cloudConfig.features.map((feature, index) => (
                      <div key={index} className='flex items-center text-gray-300'>
                        <FaCheckCircle className='text-green-400 mr-3' />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Availability Legend - Only show when Deploy tab is active */}
              {gettingStartedTab === 'deploy' && (
                <div className='bg-white/5 backdrop-blur-md border border-white/20 rounded-2xl p-6'>
                  <h3 className='text-sm font-semibold text-white mb-3'>Availability</h3>
                  <div className='space-y-2 text-xs'>
                    <div className='flex items-center'>
                      <span className='w-2 h-2 bg-green-600/20 rounded-full mr-2'></span>
                      <span className='text-green-400 font-medium'>High</span>
                      <span className='text-gray-400 ml-1'>- Readily available</span>
                    </div>
                    <div className='flex items-center'>
                      <span className='w-2 h-2 bg-yellow-600/20 rounded-full mr-2'></span>
                      <span className='text-yellow-400 font-medium'>Medium</span>
                      <span className='text-gray-400 ml-1'>- Limited availability</span>
                    </div>
                    <div className='flex items-center'>
                      <span className='w-2 h-2 bg-red-600/20 rounded-full mr-2'></span>
                      <span className='text-red-400 font-medium'>Low</span>
                      <span className='text-gray-400 ml-1'>- Waitlist or restricted</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          )}




        </div>
      </div>
    </IconContext.Provider>
  );
};

export default CloudDeployment;
