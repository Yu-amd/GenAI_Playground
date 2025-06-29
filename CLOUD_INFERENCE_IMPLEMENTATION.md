# Cloud Inference Implementation

This document provides a comprehensive guide to the cloud inference implementation that allows seamless switching between local LM Studio and multiple cloud inference providers.

## Overview

The cloud inference system provides:
- **Multi-provider support**: OpenAI, Azure OpenAI, AWS Bedrock, Google AI, and custom endpoints
- **Load balancing**: Priority-based, round-robin, and health-based load balancing
- **Health monitoring**: Automatic health checks and provider status monitoring
- **Auto-fallback**: Automatic fallback between providers on failure
- **Unified interface**: Single API for both local and cloud inference

## Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Application   │    │ InferenceService │    │ Cloud Inference │
│                 │───▶│     Factory      │───▶│     Service     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │                        │
                                ▼                        ▼
                       ┌──────────────────┐    ┌─────────────────┐
                       │   LM Studio      │    │   Providers     │
                       │     Service      │    │   (OpenAI,      │
                       └──────────────────┘    │    Azure, etc.)  │
                                               └─────────────────┘
```

## Components

### 1. CloudInferenceService
Core service that manages multiple cloud providers with load balancing and health monitoring.

**Key Features:**
- Provider management (add, remove, update)
- Health monitoring with configurable intervals
- Load balancing strategies
- Automatic retry with exponential backoff
- Provider-specific request formatting

### 2. CloudConfigService
Manages configuration for all cloud providers, including environment variables and localStorage persistence.

**Key Features:**
- Environment variable loading
- Configuration validation
- Provider templates
- Configuration persistence

### 3. InferenceServiceFactory
Unified interface that allows switching between LM Studio and cloud inference providers.

**Key Features:**
- Provider switching
- Auto-fallback between providers
- Health status monitoring
- Unified API interface

### 4. React Components
- `CloudProviderManager`: Manage cloud providers with UI
- `InferenceProviderSelector`: Switch between inference providers

## Setup and Configuration

### 1. Environment Variables

Copy `env.example` to `.env` and configure your providers:

```bash
# OpenAI
REACT_APP_OPENAI_API_KEY=your_openai_api_key_here

# Azure OpenAI
REACT_APP_AZURE_API_KEY=your_azure_api_key_here
REACT_APP_AZURE_ENDPOINT=https://your-resource.openai.azure.com

# AWS Bedrock
REACT_APP_AWS_ACCESS_KEY_ID=your_aws_access_key_id
REACT_APP_AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
REACT_APP_AWS_REGION=us-east-1

# Google AI
REACT_APP_GCP_API_KEY=your_gcp_api_key_here
REACT_APP_GCP_PROJECT_ID=your_gcp_project_id

# Custom Endpoints
REACT_APP_CUSTOM_ENDPOINTS=https://your-custom-endpoint1.com,https://your-custom-endpoint2.com
REACT_APP_CUSTOM_API_KEYS=your_custom_api_key1,your_custom_api_key2
```

### 2. Basic Usage

```typescript
import { inferenceService } from './services/inferenceServiceFactory';

// Switch to cloud inference
inferenceService.switchProvider('cloud');

// Make a request (works with both LM Studio and cloud)
const response = await inferenceService.chatCompletion({
  messages: [
    { role: 'user', content: 'Hello, how are you?' }
  ],
  max_tokens: 100
});
```

### 3. Provider Management

```typescript
import { cloudConfigService } from './services/cloudConfigService';

// Add a new provider
await cloudConfigService.addProvider({
  id: 'my-openai',
  name: 'My OpenAI',
  type: 'openai',
  endpoint: 'https://api.openai.com',
  apiKey: 'sk-...',
  priority: 1,
  enabled: true
});

