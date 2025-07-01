#!/usr/bin/env python3
"""
Blueprint YAML Validation Script

This script validates blueprint YAML files against the blueprint catalog schema.
It can validate a single file or all YAML files in the blueprints directory.

Usage:
    python3 validate_blueprint_yaml.py [filename.yaml]
    python3 validate_blueprint_yaml.py --all
"""

import json
import yaml
import sys
import os
import glob
from jsonschema import validate, ValidationError
from typing import Dict, Any, List

def load_schema(schema_path: str = "blueprint_catalog_schema.json") -> Dict[str, Any]:
    """Load the JSON schema for validation."""
    try:
        with open(schema_path, "r") as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"❌ Schema file '{schema_path}' not found.")
        sys.exit(1)
    except json.JSONDecodeError as e:
        print(f"❌ Invalid JSON in schema file: {e}")
        sys.exit(1)

def load_yaml_file(file_path: str) -> Dict[str, Any] | None:
    """Load and parse a YAML file."""
    try:
        with open(file_path, "r") as f:
            return yaml.safe_load(f)
    except FileNotFoundError:
        print(f"❌ YAML file '{file_path}' not found.")
        return None
    except yaml.YAMLError as e:
        print(f"❌ Invalid YAML in '{file_path}': {e}")
        return None

def validate_yaml_file(data: Dict[str, Any], schema: Dict[str, Any], filename: str) -> bool:
    """Validate a YAML data structure against the schema."""
    try:
        validate(instance=data, schema=schema)
        print(f"✅ {filename}: Valid")
        return True
    except ValidationError as e:
        print(f"❌ {filename}: Validation error")
        print(f"   Path: {' -> '.join(str(p) for p in e.path)}")
        print(f"   Message: {e.message}")
        if e.validator_value:
            print(f"   Expected: {e.validator_value}")
        return False

def validate_blueprint_yaml_files(filenames: List[str]) -> bool:
    """Validate multiple YAML files."""
    schema = load_schema()
    
    if not filenames:
        print("❌ No files to validate.")
        return False
    
    all_valid = True
    valid_count = 0
    total_count = len(filenames)
    
    print(f"🔍 Validating {total_count} blueprint YAML file(s)...")
    print("-" * 50)
    
    for filename in filenames:
        data = load_yaml_file(filename)
        if data is None:
            all_valid = False
            continue
            
        if validate_yaml_file(data, schema, filename):
            valid_count += 1
        else:
            all_valid = False
    
    print("-" * 50)
    print(f"📊 Summary: {valid_count}/{total_count} files valid")
    
    if all_valid:
        print("🎉 All files passed validation!")
    else:
        print("⚠️  Some files failed validation.")
    
    return all_valid

def get_blueprint_yaml_files() -> List[str]:
    """Get all blueprint YAML files in the blueprints directory."""
    blueprints_dir = "blueprints"
    
    if not os.path.exists(blueprints_dir):
        print(f"❌ Blueprints directory '{blueprints_dir}' not found.")
        return []
    
    # Pattern to match blueprint YAML files
    pattern = os.path.join(blueprints_dir, "*.yaml")
    files = glob.glob(pattern)
    
    # Filter out template files
    blueprint_files = []
    for file in files:
        if not file.startswith("blueprint_template"):
            blueprint_files.append(file)
    
    return sorted(blueprint_files)

