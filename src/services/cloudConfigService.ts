import type { CloudProvider, CloudInferenceConfig } from './cloudInferenceService';

export interface EnvironmentConfig {
  openaiApiKey?: string;
  openaiEndpoint?: string;
  azureApiKey?: string;
  azureEndpoint?: string;
  azureApiVersion?: string;
  awsAccessKeyId?: string;
  awsSecretAccessKey?: string;
  awsRegion?: string;
  gcpApiKey?: string;
  gcpProjectId?: string;
  customEndpoints?: string[];
  customApiKeys?: string[];
}

export class CloudConfigService {
  private static instance: CloudConfigService;
  private config: CloudInferenceConfig;
  private environmentConfig: EnvironmentConfig;

  private constructor() {
    this.environmentConfig = this.loadEnvironmentConfig();
    this.config = this.createDefaultConfig();
  }

  static getInstance(): CloudConfigService {
    if (!CloudConfigService.instance) {
      CloudConfigService.instance = new CloudConfigService();
    }
    return CloudConfigService.instance;
  }

  private loadEnvironmentConfig(): EnvironmentConfig {
    return {
      openaiApiKey: process.env.REACT_APP_OPENAI_API_KEY,
      openaiEndpoint: process.env.REACT_APP_OPENAI_ENDPOINT,
      azureApiKey: process.env.REACT_APP_AZURE_API_KEY,
      azureEndpoint: process.env.REACT_APP_AZURE_ENDPOINT,
      azureApiVersion: process.env.REACT_APP_AZURE_API_VERSION,
      awsAccessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
      awsSecretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
      awsRegion: process.env.REACT_APP_AWS_REGION,
      gcpApiKey: process.env.REACT_APP_GCP_API_KEY,
      gcpProjectId: process.env.REACT_APP_GCP_PROJECT_ID,
      customEndpoints: process.env.REACT_APP_CUSTOM_ENDPOINTS?.split(','),
      customApiKeys: process.env.REACT_APP_CUSTOM_API_KEYS?.split(',')
    };
  }

  private createDefaultConfig(): CloudInferenceConfig {
    const providers: CloudProvider[] = [];

    // Add OpenAI provider if configured
    if (this.environmentConfig.openaiApiKey) {
      providers.push({
        id: 'openai',
        name: 'OpenAI',
        type: 'openai',
        endpoint: this.environmentConfig.openaiEndpoint || 'https://api.openai.com',
        apiKey: this.environmentConfig.openaiApiKey,
        priority: 1,
        enabled: true,
        healthCheck: {
          url: '/v1/models',
          method: 'GET',
          expectedStatus: 200,
          timeout: 5000
        }
      });
    }

    // Add Azure OpenAI provider if configured
    if (this.environmentConfig.azureApiKey && this.environmentConfig.azureEndpoint) {
      providers.push({
        id: 'azure',
        name: 'Azure OpenAI',
        type: 'azure',
        endpoint: this.environmentConfig.azureEndpoint,
        apiKey: this.environmentConfig.azureApiKey,
        config: {
          apiVersion: this.environmentConfig.azureApiVersion || '2024-02-15-preview'
        },
        priority: 2,
        enabled: true,
        healthCheck: {
          url: '/openai/deployments',
          method: 'GET',
          expectedStatus: 200,
          timeout: 5000
        }
      });
    }

    // Add AWS Bedrock provider if configured
    if (this.environmentConfig.awsAccessKeyId && this.environmentConfig.awsSecretAccessKey) {
      providers.push({
        id: 'aws',
        name: 'AWS Bedrock',
        type: 'aws',
        endpoint: `https://bedrock-runtime.${this.environmentConfig.awsRegion}.amazonaws.com`,
        apiKey: this.environmentConfig.awsAccessKeyId, // Will be used with AWS signature
        config: {
          region: this.environmentConfig.awsRegion,
          secretKey: this.environmentConfig.awsSecretAccessKey,
          modelId: 'anthropic.claude-3-sonnet-20240229-v1:0'
        },
        priority: 3,
        enabled: true,
        healthCheck: {
          url: '/invoke',
          method: 'POST',
          expectedStatus: 400, // Bedrock returns 400 for invalid requests, but connection works
          timeout: 5000
        }
      });
    }

    // Add Google AI provider if configured
    if (this.environmentConfig.gcpApiKey) {
      providers.push({
        id: 'gcp',
        name: 'Google AI',
        type: 'gcp',
        endpoint: 'https://generativelanguage.googleapis.com',
        apiKey: this.environmentConfig.gcpApiKey,
        config: {
          projectId: this.environmentConfig.gcpProjectId
        },
        priority: 4,
        enabled: true,
        healthCheck: {
          url: '/v1beta/models',
          method: 'GET',
          expectedStatus: 200,
          timeout: 5000
        }
      });
    }

    // Add custom endpoints if configured
    if (this.environmentConfig.customEndpoints) {
      this.environmentConfig.customEndpoints.forEach((endpoint, index) => {
        const apiKey = this.environmentConfig.customApiKeys?.[index];
        providers.push({
          id: `custom-${index}`,
          name: `Custom Endpoint ${index + 1}`,
          type: 'custom',
          endpoint: endpoint.trim(),
          apiKey: apiKey?.trim(),
          priority: 5 + index,
          enabled: true,
          healthCheck: {
            url: '/health',
            method: 'GET',
            expectedStatus: 200,
            timeout: 5000
          }
        });
      });
    }

    return {
      providers,
      loadBalancing: 'priority',
      retryAttempts: 3,
      retryDelay: 1000,
      timeout: 30000,
      enableHealthMonitoring: true,
      healthCheckInterval: 30000
    };
  }

