import React, { useState, useEffect } from 'react';
import { chatQnAService } from '../services/chatQnAService';
import type { KnowledgeBaseDocument } from '../services/chatQnAService';

interface KnowledgeBaseManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface KnowledgeBaseStats {
  totalDocuments: number;
  categories: Record<string, number>;
}

const KnowledgeBaseManager: React.FC<KnowledgeBaseManagerProps> = ({
  isOpen,
  onClose,
}) => {
  const [documents, setDocuments] = useState<KnowledgeBaseDocument[]>([]);
  const [stats, setStats] = useState<KnowledgeBaseStats | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDocument, setNewDocument] = useState({
    title: '',
    content: '',
    url: '',
    category: '',
    tags: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadDocuments();
      loadStats();
    }
  }, [isOpen]);

  const loadDocuments = async () => {
    // In a real implementation, this would fetch from the service
    // For now, we'll simulate with the sample data
    const sampleDocs = [
      {
        id: '1',
        title: 'ChatQnA Architecture Overview',
        content:
          'ChatQnA is a powerful chatbot application based on Retrieval Augmented Generation (RAG) architecture...',
        url: 'https://example.com/chatqna-architecture',
        metadata: { category: 'architecture', tags: ['RAG', 'chatbot', 'AI'] },
      },
      {
        id: '2',
        title: 'RAG Implementation Guide',
        content:
          'Retrieval Augmented Generation (RAG) works by first retrieving relevant documents...',
        url: 'https://example.com/rag-implementation',
        metadata: {
          category: 'implementation',
          tags: ['RAG', 'semantic-search', 'context'],
        },
      },
      {
        id: '3',
        title: 'Vector Database Integration',
        content:
          'Vector databases like Pinecone, Weaviate, and Qdrant are essential for RAG systems...',
        url: 'https://example.com/vector-databases',
        metadata: {
          category: 'databases',
          tags: ['vector-db', 'embeddings', 'similarity-search'],
        },
      },
    ];
    setDocuments(sampleDocs);
  };

  const loadStats = async () => {
    const stats = chatQnAService.getKnowledgeBaseStats();
    setStats(stats);
  };

  const handleAddDocument = async () => {
    if (!newDocument.title || !newDocument.content) {
      alert('Please fill in title and content');
      return;
    }

    setIsLoading(true);
    try {
      const tags = newDocument.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag);
      const metadata = {
        category: newDocument.category || 'uncategorized',
        tags,
      };

      await chatQnAService.addDocument({
        title: newDocument.title,
        content: newDocument.content,
        url: newDocument.url || undefined,
        metadata,
      });

      setNewDocument({
        title: '',
        content: '',
        url: '',
        category: '',
        tags: '',
      });
      setShowAddForm(false);
      loadDocuments();
      loadStats();
    } catch (error) {
      console.error('Error adding document:', error);
      alert('Failed to add document');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveDocument = async (id: string) => {
    if (window.confirm('Are you sure you want to remove this document?')) {
      try {
        await chatQnAService.removeDocument(id);
        loadDocuments();
        loadStats();
      } catch (error) {
        console.error('Error removing document:', error);
        alert('Failed to remove document');
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-neutral-900 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto'>
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-xl font-bold text-white'>
            Knowledge Base Manager
          </h2>
          <button onClick={onClose} className='text-gray-400 hover:text-white'>
            ✕
          </button>
        </div>

        {/* Stats */}
        {stats && (
          <div className='bg-neutral-800 rounded-lg p-4 mb-6'>
            <h3 className='text-lg font-semibold text-white mb-3'>
              Knowledge Base Statistics
            </h3>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
              <div className='text-center'>
                <div className='text-2xl font-bold text-blue-400'>
                  {stats.totalDocuments}
                </div>
                <div className='text-sm text-gray-400'>Total Documents</div>
              </div>
              {Object.entries(stats.categories).map(([category, count]) => (
                <div key={category} className='text-center'>
                  <div className='text-lg font-semibold text-green-400'>
                    {count as number}
                  </div>
                  <div className='text-sm text-gray-400 capitalize'>
                    {category}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add Document Button */}
        <div className='mb-6'>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg'
          >
            {showAddForm ? 'Cancel' : 'Add New Document'}
          </button>
        </div>

        {/* Add Document Form */}
        {showAddForm && (
          <div className='bg-neutral-800 rounded-lg p-4 mb-6'>
            <h3 className='text-lg font-semibold text-white mb-4'>
              Add New Document
            </h3>
            <div className='space-y-4'>
              <div>
                <label className='block text-sm text-gray-400 mb-1'>
                  Title *
                </label>
                <input
                  type='text'
                  value={newDocument.title}
                  onChange={e =>
                    setNewDocument(prev => ({ ...prev, title: e.target.value }))
                  }
                  className='w-full bg-neutral-700 text-white rounded px-3 py-2 border border-neutral-600 focus:border-blue-500 focus:outline-none'
                  placeholder='Document title'
                />
              </div>
              <div>
                <label className='block text-sm text-gray-400 mb-1'>
                  Content *
                </label>
                <textarea
                  value={newDocument.content}
                  onChange={e =>
                    setNewDocument(prev => ({
                      ...prev,
                      content: e.target.value,
                    }))
                  }
                  className='w-full bg-neutral-700 text-white rounded px-3 py-2 border border-neutral-600 focus:border-blue-500 focus:outline-none'
                  rows={4}
                  placeholder='Document content'
                />
              </div>
              <div>
                <label className='block text-sm text-gray-400 mb-1'>
                  URL (optional)
                </label>
                <input
                  type='url'
                  value={newDocument.url}
                  onChange={e =>
                    setNewDocument(prev => ({ ...prev, url: e.target.value }))
                  }
                  className='w-full bg-neutral-700 text-white rounded px-3 py-2 border border-neutral-600 focus:border-blue-500 focus:outline-none'
                  placeholder='https://example.com/document'
                />
              </div>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm text-gray-400 mb-1'>
                    Category
                  </label>
                  <input
                    type='text'
                    value={newDocument.category}
                    onChange={e =>
                      setNewDocument(prev => ({
                        ...prev,
                        category: e.target.value,
                      }))
                    }
                    className='w-full bg-neutral-700 text-white rounded px-3 py-2 border border-neutral-600 focus:border-blue-500 focus:outline-none'
                    placeholder='e.g., architecture, implementation'
                  />
                </div>
                <div>
                  <label className='block text-sm text-gray-400 mb-1'>
                    Tags (comma-separated)
                  </label>
                  <input
                    type='text'
                    value={newDocument.tags}
                    onChange={e =>
                      setNewDocument(prev => ({
                        ...prev,
                        tags: e.target.value,
                      }))
                    }
                    className='w-full bg-neutral-700 text-white rounded px-3 py-2 border border-neutral-600 focus:border-blue-500 focus:outline-none'
                    placeholder='RAG, chatbot, AI'
                  />
                </div>
              </div>
              <div className='flex justify-end space-x-3'>
                <button
                  onClick={() => setShowAddForm(false)}
                  className='px-4 py-2 text-gray-400 hover:text-white'
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddDocument}
                  disabled={isLoading}
                  className='bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg disabled:opacity-50'
                >
                  {isLoading ? 'Adding...' : 'Add Document'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Documents List */}
        <div>
          <h3 className='text-lg font-semibold text-white mb-4'>Documents</h3>
          <div className='space-y-4'>
            {documents.map(doc => (
              <div
                key={doc.id}
                className='bg-neutral-800 rounded-lg p-4 border border-neutral-700'
              >
                <div className='flex justify-between items-start'>
                  <div className='flex-1'>
                    <h4 className='text-lg font-semibold text-white mb-2'>
                      {doc.title}
                    </h4>
                    <p className='text-gray-300 text-sm mb-3 line-clamp-2'>
                      {doc.content}
                    </p>
                    {doc.url && (
                      <a
                        href={doc.url}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-blue-400 hover:text-blue-300 text-sm'
                      >
                        {doc.url}
                      </a>
                    )}
                    <div className='flex flex-wrap gap-2 mt-3'>
                      {doc.metadata?.category && (
                        <span className='bg-blue-900/50 text-blue-200 px-2 py-1 rounded text-xs'>
                          {doc.metadata.category}
                        </span>
                      )}
                      {doc.metadata?.tags?.map((tag: string, index: number) => (
                        <span
                          key={index}
                          className='bg-green-900/50 text-green-200 px-2 py-1 rounded text-xs'
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveDocument(doc.id)}
                    className='text-red-400 hover:text-red-300 ml-4'
                    title='Remove document'
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeBaseManager;
