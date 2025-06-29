import React, { useState } from 'react';
import { 
  DocumentTextIcon, 
  PencilIcon, 
  EyeIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import DeploymentGuideEditor from '../components/DeploymentGuideEditor';
import { Link } from 'react-router-dom';

const ContentEditorDemo: React.FC = () => {
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
              >
                <ArrowLeftIcon className="w-5 h-5" />
                Back to Playground
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <DocumentTextIcon className="w-6 h-6 text-blue-400" />
              <h1 className="text-xl font-semibold">Content Editor Demo</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Introduction */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-4">
              Deployment Guide Content Editor
            </h2>
            <p className="text-gray-300 mb-6">
              This demo showcases a comprehensive UI for managing deployment guide content. 
              The editor allows you to modify sections, add new content, and preview changes 
              in real-time before saving to the JSON configuration file.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-600/10 border border-blue-500/20 rounded-lg p-4">
                <h3 className="font-semibold text-blue-300 mb-2">Visual Editing</h3>
                <p className="text-sm text-gray-300">
                  Intuitive interface for editing deployment guide content without touching JSON files.
                </p>
              </div>
              <div className="bg-green-600/10 border border-green-500/20 rounded-lg p-4">
                <h3 className="font-semibold text-green-300 mb-2">Real-time Preview</h3>
                <p className="text-sm text-gray-300">
                  Switch between edit and preview modes to see how your changes will look.
                </p>
              </div>
              <div className="bg-purple-600/10 border border-purple-500/20 rounded-lg p-4">
                <h3 className="font-semibold text-purple-300 mb-2">Content Validation</h3>
                <p className="text-sm text-gray-300">
                  Built-in validation ensures content structure remains consistent and error-free.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsEditorOpen(true)}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all font-medium"
              >
                <PencilIcon className="w-5 h-5" />
                Open Content Editor
              </button>
              <button
                onClick={() => setIsEditorOpen(true)}
                className="flex items-center gap-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-all font-medium"
              >
                <EyeIcon className="w-5 h-5" />
                Preview Mode
              </button>
            </div>
          </div>

          {/* Features */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-4">Editor Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-200 mb-3">Content Management</h4>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>• Edit categories, tabs, and sections</li>
                  <li>• Add/remove content blocks</li>
                  <li>• Reorder sections with drag-and-drop</li>
                  <li>• Bulk operations for multiple items</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-200 mb-3">Section Types</h4>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>• Overview sections with feature lists</li>
                  <li>• Requirements with checkable items</li>
                  <li>• Code blocks with syntax highlighting</li>
                  <li>• Provider lists with model information</li>
                  <li>• Resource links with descriptions</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-200 mb-3">Template Variables</h4>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>• Dynamic content with {'{{modelName}}'}</li>
                  <li>• {'{{modelSize}}'} and {'{{modelRequirements}}'}</li>
                  <li>• Automatic variable replacement</li>
                  <li>• Preview with sample data</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-200 mb-3">Export & Import</h4>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>• Export content as JSON</li>
                  <li>• Import from external sources</li>
                  <li>• Version control integration</li>
                  <li>• Backup and restore functionality</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Usage Instructions */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-4">How to Use</h3>
            <div className="space-y-4 text-sm text-gray-300">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <p className="font-medium text-white">Open the Content Editor</p>
                  <p>Click the "Open Content Editor" button above to launch the editing interface.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <p className="font-medium text-white">Navigate Content Structure</p>
                  <p>Use the sidebar to select categories, tabs, and sections you want to edit.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <p className="font-medium text-white">Edit Content</p>
                  <p>Click on sections to expand them and modify titles, descriptions, and content.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5">
                  4
                </div>
                <div>
                  <p className="font-medium text-white">Preview Changes</p>
                  <p>Switch to preview mode to see how your changes will appear to users.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5">
                  5
                </div>
                <div>
                  <p className="font-medium text-white">Save Content</p>
                  <p>Click "Save" to store your changes to the JSON configuration file.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Technical Details */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-4">Technical Implementation</h3>
            <div className="space-y-4 text-sm text-gray-300">
              <div>
                <h4 className="font-medium text-gray-200 mb-2">File Structure</h4>
                <pre className="bg-gray-900 p-3 rounded text-xs overflow-x-auto">
{`src/
├── components/
│   ├── DeploymentGuideEditor.tsx    # Main editor component
│   └── DeploymentGuide.tsx          # Updated with edit button
├── services/
│   └── deploymentGuideService.ts    # Content management service
└── data/
    └── deployment-guide-content.json # Content configuration`}
                </pre>
              </div>
              <div>
                <h4 className="font-medium text-gray-200 mb-2">Key Features</h4>
                <ul className="space-y-1">
                  <li>• React-based UI with TypeScript</li>
                  <li>• Real-time content validation</li>
                  <li>• Template variable processing</li>
                  <li>• JSON-based content storage</li>
                  <li>• Responsive design for all devices</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Editor Modal */}
      <DeploymentGuideEditor
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSave={(content) => {
          console.log('Content saved:', content);
          alert('Content saved successfully! Check the browser console for details.');
        }}
      />
    </div>
  );
};

export default ContentEditorDemo; 