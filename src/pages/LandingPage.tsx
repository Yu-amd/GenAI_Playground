import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaRocket,
  FaBrain,
  FaCloud,
  FaCode,
  FaComments,
  FaArrowRight,
  FaPlay,
  FaBookOpen,
  FaServer,
} from 'react-icons/fa';
import bannerWave from '../assets/banner_wave.png';
import bp_chatqna from '../assets/blueprints/bp_chatqna.png';
import bp_codetrans from '../assets/blueprints/bp_codeTrans.png';
import bp_docsum from '../assets/blueprints/bp_docsum.png';
import PlaygroundLogo from '../components/PlaygroundLogo';
import { loadAllModels } from '../utils/modelLoader';

const LandingPage: React.FC = () => {
  // Dynamically load models from the catalog
  const [featuredModels, setFeaturedModels] = useState<
    Array<{
      id: string;
      name: string;
      localCard: string;
      org: string;
      description: string;
    }>
  >([]);

  useEffect(() => {
    async function fetchModels() {
      const models = await loadAllModels();
      setFeaturedModels(models.slice(0, 4)); // Show first 4 models
    }
    fetchModels();
  }, []);

  const featuredBlueprints = [
    {
      id: 'chatqna',
      name: 'ChatQnA',
      image: bp_chatqna,
      description: 'RAG-powered chatbot with knowledge base management',
      icon: FaComments,
    },
    {
      id: 'codetrans',
      name: 'CodeTrans',
      image: bp_codetrans,
      description: 'Cross-language code translation and transpilation',
      icon: FaCode,
    },
    {
      id: 'docsum',
      name: 'DocSum',
      image: bp_docsum,
      description: 'Document summarization and key insight extraction',
      icon: FaBookOpen,
    },
  ];

  const features = [
    {
      icon: FaRocket,
      title: 'Instinct GPU Powered',
      description:
        'Optimized for AMD Instinct™ GPUs with ROCm™ software stack for maximum performance',
    },
    {
      icon: FaBrain,
      title: 'Cutting-Edge Models',
      description:
        'Access to the latest language models optimized for Instinct GPU acceleration',
    },
    {
      icon: FaCode,
      title: 'Ready-to-Use Blueprints',
      description:
        'Pre-built GenAI applications tested and optimized for AMD Instinct™ GPUs',
    },
    {
      icon: FaCloud,
      title: 'Seamless Cloud Access',
      description:
        'Easy deployment on AMD Instinct™ GPUs across multiple cloud providers',
    },
  ];

  const stats = [
    { number: '4+', label: 'Featured Models' },
    { number: '8+', label: 'AI Blueprints' },
    { number: '6+', label: 'Cloud Providers' },
    { number: '100%', label: 'Open Source' },
  ];

  return (
    <div className='min-h-screen bg-neutral-900 text-white font-sans'>
      {/* Hero Section */}
      <div className='relative w-full h-screen overflow-hidden'>
        <img
          src={bannerWave}
          alt='Banner'
          className='w-full h-full object-cover'
        />
        <div className='absolute inset-0 bg-black/50'></div>

        {/* Navigation */}
        <nav className='absolute top-0 left-0 w-full flex justify-between items-center pt-8 px-8 z-20'>
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

        {/* Hero Content */}
        <div className='absolute inset-0 flex items-center justify-center z-10'>
          <div className='text-center max-w-4xl mx-auto px-8'>
            <h1 className='text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-red-500 bg-clip-text text-transparent'>
              GenAI Playground
            </h1>
            <p className='text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed'>
              Experience the power of AMD Instinct™ GPUs with cutting-edge AI
              models, ready-to-use blueprints, and seamless cloud infrastructure
              for your GenAI workloads
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <Link
                to='/models'
                className='bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-2 group'
              >
                Explore Models{' '}
                <div className='group-hover:translate-x-1 transition-transform'>
                  <FaArrowRight />
                </div>
              </Link>
              <Link
                to='/blueprints'
                className='bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 border border-white/30 flex items-center justify-center gap-2'
              >
                <FaPlay size={16} /> Try Blueprints
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className='absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10'>
          <div className='flex flex-col items-center text-white/40 hover:text-white/60 transition-colors duration-500 cursor-pointer group'>
            <svg
              width='24'
              height='24'
              viewBox='0 0 24 24'
              className='group-hover:translate-y-1 transition-transform duration-500'
              fill='none'
              stroke='currentColor'
              strokeWidth='2.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <path
                d='M3 6l9 5 9-5M3 13l9 5 9-5'
                className='opacity-30 group-hover:opacity-50 transition-opacity duration-500'
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className='py-16 bg-gradient-to-r from-blue-900/20 to-purple-900/20'>
        <div className='max-w-6xl mx-auto px-8'>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-8'>
            {stats.map((stat, index) => (
              <div key={index} className='text-center'>
                <div className='text-4xl md:text-5xl font-bold text-blue-400 mb-2'>
                  {stat.number}
                </div>
                <div className='text-gray-300'>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className='py-20'>
        <div className='max-w-6xl mx-auto px-8'>
          <div className='text-center mb-16'>
            <h2 className='text-4xl font-bold mb-4'>
              Explore How Easy It Is to Run GenAI Workloads on Instinct GPUs!
            </h2>
            <p className='text-xl text-gray-300'>
              Leverage AMD Instinct™ GPU power for your AI applications
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
            {features.map((feature, index) => (
              <div
                key={index}
                className='text-center p-6 rounded-xl bg-transparent'
              >
                <div className='w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4'>
                  <feature.icon size={24} />
                </div>
                <h3 className='text-xl font-semibold mb-3'>{feature.title}</h3>
                <p className='text-gray-300'>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Models Section */}
      <div className='py-20 bg-gradient-to-r from-neutral-800/50 to-neutral-900/50'>
        <div className='max-w-6xl mx-auto px-8'>
          <div className='text-center mb-16'>
            <h2 className='text-4xl font-bold mb-4'>Featured AI Models</h2>
            <p className='text-xl text-gray-300'>
              Optimized language models running on AMD Instinct™ GPUs
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            {featuredModels.map(model => (
              <Link
                key={model.id}
                to={`/models/${model.id}`}
                className='group bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 hover:bg-white/20 hover:shadow-2xl hover:shadow-white/10 hover:-translate-y-2 transition-all duration-300'
              >
                <div className='w-full h-32 rounded-lg mb-4 overflow-hidden'>
                  <img
                    src={model.localCard}
                    alt={model.name}
                    className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
                  />
                </div>
                <div className='text-sm text-blue-400 font-semibold mb-1'>
                  {model.org}
                </div>
                <h3 className='text-lg font-bold mb-2 group-hover:text-blue-400 transition-colors'>
                  {model.name}
                </h3>
                <p className='text-sm text-gray-300 line-clamp-2'>
                  {model.description}
                </p>
              </Link>
            ))}
          </div>

          <div className='text-center mt-12'>
            <Link
              to='/models'
              className='inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300'
            >
              View All Models{' '}
              <div className='group-hover:translate-x-1 transition-transform'>
                <FaArrowRight />
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Blueprints Section */}
      <div className='py-20'>
        <div className='max-w-6xl mx-auto px-8'>
          <div className='text-center mb-16'>
            <h2 className='text-4xl font-bold mb-4'>
              Ready-to-Use AI Blueprints
            </h2>
            <p className='text-xl text-gray-300'>
              Pre-built GenAI applications optimized for AMD Instinct™ GPUs
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            {featuredBlueprints.map(blueprint => (
              <Link
                key={blueprint.id}
                to={`/blueprints/${blueprint.id}`}
                className='group bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 hover:bg-white/20 hover:shadow-2xl hover:shadow-white/10 hover:-translate-y-2 transition-all duration-300 flex flex-col'
              >
                <div className='relative w-full h-48 mb-4'>
                  <div className='w-full h-full rounded-lg overflow-hidden'>
                    <img
                      src={blueprint.image}
                      alt={blueprint.name}
                      className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
                    />
                  </div>
                  <div className='absolute bottom-[-1rem] right-2 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center border-4 border-neutral-800'>
                    <blueprint.icon size={20} />
                  </div>
                </div>

                <div className='flex-grow mt-4'>
                  <h3 className='text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors'>
                    {blueprint.name}
                  </h3>
                  <p className='text-gray-300 text-sm mb-3'>
                    {blueprint.description}
                  </p>
                </div>

                <div className='flex items-center text-blue-400 font-semibold group-hover:underline mt-auto'>
                  Try Blueprint{' '}
                  <div className='group-hover:translate-x-1 transition-transform'>
                    <FaArrowRight />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className='text-center mt-12'>
            <Link
              to='/blueprints'
              className='inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300'
            >
              Explore All Blueprints <FaBookOpen />
            </Link>
          </div>
        </div>
      </div>

      {/* GPU Cloud Section */}
      <div className='py-20 bg-gradient-to-r from-neutral-800/50 to-neutral-900/50'>
        <div className='max-w-6xl mx-auto px-8'>
          <div className='text-center mb-16'>
            <h2 className='text-4xl font-bold mb-4'>
              AMD Instinct™ GPU Cloud Access
            </h2>
            <p className='text-xl text-gray-300'>
              High-performance AMD Instinct™ accelerators for your GenAI
              workloads
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mb-12'>
            <div className='bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-8'>
              <div className='w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center mb-6'>
                <FaServer size={24} />
              </div>
              <h3 className='text-2xl font-bold mb-4'>AMD Developer Cloud</h3>
              <p className='text-gray-300 mb-6'>
                Access the latest AMD Instinct™ accelerators and ROCm™
                software in a pre-configured environment.
              </p>
              <Link
                to='/gpu-cloud'
                className='inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300'
              >
                Learn More <FaArrowRight />
              </Link>
            </div>

            <div className='bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-8'>
              <div className='w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mb-6'>
                <FaCloud size={24} />
              </div>
              <h3 className='text-2xl font-bold mb-4'>
                Public Cloud Providers
              </h3>
              <p className='text-gray-300 mb-6'>
                Access AMD Instinct™ GPUs through leading cloud providers
                including Vultr, Azure, Oracle, and more.
              </p>
              <Link
                to='/gpu-cloud'
                className='inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300'
              >
                View Providers <FaArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Enterprise Contact Section */}
      <div className='py-20 bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-t border-white/10'>
        <div className='max-w-4xl mx-auto px-8 text-center'>
          <h2 className='text-4xl font-bold mb-6'>
            Ready for Enterprise Deployment?
          </h2>
          <p className='text-xl text-gray-300 mb-8'>
            Scale your GenAI initiatives with AMD Instinct™ GPUs and
            enterprise-grade support
          </p>
          <a
            href='mailto:enterprise@genaiplayground.com'
            className='bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-2 mx-auto w-fit'
          >
            Contact Enterprise Sales
          </a>
        </div>
      </div>

      {/* Footer */}
      <footer className='py-12 bg-neutral-800 border-t border-white/10'>
        <div className='max-w-6xl mx-auto px-8 text-center'>
          <p className='text-gray-400 mb-4'>
            GenAI Playground - Unleashing the power of AMD Instinct™ GPUs for
            artificial intelligence
          </p>
          <div className='flex justify-center gap-8 text-sm text-gray-500'>
            <span>© 2025 GenAI Playground</span>
            <span>•</span>
            <span>Open Source</span>
            <span>•</span>
            <span>Enterprise Ready</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
