import bp_chatqna from '../assets/blueprints/bp_chatqna.png';
import bp_agentqna from '../assets/blueprints/bp_agentqna.png';
import bp_codegen from '../assets/blueprints/bp_codegen.png';
import bp_codeTrans from '../assets/blueprints/bp_codeTrans.png';
import bp_searchQna from '../assets/blueprints/bp_searchQna.png';
import bp_docsum from '../assets/blueprints/bp_docsum.png';
import bp_translation from '../assets/blueprints/bp_translation.png';
import bp_avatarchatbot from '../assets/blueprints/bp_avatarchatbot.png';
import { generatedBlueprintData } from './generatedBlueprintData';

export interface BlueprintData {
  blueprint_id: string;
  name: string;
  category: string;
  complexity: string;
  description: string;
  shortDescription: string;
  logo: string;
  readiness_level: string;
  status_badges: readonly string[];
  tags: readonly string[];
  status: string;
  endpoint: string;
  demo_assets: {
    notebook: string;
    demo_link: string;
  };
  aim_recipes: ReadonlyArray<{
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
    intended_use: readonly string[];
    limitations: readonly string[];
    architecture: string;
    evaluation: readonly string[];
    known_issues: readonly string[];
    references: readonly string[];
  };
  microservices: {
    models: ReadonlyArray<{
      name: string;
      logo: string;
      tags: readonly string[];
    }>;
    functional: ReadonlyArray<{
      name: string;
      description: string;
      tags: readonly string[];
    }>;
  };
}

export interface BlueprintCatalogItem {
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

// Map blueprint IDs to their image assets
export const blueprintImageMap: Record<string, string> = {
  chatqna: bp_chatqna,
  agentqna: bp_agentqna,
  codegen: bp_codegen,
  codetrans: bp_codeTrans,
  searchqna: bp_searchQna,
  docsum: bp_docsum,
  translation: bp_translation,
  avatarchatbot: bp_avatarchatbot,
};

// Map readiness levels to display values
const readinessMap: Record<string, string> = {
  'Production-Ready': 'production-ready',
  'Tech-Preview': 'tech-preview',
  Experimental: 'experimental',
};

// Map tags to categories - commented out as unused
// const tagToCategoryMap: Record<string, string> = {
//   'RAG': 'Conversational AI',
//   'Multi-Agent': 'Multi-Agent Systems',
//   'Code Generation': 'Development Tools',
//   'Code Translation': 'Development Tools',
//   'Search Integration': 'Enhanced AI',
//   'Document Summarization': 'Content Processing',
//   'Language Translation': 'Language Processing',
//   'Avatar Integration': 'Visual AI',
// };

export async function loadBlueprintData(
  blueprintId: string
): Promise<BlueprintData | null> {
  try {
    // Try to load from YAML files first
    const response = await fetch(`/src/aim/blueprints/${blueprintId}.yaml`);
    if (response.ok) {
      // For now, fall back to generated data since we need a YAML parser
      // In a real implementation, you'd parse the YAML here
      await response.text(); // Just consume the response
    }
  } catch (error) {
    console.warn(`Failed to load YAML for ${blueprintId}:`, error);
  }

  return (
    generatedBlueprintData[
      blueprintId as keyof typeof generatedBlueprintData
    ] || null
  );
}

export async function loadAllBlueprints(): Promise<BlueprintCatalogItem[]> {
  try {
    // Load all blueprints from the generated data
    const blueprintIds = Object.keys(generatedBlueprintData) as Array<
      keyof typeof generatedBlueprintData
    >;

    const blueprints: BlueprintCatalogItem[] = [];
    for (const blueprintId of blueprintIds) {
      const blueprintData = await loadBlueprintData(blueprintId as string);
      if (blueprintData) {
        const catalogItem = convertToCatalogItem(blueprintData);
        blueprints.push(catalogItem);
      }
    }
    return blueprints;
  } catch (error) {
    console.error('Failed to load blueprints:', error);
    return [];
  }
}

function convertToCatalogItem(
  blueprintData: BlueprintData
): BlueprintCatalogItem {
  const tags = Array.from(blueprintData.tags);
  const status_badges = Array.from(blueprintData.status_badges);
  // const category = tags.find(tag => tagToCategoryMap[tag]) || 'AI Application';
  let badge = undefined;
  if (status_badges.includes('Featured')) {
    badge = 'Featured';
  } else if (status_badges.includes('New')) {
    badge = 'New';
  } else if (blueprintData.readiness_level === 'Tech-Preview') {
    badge = 'Tech Preview';
  }

  return {
    id: blueprintData.blueprint_id,
    category: blueprintData.category,
    complexity: blueprintData.complexity,
    name: blueprintData.name,
    description: blueprintData.description,
    shortDescription: blueprintData.shortDescription,
    image: '/src/assets/banner_wave.png',
    localCard:
      blueprintImageMap[blueprintData.blueprint_id] ||
      '/src/assets/blueprints/default.png',
    tags,
    status: blueprintData.status,
    readiness:
      readinessMap[blueprintData.readiness_level] || 'production-ready',
    badge,
  };
}
