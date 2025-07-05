import type { CloudProviderAdapter, CloudProviderCapabilities } from '../types/cloudProvider';
import type { DeploymentConfig, DeploymentResult, Instance } from './CentralDeploymentController';
import { centralDeploymentController } from './CentralDeploymentController';

const AZURE_CAPABILITIES: CloudProviderCapabilities = {
  supportedInstanceTypes: ['mi250', 'mi210'],
  supportedRegions: ['eastus', 'westus2', 'westeurope', 'southeastasia'],
  supportsBlueprints: true,
  supportsCustomModels: true,
  maxInstances: 8,
  features: ['Azure ML Integration', 'DevOps & CI/CD', 'Enterprise Features', 'Global Network']
};

let mockInstances: Instance[] = [];

export const AzureCloudAdapter: CloudProviderAdapter = {
  async deployInstance(config: DeploymentConfig): Promise<DeploymentResult> {
    // Mock deployment logic
    const id = `azure-${Date.now()}`;
    const instance: Instance = {
      id,
      name: `${config.instanceType}-${id}`,
      status: 'running',
      instanceType: config.instanceType,
      region: config.region,
      endpoint: `https://azure.example.com/instance/${id}`,
      createdAt: new Date(),
      costPerHour: config.instanceType === 'mi250' ? 2.10 : 1.60
    };
    mockInstances.push(instance);
    return {
      success: true,
      instanceId: id,
      endpoint: instance.endpoint,
      logs: ['Azure instance deployed successfully.']
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
    return AZURE_CAPABILITIES;
  },
  getProviderInfo() {
    return {
      name: 'Microsoft Azure',
      description: 'Enterprise cloud platform with AMD Instinct GPU instances and Azure ML integration.',
      logo: '/assets/azure-logo.svg',
      website: 'https://azure.microsoft.com/'
    };
  },
  validateConfig(config: DeploymentConfig) {
    const errors: string[] = [];
    if (!AZURE_CAPABILITIES.supportedInstanceTypes.includes(config.instanceType)) {
      errors.push('Unsupported instance type');
    }
    if (!AZURE_CAPABILITIES.supportedRegions.includes(config.region)) {
      errors.push('Unsupported region');
    }
    return { valid: errors.length === 0, errors };
  },
  getDefaultConfig() {
    return {
      instanceType: AZURE_CAPABILITIES.supportedInstanceTypes[0],
      region: AZURE_CAPABILITIES.supportedRegions[0]
    };
  }
};

// Register with the central controller
centralDeploymentController.registerProvider('microsoft-azure', AzureCloudAdapter); 