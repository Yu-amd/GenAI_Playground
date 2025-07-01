# Blueprint Catalog Documentation

This document describes the blueprint catalog system, which provides a unified way to manage and display all blueprints in the Inference Hub.

## Overview

The blueprint catalog system consists of:

1. **Individual Blueprint YAML Files** - Each blueprint is defined in its own YAML file in `src/aim/blueprints/`
2. **Blueprint Catalog Template** - A template for creating a single catalog YAML file
3. **Conversion Script** - A tool to convert individual blueprint files to a catalog format
4. **Sample Catalog** - An example catalog file showing the format

## File Structure

```
src/aim/
├── blueprints/                    # Individual blueprint YAML files
│   ├── chatqna.yaml              # ChatQnA blueprint definition
│   └── ...                       # Other blueprint files
├── templates/
│   └── blueprint_catalog_template.yaml  # Template for catalog format
├── blueprint-catalog.yaml         # Generated catalog file
└── ...

scripts/
└── convertToBlueprintCatalog.ts   # Conversion script
```

## Blueprint Catalog Template

The blueprint catalog template (`src/aim/templates/blueprint_catalog_template.yaml`) defines the structure for a single YAML file that contains all blueprints. This follows a similar pattern to the model catalog but is specifically designed for blueprints.

### Catalog Structure

```yaml
catalog_metadata:
  version: "1.0.0"
  last_updated: "2025-06-30"
  total_blueprints: 0
  categories:
    - Conversational AI
    - Computer Vision
    - Multimodal
    - Code Generation
    - Document Processing
    - Audio Processing
    - Recommendation Systems
    - Search & Retrieval

blueprints:
  - blueprint_id: <unique-blueprint-id>
    name: <Blueprint Display Name>
    category: <Category>
    complexity: <Complexity Level>
    description: >
      Comprehensive description of what the blueprint does, its architecture,
      and key capabilities.
    shortDescription: >
      Brief one-line description that appears in catalog listings and cards.
    logo: <logo-filename>
    readiness_level: <Readiness>
    status_badges:
      - <Badge1>
      - <Badge2>
    tags:
      - <Tag1>
      - <Tag2>
    status: <Status>
    endpoint: <https://api.inference-hub.com/v1/blueprints/<blueprint-id>>
    
    demo_assets:
      notebook: <https://github.com/inference-hub/blueprints/<blueprint-id>-demo.ipynb>
      demo_link: <https://playground.inference-hub.com/blueprints/<blueprint-id>>
    
    aim_recipes:
      - name: <Hardware> <Precision>
        hardware: <Hardware>
        precision: <Precision>
        recipe_file: configs/<blueprint-id>-<hardware>-<precision>.yaml
    
    api_examples:
      python: |
        # Python API example
      typescript: |
        // TypeScript API example
      shell: |
        # Shell/curl example
      rust: |
        // Rust example
      go: |
        // Go example
    
    blueprint_card:
      overview: >
        Detailed overview of the blueprint, its architecture, and how it works.
      intended_use:
        - <Use case 1>
        - <Use case 2>
      limitations:
        - <Limitation 1>
        - <Limitation 2>
      architecture: >
        Brief description of the blueprint's architecture.
      evaluation:
        - <Metric 1>: <Value>
        - <Metric 2>: <Value>
      known_issues:
        - <Issue 1>
        - <Issue 2>
      references:
        - <Reference URL 1>
        - <Reference URL 2>
    
    microservices:
      models:
        - name: <Model Name>
          logo: <model-logo-path>
          tags:
            - <Model Tag 1>
            - <Model Tag 2>
      functional:
        - name: <Service Name>
          description: <Service Description>
          tags:
            - <Service Tag 1>
            - <Service Tag 2>
```

## Conversion Script

The conversion script (`scripts/convertToBlueprintCatalog.ts`) automatically converts individual blueprint YAML files into a single catalog format.

### Usage

```bash
# Basic usage (converts from src/aim/blueprints to src/aim/blueprint-catalog.yaml)
npm run convert-blueprints

# Specify custom input and output paths
npm run convert-blueprints --input-dir ./blueprints --output ./catalog.yaml

# Convert and validate the result
npm run convert-blueprints --validate

# Show help
npm run convert-blueprints --help
```

