#!/usr/bin/env tsx

import fs from 'fs';
import path from 'path';

interface ValidationResult {
  success: boolean;
  errors: string[];
  warnings: string[];
}



async function validateModelData(): Promise<ValidationResult> {
  const result: ValidationResult = {
    success: true,
    errors: [],
    warnings: []
  };

  console.log('🔍 Validating model data...');

  // 1. Validate models.ts structure by reading the file directly
  try {
    const modelsFilePath = path.join(process.cwd(), 'src', 'data', 'models.ts');
    const modelsContent = fs.readFileSync(modelsFilePath, 'utf8');
    
    // Basic validation of the models array structure
    if (!modelsContent.includes('export const models = [')) {
      result.errors.push('models.ts should export a models array');
      result.success = false;
    }

    // Count model entries by looking for object patterns
    const modelEntries = (modelsContent.match(/\{\s*id:/g) || []).length;
    if (modelEntries === 0) {
      result.errors.push('No model entries found in models.ts');
      result.success = false;
    } else {
      console.log(`Found ${modelEntries} model entries in models.ts`);
    }

  } catch (error) {
    result.errors.push(`Failed to read models.ts: ${error}`);
    result.success = false;
  }

  // 2. Validate model card files exist
  const modelCardsDir = path.join(process.cwd(), 'src', 'modelcards');
  if (!fs.existsSync(modelCardsDir)) {
    result.errors.push('Model cards directory does not exist');
    result.success = false;
  } else {
    const modelCardFiles = fs.readdirSync(modelCardsDir).filter(file => file.endsWith('.md'));
    console.log(`Found ${modelCardFiles.length} model card files: ${modelCardFiles.join(', ')}`);
    
    if (modelCardFiles.length === 0) {
      result.warnings.push('No model card files found');
    }
  }

  // 3. Validate image assets exist
  const assetsDir = path.join(process.cwd(), 'src', 'assets', 'models');
  if (!fs.existsSync(assetsDir)) {
    result.errors.push('Model assets directory does not exist');
    result.success = false;
  } else {
    const imageFiles = fs.readdirSync(assetsDir).filter(file => file.endsWith('.png'));
    console.log(`Found ${imageFiles.length} model image files: ${imageFiles.join(', ')}`);
    
    if (imageFiles.length === 0) {
      result.warnings.push('No model image files found');
    }
  }

  // 4. Validate blueprint catalog
  try {
    const blueprintCatalogPath = path.join(process.cwd(), 'src', 'aim', 'blueprint-catalog.yaml');
    if (fs.existsSync(blueprintCatalogPath)) {
      console.log('Blueprint catalog found');
    } else {
      result.warnings.push('Blueprint catalog not found');
    }
  } catch (error) {
    result.warnings.push(`Could not validate blueprint catalog: ${error}`);
  }

  return result;
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