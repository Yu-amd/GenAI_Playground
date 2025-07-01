# Model, Blueprint & AIM Recipe Validation Workflow

This directory contains YAML files and validation workflows for the model catalog, blueprint catalog, and AIM serving recipes. All types of YAMLs have their own schema and validation scripts.

---

## Directory Structure

- `models/` — Per-model YAML files for the model catalog
- `blueprints/` — Individual blueprint YAML files for the blueprint catalog
- `recipes/` — AIM recipe YAML files (one per model/hardware/precision combination)
- `templates/` — Templates for new model and blueprint YAML files
- `model_catalog_schema.json` — JSON schema for validating model YAML files
- `blueprint_catalog_schema.json` — JSON schema for validating blueprint YAML files
- `aim_recipe_schema.json` — JSON schema for validating recipe files
- `blueprint-catalog.yaml` — Aggregated blueprint catalog file
- `validate_model_yaml.py` — Python script to validate model YAMLs
- `validate_blueprint_yaml.py` — Python script to validate blueprint YAMLs
- `validate_aim_recipe_yaml.py` — Python script to validate AIM recipes
- `fetch_model_cards.py` — Python script to fetch model card information from Hugging Face
- `requirements.txt` — Python dependencies for the scripts

---

## Requirements

- Python 3.8+
- `PyYAML`, `jsonschema`, and `requests` Python packages

Install requirements:

```bash
pip install -r requirements.txt
```

---

## Model Card Fetching

The `fetch_model_cards.py` script automatically fetches comprehensive model card information from Hugging Face for all models in the catalog.

### Fetch Model Cards for All Models

```bash
python3 fetch_model_cards.py --models-dir models
```

### Fetch with Hugging Face API Token

For better rate limits and access to private models:

```bash
# Using environment variable
export HF_TOKEN=your_huggingface_token
python3 fetch_model_cards.py --models-dir models

# Or using command line argument
python3 fetch_model_cards.py --models-dir models --api-token your_huggingface_token
```

### What the Script Does

1. **Reads all model YAML files** in the specified directory
2. **Fetches model information** from Hugging Face API using the `huggingface_id`
3. **Downloads model card README** from the Hugging Face repository
4. **Parses and extracts** structured information:
   - Overview/description
   - Intended use cases
   - Limitations
   - Training data information
   - Evaluation metrics and benchmarks
   - Known issues
   - References and citations
5. **Updates the `model_card` section** in each YAML file with the fetched information

### Example Output

```
Hugging Face Model Card Fetcher
========================================
Warning: No API token provided. Some requests may be rate-limited.
Set HF_TOKEN environment variable or use --api-token for better results.
Found 8 model YAML files

Processing qwen3-32b.yaml...
  Fetching data for Qwen/Qwen3-32B...
  ✓ Updated qwen3-32b.yaml

Processing llama-3-8b.yaml...
  Fetching data for meta-llama/Meta-Llama-3-8B-Instruct...
  ✓ Updated llama-3-8b.yaml
...
========================================
Model card update completed!
```

### Best Practices

- Run this script periodically to keep model card information up-to-date
- Use a Hugging Face API token for better rate limits and access to private models
- The script includes rate limiting (1 second between requests) to be respectful to Hugging Face's servers
- Review the fetched information and manually edit if needed for accuracy or completeness

---

## Model YAML Validation

### Validate a Single Model YAML

```bash
python3 validate_model_yaml.py models/<model-filename>.yaml
```

### Validate All Model YAMLs

```bash
python3 validate_model_yaml.py --all
```

#### What the Script Checks

- **Schema validation**: Ensures all required fields, types, and allowed values are present (see `model_catalog_schema.json`).

#### Best Practices

- Place all model YAMLs in the `models/` directory.
- Use the template in `templates/model_template.yaml` for new models.
- Run the validation script before submitting or deploying new models.

#### Example Output

```
$ python3 validate_model_yaml.py --all
🔍 Validating 5 model YAML file(s)...
--------------------------------------------------
✅ models/llama-3-8b.yaml: Valid
✅ models/deepseek-r1-0528.yaml: Valid
...
--------------------------------------------------
📊 Summary: 5/5 files valid
🎉 All files passed validation!
```

---

## AIM Recipe Validation

### Validate a Single Recipe

```bash
python3 validate_aim_recipe_yaml.py recipes/<recipe-filename>.yaml
```

### Validate All Recipes

```bash
python3 validate_aim_recipe_yaml.py --all
```

### Validate Recipes in a Custom Directory

```bash
python3 validate_aim_recipe_yaml.py --recipes-dir /path/to/recipes
```

#### What the Script Checks

- **Schema validation**: Ensures all required fields, types, and allowed values are present (see `aim_recipe_schema.json`).
- **Structure checks** (planned/optional):
  - `recipe_id` matches the filename
  - `model_id` and `huggingface_id` are consistent
  - At least one serving config is enabled
  - `tensor-parallel-size` matches the GPU count in each config

#### Best Practices

- Place all recipe YAMLs in the `recipes/` directory.
- Use the naming convention: `<model-name>-<hardware>-<precision>.yaml` (e.g., `deepseek-r1-0528-mi300x-fp16.yaml`).
- Run the validation script before submitting or deploying new recipes.
- Keep the schema (`aim_recipe_schema.json`) up to date with any new fields or requirements.

#### Example Output

```
$ python3 validate_aim_recipe_yaml.py --all
🔍 Validating 11 AIM recipe YAML file(s)...
--------------------------------------------------
✅ recipes/deepseek-r1-0528-mi300x-fp16.yaml: Valid
✅ recipes/llama-3-8b-mi250-fp16.yaml: Valid
...
--------------------------------------------------
📊 Summary: 11/11 files valid
🎉 All files passed validation!
```

