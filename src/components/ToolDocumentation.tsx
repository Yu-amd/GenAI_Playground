import React from 'react';
import {
  CloudIcon,
  MagnifyingGlassIcon,
  CalculatorIcon,
  LanguageIcon,
  ChartBarIcon,
  ClockIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';

interface ToolDoc {
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  category: string;
  parameters: Array<{
    name: string;
    type: string;
    required: boolean;
    description: string;
    example?: string;
  }>;
  examples: Array<{
    prompt: string;
    response: string;
  }>;
  tips: string[];
}

const toolDocumentation: ToolDoc[] = [
  {
    name: 'get_weather',
    description: 'Get current weather information for any location worldwide',
    icon: CloudIcon,
    category: 'Information',
    parameters: [
      {
        name: 'location',
        type: 'string',
        required: true,
        description:
          'City and state/country (e.g., "San Francisco, CA" or "London, UK")',
        example: 'New York, NY',
      },
      {
        name: 'unit',
        type: 'string (celsius | fahrenheit)',
        required: false,
        description: 'Temperature unit preference',
        example: 'fahrenheit',
      },
    ],
    examples: [
      {
        prompt: "What's the weather like in Tokyo?",
        response:
          'Weather in Tokyo:\n• Temperature: 22°C\n• Conditions: Partly cloudy\n• Humidity: 65%\n• Wind Speed: 8 m/s',
      },
      {
        prompt: 'How hot is it in Miami in Fahrenheit?',
        response:
          'Weather in Miami:\n• Temperature: 85°F\n• Conditions: Sunny\n• Humidity: 70%\n• Wind Speed: 12 mph',
      },
    ],
    tips: [
      'Be specific with location names for better accuracy',
      'Use country codes for international cities',
      'Temperature units default to Celsius if not specified',
    ],
  },
  {
    name: 'search_web',
    description: 'Search the web for real-time information and current events',
    icon: MagnifyingGlassIcon,
    category: 'Information',
    parameters: [
      {
        name: 'query',
        type: 'string',
        required: true,
        description: 'Search query or question',
        example: 'latest SpaceX launch',
      },
      {
        name: 'num_results',
        type: 'integer (1-10)',
        required: false,
        description: 'Number of results to return',
        example: '5',
      },
    ],
    examples: [
      {
        prompt: 'What are the latest developments in AI?',
        response:
          'Search results for "latest developments in AI":\n\n1. OpenAI releases GPT-4 Turbo with improved performance\n2. Google announces new multimodal AI model\n3. Meta develops new language model for research...',
      },
      {
        prompt: 'Find information about renewable energy trends',
        response:
          'Search results for "renewable energy trends":\n\n1. Solar power adoption increases 23% globally\n2. Wind energy capacity reaches new records\n3. Battery storage technology advances...',
      },
    ],
    tips: [
      'Use specific keywords for better search results',
      'Include current year for recent information',
      'Combine multiple terms for focused searches',
    ],
  },
  {
    name: 'calculate',
    description:
      'Perform mathematical calculations with support for complex expressions',
    icon: CalculatorIcon,
    category: 'Utility',
    parameters: [
      {
        name: 'expression',
        type: 'string',
        required: true,
        description: 'Mathematical expression to evaluate',
        example: '(15 + 7) * 3 / 2',
      },
      {
        name: 'precision',
        type: 'integer (0-10)',
        required: false,
        description: 'Number of decimal places in result',
        example: '3',
      },
    ],
    examples: [
      {
        prompt: 'What is 25% of 480?',
        response: 'Calculation: 480 * 0.25 = 120.00',
      },
      {
        prompt: 'Calculate the area of a circle with radius 5',
        response: 'Calculation: 3.14159 * 5 * 5 = 78.54',
      },
    ],
    tips: [
      'Supports basic arithmetic: +, -, *, /',
      'Use parentheses for complex expressions',
      'Precision defaults to 2 decimal places',
      'Supports mathematical constants like π',
    ],
  },
  {
    name: 'translate',
    description:
      'Translate text between different languages with automatic language detection',
    icon: LanguageIcon,
    category: 'Utility',
    parameters: [
      {
        name: 'text',
        type: 'string',
        required: true,
        description: 'Text to translate',
        example: 'Hello, how are you?',
      },
      {
        name: 'target_language',
        type: 'string',
        required: true,
        description: 'Target language code (e.g., "es", "fr", "de")',
        example: 'es',
      },
      {
        name: 'source_language',
        type: 'string',
        required: false,
        description: 'Source language code (auto-detected if not provided)',
        example: 'en',
      },
    ],
    examples: [
      {
        prompt: 'Translate "Good morning" to Spanish',
        response:
          'Translation:\n• Original (en): Good morning\n• Translated (es): Buenos días',
      },
      {
        prompt: 'How do you say "Thank you" in Japanese?',
        response:
          'Translation:\n• Original (en): Thank you\n• Translated (ja): ありがとう',
      },
    ],
    tips: [
      'Use standard language codes (es, fr, de, ja, etc.)',
      'Source language is auto-detected if not specified',
      'Supports 100+ languages worldwide',
      'Best results with clear, complete sentences',
    ],
  },
  {
    name: 'get_stock_price',
    description:
      'Get real-time stock prices and market data for publicly traded companies',
    icon: ChartBarIcon,
    category: 'Finance',
    parameters: [
      {
        name: 'symbol',
        type: 'string',
        required: true,
        description: 'Stock ticker symbol',
        example: 'AAPL',
      },
      {
        name: 'include_currency',
        type: 'boolean',
        required: false,
        description: 'Whether to include currency in response',
        example: 'true',
      },
      {
        name: 'date',
        type: 'string',
        required: false,
        description: 'Date for historical price',
        example: '2025-06-20',
      },
    ],
    examples: [
      {
        prompt: "What's the current price of Apple stock?",
        response:
          'Stock Price for AAPL:\n• Current Price: $150.25 USD\n• Change: +$2.15 (+1.45%)',
      },
      {
        prompt: 'Get AMD stock price on June 20, 2025',
        response:
          'Stock Price for AMD:\n• Current Price: $120.75 USD\n• Change: +$1.25 (+1.05%)',
      },
      {
        prompt: "What was Tesla's stock price yesterday?",
        response:
          'Stock Price for TSLA:\n• Current Price: $245.90 USD\n• Change: -$8.75 (-3.44%)',
      },
    ],
    tips: [
      'Use standard ticker symbols (AAPL, GOOGL, MSFT, etc.)',
      'Prices are real-time during market hours',
      'Includes price change and percentage change',
      'Currency defaults to USD for US stocks',
      'Historical prices are available by specifying a date',
    ],
  },
  {
    name: 'get_time',
    description:
      'Get current time for any timezone with flexible formatting options',
    icon: ClockIcon,
    category: 'Utility',
    parameters: [
      {
        name: 'timezone',
        type: 'string',
        required: true,
        description: 'Timezone identifier (e.g., "America/New_York", "UTC")',
        example: 'Europe/London',
      },
      {
        name: 'format',
        type: 'string (12h | 24h)',
        required: false,
        description: 'Time format preference',
        example: '12h',
      },
    ],
    examples: [
      {
        prompt: 'What time is it in Tokyo?',
        response:
          'Current time in Asia/Tokyo:\n• 2024-01-15, 14:30:25\n• Format: 24-hour',
      },
      {
        prompt: "What's the current time in New York in 12-hour format?",
        response:
          'Current time in America/New_York:\n• 01/15/2024, 02:30:25 AM\n• Format: 12-hour',
      },
    ],
    tips: [
      'Use standard timezone names (America/New_York, Europe/London)',
      'UTC is available for universal time',
      '12h format shows AM/PM, 24h shows military time',
      'Includes date and time information',
    ],
  },
];

interface ToolDocumentationProps {
  onClose: () => void;
}

const ToolDocumentation: React.FC<ToolDocumentationProps> = ({ onClose }) => {
  const toolsByCategory = toolDocumentation.reduce(
    (acc, tool) => {
      if (!acc[tool.category]) {
        acc[tool.category] = [];
      }
      acc[tool.category].push(tool);
      return acc;
    },
    {} as Record<string, ToolDoc[]>
  );

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm'
      onClick={onClose}
    >
      <div
        className='relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl w-full max-w-4xl mx-auto p-8 overflow-y-auto max-h-[90vh]'
        onClick={e => e.stopPropagation()}
      >
        <button
          className='absolute top-4 right-4 text-gray-400 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-all text-2xl'
          onClick={onClose}
          title='Close'
        >
          &times;
        </button>

        <h2 className='text-2xl font-bold text-white mb-6 flex items-center gap-3'>
          <InformationCircleIcon className='w-7 h-7 text-blue-400' />
          Tool Documentation
        </h2>

        <p className='text-gray-300 mb-8'>
          Learn about each available tool, their parameters, and how to use them
          effectively in your conversations.
        </p>

        <div className='space-y-8'>
          {Object.entries(toolsByCategory).map(([category, tools]) => (
            <div key={category}>
              <h3 className='text-xl font-semibold text-white mb-4 border-b border-white/20 pb-2'>
                {category}
              </h3>
              <div className='space-y-6'>
                {tools.map(tool => {
                  const IconComponent = tool.icon;

                  return (
                    <div
                      key={tool.name}
                      className='bg-white/5 rounded-xl p-6 border border-white/10'
                    >
                      <div className='flex items-start gap-4 mb-4'>
                        <div className='p-3 rounded-lg bg-blue-600/20'>
                          <IconComponent className='w-6 h-6 text-blue-400' />
                        </div>
                        <div className='flex-1'>
                          <h4 className='text-lg font-semibold text-white mb-2'>
                            {tool.name
                              .replace(/_/g, ' ')
                              .replace(/\b\w/g, l => l.toUpperCase())}
                          </h4>
                          <p className='text-gray-300'>{tool.description}</p>
                        </div>
                      </div>

                      {/* Parameters */}
                      <div className='mb-6'>
                        <h5 className='text-sm font-semibold text-white mb-3'>
                          Parameters
                        </h5>
                        <div className='space-y-2'>
                          {tool.parameters.map(param => (
                            <div
                              key={param.name}
                              className='flex items-start gap-3 text-sm'
                            >
                              <div className='flex items-center gap-2 min-w-0 flex-1'>
                                <span className='font-mono text-blue-400'>
                                  {param.name}
                                </span>
                                <span className='text-gray-400'>
                                  ({param.type})
                                </span>
                                {param.required && (
                                  <span className='text-red-400 text-xs bg-red-400/10 px-2 py-0.5 rounded'>
                                    Required
                                  </span>
                                )}
                              </div>
                              <div className='flex-1 text-gray-300'>
                                <p>{param.description}</p>
                                {param.example && (
                                  <p className='text-xs text-gray-400 mt-1'>
                                    Example: {param.example}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Examples */}
                      <div className='mb-6'>
                        <h5 className='text-sm font-semibold text-white mb-3'>
                          Examples
                        </h5>
                        <div className='space-y-3'>
                          {tool.examples.map((example, index) => (
                            <div
                              key={index}
                              className='bg-black/20 rounded-lg p-3'
                            >
                              <p className='text-sm text-gray-300 mb-2'>
                                <span className='text-blue-400 font-medium'>
                                  User:
                                </span>{' '}
                                {example.prompt}
                              </p>
                              <p className='text-sm text-gray-300'>
                                <span className='text-green-400 font-medium'>
                                  Response:
                                </span>{' '}
                                {example.response}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Tips */}
                      <div>
                        <h5 className='text-sm font-semibold text-white mb-3'>
                          Tips
                        </h5>
                        <ul className='space-y-1'>
                          {tool.tips.map((tip, index) => (
                            <li
                              key={index}
                              className='text-sm text-gray-300 flex items-start gap-2'
                            >
                              <span className='text-blue-400 mt-1'>•</span>
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className='mt-8 pt-6 border-t border-white/20'>
          <div className='bg-blue-600/10 border border-blue-500/20 rounded-lg p-4'>
            <h4 className='text-sm font-semibold text-blue-300 mb-2'>
              How to Use Tools
            </h4>
            <ul className='text-sm text-gray-300 space-y-1'>
              <li>
                • Enable tool calling using the toggle in the chat interface
              </li>
              <li>• Select which tools you want to use via the Tools button</li>
              <li>
                • Ask questions that would benefit from real-time data or
                calculations
              </li>
              <li>
                • The AI will automatically choose and use the appropriate tools
              </li>
              <li>
                • Tool results will appear in the conversation as tool messages
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolDocumentation;
