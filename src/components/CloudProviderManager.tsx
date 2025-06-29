import React, { useState, useEffect, useCallback } from 'react';
import { 
  CloudArrowUpIcon, 
  TrashIcon, 
  PencilIcon, 
  PlayIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';
import type { 
  CloudProvider, 
  CloudInferenceConfig, 
  ProviderHealth 
} from '../services/cloudInferenceService';
import { cloudInferenceService } from '../services/cloudInferenceService';
import { cloudConfigService } from '../services/cloudConfigService';

interface CloudProviderManagerProps {
  onConfigChange?: (config: CloudInferenceConfig) => void;
}

export const CloudProviderManager: React.FC<CloudProviderManagerProps> = ({ 
  onConfigChange 
}) => {
  const [config, setConfig] = useState<CloudInferenceConfig>(cloudConfigService.getConfig());
  const [healthStatus, setHealthStatus] = useState<ProviderHealth[]>([]);
  const [isAddingProvider, setIsAddingProvider] = useState(false);
  const [editingProvider, setEditingProvider] = useState<CloudProvider | null>(null);
  const [testingProvider, setTestingProvider] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const loadConfig = useCallback(async () => {
    await cloudConfigService.loadConfigFromStorage();
    const newConfig = cloudConfigService.getConfig();
    setConfig(newConfig);
    onConfigChange?.(newConfig);
  }, [onConfigChange]);

  useEffect(() => {
    loadConfig();
    updateHealthStatus();
    const interval = setInterval(updateHealthStatus, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, [loadConfig]);

  const updateHealthStatus = () => {
    const health = cloudInferenceService.getHealthStatus();
    setHealthStatus(health);
  };

  const handleAddProvider = async (provider: CloudProvider) => {
    try {
      await cloudConfigService.addProvider(provider);
      await cloudInferenceService.addProvider(provider);
      await loadConfig();
      setIsAddingProvider(false);
    } catch (error) {
      console.error('Failed to add provider:', error);
    }
  };

  const handleRemoveProvider = async (providerId: string) => {
    try {
      await cloudConfigService.removeProvider(providerId);
      await cloudInferenceService.removeProvider(providerId);
      await loadConfig();
    } catch (error) {
      console.error('Failed to remove provider:', error);
    }
  };

  const handleUpdateProvider = async (providerId: string, updates: Partial<CloudProvider>) => {
    try {
      await cloudConfigService.updateProvider(providerId, updates);
      await loadConfig();
      setEditingProvider(null);
    } catch (error) {
      console.error('Failed to update provider:', error);
    }
  };

  const handleTestProvider = async (provider: CloudProvider) => {
    setTestingProvider(provider.id);
    try {
      const health = await cloudInferenceService.testProvider(provider);
      updateHealthStatus();
      return health;
    } catch (error) {
      console.error('Provider test failed:', error);
      throw error;
    } finally {
      setTestingProvider(null);
    }
  };

  const getHealthIcon = (providerId: string) => {
    const health = healthStatus.find(h => h.providerId === providerId);
    if (!health) return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />;
    
    if (health.isHealthy) {
      return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
    } else {
      return <XCircleIcon className="w-5 h-5 text-red-500" />;
    }
  };

  const getHealthText = (providerId: string) => {
    const health = healthStatus.find(h => h.providerId === providerId);
    if (!health) return 'Unknown';
    
    if (health.isHealthy) {
      return `${health.responseTime}ms`;
    } else {
      return health.error || 'Unhealthy';
    }
  };

  return (
    <div className="bg-gray-900 rounded-xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Cloud Inference Providers</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
            title="Advanced Settings"
          >
            <Cog6ToothIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => setIsAddingProvider(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
          >
            <CloudArrowUpIcon className="w-4 h-4" />
            <span>Add Provider</span>
          </button>
        </div>
      </div>

      {/* Advanced Settings */}
      {showAdvanced && (
        <div className="bg-gray-800 rounded-lg p-4 space-y-4">
          <h3 className="text-lg font-medium text-white">Advanced Configuration</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Load Balancing
              </label>
              <select
                value={config.loadBalancing}
                onChange={(e) => {
                  const newConfig = { ...config, loadBalancing: e.target.value as 'priority' | 'round-robin' | 'health-based' };
                  setConfig(newConfig);
                  cloudInferenceService.updateConfig(newConfig);
                }}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
              >
                <option value="priority">Priority-based</option>
                <option value="round-robin">Round-robin</option>
                <option value="health-based">Health-based</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Retry Attempts
              </label>
              <input
                type="number"
                value={config.retryAttempts}
                onChange={(e) => {
                  const newConfig = { ...config, retryAttempts: parseInt(e.target.value) };
                  setConfig(newConfig);
                  cloudInferenceService.updateConfig(newConfig);
                }}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                min="1"
                max="10"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Timeout (ms)
              </label>
              <input
                type="number"
                value={config.timeout}
                onChange={(e) => {
                  const newConfig = { ...config, timeout: parseInt(e.target.value) };
                  setConfig(newConfig);
                  cloudInferenceService.updateConfig(newConfig);
                }}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                min="5000"
                max="120000"
                step="1000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Health Check Interval (ms)
              </label>
              <input
                type="number"
                value={config.healthCheckInterval}
                onChange={(e) => {
                  const newConfig = { ...config, healthCheckInterval: parseInt(e.target.value) };
                  setConfig(newConfig);
                  cloudInferenceService.updateConfig(newConfig);
                }}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                min="10000"
                max="300000"
                step="5000"
              />
            </div>
          </div>
        </div>
      )}

      {/* Providers List */}
      <div className="space-y-4">
        {config.providers.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <CloudArrowUpIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No cloud providers configured</p>
            <p className="text-sm">Add a provider to start using cloud inference</p>
          </div>
        ) : (
          config.providers.map((provider) => (
            <div
              key={provider.id}
              className="bg-gray-800 rounded-lg p-4 border border-gray-700"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getHealthIcon(provider.id)}
                  <div>
                    <h3 className="text-white font-medium">{provider.name}</h3>
                    <p className="text-sm text-gray-400">
                      {provider.type} • {provider.endpoint}
                    </p>
                    <p className="text-xs text-gray-500">
                      Priority: {provider.priority} • Status: {getHealthText(provider.id)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleTestProvider(provider)}
                    disabled={testingProvider === provider.id}
                    className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all disabled:opacity-50"
                    title="Test Provider"
                  >
                    {testingProvider === provider.id ? (
                      <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <PlayIcon className="w-5 h-5" />
                    )}
                  </button>
                  <button
                    onClick={() => setEditingProvider(provider)}
                    className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                    title="Edit Provider"
                  >
                    <PencilIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleRemoveProvider(provider.id)}
                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                    title="Remove Provider"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Provider Modal */}
      {isAddingProvider && (
        <AddProviderModal
          onAdd={handleAddProvider}
          onCancel={() => setIsAddingProvider(false)}
        />
      )}

      {/* Edit Provider Modal */}
      {editingProvider && (
        <EditProviderModal
          provider={editingProvider}
          onUpdate={handleUpdateProvider}
          onCancel={() => setEditingProvider(null)}
        />
      )}
    </div>
  );
};

// Add Provider Modal Component
interface AddProviderModalProps {
  onAdd: (provider: CloudProvider) => void;
  onCancel: () => void;
}

const AddProviderModal: React.FC<AddProviderModalProps> = ({ onAdd, onCancel }) => {
  const [providerType, setProviderType] = useState<CloudProvider['type']>('openai');
  const [formData, setFormData] = useState<Partial<CloudProvider>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const template = cloudConfigService.getProviderTemplate(providerType);
    const provider: CloudProvider = {
      id: `provider-${Date.now()}`,
      name: formData.name || `${providerType.charAt(0).toUpperCase() + providerType.slice(1)} Provider`,
      type: providerType,
      endpoint: formData.endpoint || template.endpoint || '',
      apiKey: formData.apiKey,
      config: formData.config || template.config,
      priority: formData.priority || template.priority || 1,
      enabled: formData.enabled ?? true,
      healthCheck: formData.healthCheck || template.healthCheck
    };

    const errors = cloudConfigService.validateProvider(provider);
    if (errors.length > 0) {
      alert(`Validation errors:\n${errors.join('\n')}`);
      return;
    }

    onAdd(provider);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold text-white mb-4">Add Cloud Provider</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Provider Type
            </label>
            <select
              value={providerType}
              onChange={(e) => setProviderType(e.target.value as CloudProvider['type'])}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
            >
              <option value="openai">OpenAI</option>
              <option value="azure">Azure OpenAI</option>
              <option value="aws">AWS Bedrock</option>
              <option value="gcp">Google AI</option>
              <option value="custom">Custom Endpoint</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Name
            </label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
              placeholder="Provider Name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Endpoint
            </label>
            <input
              type="url"
              value={formData.endpoint || ''}
              onChange={(e) => setFormData({ ...formData, endpoint: e.target.value })}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
              placeholder="https://api.openai.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              API Key
            </label>
            <input
              type="password"
              value={formData.apiKey || ''}
              onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
              placeholder="sk-..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Priority
            </label>
            <input
              type="number"
              value={formData.priority || 1}
              onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
              min="1"
              max="10"
            />
          </div>
          <div className="flex items-center space-x-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-all"
            >
              Add Provider
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Edit Provider Modal Component
interface EditProviderModalProps {
  provider: CloudProvider;
  onUpdate: (providerId: string, updates: Partial<CloudProvider>) => void;
  onCancel: () => void;
}

const EditProviderModal: React.FC<EditProviderModalProps> = ({ provider, onUpdate, onCancel }) => {
  const [formData, setFormData] = useState<Partial<CloudProvider>>(provider);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(provider.id, formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold text-white mb-4">Edit Provider</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Name
            </label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Endpoint
            </label>
            <input
              type="url"
              value={formData.endpoint || ''}
              onChange={(e) => setFormData({ ...formData, endpoint: e.target.value })}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              API Key
            </label>
            <input
              type="password"
              value={formData.apiKey || ''}
              onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Priority
            </label>
            <input
              type="number"
              value={formData.priority || 1}
              onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
              min="1"
              max="10"
            />
          </div>
          <div className="flex items-center space-x-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-all"
            >
              Update Provider
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 