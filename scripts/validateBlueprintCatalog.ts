#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const SCHEMA_PATH = path.resolve('src/aim/schemas/blueprint_catalog.schema.json');
const DEFAULT_CATALOG_PATH = path.resolve('src/aim/blueprint-catalog.yaml');

function loadYamlOrJson(filePath: string): any {
  const content = fs.readFileSync(filePath, 'utf8');
  if (filePath.endsWith('.json')) {
    return JSON.parse(content);
  } else {
    return yaml.load(content);
  }
}

function validateCatalog(catalogPath: string, schemaPath: string): boolean {
  const schema = loadYamlOrJson(schemaPath);
  const catalog = loadYamlOrJson(catalogPath);

  const ajv = new Ajv({ allErrors: true });
  addFormats(ajv);
  const validate = ajv.compile(schema);
  const valid = validate(catalog);

  if (valid) {
    console.log('✅ Blueprint catalog is valid!');
    return true;
  } else {
    console.error('❌ Blueprint catalog validation failed. Errors:');
    for (const err of validate.errors || []) {
      const path = (err as any).instancePath || (err as any).dataPath || '';
      console.error(`- ${path} ${err.message}`);
    }
    return false;
  }
}

// CLI usage
const args = process.argv.slice(2);
let catalogPath = DEFAULT_CATALOG_PATH;
let schemaPath = SCHEMA_PATH;

for (let i = 0; i < args.length; i++) {
  switch (args[i]) {
    case '--catalog':
      catalogPath = path.resolve(args[++i]);
      break;
    case '--schema':
      schemaPath = path.resolve(args[++i]);
      break;
    case '--help':
      console.log(`\nBlueprint Catalog Validator\n\nUsage:\n  npm run validate-blueprint-catalog [options]\n\nOptions:\n  --catalog <path>   Path to blueprint catalog YAML/JSON (default: src/aim/blueprint-catalog.yaml)\n  --schema <path>    Path to JSON schema (default: src/aim/schemas/blueprint_catalog.schema.json)\n  --help             Show this help message\n`);
      process.exit(0);
      break;
  }
}

try {
  if (!fs.existsSync(catalogPath)) {
    console.error(`❌ Catalog file does not exist: ${catalogPath}`);
    process.exit(1);
  }
  if (!fs.existsSync(schemaPath)) {
    console.error(`❌ Schema file does not exist: ${schemaPath}`);
    process.exit(1);
  }
  const valid = validateCatalog(catalogPath, schemaPath);
  process.exit(valid ? 0 : 1);
} catch (error) {
  console.error('❌ Validation failed:', error);
  process.exit(1);
} 