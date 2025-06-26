#!/usr/bin/env python3
"""
Model YAML Validation Script

This script validates model YAML files against the model catalog schema.
It can validate a single file or all YAML files in the current directory.

Usage:
    python3 validate_model_yaml.py [filename.yaml]
    python3 validate_model_yaml.py --all
"""

import json
import yaml
import sys
import os
import glob
from jsonschema import validate, ValidationError
from typing import Dict, Any, List

def load_schema(schema_path: str = "model_catalog_schema.json") -> Dict[str, Any]:
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

def load_yaml_file(file_path: str) -> Dict[str, Any]:
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

def validate_model_yaml_files(filenames: List[str]) -> bool:
    """Validate multiple YAML files."""
    schema = load_schema()
    
    if not filenames:
        print("❌ No files to validate.")
        return False
    
    all_valid = True
    valid_count = 0
    total_count = len(filenames)
    
    print(f"🔍 Validating {total_count} model YAML file(s)...")
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

def get_model_yaml_files() -> List[str]:
    """Get all model YAML files in the current directory."""
    # Pattern to match model YAML files (excluding template and recipe files)
    pattern = "*.yaml"
    files = glob.glob(pattern)
    
    # Filter out template and recipe files
    model_files = []
    for file in files:
        if not file.startswith("model_template") and not file.endswith("-mi300x-fp16.yaml"):
            model_files.append(file)
    
    return sorted(model_files)

def main():
    """Main function to handle command line arguments and run validation."""
    if len(sys.argv) > 1:
        if sys.argv[1] == "--all" or sys.argv[1] == "-a":
            # Validate all model YAML files
            files = get_model_yaml_files()
            if not files:
                print("❌ No model YAML files found in current directory.")
                sys.exit(1)
            success = validate_model_yaml_files(files)
        else:
            # Validate specific file
            filename = sys.argv[1]
            if not filename.endswith('.yaml'):
                filename += '.yaml'
            success = validate_model_yaml_files([filename])
    else:
        # Default: validate gemma-3-4b-it.yaml (original behavior)
        success = validate_model_yaml_files(["gemma-3-4b-it.yaml"])
    
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()
