import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import bannerWave from '../assets/banner_wave.png';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import {
  PaperAirplaneIcon,
  CodeBracketIcon,
  CircleStackIcon,
  Cog6ToothIcon,
  ClipboardIcon,
  CheckIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline';
import { getDefaultCode } from '../utils/apiCodeGenerator';
import { Dialog } from '@headlessui/react';
import { Highlight, themes } from 'prism-react-renderer';
// Functional logo imports
import functionalRetriever from '../../graphics/logos/functional/functional_retriever.png';
import functionalReranking from '../../graphics/logos/functional/functional_reranking.png';
import functionalGuardrails from '../../graphics/logos/functional/functional_guardrails.png';
import functionalFinetuning from '../../graphics/logos/functional/functional_finetuning.png';
import functionalEmbeddings from '../../graphics/logos/functional/functional_embeddings.png';
import functionalDataprep from '../../graphics/logos/functional/functional_dataprep.png';
import functionalAsr from '../../graphics/logos/functional/functional_asr.png';
import functionalAnimation from '../../graphics/logos/functional/functional_animation.png';
import functionalAgent from '../../graphics/logos/functional/functional_agent.png';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

interface FunctionalService {
  id: string;
  name: string;
  description: string;
  logo: string;
  tags: string[];
  blueprint: string;
  endpoints: string[];
  capabilities: string[];
  documentation: string;
}

const FunctionalServiceDetail: React.FC = () => {
  const { serviceId = '' } = useParams();
  const [activeTab, setActiveTab] = useState<'overview' | 'interact' | 'code'>(
    'overview'
  );
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'system',
      content: "Hi, I'm a functional microservice. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<
    'python' | 'typescript' | 'rust' | 'go' | 'shell'
  >('python');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [endpointConfig, setEndpointConfig] = useState({
    endpoint: 'http://localhost:8080',
    apiKey: '',
  });
  const [copied, setCopied] = useState(false);
  const [codeContent, setCodeContent] = useState('');

  // Helper to map functional microservice names to logos (best fit)
  const getFunctionalLogoByName = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('retriev')) return functionalRetriever;
    if (n.includes('rerank')) return functionalReranking;
    if (n.includes('guardrail')) return functionalGuardrails;
    if (n.includes('finetune')) return functionalFinetuning;
    if (n.includes('embedding')) return functionalEmbeddings;
    if (n.includes('dataprep') || n.includes('data preparation'))
      return functionalDataprep;
    if (n.includes('asr')) return functionalAsr;
    if (n.includes('animation')) return functionalAnimation;
    if (n.includes('agent') || n.includes('orchestrator'))
      return functionalAgent;
    if (n.includes('quality')) return functionalGuardrails;
    if (n.includes('manager')) return functionalAgent;
    if (n.includes('processing')) return functionalDataprep;
    if (n.includes('context')) return functionalEmbeddings;
    if (n.includes('synthesis')) return functionalFinetuning;
    if (n.includes('validation')) return functionalReranking;
    if (n.includes('adaptation')) return functionalFinetuning;
    if (n.includes('multi-modal')) return functionalAsr;
    if (n.includes('interaction')) return functionalAgent;
    if (n.includes('business logic')) return functionalAgent;
    if (n.includes('data service')) return functionalDataprep;
    if (n.includes('integration')) return functionalAgent;
    return functionalAgent;
  };

  // Mock functional service data
  const getFunctionalService = (): FunctionalService | null => {
    const serviceIdDecoded = decodeURIComponent(serviceId);

    const serviceMap: Record<string, FunctionalService> = {
      // ChatQnA services
      'data-preparation-service': {
        id: 'data-preparation-service',
        name: 'Data Preparation Service',
        description:
          'Handles data preprocessing, cleaning, and preparation for RAG pipeline',
        logo: getFunctionalLogoByName('Data Preparation Service'),
        tags: ['Data Processing', 'Preprocessing'],
        blueprint: 'chatqna',
        endpoints: ['/api/v1/prepare', '/api/v1/clean', '/api/v1/validate'],
        capabilities: [
          'Data cleaning',
          'Format conversion',
          'Quality validation',
          'Schema enforcement',
        ],
        documentation: `# Data Preparation Service

## Overview
The Data Preparation Service is responsible for preprocessing and cleaning data before it enters the RAG pipeline.

## Capabilities
- **Data Cleaning**: Removes duplicates, handles missing values
- **Format Conversion**: Converts between various data formats
- **Quality Validation**: Ensures data meets quality standards
- **Schema Enforcement**: Validates data against predefined schemas`,
      },
      'knowledge-retriever-service': {
        id: 'knowledge-retriever-service',
        name: 'Knowledge Retriever Service',
        description:
          'Retrieves relevant documents and information from knowledge base',
        logo: getFunctionalLogoByName('Knowledge Retriever Service'),
        tags: ['Retrieval', 'Search'],
        blueprint: 'chatqna',
        endpoints: ['/api/v1/search', '/api/v1/retrieve', '/api/v1/similar'],
        capabilities: [
          'Semantic search',
          'Vector retrieval',
          'Hybrid search',
          'Relevance scoring',
        ],
        documentation: `# Knowledge Retriever Service

## Overview
The Knowledge Retriever Service finds and retrieves relevant information from the knowledge base.

## Capabilities
- **Semantic Search**: Finds documents based on meaning
- **Vector Retrieval**: Uses vector embeddings for similarity-based retrieval
- **Hybrid Search**: Combines semantic and keyword-based search
- **Relevance Scoring**: Ranks results by relevance to the query`,
      },
      'embedding-generation-service': {
        id: 'embedding-generation-service',
        name: 'Embedding Generation Service',
        description: 'Generates vector embeddings for documents and queries',
        logo: getFunctionalLogoByName('Embedding Generation Service'),
        tags: ['Embeddings', 'Vectorization'],
        blueprint: 'chatqna',
        endpoints: ['/api/v1/embed', '/api/v1/batch-embed', '/api/v1/compare'],
        capabilities: [
          'Text embedding',
          'Batch processing',
          'Similarity comparison',
          'Model management',
        ],
        documentation: `# Embedding Generation Service

## Overview
The Embedding Generation Service converts text into high-dimensional vector representations.

## Capabilities
- **Text Embedding**: Converts text to vector representations
- **Batch Processing**: Processes multiple documents efficiently
- **Similarity Comparison**: Compares embeddings for similarity
- **Model Management**: Supports multiple embedding models`,
      },
      // AgentQnA services
      'agent-orchestrator': {
        id: 'agent-orchestrator',
        name: 'Agent Orchestrator',
        description: 'Coordinates agent workflows and manages agent lifecycles',
        logo: getFunctionalLogoByName('Agent Orchestrator'),
        tags: ['Orchestration', 'Coordination'],
        blueprint: 'agentqna',
        endpoints: [
          '/api/v1/orchestrate',
          '/api/v1/coordinate',
          '/api/v1/manage',
        ],
        capabilities: [
          'Workflow coordination',
          'Agent lifecycle management',
          'Task distribution',
          'Response aggregation',
        ],
        documentation: `# Agent Orchestrator

## Overview
The Agent Orchestrator coordinates multiple specialized agents to handle complex tasks.

## Capabilities
- **Workflow Coordination**: Manages multi-agent workflows
- **Agent Lifecycle Management**: Handles agent creation and termination
- **Task Distribution**: Distributes tasks to appropriate agents
- **Response Aggregation**: Combines responses from multiple agents`,
      },
      'task-decomposition-service': {
        id: 'task-decomposition-service',
        name: 'Task Decomposition Service',
        description:
          'Breaks down complex queries into manageable subtasks for agents',
        logo: getFunctionalLogoByName('Task Decomposition Service'),
        tags: ['Task Management', 'Decomposition'],
        blueprint: 'agentqna',
        endpoints: ['/api/v1/decompose', '/api/v1/analyze', '/api/v1/plan'],
        capabilities: [
          'Query analysis',
          'Task breakdown',
          'Dependency mapping',
          'Execution planning',
        ],
        documentation: `# Task Decomposition Service

## Overview
The Task Decomposition Service breaks complex queries into manageable subtasks.

## Capabilities
- **Query Analysis**: Analyzes complex queries for components
- **Task Breakdown**: Splits tasks into smaller, manageable pieces
- **Dependency Mapping**: Identifies task dependencies and order
- **Execution Planning**: Creates optimal execution plans`,
      },
      'response-aggregator': {
        id: 'response-aggregator',
        name: 'Response Aggregator',
        description:
          'Aggregates and synthesizes responses from multiple agents',
        logo: getFunctionalLogoByName('Response Aggregator'),
        tags: ['Aggregation', 'Synthesis'],
        blueprint: 'agentqna',
        endpoints: [
          '/api/v1/aggregate',
          '/api/v1/synthesize',
          '/api/v1/combine',
        ],
        capabilities: [
          'Response collection',
          'Content synthesis',
          'Conflict resolution',
          'Quality assessment',
        ],
        documentation: `# Response Aggregator

## Overview
The Response Aggregator combines and synthesizes responses from multiple agents.

## Capabilities
- **Response Collection**: Gathers responses from all agents
- **Content Synthesis**: Combines information into coherent responses
- **Conflict Resolution**: Resolves conflicts between agent responses
- **Quality Assessment**: Evaluates response quality and completeness`,
      },
      // CodeGen services
      'project-context-service': {
        id: 'project-context-service',
        name: 'Project Context Service',
        description:
          'Maintains understanding of project structure and dependencies',
        logo: getFunctionalLogoByName('Project Context Service'),
        tags: ['Context', 'Project Management'],
        blueprint: 'codegen',
        endpoints: [
          '/api/v1/context',
          '/api/v1/structure',
          '/api/v1/dependencies',
        ],
        capabilities: [
          'Project analysis',
          'Dependency tracking',
          'Structure mapping',
          'Context maintenance',
        ],
        documentation: `# Project Context Service

## Overview
The Project Context Service maintains understanding of project structure and dependencies.

## Capabilities
- **Project Analysis**: Analyzes project structure and components
- **Dependency Tracking**: Tracks dependencies between modules
- **Structure Mapping**: Maps project architecture and relationships
- **Context Maintenance**: Maintains project context for code generation`,
      },
      'code-review-service': {
        id: 'code-review-service',
        name: 'Code Review Service',
        description:
          'Performs automated code reviews and suggests improvements',
        logo: getFunctionalLogoByName('Code Review Service'),
        tags: ['Quality Assurance', 'Review'],
        blueprint: 'codegen',
        endpoints: ['/api/v1/review', '/api/v1/analyze', '/api/v1/suggest'],
        capabilities: [
          'Code analysis',
          'Quality assessment',
          'Improvement suggestions',
          'Best practices enforcement',
        ],
        documentation: `# Code Review Service

## Overview
The Code Review Service performs automated code reviews and suggests improvements.

## Capabilities
- **Code Analysis**: Analyzes code for quality and issues
- **Quality Assessment**: Evaluates code quality and maintainability
- **Improvement Suggestions**: Suggests specific improvements
- **Best Practices Enforcement**: Ensures adherence to coding standards`,
      },
      'best-practices-service': {
        id: 'best-practices-service',
        name: 'Best Practices Service',
        description: 'Recommends and enforces coding best practices',
        logo: getFunctionalLogoByName('Best Practices Service'),
        tags: ['Best Practices', 'Guidelines'],
        blueprint: 'codegen',
        endpoints: ['/api/v1/practices', '/api/v1/enforce', '/api/v1/guide'],
        capabilities: [
          'Practice recommendations',
          'Guideline enforcement',
          'Pattern recognition',
          'Standards compliance',
        ],
        documentation: `# Best Practices Service

## Overview
The Best Practices Service recommends and enforces coding best practices.

## Capabilities
- **Practice Recommendations**: Suggests best practices for specific scenarios
- **Guideline Enforcement**: Enforces coding guidelines and standards
- **Pattern Recognition**: Identifies common patterns and anti-patterns
- **Standards Compliance**: Ensures compliance with industry standards`,
      },
      // CodeTrans services
      'language-detection-service': {
        id: 'language-detection-service',
        name: 'Language Detection Service',
        description:
          'Automatically detects source and target programming languages',
        logo: getFunctionalLogoByName('Language Detection Service'),
        tags: ['Language Detection', 'Analysis'],
        blueprint: 'codetrans',
        endpoints: ['/api/v1/detect', '/api/v1/analyze', '/api/v1/identify'],
        capabilities: [
          'Language identification',
          'Syntax analysis',
          'Feature detection',
          'Compatibility assessment',
        ],
        documentation: `# Language Detection Service

## Overview
The Language Detection Service automatically detects programming languages.

## Capabilities
- **Language Identification**: Identifies source and target languages
- **Syntax Analysis**: Analyzes code syntax and structure
- **Feature Detection**: Detects language-specific features
- **Compatibility Assessment**: Assesses translation compatibility`,
      },
      'code-optimization-service': {
        id: 'code-optimization-service',
        name: 'Code Optimization Service',
        description:
          'Optimizes translated code for target language best practices',
        logo: getFunctionalLogoByName('Code Optimization Service'),
        tags: ['Optimization', 'Best Practices'],
        blueprint: 'codetrans',
        endpoints: ['/api/v1/optimize', '/api/v1/improve', '/api/v1/enhance'],
        capabilities: [
          'Performance optimization',
          'Best practice application',
          'Code refinement',
          'Efficiency improvement',
        ],
        documentation: `# Code Optimization Service

## Overview
The Code Optimization Service optimizes translated code for target language best practices.

## Capabilities
- **Performance Optimization**: Optimizes code for better performance
- **Best Practice Application**: Applies target language best practices
- **Code Refinement**: Refines and improves code quality
- **Efficiency Improvement**: Improves code efficiency and readability`,
      },
      'translation-validation-service': {
        id: 'translation-validation-service',
        name: 'Translation Validation Service',
        description:
          'Validates translated code for correctness and functionality',
        logo: getFunctionalLogoByName('Translation Validation Service'),
        tags: ['Validation', 'Quality Assurance'],
        blueprint: 'codetrans',
        endpoints: ['/api/v1/validate', '/api/v1/test', '/api/v1/verify'],
        capabilities: [
          'Correctness validation',
          'Functionality testing',
          'Error detection',
          'Quality verification',
        ],
        documentation: `# Translation Validation Service

## Overview
The Translation Validation Service validates translated code for correctness and functionality.

## Capabilities
- **Correctness Validation**: Validates translation accuracy
- **Functionality Testing**: Tests translated code functionality
- **Error Detection**: Detects translation errors and issues
- **Quality Verification**: Verifies overall translation quality`,
      },
      // SearchQnA services
      'query-enhancement-service': {
        id: 'query-enhancement-service',
        name: 'Query Enhancement Service',
        description: 'Optimizes search queries for better result relevance',
        logo: getFunctionalLogoByName('Query Enhancement Service'),
        tags: ['Query Optimization', 'Search'],
        blueprint: 'searchqna',
        endpoints: ['/api/v1/enhance', '/api/v1/optimize', '/api/v1/improve'],
        capabilities: [
          'Query expansion',
          'Keyword optimization',
          'Context enhancement',
          'Relevance improvement',
        ],
        documentation: `# Query Enhancement Service

## Overview
The Query Enhancement Service optimizes search queries for better result relevance.

## Capabilities
- **Query Expansion**: Expands queries with relevant terms
- **Keyword Optimization**: Optimizes keywords for better search results
- **Context Enhancement**: Enhances queries with contextual information
- **Relevance Improvement**: Improves query relevance and precision`,
      },
      'result-synthesis-service': {
        id: 'result-synthesis-service',
        name: 'Result Synthesis Service',
        description:
          'Combines and synthesizes information from multiple sources',
        logo: getFunctionalLogoByName('Result Synthesis Service'),
        tags: ['Synthesis', 'Aggregation'],
        blueprint: 'searchqna',
        endpoints: ['/api/v1/synthesize', '/api/v1/combine', '/api/v1/merge'],
        capabilities: [
          'Information synthesis',
          'Source combination',
          'Content merging',
          'Coherence creation',
        ],
        documentation: `# Result Synthesis Service

## Overview
The Result Synthesis Service combines and synthesizes information from multiple sources.

## Capabilities
- **Information Synthesis**: Synthesizes information from multiple sources
- **Source Combination**: Combines results from different sources
- **Content Merging**: Merges content while maintaining coherence
- **Coherence Creation**: Creates coherent and unified responses`,
      },
      'source-validation-service': {
        id: 'source-validation-service',
        name: 'Source Validation Service',
        description: 'Validates source credibility and information accuracy',
        logo: getFunctionalLogoByName('Source Validation Service'),
        tags: ['Validation', 'Quality Assurance'],
        blueprint: 'searchqna',
        endpoints: ['/api/v1/validate', '/api/v1/verify', '/api/v1/assess'],
        capabilities: [
          'Credibility assessment',
          'Accuracy verification',
          'Source evaluation',
          'Quality checking',
        ],
        documentation: `# Source Validation Service

## Overview
The Source Validation Service validates source credibility and information accuracy.

## Capabilities
- **Credibility Assessment**: Assesses source credibility and reliability
- **Accuracy Verification**: Verifies information accuracy and truthfulness
- **Source Evaluation**: Evaluates source quality and relevance
- **Quality Checking**: Checks overall information quality`,
      },
      // DocSum services
      'document-processing-service': {
        id: 'document-processing-service',
        name: 'Document Processing Service',
        description: 'Handles various document formats and preprocessing',
        logo: getFunctionalLogoByName('Document Processing Service'),
        tags: ['Document Processing', 'Preprocessing'],
        blueprint: 'docsum',
        endpoints: ['/api/v1/process', '/api/v1/parse', '/api/v1/extract'],
        capabilities: [
          'Format handling',
          'Text extraction',
          'Structure parsing',
          'Content preprocessing',
        ],
        documentation: `# Document Processing Service

## Overview
The Document Processing Service handles various document formats and preprocessing.

## Capabilities
- **Format Handling**: Handles multiple document formats
- **Text Extraction**: Extracts text from various document types
- **Structure Parsing**: Parses document structure and organization
- **Content Preprocessing**: Prepares content for summarization`,
      },
      'key-point-extraction-service': {
        id: 'key-point-extraction-service',
        name: 'Key Point Extraction Service',
        description: 'Identifies and extracts key points and main ideas',
        logo: getFunctionalLogoByName('Key Point Extraction Service'),
        tags: ['Extraction', 'Analysis'],
        blueprint: 'docsum',
        endpoints: ['/api/v1/extract', '/api/v1/identify', '/api/v1/analyze'],
        capabilities: [
          'Key point identification',
          'Main idea extraction',
          'Content analysis',
          'Importance ranking',
        ],
        documentation: `# Key Point Extraction Service

## Overview
The Key Point Extraction Service identifies and extracts key points and main ideas.

## Capabilities
- **Key Point Identification**: Identifies important points in documents
- **Main Idea Extraction**: Extracts main ideas and themes
- **Content Analysis**: Analyzes content for key information
- **Importance Ranking**: Ranks information by importance`,
      },
      'summary-quality-service': {
        id: 'summary-quality-service',
        name: 'Summary Quality Service',
        description: 'Ensures summary quality, coherence, and accuracy',
        logo: getFunctionalLogoByName('Summary Quality Service'),
        tags: ['Quality Assurance', 'Validation'],
        blueprint: 'docsum',
        endpoints: ['/api/v1/quality', '/api/v1/validate', '/api/v1/assess'],
        capabilities: [
          'Quality assessment',
          'Coherence checking',
          'Accuracy validation',
          'Completeness verification',
        ],
        documentation: `# Summary Quality Service

## Overview
The Summary Quality Service ensures summary quality, coherence, and accuracy.

## Capabilities
- **Quality Assessment**: Assesses summary quality and effectiveness
- **Coherence Checking**: Checks summary coherence and flow
- **Accuracy Validation**: Validates summary accuracy against source
- **Completeness Verification**: Verifies summary completeness`,
      },
      // Translation services
      'language-pair-service': {
        id: 'language-pair-service',
        name: 'Language Pair Service',
        description: 'Manages translation models for specific language pairs',
        logo: getFunctionalLogoByName('Language Pair Service'),
        tags: ['Language Management', 'Translation'],
        blueprint: 'translation',
        endpoints: ['/api/v1/pairs', '/api/v1/models', '/api/v1/select'],
        capabilities: [
          'Language pair management',
          'Model selection',
          'Capability assessment',
          'Optimization',
        ],
        documentation: `# Language Pair Service

## Overview
The Language Pair Service manages translation models for specific language pairs.

## Capabilities
- **Language Pair Management**: Manages available language pairs
- **Model Selection**: Selects optimal models for language pairs
- **Capability Assessment**: Assesses translation capabilities
- **Optimization**: Optimizes model selection for quality`,
      },
      'quality-assurance-service': {
        id: 'quality-assurance-service',
        name: 'Quality Assurance Service',
        description: 'Ensures translation quality and consistency',
        logo: getFunctionalLogoByName('Quality Assurance Service'),
        tags: ['Quality Assurance', 'Validation'],
        blueprint: 'translation',
        endpoints: ['/api/v1/quality', '/api/v1/validate', '/api/v1/check'],
        capabilities: [
          'Quality checking',
          'Consistency validation',
          'Error detection',
          'Improvement suggestions',
        ],
        documentation: `# Quality Assurance Service

## Overview
The Quality Assurance Service ensures translation quality and consistency.

## Capabilities
- **Quality Checking**: Checks translation quality and accuracy
- **Consistency Validation**: Validates translation consistency
- **Error Detection**: Detects translation errors and issues
- **Improvement Suggestions**: Suggests translation improvements`,
      },
      'cultural-adaptation-service': {
        id: 'cultural-adaptation-service',
        name: 'Cultural Adaptation Service',
        description: 'Adapts translations for cultural context and nuances',
        logo: getFunctionalLogoByName('Cultural Adaptation Service'),
        tags: ['Cultural Adaptation', 'Localization'],
        blueprint: 'translation',
        endpoints: ['/api/v1/adapt', '/api/v1/culture', '/api/v1/localize'],
        capabilities: [
          'Cultural adaptation',
          'Context awareness',
          'Nuance preservation',
          'Localization support',
        ],
        documentation: `# Cultural Adaptation Service

## Overview
The Cultural Adaptation Service adapts translations for cultural context and nuances.

## Capabilities
- **Cultural Adaptation**: Adapts content for cultural context
- **Context Awareness**: Maintains cultural context and meaning
- **Nuance Preservation**: Preserves cultural nuances and subtleties
- **Localization Support**: Supports localization requirements`,
      },
      // AvatarChatbot services
      'avatar-animation-service': {
        id: 'avatar-animation-service',
        name: 'Avatar Animation Service',
        description: 'Generates real-time avatar animations and expressions',
        logo: getFunctionalLogoByName('Avatar Animation Service'),
        tags: ['Animation', 'Visual'],
        blueprint: 'avatarchatbot',
        endpoints: ['/api/v1/animate', '/api/v1/express', '/api/v1/render'],
        capabilities: [
          'Real-time animation',
          'Expression generation',
          'Visual rendering',
          'Performance optimization',
        ],
        documentation: `# Avatar Animation Service

## Overview
The Avatar Animation Service generates real-time avatar animations and expressions.

## Capabilities
- **Real-time Animation**: Generates animations in real-time
- **Expression Generation**: Creates appropriate facial expressions
- **Visual Rendering**: Renders avatar visuals and animations
- **Performance Optimization**: Optimizes animation performance`,
      },
      'interaction-manager': {
        id: 'interaction-manager',
        name: 'Interaction Manager',
        description: 'Manages user interactions and conversation state',
        logo: getFunctionalLogoByName('Interaction Manager'),
        tags: ['Interaction', 'State Management'],
        blueprint: 'avatarchatbot',
        endpoints: ['/api/v1/interact', '/api/v1/state', '/api/v1/manage'],
        capabilities: [
          'Interaction management',
          'State tracking',
          'Context maintenance',
          'Flow control',
        ],
        documentation: `# Interaction Manager

## Overview
The Interaction Manager manages user interactions and conversation state.

## Capabilities
- **Interaction Management**: Manages user interaction flow
- **State Tracking**: Tracks conversation and interaction state
- **Context Maintenance**: Maintains conversation context
- **Flow Control**: Controls interaction flow and direction`,
      },
      'multi-modal-service': {
        id: 'multi-modal-service',
        name: 'Multi-Modal Service',
        description: 'Handles voice, text, and gesture interactions',
        logo: getFunctionalLogoByName('Multi-Modal Service'),
        tags: ['Multi-Modal', 'Input Processing'],
        blueprint: 'avatarchatbot',
        endpoints: [
          '/api/v1/multimodal',
          '/api/v1/process',
          '/api/v1/recognize',
        ],
        capabilities: [
          'Voice processing',
          'Text processing',
          'Gesture recognition',
          'Multi-modal fusion',
        ],
        documentation: `# Multi-Modal Service

## Overview
The Multi-Modal Service handles voice, text, and gesture interactions.

## Capabilities
- **Voice Processing**: Processes voice input and commands
- **Text Processing**: Handles text-based interactions
- **Gesture Recognition**: Recognizes and processes gestures
- **Multi-modal Fusion**: Combines multiple input modalities`,
      },
      // Default services
      'business-logic-service': {
        id: 'business-logic-service',
        name: 'Business Logic Service',
        description: 'Implements core business logic and workflows',
        logo: getFunctionalLogoByName('Business Logic Service'),
        tags: ['Business Logic', 'Workflows'],
        blueprint: 'default',
        endpoints: ['/api/v1/logic', '/api/v1/workflow', '/api/v1/process'],
        capabilities: [
          'Business logic implementation',
          'Workflow management',
          'Process automation',
          'Rule enforcement',
        ],
        documentation: `# Business Logic Service

## Overview
The Business Logic Service implements core business logic and workflows.

## Capabilities
- **Business Logic Implementation**: Implements core business rules
- **Workflow Management**: Manages business workflows
- **Process Automation**: Automates business processes
- **Rule Enforcement**: Enforces business rules and policies`,
      },
      'data-service': {
        id: 'data-service',
        name: 'Data Service',
        description: 'Manages data storage, retrieval, and processing',
        logo: getFunctionalLogoByName('Data Service'),
        tags: ['Data Management', 'Storage'],
        blueprint: 'default',
        endpoints: ['/api/v1/data', '/api/v1/storage', '/api/v1/process'],
        capabilities: [
          'Data storage',
          'Data retrieval',
          'Data processing',
          'Data management',
        ],
        documentation: `# Data Service

## Overview
The Data Service manages data storage, retrieval, and processing.

## Capabilities
- **Data Storage**: Manages data storage and persistence
- **Data Retrieval**: Handles data retrieval and querying
- **Data Processing**: Processes and transforms data
- **Data Management**: Manages data lifecycle and organization`,
      },
      'integration-service': {
        id: 'integration-service',
        name: 'Integration Service',
        description: 'Handles integration with external systems and APIs',
        logo: getFunctionalLogoByName('Integration Service'),
        tags: ['Integration', 'APIs'],
        blueprint: 'default',
        endpoints: ['/api/v1/integrate', '/api/v1/connect', '/api/v1/sync'],
        capabilities: [
          'External integration',
          'API management',
          'Data synchronization',
          'System connectivity',
        ],
        documentation: `# Integration Service

## Overview
The Integration Service handles integration with external systems and APIs.

## Capabilities
- **External Integration**: Integrates with external systems
- **API Management**: Manages API connections and calls
- **Data Synchronization**: Synchronizes data between systems
- **System Connectivity**: Maintains system connectivity`,
      },
    };

    return serviceMap[serviceIdDecoded] || null;
  };

  const service = getFunctionalService();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (service) {
      setCodeContent(
        getDefaultCode(
          selectedLanguage,
          service.name,
          { temperature: 0.7, max_tokens: 2048, top_p: 0.9 },
          ''
        )
      );
    }
  }, [service, selectedLanguage, endpointConfig.endpoint]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const assistantMessage: Message = {
        role: 'assistant',
        content: `I'm the ${service?.name}. I can help you with ${service?.capabilities.join(', ')}. What would you like to know about my capabilities?`,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch {
      setError('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(codeContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const handleUpdateEndpoint = () => {
    setCodeContent(
      getDefaultCode(
        selectedLanguage,
        service?.name || '',
        { temperature: 0.7, max_tokens: 2048, top_p: 0.9 },
        ''
      )
    );
    setShowSettings(false);
  };

  const renderSettings = () => (
    <Dialog
      open={showSettings}
      onClose={() => setShowSettings(false)}
      className='relative z-50'
    >
      <div className='fixed inset-0 bg-black/30' aria-hidden='true' />
      <div className='fixed inset-0 flex items-center justify-center p-4'>
        <Dialog.Panel className='mx-auto max-w-md rounded-lg bg-neutral-800 border border-neutral-700 p-6'>
          <Dialog.Title className='text-lg font-medium text-white mb-4'>
            Service Configuration
          </Dialog.Title>
          <div className='space-y-4'>
            <div>
              <label className='block text-sm text-gray-300 mb-1'>
                Endpoint URL
              </label>
              <input
                type='text'
                value={endpointConfig.endpoint}
                onChange={e =>
                  setEndpointConfig(prev => ({
                    ...prev,
                    endpoint: e.target.value,
                  }))
                }
                className='w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white text-sm'
                placeholder='http://localhost:8080'
              />
            </div>
            <div>
              <label className='block text-sm text-gray-300 mb-1'>
                API Key (Optional)
              </label>
              <input
                type='password'
                value={endpointConfig.apiKey}
                onChange={e =>
                  setEndpointConfig(prev => ({
                    ...prev,
                    apiKey: e.target.value,
                  }))
                }
                className='w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white text-sm'
                placeholder='Enter API key'
              />
            </div>
            <div className='flex justify-end space-x-3 pt-4'>
              <button
                onClick={() => setShowSettings(false)}
                className='px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors'
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateEndpoint}
                className='px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors'
              >
                Update
              </button>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );

  if (!service) {
    return (
      <div className='min-h-screen bg-neutral-900 text-white flex flex-col items-center justify-center'>
        <div className='text-2xl font-bold mb-4'>Service not found</div>
        <Link to='/blueprints' className='text-blue-400 underline'>
          Back to Blueprints
        </Link>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-neutral-900 text-white flex flex-col'>
      {/* Banner */}
      <div className='relative w-full h-56 md:h-72 lg:h-80 overflow-hidden'>
        <img
          src={bannerWave}
          alt='Banner'
          className='w-full h-full object-cover'
        />
        <nav className='absolute top-0 left-0 w-full flex flex-wrap justify-center gap-4 md:gap-8 pt-4 z-10 px-4'>
          <Link
            to='/models'
            className='text-lg md:text-xl font-bold transition relative px-2 opacity-80 hover:opacity-100'
          >
            Models
          </Link>
          <Link
            to='/blueprints'
            className='text-lg md:text-xl font-bold transition relative px-2 opacity-80 hover:opacity-100'
          >
            Blueprints
          </Link>
          <Link
            to='/gpu-cloud'
            className='text-lg md:text-xl font-bold transition relative px-2 opacity-80 hover:opacity-100'
          >
            GPU Clouds
          </Link>
        </nav>

        {/* Left-aligned glassy service logo/name overlay */}
        <div className='absolute left-8 top-1/2 -translate-y-1/2 z-10 bg-white/10 backdrop-blur-md border border-white/30 rounded-2xl shadow-lg p-6 flex flex-col items-center w-64'>
          <img
            src={service.logo}
            alt={service.name}
            className='w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 object-cover rounded-xl mb-4 border border-neutral-800'
          />
          <div className='text-base font-bold text-white mt-2 text-center drop-shadow-lg'>
            Functional Service
          </div>
          <div className='text-2xl font-extrabold mb-2 text-center text-white drop-shadow-lg'>
            {service.name}
          </div>
        </div>

        {/* Filter tags positioned to the right of the logo */}
        <div className='absolute left-80 bottom-8 z-10 flex flex-wrap gap-2 max-w-md'>
          {service.tags.map((tag, index) => (
            <span
              key={index}
              className={`px-3 py-2 rounded-lg text-sm font-medium shadow-lg ${
                index === 0
                  ? 'bg-blue-900/70 text-blue-200 border border-blue-700/50'
                  : index === 1
                    ? 'bg-green-900/70 text-green-200 border border-green-700/50'
                    : 'bg-purple-900/70 text-purple-200 border border-purple-700/50'
              }`}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className='max-w-7xl mx-auto px-4 py-8 flex-1 w-full flex flex-col'>
        {/* Tabs */}
        <div className='flex border-b border-neutral-700 mb-6'>
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-2 -mb-px text-lg font-medium border-b-2 transition-colors duration-150 focus:outline-none
              ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-500 bg-transparent'
                  : 'border-transparent text-gray-400 hover:text-blue-400'
              }
            `}
            style={{ background: 'none', borderRadius: 0 }}
          >
            <CircleStackIcon className='w-5 h-5 inline mr-2' />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('interact')}
            className={`px-6 py-2 -mb-px text-lg font-medium border-b-2 transition-colors duration-150 focus:outline-none
              ${
                activeTab === 'interact'
                  ? 'border-blue-500 text-blue-500 bg-transparent'
                  : 'border-transparent text-gray-400 hover:text-blue-400'
              }
            `}
            style={{ background: 'none', borderRadius: 0 }}
          >
            <ChatBubbleLeftRightIcon className='w-5 h-5 inline mr-2' />
            Interact
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`px-6 py-2 -mb-px text-lg font-medium border-b-2 transition-colors duration-150 focus:outline-none
              ${
                activeTab === 'code'
                  ? 'border-blue-500 text-blue-500 bg-transparent'
                  : 'border-transparent text-gray-400 hover:text-blue-400'
              }
            `}
            style={{ background: 'none', borderRadius: 0 }}
          >
            <CodeBracketIcon className='w-5 h-5 inline mr-2' />
            Code
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className='space-y-8'>
            {/* Service Description */}
            <div className='bg-neutral-800 rounded-lg p-6 border border-neutral-700'>
              <h2 className='text-2xl font-bold text-white mb-4'>
                Service Overview
              </h2>
              <p className='text-gray-300 text-lg leading-relaxed'>
                {service.description}
              </p>
            </div>

            {/* Capabilities */}
            <div className='bg-neutral-800 rounded-lg p-6 border border-neutral-700'>
              <h3 className='text-xl font-semibold text-white mb-4'>
                Capabilities
              </h3>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {service.capabilities.map((capability, index) => (
                  <div
                    key={index}
                    className='flex items-center space-x-3 p-3 bg-neutral-700 rounded-lg'
                  >
                    <div className='w-2 h-2 bg-blue-500 rounded-full'></div>
                    <span className='text-gray-300'>{capability}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* API Endpoints */}
            <div className='bg-neutral-800 rounded-lg p-6 border border-neutral-700'>
              <h3 className='text-xl font-semibold text-white mb-4'>
                API Endpoints
              </h3>
              <div className='space-y-3'>
                {service.endpoints.map((endpoint, index) => (
                  <div
                    key={index}
                    className='flex items-center space-x-3 p-3 bg-neutral-700 rounded-lg'
                  >
                    <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                    <code className='text-green-400 font-mono'>{endpoint}</code>
                  </div>
                ))}
              </div>
            </div>

            {/* Documentation */}
            <div className='bg-neutral-800 rounded-lg p-6 border border-neutral-700'>
              <h3 className='text-xl font-semibold text-white mb-4'>
                Documentation
              </h3>
              <div className='prose prose-invert max-w-none text-gray-300'>
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                >
                  {service.documentation}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'interact' && (
          <div className='flex flex-row gap-8 h-[700px]'>
            {/* Chat Interface (left) */}
            <div className='w-full md:w-[60%] flex-1 h-full min-h-0 bg-neutral-900 rounded-lg p-6 border border-neutral-800 shadow flex flex-col'>
              <div className='flex items-center justify-between mb-4'>
                <h3 className='text-lg font-semibold flex items-center text-white'>
                  <ChatBubbleLeftRightIcon className='w-5 h-5 mr-2' />
                  Service Interaction
                </h3>
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className='text-gray-400 hover:text-white'
                >
                  <Cog6ToothIcon className='h-6 w-6' />
                </button>
              </div>

              {showSettings && renderSettings()}

              <div className='flex flex-col space-y-4 flex-1 min-h-0'>
                {/* Chat messages */}
                <div className='flex-1 min-h-0 overflow-y-auto'>
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
                        <div className='prose prose-invert max-w-none text-sm'>
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeRaw]}
                          >
                            {message.content}
                          </ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  ))}

                  {isLoading && (
                    <div className='flex justify-start mb-4'>
                      <div className='max-w-[80%] rounded-lg p-4 bg-neutral-800 text-white border border-neutral-700'>
                        <div className='flex items-center space-x-2'>
                          <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500'></div>
                          <span className='text-sm'>Processing request...</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Input area */}
                <div className='mt-auto'>
                  <div className='flex items-end space-x-2'>
                    <textarea
                      value={inputMessage}
                      onChange={e => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder='Ask me about my capabilities...'
                      className='flex-1 bg-neutral-800 text-white rounded-lg p-3 min-h-[60px] max-h-[200px] resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 border border-neutral-700'
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
                      <PaperAirplaneIcon className='h-6 w-6' />
                    </button>
                  </div>
                  {error && (
                    <div className='mt-2 text-red-400 text-sm'>{error}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Service Status (right) */}
            <div className='w-full md:w-[40%] h-full min-h-0 flex flex-col space-y-4'>
              {/* Service Information */}
              <div className='bg-neutral-900 rounded-lg p-4 border border-neutral-800 shadow'>
                <h3 className='text-lg font-semibold text-white mb-4'>
                  Service Information
                </h3>
                <div className='space-y-3'>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm text-gray-300'>Status</span>
                    <div className='flex items-center space-x-2'>
                      <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                      <span className='text-sm text-green-400'>Online</span>
                    </div>
                  </div>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm text-gray-300'>Blueprint</span>
                    <span className='text-sm text-white'>
                      {service.blueprint}
                    </span>
                  </div>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm text-gray-300'>Endpoints</span>
                    <span className='text-sm text-white'>
                      {service.endpoints.length}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Examples */}
              <div className='bg-neutral-900 rounded-lg p-4 border border-neutral-800 shadow'>
                <h3 className='text-lg font-semibold text-white mb-4'>
                  Quick Examples
                </h3>
                <div className='space-y-2'>
                  {[
                    'What are your main capabilities?',
                    'How do I integrate with your API?',
                    'What endpoints do you provide?',
                    'Can you explain your architecture?',
                    'What are your performance characteristics?',
                  ].map((example, index) => (
                    <button
                      key={index}
                      onClick={() => setInputMessage(example)}
                      className='w-full text-left text-sm text-gray-300 hover:text-white p-2 rounded bg-neutral-800 hover:bg-neutral-700 transition-colors'
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'code' && (
          <div className='flex flex-col lg:flex-row gap-8 h-[700px]'>
            {/* Code Generation Interface */}
            <div className='flex-1 h-full min-h-0 flex flex-col space-y-6'>
              <div className='bg-neutral-900 rounded-lg p-6 border border-neutral-800 shadow flex flex-col flex-1 h-full space-y-6'>
                {/* Language Selection and Settings */}
                <div className='flex items-center justify-between'>
                  <div className='flex items-center space-x-4'>
                    <span className='text-sm text-gray-400'>Language:</span>
                    <select
                      value={selectedLanguage}
                      onChange={e =>
                        setSelectedLanguage(
                          e.target.value as
                            | 'python'
                            | 'typescript'
                            | 'rust'
                            | 'go'
                            | 'shell'
                        )
                      }
                      className='px-4 py-2 bg-neutral-800 text-white border border-neutral-700 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                    >
                      <option value='python'>Python</option>
                      <option value='typescript'>TypeScript</option>
                      <option value='rust'>Rust</option>
                      <option value='go'>Go</option>
                      <option value='shell'>Shell</option>
                    </select>
                    <button
                      onClick={() => setShowSettings(true)}
                      className='p-2 text-gray-400 hover:text-white transition-colors'
                      title='Settings'
                    >
                      <Cog6ToothIcon className='w-5 h-5' />
                    </button>
                  </div>
                  <button
                    onClick={handleCopyCode}
                    className='flex items-center space-x-2 px-4 py-2 bg-neutral-700 text-white rounded-md hover:bg-neutral-600 transition-colors'
                  >
                    {copied ? (
                      <>
                        <CheckIcon className='w-4 h-4' />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <ClipboardIcon className='w-4 h-4' />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Code Display */}
                <div className='flex-1 min-h-0 bg-neutral-800 rounded-lg border border-neutral-700 overflow-auto'>
                  <Highlight
                    theme={themes.nightOwl}
                    code={
                      codeContent || '// Generated code will appear here...'
                    }
                    language={selectedLanguage}
                  >
                    {({ style, tokens, getLineProps, getTokenProps }) => (
                      <pre
                        className='p-4 m-0 min-h-full font-mono text-sm'
                        style={style}
                      >
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

            {/* Right Panel - Service Info */}
            <div className='w-full lg:w-80 h-full min-h-0 flex flex-col space-y-4'>
              {/* Service Capabilities */}
              <div className='bg-neutral-900 rounded-lg p-4 border border-neutral-800 shadow'>
                <h3 className='text-lg font-semibold text-white mb-4'>
                  Service Capabilities
                </h3>
                <div className='space-y-2'>
                  {service.capabilities.map((capability, index) => (
                    <div
                      key={index}
                      className='text-sm text-gray-300 p-2 bg-neutral-800 rounded'
                    >
                      {capability}
                    </div>
                  ))}
                </div>
              </div>

              {/* API Endpoints */}
              <div className='bg-neutral-900 rounded-lg p-4 border border-neutral-800 shadow'>
                <h3 className='text-lg font-semibold text-white mb-4'>
                  API Endpoints
                </h3>
                <div className='space-y-2'>
                  {service.endpoints.map((endpoint, index) => (
                    <div
                      key={index}
                      className='text-sm text-green-400 font-mono p-2 bg-neutral-800 rounded'
                    >
                      {endpoint}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {renderSettings()}
    </div>
  );
};

export default FunctionalServiceDetail;
