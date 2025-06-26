#!/usr/bin/env python3
"""
AIM Recipe YAML Validation Script

This script validates AIM recipe YAML files against the AIM recipe schema.
It can validate a single file or all recipe YAML files in the recipes directory.

Usage:
    python3 validate_aim_recipe_yaml.py [filename.yaml]
    python3 validate_aim_recipe_yaml.py --all
    python3 validate_aim_recipe_yaml.py --recipes-dir /path/to/recipes
"""

import json
import yaml
import sys
import os
import glob
from jsonschema import validate, ValidationError
from typing import Dict, Any, List

def load_schema(schema_path: str = "aim_recipe_schema.json") -> Dict[str, Any]:
    """Load the JSON schema for validation."""
    try:
        with open(schema_path, "r") as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"❌ Schema file '{schema_path}' not found.")
        print(f"   Expected location: {os.path.abspath(schema_path)}")
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
        print(f"   Expected location: {os.path.abspath(file_path)}")
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

def validate_aim_recipe_files(filenames: List[str]) -> bool:
    """Validate multiple AIM recipe YAML files."""
    schema = load_schema()
    
    if not filenames:
        print("❌ No files to validate.")
        return False
    
    all_valid = True
    valid_count = 0
    total_count = len(filenames)
    
    print(f"🔍 Validating {total_count} AIM recipe YAML file(s)...")
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

def get_aim_recipe_files(recipes_dir: str = "recipes") -> List[str]:
    """Get all AIM recipe YAML files in the recipes directory."""
    if not os.path.exists(recipes_dir):
        print(f"❌ Recipes directory '{recipes_dir}' not found.")
        return []
    
    # Pattern to match AIM recipe YAML files
    patterns = [
        "*-mi300x-fp16.yaml",
        "*-mi250-fp16.yaml",
        "*-mi300x-fp8.yaml", 
        "*-mi250-fp8.yaml",
        "*-mi300x-bf16.yaml",
        "*-mi250-bf16.yaml",
        "*-mi300x-int8.yaml",
        "*-mi250-int8.yaml",
        "*-mi300x-int4.yaml",
        "*-mi250-int4.yaml"
    ]
    
    recipe_files = []
    for pattern in patterns:
        full_pattern = os.path.join(recipes_dir, pattern)
        recipe_files.extend(glob.glob(full_pattern))
    
    return sorted(recipe_files)

def validate_recipe_structure(data: Dict[str, Any], filename: str) -> bool:
    """Additional validation beyond schema validation."""
    issues = []
    
    # Check if recipe_id matches filename
    expected_id = os.path.splitext(os.path.basename(filename))[0]
    if data.get('recipe_id') != expected_id:
        issues.append(f"recipe_id '{data.get('recipe_id')}' should match filename '{expected_id}'")
    
    # Check if model_id and huggingface_id are consistent
    model_id = data.get('model_id', '')
    hf_id = data.get('huggingface_id', '')
    if model_id and hf_id and model_id != hf_id:
        issues.append(f"model_id '{model_id}' and huggingface_id '{hf_id}' should be consistent")
    
    # Check if at least one serving method is enabled
    vllm_enabled = any(
        config.get('enabled', False) 
        for config in data.get('vllm_serve', {}).values()
    )
    sglang_enabled = any(
        config.get('enabled', False) 
        for config in data.get('sglang_serve', {}).values()
    )
    
    if not vllm_enabled and not sglang_enabled:
        issues.append("At least one serving method (vllm_serve or sglang_serve) should be enabled")
    
    # Check GPU configurations
    for service_name, service_config in [('vllm_serve', data.get('vllm_serve', {})), 
                                        ('sglang_serve', data.get('sglang_serve', {}))]:
        for gpu_config, config in service_config.items():
            if config.get('enabled', False):
                # Check if tensor-parallel-size matches GPU count
                args = config.get('args', {})
                tensor_parallel = args.get('--tensor-parallel-size', '')
                gpu_count = gpu_config.split('_')[0]
                
                if tensor_parallel and tensor_parallel != gpu_count:
                    issues.append(f"{service_name}.{gpu_config}: tensor-parallel-size '{tensor_parallel}' should match GPU count '{gpu_count}'")
    
    if issues:
        print(f"⚠️  {filename}: Structure validation warnings:")
        for issue in issues:
            print(f"   - {issue}")
        return False
    
    return True

def main():
    """Main function to handle command line arguments and run validation."""
    recipes_dir = "recipes"
    
    if len(sys.argv) > 1:
        if sys.argv[1] == "--all" or sys.argv[1] == "-a":
            # Validate all AIM recipe YAML files
            files = get_aim_recipe_files(recipes_dir)
            if not files:
                print(f"❌ No AIM recipe YAML files found in '{recipes_dir}' directory.")
                print(f"   Expected patterns: *-mi300x-fp16.yaml, *-mi250-fp16.yaml, etc.")
                sys.exit(1)
            success = validate_aim_recipe_files(files)
        elif sys.argv[1] == "--recipes-dir":
            if len(sys.argv) < 3:
                print("❌ --recipes-dir requires a directory path")
                sys.exit(1)
            recipes_dir = sys.argv[2]
            files = get_aim_recipe_files(recipes_dir)
            if not files:
                print(f"❌ No AIM recipe YAML files found in '{recipes_dir}' directory.")
                sys.exit(1)
            success = validate_aim_recipe_files(files)
        else:
            # Validate specific file
            filename = sys.argv[1]
            if not filename.endswith('.yaml'):
                filename += '.yaml'
            
            # If filename doesn't include recipes/ prefix, add it
            if not filename.startswith('recipes/') and not os.path.exists(filename):
                filename = os.path.join('recipes', filename)
            
            success = validate_aim_recipe_files([filename])
    else:
        # Default: validate all recipes
        files = get_aim_recipe_files(recipes_dir)
        if not files:
            print(f"❌ No AIM recipe YAML files found in '{recipes_dir}' directory.")
            print(f"   Expected patterns: *-mi300x-fp16.yaml, *-mi250-fp16.yaml, etc.")
            sys.exit(1)
        success = validate_aim_recipe_files(files)
    
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()