  getConfig(): CloudInferenceConfig {
    return { ...this.config };
  }

  async updateConfig(config: Partial<CloudInferenceConfig>): Promise<void> {
    this.config = { ...this.config, ...config };
    
    // Save to localStorage for persistence
    try {
      localStorage.setItem('cloudInferenceConfig', JSON.stringify(this.config));
    } catch (error) {
      console.warn('Failed to save config to localStorage:', error);
    }
  }

  async loadConfigFromStorage(): Promise<void> {
    try {
      const stored = localStorage.getItem('cloudInferenceConfig');
      if (stored) {
        const parsed = JSON.parse(stored);
        this.config = { ...this.config, ...parsed };
      }
    } catch (error) {
      console.warn('Failed to load config from localStorage:', error);
    }
  }

  async saveConfigToStorage(): Promise<void> {
    try {
      localStorage.setItem('cloudInferenceConfig', JSON.stringify(this.config));
    } catch (error) {
      console.warn('Failed to save config to localStorage:', error);
    }
  }

  getEnvironmentConfig(): EnvironmentConfig {
    return { ...this.environmentConfig };
  }

  async addProvider(provider: CloudProvider): Promise<void> {
    this.config.providers.push(provider);
    await this.saveConfigToStorage();
  }

  async removeProvider(providerId: string): Promise<void> {
    this.config.providers = this.config.providers.filter(p => p.id !== providerId);
    await this.saveConfigToStorage();
  }

  async updateProvider(providerId: string, updates: Partial<CloudProvider>): Promise<void> {
    const index = this.config.providers.findIndex(p => p.id === providerId);
    if (index !== -1) {
      this.config.providers[index] = { ...this.config.providers[index], ...updates };
      await this.saveConfigToStorage();
    }
  }

  getProvider(providerId: string): CloudProvider | undefined {
    return this.config.providers.find(p => p.id === providerId);
  }

  // Provider-specific configuration helpers
  getOpenAIConfig() {
    return {
      apiKey: this.environmentConfig.openaiApiKey,
      endpoint: this.environmentConfig.openaiEndpoint || 'https://api.openai.com'
    };
  }

