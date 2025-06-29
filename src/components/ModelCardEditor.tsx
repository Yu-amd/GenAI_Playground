import React, { useState, useEffect } from 'react';
import { 
  PencilIcon, 
  EyeIcon, 
  DocumentTextIcon,
  PlusIcon,
  TrashIcon,
  CheckIcon,
  Cog6ToothIcon,
  CodeBracketIcon,
  ListBulletIcon,
  LinkIcon,
  CloudIcon
} from '@heroicons/react/24/outline';

interface ModelCard {
  overview: string;
  intended_use: readonly string[];
  limitations: readonly string[];
  training_data: string;
  evaluation: readonly string[];
  known_issues: readonly string[];
  references: readonly string[];
}

interface ModelCardEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (content: ModelCard) => void;
  initialContent?: ModelCard;
}

const ModelCardEditor: React.FC<ModelCardEditorProps> = ({ 
  isOpen, 
  onClose, 
  onSave,
  initialContent 
}) => {
  const [activeView, setActiveView] = useState<'editor' | 'preview'>('editor');
  const [content, setContent] = useState<ModelCard>({
    overview: '',
    intended_use: [] as string[],
    limitations: [] as string[],
    training_data: '',
    evaluation: [] as string[],
    known_issues: [] as string[],
    references: [] as string[]
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadContent();
    }
  }, [isOpen, initialContent]);

  const loadContent = () => {
    setIsLoading(true);
    try {
      if (initialContent) {
        setContent({
          overview: initialContent.overview,
          intended_use: [...initialContent.intended_use],
          limitations: [...initialContent.limitations],
          training_data: initialContent.training_data,
          evaluation: [...initialContent.evaluation],
          known_issues: [...initialContent.known_issues],
          references: [...initialContent.references]
        });
      }
    } catch (error) {
      console.error('Failed to load content:', error);
      // Fallback to empty content if loading fails
      setContent({
        overview: '',
        intended_use: [] as string[],
        limitations: [] as string[],
        training_data: '',
        evaluation: [] as string[],
        known_issues: [] as string[],
        references: [] as string[]
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Call the onSave callback if provided
      if (onSave) {
        onSave(content);
      }
      
      // Show success message
      alert('Model card content saved successfully!');
    } catch (error) {
      console.error('Failed to save content:', error);
      alert('Failed to save content. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const addListItem = (field: keyof ModelCard) => {
    if (Array.isArray(content[field])) {
      setContent({
        ...content,
        [field]: [...(content[field] as readonly string[]), '']
      });
    }
  };

  const updateListItem = (field: keyof ModelCard, index: number, value: string) => {
    if (Array.isArray(content[field])) {
      const newArray = [...(content[field] as readonly string[])];
      newArray[index] = value;
      setContent({
        ...content,
        [field]: newArray
      });
    }
  };

  const removeListItem = (field: keyof ModelCard, index: number) => {
    if (Array.isArray(content[field])) {
      const newArray = [...(content[field] as readonly string[])];
      newArray.splice(index, 1);
      setContent({
        ...content,
        [field]: newArray
      });
    }
  };

  const renderEditor = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-400">Loading...</div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Overview */}
        <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-600/30">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <DocumentTextIcon className="w-5 h-5" />
            Overview
          </h3>
          <textarea
            value={content.overview}
            onChange={(e) => setContent({ ...content, overview: e.target.value })}
            className="w-full h-32 bg-gray-900/50 border border-gray-600/30 rounded-lg p-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
            placeholder="Enter model overview..."
          />
        </div>

        {/* Intended Use */}
        <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-600/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
              <ListBulletIcon className="w-5 h-5" />
              Intended Use
            </h3>
            <button
              onClick={() => addListItem('intended_use')}
              className="flex items-center gap-2 px-3 py-1.5 bg-green-600/20 text-green-400 rounded-lg border border-green-500/30 hover:bg-green-600/30 transition-all text-sm"
            >
              <PlusIcon className="w-4 h-4" />
              Add Item
            </button>
          </div>
          <div className="space-y-3">
            {content.intended_use.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => updateListItem('intended_use', index, e.target.value)}
                  className="flex-1 bg-gray-900/50 border border-gray-600/30 rounded-lg p-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  placeholder="Enter intended use case..."
                />
                <button
                  onClick={() => removeListItem('intended_use', index)}
                  className="p-2 text-red-400 hover:text-red-300 hover:bg-red-600/20 rounded-lg transition-all"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Limitations */}
        <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-600/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
              <Cog6ToothIcon className="w-5 h-5" />
              Limitations
            </h3>
            <button
              onClick={() => addListItem('limitations')}
              className="flex items-center gap-2 px-3 py-1.5 bg-orange-600/20 text-orange-400 rounded-lg border border-orange-500/30 hover:bg-orange-600/30 transition-all text-sm"
            >
              <PlusIcon className="w-4 h-4" />
              Add Item
            </button>
          </div>
          <div className="space-y-3">
            {content.limitations.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => updateListItem('limitations', index, e.target.value)}
                  className="flex-1 bg-gray-900/50 border border-gray-600/30 rounded-lg p-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  placeholder="Enter limitation..."
                />
                <button
                  onClick={() => removeListItem('limitations', index)}
                  className="p-2 text-red-400 hover:text-red-300 hover:bg-red-600/20 rounded-lg transition-all"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Training Data */}
        <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-600/30">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <CodeBracketIcon className="w-5 h-5" />
            Training Data
          </h3>
          <textarea
            value={content.training_data}
            onChange={(e) => setContent({ ...content, training_data: e.target.value })}
            className="w-full h-32 bg-gray-900/50 border border-gray-600/30 rounded-lg p-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
            placeholder="Enter training data information..."
          />
        </div>

        {/* Evaluation */}
        <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-600/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
              <CloudIcon className="w-5 h-5" />
              Evaluation
            </h3>
            <button
              onClick={() => addListItem('evaluation')}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-600/20 text-blue-400 rounded-lg border border-blue-500/30 hover:bg-blue-600/30 transition-all text-sm"
            >
              <PlusIcon className="w-4 h-4" />
              Add Item
            </button>
          </div>
          <div className="space-y-3">
            {content.evaluation.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => updateListItem('evaluation', index, e.target.value)}
                  className="flex-1 bg-gray-900/50 border border-gray-600/30 rounded-lg p-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  placeholder="Enter evaluation metric..."
                />
                <button
                  onClick={() => removeListItem('evaluation', index)}
                  className="p-2 text-red-400 hover:text-red-300 hover:bg-red-600/20 rounded-lg transition-all"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Known Issues */}
        <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-600/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
              <Cog6ToothIcon className="w-5 h-5" />
              Known Issues
            </h3>
            <button
              onClick={() => addListItem('known_issues')}
              className="flex items-center gap-2 px-3 py-1.5 bg-red-600/20 text-red-400 rounded-lg border border-red-500/30 hover:bg-red-600/30 transition-all text-sm"
            >
              <PlusIcon className="w-4 h-4" />
              Add Item
            </button>
          </div>
          <div className="space-y-3">
            {content.known_issues.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => updateListItem('known_issues', index, e.target.value)}
                  className="flex-1 bg-gray-900/50 border border-gray-600/30 rounded-lg p-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  placeholder="Enter known issue..."
                />
                <button
                  onClick={() => removeListItem('known_issues', index)}
                  className="p-2 text-red-400 hover:text-red-300 hover:bg-red-600/20 rounded-lg transition-all"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* References */}
        <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-600/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
              <LinkIcon className="w-5 h-5" />
              References
            </h3>
            <button
              onClick={() => addListItem('references')}
              className="flex items-center gap-2 px-3 py-1.5 bg-purple-600/20 text-purple-400 rounded-lg border border-purple-500/30 hover:bg-purple-600/30 transition-all text-sm"
            >
              <PlusIcon className="w-4 h-4" />
              Add Item
            </button>
          </div>
          <div className="space-y-3">
            {content.references.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => updateListItem('references', index, e.target.value)}
                  className="flex-1 bg-gray-900/50 border border-gray-600/30 rounded-lg p-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  placeholder="Enter reference URL or citation..."
                />
                <button
                  onClick={() => removeListItem('references', index)}
                  className="p-2 text-red-400 hover:text-red-300 hover:bg-red-600/20 rounded-lg transition-all"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderPreview = () => {
    return (
      <div className="space-y-6">
        {/* Overview */}
        {content.overview && (
          <section className="mb-8">
            <h2 className="text-3xl font-bold mb-4 text-white">Overview</h2>
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-200 whitespace-pre-wrap">{content.overview}</p>
              </div>
            </div>
          </section>
        )}

        {/* Intended Use */}
        {content.intended_use && content.intended_use.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-white">Intended Use</h2>
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <ul className="list-disc pl-6 space-y-2 text-gray-200">
                {content.intended_use.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* Limitations */}
        {content.limitations && content.limitations.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-white">Limitations</h2>
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <ul className="list-disc pl-6 space-y-2 text-gray-200">
                {content.limitations.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* Training Data */}
        {content.training_data && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-white">Training Data</h2>
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-200 whitespace-pre-wrap">{content.training_data}</p>
              </div>
            </div>
          </section>
        )}

        {/* Evaluation */}
        {content.evaluation && content.evaluation.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-white">Evaluation</h2>
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <ul className="list-disc pl-6 space-y-2 text-gray-200">
                {content.evaluation.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* Known Issues */}
        {content.known_issues && content.known_issues.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-white">Known Issues</h2>
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <ul className="list-disc pl-6 space-y-2 text-gray-200">
                {content.known_issues.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* References */}
        {content.references && content.references.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-white">References</h2>
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <ul className="list-disc pl-6 space-y-2 text-gray-200">
                {content.references.map((ref, idx) => (
                  <li key={idx}>
                    {ref.startsWith('http') ? (
                      <a href={ref} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline hover:text-blue-300 transition-colors">{ref}</a>
                    ) : (
                      ref
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-600/30 p-8 w-full max-w-6xl mx-auto overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <DocumentTextIcon className="w-6 h-6 text-blue-400" />
              Model Card Editor
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveView('editor')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all text-sm font-medium ${
                  activeView === 'editor'
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                    : 'bg-gray-700/30 text-gray-400 border border-gray-600/30 hover:bg-gray-600/30'
                }`}
              >
                <PencilIcon className="w-4 h-4" />
                Editor
              </button>
              <button
                onClick={() => setActiveView('preview')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all text-sm font-medium ${
                  activeView === 'preview'
                    ? 'bg-green-600/20 text-green-400 border border-green-500/30'
                    : 'bg-gray-700/30 text-gray-400 border border-gray-600/30 hover:bg-gray-600/30'
                }`}
              >
                <EyeIcon className="w-4 h-4" />
                Preview
              </button>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-all text-2xl"
            title="Close"
          >
            &times;
          </button>
        </div>

        {/* Content */}
        <div className="mb-6">
          {activeView === 'editor' ? renderEditor() : renderPreview()}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-600/30">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-700/50 text-gray-300 rounded-lg border border-gray-600/30 hover:bg-gray-600/50 transition-all font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2 bg-blue-600/20 text-blue-400 rounded-lg border border-blue-500/30 hover:bg-blue-600/30 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                Saving...
              </>
            ) : (
              <>
                <CheckIcon className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModelCardEditor; 