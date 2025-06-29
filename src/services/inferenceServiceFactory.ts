import type { ChatCompletionRequest, ChatCompletionResponse, StreamChunk } from './cloudInferenceService';
import { cloudInferenceService } from './cloudInferenceService';
import { lmStudioService } from './lmStudioService';
import { cloudConfigService } from './cloudConfigService';

export type InferenceProvider = 'lm-studio' | 'cloud';

export interface InferenceServiceConfig {
  defaultProvider: InferenceProvider;
  lmStudioConfig?: {
    endpoint: string;
    apiKey?: string;
  };
  cloudConfig?: {
    enabled: boolean;
    autoFallback: boolean;
  };
}

export interface InferenceService {
  chatCompletion(
    request: ChatCompletionRequest,
    onStreamChunk?: (chunk: StreamChunk) => void
  ): Promise<ChatCompletionResponse>;
  
  setConfig(config: Partial<InferenceServiceConfig>): void;
  getConfig(): InferenceServiceConfig;
  getProvider(): InferenceProvider;
  switchProvider(provider: InferenceProvider): void;
  isAvailable(provider: InferenceProvider): boolean;
  getHealthStatus(): Promise<Record<InferenceProvider, {
    isHealthy: boolean;
    responseTime?: number;
    error?: string;
  }>>;
  getAvailableProviders(): Promise<InferenceProvider[]>;
  testProvider(provider: InferenceProvider): Promise<boolean>;
}

class InferenceServiceFactory implements InferenceService {
  private config: InferenceServiceConfig;
  private currentProvider: InferenceProvider;

  constructor(config: InferenceServiceConfig) {
    this.config = config;
    this.currentProvider = config.defaultProvider;
    this.initializeServices();
  }

  private initializeServices(): void {
    // Initialize LM Studio service if config provided
    if (this.config.lmStudioConfig) {
      lmStudioService.setConfig(this.config.lmStudioConfig);
    }

    // Initialize cloud service if enabled
    if (this.config.cloudConfig?.enabled) {
      const cloudConfig = cloudConfigService.getConfig();
      cloudInferenceService.updateConfig(cloudConfig);
    }
  }

  async chatCompletion(
    request: ChatCompletionRequest,
    onStreamChunk?: (chunk: StreamChunk) => void
  ): Promise<ChatCompletionResponse> {
    const provider = this.currentProvider;
    
    try {
      switch (provider) {
        case 'lm-studio':
          return await lmStudioService.chatCompletion(request, onStreamChunk);
        
        case 'cloud':
          return await cloudInferenceService.chatCompletion(request, onStreamChunk);
        
        default:
          throw new Error(`Unknown provider: ${provider}`);
      }
    } catch (error) {
      // Auto-fallback logic
      if (this.config.cloudConfig?.autoFallback && provider === 'lm-studio') {
        console.warn('LM Studio failed, falling back to cloud provider');
        this.currentProvider = 'cloud';
        return await cloudInferenceService.chatCompletion(request, onStreamChunk);
      }
      
      if (this.config.cloudConfig?.autoFallback && provider === 'cloud') {
        console.warn('Cloud provider failed, falling back to LM Studio');
        this.currentProvider = 'lm-studio';
        return await lmStudioService.chatCompletion(request, onStreamChunk);
      }
      
      throw error;
    }
  }

  setConfig(config: Partial<InferenceServiceConfig>): void {
    this.config = { ...this.config, ...config };
    
    if (config.lmStudioConfig) {
      lmStudioService.setConfig(config.lmStudioConfig);
    }
    
    if (config.cloudConfig?.enabled) {
      const cloudConfig = cloudConfigService.getConfig();
      cloudInferenceService.updateConfig(cloudConfig);
    }
  }

  getConfig(): InferenceServiceConfig {
    return { ...this.config };
  }

  getProvider(): InferenceProvider {
    return this.currentProvider;
  }

  switchProvider(provider: InferenceProvider): void {
    if (!this.isAvailable(provider)) {
      throw new Error(`Provider ${provider} is not available`);
    }
    this.currentProvider = provider;
  }