  getAzureConfig() {
    return {
      apiKey: this.environmentConfig.azureApiKey,
      endpoint: this.environmentConfig.azureEndpoint,
      apiVersion: this.environmentConfig.azureApiVersion || '2024-02-15-preview'
    };
  }

  getAWSConfig() {
    return {
      accessKeyId: this.environmentConfig.awsAccessKeyId,
      secretAccessKey: this.environmentConfig.awsSecretAccessKey,
      region: this.environmentConfig.awsRegion
    };
  }

  getGCPConfig() {
    return {
      apiKey: this.environmentConfig.gcpApiKey,
      projectId: this.environmentConfig.gcpProjectId
    };
  }

  // Validation helpers
  validateProvider(provider: CloudProvider): string[] {
    const errors: string[] = [];

    if (!provider.id) errors.push('Provider ID is required');
    if (!provider.name) errors.push('Provider name is required');
    if (!provider.endpoint) errors.push('Endpoint is required');
    if (!provider.type) errors.push('Provider type is required');

    // Validate endpoint URL
    try {
      new URL(provider.endpoint);
    } catch {
      errors.push('Invalid endpoint URL');
    }

    // Provider-specific validation
    switch (provider.type) {
      case 'openai':
        if (!provider.apiKey) errors.push('API key is required for OpenAI');
        break;
      case 'azure':
        if (!provider.apiKey) errors.push('API key is required for Azure');
        if (!provider.endpoint.includes('openai.azure.com')) {
          errors.push('Azure endpoint should contain openai.azure.com');
        }
        break;
      case 'aws':
        if (!provider.apiKey) errors.push('Access key ID is required for AWS');
        if (!provider.config?.secretKey) errors.push('Secret access key is required for AWS');
        if (!provider.config?.region) errors.push('AWS region is required');
        break;
      case 'gcp':
        if (!provider.apiKey) errors.push('API key is required for GCP');
        break;
      case 'custom':
        // Custom providers may not need API keys
        break;
    }

    return errors;
  }

  // Configuration templates
  getProviderTemplate(type: CloudProvider['type']): Partial<CloudProvider> {
    switch (type) {
      case 'openai':
        return {
          type: 'openai',
          endpoint: 'https://api.openai.com',
          priority: 1,
          enabled: true,
          healthCheck: {
            url: '/v1/models',
            method: 'GET',
            expectedStatus: 200,
            timeout: 5000
          }
        };
      case 'azure':
        return {
          type: 'azure',
          endpoint: 'https://your-resource.openai.azure.com',
          priority: 2,
          enabled: true,
          config: {
            apiVersion: '2024-02-15-preview'
          },
          healthCheck: {
            url: '/openai/deployments',
            method: 'GET',
            expectedStatus: 200,
            timeout: 5000
          }
        };
      case 'aws':
        return {
          type: 'aws',
          endpoint: 'https://bedrock-runtime.us-east-1.amazonaws.com',
          priority: 3,
          enabled: true,
          config: {
            region: 'us-east-1',
            modelId: 'anthropic.claude-3-sonnet-20240229-v1:0'
          },
          healthCheck: {
            url: '/invoke',
            method: 'POST',
            expectedStatus: 400,
            timeout: 5000
          }
        };
      case 'gcp':
        return {
          type: 'gcp',
          endpoint: 'https://generativelanguage.googleapis.com',
          priority: 4,
          enabled: true,
          healthCheck: {
            url: '/v1beta/models',
            method: 'GET',
            expectedStatus: 200,
            timeout: 5000
          }
        };
      case 'custom':
        return {
          type: 'custom',
          endpoint: 'https://your-custom-endpoint.com',
          priority: 5,
          enabled: true,
          healthCheck: {
            url: '/health',
            method: 'GET',
            expectedStatus: 200,
            timeout: 5000
          }
        };
      default:
        return {};
    }
  }
}

// Export singleton instance
export const cloudConfigService = CloudConfigService.getInstance(); 