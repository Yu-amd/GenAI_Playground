export interface ChatQnASystemConfig {
  // Knowledge Base Configuration
  knowledgeBase: {
    type: 'vector' | 'document' | 'database';
    connectionString: string;
    collectionName: string;
    embeddingModel: string;
    similarityThreshold: number;
    maxResults: number;
  };

  // Model Configuration
  models: {
    embedding: {
      provider: string;
      model: string;
      dimensions: number;
    };
    language: {
      provider: string;
      model: string;
      temperature: number;
      maxTokens: number;
    };
  };

  // Response Configuration
  response: {
    includeSources: boolean;
    maxContextLength: number;
    temperature: number;
    systemPrompt: string;
  };

  // Performance Configuration
  performance: {
    enableCaching: boolean;
    cacheTimeout: number;
    enableStreaming: boolean;
    batchSize: number;
  };
}

export class ChatQnAConfigService {
  private static instance: ChatQnAConfigService;
  private config: ChatQnASystemConfig;

  private constructor() {
    this.config = this.getDefaultConfig();
    this.loadFromStorage();
  }

  static getInstance(): ChatQnAConfigService {
    if (!ChatQnAConfigService.instance) {
      ChatQnAConfigService.instance = new ChatQnAConfigService();
    }
    return ChatQnAConfigService.instance;
  }

  private getDefaultConfig(): ChatQnASystemConfig {
    return {
      knowledgeBase: {
        type: 'vector',
        connectionString: 'mongodb://localhost:27017/chatqna',
        collectionName: 'documents',
        embeddingModel: 'text-embedding-ada-002',
        similarityThreshold: 0.7,
        maxResults: 5,
      },
      models: {
        embedding: {
          provider: 'openai',
          model: 'text-embedding-ada-002',
          dimensions: 1536,
        },
        language: {
          provider: 'openai',
          model: 'gpt-4',
          temperature: 0.7,
          maxTokens: 2048,
        },
      },
      response: {
        includeSources: true,
        maxContextLength: 4000,
        temperature: 0.7,
        systemPrompt:
          'You are a helpful AI assistant powered by a RAG (Retrieval Augmented Generation) system. Use the provided context to answer questions accurately and cite sources when appropriate.',
      },
      performance: {
        enableCaching: true,
        cacheTimeout: 300000, // 5 minutes
        enableStreaming: true,
        batchSize: 10,
      },
    };
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem('chatqna-config');
      if (stored) {
        const parsed = JSON.parse(stored);
        this.config = { ...this.getDefaultConfig(), ...parsed };
      }
    } catch (error) {
      console.error('Error loading ChatQnA config from storage:', error);
    }
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem('chatqna-config', JSON.stringify(this.config));
    } catch (error) {
      console.error('Error saving ChatQnA config to storage:', error);
    }
  }

  getConfig(): ChatQnASystemConfig {
    return { ...this.config };
  }

  updateConfig(updates: Partial<ChatQnASystemConfig>): void {
    this.config = { ...this.config, ...updates };
    this.saveToStorage();
  }

  updateKnowledgeBaseConfig(
    updates: Partial<ChatQnASystemConfig['knowledgeBase']>
  ): void {
    this.config.knowledgeBase = { ...this.config.knowledgeBase, ...updates };
    this.saveToStorage();
  }

  updateModelConfig(updates: Partial<ChatQnASystemConfig['models']>): void {
    this.config.models = { ...this.config.models, ...updates };
    this.saveToStorage();
  }

  updateResponseConfig(
    updates: Partial<ChatQnASystemConfig['response']>
  ): void {
    this.config.response = { ...this.config.response, ...updates };
    this.saveToStorage();
  }

  updatePerformanceConfig(
    updates: Partial<ChatQnASystemConfig['performance']>
  ): void {
    this.config.performance = { ...this.config.performance, ...updates };
    this.saveToStorage();
  }

  resetToDefaults(): void {
    this.config = this.getDefaultConfig();
    this.saveToStorage();
  }

  // Helper methods for specific configurations
  getEmbeddingModel(): string {
    return this.config.models.embedding.model;
  }

  getLanguageModel(): string {
    return this.config.models.language.model;
  }

  getSimilarityThreshold(): number {
    return this.config.knowledgeBase.similarityThreshold;
  }

  getMaxResults(): number {
    return this.config.knowledgeBase.maxResults;
  }

  getSystemPrompt(): string {
    return this.config.response.systemPrompt;
  }

  isStreamingEnabled(): boolean {
    return this.config.performance.enableStreaming;
  }

  isCachingEnabled(): boolean {
    return this.config.performance.enableCaching;
  }
}

// Export singleton instance
export const chatQnAConfigService = ChatQnAConfigService.getInstance();
