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
  FaCopy
} from 'react-icons/fa';
import { IconContext } from 'react-icons';
import PlaygroundLogo from '../components/PlaygroundLogo';
import bannerWave from '../assets/banner_wave.png';
import { GPUCloudManager } from '../components/GPUCloudManager';
import { ModelDeploymentManager } from '../components/ModelDeploymentManager';

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

const CloudDeployment: React.FC = () => {
  const { cloudId } = useParams<{ cloudId: string }>();
  const [activeTab, setActiveTab] = useState<'overview' | 'management' | 'deployments'>('overview');
  const [selectedBlueprint, setSelectedBlueprint] = useState<string>('');
  const [deploymentStatuses, setDeploymentStatuses] = useState<Record<string, 'idle' | 'deploying' | 'deployed' | 'error'>>({});
  const [deploymentLogs, setDeploymentLogs] = useState<Record<string, string[]>>({});
  const [showAccessCommands, setShowAccessCommands] = useState(false);

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

  const getAccessCommands = () => {
    const instanceId = `inst-${Date.now().toString(36)}`;
    const region = cloudConfig.regions[0];
    
    return {
      ssh: `ssh -i ~/.ssh/your-key.pem ubuntu@${instanceId}.${cloudId}.${region}.cloud.com`,
      scp: `scp -i ~/.ssh/your-key.pem -r ./your-model ubuntu@${instanceId}.${cloudId}.${region}.cloud.com:/home/ubuntu/`,
      api: `curl -X POST https://${instanceId}.${cloudId}.${region}.cloud.com/predict -H "Content-Type: application/json" -d '{"input": "your_data"}'`,
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

          {/* Tab Navigation */}
          <div className='flex justify-center space-x-1 bg-gray-800 rounded-lg p-1 mb-8'>
            <Link
              to='/gpu-cloud'
              className={`px-6 py-3 rounded-md font-medium transition-all inline-flex items-center ${
                activeTab === 'overview'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              <FaServer className="mr-2" />
              GPU Clouds Home
            </Link>

            <button
              onClick={() => setActiveTab('management')}
              className={`px-6 py-3 rounded-md font-medium transition-all ${
                activeTab === 'management'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              <FaCog className="inline mr-2" />
              Management
            </button>
            <button
              onClick={() => setActiveTab('deployments')}
              className={`px-6 py-3 rounded-md font-medium transition-all ${
                activeTab === 'deployments'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              <FaRocket className="inline mr-2" />
              Deployments
            </button>
          </div>



          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
              {/* Left Column - Deployment & Blueprints */}
              <div className='lg:col-span-2 space-y-8'>
              

              {/* Blueprints - Now Above Console */}
              <div className='bg-white/5 backdrop-blur-md border border-white/20 rounded-2xl p-8'>
                <h2 className='text-2xl font-bold text-white mb-6'>Deployment Quickstart</h2>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  {cloudConfig.blueprints.map((blueprint, index) => (
                    <div key={index} className='bg-gray-800/50 rounded-lg p-6 border border-gray-700 hover:border-blue-500 transition-colors'>
                      <div className='flex justify-between items-start mb-4'>
                        <h3 className='text-lg font-semibold text-white'>{blueprint.name}</h3>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          blueprint.complexity === 'Easy' ? 'bg-green-600/20 text-green-400' :
                          blueprint.complexity === 'Medium' ? 'bg-yellow-600/20 text-yellow-400' :
                          'bg-red-600/20 text-red-400'
                        }`}>
                          {blueprint.complexity}
                        </span>
                      </div>
                      <p className='text-gray-300 mb-4'>{blueprint.description}</p>
                      <div className='space-y-2 mb-4'>
                        <div className='flex justify-between text-sm'>
                          <span className='text-gray-400'>Framework:</span>
                          <span className='text-white'>{blueprint.framework}</span>
                        </div>
                        <div className='flex justify-between text-sm'>
                          <span className='text-gray-400'>GPU:</span>
                          <span className='text-white'>{blueprint.gpu}</span>
                        </div>
                        <div className='flex justify-between text-sm'>
                          <span className='text-gray-400'>Est. Time:</span>
                          <span className='text-white'>{blueprint.estimatedTime}</span>
                        </div>
                        <div className='flex justify-between text-sm'>
                          <span className='text-gray-400'>Price:</span>
                          <span className='text-green-400 font-medium'>
                            {cloudConfig.pricing[blueprint.gpu.toLowerCase() as keyof typeof cloudConfig.pricing] || 'Contact for pricing'}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleOneClickDeploy(blueprint.name)}
                        disabled={deploymentStatuses[blueprint.name] === 'deploying'}
                        className='w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white py-3 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center'
                      >
                        <FaRocket className="mr-2" />
                        {deploymentStatuses[blueprint.name] === 'deploying' ? 'Deploying...' : 
                         deploymentStatuses[blueprint.name] === 'deployed' ? 'Deployed' : 'Deploy Now'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Deployment Console - Now Below Blueprints */}
              <div className='bg-white/5 backdrop-blur-md border border-white/20 rounded-2xl p-8'>
                <h2 className='text-2xl font-bold text-white mb-6'>Deployment Console</h2>
                <div className='bg-gray-900 rounded-lg p-6 h-80'>
                  {!selectedBlueprint || deploymentStatuses[selectedBlueprint] === 'idle' ? (
                    <div className='h-full flex flex-col'>
                      <div className='text-lg font-semibold text-white mb-4'>Ready to Deploy</div>
                      <div className='bg-black rounded p-4 flex-1 font-mono text-sm text-gray-400'>
                        <div className='text-green-400'>$ ./deploy.sh --help</div>
                        <div className='mt-2'>
                          <div>Available commands:</div>
                          <div className='ml-4 mt-1'>
                            <div>• deploy [blueprint] - Deploy a blueprint</div>
                            <div>• status - Check deployment status</div>
                            <div>• logs - View deployment logs</div>
                            <div>• stop - Stop current deployment</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className='h-full flex flex-col'>
                      <div className='flex items-center justify-between mb-4'>
                        <div>
                          <span className='text-sm text-gray-400'>Active Blueprint:</span>
                          <span className='text-lg font-semibold text-white ml-2'>{selectedBlueprint}</span>
                        </div>
                        <div className='flex items-center'>
                          <div className={`w-4 h-4 rounded-full mr-3 ${
                            deploymentStatuses[selectedBlueprint] === 'deploying' ? 'bg-yellow-400 animate-pulse' :
                            deploymentStatuses[selectedBlueprint] === 'deployed' ? 'bg-green-400' :
                            'bg-red-400'
                          }`}></div>
                          <span className='text-sm font-medium text-white'>
                            {deploymentStatuses[selectedBlueprint] === 'deploying' ? 'Deploying...' :
                             deploymentStatuses[selectedBlueprint] === 'deployed' ? 'Deployed Successfully' :
                             'Deployment Failed'}
                          </span>
                        </div>
                      </div>
                      
                      <div className='bg-black rounded p-4 flex-1 overflow-y-auto font-mono text-sm'>
                        <div className='text-green-400 mb-2'>$ ./deploy.sh {selectedBlueprint}</div>
                        {(deploymentLogs[selectedBlueprint] || []).map((log: string, index: number) => (
                          <div key={index} className='text-gray-300 mb-1'>
                            <span className='text-blue-400'>[{new Date().toLocaleTimeString()}]</span> {log}
                          </div>
                        ))}
                        {deploymentStatuses[selectedBlueprint] === 'deploying' && (
                          <div className='text-yellow-400 animate-pulse'>
                            <span className='text-blue-400'>[{new Date().toLocaleTimeString()}]</span> Processing...
                          </div>
                        )}
                      </div>
                      
                      <div className='flex gap-2 mt-4'>
                        {deploymentStatuses[selectedBlueprint] === 'deploying' && (
                          <button
                            onClick={handleStopDeployment}
                            className='bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm transition-colors flex items-center'
                          >
                            <FaStop className="mr-2" />
                            Stop Deployment
                          </button>
                        )}
                        {deploymentStatuses[selectedBlueprint] === 'deployed' && (
                          <>
                            <button
                              onClick={handleAccessInstance}
                              className='bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm transition-colors flex items-center'
                            >
                              <FaPlay className="mr-2" />
                              Access Instance
                            </button>
                            <button
                              onClick={handleDeleteDeployment}
                              className='bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm transition-colors flex items-center'
                            >
                              <FaTrash className="mr-2" />
                              Delete Instance
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Access Commands Modal */}
              {showAccessCommands && selectedBlueprint && deploymentStatuses[selectedBlueprint] === 'deployed' && (
                <div className='bg-white/5 backdrop-blur-md border border-white/20 rounded-2xl p-8'>
                  <div className='flex justify-between items-center mb-6'>
                    <h2 className='text-2xl font-bold text-white'>Access Your Instance</h2>
                    <button
                      onClick={() => setShowAccessCommands(false)}
                      className='text-gray-400 hover:text-white text-xl'
                    >
                      ×
                    </button>
                  </div>
                  
                  <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                    {/* SSH Access */}
                    <div className='bg-gray-800/50 rounded-lg p-6'>
                      <h3 className='text-lg font-semibold text-white mb-4 flex items-center'>
                        <FaServer className="mr-2 text-blue-400" />
                        SSH Access
                      </h3>
                      <p className='text-gray-300 text-sm mb-4'>
                        Connect directly to your instance via SSH for command-line access.
                      </p>
                      <div className='bg-black rounded p-4 font-mono text-sm'>
                        <div className='text-green-400 mb-2'># Connect to instance</div>
                        <div className='text-gray-300 mb-1'>{getAccessCommands().ssh}</div>
                        <div className='text-gray-500 text-xs mt-2'>
                          Make sure your SSH key is properly configured
                        </div>
                      </div>
                    </div>

                    {/* File Transfer */}
                    <div className='bg-gray-800/50 rounded-lg p-6'>
                      <h3 className='text-lg font-semibold text-white mb-4 flex items-center'>
                        <FaCopy className="mr-2 text-green-400" />
                        File Transfer
                      </h3>
                      <p className='text-gray-300 text-sm mb-4'>
                        Upload models, data, or scripts to your instance.
                      </p>
                      <div className='bg-black rounded p-4 font-mono text-sm'>
                        <div className='text-green-400 mb-2'># Upload files</div>
                        <div className='text-gray-300 mb-1'>{getAccessCommands().scp}</div>
                        <div className='text-gray-500 text-xs mt-2'>
                          Replace 'your-model' with your actual file/directory
                        </div>
                      </div>
                    </div>

                    {/* API Access */}
                    <div className='bg-gray-800/50 rounded-lg p-6'>
                      <h3 className='text-lg font-semibold text-white mb-4 flex items-center'>
                        <FaRocket className="mr-2 text-purple-400" />
                        API Endpoint
                      </h3>
                      <p className='text-gray-300 text-sm mb-4'>
                        Make predictions using the deployed model API.
                      </p>
                      <div className='bg-black rounded p-4 font-mono text-sm'>
                        <div className='text-green-400 mb-2'># Make prediction</div>
                        <div className='text-gray-300 mb-1'>{getAccessCommands().api}</div>
                        <div className='text-gray-500 text-xs mt-2'>
                          Replace 'your_data' with your actual input
                        </div>
                      </div>
                    </div>

                    {/* Jupyter Notebook */}
                    <div className='bg-gray-800/50 rounded-lg p-6'>
                      <h3 className='text-lg font-semibold text-white mb-4 flex items-center'>
                        <FaCog className="mr-2 text-yellow-400" />
                        Jupyter Notebook
                      </h3>
                      <p className='text-gray-300 text-sm mb-4'>
                        Access Jupyter notebook interface via SSH tunnel.
                      </p>
                      <div className='bg-black rounded p-4 font-mono text-sm'>
                        <div className='text-green-400 mb-2'># SSH tunnel for Jupyter</div>
                        <div className='text-gray-300 mb-1'>{getAccessCommands().jupyter}</div>
                        <div className='text-gray-500 text-xs mt-2'>
                          Then open http://localhost:8888 in your browser
                        </div>
                      </div>
                    </div>

                    {/* Monitoring Dashboard */}
                    <div className='bg-gray-800/50 rounded-lg p-6'>
                      <h3 className='text-lg font-semibold text-white mb-4 flex items-center'>
                        <FaChartLine className="mr-2 text-red-400" />
                        Monitoring Dashboard
                      </h3>
                      <p className='text-gray-300 text-sm mb-4'>
                        View instance metrics and performance data.
                      </p>
                      <div className='bg-black rounded p-4 font-mono text-sm'>
                        <div className='text-green-400 mb-2'># Open monitoring dashboard</div>
                        <div className='text-gray-300 mb-1'>{getAccessCommands().monitoring}</div>
                        <div className='text-gray-500 text-xs mt-2'>
                          Login with your cloud provider credentials
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='mt-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg'>
                    <h4 className='text-sm font-semibold text-blue-400 mb-2'>Quick Start Guide</h4>
                    <div className='text-sm text-gray-300 space-y-1'>
                      <div>1. Copy the SSH command and connect to your instance</div>
                      <div>2. Upload your models using the SCP command</div>
                      <div>3. Start your model server or Jupyter notebook</div>
                      <div>4. Use the API endpoint for predictions</div>
                      <div>5. Monitor performance via the dashboard</div>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Right Column - Info & Pricing */}
            <div className='space-y-8'>
              {/* Availability Legend */}
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
              
              {/* Cloud Info */}
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

              {/* Competitive Pricing - AMD Developer Cloud Only */}
              {cloudId === 'amd-developer-cloud' && (
                <div className='bg-white/5 backdrop-blur-md border border-white/20 rounded-2xl p-6'>
                  <h3 className='text-lg font-semibold text-white mb-4 flex items-center'>
                    <FaChartLine className="mr-2 text-green-400" />
                    Highly Competitive Pricing
                  </h3>
                  <div className='space-y-3'>
                    <div className='p-3 bg-green-900/20 border border-green-500/30 rounded-lg'>
                      <div className='text-sm text-green-400 font-semibold mb-1'>Cost-Effective Learning</div>
                      <div className='text-xs text-gray-300'>
                        Start with MI100 at just $0.95/hour for hands-on ROCm experience
                      </div>
                    </div>
                    <div className='p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg'>
                      <div className='text-sm text-blue-400 font-semibold mb-1'>Production Ready</div>
                      <div className='text-xs text-gray-300'>
                        Scale to MI300X at $2.50/hour for production workloads
                      </div>
                    </div>
                    <div className='p-3 bg-purple-900/20 border border-purple-500/30 rounded-lg'>
                      <div className='text-sm text-purple-400 font-semibold mb-1'>No Hidden Costs</div>
                      <div className='text-xs text-gray-300'>
                        Pay only for what you use with transparent pricing
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Key Features */}
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

              {/* Deployment Steps */}
              <div className='bg-white/5 backdrop-blur-md border border-white/20 rounded-2xl p-6'>
                <h3 className='text-lg font-semibold text-white mb-4'>Deployment Process</h3>
                <div className='space-y-4'>
                  {cloudConfig.deploymentSteps.map((step, index) => (
                    <div key={index} className='border-l-4 border-blue-500 pl-4'>
                      <h4 className='text-sm font-semibold text-white mb-1'>{step.title}</h4>
                      <p className='text-xs text-gray-400 mb-2'>{step.description}</p>
                      <ul className='space-y-1'>
                        {step.details.slice(0, 2).map((detail, idx) => (
                          <li key={idx} className='text-xs text-gray-500 flex items-center'>
                            <div className='w-1 h-1 bg-blue-500 rounded-full mr-2'></div>
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          )}



          {activeTab === 'management' && (
            <div className='space-y-8'>
              <GPUCloudManager />
            </div>
          )}

          {activeTab === 'deployments' && (
            <div className='space-y-8'>
              <ModelDeploymentManager />
            </div>
          )}
        </div>
      </div>
    </IconContext.Provider>
  );
};

export default CloudDeployment;
