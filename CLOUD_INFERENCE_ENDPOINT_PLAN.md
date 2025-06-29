# Cloud Inference Endpoint Implementation Plan

## Overview

This document outlines the implementation plan for migrating from local LM Studio endpoints to cloud-based inference endpoints for production deployment. The plan includes service architecture, provider-specific implementations, load balancing, monitoring, and deployment strategies.

## Table of Contents

1. [Service Architecture](#service-architecture)
2. [Environment Configuration](#environment-configuration)
3. [Provider Implementations](#provider-implementations)
4. [Load Balancing & Multi-Endpoint](#load-balancing--multi-endpoint)
5. [Health Monitoring](#health-monitoring)
6. [Error Handling](#error-handling)
7. [Migration Strategy](#migration-strategy)
8. [Testing](#testing)
9. [Deployment Configurations](#deployment-configurations)
10. [Security Considerations](#security-considerations)

## Service Architecture

### Core Components

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Load Balancer  │    │   Cloud         │
│   (Playground)  │───▶│   / API Gateway  │───▶│   Endpoints     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌──────────────────┐
                       │   Health Monitor │
                       │   & Metrics      │
                       └──────────────────┘
```

### Service Factory Pattern

```typescript
// services/inference/InferenceServiceFactory.ts
export interface InferenceProvider {
  name: string;
  generateText(prompt: string, options?: any): Promise<string>;
  supportsToolCalling(): boolean;
  getHealth(): Promise<HealthStatus>;
}

export class InferenceServiceFactory {
  private static providers: Map<string, InferenceProvider> = new Map();
  
  static registerProvider(name: string, provider: InferenceProvider) {
    this.providers.set(name, provider);
  }
  
  static getProvider(name: string): InferenceProvider {
    const provider = this.providers.get(name);
    if (!provider) {
      throw new Error(`Provider ${name} not found`);
    }
    return provider;
  }
  
  static getAvailableProviders(): string[] {
    return Array.from(this.providers.keys());
  }
}
```

## Environment Configuration

### Environment Variables

```bash
# .env.production
# Primary Provider
INFERENCE_PROVIDER=openai
INFERENCE_ENDPOINT=https://api.openai.com/v1
INFERENCE_API_KEY=your_openai_api_key
INFERENCE_MODEL=gpt-4o-mini

# Fallback Provider
FALLBACK_PROVIDER=azure
FALLBACK_ENDPOINT=https://your-resource.openai.azure.com
FALLBACK_API_KEY=your_azure_api_key
FALLBACK_MODEL=gpt-4o-mini

# Load Balancing
ENABLE_LOAD_BALANCING=true
MAX_RETRIES=3
RETRY_DELAY=1000
CIRCUIT_BREAKER_THRESHOLD=5

# Health Monitoring
HEALTH_CHECK_INTERVAL=30000
ENDPOINT_TIMEOUT=30000
RATE_LIMIT_PER_MINUTE=60

# Custom Endpoints (comma-separated)
CUSTOM_ENDPOINTS=https://endpoint1.com,https://endpoint2.com
CUSTOM_API_KEYS=key1,key2
CUSTOM_MODELS=model1,model2
```

### Configuration Management

```typescript
// config/inference.ts
export interface InferenceConfig {
  provider: string;
  endpoint: string;
  apiKey: string;
  model: string;
  timeout: number;
  maxRetries: number;
  rateLimit: number;
}

export class InferenceConfigManager {
  private static instance: InferenceConfigManager;
  private config: InferenceConfig;
  
  static getInstance(): InferenceConfigManager {
    if (!this.instance) {
      this.instance = new InferenceConfigManager();
    }
    return this.instance;
  }
  
  getConfig(): InferenceConfig {
    return this.config;
  }
  
  updateConfig(newConfig: Partial<InferenceConfig>) {
    this.config = { ...this.config, ...newConfig };
  }
}
```

## Provider Implementations

### 1. OpenAI Provider

```typescript
// services/inference/providers/OpenAIProvider.ts
import { InferenceProvider, HealthStatus } from '../InferenceServiceFactory';

export class OpenAIProvider implements InferenceProvider {
  name = 'openai';
  private endpoint: string;
  private apiKey: string;
  private model: string;
  
  constructor(config: any) {
    this.endpoint = config.endpoint || 'https://api.openai.com/v1';
    this.apiKey = config.apiKey;
    this.model = config.model || 'gpt-4o-mini';
  }
  
  async generateText(prompt: string, options: any = {}): Promise<string> {
    const response = await fetch(`${this.endpoint}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.model,
        messages: [{ role: 'user', content: prompt }],
        tools: options.tools,
        tool_choice: options.tool_choice,
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 1000,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.choices[0]?.message?.content || '';
  }
  
  supportsToolCalling(): boolean {
    return true;
  }
  
  async getHealth(): Promise<HealthStatus> {
    try {
      const response = await fetch(`${this.endpoint}/models`, {
        headers: { 'Authorization': `Bearer ${this.apiKey}` },
      });
      return {
        status: response.ok ? 'healthy' : 'unhealthy',
        latency: Date.now(),
        details: response.ok ? 'API accessible' : 'API error',
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        latency: Date.now(),
        details: error.message,
      };
    }
  }
}
```

### 2. Azure OpenAI Provider

```typescript
// services/inference/providers/AzureOpenAIProvider.ts
export class AzureOpenAIProvider implements InferenceProvider {
  name = 'azure';
  private endpoint: string;
  private apiKey: string;
  private model: string;
  
  constructor(config: any) {
    this.endpoint = config.endpoint;
    this.apiKey = config.apiKey;
    this.model = config.model;
  }
  
  async generateText(prompt: string, options: any = {}): Promise<string> {
    const response = await fetch(`${this.endpoint}/openai/deployments/${this.model}/chat/completions?api-version=2024-02-15-preview`, {
      method: 'POST',
      headers: {
        'api-key': this.apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [{ role: 'user', content: prompt }],
        tools: options.tools,
        tool_choice: options.tool_choice,
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 1000,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Azure OpenAI API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.choices[0]?.message?.content || '';
  }
  
  supportsToolCalling(): boolean {
    return true;
  }
  
  async getHealth(): Promise<HealthStatus> {
    // Azure-specific health check
    try {
      const response = await fetch(`${this.endpoint}/openai/deployments?api-version=2024-02-15-preview`, {
        headers: { 'api-key': this.apiKey },
      });
      return {
        status: response.ok ? 'healthy' : 'unhealthy',
        latency: Date.now(),
        details: response.ok ? 'Deployment accessible' : 'Deployment error',
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        latency: Date.now(),
        details: error.message,
      };
    }
  }
}
```

### 3. Custom Cloud Provider

```typescript
// services/inference/providers/CustomCloudProvider.ts
export class CustomCloudProvider implements InferenceProvider {
  name = 'custom';
  private endpoints: string[];
  private apiKeys: string[];
  private models: string[];
  private currentIndex = 0;
  
  constructor(config: any) {
    this.endpoints = config.endpoints || [];
    this.apiKeys = config.apiKeys || [];
    this.models = config.models || [];
  }
  
  private getNextEndpoint(): { endpoint: string; apiKey: string; model: string } {
    const index = this.currentIndex % this.endpoints.length;
    this.currentIndex = (this.currentIndex + 1) % this.endpoints.length;
    
    return {
      endpoint: this.endpoints[index],
      apiKey: this.apiKeys[index] || this.apiKeys[0],
      model: this.models[index] || this.models[0],
    };
  }
  
  async generateText(prompt: string, options: any = {}): Promise<string> {
    const { endpoint, apiKey, model } = this.getNextEndpoint();
    
    const response = await fetch(`${endpoint}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        messages: [{ role: 'user', content: prompt }],
        tools: options.tools,
        tool_choice: options.tool_choice,
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 1000,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Custom endpoint error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.choices[0]?.message?.content || '';
  }
  
  supportsToolCalling(): boolean {
    return true; // Assuming custom endpoints support tool calling
  }
  
  async getHealth(): Promise<HealthStatus> {
    const healthyEndpoints = [];
    const totalEndpoints = this.endpoints.length;
    
    for (let i = 0; i < this.endpoints.length; i++) {
      try {
        const response = await fetch(`${this.endpoints[i]}/health`, {
          headers: { 'Authorization': `Bearer ${this.apiKeys[i] || this.apiKeys[0]}` },
        });
        if (response.ok) {
          healthyEndpoints.push(i);
        }
      } catch (error) {
        console.error(`Endpoint ${i} health check failed:`, error);
      }
    }
    
    return {
      status: healthyEndpoints.length > 0 ? 'healthy' : 'unhealthy',
      latency: Date.now(),
      details: `${healthyEndpoints.length}/${totalEndpoints} endpoints healthy`,
    };
  }
}
```

## Load Balancing & Multi-Endpoint

### Load Balancer Implementation

```typescript
// services/inference/LoadBalancer.ts
export interface LoadBalancerConfig {
  strategy: 'round-robin' | 'least-connections' | 'health-based';
  healthCheckInterval: number;
  maxRetries: number;
  retryDelay: number;
}

export class LoadBalancer {
  private providers: InferenceProvider[] = [];
  private currentIndex = 0;
  private healthStatus: Map<string, HealthStatus> = new Map();
  private connectionCounts: Map<string, number> = new Map();
  
  constructor(private config: LoadBalancerConfig) {
    this.startHealthChecks();
  }
  
  addProvider(provider: InferenceProvider) {
    this.providers.push(provider);
    this.connectionCounts.set(provider.name, 0);
  }
  
  async getProvider(): Promise<InferenceProvider> {
    const availableProviders = this.providers.filter(p => 
      this.healthStatus.get(p.name)?.status === 'healthy'
    );
    
    if (availableProviders.length === 0) {
      throw new Error('No healthy providers available');
    }
    
    switch (this.config.strategy) {
      case 'round-robin':
        return this.roundRobin(availableProviders);
      case 'least-connections':
        return this.leastConnections(availableProviders);
      case 'health-based':
        return this.healthBased(availableProviders);
      default:
        return availableProviders[0];
    }
  }
  
  private roundRobin(providers: InferenceProvider[]): InferenceProvider {
    const provider = providers[this.currentIndex % providers.length];
    this.currentIndex = (this.currentIndex + 1) % providers.length;
    return provider;
  }
  
  private leastConnections(providers: InferenceProvider[]): InferenceProvider {
    return providers.reduce((min, provider) => {
      const minCount = this.connectionCounts.get(min.name) || 0;
      const currentCount = this.connectionCounts.get(provider.name) || 0;
      return currentCount < minCount ? provider : min;
    });
  }
  
  private healthBased(providers: InferenceProvider[]): InferenceProvider {
    return providers.reduce((best, provider) => {
      const bestHealth = this.healthStatus.get(best.name);
      const currentHealth = this.healthStatus.get(provider.name);
      
      if (!bestHealth || !currentHealth) return provider;
      
      // Prefer providers with lower latency
      return currentHealth.latency < bestHealth.latency ? provider : best;
    });
  }
  
  private async startHealthChecks() {
    setInterval(async () => {
      for (const provider of this.providers) {
        try {
          const health = await provider.getHealth();
          this.healthStatus.set(provider.name, health);
        } catch (error) {
          this.healthStatus.set(provider.name, {
            status: 'unhealthy',
            latency: Date.now(),
            details: error.message,
          });
        }
      }
    }, this.config.healthCheckInterval);
  }
  
  incrementConnectionCount(providerName: string) {
    const count = this.connectionCounts.get(providerName) || 0;
    this.connectionCounts.set(providerName, count + 1);
  }
  
  decrementConnectionCount(providerName: string) {
    const count = this.connectionCounts.get(providerName) || 0;
    this.connectionCounts.set(providerName, Math.max(0, count - 1));
  }
}
```

### Multi-Endpoint Service

```typescript
// services/inference/MultiEndpointService.ts
export class MultiEndpointService {
  private loadBalancer: LoadBalancer;
  private circuitBreaker: CircuitBreaker;
  
  constructor(config: LoadBalancerConfig) {
    this.loadBalancer = new LoadBalancer(config);
    this.circuitBreaker = new CircuitBreaker({
      threshold: 5,
      timeout: 60000,
    });
  }
  
  async generateText(prompt: string, options: any = {}): Promise<string> {
    return this.circuitBreaker.execute(async () => {
      const provider = await this.loadBalancer.getProvider();
      this.loadBalancer.incrementConnectionCount(provider.name);
      
      try {
        const result = await provider.generateText(prompt, options);
        return result;
      } finally {
        this.loadBalancer.decrementConnectionCount(provider.name);
      }
    });
  }
  
  async getHealth(): Promise<HealthStatus> {
    const providers = this.loadBalancer['providers'];
    const healthyCount = providers.filter(p => 
      this.loadBalancer['healthStatus'].get(p.name)?.status === 'healthy'
    ).length;
    
    return {
      status: healthyCount > 0 ? 'healthy' : 'unhealthy',
      latency: Date.now(),
      details: `${healthyCount}/${providers.length} providers healthy`,
    };
  }
}
```

## Health Monitoring

### Health Check Service

```typescript
// services/monitoring/HealthMonitor.ts
export interface HealthMetrics {
  uptime: number;
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageLatency: number;
  lastHealthCheck: Date;
}

export class HealthMonitor {
  private metrics: Map<string, HealthMetrics> = new Map();
  private startTime = Date.now();
  
  recordRequest(providerName: string, success: boolean, latency: number) {
    const metrics = this.metrics.get(providerName) || {
      uptime: 0,
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      averageLatency: 0,
      lastHealthCheck: new Date(),
    };
    
    metrics.totalRequests++;
    metrics.uptime = Date.now() - this.startTime;
    
    if (success) {
      metrics.successfulRequests++;
    } else {
      metrics.failedRequests++;
    }
    
    // Update average latency
    metrics.averageLatency = 
      (metrics.averageLatency * (metrics.totalRequests - 1) + latency) / metrics.totalRequests;
    
    this.metrics.set(providerName, metrics);
  }
  
  getMetrics(providerName?: string): HealthMetrics | Map<string, HealthMetrics> {
    if (providerName) {
      return this.metrics.get(providerName);
    }
    return this.metrics;
  }
  
  getOverallHealth(): HealthStatus {
    const allMetrics = Array.from(this.metrics.values());
    const totalRequests = allMetrics.reduce((sum, m) => sum + m.totalRequests, 0);
    const totalFailures = allMetrics.reduce((sum, m) => sum + m.failedRequests, 0);
    
    const successRate = totalRequests > 0 ? (totalRequests - totalFailures) / totalRequests : 1;
    
    return {
      status: successRate > 0.95 ? 'healthy' : 'degraded',
      latency: Date.now(),
      details: `Success rate: ${(successRate * 100).toFixed(2)}%`,
    };
  }
}
```

### Circuit Breaker Pattern

```typescript
// services/inference/CircuitBreaker.ts
export interface CircuitBreakerConfig {
  threshold: number;
  timeout: number;
}

export class CircuitBreaker {
  private state: 'closed' | 'open' | 'half-open' = 'closed';
  private failureCount = 0;
  private lastFailureTime = 0;
  
  constructor(private config: CircuitBreakerConfig) {}
  
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'open') {
      if (Date.now() - this.lastFailureTime > this.config.timeout) {
        this.state = 'half-open';
      } else {
        throw new Error('Circuit breaker is open');
      }
    }
    
    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }
  
  private onSuccess() {
    this.failureCount = 0;
    this.state = 'closed';
  }
  
  private onFailure() {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    
    if (this.failureCount >= this.config.threshold) {
      this.state = 'open';
    }
  }
  
  getState(): string {
    return this.state;
  }
}
```

## Error Handling

### Error Types and Handling

```typescript
// services/inference/errors/InferenceErrors.ts
export class InferenceError extends Error {
  constructor(
    message: string,
    public provider: string,
    public statusCode?: number,
    public retryable: boolean = false
  ) {
    super(message);
    this.name = 'InferenceError';
  }
}

export class RateLimitError extends InferenceError {
  constructor(provider: string, retryAfter?: number) {
    super(`Rate limit exceeded for ${provider}`, provider, 429, true);
    this.name = 'RateLimitError';
    this.retryAfter = retryAfter;
  }
  
  retryAfter?: number;
}

export class AuthenticationError extends InferenceError {
  constructor(provider: string) {
    super(`Authentication failed for ${provider}`, provider, 401, false);
    this.name = 'AuthenticationError';
  }
}

export class ServiceUnavailableError extends InferenceError {
  constructor(provider: string) {
    super(`Service unavailable for ${provider}`, provider, 503, true);
    this.name = 'ServiceUnavailableError';
  }
}

// Error handler
export class ErrorHandler {
  static handleError(error: any, provider: string): InferenceError {
    if (error.status === 429) {
      return new RateLimitError(provider, error.headers?.get('retry-after'));
    } else if (error.status === 401) {
      return new AuthenticationError(provider);
    } else if (error.status === 503) {
      return new ServiceUnavailableError(provider);
    } else {
      return new InferenceError(
        error.message || 'Unknown error',
        provider,
        error.status,
        this.isRetryable(error.status)
      );
    }
  }
  
  private static isRetryable(statusCode: number): boolean {
    return [408, 429, 500, 502, 503, 504].includes(statusCode);
  }
}
```

## Migration Strategy

### Phase 1: Preparation (Week 1-2)

1. **Environment Setup**
   - Set up cloud infrastructure
   - Configure environment variables
   - Implement health monitoring

2. **Provider Implementation**
   - Implement cloud providers
   - Add load balancing
   - Set up circuit breakers

3. **Testing**
   - Unit tests for new providers
   - Integration tests
   - Load testing

### Phase 2: Gradual Migration (Week 3-4)

1. **Dual Mode**
   - Support both local and cloud endpoints
   - Feature flag to switch between modes
   - A/B testing with small user group

2. **Monitoring**
   - Real-time health monitoring
   - Performance metrics collection
   - Error tracking and alerting

3. **Rollback Plan**
   - Quick switch back to local endpoints
   - Data consistency checks
   - User notification system

### Phase 3: Full Migration (Week 5-6)

1. **Complete Switch**
   - Migrate all users to cloud endpoints
   - Remove local endpoint dependencies
   - Update documentation

2. **Optimization**
   - Performance tuning
   - Cost optimization
   - Scaling adjustments

## Testing

### Unit Tests

```typescript
// __tests__/services/inference/OpenAIProvider.test.ts
import { OpenAIProvider } from '../../../services/inference/providers/OpenAIProvider';

describe('OpenAIProvider', () => {
  let provider: OpenAIProvider;
  
  beforeEach(() => {
    provider = new OpenAIProvider({
      endpoint: 'https://api.openai.com/v1',
      apiKey: 'test-key',
      model: 'gpt-4o-mini',
    });
  });
  
  test('should generate text successfully', async () => {
    const mockResponse = {
      choices: [{ message: { content: 'Test response' } }],
    };
    
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });
    
    const result = await provider.generateText('Test prompt');
    expect(result).toBe('Test response');
  });
  
  test('should handle API errors', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 429,
      statusText: 'Too Many Requests',
    });
    
    await expect(provider.generateText('Test prompt')).rejects.toThrow('OpenAI API error');
  });
});
```

### Integration Tests

```typescript
// __tests__/integration/LoadBalancer.test.ts
import { LoadBalancer } from '../../services/inference/LoadBalancer';
import { OpenAIProvider } from '../../services/inference/providers/OpenAIProvider';

describe('LoadBalancer Integration', () => {
  let loadBalancer: LoadBalancer;
  
  beforeEach(() => {
    loadBalancer = new LoadBalancer({
      strategy: 'round-robin',
      healthCheckInterval: 1000,
      maxRetries: 3,
      retryDelay: 100,
    });
  });
  
  test('should distribute requests across providers', async () => {
    const provider1 = new MockProvider('provider1');
    const provider2 = new MockProvider('provider2');
    
    loadBalancer.addProvider(provider1);
    loadBalancer.addProvider(provider2);
    
    const results = [];
    for (let i = 0; i < 4; i++) {
      const provider = await loadBalancer.getProvider();
      results.push(provider.name);
    }
    
    expect(results).toEqual(['provider1', 'provider2', 'provider1', 'provider2']);
  });
});
```

### Load Testing

```typescript
// scripts/load-test.ts
import { MultiEndpointService } from '../services/inference/MultiEndpointService';

async function runLoadTest() {
  const service = new MultiEndpointService({
    strategy: 'round-robin',
    healthCheckInterval: 5000,
    maxRetries: 3,
    retryDelay: 1000,
  });
  
  const concurrentRequests = 10;
  const totalRequests = 100;
  
  const startTime = Date.now();
  const results = [];
  
  for (let i = 0; i < totalRequests; i += concurrentRequests) {
    const batch = Array.from({ length: Math.min(concurrentRequests, totalRequests - i) }, () =>
      service.generateText('Test prompt')
    );
    
    const batchResults = await Promise.allSettled(batch);
    results.push(...batchResults);
  }
  
  const endTime = Date.now();
  const duration = endTime - startTime;
  const successCount = results.filter(r => r.status === 'fulfilled').length;
  
  console.log(`Load test completed:`);
  console.log(`- Total requests: ${totalRequests}`);
  console.log(`- Successful: ${successCount}`);
  console.log(`- Failed: ${totalRequests - successCount}`);
  console.log(`- Duration: ${duration}ms`);
  console.log(`- Throughput: ${(totalRequests / duration * 1000).toFixed(2)} req/s`);
}
```

## Deployment Configurations

### Docker Configuration

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy application code
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Change ownership
RUN chown -R nextjs:nodejs /app
USER nextjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# Start application
CMD ["npm", "start"]
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - INFERENCE_PROVIDER=openai
      - INFERENCE_ENDPOINT=https://api.openai.com/v1
      - INFERENCE_API_KEY=${OPENAI_API_KEY}
      - INFERENCE_MODEL=gpt-4o-mini
      - ENABLE_LOAD_BALANCING=true
      - MAX_RETRIES=3
      - HEALTH_CHECK_INTERVAL=30000
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    restart: unless-stopped

  monitoring:
    image: prom/prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml
    restart: unless-stopped

  grafana:
    image: grafana/grafana
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana-storage:/var/lib/grafana
    restart: unless-stopped

volumes:
  grafana-storage:
```

### Kubernetes Configuration

```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: inference-app
  labels:
    app: inference-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: inference-app
  template:
    metadata:
      labels:
        app: inference-app
    spec:
      containers:
      - name: app
        image: your-registry/inference-app:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: INFERENCE_PROVIDER
          value: "openai"
        - name: INFERENCE_ENDPOINT
          value: "https://api.openai.com/v1"
        - name: INFERENCE_API_KEY
          valueFrom:
            secretKeyRef:
              name: inference-secrets
              key: openai-api-key
        - name: INFERENCE_MODEL
          value: "gpt-4o-mini"
        - name: ENABLE_LOAD_BALANCING
          value: "true"
        - name: MAX_RETRIES
          value: "3"
        - name: HEALTH_CHECK_INTERVAL
          value: "30000"
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /api/health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /api/health
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: inference-service
spec:
  selector:
    app: inference-app
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3000
  type: LoadBalancer
---
apiVersion: v1
kind: Secret
metadata:
  name: inference-secrets
type: Opaque
data:
  openai-api-key: <base64-encoded-api-key>
```

### Environment-Specific Configurations

```yaml
# k8s/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: inference-config
data:
  # Development
  development.yaml: |
    inference:
      provider: openai
      endpoint: https://api.openai.com/v1
      model: gpt-4o-mini
      timeout: 30000
      maxRetries: 3
      loadBalancing:
        enabled: false
        strategy: round-robin
        healthCheckInterval: 30000
  
  # Staging
  staging.yaml: |
    inference:
      provider: azure
      endpoint: https://staging-resource.openai.azure.com
      model: gpt-4o-mini
      timeout: 30000
      maxRetries: 3
      loadBalancing:
        enabled: true
        strategy: health-based
        healthCheckInterval: 15000
  
  # Production
  production.yaml: |
    inference:
      provider: custom
      endpoints:
        - https://endpoint1.com
        - https://endpoint2.com
        - https://endpoint3.com
      models:
        - model1
        - model2
        - model3
      timeout: 30000
      maxRetries: 5
      loadBalancing:
        enabled: true
        strategy: least-connections
        healthCheckInterval: 10000
      circuitBreaker:
        threshold: 5
        timeout: 60000
```

## Security Considerations

### API Key Management

```typescript
// services/security/KeyManager.ts
export class KeyManager {
  private static instance: KeyManager;
  private keys: Map<string, string> = new Map();
  private rotationSchedule: Map<string, Date> = new Map();
  
  static getInstance(): KeyManager {
    if (!this.instance) {
      this.instance = new KeyManager();
    }
    return this.instance;
  }
  
  addKey(provider: string, key: string, rotationDate?: Date) {
    this.keys.set(provider, key);
    if (rotationDate) {
      this.rotationSchedule.set(provider, rotationDate);
    }
  }
  
  getKey(provider: string): string {
    const key = this.keys.get(provider);
    if (!key) {
      throw new Error(`No key found for provider: ${provider}`);
    }
    return key;
  }
  
  rotateKey(provider: string, newKey: string) {
    this.keys.set(provider, newKey);
    console.log(`Key rotated for provider: ${provider}`);
  }
  
  checkRotationSchedule() {
    const now = new Date();
    for (const [provider, rotationDate] of this.rotationSchedule) {
      if (now >= rotationDate) {
        console.warn(`Key rotation due for provider: ${provider}`);
        // Trigger key rotation process
      }
    }
  }
}
```

### Rate Limiting

```typescript
// services/security/RateLimiter.ts
export class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private limits: Map<string, { max: number; window: number }> = new Map();
  
  constructor() {
    // Set default limits
    this.limits.set('default', { max: 60, window: 60000 }); // 60 requests per minute
    this.limits.set('openai', { max: 60, window: 60000 });
    this.limits.set('azure', { max: 100, window: 60000 });
  }
  
  isAllowed(provider: string): boolean {
    const now = Date.now();
    const limit = this.limits.get(provider) || this.limits.get('default');
    
    if (!this.requests.has(provider)) {
      this.requests.set(provider, []);
    }
    
    const requests = this.requests.get(provider);
    const windowStart = now - limit.window;
    
    // Remove old requests
    const validRequests = requests.filter(time => time > windowStart);
    this.requests.set(provider, validRequests);
    
    if (validRequests.length >= limit.max) {
      return false;
    }
    
    validRequests.push(now);
    return true;
  }
  
  getRemainingRequests(provider: string): number {
    const limit = this.limits.get(provider) || this.limits.get('default');
    const requests = this.requests.get(provider) || [];
    const now = Date.now();
    const windowStart = now - limit.window;
    const validRequests = requests.filter(time => time > windowStart);
    
    return Math.max(0, limit.max - validRequests.length);
  }
}
```

### Audit Logging

```typescript
// services/security/AuditLogger.ts
export interface AuditLogEntry {
  timestamp: Date;
  userId?: string;
  action: string;
  provider: string;
  success: boolean;
  latency: number;
  error?: string;
  metadata?: any;
}

export class AuditLogger {
  private logs: AuditLogEntry[] = [];
  
  log(entry: Omit<AuditLogEntry, 'timestamp'>) {
    const logEntry: AuditLogEntry = {
      ...entry,
      timestamp: new Date(),
    };
    
    this.logs.push(logEntry);
    
    // Log to external service in production
    if (process.env.NODE_ENV === 'production') {
      this.sendToExternalService(logEntry);
    }
  }
  
  private async sendToExternalService(entry: AuditLogEntry) {
    try {
      await fetch(process.env.AUDIT_LOG_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
      });
    } catch (error) {
      console.error('Failed to send audit log:', error);
    }
  }
  
  getLogs(filters?: Partial<AuditLogEntry>): AuditLogEntry[] {
    return this.logs.filter(log => {
      for (const [key, value] of Object.entries(filters)) {
        if (log[key] !== value) return false;
      }
      return true;
    });
  }
}
```

## Conclusion

This implementation plan provides a comprehensive approach to migrating from local LM Studio endpoints to cloud-based inference endpoints. The plan includes:

1. **Scalable Architecture**: Service factory pattern with multiple provider support
2. **Load Balancing**: Round-robin, least-connections, and health-based strategies
3. **Health Monitoring**: Real-time health checks and circuit breaker patterns
4. **Error Handling**: Comprehensive error types and retry mechanisms
5. **Security**: API key management, rate limiting, and audit logging
6. **Deployment**: Docker and Kubernetes configurations
7. **Testing**: Unit, integration, and load testing strategies

The implementation follows best practices for production systems and provides a smooth migration path from local to cloud endpoints while maintaining reliability and performance.

## Next Steps

1. **Infrastructure Setup**: Deploy cloud infrastructure and configure endpoints
2. **Implementation**: Start with core provider implementations
3. **Testing**: Comprehensive testing in staging environment
4. **Gradual Migration**: Phase-by-phase rollout to production
5. **Monitoring**: Set up comprehensive monitoring and alerting
6. **Optimization**: Performance tuning and cost optimization 