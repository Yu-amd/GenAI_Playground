import { lmStudioService } from './lmStudioService';

// Define types for conversation messages
export interface ConversationMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: Date;
}

// Define types for metadata
export interface DocumentMetadata {
  category?: string;
  tags?: string[];
  author?: string;
  created?: Date;
  updated?: Date;
  [key: string]: string | string[] | Date | undefined;
}

export interface KnowledgeBaseDocument {
  id: string;
  title: string;
  content: string;
  url?: string;
  metadata?: DocumentMetadata;
  embedding?: number[];
}

export interface ChatQnAResponse {
  answer: string;
  sources: Array<{
    title: string;
    url?: string;
    snippet: string;
    confidence: number;
  }>;
  sessionId: string;
  timestamp: Date;
}

export interface ChatQnAConfig {
  embeddingModel: string;
  llmModel: string;
  similarityThreshold: number;
  maxResults: number;
  maxContextLength: number;
  temperature: number;
}

export class ChatQnAService {
  private config: ChatQnAConfig;
  private knowledgeBase: KnowledgeBaseDocument[] = [];
  private sessionContexts: Map<string, ConversationMessage[]> = new Map();

  constructor(config: Partial<ChatQnAConfig> = {}) {
    this.config = {
      embeddingModel: 'text-embedding-ada-002',
      llmModel: 'gpt-4',
      similarityThreshold: 0.7,
      maxResults: 5,
      maxContextLength: 4000,
      temperature: 0.7,
      ...config
    };
    
    // Initialize with sample knowledge base
    this.initializeSampleKnowledgeBase();
  }

  private initializeSampleKnowledgeBase() {
    this.knowledgeBase = [
      {
        id: '1',
        title: 'ChatQnA Architecture Overview',
        content: 'ChatQnA is a powerful chatbot application based on Retrieval Augmented Generation (RAG) architecture. It combines the power of large language models with efficient information retrieval from knowledge bases to provide accurate and context-aware responses.',
        url: 'https://example.com/chatqna-architecture',
        metadata: { category: 'architecture', tags: ['RAG', 'chatbot', 'AI'] }
      },
      {
        id: '2',
        title: 'RAG Implementation Guide',
        content: 'Retrieval Augmented Generation (RAG) works by first retrieving relevant documents from a knowledge base using semantic search, then using those documents as context for the language model to generate accurate responses.',
        url: 'https://example.com/rag-implementation',
        metadata: { category: 'implementation', tags: ['RAG', 'semantic-search', 'context'] }
      },
      {
        id: '3',
        title: 'Vector Database Integration',
        content: 'Vector databases like Pinecone, Weaviate, and Qdrant are essential for RAG systems as they enable efficient similarity search over document embeddings. They store high-dimensional vectors and provide fast retrieval capabilities.',
        url: 'https://example.com/vector-databases',
        metadata: { category: 'databases', tags: ['vector-db', 'embeddings', 'similarity-search'] }
      },
      {
        id: '4',
        title: 'Embedding Models for RAG',
        content: 'Embedding models convert text into numerical vectors that capture semantic meaning. Popular models include OpenAI\'s text-embedding-ada-002, Sentence Transformers, and Cohere embeddings. These enable semantic similarity search.',
        url: 'https://example.com/embedding-models',
        metadata: { category: 'models', tags: ['embeddings', 'semantic-search', 'AI-models'] }
      },
      {
        id: '5',
        title: 'Context Management in Chatbots',
        content: 'Effective context management is crucial for maintaining coherent conversations. This involves managing conversation history, session state, and context windowing to ensure the chatbot remembers previous interactions.',
        url: 'https://example.com/context-management',
        metadata: { category: 'chatbot', tags: ['context', 'conversation', 'session-management'] }
      }
    ];
  }

  private async generateEmbedding(text: string): Promise<number[]> {
    // Simulate embedding generation
    // In a real implementation, this would call an embedding service
    const words = text.toLowerCase().split(/\s+/);
    const embedding = new Array(1536).fill(0);
    
    words.forEach((word, index) => {
      const hash = word.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
      embedding[index % 1536] = (hash % 100) / 100;
    });
    
    return embedding;
  }

  private calculateSimilarity(embedding1: number[], embedding2: number[]): number {
    // Calculate cosine similarity
    const dotProduct = embedding1.reduce((sum, val, i) => sum + val * embedding2[i], 0);
    const magnitude1 = Math.sqrt(embedding1.reduce((sum, val) => sum + val * val, 0));
    const magnitude2 = Math.sqrt(embedding2.reduce((sum, val) => sum + val * val, 0));
    
    return dotProduct / (magnitude1 * magnitude2);
  }

