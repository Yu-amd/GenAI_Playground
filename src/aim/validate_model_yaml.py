import json
import yaml
from jsonschema import validate, ValidationError

# Load the schema
with open("model_catalog_schema.json", "r") as s:
    schema = json.load(s)

# Load the model YAML file
with open("your_model.yaml", "r") as f:
    data = yaml.safe_load(f)

# Validate
try:
    validate(instance=data, schema=schema)
    print("✅ YAML is valid.")
except ValidationError as e:
    print("❌ Validation error:")
    print(e.message)
