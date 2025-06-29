import axios from 'axios';
import type { AxiosInstance } from 'axios';

// Core types for cloud inference
export interface CloudProvider {
  id: string;
  name: string;
  type: 'openai' | 'azure' | 'aws' | 'gcp' | 'custom';
  endpoint: string;
  apiKey?: string;
  config?: Record<string, unknown>;
  priority: number; // Lower number = higher priority
  enabled: boolean;
  healthCheck?: {
    url: string;
    method: 'GET' | 'POST';
    expectedStatus: number;
    timeout: number;
  };
}

export interface CloudInferenceConfig {
  providers: CloudProvider[];
  loadBalancing: 'round-robin' | 'priority' | 'health-based';
  retryAttempts: number;
  retryDelay: number;
  timeout: number;
  enableHealthMonitoring: boolean;
  healthCheckInterval: number;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
  tool_calls?: Array<{
    id: string;
    type: 'function';
    function: {
      name: string;
      arguments: string;
    };
  }>;
}

export interface ChatCompletionRequest {
  messages: ChatMessage[];
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  stream?: boolean;
  model?: string;
  tools?: Array<{
    type: 'function';
    function: {
      name: string;
      description: string;
      parameters: {
        type: string;
        properties: Record<string, unknown>;
        required: string[];
      };
    };
  }>;
}

export interface ChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string | null;
      tool_calls?: Array<{
        id: string;
        type: 'function';
        function: {
          name: string;
          arguments: string;
        };
      }>;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  provider?: string; // Track which provider was used
}

export interface StreamChunk {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    delta: {
      content?: string;
      role?: string;
    };
    finish_reason: string | null;
  }>;
}

export interface ProviderHealth {
  providerId: string;
  isHealthy: boolean;
  lastCheck: number;
  responseTime: number;
  error?: string;
}

export class CloudInferenceService {
  private config: CloudInferenceConfig;
  private providers: CloudProvider[];
  private currentProviderIndex: number = 0;
  private healthStatus: Map<string, ProviderHealth> = new Map();
  private healthCheckInterval?: NodeJS.Timeout;
  private axiosInstances: Map<string, AxiosInstance> = new Map();

  constructor(config: CloudInferenceConfig) {
    this.config = config;
    this.providers = config.providers.filter(p => p.enabled);
    this.initializeProviders();
    
    if (config.enableHealthMonitoring) {
      this.startHealthMonitoring();
    }
  }

