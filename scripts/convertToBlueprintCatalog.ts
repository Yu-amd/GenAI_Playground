#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';

interface BlueprintCatalog {
  catalog_metadata: {
    version: string;
    last_updated: string;
    total_blueprints: number;
    categories: string[];
  };
  blueprints: IndividualBlueprint[];
}

interface IndividualBlueprint {
  blueprint_id: string;
  name: string;
  category: string;
  complexity: string;
  description: string;
  shortDescription: string;
  logo: string;
  readiness_level: string;
  status_badges: string[];
  tags: string[];
  status: string;
  endpoint: string;
  demo_assets: {
    notebook: string;
    demo_link: string;
  };
  aim_recipes: Array<{
    name: string;
    hardware: string;
    precision: string;
    recipe_file: string;
  }>;
  api_examples: {
    python: string;
    typescript: string;
    shell: string;
    rust: string;
    go: string;
  };
  blueprint_card: {
    overview: string;
    intended_use: string[];
    limitations: string[];
    architecture: string;
    evaluation: Array<string>;
    known_issues: string[];
    references: string[];
  };
  microservices: {
    models: Array<{
      name: string;
      logo: string;
      tags: string[];
    }>;
    functional: Array<{
      name: string;
      description: string;
      tags: string[];
    }>;
  };
}

function loadIndividualBlueprint(filePath: string): IndividualBlueprint {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const blueprint = yaml.load(fileContent) as IndividualBlueprint;
    
    // Validate required fields
    if (!blueprint.blueprint_id) {
      throw new Error(`Missing blueprint_id in ${filePath}`);
    }
    
    return blueprint;
  } catch (error) {
    console.error(`Error loading blueprint from ${filePath}:`, error);
    throw error;
  }
}

function collectCategories(blueprints: IndividualBlueprint[]): string[] {
  const categories = new Set<string>();
  blueprints.forEach(bp => {
    if (bp.category) {
      categories.add(bp.category);
    }
  });
  return Array.from(categories).sort();
}

function convertToCatalog(blueprintsDir: string, outputPath: string): void {
  console.log(`Converting blueprints from ${blueprintsDir} to catalog format...`);
  
  // Read all YAML files from the blueprints directory
  const blueprintFiles = fs.readdirSync(blueprintsDir)
    .filter(file => file.endsWith('.yaml') || file.endsWith('.yml'))
    .map(file => path.join(blueprintsDir, file));
  
  if (blueprintFiles.length === 0) {
    console.warn('No YAML files found in blueprints directory');
    return;
  }
  
  // Load all individual blueprints
  const blueprints: IndividualBlueprint[] = [];
  for (const filePath of blueprintFiles) {
    try {
      const blueprint = loadIndividualBlueprint(filePath);
      blueprints.push(blueprint);
      console.log(`Loaded blueprint: ${blueprint.name} (${blueprint.blueprint_id})`);
    } catch (error) {
      console.error(`Failed to load blueprint from ${filePath}:`, error);
    }
  }
  
  // Create catalog structure
  const categories = collectCategories(blueprints);
  const catalog: BlueprintCatalog = {
    catalog_metadata: {
      version: "1.0.0",
      last_updated: new Date().toISOString().split('T')[0],
      total_blueprints: blueprints.length,
      categories: categories
    },
    blueprints: blueprints
  };
  
  // Write catalog to file
  try {
    const catalogYaml = yaml.dump(catalog, {
      indent: 2,
      lineWidth: 120,
      noRefs: true
    });
    
    fs.writeFileSync(outputPath, catalogYaml, 'utf8');
    console.log(`✅ Successfully created blueprint catalog at ${outputPath}`);
    console.log(`📊 Catalog contains ${blueprints.length} blueprints across ${categories.length} categories`);
    console.log(`📁 Categories: ${categories.join(', ')}`);
  } catch (error) {
    console.error('Error writing catalog file:', error);
    throw error;
  }
}

function validateCatalog(catalogPath: string): void {
  console.log(`Validating catalog at ${catalogPath}...`);
  
  try {
    const catalogContent = fs.readFileSync(catalogPath, 'utf8');
    const catalog = yaml.load(catalogContent) as BlueprintCatalog;
    
    // Basic validation
    if (!catalog.catalog_metadata) {
      throw new Error('Missing catalog_metadata');
    }
    
    if (!Array.isArray(catalog.blueprints)) {
      throw new Error('blueprints must be an array');
    }
    
    // Validate each blueprint
    const blueprintIds = new Set<string>();
    for (const blueprint of catalog.blueprints) {
      if (!blueprint.blueprint_id) {
        throw new Error('Blueprint missing blueprint_id');
      }
      
      if (blueprintIds.has(blueprint.blueprint_id)) {
        throw new Error(`Duplicate blueprint_id: ${blueprint.blueprint_id}`);
      }
      blueprintIds.add(blueprint.blueprint_id);
      
      // Check for required fields
      const requiredFields = ['name', 'category', 'description', 'shortDescription'];
      for (const field of requiredFields) {
        if (!blueprint[field]) {
          console.warn(`Blueprint ${blueprint.blueprint_id} missing field: ${field}`);
        }
      }
    }
    
    console.log(`✅ Catalog validation passed`);
    console.log(`📊 Found ${catalog.blueprints.length} blueprints`);
    console.log(`🏷️  Categories: ${catalog.catalog_metadata.categories.join(', ')}`);
    
  } catch (error) {
    console.error('❌ Catalog validation failed:', error);
    throw error;
  }
}

// CLI usage
const args = process.argv.slice(2);

if (args.length === 0) {
  console.log(`
Blueprint Catalog Converter

Usage:
  npm run convert-blueprints [options]

Options:
  --input-dir <path>     Directory containing individual blueprint YAML files (default: src/aim/blueprints)
  --output <path>        Output path for catalog YAML (default: src/aim/blueprint-catalog.yaml)
  --validate             Validate the generated catalog
  --help                 Show this help message

Examples:
  npm run convert-blueprints
  npm run convert-blueprints --input-dir ./blueprints --output ./catalog.yaml
  npm run convert-blueprints --validate
`);
  process.exit(0);
}

let inputDir = 'src/aim/blueprints';
let outputPath = 'src/aim/blueprint-catalog.yaml';
let shouldValidate = false;

for (let i = 0; i < args.length; i++) {
  switch (args[i]) {
    case '--input-dir':
      inputDir = args[++i];
      break;
    case '--output':
      outputPath = args[++i];
      break;
    case '--validate':
      shouldValidate = true;
      break;
    case '--help':
      console.log('Help message shown above');
      process.exit(0);
      break;
  }
}

try {
  // Ensure input directory exists
  if (!fs.existsSync(inputDir)) {
    console.error(`❌ Input directory does not exist: ${inputDir}`);
    process.exit(1);
  }
  
  // Convert blueprints to catalog
  convertToCatalog(inputDir, outputPath);
  
  // Validate if requested
  if (shouldValidate) {
    validateCatalog(outputPath);
  }
  
} catch (error) {
  console.error('❌ Conversion failed:', error);
  process.exit(1);
}

export { convertToCatalog, validateCatalog, loadIndividualBlueprint }; 