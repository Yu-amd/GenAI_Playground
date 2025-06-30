#!/usr/bin/env tsx

import { loadAllBlueprints } from '../src/utils/blueprintLoader';
import fs from 'fs';
import path from 'path';

interface ValidationResult {
  success: boolean;
  errors: string[];
  warnings: string[];
}

interface Blueprint {
  id: string;
  category: string;
  complexity: string;
  name: string;
  description: string;
  shortDescription: string;
  image: string;
  localCard: string;
  tags: string[];
  status: string;
  readiness: string;
  badge?: string;
}

async function validateBlueprintData(): Promise<ValidationResult> {
  const result: ValidationResult = {
    success: true,
    errors: [],
    warnings: []
  };

  console.log('🔍 Validating blueprint data...');

  // 1. Validate blueprint loader functionality
  try {
    const allBlueprints = await loadAllBlueprints();
    if (!Array.isArray(allBlueprints)) {
      result.errors.push('loadAllBlueprints() should return an array');
      result.success = false;
    }

    if (allBlueprints.length === 0) {
      result.warnings.push('No blueprints loaded from loadAllBlueprints()');
    }

    // Validate each blueprint structure
    for (const [index, blueprint] of allBlueprints.entries()) {
      const blueprintErrors = validateBlueprintStructure(blueprint, index);
      result.errors.push(...blueprintErrors);
    }

    if (result.errors.length > 0) {
      result.success = false;
    }
  } catch (error) {
    result.errors.push(`Failed to load blueprints: ${error}`);
    result.success = false;
  }

  // 2. Validate blueprint card files exist
  const blueprintCardsDir = path.join(process.cwd(), 'src', 'blueprintcards');
  if (fs.existsSync(blueprintCardsDir)) {
    const blueprintCardFiles = fs.readdirSync(blueprintCardsDir).filter(file => file.endsWith('.md'));

    const allBlueprints = await loadAllBlueprints();
    for (const blueprint of allBlueprints) {
      const expectedCardFile = `${blueprint.id}.md`;
      if (!blueprintCardFiles.includes(expectedCardFile)) {
        result.warnings.push(`Blueprint card file not found for ${blueprint.id}: ${expectedCardFile}`);
      }
    }
  } else {
    result.warnings.push('Blueprint cards directory not found: src/blueprintcards');
  }

  // 3. Validate image assets exist
  const assetsDir = path.join(process.cwd(), 'src', 'assets', 'blueprints');
  if (fs.existsSync(assetsDir)) {
    const imageFiles = fs.readdirSync(assetsDir).filter(file => file.endsWith('.png'));

    const allBlueprints = await loadAllBlueprints();
    for (const blueprint of allBlueprints) {
      const imagePath = blueprint.localCard;
      if (imagePath && !imagePath.includes('http')) {
        const imageName = path.basename(imagePath);
        if (!imageFiles.includes(imageName)) {
          result.warnings.push(`Image file not found for ${blueprint.id}: ${imageName}`);
        }
      }
    }
  } else {
    result.warnings.push('Blueprint assets directory not found: src/assets/blueprints');
  }

  // 4. Validate YAML files exist
  const yamlDir = path.join(process.cwd(), 'src', 'aim', 'blueprints');
  if (fs.existsSync(yamlDir)) {
    const yamlFiles = fs.readdirSync(yamlDir).filter(file => file.endsWith('.yaml'));
    
    const allBlueprints = await loadAllBlueprints();
    for (const blueprint of allBlueprints) {
      const expectedYamlFile = `${blueprint.id}.yaml`;
      if (!yamlFiles.includes(expectedYamlFile)) {
        result.warnings.push(`YAML file not found for ${blueprint.id}: ${expectedYamlFile}`);
      }
    }
  } else {
    result.warnings.push('Blueprint YAML directory not found: src/aim/blueprints');
  }

  return result;
}

function validateBlueprintStructure(blueprint: Blueprint, index: number): string[] {
  const errors: string[] = [];
  const requiredFields = [
    'id', 'category', 'complexity', 'name', 'description', 'shortDescription', 
    'image', 'localCard', 'tags', 'status', 'readiness'
  ];

  for (const field of requiredFields) {
    if (!(field in blueprint)) {
      errors.push(`Blueprint ${index}: Missing required field '${field}'`);
    }
  }

  // Validate specific field types
  if (blueprint.id && typeof blueprint.id !== 'string') {
    errors.push(`Blueprint ${index}: 'id' should be a string`);
  }

  if (blueprint.tags && !Array.isArray(blueprint.tags)) {
    errors.push(`Blueprint ${index}: 'tags' should be an array`);
  }

  // Validate badge values
  const validBadges = ['New', 'Featured', 'Tech Preview'];
  if (blueprint.badge && !validBadges.includes(blueprint.badge)) {
    errors.push(`Blueprint ${index}: 'badge' should be one of: ${validBadges.join(', ')}`);
  }

  // Validate complexity values
  const validComplexities = ['Beginner', 'Intermediate', 'Advanced'];
  if (blueprint.complexity && !validComplexities.includes(blueprint.complexity)) {
    errors.push(`Blueprint ${index}: 'complexity' should be one of: ${validComplexities.join(', ')}`);
  }

  // Validate status values
  const validStatuses = ['Production Ready', 'Tech Preview', 'Experimental'];
  if (blueprint.status && !validStatuses.includes(blueprint.status)) {
    errors.push(`Blueprint ${index}: 'status' should be one of: ${validStatuses.join(', ')}`);
  }

  // Validate category values
  const validCategories = [
    'Conversational AI', 'Multi-Agent Systems', 'Development Tools', 
    'Enhanced AI', 'Content Processing', 'Language Processing', 'Visual AI'
  ];
  if (blueprint.category && !validCategories.includes(blueprint.category)) {
    errors.push(`Blueprint ${index}: 'category' should be one of: ${validCategories.join(', ')}`);
  }

  return errors;
}

// Run validation
async function main() {
  const result = await validateBlueprintData();

  console.log('\n📊 Validation Results:');
  
  if (result.errors.length > 0) {
    console.log('\n❌ Errors:');
    result.errors.forEach(error => console.log(`  - ${error}`));
  }

  if (result.warnings.length > 0) {
    console.log('\n⚠️  Warnings:');
    result.warnings.forEach(warning => console.log(`  - ${warning}`));
  }

  if (result.success) {
    console.log('\n✅ All validations passed!');
    process.exit(0);
  } else {
    console.log('\n❌ Validation failed!');
    process.exit(1);
  }
}

main().catch(error => {
  console.error('Validation script failed:', error);
  process.exit(1);
}); 