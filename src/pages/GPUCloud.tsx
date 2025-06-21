import React from 'react';
import { Link } from 'react-router-dom';
import bannerWave from '../assets/banner_wave.png';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { IconContext } from 'react-icons';
import PlaygroundLogo from '../components/PlaygroundLogo';

const amdDeveloperCloud = {
  name: 'AMD Developer Cloud',
  description: 'Enables developers to remotely access the latest AMD Instinct™ accelerators and ROCm™ software. Get access to AMD Instinct™ MI300 accelerators in a pre-configured environment.',
  link: 'https://www.amd.com/en/developer/resources/cloud-access/amd-developer-cloud.html',
};

const publicClouds = [
  {
    name: 'Vultr',
    description: 'Offers AMD Instinct™ MI325X and MI300X GPUs for AI and HPC workloads with global data center regions.',
    link: 'https://www.vultr.com/products/cloud-gpu/amd-mi325x-mi300x/',
  },
  {
    name: 'Oracle Cloud Infrastructure',
    description: 'Provides AMD Instinct™ MI300X GPUs in bare metal compute instances for high-performance AI workloads.',
    link: 'https://www.oracle.com/cloud/compute/gpu/',
  },
  {
    name: 'Microsoft Azure',
    description: 'Offers virtual machines featuring AMD Instinct MI200-series GPUs for HPC and AI applications.',
    link: 'https://azure.microsoft.com/en-us/blog/new-azure-virtual-machines-for-hpc-and-ai-now-available/',
  },
  {
    name: 'IBM Cloud',
    description: 'Provides access to the latest generation of AMD EPYC™ processors, suitable for various HPC workloads.',
    link: 'https://www.ibm.com/cloud/bare-metal-servers/amd',
  },
  {
    name: 'Hot Aisle',
    description: 'A NeoCloud service provider offering on-demand, bare metal access to AMD MI300X enterprise accelerators.',
    link: 'https://hotaisle.xyz/',
  },
  {
    name: 'TensorWave',
    description: 'Leverages the next generation of AMD accelerators to provide scalable, memory-optimized infrastructure for AI.',
    link: 'https://tensorwave.com/',
  },
];

const GPUCloud: React.FC = () => {
  return (
    <IconContext.Provider value={{ size: '1em', className: 'inline-block ml-2' }}>
      <div className="min-h-screen bg-neutral-900 text-white font-sans flex flex-col">
        {/* Banner */}
        <div className="relative w-full h-56 md:h-72 lg:h-80 overflow-hidden">
          <img src={bannerWave} alt="Banner" className="w-full h-full object-cover" />
          <nav className="absolute top-0 left-0 w-full flex justify-between items-center pt-8 px-8 z-10">
            <PlaygroundLogo />
            <div className="flex gap-16">
              <Link to="/models" className="text-2xl font-bold transition relative px-2 opacity-80 hover:opacity-100">Models</Link>
              <Link to="/blueprints" className="text-2xl font-bold transition relative px-2 opacity-80 hover:opacity-100">Blueprints</Link>
              <Link to="/gpu-cloud" className="text-2xl font-bold transition relative px-2 opacity-100 after:content-[''] after:block after:h-1 after:rounded after:mt-1 after:w-full after:bg-white">GPU Clouds</Link>
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="w-full max-w-[1200px] mx-auto py-12 px-8 flex-1">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">AMD Instinct™ GPU Cloud Access</h1>
            <p className="text-lg text-gray-300">Explore cloud options for accessing AMD Instinct™ series GPUs for your AI and HPC workloads.</p>
          </div>

          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-6 border-b-2 border-blue-500 pb-2">AMD Developer Cloud</h2>
             <a 
                href={amdDeveloperCloud.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group bg-white/5 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg p-8 transition-all hover:bg-white/10 hover:shadow-2xl hover:-translate-y-1 flex flex-col"
              >
                <h3 className="text-2xl font-bold text-blue-400 mb-4">{amdDeveloperCloud.name}</h3>
                <p className="text-gray-300 flex-grow">{amdDeveloperCloud.description}</p>
                 <div className="mt-6 text-sm font-semibold text-blue-400 group-hover:underline">
                  Learn More <FaExternalLinkAlt />
                </div>
              </a>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-white mb-6 border-b-2 border-blue-500 pb-2">Public Cloud Providers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {publicClouds.map((cloud, index) => (
                <a 
                  key={index} 
                  href={cloud.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group bg-white/5 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg p-8 transition-all hover:bg-white/10 hover:shadow-2xl hover:-translate-y-1 flex flex-col"
                >
                  <h3 className="text-2xl font-bold text-blue-400 mb-4">{cloud.name}</h3>
                  <p className="text-gray-300 flex-grow">{cloud.description}</p>
                   <div className="mt-6 text-sm font-semibold text-blue-400 group-hover:underline">
                    Visit Provider <FaExternalLinkAlt />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </IconContext.Provider>
  );
};

export default GPUCloud; 