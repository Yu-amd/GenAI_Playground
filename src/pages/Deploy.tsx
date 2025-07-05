import React, { useState, useEffect, useRef } from 'react';
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
  FaCloud,
  FaArrowLeft,
  FaChevronDown
} from 'react-icons/fa';
import { IconContext } from 'react-icons';
import PlaygroundLogo from '../components/PlaygroundLogo';
import bannerWave from '../assets/banner_wave.png';
import { DeployTab } from '../components/DeployTab';
import CombinedCloudManager from '../components/CombinedCloudManager';
import { centralDeploymentController } from '../services/CentralDeploymentController';

// Cloud provider configurations
const cloudProviders = {
  'amd-developer-cloud': {
    name: 'AMD Developer Cloud',
    description: 'Access the latest AMD Instinct™ accelerators in a pre-configured environment designed for developers.',
    icon: FaMicrochip,
    color: 'text-blue-400',
    bgColor: 'bg-blue-400/10',
    borderColor: 'border-blue-400/20'
  },
  'oracle-cloud-infrastructure': {
    name: 'Oracle Cloud Infrastructure',
    description: 'Enterprise-grade cloud infrastructure with AMD Instinct™ MI300X GPUs for high-performance AI workloads.',
    icon: FaCloud,
    color: 'text-red-400',
    bgColor: 'bg-red-400/10',
    borderColor: 'border-red-400/20'
  },
  'microsoft-azure': {
    name: 'Microsoft Azure',
    description: 'Virtual machines featuring AMD Instinct MI210-series GPUs for HPC and AI applications.',
    icon: FaServer,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20'
  },
  'vultr': {
    name: 'Vultr',
    description: 'Global cloud platform offering AMD Instinct™ MI325X and MI300X GPUs for AI and HPC workloads.',
    icon: FaRocket,
    color: 'text-green-400',
    bgColor: 'bg-green-400/10',
    borderColor: 'border-green-400/20'
  },
  'hot-aisle': {
    name: 'Hot Aisle',
    description: 'Bare metal access to AMD MI300X enterprise accelerators with on-demand provisioning.',
    icon: FaShieldAlt,
    color: 'text-purple-400',
    bgColor: 'bg-purple-400/10',
    borderColor: 'border-purple-400/20'
  },
  'tensorwave': {
    name: 'TensorWave',
    description: 'AI-optimized infrastructure leveraging next-generation AMD accelerators for scalable AI workloads.',
    icon: FaChartLine,
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-400/10',
    borderColor: 'border-yellow-400/20'
  }
};

