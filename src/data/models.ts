import llamaImg from '../assets/models/model_llama3_1.png';
import llama3Card from '../modelcards/llama-3-8b.md?raw';

import deepseekImg from '../assets/models/model_DeepSeek_MoE_18B.png';
import deepseekCard from '../modelcards/deepseek-r1-0528.md?raw';

export const models = [
  {
    id: 'meta-llama/Llama-3-8B',
    org: 'Meta',
    builder: 'Meta AI',
    family: 'Llama',
    name: 'Llama 3',
    variant: '8B',
    size: '8B',
    description:
      'The Meta Llama 3.1 collection of multilingual large language models (LLMs) is a collection of pretrained and instruction tuned generative models in 8B, 70B and 405B sizes (text in/text out).',
    shortDescription: 'Multilingual LLM, 8B params, instruction-tuned.',
    image: llamaImg,
    localCard: llama3Card,
    tags: ['Text Generation', 'Multilingual', 'Instruction Tuned'],
    useCase: 'Text Generation',
    precision: 'FP16',
    license: 'Meta RAIL',
    compatibility: ['vllm', 'sglang'],
    readiness: 'production-ready',
    badge: 'Featured',
  },
  {
    id: 'deepseek-ai/deepseek-moe-16b-base',
    org: 'DeepSeek',
    builder: 'DeepSeek AI',
    family: 'DeepSeek MoE',
    name: 'DeepSeek MoE',
    variant: '16B Base',
    size: '16.4B',
    description:
      'Mixture-of-Experts (MoE) language model with 16.4B parameters. It employs an innovative MoE architecture, which involves two principal strategies: fine-grained expert segmentation and shared experts isolation.',
    shortDescription: 'Efficient MoE LLM, 16.4B params.',
    image: deepseekImg,
    localCard: deepseekCard,
    tags: ['MoE Architecture', 'Efficient', 'Base Model'],
    useCase: 'Efficient LLM',
    precision: 'FP16',
    license: 'Apache 2.0',
    compatibility: ['vllm'],
    readiness: 'day-0',
    badge: 'New',
  },
];
