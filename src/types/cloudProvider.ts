import type { DeploymentConfig, DeploymentResult, Instance } from '../services/CentralDeploymentController';

export interface CloudProviderCapabilities {
  supportedInstanceTypes: string[];
  supportedRegions: string[];
  supportsBlueprints: boolean;
  supportsCustomModels: boolean;
  maxInstances: number;
  features: string[];
}

export interface CloudProviderAdapter {
  // Core deployment methods
  deployInstance(config: DeploymentConfig): Promise<DeploymentResult>;
  getInstances(): Promise<Instance[]>;
  deleteInstance(instanceId: string): Promise<boolean>;
  
  // Provider information
  getCapabilities(): CloudProviderCapabilities;
  getProviderInfo(): {
    name: string;
    description: string;
    logo: string;
    website: string;
  };
  
  // Configuration
  validateConfig(config: DeploymentConfig): { valid: boolean; errors: string[] };
  getDefaultConfig(): Partial<DeploymentConfig>;
}

export interface ProviderConfig {
  id: string;
  name: string;
  adapter: CloudProviderAdapter;
  enabled: boolean;
} 