# Model & AIM Recipe Validation Workflow

This directory contains YAML files and validation workflows for both the model catalog and AIM serving recipes. Both types of YAMLs have their own schema and validation scripts.

---

## Directory Structure

- `models/` — Per-model YAML files for the model catalog
- `recipes/` — AIM recipe YAML files (one per model/hardware/precision combination)
- `templates/` — Templates for new model YAMLs
- `model_catalog_schema.json` — JSON schema for validating model YAML files
- `aim_recipe_schema.json` — JSON schema for validating recipe files
- `validate_model_yaml.py` — Python script to validate model YAMLs
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

## Complete Workflow

For a complete model setup workflow:

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
