import React from 'react';
import { Link } from 'react-router-dom';
import bannerWave from '../assets/banner_wave.png';
import llamaImg from '../assets/models/model_llama3_1.png';
import qwen2Img from '../assets/models/model_Qwen2-7B.png';
import deepseekImg from '../assets/models/model_DeepSeek_MoE_18B.png';
import gemmaImg from '../assets/models/model_Gemma.png';

interface Model {
  id: string;
  org: string;
  name: string;
  description: string;
  image: string;
  localCard: string;
  lastUpdated: string;
}

const models: Model[] = [
  {
    id: 'meta-llama/Llama-3-8B',
    org: 'Meta',
    name: 'Llama 3 8B',
    description: 'The Meta Llama 3.1 collection of multilingual large language models (LLMs) is a collection of pretrained and instruction tuned generative models in 8B, 70B and 405B sizes (text in/text out).',
    image: bannerWave,
    localCard: llamaImg,
    lastUpdated: '2024-03-15'
  },
  {
    id: 'Qwen/Qwen2-7B-Instruct',
    org: 'Qwen',
    name: 'Qwen2 7B',
    description: 'Qwen2 has generally surpassed most open-source models and demonstrated competitiveness against proprietary models across a series of benchmarks targeting for language understanding, language generation, multilingual capability, coding, mathematics, reasoning, etc.',
    image: bannerWave,
    localCard: qwen2Img,
    lastUpdated: '2024-03-20'
  },
  {
    id: 'deepseek-ai/deepseek-moe-16b-base',
    org: 'DeepSeek',
    name: 'DeepSeek MoE 16B',
    description: 'Mixture-of-Experts (MoE) language model with 16.4B parameters. It employs an innovative MoE architecture, which involves two principal strategies: fine-grained expert segmentation and shared experts isolation.',
    image: bannerWave,
    localCard: deepseekImg,
    lastUpdated: '2024-03-25'
  },
  {
    id: 'google/gemma-3-4b-it',
    org: 'Google',
    name: 'Gemma 3',
    description: 'Gemma is a family of lightweight, state-of-the-art open models from Google, built from the same research and technology used to create the Gemini models. Gemma 3 models are multimodal, handling text and image input and generating text output, with open weights for both pre-trained variants and instruction-tuned variants.',
    image: bannerWave,
    localCard: gemmaImg,
    lastUpdated: '2024-03-28'
  }
];

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
      <div className="w-full max-w-[1600px] mx-auto py-12 px-8 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full items-stretch">
          {models.map((model) => (
            <Link
              key={model.id}
              to={`/models/${model.id}`}
              className="group bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg p-10 flex flex-row items-center hover:bg-white/20 hover:shadow-2xl hover:shadow-white/30 hover:-translate-y-1 transition-all cursor-pointer h-[280px] w-full"
            >
              <img
                src={model.localCard}
                alt={model.name}
                className="w-36 h-36 object-cover rounded-2xl border-2 border-neutral-700 shadow-md transition mr-10 flex-shrink-0"
              />
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <div className="text-base text-blue-400 font-semibold mb-1 truncate">{model.org}</div>
                <h2 className="text-2xl font-bold mb-2 group-hover:text-blue-400 transition truncate">{model.name}</h2>
                <div className="text-sm text-neutral-200 line-clamp-3">{model.description}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModelsCatalog; 

