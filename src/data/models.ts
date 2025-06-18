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
    name: 'Llama 3 8B',
    description:
      'The Meta Llama 3.1 collection of multilingual large language models (LLMs) is a collection of pretrained and instruction tuned generative models in 8B, 70B and 405B sizes (text in/text out).',
    image: llamaImg,
    localCard: llama3Card,
  },
  {
    id: 'Qwen/Qwen2-7B-Instruct',
    org: 'Qwen',
    name: 'Qwen2 7B',
    description:
      'Qwen2 has generally surpassed most open-source models and demonstrated competitiveness against proprietary models across a series of benchmarks targeting for language understanding, language generation, multilingual capability, coding, mathematics, reasoning, etc.',
    image: qwen2Img,
    localCard: qwen2Card,
  },
  {
    id: 'deepseek-ai/deepseek-moe-16b-base',
    org: 'DeepSeek',
    name: 'DeepSeek MoE 16B',
    description:
      'Mixture-of-Experts (MoE) language model with 16.4B parameters. It employs an innovative MoE architecture, which involves two principal strategies: fine-grained expert segmentation and shared experts isolation.',
    image: deepseekImg,
    localCard: deepseekCard,
  },
  {
    id: 'google/gemma-3-4b-it',
    org: 'Google',
    name: 'Gemma 3',
    description:
      'Gemma is a family of lightweight, state-of-the-art open models from Google, built from the same research and technology used to create the Gemini models. Gemma 3 models are multimodal, handling text and image input and generating text output, with open weights for both pre-trained variants and instruction-tuned variants.',
    image: gemmaImg,
    localCard: gemmaCard,
  },
];
