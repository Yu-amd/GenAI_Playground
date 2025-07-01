import React from 'react';
import bannerWave from '../assets/banner_wave.png';
import { Link } from 'react-router-dom';
import PlaygroundLogo from '../components/PlaygroundLogo';

import bp_chatqna from '../assets/blueprints/bp_chatqna.png';
import bp_agentqna from '../assets/blueprints/bp_agentqna.png';
// import bp_codegen from '../assets/blueprints/bp_codegen.png';
import bp_codeTrans from '../assets/blueprints/bp_codeTrans.png';
// import bp_searchQna from '../assets/blueprints/bp_searchQna.png';
import bp_docsum from '../assets/blueprints/bp_docsum.png';
// import bp_translation from '../assets/blueprints/bp_translation.png';
// import bp_avatarchatbot from '../assets/blueprints/bp_avatarchatbot.png';

interface Blueprint {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  image: string;
  tags: string[];
  category: string;
  complexity: string;
  status: string;
  badge?: string;
}

const blueprints: Blueprint[] = [
  {
    id: 'chatqna',
    name: 'ChatQnA',
    description:
      'Chatbot application based on Retrieval Augmented Generation architecture.',
    shortDescription:
      'RAG-based chatbot for knowledge base interactions with advanced retrieval capabilities.',
    image: bp_chatqna,
    tags: ['RAG', 'Chatbot', 'Knowledge Base'],
    category: 'Conversational AI',
    complexity: 'Intermediate',
    status: 'Production Ready',
    badge: 'Featured',
  },
  {
    id: 'agentqna',
    name: 'AgentQnA',
    description:
      'A hierarchical multi-agent system for question-answering applications.',
    shortDescription:
      'Multi-agent orchestration system for complex question-answering workflows.',
    image: bp_agentqna,
    tags: ['Multi-Agent', 'Hierarchical', 'Orchestration'],
    category: 'Multi-Agent Systems',
    complexity: 'Advanced',
    status: 'Tech Preview',
    badge: 'New',
  },
  {
    id: 'codetrans',
    name: 'CodeTrans',
    description:
      'A code translation example which converts code from one programming language to another programming language.',
    shortDescription:
      'Cross-language code translation and transpilation with syntax preservation.',
    image: bp_codeTrans,
    tags: ['Code Translation', 'Language Conversion', 'Transpilation'],
    category: 'Development Tools',
    complexity: 'Advanced',
    status: 'Production Ready',
  },
  {
    id: 'docsum',
    name: 'DocSum',
    description:
      'Documentation summarization workflow system that processes technical documentation, API docs, and code comments to generate concise summaries and extract key insights.',
    shortDescription:
      'Summarize technical documentation and extract key insights from code comments and API docs.',
    image: bp_docsum,
    tags: ['Documentation', 'Technical Writing', 'API Docs'],
    category: 'Document AI',
    complexity: 'Intermediate',
    status: 'Production Ready',
  },
];

const BlueprintsCatalog: React.FC = () => {
  return (
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
      <div className='w-full max-w-[1600px] mx-auto py-12 px-8 flex-1'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 w-full items-stretch'>
          {blueprints.map(bp => (
            <Link
              key={bp.id}
              to={`/blueprints/${bp.id}`}
              className='group bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg p-0 flex flex-row items-stretch hover:bg-white/20 hover:shadow-2xl hover:shadow-white/30 hover:-translate-y-1 transition-all cursor-pointer h-[280px] w-full relative'
              title='open in playground'
            >
              {/* Corner Ribbon Badge */}
              {bp.badge && (
                <div
                  className={`absolute top-0 right-0 z-20 px-4 py-1 text-xs font-bold rounded-bl-2xl ${
                    bp.badge === 'New'
                      ? 'bg-green-600 text-white'
                      : bp.badge === 'Tech Preview'
                        ? 'bg-yellow-500 text-black'
                        : bp.badge === 'Featured'
                          ? 'bg-blue-600 text-white'
                          : 'bg-neutral-700 text-white'
                  } shadow-lg`}
                >
                  {bp.badge}
                </div>
              )}

              {/* Logo */}
              <div className='flex items-center justify-center w-40 h-full bg-white/5 rounded-l-2xl border-r border-white/10'>
                <img
                  src={bp.image}
                  alt={bp.name}
                  className='w-32 h-32 object-cover rounded-xl border-2 border-neutral-700 shadow-md bg-white/10'
                />
              </div>

              {/* Info */}
              <div className='flex-1 min-w-0 flex flex-col justify-center px-8 py-6'>
                {/* Category */}
                <div className='text-xs text-blue-300 font-semibold mb-1 truncate'>
                  {bp.category}
                </div>
                {/* Complexity */}
                <div className='text-xs text-neutral-400 mb-1 truncate'>
                  {bp.complexity}
                </div>
                {/* Blueprint Name */}
                <div className='flex items-baseline gap-2 mb-1'>
                  <h2 className='text-2xl font-bold group-hover:text-blue-400 transition truncate'>
                    {bp.name}
                  </h2>
                </div>
                {/* Short Description */}
                <div className='text-sm text-neutral-200 mb-3 line-clamp-2'>
                  {bp.shortDescription}
                </div>
                {/* Tags */}
                <div className='flex flex-wrap gap-2 mb-2'>
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      bp.tags[0] === 'RAG'
                        ? 'bg-blue-900/50 text-blue-200'
                        : bp.tags[0] === 'Multi-Agent'
                          ? 'bg-green-900/50 text-green-200'
                          : bp.tags[0] === 'Code Generation'
                            ? 'bg-purple-900/50 text-purple-200'
                            : bp.tags[0] === 'Search Integration'
                              ? 'bg-orange-900/50 text-orange-200'
                              : bp.tags[0] === 'Document Summarization'
                                ? 'bg-indigo-900/50 text-indigo-200'
                                : bp.tags[0] === 'Language Translation'
                                  ? 'bg-teal-900/50 text-teal-200'
                                  : bp.tags[0] === 'Avatar Integration'
                                    ? 'bg-pink-900/50 text-pink-200'
                                    : 'bg-blue-900/50 text-blue-200'
                    }`}
                  >
                    {bp.tags[0]}
                  </span>
                  <span className='px-2 py-1 rounded text-xs bg-green-900/50 text-green-200'>
                    {bp.status}
                  </span>
                  <div className='flex items-center gap-1 px-2 py-1 rounded text-xs bg-neutral-700/40 text-neutral-300'>
                    <span>{bp.complexity}</span>
                  </div>
                  {bp.tags.slice(1).map((tag, i) => (
                    <span
                      key={i}
                      className='px-2 py-1 rounded text-xs bg-neutral-700/40 text-neutral-300'
                    >
                      {tag}
                    </span>
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

export default BlueprintsCatalog;
