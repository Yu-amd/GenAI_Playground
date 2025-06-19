import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { PaperAirplaneIcon, Cog6ToothIcon, DocumentTextIcon, CircleStackIcon, ChatBubbleLeftRightIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Highlight, themes } from 'prism-react-renderer';
import bannerWave from '../assets/banner_wave.png';
import bp_chatqna from '../assets/blueprints/bp_chatqna.png';
import bp_agentqna from '../assets/blueprints/bp_agentqna.png';
import bp_codegen from '../assets/blueprints/bp_codegen.png';
import bp_codeTrans from '../assets/blueprints/bp_codeTrans.png';
import bp_searchQna from '../assets/blueprints/bp_searchQna.png';
import bp_docsum from '../assets/blueprints/bp_docsum.png';
import bp_translation from '../assets/blueprints/bp_translation.png';
import bp_avatarchatbot from '../assets/blueprints/bp_avatarchatbot.png';
import logoChatqna from '../../graphics/logos/logo_chatqna.png';
import logoAgentqna from '../../graphics/logos/logo_agentqna.png';
import logoSearchQna from '../../graphics/logos/logo_searchQna.png';
import logoDocsum from '../../graphics/logos/logo_docsum.png';
import logoCodegen from '../../graphics/logos/logo_codegen.png';
import logoCodeTrans from '../../graphics/logos/logo_codeTrans.png';
import logoTranslation from '../../graphics/logos/logo_translation.png';
import logoAvatarChatbot from '../../graphics/logos/logo_avatarchatbot.png';
import functionalRetriever from '../../graphics/logos/functional/functional_retriever.png';
import functionalReranking from '../../graphics/logos/functional/functional_reranking.png';
import functionalGuardrails from '../../graphics/logos/functional/functional_guardrails.png';
import functionalFinetuning from '../../graphics/logos/functional/functional_finetuning.png';
import functionalEmbeddings from '../../graphics/logos/functional/functional_embeddings.png';
import functionalDataprep from '../../graphics/logos/functional/functional_dataprep.png';
import functionalAsr from '../../graphics/logos/functional/functional_asr.png';
import functionalAnimation from '../../graphics/logos/functional/functional_animation.png';
import functionalAgent from '../../graphics/logos/functional/functional_agent.png';
// Architecture images
import chatqnaArchitecture from '../assets/architecture/chatqna-architecture.svg';
import agentqnaArchitecture from '../assets/architecture/agentqna-architecture.svg';
import codegenArchitecture from '../assets/architecture/codegen-architecture.svg';
import codetransArchitecture from '../assets/architecture/codetrans-architecture.svg';
import searchqnaArchitecture from '../assets/architecture/searchqna-architecture.svg';
import docsumArchitecture from '../assets/architecture/docsum-architecture.svg';
import translationArchitecture from '../assets/architecture/translation-architecture.svg';
import avatarchatbotArchitecture from '../assets/architecture/avatarchatbot-architecture.svg';
import llamaImg from '../assets/models/model_llama3_1.png';
import qwen2Img from '../assets/models/model_Qwen2-7B.png';
import deepseekImg from '../assets/models/model_DeepSeek_MoE_18B.png';
import gemmaImg from '../assets/models/model_Gemma.png';
import { models as allModels } from '../data/models';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  sources?: Array<{
    title: string;
    url: string;
    snippet: string;
  }>;
}

interface KnowledgeBaseConfig {
  type: 'vector' | 'document' | 'database';
  connectionString: string;
  collectionName: string;
  embeddingModel: string;
  similarityThreshold: number;
}