def validate_blueprint_structure(data: Dict[str, Any], filename: str) -> bool:
    """Additional structural validation for blueprints."""
    errors = []
    
    # Check for required top-level fields
    required_fields = [
        'blueprint_id', 'name', 'category', 'complexity', 'description',
        'shortDescription', 'logo', 'readiness_level', 'status_badges',
        'tags', 'status', 'endpoint', 'demo_assets', 'aim_recipes',
        'blueprint_card', 'microservices'
    ]
    
    for field in required_fields:
        if field not in data:
            errors.append(f"Missing required field: {field}")
    
    # Validate blueprint_id format
    if 'blueprint_id' in data:
        blueprint_id = data['blueprint_id']
        if not isinstance(blueprint_id, str) or not blueprint_id.replace('-', '').replace('_', '').isalnum():
            errors.append("blueprint_id must be alphanumeric with optional hyphens/underscores")
    
    # Validate microservices structure
    if 'microservices' in data:
        microservices = data['microservices']
        if not isinstance(microservices, dict):
            errors.append("microservices must be an object")
        else:
            if 'models' not in microservices:
                errors.append("microservices must contain 'models' array")
            if 'functional' not in microservices:
                errors.append("microservices must contain 'functional' array")
    
    # Validate demo_assets structure
    if 'demo_assets' in data:
        demo_assets = data['demo_assets']
        if not isinstance(demo_assets, dict):
            errors.append("demo_assets must be an object")
        else:
            required_demo_fields = ['notebook', 'demo_link']
            for field in required_demo_fields:
                if field not in demo_assets:
                    errors.append(f"demo_assets missing required field: {field}")
    
    # Validate aim_recipes structure
    if 'aim_recipes' in data:
        aim_recipes = data['aim_recipes']
        if not isinstance(aim_recipes, list):
            errors.append("aim_recipes must be an array")
        else:
            for i, recipe in enumerate(aim_recipes):
                if not isinstance(recipe, dict):
                    errors.append(f"aim_recipes[{i}] must be an object")
                else:
                    required_recipe_fields = ['name', 'hardware', 'precision', 'recipe_file']
                    for field in required_recipe_fields:
                        if field not in recipe:
                            errors.append(f"aim_recipes[{i}] missing required field: {field}")
    
    if errors:
        print(f"❌ {filename}: Structural validation errors:")
        for error in errors:
            print(f"   - {error}")
        return False
    
    return True

def validate_blueprint_files_with_structure(filenames: List[str]) -> bool:
    """Validate multiple YAML files with additional structural checks."""
    schema = load_schema()
    
    if not filenames:
        print("❌ No files to validate.")
        return False
    
    all_valid = True
    valid_count = 0
    total_count = len(filenames)
    
    print(f"🔍 Validating {total_count} blueprint YAML file(s)...")
    print("-" * 50)
    
    for filename in filenames:
        data = load_yaml_file(filename)
        if data is None:
            all_valid = False
            continue
        
        # Schema validation
        schema_valid = validate_yaml_file(data, schema, filename)
        
        # Structural validation
        structure_valid = validate_blueprint_structure(data, filename)
        
        if schema_valid and structure_valid:
            valid_count += 1
        else:
            all_valid = False
    
    print("-" * 50)
    print(f"📊 Summary: {valid_count}/{total_count} files valid")
    
    if all_valid:
        print("🎉 All files passed validation!")
    else:
        print("⚠️  Some files failed validation.")
    
    return all_valid

def main():
    """Main function to handle command line arguments and run validation."""
    if len(sys.argv) > 1:
        if sys.argv[1] == "--all" or sys.argv[1] == "-a":
            # Validate all blueprint YAML files
            files = get_blueprint_yaml_files()
            if not files:
                print("❌ No blueprint YAML files found in blueprints directory.")
                sys.exit(1)
            success = validate_blueprint_files_with_structure(files)
        else:
            # Validate specific file
            filename = sys.argv[1]
            if not filename.endswith('.yaml'):
                filename += '.yaml'
            
            # If it's a relative path, assume it's in the blueprints directory
            if not os.path.isabs(filename) and not filename.startswith('blueprints/'):
                filename = os.path.join('blueprints', filename)
            
            success = validate_blueprint_files_with_structure([filename])
    else:
        # Default: validate chatqna.yaml (example blueprint)
        success = validate_blueprint_files_with_structure(["blueprints/chatqna.yaml"])
    
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main() 