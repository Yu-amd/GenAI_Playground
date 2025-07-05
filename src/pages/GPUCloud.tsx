import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import bannerWave from '../assets/banner_wave.png';
import { 
  FaServer, 
  FaRocket,
  FaCloud,
  FaShieldAlt
} from 'react-icons/fa';
import { IconContext } from 'react-icons';
import PlaygroundLogo from '../components/PlaygroundLogo';


// Enhanced cloud provider data with more details
const amdDeveloperCloud = {
  name: 'AMD Developer Cloud',
  description:
    'Gain hands-on experience with a variety of workloads on the ROCm software stack using AMD Developer Cloud at highly competitive pricing. Access the latest AMD Instinct™ accelerators in a pre-configured environment designed for developers.',
  link: 'https://www.amd.com/en/developer/resources/cloud-access/amd-developer-cloud.html',
  features: [
    'Hands-on ROCm Software Stack Experience',
    'MI300X Instances Available',
    'Pre-configured ROCm Environment',
    'Highly Competitive Pricing',
    '24/7 Developer Support',
    'Global Data Centers'
  ],
  pricing: {
    mi300x: '$2.50/hour',
    mi250x: '$1.80/hour',
    mi100: '$0.95/hour'
  },
  availability: 'High',
  regions: ['US East', 'US West', 'Europe', 'Asia Pacific']
};

const publicClouds = [
  {
    name: 'Vultr',
    description:
      'Offers AMD Instinct™ MI325X and MI300X GPUs for AI and HPC workloads with global data center regions.',
    link: 'https://www.vultr.com/products/cloud-gpu/amd-mi325x-mi300x/',
    features: [
      'MI325X & MI300X Available',
      'Global Data Centers',
      'Competitive Pricing',
      'Easy Setup',
      'API Access'
    ],
    pricing: {
      mi325x: '$3.20/hour',
      mi300x: '$2.80/hour'
    } as Record<string, string>,
    availability: 'Medium',
    regions: ['US East', 'US West', 'Europe', 'Asia']
  },
  {
    name: 'Oracle Cloud Infrastructure',
    description:
      'Provides AMD Instinct™ MI300X GPUs in bare metal compute instances for high-performance AI workloads.',
    link: 'https://www.oracle.com/cloud/compute/gpu/',
    features: [
      'Bare Metal MI300X',
      'Enterprise Security',
      'High Performance',
      'Oracle Support',
      'Hybrid Cloud'
    ],
    pricing: {
      mi300x: '$3.50/hour',
      mi250x: '$2.20/hour'
    },
    availability: 'High',
    regions: ['US East', 'US West', 'Europe', 'Asia Pacific']
  },
  {
    name: 'Microsoft Azure',
    description:
      'Offers virtual machines featuring AMD Instinct MI210-series GPUs for HPC and AI applications.',
    link: 'https://azure.microsoft.com/en-us/blog/new-azure-virtual-machines-for-hpc-and-ai-now-available/',
          features: [
        'MI210 Series VMs',
        'Azure Integration',
        'Enterprise Features',
        'Global Network',
        'DevOps Tools'
      ],
          pricing: {
        mi250: '$2.10/hour',
        mi210: '$1.60/hour'
      },
    availability: 'Medium',
    regions: ['Global']
  },

  {
    name: 'Hot Aisle',
    description:
      'A NeoCloud service provider offering on-demand, bare metal access to AMD MI300X enterprise accelerators.',
    link: 'https://hotaisle.xyz/',
    features: [
      'Bare Metal MI300X',
      'On-demand Access',
      'Competitive Pricing',
      'Direct Support',
      'Custom Configurations'
    ],
    pricing: {
      mi300x: '$2.90/hour',
      mi250x: '$2.00/hour'
    },
    availability: 'Medium',
    regions: ['US East', 'US West']
  },
  {
    name: 'TensorWave',
    description:
      'Leverages the next generation of AMD accelerators to provide scalable, memory-optimized infrastructure for AI.',
    link: 'https://tensorwave.com/',
    features: [
      'Next-gen AMD GPUs',
      'Memory Optimized',
      'Scalable Infrastructure',
      'AI Focused',
      'Performance Tuned'
    ],
    pricing: {
      mi300x: '$3.10/hour',
      mi250x: '$2.30/hour'
    },
    availability: 'Low',
    regions: ['US East', 'US West']
  },
];





