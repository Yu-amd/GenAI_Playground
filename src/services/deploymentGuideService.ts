import deploymentGuideContent from '../data/deployment-guide-content.json';

export interface DeploymentSection {
  type: 'overview' | 'requirements' | 'code-block' | 'providers' | 'links';
  title: string;
  description?: string;
  features?: string[];
  items?: string[];
  code?: string;
  subsections?: Array<{
    title: string;
    code: string;
  }>;
  major?: Array<{
    name: string;
    models: string;
  }>;
  custom?: Array<{
    name: string;
    description: string;
  }>;
  resources?: Array<{
    name: string;
    url: string;
    description: string;
  }>;
}

export interface DeploymentTab {
  id: string;
  name: string;
  icon: string;
  description: string;
  sections: DeploymentSection[];
}

export interface DeploymentCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  tabs: DeploymentTab[];
}

export interface DeploymentGuideContent {
  categories: DeploymentCategory[];
}

class DeploymentGuideService {
  private content: DeploymentGuideContent;

  constructor() {
    // console.log('Loading deployment guide content:', deploymentGuideContent);
    this.content = deploymentGuideContent as DeploymentGuideContent;
    // console.log('Service content loaded:', this.content);
    
    // Debug code blocks in loaded content
    this.content.categories.forEach((category, catIndex) => {
      category.tabs.forEach((tab, tabIndex) => {
        tab.sections.forEach((section, sectionIndex) => {
          if (section.type === 'code-block') {
            // console.log(`Service: Code block at category ${catIndex}, tab ${tabIndex}, section ${sectionIndex}:`, section);
            // console.log('Service: Code content:', section.code);
            // console.log('Service: Subsections:', section.subsections);
          }
        });
      });
    });
  }

  /**
   * Update the content (for editor use)
   */
  updateContent(newContent: DeploymentGuideContent): void {
    this.content = newContent;
  }

  /**
   * Get the full content structure (for editor use)
   */
  getFullContent(): DeploymentGuideContent {
    return this.content;
  }

  /**
   * Get all categories
   */
  getCategories(): DeploymentCategory[] {
    return this.content.categories;
  }

  /**
   * Get a specific category by ID
   */
  getCategory(categoryId: string): DeploymentCategory | undefined {
    return this.content.categories.find(cat => cat.id === categoryId);
  }

  /**
   * Get tabs for a specific category
   */
  getTabs(categoryId: string): DeploymentTab[] {
    const category = this.getCategory(categoryId);
    return category?.tabs || [];
  }

  /**
   * Get a specific tab by category and tab ID
   */
  getTab(categoryId: string, tabId: string): DeploymentTab | undefined {
    const category = this.getCategory(categoryId);
    return category?.tabs.find(tab => tab.id === tabId);
  }

  /**
   * Get sections for a specific tab
   */
  getSections(categoryId: string, tabId: string): DeploymentSection[] {
    const tab = this.getTab(categoryId, tabId);
    return tab?.sections || [];
  }

  /**
   * Process template variables in content
   */
  processTemplate(content: string, modelInfo: { name: string; size: string; requirements: string }): string {
    return content
      .replace(/\{\{modelName\}\}/g, modelInfo.name)
      .replace(/\{\{modelSize\}\}/g, modelInfo.size)
      .replace(/\{\{modelRequirements\}\}/g, modelInfo.requirements);
  }

  /**
   * Get processed sections with template variables replaced
   */
  getProcessedSections(categoryId: string, tabId: string, modelInfo: { name: string; size: string; requirements: string }): DeploymentSection[] {
    const sections = this.getSections(categoryId, tabId);
    
    return sections.map(section => {
      const processedSection = { ...section };
      
      // Process description
      if (processedSection.description) {
        processedSection.description = this.processTemplate(processedSection.description, modelInfo);
      }
      
      // Process code blocks
      if (processedSection.code) {
        processedSection.code = this.processTemplate(processedSection.code, modelInfo);
      }
      
      // Process subsections
      if (processedSection.subsections) {
        processedSection.subsections = processedSection.subsections.map(subsection => ({
          ...subsection,
          code: this.processTemplate(subsection.code, modelInfo)
        }));
      }
      
      return processedSection;
    });
  }

