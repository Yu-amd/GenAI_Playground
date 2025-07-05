import React, { useEffect, useState } from 'react';
import { centralDeploymentController } from '../services/CentralDeploymentController';
import type { DeploymentConfig, DeploymentResult, Instance } from '../services/CentralDeploymentController';
import type { CloudProviderCapabilities } from '../types/cloudProvider';

interface DeployTabProps {
  providerId: string;
  customHeader?: React.ReactNode;
  customFooter?: React.ReactNode;
}

export const DeployTab: React.FC<DeployTabProps> = ({ providerId, customHeader, customFooter }) => {
  const [capabilities, setCapabilities] = useState<CloudProviderCapabilities | null>(null);
  const [instances, setInstances] = useState<Instance[]>([]);
  const [form, setForm] = useState<Partial<DeploymentConfig>>({ providerId });
  const [deploying, setDeploying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    setForm({ providerId });
    setError(null);
    setSuccess(null);
    // Fetch provider capabilities
    const caps = centralDeploymentController.getProviderCapabilities(providerId);
    setCapabilities(caps || null);
    // Fetch instances
    centralDeploymentController.getInstances(providerId).then(setInstances);
  }, [providerId]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDeploy = async () => {
    setDeploying(true);
    setError(null);
    setSuccess(null);
    const config: DeploymentConfig = {
      providerId,
      instanceType: form.instanceType || '',
      region: form.region || '',
      blueprint: form.blueprint,
      modelConfig: form.modelConfig,
      userConfig: form.userConfig
    };
    const validation = centralDeploymentController.validateDeploymentConfig(config);
    if (!validation.valid) {
      setError(validation.errors.join(', '));
      setDeploying(false);
      return;
    }
    try {
      const result: DeploymentResult = await centralDeploymentController.deployToProvider(config);
      if (result.success) {
        setSuccess('Deployment started successfully!');
        // Refresh instances
        setInstances(await centralDeploymentController.getInstances(providerId));
      } else {
        setError(result.error || 'Deployment failed');
      }
    } catch (err: any) {
      setError(err.message || 'Deployment error');
    } finally {
      setDeploying(false);
    }
  };

  return (
    <div className="space-y-6">
      {customHeader}
      
      <div className="bg-white/5 backdrop-blur-md border border-white/20 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Deploy Instance</h2>
        
        {capabilities ? (
          <form onSubmit={e => { e.preventDefault(); handleDeploy(); }} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Instance Type:</label>
              <select 
                name="instanceType" 
                value={form.instanceType || ''} 
                onChange={handleChange} 
                required
                className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select...</option>
                {capabilities.supportedInstanceTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Region:</label>
              <select 
                name="region" 
                value={form.region || ''} 
                onChange={handleChange} 
                required
                className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select...</option>
                {capabilities.supportedRegions.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>
            
            {capabilities.supportsBlueprints && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Blueprint:</label>
                <input 
                  name="blueprint" 
                  value={form.blueprint || ''} 
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Optional blueprint name"
                />
              </div>
            )}
            
            <button 
              type="submit" 
              disabled={deploying}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-medium py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {deploying ? 'Deploying...' : 'Deploy'}
            </button>
          </form>
        ) : (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading provider capabilities...</p>
          </div>
        )}
        
        {error && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-md">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}
        
        {success && (
          <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-md">
            <p className="text-green-400 text-sm">{success}</p>
          </div>
        )}
      </div>

      <div className="bg-white/5 backdrop-blur-md border border-white/20 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Current Instances</h3>
        {instances.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400 mb-2">No instances found.</p>
            <p className="text-sm text-gray-500">Deploy your first instance to get started.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {instances.map(inst => (
              <div key={inst.id} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-medium">{inst.name}</h4>
                    <p className="text-sm text-gray-400">
                      {inst.instanceType} • {inst.region} • {inst.status}
                    </p>
                    <p className="text-sm text-gray-400">
                      ${inst.costPerHour}/hr
                    </p>
                  </div>
                  {inst.endpoint && (
                    <div className="text-right">
                      <p className="text-xs text-gray-500 mb-1">Endpoint:</p>
                      <p className="text-xs text-blue-400 break-all">{inst.endpoint}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {customFooter}
    </div>
  );
}; 