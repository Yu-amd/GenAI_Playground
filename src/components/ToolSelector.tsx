import React from 'react';
import { 
  CloudIcon, 
  MagnifyingGlassIcon, 
  CalculatorIcon, 
  LanguageIcon, 
  ChartBarIcon, 
  ClockIcon,
  BeakerIcon
} from '@heroicons/react/24/outline';

interface Tool {
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  category: string;
}

interface ToolSelectorProps {
  enabledTools: string[];
  onToolToggle: (toolName: string) => void;
  onEnableAll: () => void;
  onDisableAll: () => void;
  onClose: () => void;
  onTestTools?: () => void;
  isDevelopment?: boolean;
}

const availableTools: Tool[] = [
  {
    name: 'get_weather',
    description: 'Get current weather for any location',
    icon: CloudIcon,
    category: 'Information'
  },
  {
    name: 'search_web',
    description: 'Search the web for real-time information',
    icon: MagnifyingGlassIcon,
    category: 'Information'
  },
  {
    name: 'calculate',
    description: 'Perform mathematical calculations',
    icon: CalculatorIcon,
    category: 'Utility'
  },
  {
    name: 'translate',
    description: 'Translate text between languages',
    icon: LanguageIcon,
    category: 'Utility'
  },
  {
    name: 'get_stock_price',
    description: 'Get current stock prices and market data',
    icon: ChartBarIcon,
    category: 'Finance'
  },
  {
    name: 'get_time',
    description: 'Get current time for any timezone',
    icon: ClockIcon,
    category: 'Utility'
  }
];

const ToolSelector: React.FC<ToolSelectorProps> = ({ 
  enabledTools, 
  onToolToggle, 
  onEnableAll, 
  onDisableAll, 
  onClose,
  onTestTools,
  isDevelopment
}) => {
  const toolsByCategory = availableTools.reduce((acc, tool) => {
    if (!acc[tool.category]) {
      acc[tool.category] = [];
    }
    acc[tool.category].push(tool);
    return acc;
  }, {} as Record<string, Tool[]>);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl w-full max-w-2xl mx-auto p-8 overflow-y-auto max-h-[80vh]" onClick={e => e.stopPropagation()}>
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-all text-2xl"
          onClick={onClose}
          title="Close"
        >
          &times;
        </button>
        
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <MagnifyingGlassIcon className="w-7 h-7 text-blue-400" />
          Tool Selection
        </h2>
        
        <p className="text-gray-300 mb-6">
          Select which tools you want to enable for this conversation. Enabled tools will be available for the AI to use when responding to your messages.
        </p>

        <div className="space-y-6">
          {Object.entries(toolsByCategory).map(([category, tools]) => (
            <div key={category}>
              <h3 className="text-lg font-semibold text-white mb-3 border-b border-white/20 pb-2">
                {category}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {tools.map((tool) => {
                  const isEnabled = enabledTools.includes(tool.name);
                  const IconComponent = tool.icon;
                  
                  return (
                    <div
                      key={tool.name}
                      className={`p-4 rounded-xl border transition-all cursor-pointer ${
                        isEnabled
                          ? 'bg-blue-600/20 border-blue-500/50 text-blue-300'
                          : 'bg-white/5 border-white/20 text-gray-300 hover:bg-white/10 hover:border-white/30'
                      }`}
                      onClick={() => onToolToggle(tool.name)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${
                          isEnabled ? 'bg-blue-600/30' : 'bg-white/10'
                        }`}>
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-medium text-sm">
                              {tool.name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </h4>
                            <div className={`w-4 h-4 rounded border-2 transition-colors ${
                              isEnabled 
                                ? 'bg-blue-500 border-blue-500' 
                                : 'border-gray-400'
                            }`}>
                              {isEnabled && (
                                <svg className="w-full h-full text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>
                          </div>
                          <p className="text-xs text-gray-400 leading-relaxed">
                            {tool.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center mt-8 pt-6 border-t border-white/20">
          <div className="text-sm text-gray-400">
            {enabledTools.length} of {availableTools.length} tools enabled
          </div>
          <div className="flex gap-3">
            {isDevelopment && onTestTools && (
              <button
                onClick={onTestTools}
                className="px-4 py-2 text-sm rounded-lg bg-purple-600/20 text-purple-300 border border-purple-500/30 hover:bg-purple-600/30 hover:text-white transition-all flex items-center gap-2"
              >
                <BeakerIcon className="w-4 h-4" />
                Test Tools
              </button>
            )}
            <button
              onClick={onEnableAll}
              className="px-4 py-2 text-sm rounded-lg bg-blue-600/20 text-blue-300 border border-blue-500/30 hover:bg-blue-600/30 hover:text-white transition-all"
            >
              Enable All
            </button>
            <button
              onClick={onDisableAll}
              className="px-4 py-2 text-sm rounded-lg bg-gray-600/20 text-gray-300 border border-gray-500/30 hover:bg-gray-600/30 hover:text-white transition-all"
            >
              Disable All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolSelector; 