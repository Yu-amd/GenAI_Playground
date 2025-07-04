import React, { useState, useEffect, useCallback } from 'react';
import { 
  FaRocket, 
  FaStop, 
  FaTrash, 
  FaServer, 
  FaCheckCircle,
  FaExclamationTriangle,
  FaClock,
  FaDollarSign
} from 'react-icons/fa';
import { gpuCloudService, type GPUInstance } from '../services/gpuCloudService';

// Types for model deployments
export interface ModelDeployment {
  id: string;
  name: string;
  modelId: string;
  instanceId: string;
  provider: string;
  status: 'deploying' | 'running' | 'failed' | 'stopped';
  endpoint?: string;
  healthStatus: 'healthy' | 'unhealthy' | 'unknown';
  lastHealthCheck?: Date;
  createdAt: Date;
  config: {
    modelType: 'llm' | 'embedding' | 'vision' | 'multimodal';
    framework: 'transformers' | 'tensorflow' | 'pytorch' | 'onnx';
    quantization: 'none' | 'int8' | 'int4' | 'fp16';
    maxConcurrentRequests: number;
    autoScaling: boolean;
    minReplicas: number;
    maxReplicas: number;
  };
  metrics: {
    requestsPerMinute: number;
    averageResponseTime: number;
    gpuUtilization: number;
    memoryUtilization: number;
    errorRate: number;
  };
  costPerHour: number;
  totalCost: number;
}

export interface BlueprintDeployment {
  id: string;
  name: string;
  blueprintId: string;
  instanceId: string;
  provider: string;
  status: 'deploying' | 'running' | 'failed' | 'stopped';
  endpoint?: string;
  healthStatus: 'healthy' | 'unhealthy' | 'unknown';
  lastHealthCheck?: Date;
  createdAt: Date;
  config: {
    blueprintType: 'chatqna' | 'codetrans' | 'docsum' | 'custom';
    components: string[];
    dependencies: string[];
    environment: Record<string, string>;
  };
  metrics: {
    requestsPerMinute: number;
    averageResponseTime: number;
    gpuUtilization: number;
    memoryUtilization: number;
    errorRate: number;
  };
  costPerHour: number;
  totalCost: number;
}

interface ModelDeploymentManagerProps {
  onDeploymentChange?: (deployments: (ModelDeployment | BlueprintDeployment)[]) => void;
}