const blueprints = [
  {
    id: 'chatqna',
    name: 'ChatQnA',
    description: 'Chatbot application based on Retrieval Augmented Generation architecture.',
    image: bp_chatqna,
    tags: ['RAG', 'Chatbot', 'Knowledge Base']
  },
  {
    id: 'agentqna',
    name: 'AgentQnA',
    description: 'A hierarchical multi-agent system for question-answering applications.',
    image: bp_agentqna,
    tags: ['Multi-Agent', 'Hierarchical', 'Orchestration']
  },
  {
    id: 'codegen',
    name: 'CodeGen',
    description: 'A code copilot application for executing code generation.',
    image: bp_codegen,
    tags: ['Code Generation', 'Copilot', 'Development']
  },
  {
    id: 'codetrans',
    name: 'CodeTrans',
    description: 'A code translation example which converts code from one programming language to another programming language.',
    image: bp_codeTrans,
    tags: ['Code Translation', 'Language Conversion', 'Transpilation']
  },
  {
    id: 'searchqna',
    name: 'SearchQnA',
    description: 'An example of improving QnA application quality by expanding the pipeline with the Google search engine.',
    image: bp_searchQna,
    tags: ['Search Integration', 'Enhanced QnA', 'External APIs']
  },
  {
    id: 'docsum',
    name: 'DocSum',
    description: 'A sample app which creates summaries of different types of text.',
    image: bp_docsum,
    tags: ['Document Summarization', 'Text Processing', 'NLP']
  },
  {
    id: 'translation',
    name: 'Translation',
    description: 'An application which demonstrates language translation inference.',
    image: bp_translation,
    tags: ['Language Translation', 'Multilingual', 'Inference']
  },
  {
    id: 'avatarchatbot',
    name: 'Avatar Chatbot',
    description: 'Integrates a conversational chatbot with a virtual avatar.',
    image: bp_avatarchatbot,
    tags: ['Avatar Integration', 'Visual AI', 'Conversational']
  },
];

const OPEA_LABEL = 'Open Platform for Enterprise AI';