---

## Blueprint Catalog Management

The blueprint catalog provides a structured way to manage AI application blueprints, similar to the model catalog. Blueprints are pre-configured AI application templates that combine models with functional microservices.

### Directory Structure

- `blueprints/` — Individual blueprint YAML files
- `blueprint-catalog.yaml` — Aggregated blueprint catalog file
- `blueprint_catalog_schema.json` — JSON schema for validating blueprint YAML files
- `templates/blueprint_catalog_template.yaml` — Template for new blueprint YAML files

### Blueprint YAML Structure

Each blueprint YAML file contains:

- **Basic Information**: ID, name, category, complexity, description
- **Status & Badges**: Readiness level, status badges, tags
- **API Information**: Endpoint, demo assets, API examples
- **AIM Recipes**: Hardware-specific deployment configurations
- **Blueprint Card**: Detailed documentation including overview, intended use, limitations
- **Microservices**: Models and functional services used by the blueprint

### Available Blueprints

- **ChatQnA**: RAG-based chatbot for knowledge base interactions
- **AgentQnA**: Multi-agent system for complex question-answering
- **CodeTrans**: Code translation between programming languages
- **DocSum**: Document summarization with different approaches

### Blueprint Validation

#### Validate Individual Blueprint YAMLs (Python)

```bash
# Validate a single blueprint YAML file
python3 validate_blueprint_yaml.py blueprints/chatqna.yaml

# Validate all blueprint YAML files
python3 validate_blueprint_yaml.py --all
```

#### Validate Individual Blueprint YAMLs (Node.js)

```bash
# Using Node.js validation (recommended)
npm run validate-blueprint-data

# Or using TypeScript directly
npx tsx scripts/validateBlueprintData.ts
```

#### Validate Blueprint Catalog

```bash
npm run validate-blueprint-catalog
```

#### Convert Individual YAMLs to Catalog

```bash
npm run convert-blueprints
```

### Creating New Blueprints

1. **Use the template** in `templates/blueprint_catalog_template.yaml`
2. **Create a new YAML file** in the `blueprints/` directory
3. **Follow the naming convention**: `<blueprint-name>.yaml` (e.g., `chatqna.yaml`)
4. **Validate the blueprint**:
   ```bash
   # Python validation (recommended for YAML structure)
   python3 validate_blueprint_yaml.py blueprints/your-blueprint.yaml
   
   # Node.js validation (recommended for integration)
   npm run validate-blueprint-data
   ```
5. **Update the catalog**:
   ```bash
   npm run convert-blueprints
   npm run validate-blueprint-catalog
   ```

### Blueprint Schema Validation

The `blueprint_catalog_schema.json` ensures:

- **Required fields** are present and correctly typed
- **Allowed values** for enums (status, complexity, etc.)
- **Nested structures** for microservices and API examples
- **Consistent formatting** across all blueprints

### Example Blueprint YAML

```yaml
blueprint_id: chatqna
name: ChatQnA
category: Conversational AI
complexity: Intermediate
description: RAG-based chatbot for knowledge base interactions
shortDescription: Advanced chatbot with retrieval capabilities
logo: bp_chatqna.png
readiness_level: Production-Ready
status_badges: [Featured, Production-Ready, RAG]
tags: [RAG, Chatbot, Knowledge Base, Vector Search]
status: Production Ready
endpoint: https://api.inference-hub.com/v1/blueprints/chatqna

microservices:
  models:
    - name: Qwen3 32B
      logo: /src/assets/models/model_qwen3_32b.png
      tags: [Text Generation, RAG, Inference, Reasoning]
  functional:
    - name: Retriever
      description: Vector-based document retrieval service
      tags: [RAG, Vector Search, Document Processing]
```

### Blueprint Integration

Blueprints integrate with:

- **Model Catalog**: Uses models from the model catalog
- **AIM Recipes**: Leverages hardware-specific deployment configurations
- **Functional Services**: Combines with specialized microservices
- **API Framework**: Provides standardized API endpoints

---

## Complete Workflow

For a complete model and blueprint setup workflow:

1. **Create a new model YAML** using the template in `templates/model_template.yaml`
2. **Fetch model card information** from Hugging Face:
   ```bash
   python3 fetch_model_cards.py --models-dir models
   ```
3. **Validate the model YAML**:
   ```bash
   python3 validate_model_yaml.py models/your-model.yaml
   ```
4. **Create AIM recipes** for different hardware/precision combinations
5. **Validate the recipes**:
   ```bash
   python3 validate_aim_recipe_yaml.py --all
   ```
6. **Create blueprint YAMLs** using the template in `templates/blueprint_catalog_template.yaml`
7. **Validate blueprints**:
   ```bash
   # Python validation (recommended for YAML structure)
   python3 validate_blueprint_yaml.py --all
   
   # Node.js validation (recommended for integration)
   npm run validate-blueprint-data
   ```
8. **Update blueprint catalog**:
   ```bash
   npm run convert-blueprints
   npm run validate-blueprint-catalog
   ```

---

## Troubleshooting

- If you see `not found` errors, check that you are running the script from the `src/aim/` directory and that the `models/` or `recipes/` directory exists.
- If you see schema validation errors, check the error message and update your YAML file to match the schema.
- If model card fetching fails, check your internet connection and consider using a Hugging Face API token for better access.

## Extending the Workflow

- You can add stricter structure checks or a `--strict` flag in the scripts.
- Update the schemas as new fields or serving methods are added.
- Modify the model card parsing logic in `fetch_model_cards.py` to extract additional fields or improve parsing accuracy.

---

For questions or improvements, please open an issue or contact the maintainers.
