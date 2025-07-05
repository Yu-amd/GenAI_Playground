import type { CloudProviderAdapter, CloudProviderCapabilities } from '../types/cloudProvider';
import type { DeploymentConfig, DeploymentResult, Instance } from './CentralDeploymentController';
import { centralDeploymentController } from './CentralDeploymentController';

const ORACLE_CAPABILITIES: CloudProviderCapabilities = {
  supportedInstanceTypes: ['mi300x', 'mi250x'],
  supportedRegions: ['us-east', 'us-west', 'eu-central', 'ap-southeast'],
  supportsBlueprints: true,
  supportsCustomModels: true,
  maxInstances: 10,
  features: ['Bare Metal', 'Enterprise Security', 'High Performance Networking', 'Oracle Support']
};

let mockInstances: Instance[] = [];

export const OracleCloudAdapter: CloudProviderAdapter = {
  async deployInstance(config: DeploymentConfig): Promise<DeploymentResult> {
    // Mock deployment logic
    const id = `oracle-${Date.now()}`;
    const instance: Instance = {
      id,
      name: `${config.instanceType}-${id}`,
      status: 'running',
      instanceType: config.instanceType,
      region: config.region,
      endpoint: `https://oraclecloud.example.com/instance/${id}`,
      createdAt: new Date(),
      costPerHour: config.instanceType === 'mi300x' ? 3.50 : 2.80
    };
    mockInstances.push(instance);
    return {
      success: true,
      instanceId: id,
      endpoint: instance.endpoint,
      logs: ['Oracle Cloud instance deployed successfully.']
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
    return ORACLE_CAPABILITIES;
  },
  getProviderInfo() {
    return {
      name: 'Oracle Cloud Infrastructure',
      description: 'Enterprise-grade cloud platform with bare metal AMD GPU instances.',
      logo: '/assets/oracle-logo.svg',
      website: 'https://www.oracle.com/cloud/'
    };
  },
  validateConfig(config: DeploymentConfig) {
    const errors: string[] = [];
    if (!ORACLE_CAPABILITIES.supportedInstanceTypes.includes(config.instanceType)) {
      errors.push('Unsupported instance type');
    }
    if (!ORACLE_CAPABILITIES.supportedRegions.includes(config.region)) {
      errors.push('Unsupported region');
    }
    return { valid: errors.length === 0, errors };
  },
  getDefaultConfig() {
    return {
      instanceType: ORACLE_CAPABILITIES.supportedInstanceTypes[0],
      region: ORACLE_CAPABILITIES.supportedRegions[0]
    };
  }
};

// Register with the central controller
centralDeploymentController.registerProvider('oracle-cloud-infrastructure', OracleCloudAdapter); 