import type { CloudProviderAdapter, CloudProviderCapabilities } from '../types/cloudProvider';
import type { DeploymentConfig, DeploymentResult, Instance } from './CentralDeploymentController';
import { centralDeploymentController } from './CentralDeploymentController';

const AMD_CAPABILITIES: CloudProviderCapabilities = {
  supportedInstanceTypes: ['mi300x', 'mi250x'],
  supportedRegions: ['us-west', 'us-east', 'eu-central'],
  supportsBlueprints: true,
  supportsCustomModels: true,
  maxInstances: 5,
  features: ['ROCm', 'High Bandwidth Memory', 'AI-optimized']
};

let mockInstances: Instance[] = [];

export const AmdDeveloperCloudAdapter: CloudProviderAdapter = {
  async deployInstance(config: DeploymentConfig): Promise<DeploymentResult> {
    // Mock deployment logic
    const id = `amd-${Date.now()}`;
    const instance: Instance = {
      id,
      name: `${config.instanceType}-${id}`,
      status: 'running',
      instanceType: config.instanceType,
      region: config.region,
      endpoint: `https://amdcloud.example.com/instance/${id}`,
      createdAt: new Date(),
      costPerHour: 2.5
    };
    mockInstances.push(instance);
    return {
      success: true,
      instanceId: id,
      endpoint: instance.endpoint,
      logs: ['Instance deployed successfully.']
    };
  },
  async getInstances(): Promise<Instance[]> {
    // Return mock instances
    return mockInstances;
  },
  async deleteInstance(instanceId: string): Promise<boolean> {
    const before = mockInstances.length;
    mockInstances = mockInstances.filter(inst => inst.id !== instanceId);
    return mockInstances.length < before;
  },
  getCapabilities(): CloudProviderCapabilities {
    return AMD_CAPABILITIES;
  },
  getProviderInfo() {
    return {
      name: 'AMD Developer Cloud',
      description: 'High-performance AMD GPU cloud for AI workloads.',
      logo: '/assets/amd-logo.svg',
      website: 'https://developer.amd.com/cloud/'
    };
  },
  validateConfig(config: DeploymentConfig) {
    const errors: string[] = [];
    if (!AMD_CAPABILITIES.supportedInstanceTypes.includes(config.instanceType)) {
      errors.push('Unsupported instance type');
    }
    if (!AMD_CAPABILITIES.supportedRegions.includes(config.region)) {
      errors.push('Unsupported region');
    }
    return { valid: errors.length === 0, errors };
  },
  getDefaultConfig() {
    return {
      instanceType: AMD_CAPABILITIES.supportedInstanceTypes[0],
      region: AMD_CAPABILITIES.supportedRegions[0]
    };
  }
};

// Register with the central controller
centralDeploymentController.registerProvider('amd-developer-cloud', AmdDeveloperCloudAdapter); 