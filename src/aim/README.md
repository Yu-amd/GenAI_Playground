# Model YAML Validation

This directory contains the validation infrastructure for model catalog YAML files.

## Files

- `model_catalog_schema.json` - JSON schema for validating model YAML files
- `validate_model_yaml.py` - Python script to validate YAML files against the schema
- `model_template.yaml` - Template for creating new model YAML files
- `*.yaml` - Individual model YAML files

## Usage

### Validate a single file
```bash
python3 validate_model_yaml.py <filename>
# or
python3 validate_model_yaml.py <filename>.yaml
```

### Validate all model files
```bash
python3 validate_model_yaml.py --all
# or
python3 validate_model_yaml.py -a
```

### Validate default file (gemma-3-4b-it.yaml)
```bash
python3 validate_model_yaml.py
```

## Schema Improvements

The schema has been enhanced with:

### 1. **Comprehensive Validation Rules**
- **Required fields**: All essential fields are now required
- **Pattern validation**: URLs, file paths, and IDs are validated with regex patterns
- **Enum constraints**: Limited values for readiness levels, licenses, hardware, etc.
- **Length constraints**: Minimum lengths for descriptions and content
- **Unique items**: Arrays must contain unique values

### 2. **Better Field Definitions**
- **Descriptions**: Each field has a clear description
- **Formats**: URLs are validated as proper URIs
- **Patterns**: File paths, model IDs, and other fields have specific patterns
- **Enums**: Restricted values for categorical fields

### 3. **Enhanced Data Quality**
- **Status badges**: Predefined list of valid badges
- **Tags**: Controlled vocabulary for model categorization
- **Hardware**: Specific AMD GPU models supported
- **Precision**: Standard numerical precision formats
- **Evaluation metrics**: Structured format for benchmark scores

## Validation Script Improvements

### 1. **Enhanced Functionality**
- **Multiple file support**: Validate one file or all files at once
- **Better error reporting**: Detailed error messages with paths and expected values
- **Summary statistics**: Shows validation results summary
- **Command line interface**: Flexible argument handling

### 2. **Robust Error Handling**
- **File not found**: Graceful handling of missing files
- **Invalid YAML**: Clear error messages for YAML syntax issues
- **Schema errors**: Detailed validation error reporting
- **Exit codes**: Proper exit codes for CI/CD integration

### 3. **User Experience**
- **Clear output**: Emoji indicators and formatted output
- **Progress tracking**: Shows which files are being validated
- **Helpful messages**: Explains what went wrong and how to fix it

## Example Output

### Successful Validation
```
🔍 Validating 4 model YAML file(s)...
--------------------------------------------------
✅ deepseek-moe-16b-base.yaml: Valid
✅ gemma-3-4b-it.yaml: Valid
✅ llama-3-8b.yaml: Valid
✅ qwen2-7b-instruct.yaml: Valid
--------------------------------------------------
📊 Summary: 4/4 files valid
🎉 All files passed validation!
```

### Failed Validation
```
🔍 Validating 1 model YAML file(s)...
--------------------------------------------------
❌ test.yaml: Validation error
   Path: readiness_level
   Message: 'Invalid Level' is not one of ['Day-0 Available', 'Tech Preview', 'Production-Ready']
   Expected: ['Day-0 Available', 'Tech Preview', 'Production-Ready']
--------------------------------------------------
📊 Summary: 0/1 files valid
⚠️  Some files failed validation.
```

## Schema Fields

### Required Fields
- `model_id`: Unique identifier (alphanumeric, hyphens, underscores, slashes)
- `name`: Human-readable display name
- `builder`: Organization that built the model
- `family`: Model family name
- `size`: Model size in parameters
- `huggingface_id`: HuggingFace model identifier
- `description`: Detailed description (min 10 chars)
- `readiness_level`: One of "Day-0 Available", "Tech Preview", "Production-Ready"
- `status_badges`: Array of predefined badges
- `tags`: Array of predefined tags
- `license`: One of predefined license types
- `endpoint`: Valid HTTPS URL
- `demo_assets`: Object with notebook and demo_link URLs
- `aim_recipes`: Array of deployment recipes
- `api_examples`: Object with programming language examples
- `model_card`: Detailed model information

### Optional Fields
- `logo`: Image filename (png, jpg, jpeg, svg)

## Dependencies

- `jsonschema`: For JSON schema validation
- `pyyaml`: For YAML file parsing

Install with:
```bash
pip install jsonschema pyyaml
``` 