import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { PaperAirplaneIcon, Cog6ToothIcon, DocumentTextIcon, CircleStackIcon, ChatBubbleLeftRightIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
// import { Highlight, themes } from 'prism-react-renderer';
import bannerWave from '../assets/banner_wave.png';
import bp_chatqna from '../assets/blueprints/bp_chatqna.png';
import bp_agentqna from '../assets/blueprints/bp_agentqna.png';
// import bp_codegen from '../assets/blueprints/bp_codegen.png';
import bp_codeTrans from '../assets/blueprints/bp_codeTrans.png';
// import bp_searchQna from '../assets/blueprints/bp_searchQna.png';
import bp_docsum from '../assets/blueprints/bp_docsum.png';
// import bp_translation from '../assets/blueprints/bp_translation.png';
// import bp_avatarchatbot from '../assets/blueprints/bp_avatarchatbot.png';
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
// Model images
import llamaImg from '../assets/models/model_llama3_1.png';
import qwen2Img from '../assets/models/model_Qwen2-7B.png';
import deepseekImg from '../assets/models/model_DeepSeek_MoE_18B.png';
import gemmaImg from '../assets/models/model_Gemma.png';
import llama4MaverickImg from '../assets/models/model_llama4_maverick.png';
import { generatedBlueprintData } from '../utils/generatedBlueprintData';
import PlaygroundLogo from '../components/PlaygroundLogo';

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
    id: 'codetrans',
    name: 'CodeTrans',
    description: 'A code translation example which converts code from one programming language to another programming language.',
    image: bp_codeTrans,
    tags: ['Code Translation', 'Language Conversion', 'Transpilation']
  },
  {
    id: 'docsum',
    name: 'DocSum',
    description: 'A sample app which creates summaries of different types of text.',
    image: bp_docsum,
    tags: ['Document Summarization', 'Text Processing', 'NLP']
  },
];

