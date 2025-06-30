import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface BlueprintData {
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
    evaluation: string[];
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

interface GeneratedBlueprintData {
  [key: string]: BlueprintData;
}

function generateBlueprintData(): void {
  const blueprintsDir = path.join(__dirname, '../src/aim/blueprints');
  const outputFile = path.join(__dirname, '../src/utils/generatedBlueprintData.ts');
  
  const blueprintData: GeneratedBlueprintData = {};
  
  try {
    // Check if blueprints directory exists
    if (!fs.existsSync(blueprintsDir)) {
      console.log(`📁 Creating blueprints directory: ${blueprintsDir}`);
      fs.mkdirSync(blueprintsDir, { recursive: true });
    }
    
    const files = fs.readdirSync(blueprintsDir);
    
    for (const file of files) {
      if (file.endsWith('.yaml')) {
        const filePath = path.join(blueprintsDir, file);
        const yamlContent = fs.readFileSync(filePath, 'utf8');
        const data = yaml.load(yamlContent) as BlueprintData;
        
        if (data.blueprint_id) {
          blueprintData[data.blueprint_id] = data;
        }
      }
    }
    
    // Generate TypeScript file
    const tsContent = `// This file is auto-generated. Do not edit manually.
// Run 'npm run generate-blueprint-data' to regenerate.

export const generatedBlueprintData = ${JSON.stringify(blueprintData, null, 2)} as const;

export type GeneratedBlueprintData = typeof generatedBlueprintData;
`;

    fs.writeFileSync(outputFile, tsContent);
    console.log(`✅ Generated blueprint data for ${Object.keys(blueprintData).length} blueprints`);
    console.log(`📁 Output: ${outputFile}`);
    
    if (Object.keys(blueprintData).length === 0) {
      console.log(`⚠️  No YAML files found in ${blueprintsDir}`);
      console.log(`💡 Create YAML files for your blueprints to generate data automatically`);
    }
    
  } catch (error) {
    console.error('❌ Error generating blueprint data:', error);
    process.exit(1);
  }
}

// Run the function
generateBlueprintData(); 