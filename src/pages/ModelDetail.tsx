import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import bannerWave from '../assets/banner_wave.png';
import PlaygroundLogo from '../components/PlaygroundLogo';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { PaperAirplaneIcon, CodeBracketIcon, Cog6ToothIcon, ClipboardIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { lmStudioService } from '../services/lmStudioService';
import { Highlight, themes } from 'prism-react-renderer';
import { getDefaultCode } from '../utils/apiCodeGenerator';
import { Dialog } from '@headlessui/react';
import { loadModelData, modelImageMap } from '../utils/modelLoader';
import type { ModelData } from '../utils/modelLoader';

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

interface ParameterPreset {
  name: string;
  description: string;
  parameters: Record<string, number>;
}

const ModelDetail: React.FC = () => {
  const { modelId = '', '*': splat = '' } = useParams();
  const fullModelId = splat ? `${modelId}/${splat}` : modelId;
  const [model, setModel] = useState<ModelData | null>(null);
  const [activeTab, setActiveTab] = useState<'model' | 'interact' | 'parameters'>('interact');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'system', content: 'Hi, what can I do for you today?', timestamp: new Date() }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<'python' | 'javascript' | 'java' | 'go' | 'csharp' | 'shell'>('python');
  const [isToolCallingEnabled, setIsToolCallingEnabled] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [endpointConfig, setEndpointConfig] = useState({
    endpoint: 'http://localhost:1234/v1',
    apiKey: ''
  });
  const [streamingContent, setStreamingContent] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [copied, setCopied] = useState(false);
  const [codeContent, setCodeContent] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Enhanced parameters with more comprehensive options
  const [parameters, setParameters] = useState<Parameter[]>([
    { name: 'temperature', value: 0.7, type: 'number', description: 'Controls randomness in the output (0.0 = deterministic, 2.0 = very random)', min: 0, max: 2, step: 0.1 },
    { name: 'top_p', value: 0.9, type: 'number', description: 'Controls diversity via nucleus sampling (0.0 = focused, 1.0 = diverse)', min: 0, max: 1, step: 0.1 },
    { name: 'frequency_penalty', value: 0.0, type: 'number', description: 'Reduces repetition of frequent tokens (-2.0 to 2.0)', min: -2, max: 2, step: 0.1 },
    { name: 'presence_penalty', value: 0.0, type: 'number', description: 'Encourages model to talk about new topics (-2.0 to 2.0)', min: -2, max: 2, step: 0.1 },
    { name: 'max_tokens', value: 2048, type: 'number', description: 'Maximum number of tokens to generate', min: 100, max: 8192, step: 100 }
  ]);

  // Parameter presets for different use cases
  const parameterPresets: ParameterPreset[] = [
    {
      name: 'Creative Writing',
      description: 'High creativity, diverse outputs',
      parameters: {
        temperature: 0.9,
        top_p: 0.9,
        frequency_penalty: 0.3,
        presence_penalty: 0.1,
        max_tokens: 2048
      }
    },
    {
      name: 'Code Generation',
      description: 'Focused, deterministic code',
      parameters: {
        temperature: 0.2,
        top_p: 0.95,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
        max_tokens: 2048
      }
    },
    {
      name: 'Conversation',
      description: 'Balanced for chat interactions',
      parameters: {
        temperature: 0.7,
        top_p: 0.9,
        frequency_penalty: 0.1,
        presence_penalty: 0.1,
        max_tokens: 2048
      }
    },
    {
      name: 'Analysis',
      description: 'Focused, analytical responses',
      parameters: {
        temperature: 0.3,
        top_p: 0.8,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
        max_tokens: 2048
      }
    },
    {
      name: 'Creative Coding',
      description: 'Creative but structured code',
      parameters: {
        temperature: 0.6,
        top_p: 0.9,
        frequency_penalty: 0.1,
        presence_penalty: 0.1,
        max_tokens: 2048
      }
    }
  ];

  const [tools] = useState([
    {
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
    },
    {
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
    },
    {
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
    },
    {
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
    },
    {
      name: 'get_stock_price',
      description: 'Get the current stock price for a ticker symbol',
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
          }
        },
        required: ['symbol']
      }
    },
    {
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
  ]);

  const [enabledToolNames] = useState<string[]>(tools.map(t => t.name));
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingContent]);

  useEffect(() => {
    if (activeTab === 'interact') {
      textareaRef.current?.focus();
    }
  }, [activeTab]);

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

  const handleParameterChange = (paramName: string, value: number) => {
    setParameters(prev => prev.map(param => 
      param.name === paramName ? { ...param, value } : param
    ));
  };

  const applyPreset = (preset: ParameterPreset) => {
    setParameters(prev => prev.map(param => 
      preset.parameters[param.name] !== undefined 
        ? { ...param, value: preset.parameters[param.name] }
        : param
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

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const messageToSend = inputMessage;
    setInputMessage('');
    setIsLoading(true);
    setIsStreaming(true);

    const newMessage: Message = {
      role: 'user',
      content: messageToSend,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);

    try {
      console.log('Sending message to LM-studio...');
      const enabledTools = tools.filter(t => enabledToolNames.includes(t.name));
      const response = await lmStudioService.chatCompletion(
        {
          messages: [
            ...messages.map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: messageToSend }
          ],
          temperature: parameters.find(p => p.name === 'temperature')?.value as number,
          max_tokens: parameters.find(p => p.name === 'max_tokens')?.value as number,
          top_p: parameters.find(p => p.name === 'top_p')?.value as number,
          ...(isToolCallingEnabled && { tools: enabledTools })
        },
        (chunk) => {
          if (chunk.choices[0]?.delta?.content) {
            setStreamingContent(prev => prev + chunk.choices[0].delta.content);
          }
        }
      );

      console.log('Received response:', response);

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

      // Handle tool calls if present
      if (assistantMessage.tool_calls) {
        for (const toolCall of assistantMessage.tool_calls) {
          // Here you would implement the actual tool execution
          // For now, we'll just add a mock response
          const toolResponse: Message = {
            role: 'tool',
            content: `Tool ${toolCall.function.name} executed with arguments: ${toolCall.function.arguments}`,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, toolResponse]);
        }
      }
      // Automatically close the tool calling section after response
      setIsToolCallingEnabled(false);
    } catch (err) {
      console.error('Error in handleSendMessage:', err);
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

  const handleUpdateEndpoint = () => {
    // Ensure the endpoint ends with /v1
    const endpoint = endpointConfig.endpoint.trim();
    const formattedEndpoint = endpoint.endsWith('/v1') ? endpoint : `${endpoint}/v1`;
    
    lmStudioService.setConfig({
      ...endpointConfig,
      endpoint: formattedEndpoint
    });
    setShowSettings(false);
  };

  const renderSettings = () => (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Settings</h3>
          <p className="text-sm text-gray-400">(LM-studio for testing only)</p>
        </div>
        <button
          onClick={() => setShowSettings(false)}
          className="text-gray-400 hover:text-white"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Endpoint URL
          </label>
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <input
                type="text"
                value={endpointConfig.endpoint.replace('/v1', '')}
                onChange={(e) =>
                  setEndpointConfig((prev) => ({
                    ...prev,
                    endpoint: e.target.value,
                  }))
                }
                className="w-full bg-gray-800 text-white rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="http://localhost:1234"
              />
            </div>
            <span className="text-gray-400 whitespace-nowrap">/v1</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            API Key (Optional)
          </label>
          <input
            type="password"
            value={endpointConfig.apiKey}
            onChange={(e) =>
              setEndpointConfig((prev) => ({
                ...prev,
                apiKey: e.target.value,
              }))
            }
            className="w-full bg-gray-800 text-white rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your API key"
          />
        </div>

        <div className="pt-4">
          <button
            onClick={handleUpdateEndpoint}
            className="w-full bg-blue-600 text-white rounded-lg p-2 hover:bg-blue-700"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );

  if (!model) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-4">Model Not Found</h1>
        <Link to="/models" className="text-blue-400 hover:underline">&larr; Back to Models</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-900 text-white font-sans">
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
      `}</style>
      {/* Banner */}
      <div className="relative w-full h-56 md:h-72 lg:h-80 overflow-hidden">
        <img src={bannerWave} alt="Banner" className="w-full h-full object-cover" />
        <nav className="absolute top-0 left-0 w-full flex justify-between items-center pt-8 px-8 z-10">
          <PlaygroundLogo />
          <div className="flex gap-16">
            <Link to="/models" className="text-2xl font-bold transition relative px-2 opacity-100 after:content-[''] after:block after:h-1 after:rounded after:mt-1 after:w-full after:bg-red-500">Models</Link>
            <Link to="/blueprints" className="text-2xl font-bold transition relative px-2 opacity-80 hover:opacity-100 after:content-[''] after:block after:h-1 after:rounded after:mt-1 after:w-0 after:bg-red-500 hover:after:w-full">Blueprints</Link>
            <Link to="/gpu-cloud" className="text-2xl font-bold transition relative px-2 opacity-80 hover:opacity-100 after:content-[''] after:block after:h-1 after:rounded after:mt-1 after:w-0 after:bg-red-500 hover:after:w-full">GPU Clouds</Link>
          </div>
        </nav>
        
        {/* Left-aligned glassy model logo/name overlay */}
        <div className="absolute left-8 top-32 z-10 bg-white/10 backdrop-blur-md border border-white/30 rounded-2xl shadow-lg p-3 flex flex-col items-center w-40">
          <img src={modelImageMap[model.model_id] || model.logo} alt={model.name} className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-cover rounded-xl mb-2 border border-neutral-800" />
          <div className="text-xs font-bold text-white text-center drop-shadow-lg">AI Model</div>
          <div className="text-base font-extrabold text-center text-white drop-shadow-lg">{model.name}</div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row max-w-[1600px] mx-auto p-8 gap-8">
        {/* Main Content */}
        <div className="flex-1">
          {/* Top Header */}
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
              Interact
            </button>
            <button
              onClick={() => setActiveTab('model')}
              className={`px-6 py-2 -mb-px text-lg font-medium border-b-2 transition-colors duration-150 focus:outline-none
                ${activeTab === 'model'
                  ? 'border-blue-500 text-blue-500 bg-transparent'
                  : 'border-transparent text-gray-400 hover:text-blue-400'}
              `}
              style={{ background: 'none', borderRadius: 0 }}
            >
              Model Card
            </button>
            <button
              onClick={() => setActiveTab('parameters')}
              className={`px-6 py-2 -mb-px text-lg font-medium border-b-2 transition-colors duration-150 focus:outline-none relative
                ${activeTab === 'parameters'
                  ? 'border-blue-500 text-blue-500 bg-transparent'
                  : 'border-transparent text-gray-400 hover:text-blue-400'}
              `}
              style={{ background: 'none', borderRadius: 0 }}
            >
              Parameters
              <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs px-1.5 py-0.5 rounded-full font-bold">BETA</span>
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'interact' && (
            <div className="flex flex-row gap-8 items-stretch h-[700px]">
              {/* Chatbox (left) */}
              <div className="w-full md:w-[40%] flex-1 h-full min-h-0 bg-neutral-900 rounded-lg p-6 border border-neutral-800 shadow mb-8 md:mb-0 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Chat</h3>
                  <button
                    onClick={() => setShowSettings(!showSettings)}
                    className="text-gray-400 hover:text-white"
                    title="Settings"
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
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-4 ${
                            message.role === 'user'
                              ? 'bg-blue-600 text-white'
                              : message.role === 'tool'
                              ? 'bg-green-600 text-white'
                              : 'bg-neutral-800 text-white'
                          }`}
                        >
                          <div className="prose prose-invert max-w-none">
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm]}
                              rehypePlugins={[rehypeRaw]}
                            >
                              {message.content}
                            </ReactMarkdown>
                          </div>
                          {message.tool_calls && (
                            <div className="mt-2 text-sm">
                              <div className="font-semibold">Tool Calls:</div>
                              {message.tool_calls.map((toolCall, i) => (
                                <div key={i} className="mt-1">
                                  <div>Function: {toolCall.function.name}</div>
                                  <div>Arguments: {toolCall.function.arguments}</div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    {isStreaming && streamingContent && (
                      <div className="flex justify-start">
                        <div className="max-w-[80%] rounded-lg p-4 bg-neutral-800 text-white">
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
                        placeholder="Type your message..."
                        className="flex-1 bg-neutral-800 text-white rounded-lg p-3 min-h-[60px] max-h-[200px] resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              {/* Integration Code (right) */}
              <div className="w-full md:w-[60%] flex-1 h-full min-h-0 bg-neutral-900 rounded-lg border border-neutral-800 shadow flex flex-col">
                <div className="flex items-center space-x-2 mb-4 pt-6 px-6">
                  <CodeBracketIcon className="w-5 h-5 text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-200">API Integration</h3>
                </div>
                <div className="flex flex-nowrap gap-2 mb-4 px-6 items-center overflow-x-auto">
                  {['python', 'javascript', 'java', 'go', 'csharp', 'shell'].map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setSelectedLanguage(lang as typeof selectedLanguage)}
                      className={`px-3 py-1 text-sm rounded-md font-mono border transition-colors duration-150 ${
                        selectedLanguage === lang
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-neutral-800 text-gray-300 border-neutral-700 hover:bg-neutral-700'
                      }`}
                    >
                      {lang === 'csharp' ? 'C#' : lang.charAt(0).toUpperCase() + lang.slice(1)}
                    </button>
                  ))}
                  <button
                    onClick={handleCopyCode}
                    className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
                    title="Copy code"
                  >
                    {copied ? (
                      <CheckIcon className="w-5 h-5" />
                    ) : (
                      <ClipboardIcon className="w-5 h-5" />
                    )}
                  </button>
                  <div className="flex-grow" />
                  <button
                    onClick={() => setIsCodeModalOpen(true)}
                    className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded-md transition-colors ml-2"
                    title="View Full Code"
                  >
                    <CodeBracketIcon className="w-5 h-5" />
                  </button>
                </div>
                <div className="px-6 pb-4">
                  <Highlight theme={themes.nightOwl} code={codeContent} language={selectedLanguage}>
                    {({ className, style, tokens, getLineProps, getTokenProps }) => (
                      <pre className={`${className} p-4 text-sm font-mono whitespace-pre-wrap break-words overflow-x-auto overflow-y-auto max-h-[550px]`} style={{ ...style, margin: 0, maxWidth: '100%' }}>
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

          {activeTab === 'model' && (
            <div className="prose prose-invert max-w-none bg-neutral-900/80 p-6 rounded-xl shadow-lg text-lg custom-prose border border-neutral-800 w-full">
              {model.model_card ? (
                <>
                  {/* Overview */}
                  {model.model_card.overview && (
                    <section className="mb-6">
                      <h2 className="text-2xl font-bold mb-2">Overview</h2>
                      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                        {model.model_card.overview}
                      </ReactMarkdown>
                    </section>
                  )}
                  {/* Intended Use */}
                  {model.model_card.intended_use && model.model_card.intended_use.length > 0 && (
                    <section className="mb-6">
                      <h2 className="text-xl font-semibold mb-2">Intended Use</h2>
                      <ul className="list-disc pl-6">
                        {model.model_card.intended_use.map((item: string, idx: number) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </section>
                  )}
                  {/* Limitations */}
                  {model.model_card.limitations && model.model_card.limitations.length > 0 && (
                    <section className="mb-6">
                      <h2 className="text-xl font-semibold mb-2">Limitations</h2>
                      <ul className="list-disc pl-6">
                        {model.model_card.limitations.map((item: string, idx: number) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </section>
                  )}
                  {/* Training Data */}
                  {model.model_card.training_data && (
                    <section className="mb-6">
                      <h2 className="text-xl font-semibold mb-2">Training Data</h2>
                      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                        {model.model_card.training_data}
                      </ReactMarkdown>
                    </section>
                  )}
                  {/* Evaluation */}
                  {model.model_card.evaluation && model.model_card.evaluation.length > 0 && (
                    <section className="mb-6">
                      <h2 className="text-xl font-semibold mb-2">Evaluation</h2>
                      <ul className="list-disc pl-6">
                        {model.model_card.evaluation.map((item: string, idx: number) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </section>
                  )}
                  {/* Known Issues */}
                  {model.model_card.known_issues && model.model_card.known_issues.length > 0 && (
                    <section className="mb-6">
                      <h2 className="text-xl font-semibold mb-2">Known Issues</h2>
                      <ul className="list-disc pl-6">
                        {model.model_card.known_issues.map((item: string, idx: number) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </section>
                  )}
                  {/* References */}
                  {model.model_card.references && model.model_card.references.length > 0 && (
                    <section className="mb-6">
                      <h2 className="text-xl font-semibold mb-2">References</h2>
                      <ul className="list-disc pl-6">
                        {model.model_card.references.map((ref: string, idx: number) => (
                          <li key={idx}>
                            {ref.startsWith('http') ? (
                              <a href={ref} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">{ref}</a>
                            ) : (
                              ref
                            )}
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}
                </>
              ) : (
                <div>No model card information available.</div>
              )}
            </div>
          )}

          {activeTab === 'parameters' && (
            <div className="bg-neutral-900 rounded-lg border border-neutral-800 shadow p-8">
              <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-2">Model Parameters</h2>
                  <p className="text-gray-400">Fine-tune the model's behavior for your specific use case</p>
                </div>

                {/* Parameter Sliders */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold">Parameters</h3>
                    <button
                      onClick={resetToDefaults}
                      className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                      Reset to Defaults
                    </button>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {parameters.map((param) => (
                      <div key={param.name} className="space-y-3 p-4 bg-neutral-800 rounded-lg">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium text-gray-300 capitalize">
                            {param.name.replace(/_/g, ' ')}
                          </label>
                          <span className="text-sm text-blue-400 font-mono bg-neutral-700 px-2 py-1 rounded">
                            {param.value}
                          </span>
                        </div>
                        <input
                          type="range"
                          min={param.min}
                          max={param.max}
                          step={param.step}
                          value={param.value}
                          onChange={(e) => handleParameterChange(param.name, parseFloat(e.target.value))}
                          className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer slider"
                        />
                        <p className="text-xs text-gray-400">{param.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Dialog open={isCodeModalOpen} onClose={() => setIsCodeModalOpen(false)} className="fixed z-50 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="fixed inset-0 bg-black/60" />
          <div className="relative bg-neutral-900 rounded-2xl shadow-2xl max-w-3xl w-full mx-auto p-6 z-10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-white">Full Code</h3>
              <button onClick={() => setIsCodeModalOpen(false)} className="text-gray-400 hover:text-white text-2xl">&times;</button>
            </div>
            <div className="overflow-x-auto overflow-y-auto max-h-[70vh]">
              <Highlight theme={themes.nightOwl} code={codeContent} language={selectedLanguage}>
                {({ className, style, tokens, getLineProps, getTokenProps }) => (
                  <pre className={`${className} p-4 text-sm font-mono whitespace-pre break-words overflow-x-auto overflow-y-auto max-h-[70vh]`} style={{ ...style, margin: 0, maxWidth: '100%' }}>
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
            <div className="flex justify-end mt-4">
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                onClick={handleCopyCode}
              >
                Copy Code
              </button>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default ModelDetail;

