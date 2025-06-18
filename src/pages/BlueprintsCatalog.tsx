import React from 'react';
import bannerWave from '../assets/banner_wave.png';
import { Link } from 'react-router-dom';

// Sample blueprint data
const blueprints = [
  {
    id: 'text-gen-pipeline',
    name: 'Text Generation Pipeline',
    description: 'End-to-end pipeline for text generation tasks with customizable parameters.',
    lastUpdated: '2024-03-16',
    image: bannerWave, // Placeholder, replace with blueprint-specific image if available
  },
  {
    id: 'qa-system',
    name: 'Question Answering System',
    description: 'A blueprint for building robust QA systems using LLMs and retrieval.',
    lastUpdated: '2024-04-02',
    image: bannerWave,
  },
  {
    id: 'summarization',
    name: 'Summarization Workflow',
    description: 'Pipeline for document and multi-document summarization tasks.',
    lastUpdated: '2024-03-28',
    image: bannerWave,
  },
];

const BlueprintsCatalog: React.FC = () => {
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
          {blueprints.map((bp) => (
            <div
              key={bp.id}
              className="group bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg p-10 flex flex-row items-center hover:bg-white/20 hover:shadow-2xl hover:shadow-white/30 hover:-translate-y-1 transition-all cursor-pointer h-[220px] w-full"
            >
              <img
                src={bp.image}
                alt={bp.name}
                className="w-28 h-28 object-cover rounded-2xl border-2 border-neutral-700 shadow-md transition mr-10 flex-shrink-0"
              />
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <h2 className="text-2xl font-bold mb-2 group-hover:text-blue-400 transition truncate">{bp.name}</h2>
                <div className="text-base text-neutral-200 mb-4">{bp.description}</div>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-sm text-gray-400">Last Updated: {bp.lastUpdated}</span>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold">View Details</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlueprintsCatalog; 