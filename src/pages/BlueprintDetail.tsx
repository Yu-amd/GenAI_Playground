import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { PaperAirplaneIcon, Cog6ToothIcon, DocumentTextIcon, CircleStackIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
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

const BlueprintDetail: React.FC = () => {
  const { blueprintId } = useParams<{ blueprintId: string }>();
  const blueprint = blueprints.find(bp => bp.id === blueprintId);
  const [activeTab, setActiveTab] = useState<'card' | 'aims' | 'interact'>('card');
  const [markdownContent, setMarkdownContent] = useState<string>('');
  
  // CodeGen specific state
  const [selectedLanguage, setSelectedLanguage] = useState('python');
  const [generatedCode, setGeneratedCode] = useState('');
  const [inputLanguage, setInputLanguage] = useState('python');
  const [outputLanguage, setOutputLanguage] = useState('javascript');
  const [inputCode, setInputCode] = useState('');
  const [translatedCode, setTranslatedCode] = useState('');
  const [codePrompt, setCodePrompt] = useState('');
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);
  const [codeHistory, setCodeHistory] = useState<Array<{
    id: string;
    prompt: string;
    code: string;
    language: string;
    timestamp: Date;
  }>>([]);
  const [generationSettings, setGenerationSettings] = useState({
    temperature: 0.7,
    maxTokens: 1000,
    topP: 0.9,
    frequencyPenalty: 0.0,
    presencePenalty: 0.0
  });
  
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

  // CodeGen specific functions
  const handleGenerateCode = async () => {
    if (!codePrompt.trim() || isGeneratingCode) return;
    
    setIsGeneratingCode(true);
    try {
      // Simulate code generation with streaming
      const sampleCode = getSampleCode(codePrompt, selectedLanguage);
      let generatedCodeStream = '';
      
      for (let i = 0; i < sampleCode.length; i++) {
        generatedCodeStream += sampleCode[i];
        setGeneratedCode(generatedCodeStream);
        await new Promise(resolve => setTimeout(resolve, 20));
      }
      
      // Add to history
      const newEntry = {
        id: Date.now().toString(),
        prompt: codePrompt,
        code: sampleCode,
        language: selectedLanguage,
        timestamp: new Date()
      };
      setCodeHistory(prev => [newEntry, ...prev.slice(0, 9)]); // Keep last 10
      
    } catch (error) {
      console.error('Error generating code:', error);
      setGeneratedCode('// Error generating code. Please try again.');
    } finally {
      setIsGeneratingCode(false);
    }
  };

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

  const getSampleCode = (prompt: string, language: string): string => {
    const samples: Record<string, Record<string, string>> = {
      python: {
        'function': `def ${prompt.toLowerCase().replace(/[^a-zA-Z0-9]/g, '_')}():
    """
    ${prompt}
    """
    # TODO: Implement function logic
    pass`,
        'class': `class ${prompt.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('')}:
    """
    ${prompt}
    """
    def __init__(self):
        pass`,
        'api': `import requests
import json

def ${prompt.toLowerCase().replace(/[^a-zA-Z0-9]/g, '_')}_api():
    """
    ${prompt}
    """
    url = "https://api.example.com/endpoint"
    headers = {"Content-Type": "application/json"}
    
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        print(f"Error: {e}")
        return None`,
        'default': `# ${prompt}
def main():
    """
    Main function for ${prompt}
    """
    print("Hello, World!")
    
if __name__ == "__main__":
    main()`
      },
      javascript: {
        'function': `function ${prompt.toLowerCase().replace(/[^a-zA-Z0-9]/g, '_')}() {
    /**
     * ${prompt}
     */
    // TODO: Implement function logic
}

module.exports = { ${prompt.toLowerCase().replace(/[^a-zA-Z0-9]/g, '_')} };`,
        'class': `class ${prompt.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('')} {
    /**
     * ${prompt}
     */
    constructor() {
        // Initialize class
    }
}

module.exports = ${prompt.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('')};`,
        'api': `const axios = require('axios');

async function ${prompt.toLowerCase().replace(/[^a-zA-Z0-9]/g, '_')}_api() {
    /**
     * ${prompt}
     */
    try {
        const response = await axios.get('https://api.example.com/endpoint', {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error:', error.message);
        return null;
    }
}

module.exports = { ${prompt.toLowerCase().replace(/[^a-zA-Z0-9]/g, '_')}_api };`,
        'default': `// ${prompt}
function main() {
    /**
     * Main function for ${prompt}
     */
    console.log("Hello, World!");
}

main();`
      }
    };

    const languageSamples = samples[language] || samples.python;
    const key = Object.keys(languageSamples).find(k => prompt.toLowerCase().includes(k)) || 'default';
    return languageSamples[key];
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
    if (n.includes('dataprep') || n.includes('data preparation')) return functionalDataprep;
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

  // Helper to generate service ID for routing
  const getServiceId = (serviceName: string): string => {
    const name = serviceName.toLowerCase();
    if (name.includes('data preparation')) return 'data-preparation-service';
    if (name.includes('knowledge retriever')) return 'knowledge-retriever-service';
    if (name.includes('embedding generation')) return 'embedding-generation-service';
    if (name.includes('agent orchestrator')) return 'agent-orchestrator';
    if (name.includes('task decomposition')) return 'task-decomposition-service';
    if (name.includes('response aggregator')) return 'response-aggregator';
    if (name.includes('project context')) return 'project-context-service';
    if (name.includes('code review')) return 'code-review-service';
    if (name.includes('best practices')) return 'best-practices-service';
    if (name.includes('language detection')) return 'language-detection-service';
    if (name.includes('code optimization')) return 'code-optimization-service';
    if (name.includes('translation validation')) return 'translation-validation-service';
    if (name.includes('query enhancement')) return 'query-enhancement-service';
    if (name.includes('result synthesis')) return 'result-synthesis-service';
    if (name.includes('source validation')) return 'source-validation-service';
    if (name.includes('document processing')) return 'document-processing-service';
    if (name.includes('key point extraction')) return 'key-point-extraction-service';
    if (name.includes('summary quality')) return 'summary-quality-service';
    if (name.includes('language pair')) return 'language-pair-service';
    if (name.includes('quality assurance')) return 'quality-assurance-service';
    if (name.includes('cultural adaptation')) return 'cultural-adaptation-service';
    if (name.includes('avatar animation')) return 'avatar-animation-service';
    if (name.includes('interaction manager')) return 'interaction-manager';
    if (name.includes('multi-modal')) return 'multi-modal-service';
    if (name.includes('business logic')) return 'business-logic-service';
    if (name.includes('data service')) return 'data-service';
    if (name.includes('integration service')) return 'integration-service';
    
    // Fallback: convert to kebab case
    return name.replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  };

  const renderAimsContent = () => {
    const microservices = getMicroservicesForBlueprint();
    // Assign logos by name for functional microservices
    const functionalWithLogos = microservices.functional.map((svc) => ({
      ...svc,
      logo: getFunctionalLogoByName(svc.name)
    }));
    
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full items-stretch">
          <div className="space-y-4">
            {/* Removed: <h3 className="text-lg font-semibold text-white">Models Inference Endpoints</h3> */}
            <div className="space-y-6">
              {microservices.models.map((model, index) => (
                <Link
                  key={index}
                  to={`/models/${model.name === 'Qwen2 7B' ? 'Qwen/Qwen2-7B-Instruct' : model.name.toLowerCase().replace(/\s+/g, '-')}`}
                  className="group bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg p-10 flex flex-row items-center hover:bg-white/20 hover:shadow-2xl hover:shadow-white/30 hover:-translate-y-1 transition-all cursor-pointer h-[280px] w-full"
                >
                  <img
                    src={model.logo}
                    alt={model.name}
                    className="w-36 h-36 rounded-2xl border-2 border-neutral-700 shadow-md transition mr-10 flex-shrink-0 object-cover"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <h4 className="font-medium text-white text-xl mb-2">{model.name}</h4>
                    <div className="flex space-x-2 mb-3">
                      {model.tags?.map((tag, tagIdx) => (
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
                    <p className="text-sm text-neutral-300 line-clamp-3">AI model for inference and generation</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          
          <div className="space-y-4">
            {/* Functional Microservices */}
            <div className="space-y-6">
              {functionalWithLogos.map((service, index) => (
                <Link
                  key={index}
                  to={`/services/${getServiceId(service.name)}`}
                  className="group bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg p-10 flex flex-row items-center hover:bg-white/20 hover:shadow-2xl hover:shadow-white/30 hover:-translate-y-1 transition-all cursor-pointer h-[280px] w-full"
                >
                  <img src={service.logo} alt={service.name} className="w-36 h-36 rounded-2xl border-2 border-neutral-700 shadow-md transition mr-10 flex-shrink-0 object-cover" />
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <h4 className="font-medium text-white text-xl mb-2">{service.name}</h4>
                    <div className="flex space-x-2 mb-3">
                      {service.tags?.map((tag, tagIdx) => (
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
                    <p className="text-sm text-neutral-300 line-clamp-3">{service.description}</p>
                  </div>
                </Link>
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
    if (!blueprint) return '';
    
    switch (blueprint.id) {
      case 'chatqna':
        return 'Welcome to ChatQnA! I\'m a RAG-powered chatbot that can answer questions using knowledge retrieval. How can I help you today?';
      case 'agentqna':
        return 'Welcome to AgentQnA! I\'m a multi-agent system that can coordinate specialized agents to answer your questions. What would you like to know?';
      case 'codegen':
        return 'Welcome to CodeGen! I can help you generate code in various programming languages. What would you like me to create?';
      case 'codetrans':
        return 'Welcome to CodeTrans! I can translate code between different programming languages. What code would you like me to translate?';
      case 'searchqna':
        return 'Welcome to SearchQnA! I can search the web and provide you with up-to-date information. What would you like me to search for?';
      case 'docsum':
        return 'Welcome to DocSum! I can create summaries of different types of text. What would you like me to summarize?';
      case 'translation':
        return 'Welcome to Translation! I can translate text between different languages. What would you like me to translate?';
      case 'avatarchatbot':
        return 'Welcome to Avatar Chatbot! I\'m a conversational AI with a virtual avatar. How can I assist you today?';
      default:
        return 'Welcome! How can I help you today?';
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
      return {
        models: [
          { name: 'Qwen2 7B', logo: qwen2Img, tags: ['Code Generation', 'Mathematics', 'Reasoning'] }
        ],
        functional: [
          { name: 'Data Preparation Service', description: 'Handles data preprocessing, cleaning, and preparation for RAG pipeline', logo: getFunctionalLogoByName('Data Preparation Service'), tags: ['Data Processing', 'Preprocessing'] },
          { name: 'Knowledge Retriever Service', description: 'Retrieves relevant documents and information from knowledge base', logo: getFunctionalLogoByName('Knowledge Retriever Service'), tags: ['Retrieval', 'Search'] },
          { name: 'Embedding Generation Service', description: 'Generates vector embeddings for documents and queries', logo: getFunctionalLogoByName('Embedding Generation Service'), tags: ['Embeddings', 'Vectorization'] }
        ]
      };
    }

    const modelPool = [
      { name: 'Llama3.1 8B', logo: llamaImg, tags: ['LLM', 'Inference', 'Meta'] },
      { name: 'DeepSeek MoE 18B', logo: deepseekImg, tags: ['Mixture of Experts', 'LLM', 'Scalable'] },
      { name: 'Gemma 7B', logo: gemmaImg, tags: ['Lightweight', 'Google', 'Instruction-Tuned'] },
      { name: 'Qwen2 7B', logo: qwen2Img, tags: ['Multilingual', 'Chat', 'Reasoning'] }
    ];

    switch (blueprint.id) {
      case 'agentqna':
        return {
          models: [modelPool[0], modelPool[2]],
          functional: [
            { name: 'Agent Orchestrator', description: 'Coordinates multiple specialized agents to handle complex tasks and workflows.', logo: getFunctionalLogoByName('Agent Orchestrator'), tags: ['Orchestration', 'Multi-Agent'] },
            { name: 'Task Decomposition Service', description: 'Breaks down complex user queries into smaller, manageable sub-tasks for individual agents.', logo: getFunctionalLogoByName('Task Decomposition'), tags: ['Task Planning', 'Analysis'] },
            { name: 'Response Aggregator', description: 'Synthesizes responses from multiple agents into a single, coherent answer.', logo: getFunctionalLogoByName('Response Aggregator'), tags: ['Synthesis', 'Aggregation'] }
          ]
        };
      case 'codegen':
        return {
          models: [modelPool[1]],
          functional: [
            { name: 'Project Context Service', description: 'Maintains an understanding of the project structure and dependencies for context-aware code generation.', logo: getFunctionalLogoByName('Project Context'), tags: ['Context', 'Analysis'] },
            { name: 'Code Validation Service', description: 'Performs static analysis and validation on generated code to ensure correctness and quality.', logo: getFunctionalLogoByName('Code Validation'), tags: ['Validation', 'QA'] }
          ]
        };
      case 'codetrans':
        return {
          models: [modelPool[3]],
          functional: [
            { name: 'Language Detection Service', description: 'Automatically detects the source programming language of the input code snippet.', logo: getFunctionalLogoByName('Language Detection'), tags: ['Detection', 'Analysis'] },
            { name: 'Code Optimization Service', description: "Optimizes translated code for the target language's best practices and idioms.", logo: getFunctionalLogoByName('Optimization'), tags: ['Refinement', 'Best Practices'] },
            { name: 'Translation Validation Service', description: 'Validates translated code for syntactical correctness and functional equivalence.', logo: getFunctionalLogoByName('Translation Validation'), tags: ['Validation', 'Testing'] }
          ]
        };
      case 'searchqna':
        return {
          models: [modelPool[0], modelPool[1]],
          functional: [
            { name: 'Query Enhancement Service', description: 'Rewrites and expands user queries to improve search engine result relevance and accuracy.', logo: getFunctionalLogoByName('Query Enhancement'), tags: ['Query Processing', 'NLP'] },
            { name: 'Web Search Service', description: 'Interfaces with external search APIs (e.g., Google, Bing) to retrieve up-to-date web results.', logo: getFunctionalLogoByName('Web Search'), tags: ['Search', 'API'] }
          ]
        };
      case 'docsum':
        return {
          models: [modelPool[2]],
          functional: [
            { name: 'Document Processing Service', description: 'Handles various document formats (PDF, DOCX, etc.) and extracts raw text content.', logo: getFunctionalLogoByName('Document Processing'), tags: ['Parsing', 'Extraction'] },
            { name: 'Key Point Extraction Service', description: 'Identifies and extracts the most important sentences and concepts from the text.', logo: getFunctionalLogoByName('Key Point Extraction'), tags: ['NLP', 'Analysis'] }
          ]
        };
      case 'translation':
        return {
          models: [modelPool[3], modelPool[2]],
          functional: [
            { name: 'Language Pair Service', description: 'Manages and selects the optimal translation models for specific language pairs.', logo: getFunctionalLogoByName('Language Pair'), tags: ['Model Management', 'Languages'] },
            { name: 'Cultural Adaptation Service', description: 'Adapts translations for cultural context, localization, and nuanced expressions.', logo: getFunctionalLogoByName('Cultural Adaptation'), tags: ['Localization', 'Context'] }
          ]
        };
      case 'avatarchatbot':
        return {
          models: [modelPool[0]],
          functional: [
            { name: 'Avatar Animation Service', description: 'Generates real-time avatar animations, lip-sync, and facial expressions from text.', logo: getFunctionalLogoByName('Avatar Animation'), tags: ['Animation', 'Graphics'] },
            { name: 'Text-to-Speech Service', description: 'Synthesizes natural-sounding speech for the avatar from the chatbot\'s text responses.', logo: getFunctionalLogoByName('Text-to-Speech'), tags: ['TTS', 'Audio'] }
          ]
        };
      default:
        return {
          models: [modelPool[0]],
          functional: [
            { name: 'Agent Orchestrator', description: 'Coordinates agent workflows and manages agent lifecycles.', logo: getFunctionalLogoByName('Agent Orchestrator'), tags: ['Orchestration', 'Multi-Agent'] }
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
    <div className="min-h-screen bg-neutral-900 text-white font-sans flex flex-col">
      {/* Banner */}
      <div className="relative w-full h-56 md:h-72 lg:h-80 overflow-hidden">
        <img src={bannerWave} alt="Banner" className="w-full h-full object-cover" />
        <nav className="absolute top-0 left-0 w-full flex justify-between items-center pt-8 px-8 z-10">
          <PlaygroundLogo />
          <div className="flex gap-16">
            <Link to="/models" className="text-2xl font-bold transition relative px-2 opacity-80 hover:opacity-100 after:content-[''] after:block after:h-1 after:rounded after:mt-1 after:w-0 after:bg-red-500 hover:after:w-full">Models</Link>
            <Link to="/blueprints" className="text-2xl font-bold transition relative px-2 opacity-100 after:content-[''] after:block after:h-1 after:rounded after:mt-1 after:w-full after:bg-red-500">Blueprints</Link>
            <Link to="/gpu-cloud" className="text-2xl font-bold transition relative px-2 opacity-80 hover:opacity-100 after:content-[''] after:block after:h-1 after:rounded after:mt-1 after:w-0 after:bg-red-500 hover:after:w-full">GPU Clouds</Link>
          </div>
        </nav>
      </div>

      <div className="flex-1 flex flex-col max-w-[1600px] mx-auto w-full p-8">
        {/* Main Content */}
        <div className="w-full flex-1 h-full min-h-0 bg-neutral-900 rounded-lg p-6 border border-neutral-800 shadow flex flex-col">
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
            ['codegen', 'codetrans'].includes(blueprint?.id || '') ? (
              // Specialized CodeGen/CodeTrans Interface
              <div className="flex flex-col lg:flex-row gap-8 h-[700px]">
                {/* Left Panel - Code Generation/Translation */}
                <div className="flex-1 h-full min-h-0 flex flex-col space-y-6">
                  {blueprint?.id === 'codetrans' ? (
                    // Code Translation Interface
                    <div className="bg-neutral-900 rounded-lg p-6 border border-neutral-800 shadow flex flex-col flex-1 h-full space-y-6">
                      {/* Input Section */}
                      <div className="flex flex-col flex-1">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-white">Input Code</h3>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-400">Language:</span>
                            <select
                              className="bg-neutral-800 text-white border border-neutral-700 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              value={inputLanguage}
                              onChange={(e) => setInputLanguage(e.target.value)}
                            >
                              <option value="python">Python</option>
                              <option value="javascript">JavaScript</option>
                              <option value="java">Java</option>
                              <option value="go">Go</option>
                              <option value="csharp">C#</option>
                              <option value="rust">Rust</option>
                            </select>
                          </div>
                        </div>
                        <textarea
                          className="flex-1 bg-neutral-800 text-white rounded-lg p-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 border border-neutral-700 font-mono text-sm"
                          placeholder="Paste your code here to translate..."
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
                              <span>Translating...</span>
                            </div>
                          ) : (
                            'Translate Code'
                          )}
                        </button>
                      </div>
                      
                      {/* Output Section */}
                      <div className="flex flex-col flex-1">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-white">Translated Code</h3>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-400">Language:</span>
                            <select
                              className="bg-neutral-800 text-white border border-neutral-700 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              value={outputLanguage}
                              onChange={(e) => setOutputLanguage(e.target.value)}
                            >
                              <option value="python">Python</option>
                              <option value="javascript">JavaScript</option>
                              <option value="java">Java</option>
                              <option value="go">Go</option>
                              <option value="csharp">C#</option>
                              <option value="rust">Rust</option>
                            </select>
                            {translatedCode && (
                              <button
                                onClick={() => copyToClipboard(translatedCode)}
                                className="px-3 py-1 bg-neutral-700 text-white rounded text-sm hover:bg-neutral-600"
                              >
                                Copy
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="flex-1 min-h-0 bg-neutral-800 rounded-lg border border-neutral-700 overflow-auto">
                          <Highlight
                            theme={themes.nightOwl}
                            code={translatedCode || `// Translated code will appear here...`}
                            language={outputLanguage === 'csharp' ? 'clike' : outputLanguage}
                          >
                            {({ style, tokens, getLineProps, getTokenProps }) => (
                              <pre className="p-4 m-0 min-h-full font-mono text-sm" style={style}>
                                {tokens.map((line, i) => (
                                  <div key={i} {...getLineProps({ line })}>
                                    {line.map((token, key) => (
                                      <span key={key} {...getTokenProps({ token })} />
                                    ))}
                                  </div>
                                ))}
                              </pre>
                            )}
                          </Highlight>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Code Generation Interface
                    <div className="bg-neutral-900 rounded-lg p-6 border border-neutral-800 shadow flex flex-col flex-1 h-full space-y-6">
                      {/* Prompt Section */}
                      <div className="flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-white">Code Generation Prompt</h3>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-400">Language:</span>
                            <select
                              className="bg-neutral-800 text-white border border-neutral-700 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              value={selectedLanguage}
                              onChange={(e) => setSelectedLanguage(e.target.value)}
                            >
                              <option value="python">Python</option>
                              <option value="javascript">JavaScript</option>
                              <option value="java">Java</option>
                              <option value="go">Go</option>
                              <option value="csharp">C#</option>
                              <option value="rust">Rust</option>
                            </select>
                          </div>
                        </div>
                        <textarea
                          className="bg-neutral-800 text-white rounded-lg p-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 border border-neutral-700"
                          rows={4}
                          placeholder="Describe the code you want to generate... (e.g., 'function to calculate fibonacci numbers', 'class for user authentication', 'API endpoint for user management')"
                          value={codePrompt}
                          onChange={(e) => setCodePrompt(e.target.value)}
                          disabled={isGeneratingCode}
                        />
                      </div>
                      
                      {/* Generation Settings */}
                      <div className="bg-neutral-800 rounded-lg p-4 border border-neutral-700">
                        <h4 className="text-sm font-semibold mb-3 text-blue-400">Generation Settings</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">Temperature</label>
                            <input
                              type="range"
                              min="0"
                              max="2"
                              step="0.1"
                              value={generationSettings.temperature}
                              onChange={(e) => setGenerationSettings(prev => ({ ...prev, temperature: parseFloat(e.target.value) }))}
                              className="w-full"
                            />
                            <span className="text-xs text-gray-400">{generationSettings.temperature}</span>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">Max Tokens</label>
                            <input
                              type="range"
                              min="100"
                              max="2000"
                              step="100"
                              value={generationSettings.maxTokens}
                              onChange={(e) => setGenerationSettings(prev => ({ ...prev, maxTokens: parseInt(e.target.value) }))}
                              className="w-full"
                            />
                            <span className="text-xs text-gray-400">{generationSettings.maxTokens}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Generate Button */}
                      <div className="flex justify-center">
                        <button
                          onClick={handleGenerateCode}
                          disabled={isGeneratingCode || !codePrompt.trim()}
                          className={`px-8 py-3 rounded-lg font-medium transition-colors ${
                            isGeneratingCode || !codePrompt.trim()
                              ? 'bg-neutral-700 text-gray-400 cursor-not-allowed'
                              : 'bg-green-600 text-white hover:bg-green-700'
                          }`}
                        >
                          {isGeneratingCode ? (
                            <div className="flex items-center space-x-2">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              <span>Generating...</span>
                            </div>
                          ) : (
                            'Generate Code'
                          )}
                        </button>
                      </div>
                      
                      {/* Generated Code Section */}
                      <div className="flex flex-col flex-1">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-white">Generated Code</h3>
                          {generatedCode && (
                            <button
                              onClick={() => copyToClipboard(generatedCode)}
                              className="px-3 py-1 bg-neutral-700 text-white rounded text-sm hover:bg-neutral-600"
                            >
                              Copy Code
                            </button>
                          )}
                        </div>
                        <div className="flex-1 min-h-0 bg-neutral-800 rounded-lg border border-neutral-700 overflow-auto">
                          <Highlight
                            theme={themes.nightOwl}
                            code={generatedCode || '// Generated code will appear here...'}
                            language={selectedLanguage === 'csharp' ? 'clike' : selectedLanguage}
                          >
                            {({ style, tokens, getLineProps, getTokenProps }) => (
                              <pre className="p-4 m-0 min-h-full font-mono text-sm" style={style}>
                                {tokens.map((line, i) => (
                                  <div key={i} {...getLineProps({ line })}>
                                    {line.map((token, key) => (
                                      <span key={key} {...getTokenProps({ token })} />
                                    ))}
                                  </div>
                                ))}
                              </pre>
                            )}
                          </Highlight>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Right Panel - History & Examples */}
                <div className="w-full lg:w-80 h-full min-h-0 flex flex-col space-y-4">
                  {/* Code History */}
                  {codeHistory.length > 0 && (
                    <div className="bg-neutral-900 rounded-lg p-4 border border-neutral-800 shadow flex-1">
                      <h3 className="text-lg font-semibold text-white mb-4">Recent Generations</h3>
                      <div className="space-y-3 max-h-60 overflow-y-auto">
                        {codeHistory.map((entry) => (
                          <div key={entry.id} className="bg-neutral-800 rounded p-3 border border-neutral-700">
                            <div className="text-sm text-gray-400 mb-1">
                              {entry.timestamp.toLocaleTimeString()}
                            </div>
                            <div className="text-xs text-white mb-2 line-clamp-2">
                              {entry.prompt}
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs bg-blue-900/50 text-blue-200 px-2 py-1 rounded">
                                {entry.language}
                              </span>
                              <button
                                onClick={() => {
                                  setCodePrompt(entry.prompt);
                                  setSelectedLanguage(entry.language);
                                  setGeneratedCode(entry.code);
                                }}
                                className="text-xs text-blue-400 hover:text-blue-300"
                              >
                                Load
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Quick Examples */}
                  <div className="bg-neutral-900 rounded-lg p-4 border border-neutral-800 shadow">
                    <h3 className="text-lg font-semibold text-white mb-4">Quick Examples</h3>
                    <div className="space-y-2">
                      {[
                        'function to calculate fibonacci numbers',
                        'class for user authentication',
                        'API endpoint for user management',
                        'database connection utility',
                        'file upload handler'
                      ].map((example, index) => (
                        <button
                          key={index}
                          onClick={() => setCodePrompt(example)}
                          className="w-full text-left text-sm text-gray-300 hover:text-white p-2 rounded bg-neutral-800 hover:bg-neutral-700 transition-colors"
                        >
                          {example}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Microservice Status */}
                  <div className="flex-1">
                    {renderMicroserviceStatus()}
                  </div>
                </div>
              </div>
            ) : (
              // Generic Chat Interface for other blueprints
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
        </div>
      </div>
    </div>
  );
};

export default BlueprintDetail; 