  private async retrieveRelevantDocuments(query: string): Promise<KnowledgeBaseDocument[]> {
    const queryEmbedding = await this.generateEmbedding(query);
    
    const scoredDocuments = await Promise.all(
      this.knowledgeBase.map(async (doc) => {
        const docEmbedding = doc.embedding || await this.generateEmbedding(doc.content);
        doc.embedding = docEmbedding;
        
        const similarity = this.calculateSimilarity(queryEmbedding, docEmbedding);
        return { document: doc, similarity };
      })
    );

    return scoredDocuments
      .filter(item => item.similarity >= this.config.similarityThreshold)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, this.config.maxResults)
      .map(item => item.document);
  }

  private buildContext(documents: KnowledgeBaseDocument[], conversationHistory: ConversationMessage[]): string {
    const documentContext = documents
      .map(doc => `Document: ${doc.title}\nContent: ${doc.content}\n`)
      .join('\n');

    const conversationContext = conversationHistory
      .slice(-5) // Last 5 messages
      .map(msg => `${msg.role}: ${msg.content}`)
      .join('\n');

    return `Context from Knowledge Base:\n${documentContext}\n\nRecent Conversation:\n${conversationContext}`;
  }

  private async generateResponse(
    query: string, 
    context: string
  ): Promise<string> {
    const systemPrompt = `You are a helpful AI assistant powered by a RAG (Retrieval Augmented Generation) system. 
    
Your role is to:
1. Use the provided context from the knowledge base to answer questions accurately
2. Cite sources when appropriate
3. Be conversational and helpful
4. If the context doesn't contain relevant information, say so clearly
5. Maintain conversation context from previous messages

Current context:
${context}

Please provide a helpful response to the user's query.`;

    const messages = [
      { role: 'system' as const, content: systemPrompt },
      { role: 'user' as const, content: query }
    ];

    try {
      const response = await lmStudioService.chatCompletion({
        messages,
        temperature: this.config.temperature,
        max_tokens: 1000
      });

      return response.choices[0]?.message?.content || 'I apologize, but I was unable to generate a response.';
    } catch (error) {
      console.error('Error generating response:', error);
      return 'I apologize, but I encountered an error while processing your request. Please try again.';
    }
  }

  async ask(
    query: string, 
    sessionId: string = 'default'
  ): Promise<ChatQnAResponse> {
    try {
      // Retrieve relevant documents
      const relevantDocs = await this.retrieveRelevantDocuments(query);
      
      // Get conversation history
      const conversationHistory = this.sessionContexts.get(sessionId) || [];
      
      // Build context
      const context = this.buildContext(relevantDocs, conversationHistory);
      
      // Generate response
      const answer = await this.generateResponse(query, context);
      
      // Update conversation history
      conversationHistory.push(
        { role: 'user', content: query },
        { role: 'assistant', content: answer }
      );
      this.sessionContexts.set(sessionId, conversationHistory.slice(-10)); // Keep last 10 messages
      
      // Prepare sources
      const sources = relevantDocs.map(doc => ({
        title: doc.title,
        url: doc.url,
        snippet: doc.content.substring(0, 200) + '...',
        confidence: 0.85 + Math.random() * 0.1 // Simulate confidence score
      }));

      return {
        answer,
        sources,
        sessionId,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Error in ChatQnA ask:', error);
      throw new Error('Failed to process your question. Please try again.');
    }
  }

  async addDocument(document: Omit<KnowledgeBaseDocument, 'id'>): Promise<string> {
    const id = Date.now().toString();
    const embedding = await this.generateEmbedding(document.content);
    
    const newDoc: KnowledgeBaseDocument = {
      ...document,
      id,
      embedding
    };
    
    this.knowledgeBase.push(newDoc);
    return id;
  }

  async removeDocument(id: string): Promise<boolean> {
    const index = this.knowledgeBase.findIndex(doc => doc.id === id);
    if (index !== -1) {
      this.knowledgeBase.splice(index, 1);
      return true;
    }
    return false;
  }

  getKnowledgeBaseStats() {
    return {
      totalDocuments: this.knowledgeBase.length,
      categories: this.knowledgeBase.reduce((acc, doc) => {
        const category = doc.metadata?.category || 'uncategorized';
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };
  }

  updateConfig(newConfig: Partial<ChatQnAConfig>) {
    this.config = { ...this.config, ...newConfig };
  }
}

// Create a singleton instance
export const chatQnAService = new ChatQnAService(); 