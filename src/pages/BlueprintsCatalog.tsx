import React from 'react';
import bannerWave from '../assets/banner_wave.png';
import { Link } from 'react-router-dom';
import BlueprintCard from '../components/BlueprintCard';

import bp_chatqna from '../assets/blueprints/bp_chatqna.png';
import bp_agentqna from '../assets/blueprints/bp_agentqna.png';
import bp_codegen from '../assets/blueprints/bp_codegen.png';
import bp_codeTrans from '../assets/blueprints/bp_codeTrans.png';
import bp_searchQna from '../assets/blueprints/bp_searchQna.png';
import bp_docsum from '../assets/blueprints/bp_docsum.png';
import bp_translation from '../assets/blueprints/bp_translation.png';
import bp_avatarchatbot from '../assets/blueprints/bp_avatarchatbot.png';

const blueprints = [
  {
    id: 'chatqna',
    name: 'ChatQnA',
    description: 'Chatbot application based on Retrieval Augmented Generation architecture.',
    image: bp_chatqna,
  },
  {
    id: 'agentqna',
    name: 'AgentQnA',
    description: 'A hierarchical multi-agent system for question-answering applications.',
    image: bp_agentqna,
  },
  {
    id: 'codegen',
    name: 'CodeGen',
    description: 'A code copilot application for executing code generation.',
    image: bp_codegen,
  },
  {
    id: 'codetrans',
    name: 'CodeTrans',
    description: 'A code translation example which converts code from one programming language to another programming language.',
    image: bp_codeTrans,
  },
  {
    id: 'searchqna',
    name: 'SearchQnA',
    description: 'An example of improving QnA application quality by expanding the pipeline with the Google search engine.',
    image: bp_searchQna,
  },
  {
    id: 'docsum',
    name: 'DocSum',
    description: 'A sample app which creates summaries of different types of text.',
    image: bp_docsum,
  },
  {
    id: 'translation',
    name: 'Translation',
    description: 'An application which demonstrates language translation inference.',
    image: bp_translation,
  },
  {
    id: 'avatarchatbot',
    name: 'Avatar Chatbot',
    description: 'Integrates a conversational chatbot with a virtual avatar.',
    image: bp_avatarchatbot,
  },
];

const OPEA_LABEL = 'Open Platform for Enterprise AI';

const BlueprintsCatalog: React.FC = () => {
  return (
    <div className="min-h-screen bg-neutral-900 text-white font-sans flex flex-col">
      {/* Banner */}
      <div className="relative w-full h-56 md:h-72 lg:h-80 overflow-hidden">
        <img src={bannerWave} alt="Banner" className="w-full h-full object-cover" />
        <nav className="absolute top-0 left-0 w-full flex justify-center gap-16 pt-8 z-10">
          <Link to="/models" className="text-2xl font-bold transition relative px-2 opacity-80 hover:opacity-100">Models</Link>
          <Link to="/blueprints" className="text-2xl font-bold transition relative px-2 opacity-100 after:content-[''] after:block after:h-1 after:rounded after:mt-1 after:w-full after:bg-white">Blueprints</Link>
          <Link to="/gpu-cloud" className="text-2xl font-bold transition relative px-2 opacity-80 hover:opacity-100">GPU Clouds</Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-[1600px] mx-auto py-12 px-8 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full items-stretch">
          {blueprints.map((bp) => (
            <Link
              key={bp.id}
              to={`/blueprints/${bp.id}`}
              className="group bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg p-10 flex flex-row items-center hover:bg-white/20 hover:shadow-2xl hover:shadow-white/30 hover:-translate-y-1 transition-all cursor-pointer h-[280px] w-full"
            >
              <img
                src={bp.image}
                alt={bp.name}
                className="w-36 h-36 object-cover rounded-2xl border-2 border-neutral-700 shadow-md transition mr-10 flex-shrink-0"
              />
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <div className="text-base text-blue-400 font-semibold mb-1 truncate">{OPEA_LABEL}</div>
                <h2 className="text-2xl font-bold mb-2 group-hover:text-blue-400 transition truncate">{bp.name}</h2>
                <div className="text-sm text-neutral-200 line-clamp-3">{bp.description}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlueprintsCatalog; 