  private initializeProviders(): void {
    this.providers.forEach(provider => {
      const axiosInstance = axios.create({
        baseURL: provider.endpoint,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(provider.apiKey && { 'Authorization': `Bearer ${provider.apiKey}` })
        },
        timeout: this.config.timeout,
        withCredentials: false
      });

      // Add response interceptor for debugging
      axiosInstance.interceptors.response.use(
        response => {
          console.log(`Response from ${provider.name}:`, response);
          return response;
        },
        error => {
          console.error(`Request failed for ${provider.name}:`, error);
          return Promise.reject(error);
        }
      );

      this.axiosInstances.set(provider.id, axiosInstance);
      this.healthStatus.set(provider.id, {
        providerId: provider.id,
        isHealthy: true,
        lastCheck: Date.now(),
        responseTime: 0
      });
    });
  }

  private async checkProviderHealth(provider: CloudProvider): Promise<ProviderHealth> {
    const startTime = Date.now();
    const health: ProviderHealth = {
      providerId: provider.id,
      isHealthy: false,
      lastCheck: Date.now(),
      responseTime: 0
    };

    try {
      if (provider.healthCheck) {
        const axiosInstance = this.axiosInstances.get(provider.id);
        if (!axiosInstance) {
          throw new Error('Axios instance not found');
        }

        const response = await axiosInstance.request({
          url: provider.healthCheck.url,
          method: provider.healthCheck.method,
          timeout: provider.healthCheck.timeout
        });

        health.isHealthy = response.status === provider.healthCheck.expectedStatus;
        health.responseTime = Date.now() - startTime;
      } else {
        // Default health check - try to make a simple request
        const axiosInstance = this.axiosInstances.get(provider.id);
        if (!axiosInstance) {
          throw new Error('Axios instance not found');
        }

        await axiosInstance.get('/health');
        health.isHealthy = true;
        health.responseTime = Date.now() - startTime;
      }
    } catch (error) {
      health.isHealthy = false;
      health.error = error instanceof Error ? error.message : 'Unknown error';
      health.responseTime = Date.now() - startTime;
    }

    this.healthStatus.set(provider.id, health);
    return health;
  }

  private startHealthMonitoring(): void {
    this.healthCheckInterval = setInterval(async () => {
      for (const provider of this.providers) {
        await this.checkProviderHealth(provider);
      }
    }, this.config.healthCheckInterval);
  }

  private stopHealthMonitoring(): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }
  }

  private getNextProvider(): CloudProvider | null {
    switch (this.config.loadBalancing) {
      case 'round-robin': {
        const healthyProviders = this.providers.filter(p => 
          this.healthStatus.get(p.id)?.isHealthy !== false
        );
        if (healthyProviders.length === 0) return null;
        this.currentProviderIndex = (this.currentProviderIndex + 1) % healthyProviders.length;
        return healthyProviders[this.currentProviderIndex];
      }
      case 'priority': {
        const sortedProviders = [...this.providers].sort((a, b) => a.priority - b.priority);
        return sortedProviders.find(p => 
          this.healthStatus.get(p.id)?.isHealthy !== false
        ) || null;
      }
      case 'health-based': {
        const healthyProvidersHealth = this.providers
          .filter(p => this.healthStatus.get(p.id)?.isHealthy !== false)
          .map(p => ({
            provider: p,
            health: this.healthStatus.get(p.id)!
          }))
          .sort((a, b) => a.health.responseTime - b.health.responseTime);
        return healthyProvidersHealth[0]?.provider || null;
      }
      default:
        return this.providers[0] || null;
    }
  }

  private async makeRequest(
    provider: CloudProvider,
    request: ChatCompletionRequest,
    onStreamChunk?: (chunk: StreamChunk) => void
  ): Promise<ChatCompletionResponse> {
    const axiosInstance = this.axiosInstances.get(provider.id);
    if (!axiosInstance) {
      throw new Error(`Provider ${provider.name} not initialized`);
    }

    // Prepare the request based on provider type
    const preparedRequest = this.prepareRequestForProvider(provider, request);

    if (onStreamChunk) {
      return this.handleStreamingRequest(provider, preparedRequest, onStreamChunk);
    } else {
      const response = await axiosInstance.post('/v1/chat/completions', preparedRequest);
      return {
        ...response.data,
        provider: provider.name
      };
    }
  }

  private prepareRequestForProvider(
    provider: CloudProvider,
    request: ChatCompletionRequest
  ): Record<string, unknown> {
    const baseRequest = { ...request };

    switch (provider.type) {
      case 'openai':
        // OpenAI format is standard
        return baseRequest;

      case 'azure':
        // Azure OpenAI format
        return {
          ...baseRequest,
          api_version: provider.config?.apiVersion || '2024-02-15-preview'
        };

      case 'aws':
        // AWS Bedrock format
        return {
          ...baseRequest,
          modelId: provider.config?.modelId || request.model,
          inferenceConfig: provider.config?.inferenceConfig || {}
        };

      case 'gcp':
        // Google AI format
        return {
          ...baseRequest,
          generationConfig: provider.config?.generationConfig || {}
        };

      case 'custom':
        // Custom endpoint format
        return {
          ...baseRequest,
          ...(provider.config?.customFormat || {})
        };

      default:
        return baseRequest;
    }
  }

  private async handleStreamingRequest(
    provider: CloudProvider,
    request: Record<string, unknown>,
    onStreamChunk: (chunk: StreamChunk) => void
  ): Promise<ChatCompletionResponse> {
    const response = await fetch(`${provider.endpoint}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(provider.apiKey && { 'Authorization': `Bearer ${provider.apiKey}` })
      },
      body: JSON.stringify({ ...request, stream: true })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No reader available');
    }

    let accumulatedContent = '';
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n').filter(line => line.trim() !== '');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') continue;

          try {
            const parsed = JSON.parse(data) as StreamChunk;
            if (parsed.choices[0]?.delta?.content) {
              accumulatedContent += parsed.choices[0].delta.content;
            }
            onStreamChunk(parsed);
          } catch (e) {
            console.error('Error parsing stream chunk:', e);
          }
        }
      }
    }

    return {
      id: 'stream-completion',
      object: 'chat.completion',
      created: Date.now(),
      model: typeof request.model === 'string' ? request.model : 'unknown',
      choices: [{
        index: 0,
        message: {
          role: 'assistant',
          content: accumulatedContent
        },
        finish_reason: 'stop'
      }],
      usage: {
        prompt_tokens: 0,
        completion_tokens: 0,
        total_tokens: 0
      },
      provider: provider.name
    };
  }

  async chatCompletion(
    request: ChatCompletionRequest,
    onStreamChunk?: (chunk: StreamChunk) => void
  ): Promise<ChatCompletionResponse> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < this.config.retryAttempts; attempt++) {
      const provider = this.getNextProvider();
      
      if (!provider) {
        throw new Error('No healthy providers available');
      }

      try {
        console.log(`Attempting request with provider: ${provider.name} (attempt ${attempt + 1})`);
        const response = await this.makeRequest(provider, request, onStreamChunk);
        console.log(`Successfully completed request with provider: ${provider.name}`);
        return response;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        console.error(`Request failed with provider ${provider.name}:`, lastError.message);
        
        // Mark provider as unhealthy
        this.healthStatus.set(provider.id, {
          providerId: provider.id,
          isHealthy: false,
          lastCheck: Date.now(),
          responseTime: 0,
          error: lastError.message
        });

        // Wait before retry
        if (attempt < this.config.retryAttempts - 1) {
          await new Promise(resolve => setTimeout(resolve, this.config.retryDelay));
        }
      }
    }

    throw lastError || new Error('All providers failed');
  }

  async updateConfig(config: Partial<CloudInferenceConfig>): Promise<void> {
    this.config = { ...this.config, ...config };
    
    if (config.providers) {
      this.providers = config.providers.filter(p => p.enabled);
      this.initializeProviders();
    }

    if (config.enableHealthMonitoring !== undefined) {
      if (config.enableHealthMonitoring) {
        this.startHealthMonitoring();
      } else {
        this.stopHealthMonitoring();
      }
    }
  }

  getHealthStatus(): ProviderHealth[] {
    return Array.from(this.healthStatus.values());
  }

  getProviders(): CloudProvider[] {
    return [...this.providers];
  }

  async addProvider(provider: CloudProvider): Promise<void> {
    this.providers.push(provider);
    this.initializeProviders();
  }

  async removeProvider(providerId: string): Promise<void> {
    this.providers = this.providers.filter(p => p.id !== providerId);
    this.healthStatus.delete(providerId);
    this.axiosInstances.delete(providerId);
  }

  async testProvider(provider: CloudProvider): Promise<ProviderHealth> {
    return await this.checkProviderHealth(provider);
  }

  destroy(): void {
    this.stopHealthMonitoring();
    this.axiosInstances.clear();
    this.healthStatus.clear();
  }
}

// Default configuration
const defaultConfig: CloudInferenceConfig = {
  providers: [],
  loadBalancing: 'priority',
  retryAttempts: 3,
  retryDelay: 1000,
  timeout: 30000,
  enableHealthMonitoring: true,
  healthCheckInterval: 30000
};

// Create singleton instance
export const cloudInferenceService = new CloudInferenceService(defaultConfig); 