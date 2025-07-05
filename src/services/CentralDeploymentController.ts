import type { CloudProviderAdapter } from '../types/cloudProvider';

export interface DeploymentConfig {
  providerId: string;
  instanceType: string;
  region: string;
  blueprint?: string;
  modelConfig?: any;
  userConfig?: any;
}

export interface DeploymentResult {
  success: boolean;
  instanceId?: string;
  endpoint?: string;
  logs: string[];
  error?: string;
}

export interface Instance {
  id: string;
  name: string;
  status: 'running' | 'stopped' | 'deploying' | 'error';
  instanceType: string;
  region: string;
  endpoint?: string;
  createdAt: Date;
  costPerHour: number;
}

export interface DeploymentStatus {
  deploymentId: string;
  status: 'idle' | 'deploying' | 'deployed' | 'error';
  logs: string[];
  progress: number;
  startTime?: Date;
  endTime?: Date;
}

class CentralDeploymentController {
  private providers: Map<string, CloudProviderAdapter> = new Map();
  private deploymentStatuses: Map<string, DeploymentStatus> = new Map();
  private instances: Map<string, Instance[]> = new Map();

  // Register a cloud provider adapter
  registerProvider(providerId: string, adapter: CloudProviderAdapter) {
    this.providers.set(providerId, adapter);
    this.instances.set(providerId, []);
  }

  // Get all registered providers
  getRegisteredProviders(): string[] {
    return Array.from(this.providers.keys());
  }

  // Deploy to a specific provider
  async deployToProvider(config: DeploymentConfig): Promise<DeploymentResult> {
    const adapter = this.providers.get(config.providerId);
    if (!adapter) {
      throw new Error(`Provider ${config.providerId} not found`);
    }

    const deploymentId = `${config.providerId}-${Date.now()}`;
    
    // Initialize deployment status
    this.deploymentStatuses.set(deploymentId, {
      deploymentId,
      status: 'deploying',
      logs: [],
      progress: 0,
      startTime: new Date()
    });

    try {
      // Update progress and logs
      this.updateDeploymentStatus(deploymentId, {
        logs: [`Starting deployment to ${config.providerId}...`],
        progress: 10
      });

      // Call provider-specific deployment
      const result = await adapter.deployInstance(config);

      // Update final status
      this.updateDeploymentStatus(deploymentId, {
        status: result.success ? 'deployed' : 'error',
        logs: [...this.deploymentStatuses.get(deploymentId)!.logs, ...result.logs],
        progress: 100,
        endTime: new Date()
      });

      // If successful, add to instances
      if (result.success && result.instanceId) {
        const instance: Instance = {
          id: result.instanceId,
          name: `${config.instanceType}-${Date.now()}`,
          status: 'running',
          instanceType: config.instanceType,
          region: config.region,
          endpoint: result.endpoint,
          createdAt: new Date(),
          costPerHour: this.getCostPerHour(config.providerId, config.instanceType)
        };

        const providerInstances = this.instances.get(config.providerId) || [];
        providerInstances.push(instance);
        this.instances.set(config.providerId, providerInstances);
      }

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      this.updateDeploymentStatus(deploymentId, {
        status: 'error',
        logs: [...this.deploymentStatuses.get(deploymentId)!.logs, `Error: ${errorMessage}`],
        progress: 100,
        endTime: new Date()
      });

      return {
        success: false,
        logs: [`Error: ${errorMessage}`],
        error: errorMessage
      };
    }
  }

  // Get instances for a provider
  async getInstances(providerId: string): Promise<Instance[]> {
    const adapter = this.providers.get(providerId);
    if (!adapter) {
      throw new Error(`Provider ${providerId} not found`);
    }

    try {
      const instances = await adapter.getInstances();
      this.instances.set(providerId, instances);
      return instances;
    } catch (error) {
      console.error(`Error fetching instances for ${providerId}:`, error);
      return this.instances.get(providerId) || [];
    }
  }

  // Delete an instance
  async deleteInstance(providerId: string, instanceId: string): Promise<boolean> {
    const adapter = this.providers.get(providerId);
    if (!adapter) {
      throw new Error(`Provider ${providerId} not found`);
    }

    try {
      await adapter.deleteInstance(instanceId);
      
      // Remove from local cache
      const providerInstances = this.instances.get(providerId) || [];
      const updatedInstances = providerInstances.filter(inst => inst.id !== instanceId);
      this.instances.set(providerId, updatedInstances);
      
      return true;
    } catch (error) {
      console.error(`Error deleting instance ${instanceId} from ${providerId}:`, error);
      return false;
    }
  }

  // Get deployment status
  getDeploymentStatus(deploymentId: string): DeploymentStatus | undefined {
    return this.deploymentStatuses.get(deploymentId);
  }

  // Update deployment status
  private updateDeploymentStatus(deploymentId: string, updates: Partial<DeploymentStatus>) {
    const current = this.deploymentStatuses.get(deploymentId);
    if (current) {
      this.deploymentStatuses.set(deploymentId, { ...current, ...updates });
    }
  }

  // Get cost per hour for an instance type
  private getCostPerHour(providerId: string, instanceType: string): number {
    const pricing = {
      'amd-developer-cloud': { mi300x: 2.50, mi250x: 1.80 },
      'oracle-cloud-infrastructure': { mi300x: 3.50, mi250x: 2.80 },
      'microsoft-azure': { mi250: 2.10, mi210: 1.60 },
      'vultr': { mi325x: 3.20, mi300x: 2.80 },
      'hot-aisle': { mi300x: 2.90, mi250x: 2.00 },
      'tensorwave': { mi300x: 3.10, mi250x: 2.30 }
    } as const;

    if (providerId in pricing) {
      const providerPricing = pricing[providerId as keyof typeof pricing];
      if (instanceType in providerPricing) {
        return providerPricing[instanceType as keyof typeof providerPricing];
      }
    }
    return 0;
  }

  // Get provider capabilities
  getProviderCapabilities(providerId: string) {
    const adapter = this.providers.get(providerId);
    return adapter?.getCapabilities() || {};
  }

  // Validate deployment config
  validateDeploymentConfig(config: DeploymentConfig): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!config.providerId) {
      errors.push('Provider ID is required');
    }

    if (!config.instanceType) {
      errors.push('Instance type is required');
    }

    if (!config.region) {
      errors.push('Region is required');
    }

    const adapter = this.providers.get(config.providerId);
    if (!adapter) {
      errors.push(`Provider ${config.providerId} is not supported`);
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}

// Export singleton instance
export const centralDeploymentController = new CentralDeploymentController(); 