export const ModelDeploymentManager: React.FC<ModelDeploymentManagerProps> = ({
  onDeploymentChange,
}) => {
  const [modelDeployments, setModelDeployments] = useState<ModelDeployment[]>([]);
  const [blueprintDeployments, setBlueprintDeployments] = useState<BlueprintDeployment[]>([]);
  const [instances, setInstances] = useState<GPUInstance[]>([]);
  const [isDeploying, setIsDeploying] = useState(false);
  const [selectedDeployment, setSelectedDeployment] = useState<{ type: 'model' | 'blueprint' } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const instancesData = gpuCloudService.getInstances();
      setInstances(instancesData);
      
      // Load deployments from localStorage
      const savedModelDeployments = localStorage.getItem('model-deployments');
      const savedBlueprintDeployments = localStorage.getItem('blueprint-deployments');
      
      if (savedModelDeployments) {
        const deployments = JSON.parse(savedModelDeployments).map((d: any) => ({
          ...d,
          createdAt: new Date(d.createdAt),
          lastHealthCheck: d.lastHealthCheck ? new Date(d.lastHealthCheck) : undefined,
        }));
        setModelDeployments(deployments);
      }
      
      if (savedBlueprintDeployments) {
        const deployments = JSON.parse(savedBlueprintDeployments).map((d: any) => ({
          ...d,
          createdAt: new Date(d.createdAt),
          lastHealthCheck: d.lastHealthCheck ? new Date(d.lastHealthCheck) : undefined,
        }));
        setBlueprintDeployments(deployments);
      }
      
      onDeploymentChange?.([...modelDeployments, ...blueprintDeployments]);
    } catch (err) {
      setError('Failed to load deployment data');
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  }, [onDeploymentChange, modelDeployments, blueprintDeployments]);

  useEffect(() => {
    loadData();
    
    // Set up auto-refresh
    const interval = setInterval(loadData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [loadData]);

  const saveModelDeployments = (deployments: ModelDeployment[]) => {
    localStorage.setItem('model-deployments', JSON.stringify(deployments));
  };

  const saveBlueprintDeployments = (deployments: BlueprintDeployment[]) => {
    localStorage.setItem('blueprint-deployments', JSON.stringify(deployments));
  };

  const handleDeployModel = async (config: {
    name: string;
    modelId: string;
    instanceId: string;
    modelType: ModelDeployment['config']['modelType'];
    framework: ModelDeployment['config']['framework'];
    quantization: ModelDeployment['config']['quantization'];
    maxConcurrentRequests: number;
    autoScaling: boolean;
    minReplicas: number;
    maxReplicas: number;
  }) => {
    try {
      setLoading(true);
      setIsDeploying(true);
      
      const instance = instances.find(i => i.id === config.instanceId);
      if (!instance) {
        throw new Error('Instance not found');
      }

      const deployment: ModelDeployment = {
        id: `model-deployment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: config.name,
        modelId: config.modelId,
        instanceId: config.instanceId,
        provider: instance.provider,
        status: 'deploying',
        healthStatus: 'unknown',
        createdAt: new Date(),
        config: {
          modelType: config.modelType,
          framework: config.framework,
          quantization: config.quantization,
          maxConcurrentRequests: config.maxConcurrentRequests,
          autoScaling: config.autoScaling,
          minReplicas: config.minReplicas,
          maxReplicas: config.maxReplicas,
        },
        metrics: {
          requestsPerMinute: 0,
          averageResponseTime: 0,
          gpuUtilization: 0,
          memoryUtilization: 0,
          errorRate: 0,
        },
        costPerHour: instance.costPerHour * 1.2, // 20% overhead for deployment
        totalCost: 0,
      };

      const newDeployments = [...modelDeployments, deployment];
      setModelDeployments(newDeployments);
      saveModelDeployments(newDeployments);

      // Simulate deployment process
      setTimeout(() => {
        deployment.status = 'running';
        deployment.endpoint = `https://${deployment.id}.${instance.provider}.cloud`;
        deployment.healthStatus = 'healthy';
        deployment.lastHealthCheck = new Date();
        
        setModelDeployments([...newDeployments]);
        saveModelDeployments([...newDeployments]);
        setIsDeploying(false);
      }, 10000);

    } catch (err) {
      setError(`Failed to deploy model: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setIsDeploying(false);
    } finally {
      setLoading(false);
    }
  };

  const handleDeployBlueprint = async (config: {
    name: string;
    blueprintId: string;
    instanceId: string;
    blueprintType: BlueprintDeployment['config']['blueprintType'];
    components: string[];
    dependencies: string[];
    environment: Record<string, string>;
  }) => {
    try {
      setLoading(true);
      setIsDeploying(true);
      
      const instance = instances.find(i => i.id === config.instanceId);
      if (!instance) {
        throw new Error('Instance not found');
      }

      const deployment: BlueprintDeployment = {
        id: `blueprint-deployment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: config.name,
        blueprintId: config.blueprintId,
        instanceId: config.instanceId,
        provider: instance.provider,
        status: 'deploying',
        healthStatus: 'unknown',
        createdAt: new Date(),
        config: {
          blueprintType: config.blueprintType,
          components: config.components,
          dependencies: config.dependencies,
          environment: config.environment,
        },
        metrics: {
          requestsPerMinute: 0,
          averageResponseTime: 0,
          gpuUtilization: 0,
          memoryUtilization: 0,
          errorRate: 0,
        },
        costPerHour: instance.costPerHour * 1.5, // 50% overhead for blueprint deployment
        totalCost: 0,
      };

      const newDeployments = [...blueprintDeployments, deployment];
      setBlueprintDeployments(newDeployments);
      saveBlueprintDeployments(newDeployments);

      // Simulate deployment process
      setTimeout(() => {
        deployment.status = 'running';
        deployment.endpoint = `https://${deployment.id}.${instance.provider}.cloud`;
        deployment.healthStatus = 'healthy';
        deployment.lastHealthCheck = new Date();
        
        setBlueprintDeployments([...newDeployments]);
        saveBlueprintDeployments([...newDeployments]);
        setIsDeploying(false);
      }, 15000);

    } catch (err) {
      setError(`Failed to deploy blueprint: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setIsDeploying(false);
    } finally {
      setLoading(false);
    }
  };

  const handleStopDeployment = async (id: string, type: 'model' | 'blueprint') => {
    try {
      setLoading(true);
      
      if (type === 'model') {
        const newDeployments = modelDeployments.map(d => 
          d.id === id ? { ...d, status: 'stopped' as const } : d
        );
        setModelDeployments(newDeployments);
        saveModelDeployments(newDeployments);
      } else {
        const newDeployments = blueprintDeployments.map(d => 
          d.id === id ? { ...d, status: 'stopped' as const } : d
        );
        setBlueprintDeployments(newDeployments);
        saveBlueprintDeployments(newDeployments);
      }
    } catch (err) {
      setError(`Failed to stop deployment: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDeployment = async (id: string, type: 'model' | 'blueprint') => {
    if (!confirm('Are you sure you want to delete this deployment? This action cannot be undone.')) {
      return;
    }

    try {
      setLoading(true);
      
      if (type === 'model') {
        const newDeployments = modelDeployments.filter(d => d.id !== id);
        setModelDeployments(newDeployments);
        saveModelDeployments(newDeployments);
      } else {
        const newDeployments = blueprintDeployments.filter(d => d.id !== id);
        setBlueprintDeployments(newDeployments);
        saveBlueprintDeployments(newDeployments);
      }
    } catch (err) {
      setError(`Failed to delete deployment: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'text-green-400';
      case 'deploying': return 'text-yellow-400';
      case 'stopped': return 'text-gray-400';
      case 'failed': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getHealthIcon = (health: string) => {
    switch (health) {
      case 'healthy': return <FaCheckCircle className="w-4 h-4 text-green-400" />;
      case 'unhealthy': return <FaExclamationTriangle className="w-4 h-4 text-red-400" />;
      default: return <FaClock className="w-4 h-4 text-yellow-400" />;
    }
  };

  if (loading && modelDeployments.length === 0 && blueprintDeployments.length === 0) {
    return (
      <div className="bg-gray-900 rounded-xl p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-300">Loading deployments...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-xl p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Model & Blueprint Deployments</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setSelectedDeployment({ type: 'model' } as any)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
          >
            <FaRocket className="w-4 h-4" />
            <span>Deploy Model</span>
          </button>
          <button
            onClick={() => setSelectedDeployment({ type: 'blueprint' } as any)}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all"
          >
            <FaServer className="w-4 h-4" />
            <span>Deploy Blueprint</span>
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4">
          <p className="text-red-400">{error}</p>
          <button
            onClick={() => setError(null)}
            className="mt-2 text-sm text-red-300 hover:text-red-200"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Deployment Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-800/50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Model Deployments</p>
              <p className="text-2xl font-bold text-white">{modelDeployments.length}</p>
            </div>
            <FaRocket className="w-6 h-6 text-blue-400" />
          </div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Blueprint Deployments</p>
              <p className="text-2xl font-bold text-white">{blueprintDeployments.length}</p>
            </div>
            <FaServer className="w-6 h-6 text-green-400" />
          </div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Running</p>
              <p className="text-2xl font-bold text-white">
                {[...modelDeployments, ...blueprintDeployments].filter(d => d.status === 'running').length}
              </p>
            </div>
            <FaCheckCircle className="w-6 h-6 text-green-400" />
          </div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Cost</p>
              <p className="text-2xl font-bold text-white">
                ${([...modelDeployments, ...blueprintDeployments].reduce((sum, d) => sum + d.totalCost, 0)).toFixed(2)}
              </p>
            </div>
            <FaDollarSign className="w-6 h-6 text-yellow-400" />
          </div>
        </div>
      </div>

      {/* Model Deployments */}
      {modelDeployments.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-white">Model Deployments</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {modelDeployments.map((deployment) => (
              <div
                key={deployment.id}
                className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-lg font-semibold text-white">{deployment.name}</h4>
                    <p className="text-sm text-gray-400">{deployment.modelId} • {deployment.provider}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getHealthIcon(deployment.healthStatus)}
                    <span className={`text-sm font-medium ${getStatusColor(deployment.status)}`}>
                      {deployment.status}
                    </span>
                  </div>
                </div>

                {deployment.endpoint && (
                  <div className="mb-3">
                    <p className="text-xs text-gray-400">Endpoint</p>
                    <p className="text-sm text-blue-400 font-mono">{deployment.endpoint}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-400">Framework</p>
                    <p className="text-sm text-white">{deployment.config.framework}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Quantization</p>
                    <p className="text-sm text-white">{deployment.config.quantization}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Cost/Hour</p>
                    <p className="text-sm text-green-400">${deployment.costPerHour}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Total Cost</p>
                    <p className="text-sm text-white">${deployment.totalCost.toFixed(2)}</p>
                  </div>
                </div>

                <div className="flex space-x-2">
                  {deployment.status === 'running' && (
                    <button
                      onClick={() => handleStopDeployment(deployment.id, 'model')}
                      disabled={loading}
                      className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded text-sm transition-colors disabled:opacity-50"
                    >
                      <FaStop className="w-3 h-3" />
                      <span>Stop</span>
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteDeployment(deployment.id, 'model')}
                    disabled={loading}
                    className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors disabled:opacity-50"
                  >
                    <FaTrash className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Blueprint Deployments */}
      {blueprintDeployments.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-white">Blueprint Deployments</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {blueprintDeployments.map((deployment) => (
              <div
                key={deployment.id}
                className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-lg font-semibold text-white">{deployment.name}</h4>
                    <p className="text-sm text-gray-400">{deployment.blueprintId} • {deployment.provider}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getHealthIcon(deployment.healthStatus)}
                    <span className={`text-sm font-medium ${getStatusColor(deployment.status)}`}>
                      {deployment.status}
                    </span>
                  </div>
                </div>

                {deployment.endpoint && (
                  <div className="mb-3">
                    <p className="text-xs text-gray-400">Endpoint</p>
                    <p className="text-sm text-blue-400 font-mono">{deployment.endpoint}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-400">Type</p>
                    <p className="text-sm text-white">{deployment.config.blueprintType}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Components</p>
                    <p className="text-sm text-white">{deployment.config.components.length}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Cost/Hour</p>
                    <p className="text-sm text-green-400">${deployment.costPerHour}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Total Cost</p>
                    <p className="text-sm text-white">${deployment.totalCost.toFixed(2)}</p>
                  </div>
                </div>

                <div className="flex space-x-2">
                  {deployment.status === 'running' && (
                    <button
                      onClick={() => handleStopDeployment(deployment.id, 'blueprint')}
                      disabled={loading}
                      className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded text-sm transition-colors disabled:opacity-50"
                    >
                      <FaStop className="w-3 h-3" />
                      <span>Stop</span>
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteDeployment(deployment.id, 'blueprint')}
                    disabled={loading}
                    className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors disabled:opacity-50"
                  >
                    <FaTrash className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {modelDeployments.length === 0 && blueprintDeployments.length === 0 && (
        <div className="text-center py-12">
          <FaRocket className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 mb-4">No deployments found</p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setSelectedDeployment({ type: 'model' } as any)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
            >
              Deploy Your First Model
            </button>
            <button
              onClick={() => setSelectedDeployment({ type: 'blueprint' } as any)}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all"
            >
              Deploy Your First Blueprint
            </button>
          </div>
        </div>
      )}

      {/* Deployment Modals */}
      {selectedDeployment && (
        <DeploymentModal
          type={selectedDeployment.type as 'model' | 'blueprint'}
          instances={instances}
          onDeployModel={handleDeployModel}
          onDeployBlueprint={handleDeployBlueprint}
          onCancel={() => setSelectedDeployment(null)}
          isDeploying={isDeploying}
        />
      )}
    </div>
  );
};

// Deployment Modal Component
interface DeploymentModalProps {
  type: 'model' | 'blueprint';
  instances: GPUInstance[];
  onDeployModel: (config: any) => void;
  onDeployBlueprint: (config: any) => void;
  onCancel: () => void;
  isDeploying: boolean;
}

const DeploymentModal: React.FC<DeploymentModalProps> = ({
  type,
  instances,
  onDeployModel,
  onDeployBlueprint,
  onCancel,
  isDeploying,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    modelId: '',
    blueprintId: '',
    instanceId: '',
    modelType: 'llm' as const,
    framework: 'transformers' as const,
    quantization: 'none' as const,
    maxConcurrentRequests: 10,
    autoScaling: true,
    minReplicas: 1,
    maxReplicas: 3,
    blueprintType: 'chatqna' as const,
    components: [] as string[],
    dependencies: [] as string[],
    environment: {} as Record<string, string>,
  });

  const availableInstances = instances.filter(i => i.status === 'running');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (type === 'model') {
      onDeployModel({
        name: formData.name,
        modelId: formData.modelId,
        instanceId: formData.instanceId,
        modelType: formData.modelType,
        framework: formData.framework,
        quantization: formData.quantization,
        maxConcurrentRequests: formData.maxConcurrentRequests,
        autoScaling: formData.autoScaling,
        minReplicas: formData.minReplicas,
        maxReplicas: formData.maxReplicas,
      });
    } else {
      onDeployBlueprint({
        name: formData.name,
        blueprintId: formData.blueprintId,
        instanceId: formData.instanceId,
        blueprintType: formData.blueprintType,
        components: formData.components,
        dependencies: formData.dependencies,
        environment: formData.environment,
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold text-white mb-4">
          Deploy {type === 'model' ? 'Model' : 'Blueprint'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Deployment Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
              placeholder={`my-${type}-deployment`}
              required
            />
          </div>

          {type === 'model' ? (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Model ID
              </label>
              <input
                type="text"
                value={formData.modelId}
                onChange={(e) => setFormData({ ...formData, modelId: e.target.value })}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                placeholder="llama-2-7b-chat"
                required
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Blueprint ID
              </label>
              <input
                type="text"
                value={formData.blueprintId}
                onChange={(e) => setFormData({ ...formData, blueprintId: e.target.value })}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                placeholder="chatqna-blueprint"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              GPU Instance
            </label>
            <select
              value={formData.instanceId}
              onChange={(e) => setFormData({ ...formData, instanceId: e.target.value })}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
              required
            >
              <option value="">Select Running Instance</option>
              {availableInstances.map((instance) => (
                <option key={instance.id} value={instance.id}>
                  {instance.name} ({instance.gpuType} - {instance.provider})
                </option>
              ))}
            </select>
          </div>

          {type === 'model' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Model Type
                  </label>
                  <select
                    value={formData.modelType}
                    onChange={(e) => setFormData({ ...formData, modelType: e.target.value as any })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="llm">LLM</option>
                    <option value="embedding">Embedding</option>
                    <option value="vision">Vision</option>
                    <option value="multimodal">Multimodal</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Framework
                  </label>
                  <select
                    value={formData.framework}
                    onChange={(e) => setFormData({ ...formData, framework: e.target.value as any })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="transformers">Transformers</option>
                    <option value="tensorflow">TensorFlow</option>
                    <option value="pytorch">PyTorch</option>
                    <option value="onnx">ONNX</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Quantization
                  </label>
                  <select
                    value={formData.quantization}
                    onChange={(e) => setFormData({ ...formData, quantization: e.target.value as any })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="none">None</option>
                    <option value="fp16">FP16</option>
                    <option value="int8">INT8</option>
                    <option value="int4">INT4</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Max Concurrent Requests
                  </label>
                  <input
                    type="number"
                    value={formData.maxConcurrentRequests}
                    onChange={(e) => setFormData({ ...formData, maxConcurrentRequests: parseInt(e.target.value) })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    min="1"
                    max="100"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.autoScaling}
                    onChange={(e) => setFormData({ ...formData, autoScaling: e.target.checked })}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-300">Auto Scaling</span>
                </label>
              </div>

              {formData.autoScaling && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Min Replicas
                    </label>
                    <input
                      type="number"
                      value={formData.minReplicas}
                      onChange={(e) => setFormData({ ...formData, minReplicas: parseInt(e.target.value) })}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                      min="1"
                      max="10"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Max Replicas
                    </label>
                    <input
                      type="number"
                      value={formData.maxReplicas}
                      onChange={(e) => setFormData({ ...formData, maxReplicas: parseInt(e.target.value) })}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                      min="1"
                      max="20"
                    />
                  </div>
                </div>
              )}
            </>
          )}

          {type === 'blueprint' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Blueprint Type
              </label>
              <select
                value={formData.blueprintType}
                onChange={(e) => setFormData({ ...formData, blueprintType: e.target.value as any })}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
              >
                <option value="chatqna">ChatQnA</option>
                <option value="codetrans">CodeTrans</option>
                <option value="docsum">DocSum</option>
                <option value="custom">Custom</option>
              </select>
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isDeploying}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {isDeploying ? 'Deploying...' : `Deploy ${type === 'model' ? 'Model' : 'Blueprint'}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 