const Deploy: React.FC = () => {
  const { providerId } = useParams<{ providerId: string }>();
  const [selectedProvider, setSelectedProvider] = useState<string>(providerId || '');
  const [showDropdown, setShowDropdown] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedConfig = cloudProviders[selectedProvider as keyof typeof cloudProviders];
  const ProviderIcon = selectedConfig?.icon || FaCloud;

  const handleProviderSelect = (provider: string) => {
    setSelectedProvider(provider);
    setShowDropdown(false);
    setFocusedIndex(-1);
    // Update URL without navigation
    window.history.replaceState(null, '', `/deploy/${provider}`);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    const providerEntries = Object.entries(cloudProviders);
    
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setFocusedIndex(prev => 
          prev < providerEntries.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        event.preventDefault();
        setFocusedIndex(prev => 
          prev > 0 ? prev - 1 : providerEntries.length - 1
        );
        break;
      case 'Enter':
        event.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < providerEntries.length) {
          handleProviderSelect(providerEntries[focusedIndex][0]);
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        setFocusedIndex(-1);
        break;
    }
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
        setFocusedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  let mainContent;
  if (!selectedProvider) {
    mainContent = (
      <>
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
          {/* Homing nav link */}
          <div className='mb-6'>
            <Link
              to='/gpu-cloud'
              className='inline-flex items-center p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-blue-400 hover:text-blue-300'
              title='Back to GPU Clouds'
            >
              <FaArrowLeft className='text-xl mr-2' />
              <span className='font-medium'>Back to GPU Clouds</span>
            </Link>
          </div>
          <div className='text-center mb-12'>
            <h1 className='text-4xl font-bold text-white mb-4'>Deploy to Cloud Provider</h1>
            <p className='text-lg text-gray-300 mb-8'>Choose a cloud provider to deploy your AMD Instinct™ GPU workloads</p>
          </div>
          {/* Provider Dropdown */}
          <div className='max-w-md mx-auto mb-12'>
            <div className='relative'>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                onKeyDown={handleKeyDown}
                className='w-full bg-white/5 backdrop-blur-md border border-white/20 rounded-xl p-4 text-left flex items-center justify-between hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500'
              >
                <div className='flex items-center'>
                  <FaCloud className='text-2xl text-gray-400 mr-3' />
                  <span className='text-white font-medium'>Select Cloud Provider</span>
                </div>
                <FaChevronDown className={`text-gray-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
              </button>
              {showDropdown && (
                <div ref={dropdownRef} className='absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-white/20 rounded-xl overflow-hidden z-50 max-h-96 overflow-y-auto'>
                  {Object.entries(cloudProviders).map(([id, config]) => {
                    const Icon = config.icon;
                    return (
                      <button
                        key={id}
                        onClick={() => handleProviderSelect(id)}
                        className={`w-full p-4 text-left hover:bg-white/10 transition-colors border-b border-white/10 last:border-b-0 focus:outline-none focus:bg-white/10 ${focusedIndex === Object.keys(cloudProviders).indexOf(id) ? 'bg-white/10' : ''}`}
                      >
                        <div className='flex items-center'>
                          <div className={`w-10 h-10 ${config.bgColor} rounded-lg flex items-center justify-center mr-3`}>
                            <Icon className={`text-xl ${config.color}`} />
                          </div>
                          <div className='flex-1'>
                            <div className='text-white font-medium'>{config.name}</div>
                            <div className='text-gray-400 text-sm mt-1'>{config.description}</div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </>
    );
  } else if (!selectedConfig) {
    mainContent = (
      <div className="min-h-screen bg-neutral-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Provider Not Found</h1>
          <Link to="/deploy" className="text-blue-400 hover:underline">← Back to Provider Selection</Link>
        </div>
      </div>
    );
  } else {
    mainContent = (
      <>
        {/* Banner */}
        <div className='relative w-full h-56 md:h-72 lg:h-80 overflow-hidden'>
          <img src={bannerWave} alt='Banner' className='w-full h-full object-cover' />
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
                  title='Back to GPU Clouds'
                >
                  <FaArrowLeft className='text-xl text-gray-400' />
                </Link>
                <div className={`w-16 h-16 ${selectedConfig.bgColor} rounded-lg flex items-center justify-center mr-4`}>
                  <ProviderIcon className={`text-2xl ${selectedConfig.color}`} />
                </div>
                <div>
                  <h1 className='text-4xl font-bold text-white'>{selectedConfig.name}</h1>
                  <p className='text-lg text-gray-300'>{selectedConfig.description}</p>
                </div>
              </div>
              {/* Provider Dropdown */}
              <div className='relative'>
                <button onClick={() => setShowDropdown(!showDropdown)} onKeyDown={handleKeyDown} className='bg-white/5 backdrop-blur-md border border-white/20 rounded-xl px-4 py-2 flex items-center hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500'>
                  <div className={`w-8 h-8 ${selectedConfig.bgColor} rounded-lg flex items-center justify-center mr-3`}>
                    <ProviderIcon className={`text-lg ${selectedConfig.color}`} />
                  </div>
                  <span className='text-white font-medium mr-2'>{selectedConfig.name}</span>
                  <FaChevronDown className={`text-gray-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                </button>
                {showDropdown && (
                  <div ref={dropdownRef} className='absolute top-full right-0 mt-2 bg-gray-800 border border-white/20 rounded-xl overflow-hidden z-50 min-w-80'>
                    {Object.entries(cloudProviders).map(([id, config]) => {
                      const Icon = config.icon;
                      return (
                        <button key={id} onClick={() => handleProviderSelect(id)} className={`w-full p-3 text-left hover:bg-white/10 transition-colors border-b border-white/10 last:border-b-0 focus:outline-none focus:bg-white/10 ${id === selectedProvider ? 'bg-white/5' : ''} ${focusedIndex === Object.keys(cloudProviders).indexOf(id) ? 'bg-white/10' : ''}`}> 
                          <div className='flex items-center'>
                            <div className={`w-8 h-8 ${config.bgColor} rounded-lg flex items-center justify-center mr-3`}>
                              <Icon className={`text-lg ${config.color}`} />
                            </div>
                            <div className='flex-1'>
                              <div className='text-white font-medium'>{config.name}</div>
                              <div className='text-gray-400 text-xs mt-1'>{config.description}</div>
                            </div>
                            {id === selectedProvider && (<FaCheckCircle className='text-green-400 ml-2' />)}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* Deploy Tab */}
          <div className={`${selectedConfig.bgColor} ${selectedConfig.borderColor} border rounded-2xl p-8 mb-8`}>
            <DeployTab 
              providerId={selectedProvider}
              customHeader={
                <div className='mb-6'>
                  <h2 className='text-2xl font-bold text-white mb-2'>Deploy to {selectedConfig.name}</h2>
                  <p className='text-gray-300'>Configure and deploy your AMD Instinct™ GPU workloads</p>
                </div>
              }
              customFooter={
                <div className='mt-8 pt-6 border-t border-white/10'>
                  <div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-400'>
                    <div>
                      <h4 className='font-semibold text-white mb-2'>Quick Start</h4>
                      <ul className='space-y-1'>
                        <li>• Select instance type</li>
                        <li>• Choose region</li>
                        <li>• Deploy with one click</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className='font-semibold text-white mb-2'>Support</h4>
                      <ul className='space-y-1'>
                        <li>• 24/7 provider support</li>
                        <li>• Documentation access</li>
                        <li>• Community forums</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className='font-semibold text-white mb-2'>Resources</h4>
                      <ul className='space-y-1'>
                        <li>• Cost calculator</li>
                        <li>• Performance benchmarks</li>
                        <li>• Best practices guide</li>
                      </ul>
                    </div>
                  </div>
                </div>
              }
            />
          </div>
        </div>
      </>
    );
  }

  return (
    <IconContext.Provider value={{ size: '1em', className: 'inline-block ml-2' }}>
      <div className='min-h-screen bg-neutral-900 text-white font-sans flex flex-col'>
        {mainContent}
        {/* Management Tiles Always Visible */}
        <div className='w-full max-w-[1400px] mx-auto px-8 pb-12'>
          <div className='mb-8'>
            <CombinedCloudManager />
          </div>
        </div>
      </div>
    </IconContext.Provider>
  );
};

export default Deploy; 