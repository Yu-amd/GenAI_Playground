import llamaImg from '../assets/models/model_llama3_1.png';
import deepseekImg from '../assets/models/model_DeepSeek_MoE_18B.png';
import llama4MaverickImg from '../assets/models/model_llama4_maverick.png';
import qwen3Img from '../assets/models/model_qwen3_32b.png';
import { generatedModelData } from './generatedModelData';

export interface ModelData {
  model_id: string;
  name: string;
  builder: string;
  family: string;
  size: string;
  huggingface_id: string;
  description: string;
  logo: string;
  readiness_level: string;
  status_badges: readonly string[];
  tags: readonly string[];
  license: string;
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
  model_card: {
    overview: string;
    intended_use: readonly string[];
    limitations: readonly string[];
    training_data: string;
    evaluation: readonly string[];
    known_issues: readonly string[];
    references: readonly string[];
  };
}

export interface ModelCatalogItem {
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
  badge: string;
}

// Map model IDs to their image assets
export const modelImageMap: Record<string, string> = {
  'deepseek-ai/DeepSeek-R1-0528': deepseekImg,
  'meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8': llama4MaverickImg,
  'amd/Llama-3_1-405B-Instruct-FP8-KV': llamaImg, // Using Llama 3 image as placeholder
  'Qwen/Qwen3-32B': qwen3Img,
};

// Map readiness levels to display values
const readinessMap: Record<string, string> = {
  'Production-Ready': 'production-ready',
  'Tech-Preview': 'tech-preview',
  Experimental: 'experimental',
};

// Map tags to use cases
const tagToUseCaseMap: Record<string, string> = {
  'Text Generation': 'Text Generation',
  'Code Generation': 'Code Generation',
  Multimodal: 'Multimodal',
  'MoE Architecture': 'Efficient LLM',
  Efficient: 'Efficient LLM',
};

export async function loadModelData(
  modelId: string
): Promise<ModelData | null> {
  try {
    // Try to load from YAML files first
    const response = await fetch(
      `/src/aim/models/${modelId.split('/').pop()}.yaml`
    );
    if (response.ok) {
      // For now, fall back to generated data since we need a YAML parser
      // In a real implementation, you'd parse the YAML here
      await response.text(); // Just consume the response
    }
  } catch (error) {
    console.warn(`Failed to load YAML for ${modelId}:`, error);
  }

  return generatedModelData[modelId as keyof typeof generatedModelData] || null;
}

export async function loadAllModels(): Promise<ModelCatalogItem[]> {
  try {
    // Load all models from the generated data
    const modelIds = Object.keys(generatedModelData) as Array<
      keyof typeof generatedModelData
    >;

    const models: ModelCatalogItem[] = [];
    for (const modelId of modelIds) {
      const modelData = await loadModelData(modelId as string);
      if (modelData) {
        const catalogItem = convertToCatalogItem(modelData);
        models.push(catalogItem);
      }
    }
    return models;
  } catch (error) {
    console.error('Failed to load models:', error);
    return [];
  }
}

function convertToCatalogItem(modelData: ModelData): ModelCatalogItem {
  const variant = modelData.name.split(' ').pop() || modelData.size;
  const tags = Array.from(modelData.tags);
  const status_badges = Array.from(modelData.status_badges);
  const useCase = tags.find(tag => tagToUseCaseMap[tag]) || 'Text Generation';
  const compatibility = tags
    .filter(tag => tag.includes('vLLM') || tag.includes('sglang'))
    .map(tag => tag.replace('-Compatible', '').toLowerCase());
  let badge = 'New';
  if (status_badges.includes('Featured')) {
    badge = 'Featured';
  } else if (modelData.readiness_level === 'Tech-Preview') {
    badge = 'Tech Preview';
  }
  return {
    id: modelData.model_id,
    org: modelData.builder,
    builder: modelData.builder,
    family: modelData.family,
    name: modelData.name,
    variant,
    size: modelData.size,
    description: modelData.description,
    shortDescription: modelData.description,
    image: '/src/assets/banner_wave.png',
    localCard:
      modelImageMap[modelData.model_id] || '/src/assets/models/default.png',
    tags,
    useCase,
    precision: status_badges.find(badge => badge.includes('FP')) || 'FP16',
    license: modelData.license,
    compatibility,
    readiness: readinessMap[modelData.readiness_level] || 'production-ready',
    badge,
  };
}
