import type { CloudProviderAdapter, CloudProviderCapabilities } from '../types/cloudProvider';
import type { DeploymentConfig, DeploymentResult, Instance } from './CentralDeploymentController';
import { centralDeploymentController } from './CentralDeploymentController';

const VULTR_CAPABILITIES: CloudProviderCapabilities = {
  supportedInstanceTypes: ['mi325x', 'mi300x'],
  supportedRegions: ['ewr', 'lax', 'fra', 'sgp', 'nrt'],
  supportsBlueprints: true,
  supportsCustomModels: true,
  maxInstances: 6,
  features: ['Global Network', 'Container Deployment', 'API Integration', '99.99% Uptime SLA']
};

let mockInstances: Instance[] = [];

export const VultrCloudAdapter: CloudProviderAdapter = {
  async deployInstance(config: DeploymentConfig): Promise<DeploymentResult> {
    // Mock deployment logic
    const id = `vultr-${Date.now()}`;
    const instance: Instance = {
      id,
      name: `${config.instanceType}-${id}`,
      status: 'running',
      instanceType: config.instanceType,
      region: config.region,
      endpoint: `https://vultr.example.com/instance/${id}`,
      createdAt: new Date(),
      costPerHour: config.instanceType === 'mi325x' ? 3.20 : 2.80
    };
    mockInstances.push(instance);
    return {
      success: true,
      instanceId: id,
      endpoint: instance.endpoint,
      logs: ['Vultr instance deployed successfully.']
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
    return VULTR_CAPABILITIES;
  },
  getProviderInfo() {
    return {
      name: 'Vultr',
      description: 'Global cloud platform with AMD Instinct GPU instances and competitive pricing.',
      logo: '/assets/vultr-logo.svg',
      website: 'https://www.vultr.com/'
    };
  },
  validateConfig(config: DeploymentConfig) {
    const errors: string[] = [];
    if (!VULTR_CAPABILITIES.supportedInstanceTypes.includes(config.instanceType)) {
      errors.push('Unsupported instance type');
    }
    if (!VULTR_CAPABILITIES.supportedRegions.includes(config.region)) {
      errors.push('Unsupported region');
    }
    return { valid: errors.length === 0, errors };
  },
  getDefaultConfig() {
    return {
      instanceType: VULTR_CAPABILITIES.supportedInstanceTypes[0],
      region: VULTR_CAPABILITIES.supportedRegions[0]
    };
  }
};

// Register with the central controller
centralDeploymentController.registerProvider('vultr', VultrCloudAdapter); 