  /**
   * Get icon component name from string
   */
  getIconComponent(iconName: string): string {
    // Map icon names to actual component imports
    const iconMap: Record<string, string> = {
      'HomeIcon': 'HomeIcon',
      'CubeIcon': 'CubeIcon',
      'CloudIcon': 'CloudIcon',
      'GlobeAltIcon': 'GlobeAltIcon',
      'DocumentTextIcon': 'DocumentTextIcon',
      'ComputerDesktopIcon': 'ComputerDesktopIcon',
      'BuildingOfficeIcon': 'BuildingOfficeIcon'
    };
    
    return iconMap[iconName] || 'DocumentTextIcon';
  }

  /**
   * Validate content structure
   */
  validateContent(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!this.content.categories || !Array.isArray(this.content.categories)) {
      errors.push('Categories array is missing or invalid');
      return { isValid: false, errors };
    }
    
    this.content.categories.forEach((category, categoryIndex) => {
      if (!category.id || !category.name) {
        errors.push(`Category ${categoryIndex}: Missing id or name`);
      }
      
      if (!category.tabs || !Array.isArray(category.tabs)) {
        errors.push(`Category ${category.id}: Tabs array is missing or invalid`);
        return;
      }
      
      category.tabs.forEach((tab, tabIndex) => {
        if (!tab.id || !tab.name) {
          errors.push(`Category ${category.id}, Tab ${tabIndex}: Missing id or name`);
        }
        
        if (!tab.sections || !Array.isArray(tab.sections)) {
          errors.push(`Category ${category.id}, Tab ${tab.id}: Sections array is missing or invalid`);
          return;
        }
        
        tab.sections.forEach((section, sectionIndex) => {
          if (!section.type || !section.title) {
            errors.push(`Category ${category.id}, Tab ${tab.id}, Section ${sectionIndex}: Missing type or title`);
          }
        });
      });
    });
    
    return { isValid: errors.length === 0, errors };
  }

  /**
   * Reload content from external source (for dynamic updates)
   */
  async reloadContent(url?: string): Promise<void> {
    try {
      if (url) {
        const response = await fetch(url);
        this.content = await response.json();
      } else {
        // Reload from the same source
        const response = await fetch('/src/data/deployment-guide-content.json');
        this.content = await response.json();
      }
    } catch (error) {
      console.error('Failed to reload deployment guide content:', error);
      throw error;
    }
  }

  /**
   * Export current content (for backup or version control)
   */
  exportContent(): string {
    return JSON.stringify(this.content, null, 2);
  }

  /**
   * Save content back to the JSON file
   * Note: In a real implementation, this would require backend API or file system access
   * For now, this returns the content that should be saved
   */
  static async saveContent(content: DeploymentGuideContent): Promise<void> {
    try {
      // In a real implementation, this would make an API call to save the content
      // For now, we'll just validate and return the content
      const validatedContent = this.validateContent(content);
      
      // Simulate API call
      // console.log('Saving content to deployment guide:', validatedContent);
      
      // In a real implementation, you would:
      // 1. Make an API call to save the content
      // 2. Update the local cache
      // 3. Trigger a reload of the content
      
      // For demo purposes, we'll just log the content
      localStorage.setItem('deployment-guide-content', JSON.stringify(validatedContent));
      
      return Promise.resolve();
    } catch (error) {
      console.error('Failed to save deployment guide content:', error);
      throw new Error('Failed to save content');
    }
  }

  /**
   * Validate content structure before saving
   */
  private static validateContent(content: DeploymentGuideContent): DeploymentGuideContent {
    if (!content || !content.categories || !Array.isArray(content.categories)) {
      throw new Error('Invalid content structure: missing categories array');
    }

    // Validate each category
    content.categories.forEach((category: DeploymentCategory, categoryIndex: number) => {
      if (!category.id || !category.name || !category.tabs || !Array.isArray(category.tabs)) {
        throw new Error(`Invalid category structure at index ${categoryIndex}`);
      }

      // Validate each tab
      category.tabs.forEach((tab: DeploymentTab, tabIndex: number) => {
        if (!tab.id || !tab.name || !tab.sections || !Array.isArray(tab.sections)) {
          throw new Error(`Invalid tab structure at category ${categoryIndex}, tab ${tabIndex}`);
        }

        // Validate each section
        tab.sections.forEach((section: DeploymentSection, sectionIndex: number) => {
          if (!section.type || !section.title) {
            throw new Error(`Invalid section structure at category ${categoryIndex}, tab ${tabIndex}, section ${sectionIndex}`);
          }
        });
      });
    });

    return content;
  }
}

// Create singleton instance
export const deploymentGuideService = new DeploymentGuideService();

// Export the class for static method access
export { DeploymentGuideService }; 