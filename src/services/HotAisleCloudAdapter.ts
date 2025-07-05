import type { CloudProviderAdapter, CloudProviderCapabilities } from '../types/cloudProvider';
import type { DeploymentConfig, DeploymentResult, Instance } from './CentralDeploymentController';
import { centralDeploymentController } from './CentralDeploymentController';

const HOT_AISLE_CAPABILITIES: CloudProviderCapabilities = {
  supportedInstanceTypes: ['mi300x', 'mi250x'],
  supportedRegions: ['us-east', 'us-west', 'eu-west'],
  supportsBlueprints: true,
  supportsCustomModels: true,
  maxInstances: 4,
  features: ['Bare Metal Provisioning', 'Direct Hardware Access', 'Custom Configurations', 'High Performance']
};

let mockInstances: Instance[] = [];

export const HotAisleCloudAdapter: CloudProviderAdapter = {
  async deployInstance(config: DeploymentConfig): Promise<DeploymentResult> {
    // Mock deployment logic
    const id = `hotaisle-${Date.now()}`;
    const instance: Instance = {
      id,
      name: `${config.instanceType}-${id}`,
      status: 'running',
      instanceType: config.instanceType,
      region: config.region,
      endpoint: `https://hotaisle.example.com/instance/${id}`,
      createdAt: new Date(),
      costPerHour: config.instanceType === 'mi300x' ? 2.90 : 2.00
    };
    mockInstances.push(instance);
    return {
      success: true,
      instanceId: id,
      endpoint: instance.endpoint,
      logs: ['Hot Aisle instance deployed successfully.']
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
    return HOT_AISLE_CAPABILITIES;
  },
  getProviderInfo() {
    return {
      name: 'Hot Aisle',
      description: 'Bare metal cloud provider with direct AMD GPU hardware access.',
      logo: '/assets/hotaisle-logo.svg',
      website: 'https://www.hotaisle.com/'
    };
  },
  validateConfig(config: DeploymentConfig) {
    const errors: string[] = [];
    if (!HOT_AISLE_CAPABILITIES.supportedInstanceTypes.includes(config.instanceType)) {
      errors.push('Unsupported instance type');
    }
    if (!HOT_AISLE_CAPABILITIES.supportedRegions.includes(config.region)) {
      errors.push('Unsupported region');
    }
    return { valid: errors.length === 0, errors };
  },
  getDefaultConfig() {
    return {
      instanceType: HOT_AISLE_CAPABILITIES.supportedInstanceTypes[0],
      region: HOT_AISLE_CAPABILITIES.supportedRegions[0]
    };
  }
};

// Register with the central controller
centralDeploymentController.registerProvider('hot-aisle', HotAisleCloudAdapter); 