import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaShieldAlt, FaCreativeCommons, FaLock } from 'react-icons/fa';
import bannerWave from '../assets/banner_wave.png';
import PlaygroundLogo from '../components/PlaygroundLogo';
import { loadAllModels } from '../utils/modelLoader';
import type { ModelCatalogItem } from '../utils/modelLoader';

const ModelsCatalog: React.FC = () => {
  const [models, setModels] = useState<ModelCatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        setLoading(true);
        const modelData = await loadAllModels();
        setModels(modelData);
      } catch (err) {
        console.error('Failed to load models:', err);
        setError('Failed to load model catalog. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-900 text-white font-sans flex flex-col">
        {/* Banner */}
        <div className="relative w-full h-56 md:h-72 lg:h-80 overflow-hidden">
          <img src={bannerWave} alt="Banner" className="w-full h-full object-cover" />
          <nav className="absolute top-0 left-0 w-full flex justify-between items-center pt-8 px-8 z-10">
            <PlaygroundLogo />
            <div className="flex gap-16">
              <Link to="/models" className="text-2xl font-bold transition relative px-2 opacity-80 hover:opacity-100 after:content-[''] after:block after:h-1 after:rounded after:mt-1 after:w-0 after:bg-red-500 hover:after:w-full">Models</Link>
              <Link to="/blueprints" className="text-2xl font-bold transition relative px-2 opacity-80 hover:opacity-100 after:content-[''] after:block after:h-1 after:rounded after:mt-1 after:w-0 after:bg-red-500 hover:after:w-full">Blueprints</Link>
              <Link to="/gpu-cloud" className="text-2xl font-bold transition relative px-2 opacity-80 hover:opacity-100 after:content-[''] after:block after:h-1 after:rounded after:mt-1 after:w-0 after:bg-red-500 hover:after:w-full">GPU Clouds</Link>
            </div>
          </nav>
        </div>

        {/* Loading State */}
        <div className="w-full max-w-[1600px] mx-auto py-12 px-8 flex-1">
          <div className="flex items-center justify-center h-64">
            <div className="text-xl text-neutral-300">Loading model catalog...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-900 text-white font-sans flex flex-col">
        {/* Banner */}
        <div className="relative w-full h-56 md:h-72 lg:h-80 overflow-hidden">
          <img src={bannerWave} alt="Banner" className="w-full h-full object-cover" />
          <nav className="absolute top-0 left-0 w-full flex justify-between items-center pt-8 px-8 z-10">
            <PlaygroundLogo />
            <div className="flex gap-16">
              <Link to="/models" className="text-2xl font-bold transition relative px-2 opacity-80 hover:opacity-100 after:content-[''] after:block after:h-1 after:rounded after:mt-1 after:w-0 after:bg-red-500 hover:after:w-full">Models</Link>
              <Link to="/blueprints" className="text-2xl font-bold transition relative px-2 opacity-80 hover:opacity-100 after:content-[''] after:block after:h-1 after:rounded after:mt-1 after:w-0 after:bg-red-500 hover:after:w-full">Blueprints</Link>
              <Link to="/gpu-cloud" className="text-2xl font-bold transition relative px-2 opacity-80 hover:opacity-100 after:content-[''] after:block after:h-1 after:rounded after:mt-1 after:w-0 after:bg-red-500 hover:after:w-full">GPU Clouds</Link>
            </div>
          </nav>
        </div>

        {/* Error State */}
        <div className="w-full max-w-[1600px] mx-auto py-12 px-8 flex-1">
          <div className="flex items-center justify-center h-64">
            <div className="text-xl text-red-400">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-900 text-white font-sans flex flex-col">
      {/* Banner */}
      <div className="relative w-full h-56 md:h-72 lg:h-80 overflow-hidden">
        <img src={bannerWave} alt="Banner" className="w-full h-full object-cover" />
        <nav className="absolute top-0 left-0 w-full flex justify-between items-center pt-8 px-8 z-10">
          <PlaygroundLogo />
          <div className="flex gap-16">
            <Link to="/models" className="text-2xl font-bold transition relative px-2 opacity-80 hover:opacity-100 after:content-[''] after:block after:h-1 after:rounded after:mt-1 after:w-0 after:bg-red-500 hover:after:w-full">Models</Link>
            <Link to="/blueprints" className="text-2xl font-bold transition relative px-2 opacity-80 hover:opacity-100 after:content-[''] after:block after:h-1 after:rounded after:mt-1 after:w-0 after:bg-red-500 hover:after:w-full">Blueprints</Link>
            <Link to="/gpu-cloud" className="text-2xl font-bold transition relative px-2 opacity-80 hover:opacity-100 after:content-[''] after:block after:h-1 after:rounded after:mt-1 after:w-0 after:bg-red-500 hover:after:w-full">GPU Clouds</Link>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-[1600px] mx-auto py-12 px-8 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full items-stretch">
          {models.map((model) => (
            <Link
              key={model.id}
              to={`/models/${model.id}`}
              className="group bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg p-0 flex flex-row items-stretch hover:bg-white/20 hover:shadow-2xl hover:shadow-white/30 hover:-translate-y-1 transition-all cursor-pointer h-[280px] w-full relative"
              title="open in playground"
            >
              {/* Corner Ribbon Badge */}
              <div className={`absolute top-0 right-0 z-20 px-4 py-1 text-xs font-bold rounded-bl-2xl ${
                model.badge === 'New' ? 'bg-green-600 text-white' :
                model.badge === 'Tech Preview' ? 'bg-yellow-500 text-black' :
                model.badge === 'Featured' ? 'bg-blue-600 text-white' :
                'bg-neutral-700 text-white'
              } shadow-lg`}>{model.badge}</div>
              {/* Logo */}
              <div className="flex items-center justify-center w-40 h-full bg-white/5 rounded-l-2xl border-r border-white/10">
                <img
                  src={model.localCard}
                  alt={model.name}
                  className="w-32 h-32 object-cover rounded-xl border-2 border-neutral-700 shadow-md bg-white/10"
                />
              </div>
              {/* Info */}
              <div className="flex-1 min-w-0 flex flex-col justify-center px-8 py-6">
                {/* Builder/Publisher */}
                <div className="text-xs text-blue-300 font-semibold mb-1 truncate">{model.builder}</div>
                {/* Model Family */}
                <div className="text-xs text-neutral-400 mb-1 truncate">{model.family}</div>
                {/* Model Name + Variant */}
                <div className="flex items-baseline gap-2 mb-1">
                  <h2 className="text-2xl font-bold group-hover:text-blue-400 transition truncate">{model.name}</h2>
                </div>
                {/* Short Description */}
                <div className="text-sm text-neutral-200 mb-3 line-clamp-2">{model.shortDescription}</div>
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className={`px-2 py-1 rounded text-xs ${
                    model.useCase === 'Text Generation' ? 'bg-blue-900/50 text-blue-200' :
                    model.useCase === 'Code Generation' ? 'bg-green-900/50 text-green-200' :
                    model.useCase === 'Efficient LLM' ? 'bg-purple-900/50 text-purple-200' :
                    model.useCase === 'Multimodal' ? 'bg-orange-900/50 text-orange-200' :
                    'bg-blue-900/50 text-blue-200'
                  }`}>{model.useCase}</span>
                  <span className="px-2 py-1 rounded text-xs bg-green-900/50 text-green-200">{model.precision}</span>
                  <div className="flex items-center gap-1 px-2 py-1 rounded text-xs bg-neutral-700/40 text-neutral-300">
                    {model.license === 'Apache 2.0' ? (
                      <FaShieldAlt size={12} />
                    ) : model.license === 'Meta RAIL' ? (
                      <FaLock size={12} />
                    ) : (
                      <FaCreativeCommons size={12} />
                    )}
                    <span>{model.license}</span>
                  </div>
                  {model.compatibility.map((c, i) => (
                    <span key={i} className="px-2 py-1 rounded text-xs bg-neutral-700/40 text-neutral-300">{c}</span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModelsCatalog; 

