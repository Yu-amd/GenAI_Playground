# Deployment Guide Content Management

This document explains how to easily update the deployment guide content without touching React component code.

## 🎯 Overview

The deployment guide content is now managed through a structured JSON configuration file, making it easy for non-developers to update content without modifying code.

## 📁 File Structure

```
src/
├── data/
│   └── deployment-guide-content.json    # Main content file
├── services/
│   └── deploymentGuideService.ts        # Content management service
└── components/
    └── DeploymentGuide.tsx              # React component (uses service)
```

## 🔧 How to Update Content

### **1. Edit the JSON File**

Open `src/data/deployment-guide-content.json` and modify the content:

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
          "description": "Traditional installation with full control",
          "sections": [
            {
              "type": "overview",
              "title": "Manual Installation (On-Premises)",
              "description": "Your description here...",
              "features": [
                "Feature 1",
                "Feature 2",
                "Feature 3"
              ]
            },
            {
              "type": "code-block",
              "title": "Install Dependencies",
              "code": "# Your code here\nsudo apt update"
            }
          ]
        }
      ]
    }
  ]
}
```

### **2. Section Types**

#### **Overview Section**
```json
{
  "type": "overview",
  "title": "Section Title",
  "description": "Detailed description",
  "features": ["Feature 1", "Feature 2"]
}
```

#### **Requirements Section**
```json
{
  "type": "requirements",
  "title": "System Requirements",
  "items": ["Requirement 1", "Requirement 2"]
}
```

#### **Code Block Section**
```json
{
  "type": "code-block",
  "title": "Installation Commands",
  "description": "Optional description",
  "code": "# Your commands here\nsudo apt install package"
}
```

#### **Code Block with Subsections**
```json
{
  "type": "code-block",
  "title": "Multi-step Installation",
  "subsections": [
    {
      "title": "Step 1: Check GPU",
      "code": "lspci | grep -i amd"
    },
    {
      "title": "Step 2: Install ROCm",
      "code": "sudo apt install rocm"
    }
  ]
}
```

#### **Providers Section**
```json
{
  "type": "providers",
  "title": "Supported Providers",
  "major": [
    {"name": "OpenAI", "models": "GPT-4, GPT-3.5-turbo"}
  ],
  "custom": [
    {"name": "Self-hosted", "description": "Your own infrastructure"}
  ]
}
```

#### **Links Section**
```json
{
  "type": "links",
  "title": "Documentation Links",
  "resources": [
    {
      "name": "ROCm Documentation",
      "url": "https://rocmdocs.amd.com/",
      "description": "Complete AMD GPU computing platform docs"
    }
  ]
}
```

### **3. Template Variables**

Use template variables to make content dynamic:

```json
{
  "type": "code-block",
  "title": "Download Model",
  "code": "# Download model (example for {{modelName}})\npython3 -c \"model_name = '{{modelName}}'\""
}
```

Available variables:
- `{{modelName}}` - Model name
- `{{modelSize}}` - Model size
- `{{modelRequirements}}` - Model requirements

## 🚀 Advanced Features

### **1. Dynamic Content Loading**

The service supports loading content from external sources:

```typescript
import { deploymentGuideService } from './services/deploymentGuideService';

// Reload content from external URL
await deploymentGuideService.reloadContent('https://api.example.com/deployment-guide.json');
```

### **2. Content Validation**

Validate content structure before deployment:

```typescript
const validation = deploymentGuideService.validateContent();
if (!validation.isValid) {
  console.error('Content validation failed:', validation.errors);
}
```

### **3. Content Export**

Export current content for backup or version control:

```typescript
const contentJson = deploymentGuideService.exportContent();
// Save to file or send to external system
```

## 📝 Content Management Workflow

### **For Content Writers:**

1. **Edit JSON file** - Modify `deployment-guide-content.json`
2. **Test locally** - Run the app to see changes
3. **Validate content** - Use validation tools
4. **Commit changes** - Version control your updates

### **For Developers:**

1. **Add new section types** - Extend the service if needed
2. **Update templates** - Modify template processing
3. **Add validation rules** - Enhance content validation
4. **Deploy updates** - Push changes to production

## 🔄 Alternative Approaches

### **1. Markdown Files**
```markdown
# Manual Installation

## Overview
Traditional installation with manual ROCm setup...

## Requirements
- AMD Instinct MI series GPU
- ROCm 5.x or later

## Installation
```bash
sudo apt update
sudo apt install rocm
```
```

### **2. CMS Integration**
```typescript
// Connect to external CMS
const content = await fetch('https://your-cms.com/api/deployment-guide');
const guideContent = await content.json();
```

### **3. Database Storage**
```typescript
// Store content in database
const content = await database.query('SELECT * FROM deployment_guide_content');
```

## 🛠️ Development Tools

### **Content Editor Script**
```bash
# Validate content
npm run validate-deployment-guide

# Export content
npm run export-deployment-guide

# Reload content
npm run reload-deployment-guide
```

### **Content Preview**
```bash
# Start development server with content preview
npm run dev -- --preview-content
```

## 📋 Best Practices

1. **Version Control** - Always commit content changes
2. **Backup** - Export content before major changes
3. **Validation** - Validate content before deployment
4. **Testing** - Test content changes locally first
5. **Documentation** - Keep content structure documented

## 🆘 Troubleshooting

### **Common Issues:**

1. **JSON Syntax Errors**
   - Use a JSON validator
   - Check for missing commas/brackets

2. **Template Variables Not Working**
   - Ensure variables use `{{variableName}}` format
   - Check that modelInfo is passed correctly

3. **Content Not Loading**
   - Verify file path is correct
   - Check import statements

4. **Validation Errors**
   - Review error messages
   - Ensure all required fields are present

## 📞 Support

For questions about content management:
1. Check this documentation
2. Review the JSON schema
3. Test with the validation tools
4. Contact the development team

---

**Happy content editing! 🎉** 