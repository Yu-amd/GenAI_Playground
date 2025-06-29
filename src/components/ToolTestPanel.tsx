import React, { useState } from 'react';
import { WrenchScrewdriverIcon, PlayIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface ToolTestPanelProps {
  isVisible: boolean;
  onClose: () => void;
  onTestMessage: (message: string) => void;
  enabledTools: string[];
  isToolCallingEnabled: boolean;
}

const testQueries = [
  {
    name: 'Weather Test',
    query: "What's the weather like in San Francisco?",
    expectedTool: 'get_weather',
    description: 'Tests weather API integration'
  },
  {
    name: 'Calculator Test',
    query: 'What is 25% of 480?',
    expectedTool: 'calculate',
    description: 'Tests mathematical calculations'
  },
  {
    name: 'Translation Test',
    query: 'Translate "Hello world" to Spanish',
    expectedTool: 'translate',
    description: 'Tests translation service'
  },
  {
    name: 'Current Stock Price',
    query: "What's the current price of Apple stock?",
    expectedTool: 'get_stock_price',
    description: 'Get current stock price for AAPL'
  },
  {
    name: 'Historical Stock Price',
    query: 'What was AMD stock price on June 20, 2024?',
    expectedTool: 'get_stock_price',
    description: 'Get historical stock price for specific date'
  },
  {
    name: 'Stock with Currency',
    query: 'Get Tesla stock price with currency information',
    expectedTool: 'get_stock_price',
    description: 'Include currency details in response'
  },
  {
    name: 'Time Test',
    query: 'What time is it in Tokyo?',
    expectedTool: 'get_time',
    description: 'Tests timezone functionality'
  },
  {
    name: 'Search Test',
    query: 'What are the latest developments in AI?',
    expectedTool: 'search_web',
    description: 'Tests web search functionality'
  }
];

const ToolTestPanel: React.FC<ToolTestPanelProps> = ({
  isVisible,
  onClose,
  onTestMessage,
  enabledTools,
  isToolCallingEnabled
}) => {
  const [testResults, setTestResults] = useState<Record<string, 'pending' | 'success' | 'failed'>>({});

  const runTest = (testName: string, query: string) => {
    setTestResults(prev => ({ ...prev, [testName]: 'pending' }));
    onTestMessage(query);
    
    // Simulate test completion after a delay
    setTimeout(() => {
      setTestResults(prev => ({ ...prev, [testName]: 'success' }));
    }, 3000);
  };

  const runAllTests = () => {
    testQueries.forEach((test, index) => {
      setTimeout(() => {
        runTest(test.name, test.query);
      }, index * 1000);
    });
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl w-full max-w-4xl mx-auto p-8 overflow-y-auto max-h-[90vh]" onClick={e => e.stopPropagation()}>
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-all text-2xl"
          onClick={onClose}
          title="Close"
        >
          &times;
        </button>
        
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <WrenchScrewdriverIcon className="w-7 h-7 text-blue-400" />
          Tool Calling Test Panel
        </h2>
        
        {/* Status Section */}
        <div className="mb-6 p-4 bg-white/5 rounded-lg border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-3">System Status</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isToolCallingEnabled ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-gray-300">Tool Calling:</span>
              <span className={isToolCallingEnabled ? 'text-green-400' : 'text-red-400'}>
                {isToolCallingEnabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${enabledTools.length > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-gray-300">Tools Selected:</span>
              <span className="text-blue-400">{enabledTools.length}</span>
            </div>
          </div>
          
          {enabledTools.length > 0 && (
            <div className="mt-3">
              <span className="text-gray-300 text-sm">Enabled Tools:</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {enabledTools.map(tool => (
                  <span key={tool} className="px-2 py-1 bg-blue-600/20 text-blue-300 rounded text-xs">
                    {tool.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Test Instructions */}
        <div className="mb-6 p-4 bg-blue-600/10 rounded-lg border border-blue-500/20">
          <h3 className="text-lg font-semibold text-blue-300 mb-2">How to Test</h3>
          <ol className="text-sm text-gray-300 space-y-1">
            <li>1. Make sure tool calling is enabled (toggle in chat)</li>
            <li>2. Select the tools you want to test</li>
            <li>3. Click "Run All Tests" or individual test buttons</li>
            <li>4. Check browser console for detailed logs</li>
            <li>5. Look for tool calls and results in the chat</li>
          </ol>
        </div>

        {/* Test Buttons */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">Individual Tests</h3>
            <button
              onClick={runAllTests}
              className="px-4 py-2 bg-green-600/20 text-green-300 border border-green-500/30 rounded-lg hover:bg-green-600/30 transition-all flex items-center gap-2"
            >
              <PlayIcon className="w-4 h-4" />
              Run All Tests
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {testQueries.map((test) => {
              const status = testResults[test.name];
              const isEnabled = enabledTools.includes(test.expectedTool);
              
              return (
                <div
                  key={test.name}
                  className={`p-4 rounded-lg border transition-all ${
                    isEnabled 
                      ? 'bg-white/5 border-white/20 hover:bg-white/10' 
                      : 'bg-gray-800/50 border-gray-600 opacity-50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-white">{test.name}</h4>
                    <div className="flex items-center gap-2">
                      {status === 'pending' && (
                        <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      )}
                      {status === 'success' && (
                        <CheckIcon className="w-4 h-4 text-green-400" />
                      )}
                      {status === 'failed' && (
                        <XMarkIcon className="w-4 h-4 text-red-400" />
                      )}
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-400 mb-3">{test.description}</p>
                  
                  <div className="text-xs text-gray-500 mb-3">
                    <span className="font-medium">Query:</span> "{test.query}"
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">Tool:</span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      isEnabled ? 'bg-blue-600/20 text-blue-300' : 'bg-gray-600/20 text-gray-400'
                    }`}>
                      {test.expectedTool}
                    </span>
                  </div>
                  
                  <button
                    onClick={() => runTest(test.name, test.query)}
                    disabled={!isEnabled || status === 'pending'}
                    className={`mt-3 w-full px-3 py-1.5 rounded text-xs transition-all ${
                      isEnabled && status !== 'pending'
                        ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30 hover:bg-blue-600/30'
                        : 'bg-gray-600/20 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {status === 'pending' ? 'Running...' : 'Run Test'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Debug Information */}
        <div className="p-4 bg-yellow-600/10 rounded-lg border border-yellow-500/20">
          <h3 className="text-lg font-semibold text-yellow-300 mb-2">Debug Information</h3>
          <div className="text-sm text-gray-300 space-y-2">
            <p>• Open browser console (F12) to see detailed logs</p>
            <p>• Look for "TOOL CALLING DEBUG" messages</p>
            <p>• Check if tools are being sent to the model</p>
            <p>• Verify model supports function calling</p>
            <p>• Ensure endpoint is running on correct port</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolTestPanel; 