  isAvailable(provider: InferenceProvider): boolean {
    switch (provider) {
      case 'lm-studio':
        // Check if LM Studio config is available
        return !!(this.config.lmStudioConfig?.endpoint);
      
      case 'cloud':
        // Check if cloud providers are configured and enabled
        if (!this.config.cloudConfig?.enabled) return false;
        const cloudConfig = cloudConfigService.getConfig();
        return cloudConfig.providers.length > 0;
      
      default:
        return false;
    }
  }

  // Additional utility methods
  async testProvider(provider: InferenceProvider): Promise<boolean> {
    try {
      const testRequest: ChatCompletionRequest = {
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: 'Hello' }
        ],
        max_tokens: 10
      };

      await this.chatCompletion(testRequest);
      return true;
    } catch (error) {
      console.error(`Provider ${provider} test failed:`, error);
      return false;
    }
  }

  getProviderInfo(provider: InferenceProvider): {
    name: string;
    description: string;
    status: 'available' | 'unavailable' | 'error';
    details?: string;
  } {
    switch (provider) {
      case 'lm-studio':
        return {
          name: 'LM Studio',
          description: 'Local inference server',
          status: this.isAvailable(provider) ? 'available' : 'unavailable',
          details: this.config.lmStudioConfig?.endpoint
        };
      
      case 'cloud':
        const cloudConfig = cloudConfigService.getConfig();
        const healthyProviders = cloudConfig.providers.filter(p => p.enabled);
        return {
          name: 'Cloud Inference',
          description: 'Multi-provider cloud inference',
          status: this.isAvailable(provider) ? 'available' : 'unavailable',
          details: `${healthyProviders.length} providers configured`
        };
      
      default:
        return {
          name: 'Unknown',
          description: 'Unknown provider',
          status: 'error'
        };
    }
  }

  async getAvailableProviders(): Promise<InferenceProvider[]> {
    const providers: InferenceProvider[] = [];
    
    if (this.isAvailable('lm-studio')) {
      providers.push('lm-studio');
    }
    
    if (this.isAvailable('cloud')) {
      providers.push('cloud');
    }
    
    return providers;
  }

  // Health monitoring
  async getHealthStatus(): Promise<Record<InferenceProvider, {
    isHealthy: boolean;
    responseTime?: number;
    error?: string;
  }>> {
    const status: Record<InferenceProvider, any> = {
      'lm-studio': { isHealthy: false },
      'cloud': { isHealthy: false }
    };

    // Test LM Studio
    if (this.isAvailable('lm-studio')) {
      try {
        const startTime = Date.now();
        await this.testProvider('lm-studio');
        status['lm-studio'] = {
          isHealthy: true,
          responseTime: Date.now() - startTime
        };
      } catch (error) {
        status['lm-studio'] = {
          isHealthy: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    }

    // Test Cloud providers
    if (this.isAvailable('cloud')) {
      const healthStatus = cloudInferenceService.getHealthStatus();
      const healthyProviders = healthStatus.filter(h => h.isHealthy);
      status['cloud'] = {
        isHealthy: healthyProviders.length > 0,
        responseTime: healthyProviders.length > 0 ? 
          Math.min(...healthyProviders.map(h => h.responseTime)) : undefined,
        error: healthyProviders.length === 0 ? 'No healthy providers' : undefined
      };
    }

    return status;
  }
}

// Default configuration
const defaultConfig: InferenceServiceConfig = {
  defaultProvider: 'lm-studio',
  lmStudioConfig: {
    endpoint: 'http://localhost:1234'
  },
  cloudConfig: {
    enabled: true,
    autoFallback: true
  }
};

// Create singleton instance
export const inferenceServiceFactory = new InferenceServiceFactory(defaultConfig);

// Export convenience functions
export const inferenceService: InferenceService = inferenceServiceFactory;

// Utility functions for easy access
export const switchToCloud = () => inferenceServiceFactory.switchProvider('cloud');
export const switchToLMStudio = () => inferenceServiceFactory.switchProvider('lm-studio');
export const getCurrentProvider = () => inferenceServiceFactory.getProvider();
export const isCloudAvailable = () => inferenceServiceFactory.isAvailable('cloud');
export const isLMStudioAvailable = () => inferenceServiceFactory.isAvailable('lm-studio'); 