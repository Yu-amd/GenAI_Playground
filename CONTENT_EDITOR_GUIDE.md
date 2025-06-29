# Deployment Guide Content Editor

A comprehensive UI-based editor for managing deployment guide content without touching JSON files directly.

## Overview

The Deployment Guide Content Editor provides a visual interface for managing all aspects of the deployment guide content, including categories, tabs, sections, and their various content types. This makes it easy for non-technical users to update deployment information without needing to understand JSON structure.

## Features

### 🎯 Visual Content Management
- **Intuitive Interface**: Edit content through a user-friendly UI
- **Real-time Preview**: Switch between edit and preview modes
- **Section Management**: Add, edit, and delete sections easily
- **Content Validation**: Built-in validation ensures data integrity

### 📝 Section Types
- **Overview**: Feature lists and general information
- **Requirements**: System requirements and prerequisites
- **Code Blocks**: Code snippets with syntax highlighting
- **Providers**: Cloud provider information and model compatibility
- **Links**: Resource links with descriptions

### 🔄 Template Variables
- **Dynamic Content**: Use `{{modelName}}`, `{{modelSize}}`, `{{modelRequirements}}`
- **Automatic Replacement**: Variables are replaced with actual model data
- **Preview Support**: See how content looks with sample data

## How to Access

### Option 1: From Deployment Guide
1. Open any model's deployment guide
2. Click the "Edit Content" button in the header
3. The editor will open in a modal overlay

### Option 2: Direct Access
1. Navigate to `/content-editor` in your browser
2. This opens the standalone editor demo page

## Usage Guide

### 1. Opening the Editor
- Click "Edit Content" button in the deployment guide
- Or visit `/content-editor` for the demo page

### 2. Navigating Content Structure
- **Sidebar**: Select categories, tabs, and sections
- **Category Dropdown**: Choose deployment type (On-Premises, Cloud, etc.)
- **Tab Dropdown**: Select specific deployment method
- **Section List**: View and select individual content sections

### 3. Editing Content
- **Expand Sections**: Click the edit icon next to any section
- **Modify Fields**: Update titles, descriptions, and content
- **Add Items**: Use the "+" buttons to add new features, requirements, etc.
- **Delete Items**: Use the trash icon to remove unwanted content

### 4. Section Types Explained

#### Overview Sections
- **Title**: Section heading
- **Description**: General description text
- **Features**: List of key features or benefits
  - Click "+ Add Feature" to add new items
  - Use trash icon to remove items

#### Requirements Sections
- **Title**: Section heading
- **Description**: Requirements overview
- **Requirements**: List of specific requirements
  - Click "+ Add Requirement" to add new items
  - Use trash icon to remove items

#### Code Block Sections
- **Title**: Section heading
- **Description**: Code explanation
- **Code**: Multi-line code content
  - Supports template variables like `{{modelName}}`
  - Use monospace font for better readability

#### Provider Sections
- **Title**: Section heading
- **Description**: Provider overview
- **Major Providers**: List of major cloud providers
  - Provider name and supported models
- **Custom Providers**: List of custom/niche providers
  - Provider name and description

#### Links Sections
- **Title**: Section heading
- **Description**: Links overview
- **Resources**: List of external resources
  - Resource name, URL, and description
  - Click "+ Add Resource" to add new links

### 5. Preview Mode
- Click "Preview" button to switch to preview mode
- See how content will appear to end users
- Switch back to "Edit" mode to continue editing

### 6. Saving Changes
- Click "Save" button to store changes
- Content is validated before saving
- Success/error messages are displayed
- In production, changes are saved to JSON file

## Template Variables

Use these variables in your content for dynamic text replacement:

- `{{modelName}}` - Replaced with actual model name
- `{{modelSize}}` - Replaced with model size (e.g., "7B", "13B")
- `{{modelRequirements}}` - Replaced with model requirements

### Example Usage
```
# Install {{modelName}} ({{modelSize}})
This guide shows how to deploy {{modelName}} which requires {{modelRequirements}}.
```

## Technical Implementation

### File Structure
```
src/
├── components/
│   ├── DeploymentGuideEditor.tsx    # Main editor component
│   └── DeploymentGuide.tsx          # Updated with edit button
├── services/
│   └── deploymentGuideService.ts    # Content management service
├── data/
│   └── deployment-guide-content.json # Content configuration
└── pages/
    └── ContentEditorDemo.tsx        # Demo page
```

### Key Components

#### DeploymentGuideEditor.tsx
- Main editor interface
- Handles content editing and validation
- Provides preview functionality
- Manages save operations

#### deploymentGuideService.ts
- Content loading and validation
- Template variable processing
- Save operations (with validation)
- Content structure management

### Content Structure
```json
{
  "categories": [
    {
      "id": "on-premises",
      "name": "On-Premises",
      "icon": "HomeIcon",
      "description": "Deploy on your own hardware",
      "tabs": [
        {
          "id": "manual",
          "name": "Manual Install",
          "icon": "ComputerDesktopIcon",
          "description": "Traditional installation",
          "sections": [
            {
              "type": "overview",
              "title": "Manual Installation",
              "description": "Traditional installation with full control",
              "features": ["Manual ROCm setup", "Full control"]
            }
          ]
        }
      ]
    }
  ]
}
```

## Best Practices

### Content Organization
1. **Use Clear Titles**: Make section titles descriptive and specific
2. **Group Related Content**: Keep related information in the same section
3. **Consistent Formatting**: Use consistent formatting across similar sections
4. **Template Variables**: Use template variables for dynamic content

### Editing Workflow
1. **Plan Changes**: Review existing content before making changes
2. **Use Preview**: Always preview changes before saving
3. **Test Variables**: Ensure template variables work correctly
4. **Validate Content**: Check that all required fields are filled

### Content Validation
- All sections must have a title
- Code blocks should be properly formatted
- URLs in links should be valid
- Template variables should be properly escaped

## Troubleshooting

### Common Issues

#### Editor Won't Open
- Check browser console for errors
- Ensure all dependencies are installed
- Verify the route is properly configured

#### Content Not Saving
- Check for validation errors
- Ensure all required fields are filled
- Verify network connectivity (for API calls)

#### Template Variables Not Working
- Ensure variables are properly formatted: `{{variableName}}`
- Check that variable names match exactly
- Verify that model data is available

#### Preview Not Updating
- Switch between edit and preview modes
- Refresh the page if necessary
- Check for JavaScript errors in console

### Error Messages

#### "Invalid content structure"
- Check that all required fields are present
- Verify JSON structure is correct
- Ensure arrays are properly formatted

#### "Failed to save content"
- Check network connectivity
- Verify file permissions (for file-based saves)
- Review validation errors

## Future Enhancements

### Planned Features
- **Drag & Drop**: Reorder sections with drag and drop
- **Bulk Operations**: Edit multiple sections at once
- **Version Control**: Track changes and rollback functionality
- **Import/Export**: Import content from external sources
- **Rich Text Editor**: Enhanced text editing capabilities
- **Image Support**: Add images to content sections
- **Collaboration**: Multi-user editing with conflict resolution

### Integration Possibilities
- **CMS Integration**: Connect to external content management systems
- **API Endpoints**: RESTful API for programmatic access
- **Webhook Support**: Trigger external actions on content changes
- **Analytics**: Track content usage and performance

## Support

For technical support or feature requests:
1. Check the troubleshooting section above
2. Review the browser console for error messages
3. Verify that all dependencies are up to date
4. Contact the development team with specific error details

---

**Last Updated**: December 2024  
**Version**: 1.0.0  
**Maintainer**: Development Team 