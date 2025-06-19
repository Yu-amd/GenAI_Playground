# ChatQnA Blueprint Implementation

## Overview

The ChatQnA blueprint is a comprehensive implementation of a Retrieval Augmented Generation (RAG) chatbot system. It demonstrates how to build an intelligent question-answering system that combines the power of large language models with efficient information retrieval from knowledge bases.

## Features

### 🚀 Core RAG Architecture
- **Semantic Search**: Advanced embedding-based document retrieval
- **Context-Aware Responses**: Maintains conversation history and context
- **Source Attribution**: Provides references to knowledge base sources
- **Real-time Processing**: Streams responses for better user experience

### 📚 Knowledge Base Management
- **Document Ingestion**: Add, edit, and remove documents from the knowledge base
- **Metadata Support**: Categorize documents with tags and categories
- **Statistics Dashboard**: View knowledge base analytics and document counts
- **Flexible Storage**: Support for vector databases, document stores, and SQL databases

### ⚙️ Configuration Management
- **Embedding Models**: Configurable embedding generation (OpenAI, Sentence Transformers, etc.)
- **Language Models**: Support for various LLM providers (OpenAI, Anthropic, Local models)
- **Performance Tuning**: Adjustable similarity thresholds, context lengths, and caching
- **System Prompts**: Customizable response generation prompts

### 🎯 Interactive Features
- **Real-time Chat Interface**: Modern, responsive chat UI
- **Streaming Responses**: Word-by-word response generation
- **Source Display**: Show relevant documents and confidence scores
- **Session Management**: Maintain conversation context across sessions

## Architecture

### Core Components

1. **ChatQnAService** (`src/services/chatQnAService.ts`)
   - Main RAG orchestration service
   - Handles document retrieval and response generation
   - Manages conversation sessions and context

2. **KnowledgeBaseManager** (`src/components/KnowledgeBaseManager.tsx`)
   - UI component for managing knowledge base documents
   - Add, edit, remove, and categorize documents
   - View knowledge base statistics

3. **ChatQnAConfigService** (`src/services/chatQnAConfigService.ts`)
   - Configuration management with local storage persistence
   - System-wide settings for models, performance, and responses

4. **LMStudioService** (`src/services/lmStudioService.ts`)
   - Integration with local LLM inference services
   - Support for streaming responses
   - Error handling and connection management

### Data Flow

```
User Query → Query Processing → Embedding Generation → 
Semantic Search → Context Building → LLM Generation → 
Response Streaming → Source Attribution
```

## Getting Started

### Prerequisites

1. **Node.js 16+** and **npm**
2. **LM Studio** (for local LLM inference) or API access to LLM services
3. **Vector Database** (optional, for production use)

### Installation

1. Clone the repository and navigate to the project:
   ```bash
   cd ih-mockup-demo
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Navigate to the ChatQnA blueprint:
   ```
   http://localhost:5173/blueprints/chatqna
   ```

### Configuration

#### LM Studio Setup (Recommended for Local Development)

1. Download and install [LM Studio](https://lmstudio.ai/)
2. Load a language model (e.g., Llama 3.1, Qwen2, etc.)
3. Start the local server on port 1234
4. The ChatQnA service will automatically connect to the local LM Studio instance

#### Knowledge Base Setup

1. Click the "KB" button in the chat interface to open the Knowledge Base Manager
2. Add sample documents or your own content
3. Categorize documents with tags for better organization
4. The system will automatically generate embeddings for semantic search

## Usage

### Basic Chat Interaction

1. **Ask Questions**: Type questions in the chat interface
2. **View Sources**: Click on source links to see relevant documents
3. **Manage Knowledge**: Use the KB button to add/remove documents
4. **Configure Settings**: Use the settings gear to adjust system parameters

### Knowledge Base Management

#### Adding Documents
1. Open the Knowledge Base Manager
2. Click "Add New Document"
3. Fill in:
   - **Title**: Document title
   - **Content**: Main document content
   - **URL**: Optional source URL
   - **Category**: Document category (e.g., "architecture", "implementation")
   - **Tags**: Comma-separated tags for better search

#### Document Categories
- **Architecture**: System design and architecture documents
- **Implementation**: Code examples and implementation guides
- **Databases**: Vector database and storage information
- **Models**: AI model documentation and usage
- **Chatbot**: Conversation and interaction patterns

### Configuration Options

#### Knowledge Base Settings
- **Type**: Vector database, document store, or SQL database
- **Connection String**: Database connection details
- **Embedding Model**: Model for generating document embeddings
- **Similarity Threshold**: Minimum similarity score for document retrieval

#### Model Configuration
- **Embedding Provider**: OpenAI, Cohere, Sentence Transformers
- **Language Model**: GPT-4, Claude, Llama, etc.
- **Temperature**: Response creativity (0.0-1.0)
- **Max Tokens**: Maximum response length

#### Performance Settings
- **Caching**: Enable response caching for faster retrieval
- **Streaming**: Enable real-time response streaming
- **Batch Size**: Number of documents to process simultaneously

## API Reference

### ChatQnAService

```typescript
// Ask a question
const response = await chatQnAService.ask(
  "What is RAG architecture?", 
  "session-id"
);

