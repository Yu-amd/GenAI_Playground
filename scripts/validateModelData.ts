#!/usr/bin/env tsx

import { models } from '../src/data/models';
import { loadAllModels } from '../src/utils/modelLoader';
import fs from 'fs';
import path from 'path';

interface ValidationResult {
  success: boolean;
  errors: string[];
  warnings: string[];
}

interface Model {
  id: string;
  org: string;
  builder: string;
  family: string;
  name: string;
  variant: string;
  size: string;
  description: string;
  shortDescription: string;
  image: string;
  localCard: string;
  tags: string[];
  useCase: string;
  precision: string;
  license: string;
  compatibility: string[];
  readiness: string;
  badge?: string;
}

async function validateModelData(): Promise<ValidationResult> {
  const result: ValidationResult = {
    success: true,
    errors: [],
    warnings: []
  };

  console.log('🔍 Validating model data...');

  // 1. Validate models.ts structure
  try {
    if (!Array.isArray(models)) {
      result.errors.push('models should be an array');
      result.success = false;
    }

    for (const [index, model] of models.entries()) {
      const modelErrors = validateModelStructure(model, index);
      result.errors.push(...modelErrors);
    }

    if (result.errors.length > 0) {
      result.success = false;
    }
  } catch (error) {
    result.errors.push(`Failed to validate models.ts: ${error}`);
    result.success = false;
  }

  // 2. Validate model loader functionality
  try {
    const allModels = await loadAllModels();
    if (!Array.isArray(allModels)) {
      result.errors.push('loadAllModels() should return an array');
      result.success = false;
    }

    if (allModels.length === 0) {
      result.warnings.push('No models loaded from loadAllModels()');
    }
  } catch (error) {
    result.errors.push(`Failed to load models: ${error}`);
    result.success = false;
  }

  // 3. Validate model card files exist
  const modelCardsDir = path.join(process.cwd(), 'src', 'modelcards');
  const modelCardFiles = fs.readdirSync(modelCardsDir).filter(file => file.endsWith('.md'));

  for (const model of models) {
    const expectedCardFile = `${model.id.replace(/\//g, '-')}.md`;
    if (!modelCardFiles.includes(expectedCardFile)) {
      result.warnings.push(`Model card file not found for ${model.id}: ${expectedCardFile}`);
    }
  }

  // 4. Validate image assets exist
  const assetsDir = path.join(process.cwd(), 'src', 'assets', 'models');
  const imageFiles = fs.readdirSync(assetsDir).filter(file => file.endsWith('.png'));

  for (const model of models) {
    const imagePath = model.image;
    if (imagePath && !imagePath.includes('http')) {
      const imageName = path.basename(imagePath);
      if (!imageFiles.includes(imageName)) {
        result.warnings.push(`Image file not found for ${model.id}: ${imageName}`);
      }
    }
  }

  return result;
}

function validateModelStructure(model: Model, index: number): string[] {
  const errors: string[] = [];
  const requiredFields = [
    'id', 'org', 'builder', 'family', 'name', 'variant', 'size',
    'description', 'shortDescription', 'image', 'localCard', 'tags',
    'useCase', 'precision', 'license', 'compatibility', 'readiness', 'badge'
  ];

  for (const field of requiredFields) {
    if (!(field in model)) {
      errors.push(`Model ${index}: Missing required field '${field}'`);
    }
  }

  // Validate specific field types
  if (model.id && typeof model.id !== 'string') {
    errors.push(`Model ${index}: 'id' should be a string`);
  }

  if (model.tags && !Array.isArray(model.tags)) {
    errors.push(`Model ${index}: 'tags' should be an array`);
  }

  if (model.compatibility && !Array.isArray(model.compatibility)) {
    errors.push(`Model ${index}: 'compatibility' should be an array`);
  }

  // Validate badge values
  const validBadges = ['New', 'Featured', 'Tech Preview'];
  if (model.badge && !validBadges.includes(model.badge)) {
    errors.push(`Model ${index}: 'badge' should be one of: ${validBadges.join(', ')}`);
  }

  // Validate use case values
  const validUseCases = ['Text Generation', 'Code Generation', 'Multimodal', 'Efficient LLM'];
  if (model.useCase && !validUseCases.includes(model.useCase)) {
    errors.push(`Model ${index}: 'useCase' should be one of: ${validUseCases.join(', ')}`);
  }

  return errors;
}

// Run validation
async function main() {
  const result = await validateModelData();

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