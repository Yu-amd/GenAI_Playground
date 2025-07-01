import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import bannerWave from '../assets/banner_wave.png';
import PlaygroundLogo from '../components/PlaygroundLogo';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { PaperAirplaneIcon, CodeBracketIcon, Cog6ToothIcon, ClipboardIcon, CheckIcon, XMarkIcon, WrenchScrewdriverIcon, QuestionMarkCircleIcon, RocketLaunchIcon } from '@heroicons/react/24/outline';
import { lmStudioService } from '../services/lmStudioService';
import { toolService } from '../services/toolService';
import { Highlight, themes } from 'prism-react-renderer';
import { getDefaultCode } from '../utils/apiCodeGenerator';
import { Dialog } from '@headlessui/react';
import { loadModelData, modelImageMap } from '../utils/modelLoader';
import type { ModelData } from '../utils/modelLoader';
import ToolSelector from '../components/ToolSelector';
import ToolDocumentation from '../components/ToolDocumentation';
import ToolTestPanel from '../components/ToolTestPanel';
import DeploymentGuide from '../components/DeploymentGuide';
import './fonts.css';

// Define a type for model card content
export type ModelCardContent = {
  overview: string;
  intended_use: readonly string[] | string[];
  limitations: readonly string[] | string[];
  training_data: string;
  evaluation: readonly string[] | string[];
  known_issues: readonly string[] | string[];
  references: readonly string[] | string[];
  [key: string]: string | readonly string[] | string[];
};

// Helper component for viewing model card content
const ModelCardViewContent: React.FC<{ modelCard: ModelCardContent }> = ({ modelCard }) => {
  if (!modelCard) {
    return <div className="text-center py-12 text-gray-400">No model card information available.</div>;
  }

  const renderSection = (sectionKey: string, sectionData: string | readonly string[] | string[]) => {
    if (typeof sectionData === 'undefined') return null;
    const sectionName = sectionKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    
    if (Array.isArray(sectionData) && sectionData.length > 0) {
      return (
        <section key={sectionKey} className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-white">{sectionName}</h2>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <ul className="list-disc pl-6 space-y-2 text-gray-200">
              {sectionData.map((item: string, idx: number) => (
                <li key={idx}>
                  {item.startsWith('http') ? (
                    <a href={item} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline hover:text-blue-300 transition-colors">{item}</a>
                  ) : (
                    item
                  )}
                </li>
              ))}
            </ul>
          </div>
        </section>
      );
    } else if (typeof sectionData === 'string' && sectionData.trim()) {
      return (
        <section key={sectionKey} className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-white">{sectionName}</h2>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <div className="prose prose-invert max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                {sectionData}
              </ReactMarkdown>
            </div>
          </div>
        </section>
      );
    }
    return null;
  };

  return (
    <>
      {/* Render all sections in the order they appear in the data */}
      {Object.keys(modelCard).map(sectionKey => renderSection(sectionKey, modelCard[sectionKey]))}
    </>
  );
};

