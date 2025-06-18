import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import bannerWave from '../assets/banner_wave.png';
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

const BlueprintDetail: React.FC = () => {
  const { blueprintId } = useParams<{ blueprintId: string }>();
  const blueprint = blueprints.find(bp => bp.id === blueprintId);
  const [activeTab, setActiveTab] = useState<'card' | 'aims'>('card');
  const [markdownContent, setMarkdownContent] = useState<string>('');

  useEffect(() => {
    const loadMarkdown = async () => {
      if (blueprint) {
        try {
          const response = await fetch(`/blueprints/markdown/${blueprint.id}.md`);
          if (response.ok) {
            const text = await response.text();
            setMarkdownContent(text);
          } else {
            console.error('Failed to load markdown file');
            setMarkdownContent('# Blueprint Documentation\n\nDocumentation coming soon...');
          }
        } catch (error) {
          console.error('Error loading markdown:', error);
          setMarkdownContent('# Blueprint Documentation\n\nDocumentation coming soon...');
        }
      }
    };

    loadMarkdown();
  }, [blueprint]);

  if (!blueprint) {
    return (
      <div className="min-h-screen bg-neutral-900 text-white flex flex-col items-center justify-center">
        <div className="text-2xl font-bold mb-4">Blueprint not found</div>
        <Link to="/blueprints" className="text-blue-400 underline">Back to Blueprints</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-900 text-white flex flex-col">
      {/* Banner */}
      <div className="relative w-full h-56 md:h-72 lg:h-80 overflow-hidden">
        <img src={bannerWave} alt="Banner" className="w-full h-full object-cover" />
        <nav className="absolute top-0 left-0 w-full flex flex-wrap justify-center gap-4 md:gap-8 pt-4 z-10 px-4">
          <Link to="/models" className="text-lg md:text-xl font-bold transition relative px-2 opacity-80 hover:opacity-100">Models</Link>
          <Link to="/blueprints" className="text-lg md:text-xl font-bold transition relative px-2 opacity-100 after:content-[''] after:block after:h-1 after:rounded after:mt-1 after:w-full after:bg-white">Blueprints</Link>
          <Link to="/gpu-cloud" className="text-lg md:text-xl font-bold transition relative px-2 opacity-80 hover:opacity-100">GPU Clouds</Link>
        </nav>
        {/* Left-aligned glassy logo/name overlay */}
        <div className="absolute left-8 top-1/2 -translate-y-1/2 z-10 bg-white/10 backdrop-blur-md border border-white/30 rounded-2xl shadow-lg p-6 flex flex-col items-center w-64">
          <img src={blueprint.image} alt={blueprint.name} className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 object-cover rounded-xl mb-4 border border-neutral-800" />
          <div className="text-base font-bold text-white mt-2 text-center drop-shadow-lg">{OPEA_LABEL}</div>
          <div className="text-2xl font-extrabold mb-2 text-center text-white drop-shadow-lg">{blueprint.name}</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 flex-1 w-full flex flex-col">
        {/* Tabs */}
        <div className="flex border-b border-neutral-700 mb-6">
          <button
            onClick={() => setActiveTab('card')}
            className={`px-6 py-2 -mb-px text-lg font-medium border-b-2 transition-colors duration-150 focus:outline-none
              ${activeTab === 'card'
                ? 'border-blue-500 text-blue-500 bg-transparent'
                : 'border-transparent text-gray-400 hover:text-blue-400'}
            `}
            style={{ background: 'none', borderRadius: 0 }}
          >
            Blueprint Card
          </button>
          <button
            onClick={() => setActiveTab('aims')}
            className={`px-6 py-2 -mb-px text-lg font-medium border-b-2 transition-colors duration-150 focus:outline-none
              ${activeTab === 'aims'
                ? 'border-blue-500 text-blue-500 bg-transparent'
                : 'border-transparent text-gray-400 hover:text-blue-400'}
            `}
            style={{ background: 'none', borderRadius: 0 }}
          >
            AIMs
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'aims' && (
          <div className="flex flex-col items-center justify-center min-h-[300px] text-xl text-neutral-300">
            AIMs content coming soon...
          </div>
        )}
        {activeTab === 'card' && (
          <div className="prose prose-invert max-w-none">
            <ReactMarkdown>{markdownContent}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlueprintDetail; 