import React, { useState, useEffect } from 'react';
import { 
  PencilIcon, 
  EyeIcon, 
  DocumentTextIcon,
  PlusIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon,
  Cog6ToothIcon,
  CodeBracketIcon,
  ListBulletIcon,
  LinkIcon,
  CloudIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import { deploymentGuideService, DeploymentGuideService } from '../services/deploymentGuideService';
import type { DeploymentSection, DeploymentTab, DeploymentCategory } from '../services/deploymentGuideService';

interface DeploymentGuideEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (content: any) => void;
}

const DeploymentGuideEditor: React.FC<DeploymentGuideEditorProps> = ({ 
  isOpen, 
  onClose, 
  onSave 
}) => {
  const [activeView, setActiveView] = useState<'editor' | 'preview'>('editor');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedTab, setSelectedTab] = useState<string>('');
  const [selectedSection, setSelectedSection] = useState<number>(-1);
  const [content, setContent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showAddSection, setShowAddSection] = useState(false);
  const [newSectionType, setNewSectionType] = useState<string>('overview');

  useEffect(() => {
    if (isOpen) {
      loadContent();
    }
  }, [isOpen]);

  const loadContent = () => {
    setIsLoading(true);
    try {
      // Load the actual content from the service
      const fullContent = deploymentGuideService.getFullContent();
      console.log('Loaded content:', fullContent);
      console.log('Categories:', fullContent.categories);
      console.log('First category tabs:', fullContent.categories[0]?.tabs);
      console.log('First tab sections:', fullContent.categories[0]?.tabs[0]?.sections);
      
      // Debug code blocks specifically
      fullContent.categories.forEach((category, catIndex) => {
        category.tabs.forEach((tab, tabIndex) => {
          tab.sections.forEach((section, sectionIndex) => {
            if (section.type === 'code-block') {
              console.log(`Code block at category ${catIndex}, tab ${tabIndex}, section ${sectionIndex}:`, section);
              console.log('Code content:', section.code);
              console.log('Subsections:', section.subsections);
            }
          });
        });
      });
      
      setContent(fullContent);
      
      if (fullContent.categories.length > 0) {
        setSelectedCategory(fullContent.categories[0].id);
        if (fullContent.categories[0].tabs.length > 0) {
          setSelectedTab(fullContent.categories[0].tabs[0].id);
        }
      }
    } catch (error) {
      console.error('Failed to load content:', error);
      // Fallback to empty content if loading fails
      setContent({ categories: [] });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Save content using the service
      await DeploymentGuideService.saveContent(content);
      
      // Update the service's content so changes are reflected immediately
      deploymentGuideService.updateContent(content);
      
      // Call the onSave callback if provided
      if (onSave) {
        onSave(content);
      }
      
      // Show success message
      alert('Content saved successfully!');
    } catch (error) {
      console.error('Failed to save content:', error);
      alert('Failed to save content. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const getCurrentTab = (): DeploymentTab | undefined => {
    if (!selectedCategory || !selectedTab || !content) return undefined;
    
    // Use local content state instead of service
    const category = content.categories.find((cat: any) => cat.id === selectedCategory);
    const tab = category?.tabs.find((tab: any) => tab.id === selectedTab);
    
    return tab;
  };

  const getCurrentSections = () => {
    const currentTab = getCurrentTab();
    console.log('Current tab:', currentTab);
    console.log('Current tab sections:', currentTab?.sections);
    return currentTab?.sections || [];
  };

  const updateSection = (index: number, updatedSection: DeploymentSection) => {
    if (!content || selectedCategory === '' || selectedTab === '') return;

    const newContent = { ...content };
    const categoryIndex = newContent.categories.findIndex((cat: any) => cat.id === selectedCategory);
    const tabIndex = newContent.categories[categoryIndex].tabs.findIndex((tab: any) => tab.id === selectedTab);
    
    newContent.categories[categoryIndex].tabs[tabIndex].sections[index] = updatedSection;
    setContent(newContent);
  };

  const addSection = () => {
    if (!content || selectedCategory === '' || selectedTab === '') return;

    const newSection: DeploymentSection = {
      type: newSectionType as any,
      title: 'New Section',
      description: '',
      features: [],
      items: [],
      code: '',
      subsections: [],
      major: [],
      custom: [],
      resources: []
    };

    const newContent = { ...content };
    const categoryIndex = newContent.categories.findIndex((cat: any) => cat.id === selectedCategory);
    const tabIndex = newContent.categories[categoryIndex].tabs.findIndex((tab: any) => tab.id === selectedTab);
    
    newContent.categories[categoryIndex].tabs[tabIndex].sections.push(newSection);
    setContent(newContent);
    setShowAddSection(false);
    setSelectedSection(newContent.categories[categoryIndex].tabs[tabIndex].sections.length - 1);
  };

  const deleteSection = (index: number) => {
    if (!content || selectedCategory === '' || selectedTab === '') return;

    const newContent = { ...content };
    const categoryIndex = newContent.categories.findIndex((cat: any) => cat.id === selectedCategory);
    const tabIndex = newContent.categories[categoryIndex].tabs.findIndex((tab: any) => tab.id === selectedTab);
    
    newContent.categories[categoryIndex].tabs[tabIndex].sections.splice(index, 1);
    setContent(newContent);
    setSelectedSection(-1);
  };

  const renderSectionEditor = (section: any, index: number) => {
    const isExpanded = selectedSection === index;
    
    console.log(`Rendering section ${index}:`, section);
    console.log(`Section ${index} type:`, section.type);
    console.log(`Section ${index} title:`, section.title);
    
    return (
      <div key={index} className="mb-4">
        <button
          onClick={() => setSelectedSection(isExpanded ? -1 : index)}
          className={`w-full flex items-center justify-between p-4 rounded-lg border transition-colors ${
            isExpanded
              ? 'bg-gray-800/50 border-blue-500/30 text-blue-300'
              : 'bg-gray-800/30 border-gray-600/30 text-gray-300 hover:bg-gray-700/30 hover:text-white'
          }`}
        >
          <div className="flex items-center gap-3">
            {section.type === 'overview' && <ListBulletIcon className="w-5 h-5" />}
            {section.type === 'requirements' && <Cog6ToothIcon className="w-5 h-5" />}
            {section.type === 'code-block' && <CodeBracketIcon className="w-5 h-5" />}
            {section.type === 'providers' && <CloudIcon className="w-5 h-5" />}
            {section.type === 'links' && <LinkIcon className="w-5 h-5" />}
            <span className="font-medium">{section.title}</span>
          </div>
          <ChevronDownIcon className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </button>

        {isExpanded && (
          <div className="mt-2 p-4 bg-gray-800/30 border border-gray-600/30 rounded-lg">
            {/* Section Type */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Section Type
              </label>
              <select
                value={section.type}
                onChange={(e) => updateSection(index, { ...section, type: e.target.value as any })}
                className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="overview" className="bg-gray-800 text-white">Overview</option>
                <option value="requirements" className="bg-gray-800 text-white">Requirements</option>
                <option value="code-block" className="bg-gray-800 text-white">Code Block</option>
                <option value="providers" className="bg-gray-800 text-white">Providers</option>
                <option value="links" className="bg-gray-800 text-white">Links</option>
              </select>
            </div>

            {/* Title */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Title
              </label>
              <input
                type="text"
                value={section.title}
                onChange={(e) => updateSection(index, { ...section, title: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Section title..."
              />
            </div>

            {/* Content based on type */}
            {section.type === 'overview' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={section.description || ''}
                    onChange={(e) => updateSection(index, { ...section, description: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter overview description..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Features
                  </label>
                  <textarea
                    value={section.features?.join('\n') || ''}
                    onChange={(e) => {
                      const newFeatures = e.target.value.split('\n').map(feature => feature.trim()).filter(Boolean);
                      updateSection(index, { ...section, features: newFeatures });
                    }}
                    rows={6}
                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter features (one per line)..."
                  />
                </div>
              </div>
            )}

            {section.type === 'requirements' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Requirements
                </label>
                <textarea
                  value={section.items?.join('\n') || ''}
                  onChange={(e) => {
                    const newItems = e.target.value.split('\n').map(item => item.trim()).filter(Boolean);
                    updateSection(index, { ...section, items: newItems });
                  }}
                  rows={6}
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter requirements (one per line)..."
                />
              </div>
            )}

            {section.type === 'code-block' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    value={section.description || ''}
                    onChange={(e) => updateSection(index, { ...section, description: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter optional description..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Code Content
                  </label>
                  <textarea
                    value={section.code || ''}
                    onChange={(e) => updateSection(index, { ...section, code: e.target.value })}
                    rows={8}
                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-md text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter code content..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Language
                  </label>
                  <input
                    type="text"
                    value={section.language || ''}
                    onChange={(e) => updateSection(index, { ...section, language: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., bash, python, javascript"
                  />
                </div>
                {section.subsections && section.subsections.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Code Subsections
                    </label>
                    {section.subsections.map((subsection: any, subIndex: number) => (
                      <div key={subIndex} className="mb-3 p-3 bg-gray-700/30 border border-gray-600/30 rounded">
                        <div className="flex items-center gap-2 mb-2">
                          <input
                            type="text"
                            value={subsection.title}
                            onChange={(e) => {
                              const newSubsections = [...section.subsections];
                              newSubsections[subIndex] = { ...subsection, title: e.target.value };
                              updateSection(index, { ...section, subsections: newSubsections });
                            }}
                            className="flex-1 px-2 py-1 bg-gray-600/50 border border-gray-500 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Subsection title"
                          />
                          <button
                            onClick={() => {
                              const newSubsections = section.subsections.filter((_: any, i: number) => i !== subIndex);
                              updateSection(index, { ...section, subsections: newSubsections });
                            }}
                            className="p-1 text-red-400 hover:text-red-300"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                        <textarea
                          value={subsection.code || ''}
                          onChange={(e) => {
                            const newSubsections = [...section.subsections];
                            newSubsections[subIndex] = { ...subsection, code: e.target.value };
                            updateSection(index, { ...section, subsections: newSubsections });
                          }}
                          rows={4}
                          className="w-full px-2 py-1 bg-gray-600/50 border border-gray-500 rounded text-white text-sm font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="Subsection code..."
                        />
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        const newSubsections = [...(section.subsections || []), { title: '', code: '' }];
                        updateSection(index, { ...section, subsections: newSubsections });
                      }}
                      className="w-full px-3 py-2 text-sm text-blue-400 border border-blue-500/30 rounded hover:bg-blue-500/10"
                    >
                      + Add Code Subsection
                    </button>
                  </div>
                )}
              </div>
            )}

            {section.type === 'providers' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Major Providers
                  </label>
                  <textarea
                    value={section.major?.map((provider: any) => `${provider.name} - ${provider.models}`).join('\n') || ''}
                    onChange={(e) => {
                      const newMajor = e.target.value.split('\n').map(line => {
                        const [name, models] = line.split(' - ');
                        return { name: name?.trim() || '', models: models?.trim() || '' };
                      }).filter(({ name }) => name.trim() !== '');
                      updateSection(index, { ...section, major: newMajor });
                    }}
                    rows={6}
                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter major provider information (name - models)..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Custom Providers
                  </label>
                  <textarea
                    value={section.custom?.map((provider: any) => `${provider.name} - ${provider.description}`).join('\n') || ''}
                    onChange={(e) => {
                      const newCustom = e.target.value.split('\n').map(line => {
                        const [name, description] = line.split(' - ');
                        return { name: name?.trim() || '', description: description?.trim() || '' };
                      }).filter(({ name }) => name.trim() !== '');
                      updateSection(index, { ...section, custom: newCustom });
                    }}
                    rows={6}
                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter custom provider information (name - description)..."
                  />
                </div>
              </div>
            )}

            {section.type === 'links' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Links
                </label>
                <textarea
                  value={section.resources?.map((resource: any) => `${resource.name} - ${resource.url} - ${resource.description}`).join('\n') || ''}
                  onChange={(e) => {
                    const newResources = e.target.value.split('\n').map(line => {
                      const [name, url, description] = line.split(' - ');
                      return { 
                        name: name?.trim() || '', 
                        url: url?.trim() || '', 
                        description: description?.trim() || '' 
                      };
                    }).filter(({ name }) => name.trim() !== '');
                    updateSection(index, { ...section, resources: newResources });
                  }}
                  rows={6}
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter links (name - url - description)..."
                />
              </div>
            )}

            {/* Delete Section */}
            <div className="flex justify-end">
              <button
                onClick={() => deleteSection(index)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded"
              >
                <TrashIcon className="w-4 h-4" />
                Delete Section
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderPreview = () => {
    const sections = getCurrentSections();
    
    return (
      <div className="space-y-6">
        {sections.map((section, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{section.title}</h3>
            
            {section.description && (
              <p className="text-gray-600 mb-3">{section.description}</p>
            )}

            {section.type === 'overview' && section.features && (
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                {section.features.map((feature, featureIndex) => (
                  <li key={featureIndex}>{feature}</li>
                ))}
              </ul>
            )}

            {section.type === 'requirements' && section.items && (
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex}>{item}</li>
                ))}
              </ul>
            )}

            {section.type === 'code-block' && section.code && (
              <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm">
                <code>{section.code}</code>
              </pre>
            )}

            {section.type === 'providers' && (
              <div className="space-y-4">
                {section.major && section.major.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Major Providers</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {section.major.map((provider, providerIndex) => (
                        <div key={providerIndex} className="p-2 bg-blue-50 rounded">
                          <div className="font-medium text-blue-800">{provider.name}</div>
                          <div className="text-sm text-blue-600">{provider.models}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {section.custom && section.custom.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Custom Providers</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {section.custom.map((provider, providerIndex) => (
                        <div key={providerIndex} className="p-2 bg-gray-50 rounded">
                          <div className="font-medium text-gray-800">{provider.name}</div>
                          <div className="text-sm text-gray-600">{provider.description}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {section.type === 'links' && section.resources && (
              <div className="space-y-2">
                {section.resources.map((resource, resourceIndex) => (
                  <div key={resourceIndex} className="p-2 bg-gray-50 rounded">
                    <a 
                      href={resource.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="font-medium text-blue-600 hover:text-blue-800"
                    >
                      {resource.name}
                    </a>
                    <div className="text-sm text-gray-600">{resource.description}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  if (!isOpen) return null;

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="bg-white rounded-lg p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <div className="flex items-center gap-3">
            <DocumentTextIcon className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl font-semibold text-white">Deployment Guide Editor</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveView(activeView === 'editor' ? 'preview' : 'editor')}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-300 bg-gray-800/50 rounded-md hover:bg-gray-700/50 hover:text-white"
            >
              {activeView === 'editor' ? <EyeIcon className="w-4 h-4" /> : <PencilIcon className="w-4 h-4" />}
              {activeView === 'editor' ? 'Preview' : 'Edit'}
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : (
                <>
                  <CheckIcon className="w-4 h-4" />
                  Save
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <div className="w-80 bg-gray-800/50 border-r border-white/20 p-4 overflow-y-auto">
            <div className="space-y-4">
              {/* Category Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    const category = content.categories.find((cat: any) => cat.id === e.target.value);
                    if (category && category.tabs.length > 0) {
                      setSelectedTab(category.tabs[0].id);
                    }
                  }}
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {content?.categories.map((category: any) => (
                    <option key={category.id} value={category.id} className="bg-gray-800 text-white">
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tab Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tab
                </label>
                <select
                  value={selectedTab}
                  onChange={(e) => setSelectedTab(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {content?.categories
                    .find((cat: any) => cat.id === selectedCategory)
                    ?.tabs.map((tab: any) => (
                      <option key={tab.id} value={tab.id} className="bg-gray-800 text-white">
                        {tab.name}
                      </option>
                    ))}
                </select>
              </div>

              {/* Section Management */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Sections
                  </label>
                  <button
                    onClick={() => setShowAddSection(true)}
                    className="p-1 text-blue-400 hover:text-blue-300"
                  >
                    <PlusIcon className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-1">
                  {getCurrentSections().map((section, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedSection(selectedSection === index ? -1 : index)}
                      className={`w-full text-left p-2 rounded text-sm ${
                        selectedSection === index
                          ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30'
                          : 'bg-gray-700/30 text-gray-300 hover:bg-gray-600/30 hover:text-white border border-gray-600/30'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {section.type === 'overview' && <ListBulletIcon className="w-4 h-4" />}
                        {section.type === 'requirements' && <Cog6ToothIcon className="w-4 h-4" />}
                        {section.type === 'code-block' && <CodeBracketIcon className="w-4 h-4" />}
                        {section.type === 'providers' && <CloudIcon className="w-4 h-4" />}
                        {section.type === 'links' && <LinkIcon className="w-4 h-4" />}
                        <span className="truncate">{section.title}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {activeView === 'editor' ? (
              <div>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Editing: {getCurrentTab()?.name}
                  </h3>
                  <p className="text-gray-400">
                    {getCurrentTab()?.description}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Sections: {getCurrentSections().length}
                  </p>
                </div>

                {getCurrentSections().map((section, index) => 
                  renderSectionEditor(section, index)
                )}

                {showAddSection && (
                  <div className="border border-gray-600/50 rounded-lg p-4 mb-4 bg-gray-800/30">
                    <h4 className="text-sm font-medium text-gray-300 mb-2">Add New Section</h4>
                    <div className="flex items-center gap-2">
                      <select
                        value={newSectionType}
                        onChange={(e) => setNewSectionType(e.target.value)}
                        className="flex-1 px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="overview" className="bg-gray-800 text-white">Overview</option>
                        <option value="requirements" className="bg-gray-800 text-white">Requirements</option>
                        <option value="code-block" className="bg-gray-800 text-white">Code Block</option>
                        <option value="providers" className="bg-gray-800 text-white">Providers</option>
                        <option value="links" className="bg-gray-800 text-white">Links</option>
                      </select>
                      <button
                        onClick={addSection}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        Add
                      </button>
                      <button
                        onClick={() => setShowAddSection(false)}
                        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Preview: {getCurrentTab()?.name}
                  </h3>
                  <p className="text-gray-400">
                    {getCurrentTab()?.description}
                  </p>
                </div>
                {renderPreview()}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeploymentGuideEditor; 