import type { CloudProviderAdapter, CloudProviderCapabilities } from '../types/cloudProvider';
import type { DeploymentConfig, DeploymentResult, Instance } from './CentralDeploymentController';
import { centralDeploymentController } from './CentralDeploymentController';

const TENSORWAVE_CAPABILITIES: CloudProviderCapabilities = {
  supportedInstanceTypes: ['mi300x', 'mi250x'],
  supportedRegions: ['us-east', 'us-west', 'eu-central'],
  supportsBlueprints: true,
  supportsCustomModels: true,
  maxInstances: 5,
  features: ['AI-Optimized Infrastructure', 'Model Optimization', 'Auto-Scaling', 'Performance Monitoring']
};

let mockInstances: Instance[] = [];

export const TensorWaveCloudAdapter: CloudProviderAdapter = {
  async deployInstance(config: DeploymentConfig): Promise<DeploymentResult> {
    // Mock deployment logic
    const id = `tensorwave-${Date.now()}`;
    const instance: Instance = {
      id,
      name: `${config.instanceType}-${id}`,
      status: 'running',
      instanceType: config.instanceType,
      region: config.region,
      endpoint: `https://tensorwave.example.com/instance/${id}`,
      createdAt: new Date(),
      costPerHour: config.instanceType === 'mi300x' ? 3.10 : 2.30
    };
    mockInstances.push(instance);
    return {
      success: true,
      instanceId: id,
      endpoint: instance.endpoint,
      logs: ['TensorWave instance deployed successfully.']
    };
  },
  async getInstances(): Promise<Instance[]> {
    return mockInstances;
  },
  async deleteInstance(instanceId: string): Promise<boolean> {
    const before = mockInstances.length;
    mockInstances = mockInstances.filter(inst => inst.id !== instanceId);
    return mockInstances.length < before;
  },
  getCapabilities(): CloudProviderCapabilities {
    return TENSORWAVE_CAPABILITIES;
  },
  getProviderInfo() {
    return {
      name: 'TensorWave',
      description: 'AI-optimized cloud platform with specialized AMD GPU infrastructure.',
      logo: '/assets/tensorwave-logo.svg',
      website: 'https://www.tensorwave.com/'
    };
  },
  validateConfig(config: DeploymentConfig) {
    const errors: string[] = [];
    if (!TENSORWAVE_CAPABILITIES.supportedInstanceTypes.includes(config.instanceType)) {
      errors.push('Unsupported instance type');
    }
    if (!TENSORWAVE_CAPABILITIES.supportedRegions.includes(config.region)) {
      errors.push('Unsupported region');
    }
    return { valid: errors.length === 0, errors };
  },
  getDefaultConfig() {
    return {
      instanceType: TENSORWAVE_CAPABILITIES.supportedInstanceTypes[0],
      region: TENSORWAVE_CAPABILITIES.supportedRegions[0]
    };
  }
};

// Register with the central controller
centralDeploymentController.registerProvider('tensorwave', TensorWaveCloudAdapter); 