### Script Features

- **Automatic Discovery**: Scans directory for all `.yaml` and `.yml` files
- **Validation**: Checks for required fields and duplicate blueprint IDs
- **Category Collection**: Automatically collects all unique categories
- **Metadata Generation**: Updates catalog metadata with current date and counts
- **Error Handling**: Graceful handling of malformed YAML files

### Example Output

```bash
$ npm run convert-blueprints
Converting blueprints from src/aim/blueprints to catalog format...
Loaded blueprint: ChatQnA (chatqna)
✅ Successfully created blueprint catalog at src/aim/blueprint-catalog.yaml
📊 Catalog contains 1 blueprints across 1 categories
📁 Categories: Conversational AI
```

## Adding New Blueprints

### Method 1: Individual YAML Files (Recommended)

1. Create a new YAML file in `src/aim/blueprints/` following the existing format
2. Use the conversion script to update the catalog:

```bash
npm run convert-blueprints
```

### Method 2: Direct Catalog Editing

1. Edit `src/aim/blueprint-catalog.yaml` directly
2. Add a new blueprint entry following the template structure
3. Update `catalog_metadata.total_blueprints` and `catalog_metadata.categories` if needed

### Required Fields

Each blueprint must have these required fields:

- `blueprint_id` - Unique identifier
- `name` - Display name
- `category` - Blueprint category
- `description` - Detailed description
- `shortDescription` - Brief description for listings

### Optional Fields

- `logo` - Blueprint logo image
- `status_badges` - Array of status badges (Featured, New, etc.)
- `tags` - Array of tags for filtering
- `demo_assets` - Links to demos and notebooks
- `aim_recipes` - Hardware-specific configurations
- `api_examples` - Code examples in multiple languages
- `blueprint_card` - Detailed information for the blueprint card
- `microservices` - Models and functional services used

## Validation

The conversion script includes built-in validation:

```bash
# Validate the catalog
npm run convert-blueprints --validate
```

Validation checks:
- Required fields are present
- No duplicate blueprint IDs
- Valid YAML syntax
- Proper array structures
- Category consistency

## Integration with Frontend

The blueprint catalog can be loaded by the frontend in several ways:

1. **Direct Import**: Import the catalog YAML file directly
2. **API Endpoint**: Serve the catalog via API endpoint
3. **Build-time Generation**: Generate the catalog during build process

### Example Frontend Usage

```typescript
import catalogData from '../aim/blueprint-catalog.yaml';

// Access all blueprints
const allBlueprints = catalogData.blueprints;

// Filter by category
const conversationalAI = allBlueprints.filter(bp => bp.category === 'Conversational AI');

// Find specific blueprint
const chatqna = allBlueprints.find(bp => bp.blueprint_id === 'chatqna');
```

## Best Practices

1. **Consistent Naming**: Use consistent naming conventions for blueprint IDs and files
2. **Descriptive Content**: Provide detailed descriptions and use cases
3. **Regular Updates**: Keep the catalog updated when adding new blueprints
4. **Validation**: Always validate the catalog after making changes
5. **Version Control**: Track changes to both individual files and the catalog
6. **Documentation**: Keep API examples and documentation up to date

## Troubleshooting

### Common Issues

1. **Duplicate Blueprint IDs**: Ensure each blueprint has a unique `blueprint_id`
2. **Missing Required Fields**: Check that all required fields are present
3. **Invalid YAML**: Use a YAML validator to check syntax
4. **Path Issues**: Ensure file paths in the catalog are correct

### Debug Commands

```bash
# Check YAML syntax
yamllint src/aim/blueprint-catalog.yaml

# Validate catalog structure
npm run convert-blueprints --validate

# Check for duplicate IDs
grep -r "blueprint_id:" src/aim/blueprints/ | sort | uniq -d
```

## Future Enhancements

Potential improvements to the blueprint catalog system:

1. **Schema Validation**: Add JSON schema validation for blueprint definitions
2. **Automated Testing**: Add tests for catalog integrity and completeness
3. **Search Indexing**: Generate search indices for better discovery
4. **Dependency Tracking**: Track dependencies between blueprints
5. **Version Management**: Support for blueprint versioning
6. **API Documentation**: Auto-generate API documentation from examples 