// Get all providers
const providers = cloudConfigService.getConfig().providers;
```

## Provider Types

### 1. OpenAI
Standard OpenAI API compatible endpoints.

```typescript
{
  type: 'openai',
  endpoint: 'https://api.openai.com',
  apiKey: 'sk-...',
  priority: 1,
  enabled: true
}
```

### 2. Azure OpenAI
Azure OpenAI Service endpoints.

```typescript
{
  type: 'azure',
  endpoint: 'https://your-resource.openai.azure.com',
  apiKey: 'your_azure_key',
  config: {
    apiVersion: '2024-02-15-preview'
  },
  priority: 2,
  enabled: true
}
```

### 3. AWS Bedrock
AWS Bedrock service for model inference.

```typescript
{
  type: 'aws',
  endpoint: 'https://bedrock-runtime.us-east-1.amazonaws.com',
  apiKey: 'your_access_key_id',
  config: {
    region: 'us-east-1',
    secretKey: 'your_secret_access_key',
    modelId: 'anthropic.claude-3-sonnet-20240229-v1:0'
  },
  priority: 3,
  enabled: true
}
```

### 4. Google AI
Google AI (Gemini) endpoints.

```typescript
{
  type: 'gcp',
  endpoint: 'https://generativelanguage.googleapis.com',
  apiKey: 'your_gcp_api_key',
  config: {
    projectId: 'your_project_id'
  },
  priority: 4,
  enabled: true
}
```

### 5. Custom Endpoints
Custom inference endpoints with custom formatting.

```typescript
{
  type: 'custom',
  endpoint: 'https://your-custom-endpoint.com',
  apiKey: 'your_api_key',
  config: {
    customFormat: {
      // Custom request format
    }
  },
  priority: 5,
  enabled: true
}
```

## Load Balancing Strategies

### 1. Priority-based (Default)
Uses providers in order of priority, falling back to next available provider.

```typescript
{
  loadBalancing: 'priority'
}
```

### 2. Round-robin
Distributes requests evenly across all healthy providers.

```typescript
{
  loadBalancing: 'round-robin'
}
```

### 3. Health-based
Routes requests to the fastest responding provider.

```typescript
{
  loadBalancing: 'health-based'
}
```

## Health Monitoring

The system automatically monitors provider health:

```typescript
// Get health status
const health = await inferenceService.getHealthStatus();
console.log(health);
// {
//   'lm-studio': { isHealthy: true, responseTime: 150 },
//   'cloud': { isHealthy: true, responseTime: 200 }
// }

// Get cloud provider health
const cloudHealth = cloudInferenceService.getHealthStatus();
console.log(cloudHealth);
// [
//   { providerId: 'openai', isHealthy: true, responseTime: 150 },
//   { providerId: 'azure', isHealthy: false, error: 'Connection timeout' }
// ]
```

## React Components

### CloudProviderManager

Manage cloud providers with a full UI:

```tsx
import { CloudProviderManager } from './components/CloudProviderManager';

function App() {
  return (
    <div>
      <CloudProviderManager 
        onConfigChange={(config) => {
          console.log('Config changed:', config);
        }}
      />
    </div>
  );
}
```

### InferenceProviderSelector

Switch between inference providers:

```tsx
import { InferenceProviderSelector } from './components/InferenceProviderSelector';

function App() {
  return (
    <div>
      <InferenceProviderSelector 
        onProviderChange={(provider) => {
          console.log('Switched to:', provider);
        }}
        showHealthStatus={true}
      />
    </div>
  );
}
```

## Advanced Configuration

### Custom Health Checks

```typescript
{
  healthCheck: {
    url: '/health',
    method: 'GET',
    expectedStatus: 200,
    timeout: 5000
  }
}
```

### Retry Configuration

```typescript
{
  retryAttempts: 3,
  retryDelay: 1000,
  timeout: 30000
}
```

### Health Monitoring Configuration

```typescript
{
  enableHealthMonitoring: true,
  healthCheckInterval: 30000
}
```

## Error Handling

The system provides comprehensive error handling:

```typescript
try {
  const response = await inferenceService.chatCompletion(request);
} catch (error) {
  if (error.message.includes('No healthy providers available')) {
    // All providers are down
    console.error('All inference providers are unavailable');
  } else if (error.message.includes('Provider test failed')) {
    // Specific provider failed
    console.error('Provider health check failed');
  } else {
    // Other errors
    console.error('Inference request failed:', error);
  }
}
```

## Migration from LM Studio

### 1. Gradual Migration

```typescript
// Start with LM Studio as primary
inferenceService.setConfig({
  defaultProvider: 'lm-studio',
  cloudConfig: {
    enabled: true,
    autoFallback: true
  }
});

// Later switch to cloud as primary
inferenceService.setConfig({
  defaultProvider: 'cloud',
  cloudConfig: {
    enabled: true,
    autoFallback: true
  }
});
```

### 2. Testing Providers

```typescript
// Test all available providers
const providers = await inferenceService.getAvailableProviders();
for (const provider of providers) {
  const isHealthy = await inferenceService.testProvider(provider);
  console.log(`${provider}: ${isHealthy ? 'Healthy' : 'Unhealthy'}`);
}
```

## Performance Optimization

### 1. Connection Pooling

The system automatically manages connection pools for each provider.

### 2. Request Batching

For high-throughput scenarios, consider implementing request batching:

```typescript
// Batch multiple requests
const requests = [
  { messages: [{ role: 'user', content: 'Hello 1' }] },
  { messages: [{ role: 'user', content: 'Hello 2' }] },
  { messages: [{ role: 'user', content: 'Hello 3' }] }
];

