import React, { useState, useEffect, useCallback } from 'react';
import { 
  FaPlay, 
  FaStop, 
  FaTrash, 
  FaChartLine, 
  FaDollarSign, 
  FaServer, 
  FaMemory,
  FaMicrochip
} from 'react-icons/fa';
import { gpuCloudService, type GPUInstance, type CloudProvider, type CostAnalysis } from '../services/gpuCloudService';

interface GPUCloudManagerProps {
  onInstanceChange?: (instances: GPUInstance[]) => void;
}

export const GPUCloudManager: React.FC<GPUCloudManagerProps> = ({
  onInstanceChange,
}) => {
  const [instances, setInstances] = useState<GPUInstance[]>([]);
  const [providers, setProviders] = useState<CloudProvider[]>([]);
  const [costAnalysis, setCostAnalysis] = useState<CostAnalysis | null>(null);


  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const instancesData = gpuCloudService.getInstances();
      const providersData = gpuCloudService.getProviders();
      const costData = gpuCloudService.getCostAnalysis();

      setInstances(instancesData);
      setProviders(providersData);
      setCostAnalysis(costData);
      onInstanceChange?.(instancesData);
    } catch (err) {
      setError('Failed to load GPU cloud data');
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  }, [onInstanceChange]);

  useEffect(() => {
    loadData();
    
    // Set up auto-refresh
    const interval = setInterval(loadData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [loadData]);



  const handleStartInstance = async (id: string) => {
    try {
      setLoading(true);
      await gpuCloudService.startInstance(id);
      await loadData();
    } catch (err) {
      setError(`Failed to start instance: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleStopInstance = async (id: string) => {
    try {
      setLoading(true);
      await gpuCloudService.stopInstance(id);
      await loadData();
    } catch (err) {
      setError(`Failed to stop instance: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteInstance = async (id: string) => {
    if (!confirm('Are you sure you want to delete this instance? This action cannot be undone.')) {
      return;
    }

    try {
      setLoading(true);
      await gpuCloudService.deleteInstance(id);
      await loadData();
    } catch (err) {
      setError(`Failed to delete instance: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: GPUInstance['status']) => {
    switch (status) {
      case 'running': return 'text-green-400';
      case 'stopped': return 'text-gray-400';
      case 'starting': return 'text-yellow-400';
      case 'stopping': return 'text-orange-400';
      case 'error': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: GPUInstance['status']) => {
    switch (status) {
      case 'running': return <div className="w-2 h-2 bg-green-400 rounded-full"></div>;
      case 'stopped': return <div className="w-2 h-2 bg-gray-400 rounded-full"></div>;
      case 'starting': return <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>;
      case 'stopping': return <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>;
      case 'error': return <div className="w-2 h-2 bg-red-400 rounded-full"></div>;
      default: return <div className="w-2 h-2 bg-gray-400 rounded-full"></div>;
    }
  };

  if (loading && instances.length === 0) {
    return (
      <div className="bg-gray-900 rounded-xl p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-300">Loading GPU instances...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-xl p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">GPU Cloud Management</h2>
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

      {/* Cost Summary */}
      {costAnalysis && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Cost</p>
                <p className="text-2xl font-bold text-white">${costAnalysis.totalCost.toFixed(2)}</p>
              </div>
              <FaDollarSign className="w-6 h-6 text-green-400" />
            </div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Monthly Projection</p>
                <p className="text-2xl font-bold text-white">${costAnalysis.projectedMonthlyCost.toFixed(2)}</p>
              </div>
              <FaChartLine className="w-6 h-6 text-blue-400" />
            </div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Active Instances</p>
                <p className="text-2xl font-bold text-white">
                  {instances.filter(i => i.status === 'running').length}
                </p>
              </div>
              <FaServer className="w-6 h-6 text-purple-400" />
            </div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Instances</p>
                <p className="text-2xl font-bold text-white">{instances.length}</p>
              </div>
              <FaMicrochip className="w-6 h-6 text-yellow-400" />
            </div>
          </div>
        </div>
      )}

      {/* Instances List */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white">GPU Instances</h3>
        
        {instances.length === 0 ? (
          <div className="text-center py-12">
            <FaServer className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 mb-4">No GPU instances found</p>
            <p className="text-sm text-gray-500">Use the Deploy Instances tab to create new GPU instances</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {instances.map((instance) => (
              <div
                key={instance.id}
                className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-lg font-semibold text-white">{instance.name}</h4>
                    <p className="text-sm text-gray-400">{instance.provider} • {instance.gpuType}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(instance.status)}
                    <span className={`text-sm font-medium ${getStatusColor(instance.status)}`}>
                      {instance.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-400">Region</p>
                    <p className="text-sm text-white">{instance.region}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Cost/Hour</p>
                    <p className="text-sm text-green-400">${instance.costPerHour}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Total Cost</p>
                    <p className="text-sm text-white">${instance.totalCost.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Runtime</p>
                    <p className="text-sm text-white">{instance.totalRuntime.toFixed(1)}h</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                  <div className="flex items-center text-gray-400">
                    <FaMemory className="w-3 h-3 mr-1" />
                    {instance.specs.vram}
                  </div>
                  <div className="flex items-center text-gray-400">
                    <FaMicrochip className="w-3 h-3 mr-1" />
                    {instance.specs.computeUnits} CU
                  </div>
                </div>

                <div className="flex space-x-2">
                  {instance.status === 'stopped' && (
                    <button
                      onClick={() => handleStartInstance(instance.id)}
                      disabled={loading}
                      className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition-colors disabled:opacity-50"
                    >
                      <FaPlay className="w-3 h-3" />
                      <span>Start</span>
                    </button>
                  )}
                  {instance.status === 'running' && (
                    <button
                      onClick={() => handleStopInstance(instance.id)}
                      disabled={loading}
                      className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded text-sm transition-colors disabled:opacity-50"
                    >
                      <FaStop className="w-3 h-3" />
                      <span>Stop</span>
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteInstance(instance.id)}
                    disabled={loading}
                    className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors disabled:opacity-50"
                  >
                    <FaTrash className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}; 