import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  FaRocket, 
  FaServer, 
  FaCog, 
  FaChartLine, 
  FaCheckCircle,
  FaPlay,
  FaMicrochip,
  FaShieldAlt,
  FaArrowLeft
} from 'react-icons/fa';
import { IconContext } from 'react-icons';
import PlaygroundLogo from '../components/PlaygroundLogo';
import bannerWave from '../assets/banner_wave.png';

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
    handsOnExperience: {
      title: 'Hands-on ROCm Experience',
      description: 'Get practical experience with the ROCm software stack on AMD Instinct™ MI300X accelerators.',
      benefits: [
        'Direct access to latest AMD hardware',
        'Pre-configured ROCm development environment',
        'Real-world workload testing',
        'Performance optimization practice',
        'Cost-effective learning platform'
      ]
    },
    deploymentSteps: [
      {
        title: '1. Account Setup',
        description: 'Create and configure your AMD Developer Cloud account.',
        details: [
          'Sign up at developer.amd.com',
          'Verify email and complete profile',
          'Set up SSH key authentication',
          'Configure billing and quotas',
          'Access ROCm documentation'
        ]
      },
      {
        title: '2. Instance Provisioning',
        description: 'Provision AMD Instinct™ MI300X instances with ROCm.',
        details: [
          'Select MI300X instance type',
          'Choose region and availability zone',
          'Configure networking and security',
          'Launch instance with ROCm image',
          'Connect via SSH or web console'
        ]
      },
      {
        title: '3. Development Environment',
        description: 'Set up your development environment and tools.',
        details: [
          'Install development tools and SDKs',
          'Configure PyTorch/TensorFlow with ROCm',
          'Set up version control and CI/CD',
          'Configure monitoring and logging',
          'Test with sample workloads'
        ]
      }
    ],
    blueprints: [
      {
        name: 'PyTorch LLM Training',
        description: 'Train large language models with PyTorch on MI300X',
        framework: 'PyTorch',
        gpu: 'MI300X',
        complexity: 'Medium',
        estimatedTime: '20-30 minutes'
      },
      {
        name: 'TensorFlow Computer Vision',
        description: 'Train computer vision models with TensorFlow',
        framework: 'TensorFlow',
        gpu: 'MI300X',
        complexity: 'Easy',
        estimatedTime: '15-20 minutes'
      },
      {
        name: 'Custom Model Development',
        description: 'Develop and test custom AI models',
        framework: 'Custom',
        gpu: 'MI300X',
        complexity: 'Hard',
        estimatedTime: '30-45 minutes'
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

// Mock tutorial videos for AMD Developer Cloud
const amdTutorialVideos = [
  {
    title: 'Getting Started with ROCm on AMD Developer Cloud',
    description: 'Learn how to set up your first AMD Instinct instance and run your first ROCm workload.',
    thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzc0MTUxIi8+PC9zdmc+',
    url: 'https://www.youtube.com/watch?v=example1',
    duration: '8:45'
  },
  {
    title: 'PyTorch Training on MI300X: Best Practices',
    description: 'Optimize your PyTorch training workflows for maximum performance on AMD Instinct MI300X.',
    thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzc0MTUxIi8+PC9zdmc+',
    url: 'https://www.youtube.com/watch?v=example2',
    duration: '12:30'
  },
  {
    title: 'TensorFlow with ROCm: From Setup to Production',
    description: 'Complete guide to deploying TensorFlow models on AMD Developer Cloud with ROCm.',
    thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzc0MTUxIi8+PC9zdmc+',
    url: 'https://www.youtube.com/watch?v=example3',
    duration: '15:20'
  },
  {
    title: 'Large Language Model Training on MI300X',
    description: 'Scale your LLM training to multiple MI300X instances with distributed training.',
    thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzc0MTUxIi8+PC9zdmc+',
    url: 'https://www.youtube.com/watch?v=example4',
    duration: '18:15'
  },
  {
    title: 'Computer Vision with AMD Instinct GPUs',
    description: 'Build and deploy computer vision models using AMD Instinct accelerators.',
    thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzc0MTUxIi8+PC9zdmc+',
    url: 'https://www.youtube.com/watch?v=example5',
    duration: '10:45'
  },
  {
    title: 'Performance Optimization for AMD GPU Workloads',
    description: 'Advanced techniques for optimizing performance on AMD Instinct GPU instances.',
    thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzc0MTUxIi8+PC9zdmc+',
    url: 'https://www.youtube.com/watch?v=example6',
    duration: '14:30'
  }
];

const CloudDeployment: React.FC = () => {
  const { cloudId } = useParams<{ cloudId: string }>();

  const [gettingStartedTab, setGettingStartedTab] = useState<'setup' | 'tutorials'>('setup');

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
              <Link to='/models' className="text-2xl font-bold transition relative px-2 opacity-80 hover:opacity-100 after:content-[''] after:block after:h-1 after:rounded after:mt-1 after:w-0 after:bg-red-500 hover:after:w-full">Models</Link>
              <Link to='/blueprints' className="text-2xl font-bold transition relative px-2 opacity-80 hover:opacity-100 after:content-[''] after:block after:h-1 after:rounded after:mt-1 after:w-0 after:bg-red-500 hover:after:w-full">Blueprints</Link>
              <Link to='/gpu-cloud' className="text-2xl font-bold transition relative px-2 opacity-80 hover:opacity-100 after:content-[''] after:block after:h-1 after:rounded after:mt-1 after:w-0 after:bg-red-500 hover:after:w-full">GPU Clouds</Link>
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className='w-full max-w-[1400px] mx-auto py-12 px-8 flex-1'>
          {/* Header */}
          <div className='mb-8'>
            <div className='flex items-center justify-between mb-6'>
              <div className='flex items-center'>
                <Link
                  to='/gpu-cloud'
                  className='mr-4 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors'
                  title='Back to GPU Cloud'
                >
                  <FaArrowLeft className='text-xl text-gray-400' />
                </Link>
                <div className='w-16 h-16 bg-white/10 rounded-lg flex items-center justify-center mr-4'>
                  <FaServer className='text-2xl text-blue-400' />
                </div>
                <div>
                  <h1 className='text-4xl font-bold text-white'>{cloudConfig.name}</h1>
                  <p className='text-lg text-gray-300'>{cloudConfig.description}</p>
                </div>
              </div>
              
              {/* Deploy Button */}
              <Link
                to={`/deploy/${cloudId}`}
                className='inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl text-lg font-semibold transition-all duration-200 shadow-lg gap-2 opacity-70 cursor-not-allowed relative'
                tabIndex={-1}
                aria-disabled="true"
                onClick={e => e.preventDefault()}
              >
                <FaRocket className='mr-2' />
                <span>Deploy</span>
                <span className='ml-3 px-2 py-0.5 bg-yellow-400 text-yellow-900 text-xs font-bold rounded shadow-sm'>Coming Soon</span>
              </Link>
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
                      className={`flex-1 py-4 px-6 rounded-tr-2xl text-sm font-semibold transition-colors ${gettingStartedTab === 'tutorials' ? 'bg-blue-700/30 text-white' : 'text-gray-300 hover:text-white'}`}
                      onClick={() => setGettingStartedTab('tutorials')}
                    >
                      <FaPlay className="inline mr-2" />
                      Developer Tutorial Videos
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
                              <div className='aspect-w-16 aspect-h-9 mb-2 rounded overflow-hidden bg-black relative'>
                                <img src={video.thumbnail} alt={video.title} className='object-cover w-full h-full'/>
                                <div className='absolute inset-0 flex items-center justify-center'>
                                  <div className='bg-red-600/80 rounded-full p-2'>
                                    <FaPlay className='text-white text-sm' />
                                  </div>
                                </div>
                              </div>
                              <span className='text-white text-base font-medium mb-1'>{video.title}</span>
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
                  </div>
                </div>
              </div>

              {/* Right Column - Info & Pricing */}
              <div className='space-y-8'>
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

                {/* Pricing */}
                <div className='bg-white/5 backdrop-blur-md border border-white/20 rounded-2xl p-6'>
                  <h3 className='text-lg font-semibold text-white mb-4'>Pricing</h3>
                  <div className='space-y-3'>
                    {Object.entries(cloudConfig.pricing).map(([gpu, price]) => (
                      <div key={gpu} className='flex justify-between items-center'>
                        <span className='text-gray-300 text-sm'>{gpu.toUpperCase()}</span>
                        <span className='text-white font-medium'>{price}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Blueprints */}
                <div className='bg-white/5 backdrop-blur-md border border-white/20 rounded-2xl p-6'>
                  <h3 className='text-lg font-semibold text-white mb-4'>Available Blueprints</h3>
                  <div className='space-y-3'>
                    {cloudConfig.blueprints.map((blueprint, index) => (
                      <div key={index} className='bg-gray-800/50 rounded-lg p-3 border border-gray-700'>
                        <h4 className='text-white font-medium text-sm mb-1'>{blueprint.name}</h4>
                        <p className='text-gray-400 text-xs mb-2'>{blueprint.description}</p>
                        <div className='flex justify-between text-xs text-gray-500'>
                          <span>{blueprint.framework}</span>
                          <span>{blueprint.complexity}</span>
                          <span>{blueprint.estimatedTime}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* For other cloud providers, show a simplified layout */}
          {cloudId !== 'amd-developer-cloud' && (
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
              {/* Left Column - Getting Started Content */}
              <div className='lg:col-span-2'>
                <div className='bg-white/5 backdrop-blur-md border border-white/20 rounded-2xl p-8'>
                  <h3 className='text-xl font-bold text-white mb-4'>Getting Started with {cloudConfig.name}</h3>
                  <p className='text-sm text-gray-400 mb-6'>Learn how to deploy and run workloads on {cloudConfig.name}</p>
                  
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    {cloudConfig.deploymentSteps?.map((step, index) => (
                      <div key={index} className='bg-gray-800/50 rounded-lg p-6 border border-gray-700'>
                        <h4 className='text-lg font-semibold text-white mb-3'>{step.title}</h4>
                        <p className='text-gray-300 text-sm mb-4'>{step.description}</p>
                        
                        {/* Video Tutorial Section */}
                        <div className='mb-4'>
                          <div className='bg-black/30 rounded-lg p-4 border border-white/10'>
                            <div className='flex items-center justify-between mb-3'>
                              <h5 className='text-sm font-semibold text-white'>Video Tutorial</h5>
                              <span className='text-xs text-gray-400'>8:45</span>
                            </div>
                            <div className='relative bg-gray-800 rounded-lg overflow-hidden aspect-video'>
                              <div className='absolute inset-0 flex items-center justify-center'>
                                <div className='bg-blue-600/20 rounded-full p-3'>
                                  <FaPlay className='text-blue-400 text-lg' />
                                </div>
                              </div>
                              <div className='absolute bottom-2 left-2 bg-black/70 rounded px-2 py-1'>
                                <span className='text-xs text-white'>{step.title}</span>
                              </div>
                            </div>
                            <p className='text-xs text-gray-400 mt-2'>
                              Complete walkthrough of {step.title.toLowerCase()} on {cloudConfig.name}
                            </p>
                          </div>
                        </div>
                        
                        <ul className='space-y-2'>
                          {step.details.map((detail, detailIndex) => (
                            <li key={detailIndex} className='flex items-start text-sm text-gray-400'>
                              <FaCheckCircle className='text-green-400 mr-2 mt-0.5 flex-shrink-0' />
                              {detail}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column - Info & Pricing */}
              <div className='space-y-8'>
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

                {/* Pricing */}
                <div className='bg-white/5 backdrop-blur-md border border-white/20 rounded-2xl p-6'>
                  <h3 className='text-lg font-semibold text-white mb-4'>Pricing</h3>
                  <div className='space-y-3'>
                    {Object.entries(cloudConfig.pricing).map(([gpu, price]) => (
                      <div key={gpu} className='flex justify-between items-center'>
                        <span className='text-gray-300 text-sm'>{gpu.toUpperCase()}</span>
                        <span className='text-white font-medium'>{price}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Blueprints */}
                <div className='bg-white/5 backdrop-blur-md border border-white/20 rounded-2xl p-6'>
                  <h3 className='text-lg font-semibold text-white mb-4'>Available Blueprints</h3>
                  <div className='space-y-3'>
                    {cloudConfig.blueprints?.map((blueprint, index) => (
                      <div key={index} className='bg-gray-800/50 rounded-lg p-3 border border-gray-700'>
                        <h4 className='text-white font-medium text-sm mb-1'>{blueprint.name}</h4>
                        <p className='text-gray-400 text-xs mb-2'>{blueprint.description}</p>
                        <div className='flex justify-between text-xs text-gray-500'>
                          <span>{blueprint.framework}</span>
                          <span>{blueprint.complexity}</span>
                          <span>{blueprint.estimatedTime}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </IconContext.Provider>
  );
};

export default CloudDeployment;