const BlueprintDetail: React.FC = () => {
  const { blueprintId } = useParams<{ blueprintId: string }>();
  const blueprint = blueprints.find(bp => bp.id === blueprintId);
  const [activeTab, setActiveTab] = useState<'card' | 'aims' | 'interact'>('card');
  const [markdownContent, setMarkdownContent] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'system', 
      content: 'Welcome to ChatQnA! I\'m a RAG-powered chatbot that can answer questions using knowledge retrieval. How can I help you today?', 
      timestamp: new Date() 
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [knowledgeBaseConfig, setKnowledgeBaseConfig] = useState<KnowledgeBaseConfig>({
    type: 'vector',
    connectionString: 'mongodb://localhost:27017/chatqna',
    collectionName: 'documents',
    embeddingModel: 'text-embedding-ada-002',
    similarityThreshold: 0.7
  });
  const [showSettings, setShowSettings] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage, timestamp: new Date() }]);
    setIsLoading(true);

    try {
      // Simulate different responses based on blueprint type
      let response = '';
      let sources: Array<{ title: string; url: string; snippet: string; }> | undefined = undefined;
      
      if (blueprint?.id === 'chatqna') {
        // Simulate RAG response for ChatQnA
        response = `Based on my knowledge base, here's what I found about "${userMessage}":\n\nThis appears to be related to the ${blueprint.name} system. The information suggests that this query would typically be processed through our retrieval-augmented generation pipeline, which includes embedding generation, semantic search, and context-aware response generation.\n\nWould you like me to provide more specific details about any aspect of this process?`;
        sources = [
          { title: 'Knowledge Base Document 1', url: '#', snippet: 'Relevant information about the query topic...' },
          { title: 'Technical Documentation', url: '#', snippet: 'Implementation details and best practices...' }
        ];
      } else {
        // Generic response for other blueprints
        response = `Thank you for your message: "${userMessage}". I'm the ${blueprint?.name} system and I'm here to help you with your request. This is a simulated response to demonstrate the interactive capabilities of this blueprint.\n\nHow can I assist you further?`;
      }

      // Simulate streaming response
      const words = response.split(' ');
      let streamedResponse = '';
      
      for (let i = 0; i < words.length; i++) {
        streamedResponse += words[i] + ' ';
        setMessages(prev => [
          ...prev.slice(0, -1),
          { 
            role: 'assistant', 
            content: streamedResponse.trim(),
            timestamp: new Date(),
            sources: i === words.length - 1 ? sources : undefined
          }
        ]);
        await new Promise(resolve => setTimeout(resolve, 50));
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error processing your request. Please try again.',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Add initial welcome message when component loads
  useEffect(() => {
    if (blueprint && messages.length === 0) {
      setMessages([{ role: 'assistant', content: getWelcomeMessage(), timestamp: new Date() }]);
    }
  }, [blueprint]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const renderSettings = () => (
    <div className="bg-neutral-800 rounded-lg p-4 mb-4 border border-neutral-700">
      <h4 className="text-sm font-semibold mb-3 text-blue-400">Knowledge Base Configuration</h4>
      <div className="space-y-3">
        <div>
          <label className="block text-xs text-gray-400 mb-1">Knowledge Base Type</label>
          <select
            value={knowledgeBaseConfig.type}
            onChange={(e) => setKnowledgeBaseConfig(prev => ({ ...prev, type: e.target.value as any }))}
            className="w-full bg-neutral-700 text-white rounded px-3 py-2 text-sm border border-neutral-600 focus:border-blue-500 focus:outline-none"
          >
            <option value="vector">Vector Database</option>
            <option value="document">Document Store</option>
            <option value="database">SQL Database</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">Connection String</label>
          <input
            type="text"
            value={knowledgeBaseConfig.connectionString}
            onChange={(e) => setKnowledgeBaseConfig(prev => ({ ...prev, connectionString: e.target.value }))}
            className="w-full bg-neutral-700 text-white rounded px-3 py-2 text-sm border border-neutral-600 focus:border-blue-500 focus:outline-none"
            placeholder="mongodb://localhost:27017/chatqna"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">Embedding Model</label>
          <input
            type="text"
            value={knowledgeBaseConfig.embeddingModel}
            onChange={(e) => setKnowledgeBaseConfig(prev => ({ ...prev, embeddingModel: e.target.value }))}
            className="w-full bg-neutral-700 text-white rounded px-3 py-2 text-sm border border-neutral-600 focus:border-blue-500 focus:outline-none"
            placeholder="text-embedding-ada-002"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">Similarity Threshold</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={knowledgeBaseConfig.similarityThreshold}
            onChange={(e) => setKnowledgeBaseConfig(prev => ({ ...prev, similarityThreshold: parseFloat(e.target.value) }))}
            className="w-full"
          />
          <span className="text-xs text-gray-400">{knowledgeBaseConfig.similarityThreshold}</span>
        </div>
      </div>
    </div>
  );

  // Helper to map functional microservice names to logos (best fit)
  const getFunctionalLogoByName = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('retriev')) return functionalRetriever;
    if (n.includes('rerank')) return functionalReranking;
    if (n.includes('guardrail')) return functionalGuardrails;
    if (n.includes('finetune')) return functionalFinetuning;
    if (n.includes('embedding')) return functionalEmbeddings;
    if (n.includes('dataprep')) return functionalDataprep;
    if (n.includes('asr')) return functionalAsr;
    if (n.includes('animation')) return functionalAnimation;
    if (n.includes('agent') || n.includes('orchestrator')) return functionalAgent;
    if (n.includes('quality')) return functionalGuardrails;
    if (n.includes('manager')) return functionalAgent;
    if (n.includes('processing')) return functionalDataprep;
    if (n.includes('context')) return functionalEmbeddings;
    if (n.includes('synthesis')) return functionalFinetuning;
    if (n.includes('validation')) return functionalReranking;
    if (n.includes('adaptation')) return functionalFinetuning;
    return functionalAgent;
  };

  const renderAimsContent = () => {
    const microservices = getMicroservicesForBlueprint();
    // Assign logos by name for functional microservices
    const functionalWithLogos = microservices.functional.map((svc) => ({
      ...svc,
      logo: getFunctionalLogoByName(svc.name)
    }));
    const orderedFunctional = functionalWithLogos;
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full items-stretch">
          <div className="space-y-4">
            {/* Removed: <h3 className="text-lg font-semibold text-white">Models Inference Endpoints</h3> */}
            <div className="space-y-6">
              {allModels.map((model, index) => (
                <Link
                  key={model.id}
                  to={`/models/${model.id}`}
                  className="group bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg p-10 flex flex-row items-center hover:bg-white/20 hover:shadow-2xl hover:shadow-white/30 hover:-translate-y-1 transition-all cursor-pointer h-[280px] w-full"
                >
                  <img
                    src={model.image}
                    alt={model.name}
                    className="w-36 h-36 object-cover rounded-2xl border-2 border-neutral-700 shadow-md transition mr-10 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <div className="text-base text-blue-400 font-semibold mb-1 truncate">{model.org}</div>
                    <h2 className="text-2xl font-bold mb-2 group-hover:text-blue-400 transition truncate">{model.name}</h2>
                    <div className="flex space-x-2 mb-3">
                      {model.tags.map((tag, tagIdx) => (
                        <span
                          key={tagIdx}
                          className={`px-2 py-1 rounded text-xs ${
                            tagIdx === 0 ? 'bg-blue-900/50 text-blue-200' :
                            tagIdx === 1 ? 'bg-green-900/50 text-green-200' :
                            'bg-purple-900/50 text-purple-200'
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="text-sm text-neutral-200 line-clamp-3">{model.description}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          
          <div className="space-y-4">
            {/* Removed: <h3 className="text-lg font-semibold text-white">Functional Microservices</h3> */}
            <div className="space-y-6">
              {orderedFunctional.map((service, index) => (
                <div key={index} className="group bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg p-10 flex flex-row items-center hover:bg-white/20 hover:shadow-2xl hover:shadow-white/30 hover:-translate-y-1 transition-all cursor-pointer h-[280px] w-full">
                  <img src={service.logo} alt={service.name} className="w-36 h-36 rounded-2xl border-2 border-neutral-700 shadow-md transition mr-10 flex-shrink-0 object-cover" />
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <h4 className="font-medium text-white text-xl mb-2">{service.name}</h4>
                    <p className="text-sm text-neutral-300 line-clamp-3">{service.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const getArchitectureImage = () => {
    if (!blueprint) return null;
    
    switch (blueprint.id) {
      case 'chatqna':
        return chatqnaArchitecture;
      case 'agentqna':
        return agentqnaArchitecture;
      case 'codegen':
        return codegenArchitecture;
      case 'codetrans':
        return codetransArchitecture;
      case 'searchqna':
        return searchqnaArchitecture;
      case 'docsum':
        return docsumArchitecture;
      case 'translation':
        return translationArchitecture;
      case 'avatarchatbot':
        return avatarchatbotArchitecture;
      default:
        return null;
    }
  };

  const getInputPlaceholder = () => {
    if (!blueprint) return "Type your message...";
    
    switch (blueprint.id) {
      case 'chatqna':
        return "Ask a question about your knowledge base...";
      case 'agentqna':
        return "Ask a question for the multi-agent system...";
      case 'codegen':
        return "Describe the code you want to generate...";
      case 'codetrans':
        return "Enter code to translate between languages...";
      case 'searchqna':
        return "Ask a question that requires web search...";
      case 'docsum':
        return "Enter text or document to summarize...";
      case 'translation':
        return "Enter text to translate...";
      case 'avatarchatbot':
        return "Chat with the virtual avatar...";
      default:
        return "Type your message...";
    }
  };

  const getWelcomeMessage = () => {
    if (!blueprint) return 'Welcome! How can I help you today?';
    
    switch (blueprint.id) {
      case 'chatqna':
        return 'Welcome to ChatQnA! I\'m a RAG-powered chatbot that can answer questions using knowledge retrieval. How can I help you today?';
      case 'agentqna':
        return 'Welcome to AgentQnA! I\'m a multi-agent system that can coordinate specialized agents to answer complex questions. What would you like to know?';
      case 'codegen':
        return 'Welcome to CodeGen! I\'m an AI code assistant that can help you generate, complete, and improve code. What would you like to build?';
      case 'codetrans':
        return 'Welcome to CodeTrans! I can help you translate code between different programming languages. What code would you like to convert?';
      case 'searchqna':
        return 'Welcome to SearchQnA! I can search the web and provide up-to-date answers to your questions. What would you like to know?';
      case 'docsum':
        return 'Welcome to DocSum! I can create concise summaries of documents and text. What would you like me to summarize?';
      case 'translation':
        return 'Welcome to Translation! I can translate text between multiple languages. What would you like to translate?';
      case 'avatarchatbot':
        return 'Welcome to Avatar Chatbot! I\'m a conversational AI with a virtual avatar. How can I assist you today?';
      default:
        return 'Welcome! How can I help you today?';
    }
  };

  const getModelLogo = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('llama')) return llamaImg;
    if (n.includes('qwen')) return qwen2Img;
    if (n.includes('deepseek')) return deepseekImg;
    if (n.includes('gemma')) return gemmaImg;
    // fallback: try to match by service type
    if (n.includes('embedding')) return llamaImg;
    if (n.includes('inference') || n.includes('llm')) return qwen2Img;
    if (n.includes('rerank')) return deepseekImg;
    return gemmaImg;
  };

  const getMicroservicesForBlueprint = () => {
    if (!blueprint) {
      return {
        models: [],
        functional: []
      };
    }
    switch (blueprint.id) {
      case 'chatqna':
        return {
          models: [
            { name: 'Embedding Service', logo: logoChatqna },
            { name: 'LLM Inference Service', logo: logoAgentqna },
            { name: 'Reranking Service', logo: logoSearchQna }
          ],
          functional: [
            { name: 'Query Processing Service', description: 'Handles query preprocessing, intent recognition, and query optimization', logo: getFunctionalLogoByName('Query Processing Service') },
            { name: 'Retrieval Orchestrator', description: 'Coordinates knowledge base queries, embedding calls, and similarity search', logo: getFunctionalLogoByName('Retrieval Orchestrator') },
            { name: 'Context Management Service', description: 'Manages conversation history, session state, and context windowing', logo: getFunctionalLogoByName('Context Management Service') }
          ]
        };
      case 'agentqna':
        return {
          models: [
            { name: 'LLM Inference Service', logo: logoAgentqna },
            { name: 'Agent Coordination Service', logo: logoChatqna },
            { name: 'Specialized Agent Service', logo: logoSearchQna }
          ],
          functional: [
            { name: 'Agent Orchestrator', description: 'Coordinates agent workflows and manages agent lifecycles', logo: getFunctionalLogoByName('Agent Orchestrator') },
            { name: 'Task Decomposition Service', description: 'Breaks down complex queries into manageable subtasks for agents', logo: getFunctionalLogoByName('Task Decomposition Service') },
            { name: 'Response Aggregator', description: 'Aggregates and synthesizes responses from multiple agents', logo: getFunctionalLogoByName('Response Aggregator') }
          ]
        };
      case 'codegen':
        return {
          models: [
            { name: 'Code Generation Service', logo: logoCodegen },
            { name: 'Code Completion Service', logo: logoAgentqna },
            { name: 'Code Analysis Service', logo: logoSearchQna }
          ],
          functional: [
            { name: 'Project Context Service', description: 'Maintains understanding of project structure and dependencies', logo: getFunctionalLogoByName('Project Context Service') },
            { name: 'Code Review Service', description: 'Performs automated code reviews and suggests improvements', logo: getFunctionalLogoByName('Code Review Service') },
            { name: 'Best Practices Service', description: 'Recommends and enforces coding best practices', logo: getFunctionalLogoByName('Best Practices Service') }
          ]
        };
      case 'codetrans':
        return {
          models: [
            { name: 'Code Translation Service', logo: logoCodeTrans },
            { name: 'Syntax Analysis Service', logo: logoAgentqna },
            { name: 'Language Model Service', logo: logoCodegen }
          ],
          functional: [
            { name: 'Language Detection Service', description: 'Automatically detects source and target programming languages', logo: getFunctionalLogoByName('Language Detection Service') },
            { name: 'Code Optimization Service', description: 'Optimizes translated code for target language best practices', logo: getFunctionalLogoByName('Code Optimization Service') },
            { name: 'Translation Validation Service', description: 'Validates translated code for correctness and functionality', logo: getFunctionalLogoByName('Translation Validation Service') }
          ]
        };
      case 'searchqna':
        return {
          models: [
            { name: 'Search Engine Service', logo: logoSearchQna },
            { name: 'LLM Inference Service', logo: logoAgentqna },
            { name: 'Content Analysis Service', logo: logoChatqna }
          ],
          functional: [
            { name: 'Query Enhancement Service', description: 'Optimizes search queries for better result relevance', logo: getFunctionalLogoByName('Query Enhancement Service') },
            { name: 'Result Synthesis Service', description: 'Combines and synthesizes information from multiple sources', logo: getFunctionalLogoByName('Result Synthesis Service') },
            { name: 'Source Validation Service', description: 'Validates source credibility and information accuracy', logo: getFunctionalLogoByName('Source Validation Service') }
          ]
        };
      case 'docsum':
        return {
          models: [
            { name: 'Summarization Service', logo: logoDocsum },
            { name: 'Text Analysis Service', logo: logoAgentqna },
            { name: 'Content Extraction Service', logo: logoSearchQna }
          ],
          functional: [
            { name: 'Document Processing Service', description: 'Handles various document formats and preprocessing', logo: getFunctionalLogoByName('Document Processing Service') },
            { name: 'Key Point Extraction Service', description: 'Identifies and extracts key points and main ideas', logo: getFunctionalLogoByName('Key Point Extraction Service') },
            { name: 'Summary Quality Service', description: 'Ensures summary quality, coherence, and accuracy', logo: getFunctionalLogoByName('Summary Quality Service') }
          ]
        };
      case 'translation':
        return {
          models: [
            { name: 'Translation Service', logo: logoTranslation },
            { name: 'Language Detection Service', logo: logoAgentqna },
            { name: 'Context Analysis Service', logo: logoSearchQna }
          ],
          functional: [
            { name: 'Language Pair Service', description: 'Manages translation models for specific language pairs', logo: getFunctionalLogoByName('Language Pair Service') },
            { name: 'Quality Assurance Service', description: 'Ensures translation quality and consistency', logo: getFunctionalLogoByName('Quality Assurance Service') },
            { name: 'Cultural Adaptation Service', description: 'Adapts translations for cultural context and nuances', logo: getFunctionalLogoByName('Cultural Adaptation Service') }
          ]
        };
      case 'avatarchatbot':
        return {
          models: [
            { name: 'Avatar Rendering Service', logo: logoAvatarChatbot },
            { name: 'Conversation Service', logo: logoAgentqna },
            { name: 'Emotion Processing Service', logo: logoSearchQna }
          ],
          functional: [
            { name: 'Avatar Animation Service', description: 'Generates real-time avatar animations and expressions', logo: getFunctionalLogoByName('Avatar Animation Service') },
            { name: 'Interaction Manager', description: 'Manages user interactions and conversation state', logo: getFunctionalLogoByName('Interaction Manager') },
            { name: 'Multi-Modal Service', description: 'Handles voice, text, and gesture interactions', logo: getFunctionalLogoByName('Multi-Modal Service') }
          ]
        };
      default:
        return {
          models: [
            { name: 'Core Service', logo: logoChatqna },
            { name: 'Processing Service', logo: logoAgentqna },
            { name: 'Analysis Service', logo: logoSearchQna }
          ],
          functional: [
            { name: 'Business Logic Service', description: 'Implements core business logic and workflows', logo: getFunctionalLogoByName('Business Logic Service') },
            { name: 'Data Service', description: 'Manages data storage, retrieval, and processing', logo: getFunctionalLogoByName('Data Service') },
            { name: 'Integration Service', description: 'Handles integration with external systems and APIs', logo: getFunctionalLogoByName('Integration Service') }
          ]
        };
    }
  };

  const renderMicroserviceStatus = () => {
    if (!blueprint) return null;
    
    const microservices = getMicroservicesForBlueprint();

    return (
      <>
        {/* Knowledge Base Status */}
        <div className="bg-neutral-900 rounded-lg p-4 border border-neutral-800 shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CircleStackIcon className="w-5 h-5 text-green-400" />
              <div>
                <h4 className="font-medium text-white">System Status</h4>
                <p className="text-sm text-gray-400">
                  {blueprint.name} • All services operational
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-green-400">Connected</span>
            </div>
          </div>
        </div>

        {/* Models Inference Endpoints Status */}
        <div className="bg-neutral-900 rounded-lg p-4 border border-neutral-800 shadow">
          <h4 className="font-medium text-white mb-3">Models Inference Endpoints</h4>
          <div className="space-y-3">
            {microservices.models.map((service, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img src={service.logo} alt={service.name} className="w-6 h-6 rounded object-cover" />
                  <span className="text-sm text-gray-300">{service.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-400">Online</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Functional Microservices Status */}
        <div className="bg-neutral-900 rounded-lg p-4 border border-neutral-800 shadow flex-1">
          <h4 className="font-medium text-white mb-3">Functional Microservices</h4>
          <div className="space-y-3">
            {microservices.functional.map((service, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img src={service.logo} alt={service.name} className="w-6 h-6 rounded object-cover" />
                  <span className="text-sm text-gray-300">{service.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-400">Online</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  };

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
        
        {/* Filter tags positioned to the right of the logo */}
        <div className="absolute left-80 bottom-8 z-10 flex flex-wrap gap-2 max-w-md">
          {blueprint.tags?.map((tag, index) => (
            <span 
              key={index}
              className={`px-3 py-2 rounded-lg text-sm font-medium shadow-lg ${
                index === 0 ? 'bg-blue-900/70 text-blue-200 border border-blue-700/50' :
                index === 1 ? 'bg-green-900/70 text-green-200 border border-green-700/50' :
                'bg-purple-900/70 text-purple-200 border border-purple-700/50'
              }`}
            >
              {tag}
            </span>
          ))}
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
          <button
            onClick={() => setActiveTab('interact')}
            className={`px-6 py-2 -mb-px text-lg font-medium border-b-2 transition-colors duration-150 focus:outline-none
              ${activeTab === 'interact'
                ? 'border-blue-500 text-blue-500 bg-transparent'
                : 'border-transparent text-gray-400 hover:text-blue-400'}
            `}
            style={{ background: 'none', borderRadius: 0 }}
          >
            <ChatBubbleLeftRightIcon className="w-5 h-5 inline mr-2" />
            Interact
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'aims' && (
          <div className="w-full">
            {renderAimsContent()}
          </div>
        )}
        
        {activeTab === 'card' && (
          <div className="space-y-8">
            {/* Architecture Overview */}
            {getArchitectureImage() && (
              <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700">
                <h2 className="text-2xl font-bold mb-4 text-white">Architecture Overview</h2>
                <div className="flex justify-center">
                  <img 
                    src={getArchitectureImage()!} 
                    alt={`${blueprint.name} Architecture`}
                    className="w-full max-w-4xl h-auto rounded-lg shadow-lg"
                  />
                </div>
              </div>
            )}
            
            {/* Blueprint Documentation */}
            <div className="prose prose-invert max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                {markdownContent}
              </ReactMarkdown>
            </div>
          </div>
        )}

        {activeTab === 'interact' && (
          <div className="flex flex-row gap-8 h-[700px]">
            {/* Chat Interface (left) */}
            <div className="w-full md:w-[60%] flex-1 h-full min-h-0 bg-neutral-900 rounded-lg p-6 border border-neutral-800 shadow flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <ChatBubbleLeftRightIcon className="w-5 h-5 mr-2" />
                  {blueprint.name} Interface
                </h3>
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="text-gray-400 hover:text-white"
                >
                  <Cog6ToothIcon className="h-6 w-6" />
                </button>
              </div>
              
              {showSettings && renderSettings()}
              
              <div className="flex flex-col space-y-4 flex-1 min-h-0">
                {/* Chat messages */}
                <div className="flex-1 min-h-0 overflow-y-auto">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-4 ${
                          message.role === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-neutral-800 text-white border border-neutral-700'
                        }`}
                      >
                        <div className="prose prose-invert max-w-none text-sm">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeRaw]}
                          >
                            {message.content}
                          </ReactMarkdown>
                        </div>
                        
                        {message.sources && message.sources.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-neutral-600">
                            <div className="text-xs font-semibold text-blue-300 mb-2">Sources:</div>
                            {message.sources.map((source, i) => (
                              <div key={i} className="text-xs text-gray-400 mb-1">
                                <div className="font-medium">{source.title}</div>
                                <div className="text-gray-500">{source.snippet}</div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex justify-start mb-4">
                      <div className="max-w-[80%] rounded-lg p-4 bg-neutral-800 text-white border border-neutral-700">
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                          <span className="text-sm">Processing request...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
                
                {/* Input area */}
                <div className="mt-auto">
                  <div className="flex items-end space-x-2">
                    <textarea
                      ref={textareaRef}
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={getInputPlaceholder()}
                      className="flex-1 bg-neutral-800 text-white rounded-lg p-3 min-h-[60px] max-h-[200px] resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 border border-neutral-700"
                      disabled={isLoading}
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={isLoading || !inputMessage.trim()}
                      className={`p-3 rounded-lg ${
                        isLoading || !inputMessage.trim()
                          ? 'bg-neutral-700 text-gray-400 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      <PaperAirplaneIcon className="h-6 w-6" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Microservice Status (right) */}
            <div className="w-full md:w-[40%] flex-1 h-full min-h-0 flex flex-col space-y-4">
              {renderMicroserviceStatus()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlueprintDetail; 