const BlueprintDetail: React.FC = () => {
  const { blueprintId } = useParams<{ blueprintId: string }>();
  const blueprint = blueprints.find(bp => bp.id === blueprintId);
  const [activeTab, setActiveTab] = useState<'interact' | 'aims'>('interact');
  const [markdownContent, setMarkdownContent] = useState<string>('');
  
  // CodeTrans specific state
  // const [selectedLanguage, setSelectedLanguage] = useState('python');
  // const [generatedCode, setGeneratedCode] = useState('');
  const [inputLanguage, setInputLanguage] = useState('python');
  const [outputLanguage, setOutputLanguage] = useState('javascript');
  const [inputCode, setInputCode] = useState('');
  const [translatedCode, setTranslatedCode] = useState('');
  // const [codePrompt, setCodePrompt] = useState('');
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);
  const [codeHistory] = useState<Array<{
    id: string;
    prompt: string;
    code: string;
    language: string;
    timestamp: Date;
  }>>([]);
  // const [generationSettings] = useState({
  //   temperature: 0.7,
  //   maxTokens: 1000,
  //   topP: 0.9,
  //   frequencyPenalty: 0.0,
  //   presencePenalty: 0.0
  // });
  
  // DocSum specific state
  const [documentText, setDocumentText] = useState('');
  const [summaryType, setSummaryType] = useState<'extractive' | 'abstractive' | 'key-points'>('abstractive');
  const [generatedSummary, setGeneratedSummary] = useState('');
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [summaryHistory, setSummaryHistory] = useState<Array<{
    id: string;
    documentText: string;
    summary: string;
    type: string;
    timestamp: Date;
  }>>([]);
  const [showSummaryHistory, setShowSummaryHistory] = useState(false);
  const [showUploadSection, setShowUploadSection] = useState(false);
  const [showExamples, setShowExamples] = useState(true);
  const [showBlueprintCard, setShowBlueprintCard] = useState(false);
  
  // Knowledge Base Management for RAG
  const [knowledgeBaseEnabled, setKnowledgeBaseEnabled] = useState(false);
  const [knowledgeBaseStatus, setKnowledgeBaseStatus] = useState<'disabled' | 'enabled' | 'loading'>('disabled');
  
  // Mockup document with specific information
  const mockupDocument = {
    title: "OPEA Framework Technical Specifications v2.1",
    content: `
# OPEA Framework Technical Specifications

## Overview
The OPEA (Open Platform for Enterprise AI) Framework is a comprehensive solution for building enterprise-grade AI applications. This document contains proprietary information about our internal architecture and implementation details.

## Core Components

### 1. Neural Processing Unit (NPU) Integration
Our custom NPU design, codenamed "Athena-X1", features:
- 128-bit vector processing units
- 4MB on-chip cache per core
- Custom instruction set optimized for transformer models
- Power efficiency: 45 TOPS/W at 8-bit precision

### 2. Memory Architecture
- Hierarchical memory system with L1/L2/L3 caches
- 512GB unified memory pool
- NVMe SSD storage with 7GB/s read bandwidth
- Memory bandwidth: 1.2TB/s

### 3. Software Stack
- Custom CUDA alternative: "OPEA Compute"
- Model serving framework: "Hermes"
- Data pipeline: "Poseidon Stream"
- Monitoring: "Atlas Metrics"

## Performance Benchmarks
- GPT-4 equivalent model inference: 45ms latency
- Batch processing: 10,000 requests/second
- Memory efficiency: 85% reduction vs standard implementations
- Cost per inference: $0.0001

## Security Features
- Hardware-level encryption with AES-256
- Secure enclave for model weights
- Zero-knowledge proofs for data privacy
- Quantum-resistant key exchange

## Deployment Architecture
- Multi-zone redundancy across 12 data centers
- Auto-scaling with 99.99% uptime SLA
- Edge computing nodes in 50+ locations
- Real-time model updates without downtime

## Pricing Model
- Base tier: $0.01 per 1K tokens
- Enterprise tier: $0.005 per 1K tokens
- Custom deployments: Contact sales
- Volume discounts available for 1M+ tokens/month

## Contact Information
For technical support: tech@opea.ai
For sales inquiries: sales@opea.ai
Emergency hotline: +1-555-OPEA-911
    `,
    metadata: {
      author: "OPEA Engineering Team",
      version: "2.1",
      lastUpdated: "2024-01-15",
      classification: "Public",
      size: "15.2 KB"
    }
  };

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
  const [uploadedFileInfo, setUploadedFileInfo] = React.useState<{name: string, size: number} | null>(null);
  const [uploadError, setUploadError] = React.useState<string>('');

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
    setIsLoading(true);

    // Add user message
    const newUserMessage: Message = {
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newUserMessage]);

    try {
      // Use RAG pipeline for ChatQnA when knowledge base is enabled
      let response = '';
      let sources: Array<{ title: string; url: string; snippet: string; }> | undefined = undefined;
      
      if (blueprint?.id === 'chatqna' && knowledgeBaseEnabled) {
        // RAG Pipeline: Search knowledge base and generate response
        const relevantSections = searchKnowledgeBase(userMessage);
        response = generateRAGResponse(userMessage, relevantSections);
        
        if (relevantSections.length > 0) {
          sources = relevantSections.map((section, index) => ({
            title: `${mockupDocument.title} - Section ${index + 1}`,
            url: '#',
            snippet: section.substring(0, 150) + '...'
          }));
        }
      } else if (blueprint?.id === 'chatqna') {
        // Standard response when knowledge base is disabled
        response = `I'm a general AI assistant. I don't have access to specific knowledge about "${userMessage}" since the knowledge base is currently disabled. You can enable the knowledge base to get more detailed, contextual responses based on our technical documentation.`;
      } else {
        // Generic response for other blueprints
        response = `Thank you for your message about "${userMessage}". This appears to be related to the ${blueprint?.name} system. I'm here to help you with any questions or tasks related to this blueprint.`;
      }

      // Add assistant response
      const assistantMessage: Message = {
        role: 'assistant',
        content: response,
        timestamp: new Date(),
        sources
      };
      setMessages(prev => [...prev, assistantMessage]);

    } catch (error) {
      console.error('Error processing message:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: `I apologize, but I encountered an error while processing your question about "${userMessage}". Please try again.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const getWelcomeMessage = useCallback(() => {
    if (!blueprint) return 'Hello! How can I help you today?';
    
    switch (blueprint.id) {
      case 'chatqna':
        return 'Hello! I\'m your ChatQnA assistant. I can help you with questions about the OPEA Framework, RAG systems, and more. What would you like to know?';
      case 'agentqna':
        return 'Hello! I\'m your AgentQnA assistant. I can help you understand multi-agent systems, agent architectures, and coordination patterns. What would you like to explore?';
      case 'codetrans':
        return 'Hello! I\'m your CodeTrans assistant. I can help you translate code between different programming languages. What code would you like to translate?';
      case 'docsum':
        return 'Hello! I\'m your DocSum assistant. I can help you summarize documents and extract key information. What would you like me to summarize?';
      default:
        return 'Hello! How can I help you today?';
    }
  }, [blueprint]);

  useEffect(() => {
    if (blueprint && messages.length === 0) {
      setMessages([{ role: 'assistant', content: getWelcomeMessage(), timestamp: new Date() }]);
    }
  }, [blueprint, getWelcomeMessage, messages.length]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // CodeGen specific functions
  // const handleGenerateCode = async () => {
  //   if (!codePrompt.trim() || isGeneratingCode) return;
    
  //   setIsGeneratingCode(true);
  //   try {
  //     // Simulate code generation with streaming
  //     const sampleCode = getSampleCode(codePrompt, selectedLanguage);
  //     let generatedCodeStream = '';
      
  //     for (let i = 0; i < sampleCode.length; i++) {
  //       generatedCodeStream += sampleCode[i];
  //       setGeneratedCode(generatedCodeStream);
  //       await new Promise(resolve => setTimeout(resolve, 20));
  //     }
      
  //     // Add to history
  //     const newEntry = {
  //       id: Date.now().toString(),
  //       prompt: codePrompt,
  //       code: sampleCode,
  //       language: selectedLanguage,
  //       timestamp: new Date()
  //     };
  //     setCodeHistory(prev => [newEntry, ...prev.slice(0, 9)]); // Keep last 10
      
  //   } catch (error) {
  //     console.error('Error generating code:', error);
  //     setGeneratedCode('// Error generating code. Please try again.');
  //   } finally {
  //     setIsGeneratingCode(false);
  //   }
  // };

  const handleTranslateCode = async () => {
    if (!inputCode.trim() || isGeneratingCode) return;
    
    setIsGeneratingCode(true);
    try {
      // Simulate code translation
      const translated = translateCodeSample(inputCode, inputLanguage, outputLanguage);
      setTranslatedCode(translated);
    } catch (error) {
      console.error('Error translating code:', error);
      setTranslatedCode('// Error translating code. Please try again.');
    } finally {
      setIsGeneratingCode(false);
    }
  };

  const translateCodeSample = (code: string, fromLang: string, toLang: string): string => {
    // Simple code translation examples
    const translations: Record<string, Record<string, string>> = {
      'python-javascript': {
        'def main():': 'function main() {',
        'print(': 'console.log(',
        'if __name__ == "__main__":': '// Main execution',
        'import ': 'const ',
        'from ': 'const ',
        'pass': '// TODO: Implement',
        'True': 'true',
        'False': 'false',
        'None': 'null'
      },
      'javascript-python': {
        'function ': 'def ',
        'console.log(': 'print(',
        'const ': 'import ',
        'let ': 'import ',
        'var ': 'import ',
        'true': 'True',
        'false': 'False',
        'null': 'None',
        'undefined': 'None'
      }
    };

    const key = `${fromLang}-${toLang}`;
    const translationMap = translations[key] || {};
    
    let translated = code;
    Object.entries(translationMap).forEach(([from, to]) => {
      translated = translated.replace(new RegExp(from, 'g'), to);
    });
    
    return translated;
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  // Knowledge Base Management Functions
  const handleToggleKnowledgeBase = async () => {
    if (knowledgeBaseEnabled) {
      setKnowledgeBaseStatus('loading');
      // Simulate disabling knowledge base
      await new Promise(resolve => setTimeout(resolve, 1000));
      setKnowledgeBaseEnabled(false);
      setKnowledgeBaseStatus('disabled');
    } else {
      setKnowledgeBaseStatus('loading');
      // Simulate enabling knowledge base
      await new Promise(resolve => setTimeout(resolve, 1500));
      setKnowledgeBaseEnabled(true);
      setKnowledgeBaseStatus('enabled');
    }
  };

  const searchKnowledgeBase = (query: string): string[] => {
    if (!knowledgeBaseEnabled) return [];
    
    const searchTerms = query.toLowerCase().split(' ');
    const content = mockupDocument.content.toLowerCase();
    const relevantSections: string[] = [];
    
    // Simple keyword matching for demo purposes
    if (searchTerms.some(term => content.includes(term))) {
      const lines = mockupDocument.content.split('\n');
      let currentSection = '';
      
      for (const line of lines) {
        if (line.startsWith('##') || line.startsWith('###')) {
          if (currentSection && searchTerms.some(term => currentSection.toLowerCase().includes(term))) {
            relevantSections.push(currentSection.trim());
          }
          currentSection = line;
        } else {
          currentSection += '\n' + line;
        }
      }
      
      // Add the last section if relevant
      if (currentSection && searchTerms.some(term => currentSection.toLowerCase().includes(term))) {
        relevantSections.push(currentSection.trim());
      }
    }
    
    return relevantSections.slice(0, 3); // Return top 3 relevant sections
  };

  const generateRAGResponse = (query: string, relevantSections: string[]): string => {
    if (relevantSections.length === 0) {
      return `I don't have specific information about "${query}" in my knowledge base. However, I can help you with general questions about AI and technology.`;
    }
    
    const context = relevantSections.join('\n\n');
    return `Based on the OPEA Framework Technical Specifications, here's what I found about "${query}":\n\n${context}\n\nThis information comes from our internal technical documentation. Is there anything specific about these details you'd like me to clarify?`;
  };

  const getFunctionalLogoByName = (name: string) => {
    // Map functional service names to their logo images
    const logoMap: Record<string, string> = {
      'Data Preparation Service': functionalDataprep,
      'Knowledge Retriever Service': functionalRetriever,
      'Embedding Generation Service': functionalEmbeddings,
      'Agent Orchestrator': functionalAgent,
      'Task Decomposition Service': functionalAgent,
      'Response Aggregator': functionalAgent,
      'Code Generation Service': functionalAgent,
      'Code Translation Service': functionalAgent,
      'Search Integration Service': functionalRetriever,
      'Document Processing Service': functionalDataprep,
      'Translation Service': functionalAgent,
      'Avatar Integration Service': functionalAnimation,
      'Speech Recognition Service': functionalAsr,
      'Fine-tuning Service': functionalFinetuning,
      'Guardrails Service': functionalGuardrails,
      'Reranking Service': functionalReranking,
      'Documentation Processing Service': functionalDataprep,
      'Technical Insight Extraction Service': functionalDataprep,
      'Documentation Quality Service': functionalDataprep
    };
    
    return logoMap[name] || functionalAgent; // Default fallback
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

  const getMicroservicesForBlueprint = () => {
    if (!blueprint) {
      return {
        models: [],
        functional: []
      };
    }

    if (blueprint.id === 'chatqna') {
      // Use generated blueprint data for ChatQnA
      const chatqnaData = generatedBlueprintData.chatqna;
      return {
        models: chatqnaData.microservices.models.map((model: any) => ({
          name: model.name,
          logo: model.logo,
          tags: model.tags
        })),
        functional: chatqnaData.microservices.functional.map((service: any) => ({
          name: service.name,
          description: service.description || '',
          logo: getFunctionalLogoByName(service.name),
          tags: service.tags
        }))
      };
    }

    const modelPool = [
      { name: 'Llama3.1 8B', logo: llamaImg, tags: ['LLM', 'Inference', 'Meta'] },
      { name: 'DeepSeek MoE 18B', logo: deepseekImg, tags: ['Mixture of Experts', 'LLM', 'Scalable'] },
      { name: 'Gemma 7B', logo: gemmaImg, tags: ['Lightweight', 'Google', 'Instruction-Tuned'] },
      { name: 'Qwen2 7B', logo: qwen2Img, tags: ['Multilingual', 'Chat', 'Reasoning'] },
      { name: 'LLaMA 4 Maverick 17B 128E Instruct FP8', logo: llama4MaverickImg, tags: ['FP8', 'FlashAttention', 'Featured', 'Extended Context'] },
      { name: 'Llama 3.1 405B Instruct FP8 KV', logo: llamaImg, tags: ['FP8', 'Large Scale', 'AMD', 'Featured'] }
    ];

    switch (blueprint.id) {
      case 'agentqna':
        return {
          models: [modelPool[4]], // Use Llama4 Maverick
          functional: [
            { name: 'Agent Orchestrator', description: 'Coordinates multiple specialized agents to handle complex tasks and workflows.', logo: getFunctionalLogoByName('Agent Orchestrator'), tags: ['Orchestration', 'Multi-Agent'] },
            { name: 'Task Decomposition Service', description: 'Breaks down complex user queries into smaller, manageable sub-tasks for individual agents.', logo: getFunctionalLogoByName('Task Decomposition'), tags: ['Task Planning', 'Analysis'] },
            { name: 'Response Aggregator', description: 'Synthesizes responses from multiple agents into a single, coherent answer.', logo: getFunctionalLogoByName('Response Aggregator'), tags: ['Synthesis', 'Aggregation'] }
          ]
        };
      case 'codegen':
        return {
          models: [modelPool[0], modelPool[1]],
          functional: [
            { name: 'Code Generation Service', description: 'Generates code based on natural language descriptions and requirements.', logo: getFunctionalLogoByName('Code Generation Service'), tags: ['Code Generation', 'Development'] },
            { name: 'Code Review Service', description: 'Analyzes generated code for best practices, security, and quality.', logo: getFunctionalLogoByName('Code Review Service'), tags: ['Code Review', 'Quality Assurance'] },
            { name: 'Best Practices Service', description: 'Ensures generated code follows industry standards and best practices.', logo: getFunctionalLogoByName('Best Practices Service'), tags: ['Best Practices', 'Standards'] }
          ]
        };
      case 'codetrans':
        return {
          models: [modelPool[5]], // Use Llama 3.1 405B Instruct FP8 KV
          functional: [
            { name: 'Language Detection Service', description: 'Automatically detects the programming language of input code.', logo: getFunctionalLogoByName('Language Detection Service'), tags: ['Language Detection', 'Analysis'] },
            { name: 'Code Translation Service', description: 'Translates code between different programming languages while preserving functionality.', logo: getFunctionalLogoByName('Code Translation Service'), tags: ['Code Translation', 'Transpilation'] },
            { name: 'Code Optimization Service', description: 'Optimizes translated code for performance and readability.', logo: getFunctionalLogoByName('Code Optimization Service'), tags: ['Optimization', 'Performance'] },
            { name: 'Translation Validation Service', description: 'Validates that translated code maintains the original functionality.', logo: getFunctionalLogoByName('Translation Validation Service'), tags: ['Validation', 'Testing'] }
          ]
        };
      case 'searchqna':
        return {
          models: [modelPool[2], modelPool[3]],
          functional: [
            { name: 'Query Enhancement Service', description: 'Enhances user queries for better search results and context understanding.', logo: getFunctionalLogoByName('Query Enhancement Service'), tags: ['Query Enhancement', 'NLP'] },
            { name: 'Search Integration Service', description: 'Integrates with external search engines and APIs for comprehensive results.', logo: getFunctionalLogoByName('Search Integration Service'), tags: ['Search Integration', 'APIs'] },
            { name: 'Result Synthesis Service', description: 'Synthesizes and ranks search results to provide coherent answers.', logo: getFunctionalLogoByName('Result Synthesis Service'), tags: ['Result Synthesis', 'Ranking'] },
            { name: 'Source Validation Service', description: 'Validates and verifies the credibility of search result sources.', logo: getFunctionalLogoByName('Source Validation Service'), tags: ['Source Validation', 'Credibility'] }
          ]
        };
      case 'docsum':
        return {
          models: [modelPool[1]], // Use DeepSeek R1 (DeepSeek MoE 18B)
          functional: [
            { name: 'Documentation Processing Service', description: 'Processes and prepares technical documentation for summarization analysis.', logo: getFunctionalLogoByName('Documentation Processing Service'), tags: ['Documentation Processing', 'Technical Content'] },
            { name: 'Technical Insight Extraction Service', description: 'Extracts key technical insights, API endpoints, and important concepts from documentation.', logo: getFunctionalLogoByName('Technical Insight Extraction Service'), tags: ['Technical Analysis', 'API Extraction'] },
            { name: 'Documentation Quality Service', description: 'Ensures generated summaries maintain technical accuracy and completeness.', logo: getFunctionalLogoByName('Documentation Quality Service'), tags: ['Quality Assurance', 'Technical Validation'] }
          ]
        };
      case 'translation':
        return {
          models: [modelPool[2], modelPool[3]],
          functional: [
            { name: 'Language Pair Service', description: 'Manages language pair configurations and translation models.', logo: getFunctionalLogoByName('Language Pair Service'), tags: ['Language Pairs', 'Configuration'] },
            { name: 'Translation Service', description: 'Performs high-quality text translation between supported languages.', logo: getFunctionalLogoByName('Translation Service'), tags: ['Translation', 'NLP'] },
            { name: 'Quality Assurance Service', description: 'Ensures translation quality and accuracy through validation checks.', logo: getFunctionalLogoByName('Quality Assurance Service'), tags: ['Quality Assurance', 'Validation'] },
            { name: 'Cultural Adaptation Service', description: 'Adapts translations to cultural context and local preferences.', logo: getFunctionalLogoByName('Cultural Adaptation Service'), tags: ['Cultural Adaptation', 'Localization'] }
          ]
        };
      case 'avatarchatbot':
        return {
          models: [modelPool[2], modelPool[3]],
          functional: [
            { name: 'Avatar Animation Service', description: 'Generates and manages avatar animations and expressions.', logo: getFunctionalLogoByName('Avatar Animation Service'), tags: ['Animation', 'Visual AI'] },
            { name: 'Interaction Manager', description: 'Manages user interactions and conversation flow with the avatar.', logo: getFunctionalLogoByName('Interaction Manager'), tags: ['Interaction Management', 'Conversation'] },
            { name: 'Multi-modal Service', description: 'Handles multi-modal interactions including text, voice, and visual elements.', logo: getFunctionalLogoByName('Multi-modal Service'), tags: ['Multi-modal', 'Integration'] },
            { name: 'Speech Recognition Service', description: 'Converts speech to text for voice-based interactions.', logo: getFunctionalLogoByName('Speech Recognition Service'), tags: ['Speech Recognition', 'ASR'] }
          ]
        };
      default:
        return {
          models: [],
          functional: []
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
            {microservices.models.map((service: any, index: number) => (
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
            {microservices.functional.map((service: any, index: number) => (
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

  const renderSettings = () => (
    <div className="bg-neutral-800 rounded-lg p-4 mb-4 border border-neutral-700">
      <h4 className="text-sm font-semibold mb-3 text-blue-400">Knowledge Base Configuration</h4>
      <div className="space-y-3">
        <div>
          <label className="block text-xs text-gray-400 mb-1">Knowledge Base Type</label>
          <select
            value={knowledgeBaseConfig.type}
            onChange={(e) => setKnowledgeBaseConfig(prev => ({ ...prev, type: e.target.value as 'vector' | 'document' | 'database' }))}
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

  const getInputPlaceholder = () => {
    if (!blueprint) return '';
    
    switch (blueprint.id) {
      case 'chatqna':
        return 'Ask a question about the OPEA Framework...';
      case 'agentqna':
        return 'Ask a question about the multi-agent system...';
      case 'codetrans':
        return 'Enter the code you want to translate...';
      case 'docsum':
        return 'Enter text to summarize...';
      default:
        return 'Ask a question about the system...';
    }
  };

  // DocSum specific functions
  const handleGenerateSummary = async () => {
    if (!documentText.trim() || isGeneratingSummary) return;
    
    setIsGeneratingSummary(true);
    try {
      // Simulate summary generation with streaming
      const sampleSummary = generateDocumentSummary(documentText, summaryType);
      let summaryStream = '';
      
      for (let i = 0; i < sampleSummary.length; i++) {
        summaryStream += sampleSummary[i];
        setGeneratedSummary(summaryStream);
        await new Promise(resolve => setTimeout(resolve, 30));
      }
      
      // Add to history
      const newEntry = {
        id: Date.now().toString(),
        documentText: documentText.substring(0, 200) + (documentText.length > 200 ? '...' : ''),
        summary: sampleSummary,
        type: summaryType,
        timestamp: new Date()
      };
      setSummaryHistory(prev => [newEntry, ...prev.slice(0, 9)]); // Keep last 10
      
    } catch (error) {
      console.error('Error generating summary:', error);
      setGeneratedSummary('Error generating summary. Please try again.');
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const generateDocumentSummary = (text: string, type: string): string => {
    const words = text.split(' ');
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    switch (type) {
      case 'extractive':
        // Extract key sentences (first few sentences)
        const keySentences = sentences.slice(0, Math.min(3, sentences.length));
        return keySentences.join('. ') + '.';
        
      case 'abstractive':
        // Generate a concise abstractive summary
        const wordCount = words.length;
        // const summaryLength = Math.max(50, Math.min(200, wordCount / 4));
        const keyWords = words.filter(word => word.length > 4).slice(0, 10);
        
        return `This document contains approximately ${wordCount} words and covers topics including ${keyWords.slice(0, 5).join(', ')}. The content appears to be ${wordCount > 500 ? 'comprehensive' : 'concise'} in nature, providing ${wordCount > 1000 ? 'detailed' : 'overview'} information on the subject matter.`;
        
      case 'key-points':
        // Extract key points as bullet points
        const points = sentences.slice(0, Math.min(5, sentences.length))
          .map(sentence => sentence.trim())
          .filter(sentence => sentence.length > 20);
        
        return points.map(point => `• ${point}`).join('\n\n');
        
      default:
        return 'Summary type not recognized.';
    }
  };

  if (!blueprint) {
    return (
      <div className="min-h-screen bg-black text-white font-sans flex flex-col">
        <div className="relative w-full h-72 md:h-96 lg:h-[28rem] overflow-hidden font-sans flex items-center" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
          <img src={bannerWave} alt="Banner" className="w-full h-full object-cover absolute inset-0" />
          {/* Navigation overlay */}
          <nav className="absolute top-0 left-0 w-full flex justify-between items-center pt-8 px-8 z-20 bg-black/30 backdrop-blur-md shadow-lg rounded-b-xl pointer-events-auto">
            <div className="flex flex-col items-start">
              <PlaygroundLogo />
              <button
                onClick={() => setShowBlueprintCard(true)}
                className="mt-2 px-4 py-2 bg-blue-600/20 text-blue-300 border border-blue-500/30 rounded-lg hover:bg-blue-600/30 transition-colors text-sm font-medium"
              >
                Blueprint Card
              </button>
            </div>
            <div className="flex gap-16">
              <Link to="/models" className="text-2xl font-bold text-white transition relative px-2 opacity-80 hover:opacity-100 after:content-[''] after:block after:h-1 after:rounded after:mt-1 after:w-0 after:bg-red-500 hover:after:w-full">Models</Link>
              <Link to="/blueprints" className="text-2xl font-bold text-white transition relative px-2 opacity-100 after:content-[''] after:block after:h-1 after:mt-1 after:w-full after:bg-red-500">Blueprints</Link>
              <Link to="/gpu-cloud" className="text-2xl font-bold text-white transition relative px-2 opacity-80 hover:opacity-100 after:content-[''] after:block after:h-1 after:rounded after:mt-1 after:w-0 after:bg-red-500 hover:after:w-full">GPU Clouds</Link>
            </div>
          </nav>
          {/* Loading banner content */}
          <div className="relative z-10 flex flex-row items-center justify-center w-full h-full px-8 gap-12 pt-20">
            <div className="flex flex-col items-center min-w-[220px]">
              <div className="relative w-full flex flex-col items-center">
                <div className="w-48 h-48 md:w-56 md:h-56 rounded-2xl border-4 border-white shadow-xl bg-white/10 animate-pulse flex items-center justify-center">
                  <div className="text-gray-400 text-lg">Loading...</div>
                </div>
              </div>
            </div>
            <div className="flex-1 flex flex-col justify-center items-start max-w-2xl">
              <div className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg mb-4 animate-pulse bg-white/10 h-16 rounded"></div>
              <div className="text-lg md:text-xl text-white/90 leading-relaxed font-medium drop-shadow max-w-2xl mb-4">
                Loading blueprint details...
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Blueprint Not Found</h1>
            <p className="text-gray-400">The requested blueprint could not be found.</p>
            <Link to="/blueprints" className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
              Back to Blueprints
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col">
      {/* Banner */}
      <div className="relative w-full h-72 md:h-96 lg:h-[28rem] overflow-hidden font-sans flex items-center" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
        <img src={bannerWave} alt="Banner" className="w-full h-full object-cover absolute inset-0" />
        {/* Navigation overlay */}
        <nav className="absolute top-0 left-0 w-full flex justify-between items-center pt-8 px-8 z-20 bg-black/30 backdrop-blur-md shadow-lg rounded-b-xl pointer-events-auto">
          <PlaygroundLogo />
          <div className="flex gap-16">
            <Link to="/models" className="text-2xl font-bold text-white transition relative px-2 opacity-80 hover:opacity-100 after:content-[''] after:block after:h-1 after:rounded after:mt-1 after:w-0 after:bg-red-500 hover:after:w-full">Models</Link>
            <Link to="/blueprints" className="text-2xl font-bold text-white transition relative px-2 opacity-100 after:content-[''] after:block after:h-1 after:mt-1 after:w-full after:bg-red-500">Blueprints</Link>
            <Link to="/gpu-cloud" className="text-2xl font-bold text-white transition relative px-2 opacity-80 hover:opacity-100 after:content-[''] after:block after:h-1 after:rounded after:mt-1 after:w-0 after:bg-red-500 hover:after:w-full">GPU Clouds</Link>
          </div>
        </nav>
        {/* Left-aligned glassy blueprint card overlay */}
        <div className="relative z-10 flex flex-row items-center justify-center w-full h-full px-8 gap-12 pt-20">
          <div className="flex flex-col items-center min-w-[220px]">
            <div className="relative w-full flex flex-col items-center">
              <div className="w-48 h-48 md:w-56 md:h-56 rounded-2xl border-4 border-white shadow-xl bg-white/10 backdrop-blur-md flex items-center justify-center">
                {blueprint.image && (
                  <img
                    src={blueprint.image}
                    alt={blueprint.name + ' Logo'}
                    className="w-32 h-32 md:w-40 md:h-40 object-cover rounded-xl border border-neutral-800"
                  />
                )}
              </div>
              <button
                onClick={() => setShowBlueprintCard(true)}
                className="mt-4 px-6 py-2 bg-blue-600/20 text-blue-300 border border-blue-500/30 rounded-lg hover:bg-blue-600/30 transition-colors text-sm font-medium backdrop-blur-md"
              >
                Blueprint Card
              </button>
            </div>
          </div>
          <div className="flex-1 flex flex-col justify-center items-start max-w-2xl">
            <div className="text-xs text-blue-300 font-semibold mb-2">AI Blueprint</div>
            <div className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg mb-4">{blueprint.name}</div>
            <div className="text-lg md:text-xl text-white/90 leading-relaxed font-medium drop-shadow max-w-2xl mb-4">
              {blueprint.description}
            </div>
            <div className="flex flex-wrap gap-2">
              {blueprint.tags.map((tag, index) => (
                <span 
                  key={index}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    index === 0 ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30' :
                    index === 1 ? 'bg-green-600/20 text-green-300 border border-green-500/30' :
                    'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* AI Model Disclaimer */}
      <div className="w-full flex justify-center z-50 mb-6">
        <div className="flex items-start gap-3 bg-white/20 backdrop-blur-md border border-black text-white px-6 py-2 rounded-xl shadow-md w-[90%] text-sm drop-shadow font-normal">
          <svg className="w-6 h-6 flex-shrink-0 mt-0.5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01"/>
          </svg>
          <span>
            AI models generate responses and outputs based on complex algorithms and machine learning techniques, and those responses or outputs may be inaccurate, harmful, biased or indecent. <b className="font-bold">By testing this model, you assume the risk of any harm caused by any response or output of the model.</b> Please do not upload any confidential information or personal data unless expressly permitted. <b className="font-bold">Your use is logged for security purposes.</b>
          </span>
        </div>
      </div>

      <div className="flex-1 flex flex-col max-w-[1600px] mx-auto w-full p-8">
        {/* Main Content */}
        <div className="w-full flex-1 h-full min-h-0 bg-neutral-900 rounded-lg p-6 border border-neutral-800 shadow flex flex-col">
          {/* Tabs */}
          <div className="flex border-b border-neutral-700 mb-6">
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
            <button
              onClick={() => setActiveTab('aims')}
              className={`px-6 py-2 -mb-px text-lg font-medium border-b-2 transition-colors duration-150 focus:outline-none
                ${activeTab === 'aims'
                  ? 'border-blue-500 text-blue-500 bg-transparent'
                  : 'border-transparent text-gray-400 hover:text-blue-400'}
              `}
              style={{ background: 'none', borderRadius: 0 }}
            >
              <CircleStackIcon className="w-5 h-5 inline mr-2" />
              AIMs
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'interact' && (
            blueprint?.id === 'codetrans' ? (
              <div className="flex flex-col lg:flex-row gap-8 h-[900px]">
                {/* Left Panel - Code Translation */}
                <div className="flex-1 h-full min-h-0 flex flex-col space-y-6">
                  <div className="bg-neutral-900 rounded-lg p-6 border border-neutral-800 shadow flex flex-col flex-1 h-full space-y-6">
                    {/* Code Input Section */}
                    <div className="flex flex-col flex-1">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-white">Source Code</h3>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-400">From:</span>
                          <select
                            className="bg-neutral-800 text-white border border-neutral-700 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={inputLanguage}
                            onChange={(e) => setInputLanguage(e.target.value)}
                          >
                            <option value="python">Python</option>
                            <option value="javascript">JavaScript</option>
                            <option value="typescript">TypeScript</option>
                            <option value="java">Java</option>
                            <option value="cpp">C++</option>
                            <option value="rust">Rust</option>
                            <option value="go">Go</option>
                          </select>
                        </div>
                      </div>
                      <textarea
                        className="flex-1 bg-neutral-800 text-white rounded-lg p-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 border border-neutral-700 font-mono text-sm"
                        placeholder="Paste your source code here to translate..."
                        value={inputCode}
                        onChange={(e) => setInputCode(e.target.value)}
                        disabled={isGeneratingCode}
                      />
                    </div>
                    {/* Translation Button */}
                    <div className="flex justify-center">
                      <button
                        onClick={handleTranslateCode}
                        disabled={isGeneratingCode || !inputCode.trim()}
                        className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                          isGeneratingCode || !inputCode.trim()
                            ? 'bg-neutral-700 text-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        {isGeneratingCode ? (
                          <div className="flex items-center space-x-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span>Translating Code...</span>
                          </div>
                        ) : (
                          'Translate Code'
                        )}
                      </button>
                    </div>
                    {/* Translated Code Section */}
                    <div className="flex flex-col flex-1">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-white">Translated Code</h3>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-400">To:</span>
                          <select
                            className="bg-neutral-800 text-white border border-neutral-700 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={outputLanguage}
                            onChange={(e) => setOutputLanguage(e.target.value)}
                          >
                            <option value="javascript">JavaScript</option>
                            <option value="python">Python</option>
                            <option value="typescript">TypeScript</option>
                            <option value="java">Java</option>
                            <option value="cpp">C++</option>
                            <option value="rust">Rust</option>
                            <option value="go">Go</option>
                          </select>
                          {translatedCode && (
                            <button
                              onClick={() => copyToClipboard(translatedCode)}
                              className="px-3 py-1 bg-neutral-700 text-white rounded text-sm hover:bg-neutral-600"
                            >
                              Copy Code
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="flex-1 min-h-0 bg-neutral-800 rounded-lg border border-neutral-700 overflow-auto p-4">
                        <pre className="text-white font-mono text-sm whitespace-pre-wrap">
                          {translatedCode ? (
                            translatedCode
                          ) : (
                            <div className="text-gray-400 italic">
                              Translated code will appear here...
                            </div>
                          )}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Right Panel - History & Examples for CodeTrans */}
                <div className="w-full lg:w-80 h-full min-h-0 flex flex-col space-y-4">
                  {/* Collapsible Sections */}
                  <div className="bg-neutral-900 rounded-lg border border-neutral-800 shadow">
                    {/* Recent Translations - Overlay Trigger */}
                    {codeHistory.length > 0 && (
                      <div className="border-b border-neutral-800">
                        <button
                          onClick={() => setShowSummaryHistory(!showSummaryHistory)}
                          className="w-full p-4 text-left flex items-center justify-between hover:bg-neutral-800 transition-colors"
                        >
                          <h3 className="text-lg font-semibold text-white">Recent Translations</h3>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-400">{codeHistory.length} items</span>
                            <ChevronDownIcon className={`w-5 h-5 text-gray-400 transition-transform ${showSummaryHistory ? 'rotate-180' : ''}`} />
                          </div>
                        </button>
                      </div>
                    )}
                    {/* Try Examples - Collapsible */}
                    <div>
                      <button
                        onClick={() => setShowExamples(!showExamples)}
                        className="w-full p-4 text-left flex items-center justify-between hover:bg-neutral-800 transition-colors"
                      >
                        <h3 className="text-lg font-semibold text-white">Try Examples</h3>
                        <ChevronDownIcon className={`w-5 h-5 text-gray-400 transition-transform ${showExamples ? 'rotate-180' : ''}`} />
                      </button>
                      {showExamples && (
                        <div className="p-4 space-y-2">
                          {[
                            `def fibonacci(n):
    """Calculate the nth Fibonacci number."""
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

# Test the function
for i in range(10):
    print(f"F({i}) = {fibonacci(i)}")`,
                            `function calculateFactorial(n) {
    if (n <= 1) return 1;
    return n * calculateFactorial(n - 1);
}

// Test the function
for (let i = 0; i < 10; i++) {
    console.log('Factorial(' + i + ') = ' + calculateFactorial(i));
}`,
                            `class UserManager {
    constructor() {
        this.users = [];
    }
    
    addUser(user) {
        this.users.push(user);
        return this.users.length;
    }
    
    getUserById(id) {
        return this.users.find(user => user.id === id);
    }
    
    getAllUsers() {
        return this.users;
    }
}`,
                            `async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(\`HTTP error! status: \${response.status}\`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}`,
                            `def quicksort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quicksort(left) + middle + quicksort(right)`
                          ].map((example, index) => (
                            <button
                              key={index}
                              onClick={() => setInputCode(example)}
                              className="w-full text-left text-sm text-gray-300 hover:text-white p-2 rounded bg-neutral-800 hover:bg-neutral-700 transition-colors"
                            >
                              {index === 0 ? 'Python Fibonacci → JavaScript' :
                               index === 1 ? 'JavaScript Factorial → Python' :
                               index === 2 ? 'JavaScript Class → Python' :
                               index === 3 ? 'JavaScript Async → Python' :
                               'Python Quicksort → JavaScript'}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Microservice Status - Fixed at bottom */}
                  <div className="flex-1">
                    {renderMicroserviceStatus()}
                  </div>
                </div>
              </div>
            ) : ['codegen', 'docsum'].includes(blueprint?.id || '') ? (
              <div className="flex flex-col lg:flex-row gap-8 h-[900px]">
                {/* Left Panel - Document Summarization */}
                <div className="flex-1 h-full min-h-0 flex flex-col space-y-6">
                  <div className="bg-neutral-900 rounded-lg p-6 border border-neutral-800 shadow flex flex-col flex-1 h-full space-y-6">
                    {/* Document Input Section */}
                    <div className="flex flex-col flex-1">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-white">Document Input</h3>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-400">Summary Type:</span>
                          <select
                            className="bg-neutral-800 text-white border border-neutral-700 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={summaryType}
                            onChange={(e) => setSummaryType(e.target.value as 'extractive' | 'abstractive' | 'key-points')}
                          >
                            <option value="abstractive">Abstractive</option>
                            <option value="extractive">Extractive</option>
                            <option value="key-points">Key Points</option>
                          </select>
                        </div>
                      </div>
                      <textarea
                        className="flex-1 bg-neutral-800 text-white rounded-lg p-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 border border-neutral-700"
                        placeholder="Paste or type your document content here for summarization..."
                        value={documentText}
                        onChange={(e) => setDocumentText(e.target.value)}
                        disabled={isGeneratingSummary}
                      />
                    </div>
                    {/* Generate Summary Button */}
                    <div className="flex justify-center">
                      <button
                        onClick={handleGenerateSummary}
                        disabled={isGeneratingSummary || !documentText.trim()}
                        className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                          isGeneratingSummary || !documentText.trim()
                            ? 'bg-neutral-700 text-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        {isGeneratingSummary ? (
                          <div className="flex items-center space-x-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span>Generating Summary...</span>
                          </div>
                        ) : (
                          'Generate Summary'
                        )}
                      </button>
                    </div>
                    {/* Generated Summary Section */}
                    <div className="flex flex-col flex-1">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-white">Generated Summary</h3>
                        {generatedSummary && (
                          <button
                            onClick={() => copyToClipboard(generatedSummary)}
                            className="px-3 py-1 bg-neutral-700 text-white rounded text-sm hover:bg-neutral-600"
                          >
                            Copy Summary
                          </button>
                        )}
                      </div>
                      <div className="flex-1 min-h-0 bg-neutral-800 rounded-lg border border-neutral-700 overflow-auto p-4">
                        <div className="prose prose-invert max-w-none text-sm">
                          {generatedSummary ? (
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm]}
                              rehypePlugins={[rehypeRaw]}
                            >
                              {generatedSummary}
                            </ReactMarkdown>
                          ) : (
                            <div className="text-gray-400 italic">
                              Generated summary will appear here...
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Right Panel - History & Examples */}
                <div className="w-full lg:w-80 h-full min-h-0 flex flex-col space-y-4">
                  {/* Collapsible Sections */}
                  <div className="bg-neutral-900 rounded-lg border border-neutral-800 shadow">
                    {/* Recent Summaries - Overlay Trigger */}
                    {summaryHistory.length > 0 && (
                      <div className="border-b border-neutral-800">
                        <button
                          onClick={() => setShowSummaryHistory(!showSummaryHistory)}
                          className="w-full p-4 text-left flex items-center justify-between hover:bg-neutral-800 transition-colors"
                        >
                          <h3 className="text-lg font-semibold text-white">Recent Summaries</h3>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-400">{summaryHistory.length} items</span>
                            <ChevronDownIcon className={`w-5 h-5 text-gray-400 transition-transform ${showSummaryHistory ? 'rotate-180' : ''}`} />
                          </div>
                        </button>
                      </div>
                    )}
                    {/* Upload Documentation - Overlay Trigger */}
                    <div className="border-b border-neutral-800">
                      <button
                        onClick={() => setShowUploadSection(!showUploadSection)}
                        className="w-full p-4 text-left flex items-center justify-between hover:bg-neutral-800 transition-colors"
                      >
                        <h3 className="text-lg font-semibold text-white">Upload Documentation</h3>
                        <div className="flex items-center space-x-2">
                          {uploadedFileInfo && (
                            <span className="text-xs text-green-400">1 file</span>
                          )}
                          <ChevronDownIcon className={`w-5 h-5 text-gray-400 transition-transform ${showUploadSection ? 'rotate-180' : ''}`} />
                        </div>
                      </button>
                    </div>
                    {/* Try Examples - Collapsible */}
                    <div>
                      <button
                        onClick={() => setShowExamples(!showExamples)}
                        className="w-full p-4 text-left flex items-center justify-between hover:bg-neutral-800 transition-colors"
                      >
                        <h3 className="text-lg font-semibold text-white">Try Examples</h3>
                        <ChevronDownIcon className={`w-5 h-5 text-gray-400 transition-transform ${showExamples ? 'rotate-180' : ''}`} />
                      </button>
                      {showExamples && (
                        <div className="p-4 space-y-2">
                          {blueprint?.id === 'codetrans' ? [
                            `def fibonacci(n):
    """Calculate the nth Fibonacci number."""
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

# Test the function
for i in range(10):
    print(f"F({i}) = {fibonacci(i)}")`,
                            `function calculateFactorial(n) {
    if (n <= 1) return 1;
    return n * calculateFactorial(n - 1);
}

// Test the function
for (let i = 0; i < 10; i++) {
    console.log('Factorial(' + i + ') = ' + calculateFactorial(i));
}`,
                            `class UserManager {
    constructor() {
        this.users = [];
    }
    
    addUser(user) {
        this.users.push(user);
        return this.users.length;
    }
    
    getUserById(id) {
        return this.users.find(user => user.id === id);
    }
    
    getAllUsers() {
        return this.users;
    }
}`,
                            `async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(\`HTTP error! status: \${response.status}\`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}`,
                            `def quicksort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quicksort(left) + middle + quicksort(right)`
                          ].map((example, index) => (
                            <button
                              key={index}
                              onClick={() => setInputMessage(`Translate this code to ${index % 2 === 0 ? 'JavaScript' : 'Python'}:\n\n${example}`)}
                              className="w-full text-left text-sm text-gray-300 hover:text-white p-2 rounded bg-neutral-800 hover:bg-neutral-700 transition-colors"
                            >
                              {index === 0 ? 'Python Fibonacci → JavaScript' :
                               index === 1 ? 'JavaScript Factorial → Python' :
                               index === 2 ? 'JavaScript Class → Python' :
                               index === 3 ? 'JavaScript Async → Python' :
                               'Python Quicksort → JavaScript'}
                            </button>
                          )) : [
                            `# API Reference\n\n## POST /v1/users\nCreate a new user in the system.\n\n**Request Body:**\n- name: string\n- email: string\n\n**Response:**\n- 201 Created: User object\n- 400 Bad Request: Validation error`,
                            `# Changelog\n\n## [1.2.0] - 2024-06-01\n### Added\n- Support for multi-factor authentication.\n- New API endpoint for password reset.\n\n### Fixed\n- Minor bug fixes in user profile module.`,
                            `# README\n\nThis project provides a RESTful API for managing tasks.\n\n## Features\n- Create, update, delete tasks\n- Assign tasks to users\n- Track task status and deadlines`,
                            `# Technical Specification\n\nThe system uses a microservices architecture with the following components:\n- Auth Service\n- User Service\n- Task Service\n\nAll services communicate via gRPC.`,
                            `# Integration Guide\n\nTo integrate with the payment gateway:\n1. Obtain your API key from the dashboard.\n2. Use the /v1/payments endpoint for transactions.\n3. Handle webhook events for payment status updates.`,
                          ].map((example, index) => (
                            <button
                              key={index}
                              onClick={() => setDocumentText(example)}
                              className="w-full text-left text-sm text-gray-300 hover:text-white p-2 rounded bg-neutral-800 hover:bg-neutral-700 transition-colors"
                            >
                              {example.split('\n')[0].replace(/^#+\s*/, '')}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Microservice Status - Fixed at bottom */}
                  <div className="flex-1">
                    {renderMicroserviceStatus()}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-row gap-8 h-[700px]">
                {/* Chat Interface (left) */}
                <div className="w-full md:w-[60%] flex-1 h-full min-h-0 bg-neutral-900 rounded-lg p-6 border border-neutral-800 shadow flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold flex items-center">
                      <ChatBubbleLeftRightIcon className="w-5 h-5 mr-2" />
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
                  {/* Data Sources for RAG */}
                  {blueprint?.id === 'chatqna' && (
                    <div className="bg-neutral-900 rounded-lg p-4 border border-neutral-800 shadow">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-white flex items-center">
                          <DocumentTextIcon className="w-4 h-4 mr-2" />
                          Knowledge Base
                        </h4>
                        <button
                          onClick={handleToggleKnowledgeBase}
                          disabled={knowledgeBaseStatus === 'loading'}
                          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                            knowledgeBaseStatus === 'loading'
                              ? 'bg-neutral-700 text-gray-400 cursor-not-allowed'
                              : knowledgeBaseEnabled
                              ? 'bg-red-600 text-white hover:bg-red-700'
                              : 'bg-green-600 text-white hover:bg-green-700'
                          }`}
                        >
                          {knowledgeBaseStatus === 'loading' ? (
                            <div className="flex items-center space-x-1">
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                              <span>Loading...</span>
                            </div>
                          ) : knowledgeBaseEnabled ? (
                            'Disable KB'
                          ) : (
                            'Enable KB'
                          )}
                        </button>
                      </div>
                      
                      {/* Status Indicator */}
                      <div className="mb-3 p-2 bg-neutral-800 rounded border border-neutral-700">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-300">Status:</span>
                          <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${
                              knowledgeBaseStatus === 'enabled' ? 'bg-green-500' : 
                              knowledgeBaseStatus === 'loading' ? 'bg-yellow-500' : 'bg-red-500'
                            }`}></div>
                            <span className={`text-sm ${
                              knowledgeBaseStatus === 'enabled' ? 'text-green-400' : 
                              knowledgeBaseStatus === 'loading' ? 'text-yellow-400' : 'text-red-400'
                            }`}>
                              {knowledgeBaseStatus === 'enabled' ? 'Active' : 
                               knowledgeBaseStatus === 'loading' ? 'Processing...' : 'Inactive'}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Document Information */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 bg-neutral-800 rounded border border-neutral-700">
                          <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${
                              knowledgeBaseEnabled ? 'bg-green-500' : 'bg-gray-500'
                            }`}></div>
                            <span className="text-sm text-gray-300">{mockupDocument.title}</span>
                          </div>
                          <span className="text-xs text-gray-400">{mockupDocument.metadata.size}</span>
                        </div>
                      </div>
                      
                      {/* Document Details */}
                      <div className="mt-3 pt-3 border-t border-neutral-700">
                        <div className="space-y-1 text-xs text-gray-400">
                          <div className="flex justify-between">
                            <span>Author:</span>
                            <span>{mockupDocument.metadata.author}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Version:</span>
                            <span>{mockupDocument.metadata.version}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Last Updated:</span>
                            <span>{mockupDocument.metadata.lastUpdated}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Classification:</span>
                            <span className="text-orange-400">{mockupDocument.metadata.classification}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* RAG Information */}
                      {knowledgeBaseEnabled && (
                        <div className="mt-3 pt-3 border-t border-neutral-700">
                          <div className="text-xs text-blue-400 mb-2">RAG Pipeline Active</div>
                          <div className="text-xs text-gray-400">
                            The chatbot will now search this document and provide responses based on the technical specifications.
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {renderMicroserviceStatus()}
                </div>
              </div>
            )
          )}

          {activeTab === 'aims' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Components</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full items-stretch">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Model Endpoints</h3>
                  <div className="space-y-6">
                    {getMicroservicesForBlueprint().models.map((model, index) => (
                      <Link
                        key={index}
                        to={`/models/${model.name === 'Qwen2 7B' ? 'Qwen/Qwen2-7B-Instruct' : 
                             model.name === 'Qwen3 32B' ? 'Qwen/Qwen3-32B' :
                             model.name === 'LLaMA 4 Maverick 17B 128E Instruct FP8' ? 'meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8' :
                             model.name === 'DeepSeek MoE 18B' ? 'deepseek-ai/DeepSeek-R1-0528' :
                             model.name === 'Llama 3.1 405B Instruct FP8 KV' ? 'amd/Llama-3_1-405B-Instruct-FP8-KV' :
                             model.name.toLowerCase().replace(/\s+/g, '-')}`}
                        className="group bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg p-0 flex flex-row items-stretch hover:bg-white/20 hover:shadow-2xl hover:shadow-white/30 hover:-translate-y-1 transition-all cursor-pointer h-[280px] w-full relative"
                        title="open in playground"
                      >
                        {/* Logo */}
                        <div className="flex items-center justify-center w-40 h-full bg-white/5 rounded-l-2xl border-r border-white/10">
                          <img
                            src={model.logo}
                            alt={model.name}
                            className="w-32 h-32 object-cover rounded-xl border-2 border-neutral-700 shadow-md bg-white/10"
                          />
                        </div>
                        {/* Info */}
                        <div className="flex-1 min-w-0 flex flex-col justify-center px-8 py-6">
                          <div className="text-xs text-blue-300 font-semibold mb-1 truncate">AI Model</div>
                          <div className="text-xs text-neutral-400 mb-1 truncate">Inference</div>
                          <div className="flex items-baseline gap-2 mb-1">
                            <h4 className="text-2xl font-bold group-hover:text-blue-400 transition truncate">{model.name}</h4>
                          </div>
                          <div className="text-sm text-neutral-200 mb-3 line-clamp-2">AI model for inference and generation</div>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {model.tags?.map((tag: string, tagIdx: number) => (
                              <span
                                key={tagIdx}
                                className={`px-2 py-1 rounded text-xs ${
                                  tagIdx === 0 ? 'bg-green-900/50 text-green-200' :
                                  tagIdx === 1 ? 'bg-purple-900/50 text-purple-200' :
                                  'bg-orange-900/50 text-orange-200'
                                }`}
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
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Functional Microservices</h3>
                  <div className="space-y-6">
                    {getMicroservicesForBlueprint().functional.map((service, index) => (
                      <div
                        key={index}
                        className="group bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg p-0 flex flex-row items-stretch h-[280px] w-full relative"
                      >
                        {/* Logo */}
                        <div className="flex items-center justify-center w-40 h-full bg-white/5 rounded-l-2xl border-r border-white/10">
                          <img 
                            src={getFunctionalLogoByName(service.name)} 
                            alt={service.name} 
                            className="w-32 h-32 object-cover rounded-xl border-2 border-neutral-700 shadow-md bg-white/10" 
                          />
                        </div>
                        {/* Info */}
                        <div className="flex-1 min-w-0 flex flex-col justify-center px-8 py-6">
                          <div className="text-xs text-blue-300 font-semibold mb-1 truncate">Microservice</div>
                          <div className="text-xs text-neutral-400 mb-1 truncate">Functional</div>
                          <div className="flex items-baseline gap-2 mb-1">
                            <h4 className="text-2xl font-bold group-hover:text-blue-400 transition truncate">{service.name}</h4>
                          </div>
                          <div className="text-sm text-neutral-200 mb-3 line-clamp-2">{service.description}</div>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {service.tags?.map((tag: string, tagIdx: number) => (
                              <span
                                key={tagIdx}
                                className={`px-2 py-1 rounded text-xs ${
                                  tagIdx === 0 ? 'bg-green-900/50 text-green-200' :
                                  tagIdx === 1 ? 'bg-purple-900/50 text-purple-200' :
                                  'bg-orange-900/50 text-orange-200'
                                }`}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Recent Summaries Overlay */}
      {showSummaryHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-neutral-900 rounded-lg border border-neutral-800 shadow-lg max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-neutral-800">
              <h3 className="text-lg font-semibold text-white">Recent Summaries</h3>
              <button
                onClick={() => setShowSummaryHistory(false)}
                className="text-gray-400 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4 space-y-3 overflow-y-auto max-h-[calc(80vh-80px)]">
              {summaryHistory.map((entry) => (
                <div key={entry.id} className="bg-neutral-800 rounded p-4 border border-neutral-700">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm text-gray-400">
                      {entry.timestamp.toLocaleString()}
                    </div>
                    <span className="text-xs bg-green-900/50 text-green-200 px-2 py-1 rounded">
                      {entry.type}
                    </span>
                  </div>
                  <div className="text-sm text-white mb-3 line-clamp-3">
                    {entry.documentText}
                  </div>
                  <div className="text-sm text-gray-300 mb-3 line-clamp-4">
                    {entry.summary}
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => {
                        setDocumentText(entry.documentText);
                        setSummaryType(entry.type as 'extractive' | 'abstractive' | 'key-points');
                        setGeneratedSummary(entry.summary);
                        setShowSummaryHistory(false);
                      }}
                      className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                    >
                      Load
                    </button>
                    <button
                      onClick={() => {
                        setGeneratedSummary(entry.summary);
                        setShowSummaryHistory(false);
                      }}
                      className="px-3 py-1 bg-neutral-700 text-white rounded text-sm hover:bg-neutral-600"
                    >
                      View Summary
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Upload Documentation Overlay */}
      {showUploadSection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-neutral-900 rounded-lg border border-neutral-800 shadow-lg max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-neutral-800">
              <h3 className="text-lg font-semibold text-white">Upload Documentation</h3>
              <button
                onClick={() => setShowUploadSection(false)}
                className="text-gray-400 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div
                className="w-full border-2 border-dashed border-blue-400 rounded-lg p-8 text-center text-gray-400 cursor-pointer hover:bg-blue-950/30 transition-colors"
                onDragOver={e => { e.preventDefault(); e.stopPropagation(); }}
                onDrop={async e => {
                  e.preventDefault();
                  e.stopPropagation();
                  const file = e.dataTransfer.files?.[0];
                  if (!file) return;
                  if (!file.name.match(/\.(txt|md)$/i)) {
                    setUploadError('Only .txt and .md files are supported.');
                    return;
                  }
                  if (file.size > 1024 * 1024) {
                    setUploadError('File size must be less than 1MB.');
                    return;
                  }
                  setUploadError('');
                  setUploadedFileInfo({ name: file.name, size: file.size });
                  const text = await file.text();
                  setDocumentText(text);
                }}
              >
                <div className="mb-4">
                  <svg className="w-12 h-12 mx-auto text-blue-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <div className="text-lg font-medium mb-2">Drag & drop your document here</div>
                <div className="text-sm mb-4">or</div>
                <label className="inline-block cursor-pointer text-blue-400 hover:underline font-semibold">
                  <input
                    type="file"
                    accept=".txt,.md,text/plain,text/markdown"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      if (!file.name.match(/\.(txt|md)$/i)) {
                        setUploadError('Only .txt and .md files are supported.');
                        return;
                      }
                      if (file.size > 1024 * 1024) {
                        setUploadError('File size must be less than 1MB.');
                        return;
                      }
                      setUploadError('');
                      setUploadedFileInfo({ name: file.name, size: file.size });
                      const text = await file.text();
                      setDocumentText(text);
                    }}
                  />
                  browse to upload
                </label>
                <div className="text-xs text-gray-500 mt-4">
                  Supported formats: .txt, .md (Max size: 1MB)
                </div>
              </div>
              
              {uploadedFileInfo && (
                <div className="bg-green-900/20 border border-green-700 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                      <div className="text-sm font-medium text-green-400">File uploaded successfully!</div>
                      <div className="text-xs text-gray-400">{uploadedFileInfo.name} ({(uploadedFileInfo.size/1024).toFixed(1)} KB)</div>
                    </div>
                  </div>
                </div>
              )}
              
              {uploadError && (
                <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="text-sm text-red-400">{uploadError}</div>
                  </div>
                </div>
              )}
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowUploadSection(false)}
                  className="px-4 py-2 bg-neutral-700 text-white rounded hover:bg-neutral-600"
                >
                  Cancel
                </button>
                {uploadedFileInfo && (
                  <button
                    onClick={() => setShowUploadSection(false)}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Use Document
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Blueprint Card Overlay */}
      {showBlueprintCard && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowBlueprintCard(false)}
        >
          <div 
            className="bg-neutral-900 rounded-lg border border-neutral-800 shadow-lg max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-neutral-800">
              <h3 className="text-lg font-semibold text-white">Blueprint Card - {blueprint?.name}</h3>
              <button
                onClick={() => setShowBlueprintCard(false)}
                className="text-gray-400 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-8 overflow-y-auto max-h-[calc(90vh-80px)]">
              {/* Architecture Overview */}
              {getArchitectureImage() && (
                <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700">
                  <h2 className="text-2xl font-bold mb-4 text-white">Architecture Overview</h2>
                  <div className="flex justify-center">
                    <img 
                      src={getArchitectureImage()!} 
                      alt={`${blueprint?.name} Architecture`}
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
          </div>
        </div>
      )}
    </div>
  );
};

export default BlueprintDetail;
