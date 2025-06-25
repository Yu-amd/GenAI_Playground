import llamaImg from '../assets/models/model_llama3_1.png';
import llama3Card from '../modelcards/llama-3-8b.md?raw';

import qwen2Img from '../assets/models/model_Qwen2-7B.png';
import qwen2Card from '../modelcards/qwen2-7b-instruct.md?raw';

import deepseekImg from '../assets/models/model_DeepSeek_MoE_18B.png';
import deepseekCard from '../modelcards/deepseek-r1-0528.md?raw';

import gemmaImg from '../assets/models/model_Gemma.png';
import gemmaCard from '../modelcards/gemma-3-4b-it.md?raw';

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
    badge: 'Featured'
  },
  {
    id: 'Qwen/Qwen2-7B-Instruct',
    org: 'Qwen',
    builder: 'Alibaba Qwen Team',
    family: 'Qwen2',
    name: 'Qwen2',
    variant: '7B Instruct',
    size: '7B',
    description:
      'Qwen2 has generally surpassed most open-source models and demonstrated competitiveness against proprietary models across a series of benchmarks targeting for language understanding, language generation, multilingual capability, coding, mathematics, reasoning, etc.',
    shortDescription: 'Strong on code, math, reasoning. 7B instruct.',
    image: qwen2Img,
    localCard: qwen2Card,
    tags: ['Code Generation', 'Mathematics', 'Reasoning'],
    useCase: 'Code Generation',
    precision: 'FP16',
    license: 'Apache 2.0',
    compatibility: ['vllm', 'sglang'],
    readiness: 'tech-preview',
    badge: 'Tech Preview'
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
    badge: 'New'
  },
  {
    id: 'google/gemma-3-4b-it',
    org: 'Google',
    builder: 'Google DeepMind',
    family: 'Gemma',
    name: 'Gemma 3',
    variant: '4B IT',
    size: '4B',
    description:
      'Gemma is a family of lightweight, state-of-the-art open models from Google, built from the same research and technology used to create the Gemini models. Gemma 3 models are multimodal, handling text and image input and generating text output, with open weights for both pre-trained variants and instruction-tuned variants.',
    shortDescription: 'Lightweight, multimodal, open weights.',
    image: gemmaImg,
    localCard: gemmaCard,
    tags: ['Multimodal', 'Lightweight', 'Open Weights'],
    useCase: 'Multimodal',
    precision: 'FP16',
    license: 'Apache 2.0',
    compatibility: ['vllm', 'sglang'],
    readiness: 'production-ready',
    badge: 'Featured'
  },
];
