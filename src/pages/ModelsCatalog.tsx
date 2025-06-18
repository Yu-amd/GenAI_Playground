import React from 'react';
import bannerWave from '../assets/banner_wave.png';
import llamaImg from '../assets/models/model_llama3_1.png';
import qwen2Img from '../assets/models/model_Qwen2-7B.png';
import deepseekImg from '../assets/models/model_DeepSeek_MoE_18B.png';
import gemmaImg from '../assets/models/model_Gemma.png';

import { NavLink, Link } from 'react-router-dom';
import { models } from '../data/models'; // Use shared data

// Remove the local models array here

const ModelsCatalog: React.FC = () => {
  return (
    <div className="min-h-screen bg-neutral-900 text-white font-sans flex flex-col">
      {/* Banner */}
      <div className="relative w-full h-56 md:h-72 lg:h-80 overflow-hidden">
        <img src={bannerWave} alt="Banner" className="w-full h-full object-cover" />
        <nav className="absolute top-0 left-0 w-full flex justify-center gap-16 pt-8 z-10">
          <Link to="/models" className="text-2xl font-bold transition relative px-2 opacity-80 hover:opacity-100 after:content-[''] after:block after:h-1 after:rounded after:mt-1 after:w-0 after:bg-red-500 hover:after:w-full">Models</Link>
          <Link to="/blueprints" className="text-2xl font-bold transition relative px-2 opacity-80 hover:opacity-100 after:content-[''] after:block after:h-1 after:rounded after:mt-1 after:w-0 after:bg-red-500 hover:after:w-full">Blueprints</Link>
          <Link to="/gpu-cloud" className="text-2xl font-bold transition relative px-2 opacity-80 hover:opacity-100 after:content-[''] after:block after:h-1 after:rounded after:mt-1 after:w-0 after:bg-red-500 hover:after:w-full">GPU Clouds</Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-7xl mx-auto py-12 px-4 flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full items-stretch">
          {models.map((model) => (
            <Link
              key={model.id}
              to={`/models/${model.id}`}
              className="group bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg p-10 flex flex-row items-center hover:bg-white/20 hover:shadow-2xl hover:shadow-white/30 hover:-translate-y-1 transition-all cursor-pointer h-[280px] w-full"
            >
              <img
                src={model.image}
                alt={model.name}
                className="w-32 h-32 object-cover rounded-2xl border-2 border-neutral-700 shadow-md transition mr-10 flex-shrink-0"
              />
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <div className="text-base text-blue-400 font-semibold mb-2 truncate">{model.org}</div>
                <h2 className="text-3xl font-bold mb-3 group-hover:text-blue-400 transition truncate">{model.name}</h2>
                <div className="text-base text-neutral-200">{model.description}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModelsCatalog; 

