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

---

## Requirements

- Python 3.8+
- `PyYAML` and `jsonschema` Python packages

Install requirements:
```bash
pip install pyyaml jsonschema
```

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

## Troubleshooting

- If you see `not found` errors, check that you are running the script from the `src/aim/` directory and that the `models/` or `recipes/` directory exists.
- If you see schema validation errors, check the error message and update your YAML file to match the schema.

## Extending the Workflow

- You can add stricter structure checks or a `--strict` flag in the scripts.
- Update the schemas as new fields or serving methods are added.

---

For questions or improvements, please open an issue or contact the maintainers. 