// Add a document
const docId = await chatQnAService.addDocument({
  title: "RAG Overview",
  content: "Retrieval Augmented Generation...",
  url: "https://example.com/rag",
  metadata: { category: "architecture", tags: ["RAG", "AI"] }
});

// Get knowledge base statistics
const stats = chatQnAService.getKnowledgeBaseStats();
```

### Configuration Service

```typescript
// Get current configuration
const config = chatQnAConfigService.getConfig();

// Update knowledge base settings
chatQnAConfigService.updateKnowledgeBaseConfig({
  similarityThreshold: 0.8,
  maxResults: 10
});

// Update model settings
chatQnAConfigService.updateModelConfig({
  language: { temperature: 0.5, maxTokens: 1000 }
});
```

## Sample Knowledge Base

The system comes pre-loaded with sample documents covering:

1. **ChatQnA Architecture Overview**
   - RAG system design and components
   - Integration patterns and best practices

2. **RAG Implementation Guide**
   - Step-by-step implementation instructions
   - Code examples and configuration

3. **Vector Database Integration**
   - Pinecone, Weaviate, Qdrant setup
   - Performance optimization tips

4. **Embedding Models for RAG**
   - Model selection and comparison
   - Embedding generation strategies

5. **Context Management in Chatbots**
   - Session handling and conversation flow
   - Memory optimization techniques

## Customization

### Adding Custom Embedding Models

```typescript
// In chatQnAService.ts, modify the generateEmbedding method
private async generateEmbedding(text: string): Promise<number[]> {
  // Replace with your embedding service call
  const response = await fetch('your-embedding-service', {
    method: 'POST',
    body: JSON.stringify({ text })
  });
  return response.json();
}
```

### Integrating External Vector Databases

```typescript
// Add vector database integration
private async searchVectorDB(queryEmbedding: number[]): Promise<Document[]> {
  // Implement your vector database search
  const results = await pineconeClient.query({
    vector: queryEmbedding,
    topK: this.config.maxResults
  });
  return results.matches.map(match => match.metadata);
}
```

### Custom Response Templates

```typescript
// Modify the system prompt in the configuration
chatQnAConfigService.updateResponseConfig({
  systemPrompt: `You are a specialized AI assistant for [your domain].
  Always provide accurate, helpful responses based on the knowledge base.
  Include relevant examples and cite sources when appropriate.`
});
```

## Troubleshooting

### Common Issues

1. **LM Studio Connection Error**
   - Ensure LM Studio is running on port 1234
   - Check that a model is loaded and the server is started
   - Verify network connectivity

2. **No Relevant Documents Found**
   - Lower the similarity threshold in settings
   - Add more documents to the knowledge base
   - Check document content quality and relevance

3. **Slow Response Times**
   - Enable caching in performance settings
   - Reduce the number of retrieved documents
   - Optimize embedding generation

4. **Poor Answer Quality**
   - Review and improve knowledge base content
   - Adjust the system prompt
   - Fine-tune model parameters

### Performance Optimization

1. **Embedding Caching**: Cache document embeddings to avoid regeneration
2. **Batch Processing**: Process multiple queries in batches
3. **Index Optimization**: Use efficient vector database indexes
4. **Response Streaming**: Enable streaming for better user experience

## Contributing

To enhance the ChatQnA blueprint:

1. **Add New Features**: Implement additional RAG capabilities
2. **Improve UI**: Enhance the chat interface and knowledge base manager
3. **Optimize Performance**: Improve embedding generation and retrieval
4. **Add Tests**: Create comprehensive test coverage
5. **Documentation**: Update documentation and examples

## License

This ChatQnA blueprint implementation is part of the OPEA (Open Platform for Enterprise AI) project.

## Support

For questions and support regarding the ChatQnA blueprint:
- Check the troubleshooting section above
- Review the configuration options
- Examine the sample knowledge base for examples
- Contact the OPEA team for additional assistance 