const GPUCloud: React.FC = () => {

  useEffect(() => {
    // Handle hash navigation immediately
    const hash = window.location.hash;
    if (hash === '#amd-developer-cloud') {
      // Scroll immediately without smooth behavior to avoid the jarring effect
      const amdSection = document.getElementById('amd-developer-cloud');
      if (amdSection) {
        amdSection.scrollIntoView({ behavior: 'auto', block: 'start' });
      }
    }
  }, []);

  return (
    <IconContext.Provider
      value={{ size: '1em', className: 'inline-block ml-2' }}
    >
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
          <div className='text-center mb-12'>
            <h1 className='text-4xl font-bold text-white mb-4'>
              AMD Instinct™ GPU Cloud Access
            </h1>
            <p className='text-lg text-gray-300 mb-8'>
              From experimentation to enterprise deployment, we support your entire GenAI journey.
            </p>
            
            {/* Deploy Button */}
            <div className='mb-8'>
              <Link
                to='/deploy'
                className='inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl'
              >
                <FaRocket className='mr-3 text-xl' />
                Deploy to Any Cloud Provider
              </Link>
              <p className='text-sm text-gray-400 mt-3'>
                Unified deployment interface for all AMD Instinct™ GPU cloud providers
              </p>
            </div>
            
            {/* Path to Production */}
            <div className='bg-white/5 backdrop-blur-md border border-white/20 rounded-2xl p-8 mb-12 text-left'>
              <h2 className='text-2xl font-bold text-white mb-6'>Path to Production</h2>
              <p className='text-gray-300 mb-8'>
                Comprehensive guides for deploying AMD Instinct GPU workloads in production environments.
              </p>
              
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                <div className='bg-gray-800/50 rounded-lg p-6 flex flex-col h-full'>
                  <div className='flex items-center mb-4'>
                    <FaRocket className='text-purple-400 mr-3' />
                    <h3 className='text-lg font-semibold text-white'>Developer Cloud</h3>
                  </div>
                  <p className='text-gray-300 text-sm mb-4'>
                    Get hands-on experience with ROCm software stack on AMD Developer Cloud.
                  </p>
                  <ul className='text-sm text-gray-400 space-y-1 mb-4'>
                    <li>• MI300X & MI250X Instances</li>
                    <li>• Pre-configured ROCm Environment</li>
                    <li>• Highly Competitive Pricing</li>
                  </ul>
                  <div className='mt-auto'>
                    <button 
                      onClick={() => {
                        const amdSection = document.querySelector('[data-amd-developer-cloud]') as HTMLElement;
                        if (amdSection) {
                          amdSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          amdSection.focus();
                        }
                      }}
                      className='bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm transition-colors'
                    >
                      Start Learning
                    </button>
                  </div>
                </div>

                <div className='bg-gray-800/50 rounded-lg p-6 flex flex-col h-full'>
                  <div className='flex items-center mb-4'>
                    <FaCloud className='text-blue-400 mr-3' />
                    <h3 className='text-lg font-semibold text-white'>Public Cloud</h3>
                  </div>
                  <p className='text-gray-300 text-sm mb-4'>
                    Deploy to major cloud providers with AMD Instinct GPU support.
                  </p>
                  <ul className='text-sm text-gray-400 space-y-1 mb-4'>
                    <li>• Vultr MI300X/MI325X</li>
                    <li>• Oracle Cloud MI300X</li>
                    <li>• Azure MI210 Series</li>
                  </ul>
                  <div className='mt-auto'>
                    <button 
                      onClick={() => {
                        const publicCloudSection = document.querySelector('[data-public-cloud-providers]') as HTMLElement;
                        if (publicCloudSection) {
                          publicCloudSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          publicCloudSection.focus();
                        }
                      }}
                      className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors'
                    >
                      Cloud providers
                    </button>
                  </div>
                </div>

                <div className='bg-gray-800/50 rounded-lg p-6 flex flex-col h-full'>
                  <div className='flex items-center mb-4'>
                    <FaServer className='text-green-400 mr-3' />
                    <h3 className='text-lg font-semibold text-white'>On-Premises</h3>
                  </div>
                  <p className='text-gray-300 text-sm mb-4'>
                    Deploy AMD Instinct GPUs in your own data center infrastructure.
                  </p>
                  <ul className='text-sm text-gray-400 space-y-1 mb-4'>
                    <li>• Hardware Requirements</li>
                    <li>• ROCm Installation</li>
                    <li>• Network Configuration</li>
                    <li>• Security Setup</li>
                  </ul>
                  <div className='mt-auto'>
                    <button className='bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-colors'>
                      View Guide
                    </button>
                  </div>
                </div>

                <div className='bg-gray-800/50 rounded-lg p-6 flex flex-col h-full'>
                  <div className='flex items-center mb-4'>
                    <FaShieldAlt className='text-purple-400 mr-3' />
                    <h3 className='text-lg font-semibold text-white'>Enterprise Production</h3>
                  </div>
                  <p className='text-gray-300 text-sm mb-4'>
                    Production-ready deployment with enterprise security and compliance.
                  </p>
                  <ul className='text-sm text-gray-400 space-y-1 mb-4'>
                    <li>• Security Best Practices</li>
                    <li>• Compliance (SOC2, GDPR)</li>
                    <li>• High Availability</li>
                    <li>• Disaster Recovery</li>
                  </ul>
                  <div className='mt-auto'>
                    <button className='bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm transition-colors'>
                      View Guide
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Cloud Provider Overview */}
            <div className='space-y-12 mb-12'>
              {/* Availability Legend */}
              <div className='flex justify-center mb-6'>
                <div className='inline-flex items-center space-x-6 text-sm text-gray-400'>
                  <div className='flex items-center'>
                    <span className='w-2 h-2 bg-green-600/20 rounded-full mr-2'></span>
                    <span className='text-green-400 font-medium'>High</span>
                    <span className='ml-1'>- Readily available</span>
                  </div>
                  <div className='flex items-center'>
                    <span className='w-2 h-2 bg-yellow-600/20 rounded-full mr-2'></span>
                    <span className='text-yellow-400 font-medium'>Medium</span>
                    <span className='ml-1'>- Limited availability</span>
                  </div>
                  <div className='flex items-center'>
                    <span className='w-2 h-2 bg-red-600/20 rounded-full mr-2'></span>
                    <span className='text-red-400 font-medium'>Low</span>
                    <span className='ml-1'>- Waitlist or restricted</span>
                  </div>
                </div>
              </div>
              
              {/* AMD Developer Cloud Section */}
              <div className='mb-16 text-left' id="amd-developer-cloud" data-amd-developer-cloud tabIndex={-1}>
                <div className='bg-white/5 backdrop-blur-md border border-white/20 rounded-2xl p-8'>
                  <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
                    <div className='flex flex-col'>
                      <div className='flex justify-between items-start mb-4'>
                        <h3 className='text-2xl font-bold text-blue-400'>
                          {amdDeveloperCloud.name}
                        </h3>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          amdDeveloperCloud.availability === 'High' ? 'bg-green-600/20 text-green-400' :
                          amdDeveloperCloud.availability === 'Medium' ? 'bg-yellow-600/20 text-yellow-400' :
                          'bg-red-600/20 text-red-400'
                        }`}>
                          {amdDeveloperCloud.availability}
                        </span>
                      </div>
                      <p className='text-gray-300 flex-grow mb-6'>
                        {amdDeveloperCloud.description}
                      </p>
                      
                      <div className='mb-6'>
                        <div className='text-sm text-gray-400 mb-1'>Starting Price</div>
                        <div className='text-lg font-medium text-green-400'>{amdDeveloperCloud.pricing.mi100}</div>
                      </div>
                      
                      <Link
                        to='/gpu-cloud/amd-developer-cloud'
                        className='mt-auto text-sm font-semibold text-blue-400 hover:underline flex items-center'
                      >
                        Start Learning <FaRocket className="ml-2" />
                      </Link>
                    </div>
                    
                    <div>
                      <h4 className='text-lg font-semibold text-white mb-4'>Key Features</h4>
                      <ul className='space-y-2 mb-6'>
                        {amdDeveloperCloud.features.map((feature, index) => (
                          <li key={index} className='flex items-center text-gray-300'>
                            <div className='w-2 h-2 bg-blue-500 rounded-full mr-3'></div>
                            {feature}
                          </li>
                        ))}
                      </ul>
                      
                      <h4 className='text-lg font-semibold text-white mb-4'>Available Regions</h4>
                      <div className='flex flex-wrap gap-2'>
                        {amdDeveloperCloud.regions.map((region, index) => (
                          <span key={index} className='px-3 py-1 bg-gray-700 rounded-full text-sm text-gray-300'>
                            {region}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className='text-lg font-semibold text-white mb-4'>Supported Workloads</h4>
                      <ul className='space-y-2 mb-6'>
                        <li className='flex items-center text-gray-300'>
                          <div className='w-2 h-2 bg-purple-500 rounded-full mr-3'></div>
                          Machine Learning Training & Inference
                        </li>
                        <li className='flex items-center text-gray-300'>
                          <div className='w-2 h-2 bg-purple-500 rounded-full mr-3'></div>
                          High Performance Computing (HPC)
                        </li>
                        <li className='flex items-center text-gray-300'>
                          <div className='w-2 h-2 bg-purple-500 rounded-full mr-3'></div>
                          Computer Vision Applications
                        </li>
                        <li className='flex items-center text-gray-300'>
                          <div className='w-2 h-2 bg-purple-500 rounded-full mr-3'></div>
                          Natural Language Processing
                        </li>
                        <li className='flex items-center text-gray-300'>
                          <div className='w-2 h-2 bg-purple-500 rounded-full mr-3'></div>
                          Scientific Computing Workloads
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Public Cloud Providers Section */}
              <div className='text-left' data-public-cloud-providers tabIndex={-1}>
                <h2 className='text-3xl font-bold text-white mb-6 border-b-2 border-blue-500 pb-2'>
                  Public Cloud Providers
                </h2>
                <p className='text-lg text-gray-300 mb-8'>
                  Enterprise-grade production deployment across major public cloud providers with leadership performance, scalability, and reliability for your most demanding AI workloads.
                </p>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                  {publicClouds.map((cloud, index) => (
                    <div
                      key={index}
                      className='group bg-white/5 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg p-6 transition-all hover:bg-white/10 hover:shadow-2xl hover:-translate-y-1 flex flex-col'
                    >
                      <div className='flex justify-between items-start mb-4'>
                        <h3 className='text-xl font-bold text-blue-400'>
                          {cloud.name}
                        </h3>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          cloud.availability === 'High' ? 'bg-green-600/20 text-green-400' :
                          cloud.availability === 'Medium' ? 'bg-yellow-600/20 text-yellow-400' :
                          'bg-red-600/20 text-red-400'
                        }`}>
                          {cloud.availability}
                        </span>
                      </div>
                      
                      <p className='text-gray-300 flex-grow mb-4'>{cloud.description}</p>
                      
                      <div className='space-y-3 mb-4'>
                        <div className='flex items-center justify-between'>
                          <span className='text-sm text-gray-400'>Starting Price:</span>
                          <span className='text-sm font-medium text-green-400'>
                            {Object.values(cloud.pricing)[0]}
                          </span>
                        </div>
                      </div>
                      
                      <div className='space-y-2 mb-4'>
                        <h4 className='text-sm font-semibold text-white'>Features:</h4>
                        <ul className='space-y-1'>
                          {cloud.features.slice(0, 3).map((feature, idx) => (
                            <li key={idx} className='text-xs text-gray-400 flex items-center'>
                              <div className='w-1 h-1 bg-blue-500 rounded-full mr-2'></div>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <Link
                        to={`/gpu-cloud/${cloud.name.toLowerCase().replace(/\s+/g, '-')}`}
                        className='mt-auto text-sm font-semibold text-blue-400 group-hover:underline flex items-center'
                      >
                        Deploy Now <FaRocket className="ml-2" />
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </IconContext.Provider>
  );
};

export default GPUCloud;