// Helper component for editing model card content
const ModelCardEditingContent: React.FC<{ 
  content: ModelCardContent; 
  onSave: (content: ModelCardContent) => void; 
  onCancel: () => void; 
}> = ({ content, onSave, onCancel }) => {
  const [editingContent, setEditingContent] = useState<ModelCardContent>(() => {
    // Initialize with all existing content, including custom sections
    const initialContent: ModelCardContent = {
      overview: content?.overview || '',
      intended_use: [...(content?.intended_use || [])],
      limitations: [...(content?.limitations || [])],
      training_data: content?.training_data || '',
      evaluation: [...(content?.evaluation || [])],
      known_issues: [...(content?.known_issues || [])],
      references: [...(content?.references || [])]
    };
    
    // Add any custom sections that exist in the content
    if (content) {
      const standardSections = ['overview', 'intended_use', 'limitations', 'training_data', 'evaluation', 'known_issues', 'references'];
      Object.keys(content).forEach(key => {
        if (!standardSections.includes(key) && content[key] !== undefined) {
          if (Array.isArray(content[key])) {
            initialContent[key] = [...content[key]];
          } else {
            initialContent[key] = content[key];
          }
        }
      });
    }
    
    return initialContent;
  });
  const [showAddSection, setShowAddSection] = useState(false);
  const [newSectionName, setNewSectionName] = useState<string>('');
  const [newSectionType, setNewSectionType] = useState<'text' | 'list'>('text');

  const addListItem = (field: string) => {
    setEditingContent({
      ...editingContent,
      [field]: [...editingContent[field], '']
    });
  };

  const updateListItem = (field: string, index: number, value: string) => {
    const newArray = [...editingContent[field]];
    newArray[index] = value;
    setEditingContent({
      ...editingContent,
      [field]: newArray
    });
  };

  const removeListItem = (field: string, index: number) => {
    const newArray = [...editingContent[field]];
    newArray.splice(index, 1);
    setEditingContent({
      ...editingContent,
      [field]: newArray
    });
  };

  const removeSection = (sectionKey: string) => {
    const newContent = { ...editingContent };
    delete newContent[sectionKey];
    setEditingContent(newContent);
  };

  const moveSectionUp = (sectionKey: string) => {
    const sectionKeys = Object.keys(editingContent);
    const currentIndex = sectionKeys.indexOf(sectionKey);
    if (currentIndex > 0) {
      const newContent: ModelCardContent = {} as ModelCardContent;
      sectionKeys.forEach((key, index) => {
        if (index === currentIndex - 1) {
          newContent[sectionKey] = editingContent[sectionKey];
        } else if (index === currentIndex) {
          newContent[sectionKeys[currentIndex - 1]] = editingContent[sectionKeys[currentIndex - 1]];
        } else {
          newContent[key] = editingContent[key];
        }
      });
      setEditingContent(newContent);
    }
  };

  const moveSectionDown = (sectionKey: string) => {
    const sectionKeys = Object.keys(editingContent);
    const currentIndex = sectionKeys.indexOf(sectionKey);
    if (currentIndex < sectionKeys.length - 1) {
      const newContent: ModelCardContent = {} as ModelCardContent;
      sectionKeys.forEach((key, index) => {
        if (index === currentIndex) {
          newContent[sectionKeys[currentIndex + 1]] = editingContent[sectionKeys[currentIndex + 1]];
        } else if (index === currentIndex + 1) {
          newContent[sectionKey] = editingContent[sectionKey];
        } else {
          newContent[key] = editingContent[key];
        }
      });
      setEditingContent(newContent);
    }
  };

  const addNewSection = () => {
    if (!newSectionName.trim()) return;
    
    const sectionKey = newSectionName.toLowerCase().replace(/\s+/g, '_');
    
    if (newSectionType === 'text') {
      setEditingContent({
        ...editingContent,
        [sectionKey]: ''
      });
    } else {
      setEditingContent({
        ...editingContent,
        [sectionKey]: []
      });
    }
    setShowAddSection(false);
    setNewSectionName('');
    setNewSectionType('text');
  };

  const handleSave = () => {
    onSave(editingContent);
    onCancel();
  };

  const getSectionColor = (sectionType: string) => {
    switch (sectionType) {
      case 'intended_use': return 'green';
      case 'limitations': return 'orange';
      case 'evaluation': return 'blue';
      case 'known_issues': return 'red';
      case 'references': return 'purple';
      default: return 'gray';
    }
  };

  const renderSection = (sectionKey: string, sectionData: string | readonly string[] | string[]) => {
    if (typeof sectionData === 'undefined') return null;
    const sectionName = sectionKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    const sectionKeys = Object.keys(editingContent);
    const currentIndex = sectionKeys.indexOf(sectionKey);
    const canMoveUp = currentIndex > 0;
    const canMoveDown = currentIndex < sectionKeys.length - 1;
    
    if (Array.isArray(sectionData)) {
      return (
        <div key={sectionKey} className="bg-gray-800/30 rounded-xl p-6 border border-gray-600/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-white">{sectionName}</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => addListItem(sectionKey)}
                className={`flex items-center gap-2 px-3 py-1.5 bg-${getSectionColor(sectionKey)}-600/20 text-${getSectionColor(sectionKey)}-400 rounded-lg border border-${getSectionColor(sectionKey)}-500/30 hover:bg-${getSectionColor(sectionKey)}-600/30 transition-all text-sm`}
              >
                <span>+</span>
                Add Item
              </button>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => moveSectionUp(sectionKey)}
                  disabled={!canMoveUp}
                  className="flex items-center gap-1 px-2 py-1.5 bg-gray-600/20 text-gray-400 rounded-lg border border-gray-500/30 hover:bg-gray-600/30 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Move section up"
                >
                  ↑
                </button>
                <button
                  onClick={() => moveSectionDown(sectionKey)}
                  disabled={!canMoveDown}
                  className="flex items-center gap-1 px-2 py-1.5 bg-gray-600/20 text-gray-400 rounded-lg border border-gray-500/30 hover:bg-gray-600/30 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Move section down"
                >
                  ↓
                </button>
              </div>
              <button
                onClick={() => removeSection(sectionKey)}
                className="flex items-center gap-2 px-3 py-1.5 bg-red-600/20 text-red-400 rounded-lg border border-red-500/30 hover:bg-red-600/30 transition-all text-sm"
                title={`Remove ${sectionName} section`}
              >
                <span>×</span>
                Remove
              </button>
            </div>
          </div>
          <div className="space-y-3">
            {sectionData.map((item: string, index: number) => (
              <div key={index} className="flex items-center gap-3">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => updateListItem(sectionKey, index, e.target.value)}
                  className="flex-1 bg-gray-900/50 border border-gray-600/30 rounded-lg p-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  placeholder={`Enter ${sectionName.toLowerCase()} item...`}
                />
                <button
                  onClick={() => removeListItem(sectionKey, index)}
                  className="p-2 text-red-400 hover:text-red-300 hover:bg-red-600/20 rounded-lg transition-all"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      );
    } else if (typeof sectionData === 'string') {
      return (
        <div key={sectionKey} className="bg-gray-800/30 rounded-xl p-6 border border-gray-600/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-white">{sectionName}</h3>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => moveSectionUp(sectionKey)}
                  disabled={!canMoveUp}
                  className="flex items-center gap-1 px-2 py-1.5 bg-gray-600/20 text-gray-400 rounded-lg border border-gray-500/30 hover:bg-gray-600/30 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Move section up"
                >
                  ↑
                </button>
                <button
                  onClick={() => moveSectionDown(sectionKey)}
                  disabled={!canMoveDown}
                  className="flex items-center gap-1 px-2 py-1.5 bg-gray-600/20 text-gray-400 rounded-lg border border-gray-500/30 hover:bg-gray-600/30 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Move section down"
                >
                  ↓
                </button>
              </div>
              <button
                onClick={() => removeSection(sectionKey)}
                className="flex items-center gap-2 px-3 py-1.5 bg-red-600/20 text-red-400 rounded-lg border border-red-500/30 hover:bg-red-600/30 transition-all text-sm"
                title={`Remove ${sectionName} section`}
              >
                <span>×</span>
                Remove
              </button>
            </div>
          </div>
          <textarea
            value={sectionData}
            onChange={(e) => setEditingContent({ ...editingContent, [sectionKey]: e.target.value })}
            className="w-full h-32 bg-gray-900/50 border border-gray-600/30 rounded-lg p-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
            placeholder={`Enter ${sectionName.toLowerCase()}...`}
          />
        </div>
      );
    }
    return null;
  };

  // Get all sections including custom ones
  const allSections = Object.keys(editingContent).filter(key => editingContent[key] !== undefined);

  return (
    <div className="space-y-6">
      {/* Add Section Button */}
      <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-600/30">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white">Add New Section</h3>
          <button
            onClick={() => setShowAddSection(!showAddSection)}
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-600/20 text-blue-400 rounded-lg border border-blue-500/30 hover:bg-blue-600/30 transition-all text-sm"
          >
            <span>+</span>
            Add Section
          </button>
        </div>
        {showAddSection && (
          <div className="space-y-4 p-4 bg-gray-900/50 rounded-lg border border-gray-600/30">
            <div>
              <label className="block text-gray-200 font-medium mb-2">Section Name</label>
              <input
                type="text"
                value={newSectionName}
                onChange={(e) => setNewSectionName(e.target.value)}
                className="w-full bg-gray-800/50 border border-gray-600/30 rounded-lg p-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                placeholder="Enter section name (e.g., 'Technical Details', 'Usage Examples')"
              />
            </div>
            <div>
              <label className="block text-gray-200 font-medium mb-2">Section Type</label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-gray-200">
                  <input
                    type="radio"
                    value="text"
                    checked={newSectionType === 'text'}
                    onChange={(e) => setNewSectionType(e.target.value as 'text' | 'list')}
                    className="text-blue-500 focus:ring-blue-500"
                  />
                  <span>Text Field</span>
                </label>
                <label className="flex items-center gap-2 text-gray-200">
                  <input
                    type="radio"
                    value="list"
                    checked={newSectionType === 'list'}
                    onChange={(e) => setNewSectionType(e.target.value as 'text' | 'list')}
                    className="text-blue-500 focus:ring-blue-500"
                  />
                  <span>List</span>
                </label>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={addNewSection}
                disabled={!newSectionName.trim()}
                className="px-4 py-2 bg-green-600/20 text-green-400 rounded-lg border border-green-500/30 hover:bg-green-600/30 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Section
              </button>
              <button
                onClick={() => setShowAddSection(false)}
                className="px-4 py-2 bg-gray-700/50 text-gray-300 rounded-lg border border-gray-600/30 hover:bg-gray-600/50 transition-all font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Render sections */}
      {allSections.map((sectionKey) => renderSection(sectionKey, editingContent[sectionKey]))}

      {/* Save/Cancel Buttons */}
      <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-600/30">
        <button
          onClick={onCancel}
          className="px-6 py-2 bg-gray-700/50 text-gray-300 rounded-lg border border-gray-600/30 hover:bg-gray-600/50 transition-all font-medium"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-blue-600/20 text-blue-400 rounded-lg border border-blue-500/30 hover:bg-blue-600/30 transition-all font-medium"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

interface Message {
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
  timestamp: Date;
  tool_calls?: Array<{
    id: string;
    type: 'function';
    function: {
      name: string;
      arguments: string;
    };
  }>;
}

interface Parameter {
  name: string;
  value: number;
  type: 'number';
  description: string;
  min?: number;
  max?: number;
  step?: number;
}

const ModelDetail: React.FC = () => {
  const { modelId = '', '*': splat = '' } = useParams();
  const fullModelId = splat ? `${modelId}/${splat}` : modelId;
  
  // Helper function to check if we're in development mode
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  const [model, setModel] = useState<ModelData | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'system', content: 'Hi, what can I do for you today?', timestamp: new Date() }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<'python' | 'typescript' | 'rust' | 'go' | 'shell'>('python');
  const [isToolCallingEnabled, setIsToolCallingEnabled] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showToolSelector, setShowToolSelector] = useState(false);
  const [showToolDocumentation, setShowToolDocumentation] = useState(false);
  const [showToolTestPanel, setShowToolTestPanel] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [copied, setCopied] = useState(false);
  const [codeContent, setCodeContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showParameters, setShowParameters] = useState(false);
  const [showModelCard, setShowModelCard] = useState(false);
  const [endpoint, setEndpoint] = useState('http://localhost:1234/v1');
  const [endpointSaved, setEndpointSaved] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [showDeploymentGuide, setShowDeploymentGuide] = useState(false);
  const [isModelCardEditing, setIsModelCardEditing] = useState(false);
  const [modelCardContent, setModelCardContent] = useState<ModelCardContent | null>(null);
  const [showCursor, setShowCursor] = useState(true);
  const [isTextareaFocused, setIsTextareaFocused] = useState(true);
  
  // Enhanced parameters with more comprehensive options
  const [parameters, setParameters] = useState<Parameter[]>([
    { name: 'temperature', value: 0.7, type: 'number', description: 'Controls randomness in the output (0.0 = deterministic, 2.0 = very random)', min: 0, max: 2, step: 0.1 },
    { name: 'top_p', value: 0.9, type: 'number', description: 'Controls diversity via nucleus sampling (0.0 = focused, 1.0 = diverse)', min: 0, max: 1, step: 0.1 },
    { name: 'frequency_penalty', value: 0.0, type: 'number', description: 'Reduces repetition of frequent tokens (-2.0 to 2.0)', min: -2, max: 2, step: 0.1 },
    { name: 'presence_penalty', value: 0.0, type: 'number', description: 'Encourages model to talk about new topics (-2.0 to 2.0)', min: -2, max: 2, step: 0.1 },
    { name: 'max_tokens', value: 2048, type: 'number', description: 'Maximum number of tokens to generate', min: 100, max: 8192, step: 100 }
  ]);

  const [tools] = useState([
    {
      type: "function" as const,
      function: {
        name: 'get_weather',
        description: 'Get the current weather for a location',
        parameters: {
          type: 'object',
          properties: {
            location: {
              type: 'string',
              description: 'The city and state, e.g. San Francisco, CA'
            },
            unit: {
              type: 'string',
              enum: ['celsius', 'fahrenheit'],
              description: 'The unit of temperature'
            }
          },
          required: ['location']
        }
      }
    },
    {
      type: "function" as const,
      function: {
        name: 'search_web',
        description: 'Search the web for real-time information',
        parameters: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'The search query'
            },
            num_results: {
              type: 'integer',
              description: 'Number of results to return (1-10)',
              minimum: 1,
              maximum: 10
            }
          },
          required: ['query']
        }
      }
    },
    {
      type: "function" as const,
      function: {
        name: 'calculate',
        description: 'Perform mathematical calculations',
        parameters: {
          type: 'object',
          properties: {
            expression: {
              type: 'string',
              description: 'The mathematical expression to evaluate'
            },
            precision: {
              type: 'integer',
              description: 'Number of decimal places in the result',
              minimum: 0,
              maximum: 10
            }
          },
          required: ['expression']
        }
      }
    },
    {
      type: "function" as const,
      function: {
        name: 'translate',
        description: 'Translate text between languages',
        parameters: {
          type: 'object',
          properties: {
            text: {
              type: 'string',
              description: 'The text to translate'
            },
            target_language: {
              type: 'string',
              description: 'The target language code (e.g., "es" for Spanish)'
            },
            source_language: {
              type: 'string',
              description: 'The source language code (optional, will auto-detect if not provided)'
            }
          },
          required: ['text', 'target_language']
        }
      }
    },
    {
      type: "function" as const,
      function: {
        name: 'get_stock_price',
        description: 'Get the current stock price for a ticker symbol or historical price for a specific date',
        parameters: {
          type: 'object',
          properties: {
            symbol: {
              type: 'string',
              description: 'The stock ticker symbol (e.g., AAPL for Apple)'
            },
            include_currency: {
              type: 'boolean',
              description: 'Whether to include the currency in the response'
            },
            date: {
              type: 'string',
              description: 'Optional date for historical price (e.g., "2025-06-20" or "June 20, 2025")'
            }
          },
          required: ['symbol']
        }
      }
    },
    {
      type: "function" as const,
      function: {
        name: 'get_time',
        description: 'Get the current time for a timezone',
        parameters: {
          type: 'object',
          properties: {
            timezone: {
              type: 'string',
              description: 'The timezone (e.g., "America/New_York", "UTC")'
            },
            format: {
              type: 'string',
              enum: ['12h', '24h'],
              description: 'The time format to use'
            }
          },
          required: ['timezone']
        }
      }
    }
  ]);

  const [enabledToolNames, setEnabledToolNames] = useState<string[]>([]);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);

  // Only initialize enabled tools once on mount
  const didInitEnabledTools = React.useRef(false);
  useEffect(() => {
    if (!didInitEnabledTools.current && tools.length > 0) {
      const allToolNames = tools.map(t => t.function.name);
      setEnabledToolNames(allToolNames);
      didInitEnabledTools.current = true;
    }
  }, [tools]);

  // Track if user has interacted
  const hasUserInteracted = useRef(false);

  // Auto-scrolling disabled to prevent unwanted scrolling behavior

  useEffect(() => {
    setCodeContent(getDefaultCode(
      selectedLanguage,
      model?.model_id || 'your-model-id',
      {
        temperature: parameters.find(p => p.name === 'temperature')?.value as number,
        max_tokens: parameters.find(p => p.name === 'max_tokens')?.value as number,
        top_p: parameters.find(p => p.name === 'top_p')?.value as number
      },
      inputMessage
    ));
  }, [messages, selectedLanguage, parameters, model?.model_id, inputMessage]);

  useEffect(() => {
    loadModelData(decodeURIComponent(fullModelId)).then(setModel);
  }, [fullModelId]);

  // Initialize modelCardContent when model loads
  useEffect(() => {
    if (model && model.model_card && !modelCardContent) {
      setModelCardContent(model.model_card);
    }
  }, [model, modelCardContent]);

  // Blinking cursor effect
  useEffect(() => {
    if (!inputMessage.trim() && isTextareaFocused) {
      const interval = setInterval(() => {
        setShowCursor(prev => !prev);
      }, 500);
      return () => clearInterval(interval);
    } else {
      setShowCursor(true);
    }
  }, [inputMessage, isTextareaFocused]);

  const handleParameterChange = (paramName: string, value: number) => {
    setParameters(prev => prev.map(param => 
      param.name === paramName ? { ...param, value } : param
    ));
  };

  const resetToDefaults = () => {
    setParameters(prev => prev.map(param => ({
      ...param,
      value: param.name === 'temperature' ? 0.7 :
             param.name === 'max_tokens' ? 2048 :
             param.name === 'top_p' ? 0.9 :
             param.name === 'frequency_penalty' ? 0.0 :
             param.name === 'presence_penalty' ? 0.0 :
             param.name === 'max_tokens' ? 2048 : param.value
    })));
  };

  const handleToolToggle = (toolName: string) => {
    setEnabledToolNames(prev => 
      prev.includes(toolName) 
        ? prev.filter(name => name !== toolName)
        : [...prev, toolName]
    );
  };

  const handleEnableAllTools = () => {
    const allToolNames = tools.map(t => t.function.name);
    setEnabledToolNames(allToolNames);
  };

  const handleDisableAllTools = () => {
    setEnabledToolNames([]);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    // Mark that user has interacted
    hasUserInteracted.current = true;

    const messageToSend = inputMessage;
    setInputMessage('');
    setIsLoading(true);
    setIsStreaming(true);
    setSendError(null);

    const newMessage: Message = {
      role: 'user',
      content: messageToSend,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);

    try {
      const enabledTools = tools.filter(t => enabledToolNames.includes(t.function.name));
      
      // Check if we should send tools
      const shouldSendTools = isToolCallingEnabled && enabledTools.length > 0;
      
      const requestBody = {
        messages: [
          { role: 'system' as const, content: 'You have access to various tools. When a user asks for information that requires real-time data, calculations, translations, or other external services, use the appropriate tools to help them. Always use tools when they would be helpful.' },
          ...messages.map(m => ({ role: m.role, content: m.content } as const)),
          { role: 'user' as const, content: messageToSend }
        ],
        temperature: parameters.find(p => p.name === 'temperature')?.value as number,
        max_tokens: parameters.find(p => p.name === 'max_tokens')?.value as number,
        top_p: parameters.find(p => p.name === 'top_p')?.value as number,
        ...(shouldSendTools && { tools: enabledTools })
      };
      
      const response = await lmStudioService.chatCompletion(
        requestBody,
        shouldSendTools ? undefined : (chunk) => {
          if (chunk.choices[0]?.delta?.content) {
            setStreamingContent(prev => prev + chunk.choices[0].delta.content);
          }
        }
      );

      if (!response.choices || response.choices.length === 0) {
        throw new Error('No response received from the model');
      }

      const assistantMessage: Message = {
        role: 'assistant',
        content: response.choices[0].message.content || '',
        timestamp: new Date(),
        tool_calls: response.choices[0].message.tool_calls
      };
      setMessages(prev => [...prev, assistantMessage]);
      
      // Auto-scrolling disabled to prevent unwanted scrolling behavior

      // Handle tool calls if present
      if (assistantMessage.tool_calls && assistantMessage.tool_calls.length > 0) {
        for (const toolCall of assistantMessage.tool_calls) {
          // Execute the actual tool
          const toolResult = await toolService.executeTool(toolCall);
          
          // Add tool result to messages
          const toolResponse: Message = {
            role: 'tool',
            content: toolResult.content,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, toolResponse]);
        }
      }
      
      // Note: Tool calling remains enabled for continued use
    } catch (err) {
      console.error('Error in tool calling:', err);
      setSendError('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
      setStreamingContent('');
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 0);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCopyCode = async () => {
    const code = getDefaultCode(
      selectedLanguage,
      model?.model_id || 'your-model-id',
      {
        temperature: parameters.find(p => p.name === 'temperature')?.value as number,
        max_tokens: parameters.find(p => p.name === 'max_tokens')?.value as number,
        top_p: parameters.find(p => p.name === 'top_p')?.value as number
      },
      inputMessage
    );
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTestMessage = (message: string) => {
    setInputMessage(message);
    // Trigger the send message after a brief delay to ensure state is updated
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  const handleModelCardSave = (content: ModelCardContent) => {
    // Update the model's model_card with the new content
    if (model) {
      setModel({
        ...model,
        model_card: content
      });
      setModelCardContent(content);
    }
    setIsModelCardEditing(false);
    console.log('Model card content saved:', content);
  };

  if (!model) {
    return (
      <div className="min-h-screen bg-black text-white font-sans" onClick={(e) => {
        // If clicking outside the textarea, blur it
        const target = e.target as HTMLElement;
        if (!target.closest('textarea') && !target.closest('button')) {
          textareaRef.current?.blur();
        }
      }}>
        <div className="relative w-full h-72 md:h-96 lg:h-[28rem] overflow-hidden font-sans flex items-center" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
          <img src={bannerWave} alt="Banner" className="w-full h-full object-cover absolute inset-0" />
          {/* Navigation overlay */}
          <nav className="absolute top-0 left-0 w-full flex justify-between items-center pt-8 px-8 z-20 bg-black/30 backdrop-blur-md shadow-lg rounded-b-xl pointer-events-auto">
            <PlaygroundLogo />
            <div className="flex gap-16">
              <Link to="/models" className="text-2xl font-bold text-white transition relative px-2 opacity-80 hover:opacity-100 after:content-[''] after:block after:h-1 after:rounded after:mt-1 after:w-0 after:bg-red-500 hover:after:w-full">Models</Link>
              <Link to="/blueprints" className="text-2xl font-bold text-white transition relative px-2 opacity-80 hover:opacity-100 after:content-[''] after:block after:h-1 after:rounded after:mt-1 after:w-0 after:bg-red-500 hover:after:w-full">Blueprints</Link>
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
                Loading model details...
              </div>
            </div>
          </div>
        </div>
        {/* Warning Banner */}
        <div className="w-full flex justify-center z-50 mb-6">
          <div className="flex items-start gap-3 bg-white/20 backdrop-blur-md border border-black text-white px-6 py-2 rounded-xl shadow-md w-[90%] text-sm drop-shadow font-normal">
            <svg className="w-6 h-6 flex-shrink-0 mt-0.5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01"/></svg>
            <span>
              AI models generate responses and outputs based on complex algorithms and machine learning techniques, and those responses or outputs may be inaccurate, harmful, biased or indecent. <b className="font-bold">By testing this model, you assume the risk of any harm caused by any response or output of the model.</b> Please do not upload any confidential information or personal data unless expressly permitted. <b className="font-bold">Your use is logged for security purposes.</b>
            </span>
          </div>
        </div>
        {/* Main Content with Loading State */}
        <div className="flex flex-col md:flex-row max-w-[1600px] mx-auto p-8 gap-8 -mt-8 relative z-10">
          <div className="flex-1">
            <div className="flex flex-row gap-8 items-stretch h-[700px]" style={{ position: 'relative' }}>
              {/* Chatbox (left) - Always rendered */}
              <div className="w-full md:w-[40%] flex-1 h-full min-h-0 bg-black rounded-3xl p-4 shadow-lg mb-8 md:mb-0 flex flex-col font-sans" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    {isDevelopment && (
                      <button
                        onClick={() => { console.log('Settings clicked'); setShowSettings(!showSettings); }}
                        className="text-gray-400 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-all"
                        title="Settings"
                      >
                        <Cog6ToothIcon className="h-5 w-5" />
                      </button>
                    )}
                    <button
                      onClick={() => setShowParameters(true)}
                      className="flex items-center px-3 py-1.5 bg-blue-600/10 text-blue-400 rounded-full border border-blue-500/10 hover:bg-blue-600/20 transition-all text-xs font-medium"
                      title="Model Parameters"
                    >
                      Parameters
                    </button>
                    <button
                      onClick={() => setShowToolSelector(true)}
                      className="flex items-center px-3 py-1.5 bg-red-600/10 text-red-400 rounded-full border border-red-500/10 hover:bg-red-600/20 transition-all text-xs font-medium"
                      title="Tool Selection"
                    >
                      <WrenchScrewdriverIcon className="h-4 w-4 mr-1" />
                      Tools ({enabledToolNames.length}/{tools.length})
                    </button>
                    <button
                      onClick={() => setShowToolDocumentation(true)}
                      className="text-gray-400 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-all"
                      title="Tool Documentation"
                    >
                      <QuestionMarkCircleIcon className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className={`flex items-center gap-2 text-xs transition-colors ${
                      isToolCallingEnabled ? 'text-green-300' : 'text-gray-300'
                    }`}>
                      <input
                        type="checkbox"
                        checked={isToolCallingEnabled}
                        onChange={(e) => setIsToolCallingEnabled(e.target.checked)}
                        className="rounded border-gray-600 bg-gray-800 text-blue-500 focus:ring-blue-500"
                      />
                      <span className={isToolCallingEnabled ? 'font-medium' : ''}>
                        {isToolCallingEnabled ? 'Tool Calling Active' : 'Enable Tool Calling'}
                      </span>
                    </label>
                  </div>
                </div>
                <div className="flex flex-col flex-1 min-h-0">
                  {/* Loading message */}
                  <div className="flex-1 min-h-0 overflow-y-auto flex items-center justify-center">
                    <div className="text-center text-gray-400">
                      <div className="text-lg mb-2">Loading model...</div>
                      <div className="text-sm">Please wait while we load the model details</div>
                    </div>
                  </div>
                  {/* Input area */}
                  <div className="mt-4">
                    <div className="flex items-end space-x-3 relative">
                      <div className="flex-1 relative">
                        <textarea
                          ref={textareaRef}
                          value={inputMessage}
                          onChange={(e) => setInputMessage(e.target.value)}
                          onKeyPress={handleKeyPress}
                          onFocus={() => setIsTextareaFocused(true)}
                          onBlur={() => setIsTextareaFocused(false)}
                          placeholder=""
                          role="textbox"
                          className="w-full bg-transparent text-white p-4 min-h-[80px] max-h-[300px] resize-none focus:outline-none focus:ring-0 border border-white/20 rounded-xl font-sans text-lg cursor-text"
                          disabled={isLoading}
                          autoFocus
                          tabIndex={0}
                          style={{ 
                            fontFamily: 'Inter, system-ui, sans-serif',
                            caretColor: inputMessage.trim() ? 'white' : 'transparent'
                          }}
                        />
                        {!inputMessage.trim() && isTextareaFocused && (
                          <div 
                            className="absolute left-4 top-4 pointer-events-none"
                            style={{ 
                              width: '2px', 
                              height: '1.5em', 
                              backgroundColor: showCursor ? 'white' : 'transparent',
                              transition: 'opacity 0.1s ease-in-out'
                            }}
                          />
                        )}
                      </div>
                      <button
                        aria-label="Send"
                        onClick={handleSendMessage}
                        disabled={isLoading || !inputMessage.trim()}
                        className={`p-3 rounded-full transition-all duration-300 ${
                          isLoading || !inputMessage.trim()
                            ? 'bg-gray-600/20 text-gray-400 cursor-not-allowed'
                            : 'bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 border border-blue-500/20 hover:border-blue-500/40 shadow-sm hover:shadow-md'
                        }`}
                      >
                        <PaperAirplaneIcon className="h-6 w-6" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {/* Integration Code (right) - Loading state */}
              <div className="w-full md:w-[60%] flex-1 h-full min-h-0 rounded-2xl border border-white/10 shadow-2xl flex flex-col api-integration-container">
                <div className="flex items-center space-x-3 mb-6 pt-6 px-6">
                  <CodeBracketIcon className="w-6 h-6 text-blue-400" />
                  <h3 className="text-xl font-bold text-white">API Integration</h3>
                </div>
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <div className="text-lg mb-2">Loading code examples...</div>
                    <div className="text-sm">Code generation will be available once the model loads</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans" onClick={(e) => {
      // If clicking outside the textarea, blur it
      const target = e.target as HTMLElement;
      if (!target.closest('textarea') && !target.closest('button')) {
        textareaRef.current?.blur();
      }
    }}>
      <div className="relative w-full h-72 md:h-96 lg:h-[28rem] overflow-hidden font-sans flex items-center" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
        <img src={bannerWave} alt="Banner" className="w-full h-full object-cover absolute inset-0" />
        {/* Navigation overlay */}
        <nav className="absolute top-0 left-0 w-full flex justify-between items-center pt-8 px-8 z-20 bg-black/30 backdrop-blur-md shadow-lg rounded-b-xl pointer-events-auto">
          <PlaygroundLogo />
          <div className="flex gap-16">
            <Link to="/models" className="text-2xl font-bold text-white transition relative px-2 opacity-80 hover:opacity-100 after:content-[''] after:block after:h-1 after:rounded after:mt-1 after:w-0 after:bg-red-500 hover:after:w-full">Models</Link>
            <Link to="/blueprints" className="text-2xl font-bold text-white transition relative px-2 opacity-80 hover:opacity-100 after:content-[''] after:block after:h-1 after:rounded after:mt-1 after:w-0 after:bg-red-500 hover:after:w-full">Blueprints</Link>
            <Link to="/gpu-cloud" className="text-2xl font-bold text-white transition relative px-2 opacity-80 hover:opacity-100 after:content-[''] after:block after:h-1 after:rounded after:mt-1 after:w-0 after:bg-red-500 hover:after:w-full">GPU Clouds</Link>
          </div>
        </nav>
        {/* Banner content: logo card left, name/desc right */}
        <div className="relative z-10 flex flex-row items-center justify-center w-full h-full px-8 gap-12 pt-20">
          {/* Logo Card */}
          <div className="flex flex-col items-center min-w-[220px]">
            <div className="relative w-full flex flex-col items-center">
              <img
                src={modelImageMap[model.model_id] || model.logo}
                alt={model.name}
                className="w-48 h-48 md:w-56 md:h-56 object-cover rounded-2xl border-4 border-white shadow-xl bg-white"
                style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)' }}
              />
              <button
                className="mt-6 px-7 py-2 rounded-full bg-white/10 backdrop-blur-md border border-blue-400/30 text-blue-300 font-medium shadow hover:bg-blue-600/20 hover:text-white transition-all text-base tracking-wide"
                onClick={() => setShowModelCard(true)}
              >
                Model Card
              </button>
            </div>
          </div>
          {/* Name, Description, and Tags */}
          <div className="flex-1 flex flex-col justify-center items-start max-w-2xl">
            <div className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg mb-4" style={{ letterSpacing: '.01em' }}>{model.name}</div>
            {model.description && (
              <div className="text-lg md:text-xl text-white/90 leading-relaxed font-medium drop-shadow max-w-2xl mb-4">
                {model.description}
              </div>
            )}
            {model.tags && model.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {model.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className={`px-3 py-1 rounded-full text-xs font-semibold shadow border border-white/20 uppercase tracking-wide whitespace-nowrap
                      ${idx === 0 ? 'bg-green-900/50 text-green-200' :
                        idx === 1 ? 'bg-purple-900/50 text-purple-200' :
                        'bg-orange-900/50 text-orange-200'}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Warning Banner (between banner and main content) */}
      <div className="w-full flex justify-center z-50 mb-6">
        <div className="flex items-start gap-3 bg-white/20 backdrop-blur-md border border-black text-white px-6 py-2 rounded-xl shadow-md w-[90%] text-sm drop-shadow font-normal">
          <svg className="w-6 h-6 flex-shrink-0 mt-0.5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01"/></svg>
          <span>
            AI models generate responses and outputs based on complex algorithms and machine learning techniques, and those responses or outputs may be inaccurate, harmful, biased or indecent. <b className="font-bold">By testing this model, you assume the risk of any harm caused by any response or output of the model.</b> Please do not upload any confidential information or personal data unless expressly permitted. <b className="font-bold">Your use is logged for security purposes.</b>
          </span>
        </div>
      </div>
      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #1e40af;
        }
        .slider::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #1e40af;
        }
        .slider::-webkit-slider-track {
          background: #374151;
          border-radius: 8px;
          height: 8px;
        }
        .slider::-moz-range-track {
          background: #374151;
          border-radius: 8px;
          height: 8px;
        }
        .api-integration-container {
          position: relative;
          width: 100%;
          min-height: 700px;
        }
        .code-display-container {
          position: relative;
          width: 100%;
          min-height: 550px;
        }
      `}</style>
      <div className="flex flex-col md:flex-row max-w-[1600px] mx-auto p-8 gap-8 -mt-8 relative z-10">
        {/* Main Content */}
        <div className="flex-1">
          {/* Tab Content */}
          <div className="flex flex-row gap-8 items-stretch h-[700px]" style={{ position: 'relative' }}>
            {/* Chatbox (left) */}
            <div className="w-full md:w-[40%] flex-1 h-full min-h-0 bg-black rounded-3xl p-4 shadow-lg mb-8 md:mb-0 flex flex-col font-sans" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  {isDevelopment && (
                    <button
                      onClick={() => { console.log('Settings clicked'); setShowSettings(!showSettings); }}
                      className="text-gray-400 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-all"
                      title="Settings"
                    >
                      <Cog6ToothIcon className="h-5 w-5" />
                    </button>
                  )}
                  <button
                    onClick={() => setShowParameters(true)}
                    className="flex items-center px-3 py-1.5 bg-blue-600/10 text-blue-400 rounded-full border border-blue-500/10 hover:bg-blue-600/20 transition-all text-xs font-medium"
                    title="Model Parameters"
                  >
                    Parameters
                  </button>
                  <button
                    onClick={() => setShowToolSelector(true)}
                    className="flex items-center px-3 py-1.5 bg-red-600/10 text-red-400 rounded-full border border-red-500/10 hover:bg-red-600/20 transition-all text-xs font-medium"
                    title="Tool Selection"
                  >
                    <WrenchScrewdriverIcon className="h-4 w-4 mr-1" />
                    Tools ({enabledToolNames.length}/{tools.length})
                  </button>
                  <button
                    onClick={() => setShowToolDocumentation(true)}
                    className="text-gray-400 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-all"
                    title="Tool Documentation"
                  >
                    <QuestionMarkCircleIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setShowDeploymentGuide(true)}
                    className="flex items-center px-3 py-1.5 bg-orange-600/10 text-orange-400 rounded-full border border-orange-500/10 hover:bg-orange-600/20 transition-all text-xs font-medium"
                    title="Deploy Model"
                  >
                    <RocketLaunchIcon className="h-4 w-4 mr-1" />
                    Deploy
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <label className={`flex items-center gap-2 text-xs transition-colors ${
                    isToolCallingEnabled ? 'text-green-300' : 'text-gray-300'
                  }`}>
                    <input
                      type="checkbox"
                      checked={isToolCallingEnabled}
                      onChange={(e) => setIsToolCallingEnabled(e.target.checked)}
                      className="rounded border-gray-600 bg-gray-800 text-blue-500 focus:ring-blue-500"
                    />
                    <span className={isToolCallingEnabled ? 'font-medium' : ''}>
                      {isToolCallingEnabled ? 'Tool Calling Active' : 'Enable Tool Calling'}
                    </span>
                  </label>
                </div>
              </div>
              <div className="flex flex-col flex-1 min-h-0">
                {/* Chat messages */}
                <div className="flex-1 min-h-0 overflow-y-auto">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} my-3`}
                    >
                      {message.role === 'user' ? (
                        <div
                          className="max-w-[80%] text-white text-base font-medium"
                          style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                        >
                          <div className="prose prose-invert max-w-none">
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm]}
                              rehypePlugins={[rehypeRaw]}
                            >
                              {message.content}
                            </ReactMarkdown>
                          </div>
                        </div>
                      ) : (
                        <div
                          className="max-w-[80%] text-neutral-300 text-base font-normal"
                          style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                        >
                          <div className="prose prose-invert max-w-none">
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm]}
                              rehypePlugins={[rehypeRaw]}
                            >
                              {message.content}
                            </ReactMarkdown>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  {isStreaming && streamingContent && (
                    <div className="flex justify-start my-3">
                      <div className="max-w-[80%] text-neutral-300 text-base font-normal" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                        <div className="prose prose-invert max-w-none">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeRaw]}
                          >
                            {streamingContent}
                          </ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                {/* Input area */}
                <div className="mt-4">
                  <div className="flex items-end space-x-3 relative">
                    <div className="flex-1 relative">
                      <textarea
                        ref={textareaRef}
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        onFocus={() => setIsTextareaFocused(true)}
                        onBlur={() => setIsTextareaFocused(false)}
                        placeholder=""
                        role="textbox"
                        className="w-full bg-transparent text-white p-4 min-h-[80px] max-h-[300px] resize-none focus:outline-none focus:ring-0 border border-white/20 rounded-xl font-sans text-lg cursor-text"
                        disabled={isLoading}
                        autoFocus
                        tabIndex={0}
                        style={{ 
                          fontFamily: 'Inter, system-ui, sans-serif',
                          caretColor: inputMessage.trim() ? 'white' : 'transparent'
                        }}
                      />
                      {!inputMessage.trim() && isTextareaFocused && (
                        <div 
                          className="absolute left-4 top-4 pointer-events-none"
                          style={{ 
                            width: '2px', 
                            height: '1.5em', 
                            backgroundColor: showCursor ? 'white' : 'transparent',
                            transition: 'opacity 0.1s ease-in-out'
                          }}
                        />
                      )}
                    </div>
                    <button
                      aria-label="Send"
                      onClick={handleSendMessage}
                      disabled={isLoading || !inputMessage.trim()}
                      className={`p-3 rounded-full transition-all duration-300 ${
                        isLoading || !inputMessage.trim()
                          ? 'bg-gray-600/20 text-gray-400 cursor-not-allowed'
                          : 'bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 border border-blue-500/20 hover:border-blue-500/40 shadow-sm hover:shadow-md'
                      }`}
                    >
                      <PaperAirplaneIcon className="h-6 w-6" />
                    </button>
                  </div>
                  {sendError && (
                    <div className="mt-2 text-red-400 text-xs">{sendError}</div>
                  )}
                </div>
              </div>
              {/* Parameters Side Panel */}
              {showParameters && (
                <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm" onClick={() => setShowParameters(false)}>
                  <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-l-3xl shadow-2xl w-full max-w-md h-full p-8 overflow-y-auto relative" onClick={e => e.stopPropagation()}>
                    <button
                      className="absolute top-6 right-6 text-gray-400 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-all"
                      onClick={() => setShowParameters(false)}
                      title="Close"
                    >
                      <XMarkIcon className="w-6 h-6" />
                    </button>
                    <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                      <Cog6ToothIcon className="w-7 h-7 text-blue-400" />
                      Model Parameters
                    </h2>
                    {renderParametersPanel(parameters, handleParameterChange, resetToDefaults)}
                  </div>
                </div>
              )}
            </div>
            {/* Integration Code (right) */}
            <div className="w-full md:w-[60%] flex-1 h-full min-h-0 rounded-2xl border border-white/10 shadow-2xl flex flex-col" style={{ minWidth: '600px' }}>
              <div className="flex items-center space-x-3 mb-6 pt-6 px-6">
                <CodeBracketIcon className="w-6 h-6 text-blue-400" />
                <h3 className="text-xl font-bold text-white">API Integration</h3>
              </div>
              <div className="flex flex-wrap gap-3 mb-6 px-6 items-center">
                {['python', 'typescript', 'rust', 'go', 'shell'].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setSelectedLanguage(lang as typeof selectedLanguage)}
                    className={`px-4 py-2 text-sm rounded-xl font-mono border transition-all duration-300 whitespace-nowrap ${
                      selectedLanguage === lang
                        ? 'bg-blue-600/20 text-blue-400 border-blue-500/50 shadow-lg'
                        : 'bg-white/10 text-gray-300 border-white/20 hover:bg-white/20 hover:text-white'
                    }`}
                  >
                    {lang === 'typescript' ? 'TypeScript' : lang.charAt(0).toUpperCase() + lang.slice(1)}
                  </button>
                ))}
                <button
                  onClick={() => setIsCodeModalOpen(true)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                  title="View Full Code"
                >
                  <CodeBracketIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={handleCopyCode}
                  className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                  title="Copy code"
                >
                  {copied ? (
                    <CheckIcon className="w-5 h-5" />
                  ) : (
                    <ClipboardIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
              <div className="px-6 pb-6 flex-1" style={{ minHeight: '550px', position: 'relative' }}>
                <div className="rounded-xl overflow-hidden absolute inset-0 m-6" style={{ minHeight: '500px' }}>
                  <Highlight key={selectedLanguage} theme={themes.nightOwl} code={codeContent} language={selectedLanguage}>
                    {({ className, style, tokens, getLineProps, getTokenProps }) => (
                      <pre className={`${className} p-6 text-sm font-mono whitespace-pre-wrap break-words overflow-x-auto overflow-y-auto h-full`} style={{ ...style, background: 'transparent', margin: 0, maxWidth: '100%', minHeight: '500px' }}>
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
          </div>
        </div>
      </div>
      <Dialog open={isCodeModalOpen} onClose={() => setIsCodeModalOpen(false)} className="fixed z-50 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsCodeModalOpen(false)} />
          <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl max-w-4xl w-full mx-auto p-8 z-10 border border-white/20" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white">Full Code</h3>
              <button onClick={() => setIsCodeModalOpen(false)} className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-all text-2xl">&times;</button>
            </div>
            <div className="overflow-x-auto overflow-y-auto max-h-[70vh] bg-black/40 rounded-xl border border-white/10">
              <Highlight theme={themes.nightOwl} code={codeContent} language={selectedLanguage}>
                {({ className, style, tokens, getLineProps, getTokenProps }) => (
                  <pre className={`${className} p-6 text-sm font-mono whitespace-pre break-words overflow-x-auto overflow-y-auto max-h-[70vh]`} style={{ ...style, margin: 0, maxWidth: '100%' }}>
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
            <div className="flex justify-end mt-6">
              <button
                className="px-6 py-3 bg-blue-600/20 text-blue-400 rounded-xl border border-blue-500/30 hover:bg-blue-600/30 transition-all font-medium"
                onClick={handleCopyCode}
              >
                Copy Code
              </button>
            </div>
          </div>
        </div>
      </Dialog>
      {/* Model Card Overlay */}
      {showModelCard && (
        <div data-testid="dialog" className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowModelCard(false)}>
          <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl text-lg border border-white/10 p-8 w-full max-w-4xl mx-auto overflow-y-auto max-h-[70vh]" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Model Card</h2>
              <div className="flex items-center gap-2">
                {isDevelopment && (
                  <button
                    onClick={() => setIsModelCardEditing(!isModelCardEditing)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all text-sm font-medium ${
                      isModelCardEditing
                        ? 'bg-green-600/20 text-green-400 border border-green-500/30'
                        : 'bg-purple-600/20 text-purple-400 border border-purple-500/30 hover:bg-purple-600/30'
                    }`}
                  >
                    {isModelCardEditing ? 'Preview' : 'Edit'}
                  </button>
                )}
                <button
                  className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-all text-2xl"
                  onClick={() => setShowModelCard(false)}
                  title="Close"
                >
                  &times;
                </button>
              </div>
            </div>
            
            {isModelCardEditing && isDevelopment ? (
              <ModelCardEditingContent 
                content={modelCardContent || model.model_card} 
                onSave={handleModelCardSave}
                onCancel={() => setIsModelCardEditing(false)}
              />
            ) : (
              <ModelCardViewContent modelCard={modelCardContent || model.model_card} />
            )}
          </div>
        </div>
      )}
      {/* Minimal Settings Modal (moved to root) */}
      {showSettings && isDevelopment && (
        <div data-testid="dialog" className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowSettings(false)}>
          <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl w-full max-w-md p-8 flex flex-col items-center" onClick={e => e.stopPropagation()}>
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-all text-2xl"
              onClick={() => setShowSettings(false)}
              title="Close"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Cog6ToothIcon className="w-6 h-6 text-blue-400" />
              Settings
            </h2>
            <div className="w-full flex flex-col gap-6">
              <div className="flex flex-col gap-2 w-full">
                <label className="text-gray-200 font-medium" htmlFor="endpoint-input">Model Endpoint</label>
                <input
                  id="endpoint-input"
                  type="text"
                  className="w-full rounded-lg bg-neutral-900 text-white border border-white/10 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  value={endpoint}
                  onChange={e => { setEndpoint(e.target.value); setEndpointSaved(false); }}
                  placeholder="http://localhost:1234/v1"
                />
                <button
                  className="mt-2 px-4 py-1 rounded-full bg-blue-600/80 text-white font-semibold hover:bg-blue-700 transition-all self-end"
                  onClick={() => {
                    // Remove trailing /v1 or /v1/ if present
                    const cleanEndpoint = endpoint.trim().replace(/\/?v1\/?$/, '');
                    setEndpoint(cleanEndpoint);
                    setEndpointSaved(true);
                    setShowSettings(false);
                  }}
                >
                  Save
                </button>
                {endpointSaved && <div className="text-green-400 text-xs mt-1">Endpoint saved!</div>}
              </div>
              <div className="flex items-center justify-between w-full">
                <span className="text-gray-200 font-medium">Clear Chat</span>
                <button
                  className="px-4 py-1 rounded-full bg-red-600/80 text-white font-semibold hover:bg-red-700 transition-all"
                  onClick={() => { setMessages([{ role: 'system', content: 'Hi, what can I do for you today?', timestamp: new Date() }]); setShowSettings(false); }}
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Tool Selector Modal */}
      {showToolSelector && (
        <ToolSelector
          enabledTools={enabledToolNames}
          onToolToggle={handleToolToggle}
          onEnableAll={handleEnableAllTools}
          onDisableAll={handleDisableAllTools}
          onClose={() => setShowToolSelector(false)}
          onTestTools={() => setShowToolTestPanel(true)}
          isDevelopment={isDevelopment}
        />
      )}
      {/* Tool Documentation Modal */}
      {showToolDocumentation && (
        <ToolDocumentation
          onClose={() => setShowToolDocumentation(false)}
        />
      )}
      {/* Tool Test Panel Modal */}
      {showToolTestPanel && (
        <ToolTestPanel
          isVisible={showToolTestPanel}
          onClose={() => setShowToolTestPanel(false)}
          onTestMessage={handleTestMessage}
          enabledTools={enabledToolNames}
          isToolCallingEnabled={isToolCallingEnabled}
        />
      )}
      {/* Deployment Guide Modal */}
      {showDeploymentGuide && model && (
        <DeploymentGuide
          isOpen={showDeploymentGuide}
          onClose={() => setShowDeploymentGuide(false)}
          modelInfo={{
            name: model.name,
            size: model.size || '7B',
            requirements: model.size && model.size.includes('B') ? 
              `${parseInt(model.size) >= 32 ? '64GB' : '32GB'} VRAM, ${parseInt(model.size) >= 32 ? '128GB' : '64GB'} RAM` : 
              '16GB VRAM, 32GB RAM'
          }}
        />
      )}
    </div>
  );
};

