import json
import yaml
from jsonschema import validate, ValidationError

# Load the AIM recipe schema
with open("aim_recipe_schema.json", "r") as s:
    schema = json.load(s)

# Load your AIM recipe YAML file
with open("your_aim_recipe.yaml", "r") as f:
    recipe = yaml.safe_load(f)

# Validate
try:
    validate(instance=recipe, schema=schema)
    print("✅ AIM recipe YAML is valid.")
except ValidationError as e:
    print("❌ Validation error:")
    print(e.message)
