import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface ModelData {
  model_id: string;
  name: string;
  builder: string;
  family: string;
  size: string;
  huggingface_id: string;
  description: string;
  logo: string;
  readiness_level: string;
  status_badges: string[];
  tags: string[];
  license: string;
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
  model_card: {
    overview: string;
    intended_use: string[];
    limitations: string[];
    training_data: string;
    evaluation: string[];
    known_issues: string[];
    references: string[];
  };
}

interface GeneratedModelData {
  [key: string]: ModelData;
}

function generateModelData(): void {
  const modelsDir = path.join(__dirname, '../src/aim/models');
  const outputFile = path.join(__dirname, '../src/utils/generatedModelData.ts');
  
  const modelData: GeneratedModelData = {};
  
  try {
    const files = fs.readdirSync(modelsDir);
    
    for (const file of files) {
      if (file.endsWith('.yaml')) {
        const filePath = path.join(modelsDir, file);
        const yamlContent = fs.readFileSync(filePath, 'utf8');
        const data = yaml.load(yamlContent) as ModelData;
        
        if (data.model_id) {
          modelData[data.model_id] = data;
        }
      }
    }
    
    // Generate TypeScript file
    const tsContent = `// This file is auto-generated. Do not edit manually.
// Run 'npm run generate-model-data' to regenerate.

export const generatedModelData = ${JSON.stringify(modelData, null, 2)} as const;

export type GeneratedModelData = typeof generatedModelData;
`;

    fs.writeFileSync(outputFile, tsContent);
    console.log(`✅ Generated model data for ${Object.keys(modelData).length} models`);
    console.log(`📁 Output: ${outputFile}`);
    
  } catch (error) {
    console.error('❌ Error generating model data:', error);
    process.exit(1);
  }
}

// Run the function
generateModelData(); 