const responses = await Promise.all(
  requests.map(req => inferenceService.chatCompletion(req))
);
```

### 3. Caching

Implement response caching for repeated requests:

```typescript
const cache = new Map();

async function cachedChatCompletion(request: ChatCompletionRequest) {
  const key = JSON.stringify(request);
  if (cache.has(key)) {
    return cache.get(key);
  }
  
  const response = await inferenceService.chatCompletion(request);
  cache.set(key, response);
  return response;
}
```

## Security Considerations

### 1. API Key Management

- Store API keys in environment variables
- Never commit API keys to version control
- Use secure key management services in production
- Rotate API keys regularly

### 2. Request Validation

```typescript
// Validate requests before sending
function validateRequest(request: ChatCompletionRequest) {
  if (!request.messages || request.messages.length === 0) {
    throw new Error('Messages are required');
  }
  
  if (request.max_tokens && request.max_tokens > 4000) {
    throw new Error('Max tokens exceeded');
  }
  
  return request;
}
```

### 3. Rate Limiting

Implement rate limiting to prevent abuse:

```typescript
class RateLimiter {
  private requests = new Map<string, number[]>();
  
  async checkLimit(providerId: string, limit: number, window: number) {
    const now = Date.now();
    const requests = this.requests.get(providerId) || [];
    const recent = requests.filter(time => now - time < window);
    
    if (recent.length >= limit) {
      throw new Error('Rate limit exceeded');
    }
    
    recent.push(now);
    this.requests.set(providerId, recent);
  }
}
```

## Troubleshooting

### Common Issues

1. **Provider Connection Failed**
   - Check endpoint URL and API key
   - Verify network connectivity
   - Check provider status

2. **Health Check Failures**
   - Verify health check endpoint
   - Check expected status codes
   - Review timeout settings

3. **Load Balancing Issues**
   - Check provider priorities
   - Verify provider health status
   - Review load balancing strategy

### Debug Mode

Enable debug logging:

```typescript
// Enable debug mode
localStorage.setItem('debug', 'cloud-inference:*');

// Or set environment variable
process.env.REACT_APP_DEBUG = 'true';
```

### Health Check Debugging

```typescript
// Test specific provider
const provider = cloudConfigService.getProvider('openai');
if (provider) {
  const health = await cloudInferenceService.testProvider(provider);
  console.log('Provider health:', health);
}
```

## Monitoring and Metrics

### 1. Performance Metrics

```typescript
// Track response times
const startTime = Date.now();
const response = await inferenceService.chatCompletion(request);
const responseTime = Date.now() - startTime;

// Log metrics
console.log(`Request completed in ${responseTime}ms using ${response.provider}`);
```

### 2. Error Tracking

```typescript
// Track errors by provider
const errorCounts = new Map<string, number>();

try {
  await inferenceService.chatCompletion(request);
} catch (error) {
  const provider = inferenceService.getProvider();
  const count = errorCounts.get(provider) || 0;
  errorCounts.set(provider, count + 1);
  
  console.error(`Error with ${provider}:`, error);
}
```

## Best Practices

1. **Provider Configuration**
   - Use environment variables for sensitive data
   - Set appropriate timeouts and retry limits
   - Configure health checks for all providers

2. **Error Handling**
   - Implement proper error handling and logging
   - Use auto-fallback for critical applications
   - Monitor provider health regularly

3. **Performance**
   - Choose appropriate load balancing strategy
   - Monitor response times and adjust priorities
   - Implement caching where appropriate

4. **Security**
   - Secure API key storage
   - Validate all requests
   - Implement rate limiting

5. **Monitoring**
   - Track provider health and performance
   - Monitor error rates and response times
   - Set up alerts for provider failures

## Future Enhancements

1. **Provider-Specific Optimizations**
   - Model-specific configurations
   - Cost optimization strategies
   - Performance tuning

2. **Advanced Load Balancing**
   - Machine learning-based routing
   - Cost-aware load balancing
   - Geographic routing

3. **Enhanced Monitoring**
   - Real-time dashboards
   - Predictive failure detection
   - Automated scaling

4. **Additional Providers**
   - Anthropic Claude
   - Cohere
   - LocalAI
   - Ollama

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review provider-specific documentation
3. Enable debug logging
4. Check health status of all providers
5. Verify configuration and environment variables 