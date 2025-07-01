import React, { useState, useEffect } from 'react';
import { CloudProviderManager } from '../components/CloudProviderManager';
import { InferenceProviderSelector } from '../components/InferenceProviderSelector';
import { inferenceService } from '../services/inferenceServiceFactory';
import { cloudConfigService } from '../services/cloudConfigService';
import type { ChatCompletionRequest } from '../services/cloudInferenceService';

interface HealthStatus {
  isHealthy: boolean;
  responseTime?: number;
  error?: string;
}

interface ProviderHealthStatus {
  [providerId: string]: HealthStatus;
}

export const CloudInferenceExample: React.FC = () => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentProvider, setCurrentProvider] = useState(
    inferenceService.getProvider()
  );
  const [healthStatus, setHealthStatus] = useState<ProviderHealthStatus>({});

  useEffect(() => {
    updateHealthStatus();
    const interval = setInterval(updateHealthStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const updateHealthStatus = async () => {
    try {
      const status = await inferenceService.getHealthStatus();
      setHealthStatus(status);
    } catch (error) {
      console.error('Failed to update health status:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    setResponse('');

    try {
      const request: ChatCompletionRequest = {
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: input },
        ],
        max_tokens: 500,
        temperature: 0.7,
      };

      const result = await inferenceService.chatCompletion(request);
      setResponse(
        result.choices[0]?.message?.content || 'No response received'
      );
    } catch (error) {
      setResponse(
        `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleProviderChange = (provider: 'lm-studio' | 'cloud') => {
    setCurrentProvider(provider);
  };

  const addSampleProviders = async () => {
    try {
      // Add OpenAI provider (if API key is configured)
      const openaiKey = process.env.REACT_APP_OPENAI_API_KEY;
      if (openaiKey) {
        await cloudConfigService.addProvider({
          id: 'sample-openai',
          name: 'Sample OpenAI',
          type: 'openai',
          endpoint: 'https://api.openai.com',
          apiKey: openaiKey,
          priority: 1,
          enabled: true,
        });
      }

      // Add Azure provider (if configured)
      const azureKey = process.env.REACT_APP_AZURE_API_KEY;
      const azureEndpoint = process.env.REACT_APP_AZURE_ENDPOINT;
      if (azureKey && azureEndpoint) {
        await cloudConfigService.addProvider({
          id: 'sample-azure',
          name: 'Sample Azure OpenAI',
          type: 'azure',
          endpoint: azureEndpoint,
          apiKey: azureKey,
          config: {
            apiVersion:
              process.env.REACT_APP_AZURE_API_VERSION || '2024-02-15-preview',
          },
          priority: 2,
          enabled: true,
        });
      }

      // Add custom provider example
      await cloudConfigService.addProvider({
        id: 'sample-custom',
        name: 'Sample Custom Endpoint',
        type: 'custom',
        endpoint: 'https://api.example.com',
        apiKey: 'your-api-key',
        priority: 3,
        enabled: false, // Disabled by default
        healthCheck: {
          url: '/health',
          method: 'GET',
          expectedStatus: 200,
          timeout: 5000,
        },
      });

      alert(
        'Sample providers added! Check the Cloud Provider Manager to configure them.'
      );
    } catch (error) {
      console.error('Failed to add sample providers:', error);
      alert('Failed to add sample providers. Check console for details.');
    }
  };

  const testAllProviders = async () => {
    try {
      const providers = await inferenceService.getAvailableProviders();
      const results = [];

      for (const provider of providers) {
        try {
          const isHealthy = await inferenceService.testProvider(provider);
          results.push(
            `${provider}: ${isHealthy ? '✅ Healthy' : '❌ Unhealthy'}`
          );
        } catch (error) {
          results.push(
            `${provider}: ❌ Error - ${error instanceof Error ? error.message : 'Unknown error'}`
          );
        }
      }

      alert(`Provider Test Results:\n\n${results.join('\n')}`);
    } catch (error) {
      console.error('Failed to test providers:', error);
      alert('Failed to test providers. Check console for details.');
    }
  };

  return (
    <div className='min-h-screen bg-gray-950 text-white p-6'>
      <div className='max-w-6xl mx-auto space-y-8'>
        {/* Header */}
        <div className='text-center'>
          <h1 className='text-3xl font-bold mb-2'>Cloud Inference Example</h1>
          <p className='text-gray-400'>
            Demonstrate cloud inference with multiple providers and seamless
            switching
          </p>
        </div>

        {/* Provider Selector */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          <div className='lg:col-span-1'>
            <InferenceProviderSelector
              onProviderChange={handleProviderChange}
              showHealthStatus={true}
            />
          </div>

          {/* Chat Interface */}
          <div className='lg:col-span-2'>
            <div className='bg-gray-900 rounded-xl p-6'>
              <h2 className='text-xl font-semibold mb-4'>Chat Interface</h2>

              <form onSubmit={handleSubmit} className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-300 mb-2'>
                    Message
                  </label>
                  <textarea
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    className='w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white resize-none'
                    rows={3}
                    placeholder='Enter your message...'
                    disabled={isLoading}
                  />
                </div>

                <div className='flex items-center justify-between'>
                  <div className='text-sm text-gray-400'>
                    Current Provider:{' '}
                    <span className='text-blue-400'>{currentProvider}</span>
                  </div>
                  <button
                    type='submit'
                    disabled={isLoading || !input.trim()}
                    className='px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all'
                  >
                    {isLoading ? 'Sending...' : 'Send'}
                  </button>
                </div>
              </form>

              {response && (
                <div className='mt-6 p-4 bg-gray-800 rounded-lg'>
                  <h3 className='text-sm font-medium text-gray-300 mb-2'>
                    Response
                  </h3>
                  <div className='text-white whitespace-pre-wrap'>
                    {response}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Provider Management */}
        <div className='bg-gray-900 rounded-xl p-6'>
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-xl font-semibold'>Provider Management</h2>
            <div className='flex space-x-2'>
              <button
                onClick={addSampleProviders}
                className='px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition-all'
              >
                Add Sample Providers
              </button>
              <button
                onClick={testAllProviders}
                className='px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-all'
              >
                Test All Providers
              </button>
            </div>
          </div>

          <CloudProviderManager
            onConfigChange={config => {
              console.log('Provider config changed:', config);
            }}
          />
        </div>

        {/* Health Status */}
        <div className='bg-gray-900 rounded-xl p-6'>
          <h2 className='text-xl font-semibold mb-4'>Health Status</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {Object.entries(healthStatus).map(
              ([provider, status]: [string, HealthStatus]) => (
                <div key={provider} className='p-4 bg-gray-800 rounded-lg'>
                  <div className='flex items-center justify-between mb-2'>
                    <h3 className='font-medium capitalize'>
                      {provider.replace('-', ' ')}
                    </h3>
                    <div
                      className={`w-3 h-3 rounded-full ${
                        status.isHealthy ? 'bg-green-500' : 'bg-red-500'
                      }`}
                    />
                  </div>
                  <div className='text-sm text-gray-400'>
                    {status.isHealthy ? (
                      <>
                        <div>Status: Healthy</div>
                        {status.responseTime && (
                          <div>Response Time: {status.responseTime}ms</div>
                        )}
                      </>
                    ) : (
                      <>
                        <div>Status: Unhealthy</div>
                        {status.error && <div>Error: {status.error}</div>}
                      </>
                    )}
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        {/* Usage Examples */}
        <div className='bg-gray-900 rounded-xl p-6'>
          <h2 className='text-xl font-semibold mb-4'>Usage Examples</h2>
          <div className='space-y-4'>
            <div>
              <h3 className='font-medium mb-2'>Basic Usage</h3>
              <pre className='bg-gray-800 p-3 rounded-lg text-sm overflow-x-auto'>
                {`import { inferenceService } from './services/inferenceServiceFactory';

// Switch to cloud inference
inferenceService.switchProvider('cloud');

// Make a request
const response = await inferenceService.chatCompletion({
  messages: [{ role: 'user', content: 'Hello!' }],
  max_tokens: 100
});`}
              </pre>
            </div>

            <div>
              <h3 className='font-medium mb-2'>Provider Management</h3>
              <pre className='bg-gray-800 p-3 rounded-lg text-sm overflow-x-auto'>
                {`import { cloudConfigService } from './services/cloudConfigService';

// Add a provider
await cloudConfigService.addProvider({
  id: 'my-openai',
  name: 'My OpenAI',
  type: 'openai',
  endpoint: 'https://api.openai.com',
  apiKey: 'sk-...',
  priority: 1,
  enabled: true
});

// Get all providers
const providers = cloudConfigService.getConfig().providers;`}
              </pre>
            </div>

            <div>
              <h3 className='font-medium mb-2'>Health Monitoring</h3>
              <pre className='bg-gray-800 p-3 rounded-lg text-sm overflow-x-auto'>
                {`// Get health status
const health = await inferenceService.getHealthStatus();

// Test specific provider
const isHealthy = await inferenceService.testProvider('cloud');`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