function renderParametersPanel(
  parameters: Parameter[],
  handleParameterChange: (paramName: string, value: number) => void,
  resetToDefaults: () => void
) {
  return (
    <div>
      {parameters.map(param => (
        <div key={param.name} className="mb-6">
          <label htmlFor={`param-${param.name}`} className="block text-white font-semibold mb-2">
            {param.name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </label>
          <input
            id={`param-${param.name}`}
            type="range"
            min={param.min}
            max={param.max}
            step={param.step}
            value={param.value}
            onChange={e => handleParameterChange(param.name, Number(e.target.value))}
            className="slider w-full"
            aria-label={param.name.replace(/_/g, ' ')}
          />
          <div className="flex justify-between text-xs text-gray-300 mt-1">
            <span>{param.min}</span>
            <span>{param.value}</span>
            <span>{param.max}</span>
          </div>
          <div className="text-gray-400 text-xs mt-1">{param.description}</div>
        </div>
      ))}
      <button
        className="mt-4 px-4 py-2 rounded bg-blue-600/20 text-blue-300 border border-blue-400/30 hover:bg-blue-600/30 hover:text-white transition-all text-sm font-medium"
        onClick={resetToDefaults}
      >
        Reset to Defaults
      </button>
    </div>
  );
}

export default ModelDetail;

