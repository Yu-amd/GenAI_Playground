// This file is auto-generated. Do not edit manually.
// Run 'npm run generate-model-data' to regenerate.

export const generatedModelData = {
  "deepseek-ai/DeepSeek-R1-0528": {
    "model_id": "deepseek-ai/DeepSeek-R1-0528",
    "name": "DeepSeek R1 0528",
    "builder": "DeepSeek AI",
    "family": "DeepSeek R1",
    "size": "685B",
    "huggingface_id": "deepseek-ai/DeepSeek-R1-0528",
    "description": "DeepSeek-R1-0528 is a large language model (LLM) from DeepSeek AI, designed for advanced reasoning, mathematics, programming, and general logic tasks. This version features improved depth of reasoning, reduced hallucination, and enhanced function calling support. It achieves state-of-the-art results on a variety of benchmarks and is available under the MIT license.\n",
    "logo": "model_DeepSeek_MoE_18B.png",
    "readiness_level": "Production-Ready",
    "status_badges": [
      "FP16",
      "FlashAttention",
      "New"
    ],
    "tags": [
      "Reasoning",
      "Mathematics",
      "Programming",
      "vLLM-Compatible",
      "sglang-Compatible",
      "Large Context",
      "Open Weights"
    ],
    "license": "MIT",
    "endpoint": "https://api.inference-hub.com/v1/chat/completions",
    "demo_assets": {
      "notebook": "https://github.com/deepseek-ai/DeepSeek-R1",
      "demo_link": "https://huggingface.co/deepseek-ai/DeepSeek-R1-0528"
    },
    "aim_recipes": [
      {
        "name": "MI300X FP16",
        "hardware": "MI300X",
        "precision": "fp16",
        "recipe_file": "configs/deepseek-r1-0528-mi300x-fp16.yaml"
      },
      {
        "name": "MI250 FP16",
        "hardware": "MI250",
        "precision": "fp16",
        "recipe_file": "configs/deepseek-r1-0528-mi250-fp16.yaml"
      }
    ],
    "api_examples": {
      "python": "import requests\n\nheaders = {\n    \"Authorization\": \"Bearer YOUR_API_KEY\",\n    \"Content-Type\": \"application/json\"\n}\n\npayload = {\n    \"model\": \"deepseek-ai/DeepSeek-R1-0528\",\n    \"messages\": [{\"role\": \"user\", \"content\": \"Hello\"}],\n    \"stream\": False\n}\n\nresponse = requests.post(\"https://api.inference-hub.com/v1/chat/completions\", headers=headers, json=payload)\nprint(response.json())\n",
      "javascript": "const response = await fetch(\"https://api.inference-hub.com/v1/chat/completions\", {\n  method: \"POST\",\n  headers: {\n    \"Authorization\": \"Bearer YOUR_API_KEY\",\n    \"Content-Type\": \"application/json\"\n  },\n  body: JSON.stringify({\n    model: \"deepseek-ai/DeepSeek-R1-0528\",\n    messages: [{ role: \"user\", content: \"Hello\" }],\n    stream: false\n  })\n});\n\nconst data = await response.json();\nconsole.log(data.choices[0].message.content);\n",
      "shell": "curl -X POST https://api.inference-hub.com/v1/chat/completions \\\n  -H \"Authorization: Bearer YOUR_API_KEY\" \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\n    \"model\": \"deepseek-ai/DeepSeek-R1-0528\",\n    \"messages\": [{\"role\": \"user\", \"content\": \"Hello\"}],\n    \"stream\": false\n  }'\n",
      "java": "HttpClient client = HttpClient.newHttpClient();\nHttpRequest request = HttpRequest.newBuilder()\n    .uri(URI.create(\"https://api.inference-hub.com/v1/chat/completions\"))\n    .header(\"Authorization\", \"Bearer YOUR_API_KEY\")\n    .header(\"Content-Type\", \"application/json\")\n    .POST(HttpRequest.BodyPublishers.ofString(\"\"\"\n      {\n        \"model\": \"deepseek-ai/DeepSeek-R1-0528\",\n        \"messages\": [{\"role\": \"user\", \"content\": \"Hello\"}],\n        \"stream\": false\n      }\n    \"\"\"))\n    .build();\n\nHttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());\nSystem.out.println(response.body());\n",
      "go": "package main\n\nimport (\n    \"bytes\"\n    \"fmt\"\n    \"io/ioutil\"\n    \"net/http\"\n)\n\nfunc main() {\n    jsonStr := []byte(`{\n        \"model\": \"deepseek-ai/DeepSeek-R1-0528\",\n        \"messages\": [{\"role\": \"user\", \"content\": \"Hello\"}],\n        \"stream\": false\n    }`)\n\n    req, _ := http.NewRequest(\"POST\", \"https://api.inference-hub.com/v1/chat/completions\", bytes.NewBuffer(jsonStr))\n    req.Header.Set(\"Authorization\", \"Bearer YOUR_API_KEY\")\n    req.Header.Set(\"Content-Type\", \"application/json\")\n\n    client := &http.Client{}\n    resp, _ := client.Do(req)\n    body, _ := ioutil.ReadAll(resp.Body)\n    fmt.Println(string(body))\n}\n",
      "csharp": "using System.Net.Http;\nusing System.Text;\nusing System.Threading.Tasks;\n\nvar client = new HttpClient();\nvar request = new HttpRequestMessage(HttpMethod.Post, \"https://api.inference-hub.com/v1/chat/completions\");\nrequest.Headers.Add(\"Authorization\", \"Bearer YOUR_API_KEY\");\n\nvar json = \"\"\"\n{\n    \"model\": \"deepseek-ai/DeepSeek-R1-0528\",\n    \"messages\": [{\"role\": \"user\", \"content\": \"Hello\"}],\n    \"stream\": false\n}\n\"\"\";\n\nrequest.Content = new StringContent(json, Encoding.UTF8, \"application/json\");\n\nvar response = await client.SendAsync(request);\nvar responseBody = await response.Content.ReadAsStringAsync();\nConsole.WriteLine(responseBody);\n"
    },
    "model_card": {
      "overview": "DeepSeek-R1-0528 is a state-of-the-art LLM optimized for deep reasoning, mathematics, programming, and general logic. It features improved depth of reasoning, reduced hallucination, and enhanced function calling support. The model achieves top-tier results on a variety of benchmarks and is suitable for both research and production use.\n",
      "intended_use": [
        "Advanced reasoning tasks",
        "Mathematics and logic",
        "Programming/code generation",
        "General language understanding",
        "Research and experimentation"
      ],
      "limitations": [
        "May hallucinate facts",
        "Not suitable for safety-critical use",
        "Large model size (685B parameters)",
        "Requires significant computational resources"
      ],
      "training_data": "Diverse web corpus, code, mathematics datasets, and other publicly available data. Training data cutoff: May 2024.\n",
      "evaluation": [
        "MMLU-Redux (EM): 93.4",
        "MMLU-Pro (EM): 85.0",
        "GPQA-Diamond (Pass@1): 81.0",
        "LiveCodeBench (Pass@1): 73.3",
        "AIME 2024 (Pass@1): 91.4",
        "AIME 2025 (Pass@1): 87.5",
        "HMMT 2025 (Pass@1): 79.4",
        "CNMO 2024 (Pass@1): 86.9",
        "SWE Verified (Resolved): 57.6",
        "Aider-Polyglot (Acc.): 71.6",
        "FRAMES (Acc.): 83.0",
        "Humanity's Last Exam (Pass@1): 17.7",
        "Tau-Bench (Pass@1): 53.5(Airline)/63.9(Retail)"
      ],
      "known_issues": [
        "May produce biased or harmful content",
        "Performance varies across domains and languages",
        "Requires careful prompting for best results"
      ],
      "references": [
        "https://huggingface.co/deepseek-ai/DeepSeek-R1-0528",
        "https://github.com/deepseek-ai/DeepSeek-R1",
        "https://arxiv.org/abs/2501.12948"
      ]
    }
  },
  "meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8": {
    "model_id": "meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8",
    "name": "LLaMA 4 Maverick 17B 128E Instruct FP8",
    "builder": "Meta AI",
    "family": "Llama",
    "size": "17B",
    "huggingface_id": "meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8",
    "description": "LLaMA 4 Maverick is a 17B parameter model with FP8 precision and 128K context length. It's designed for high-performance inference with reduced memory usage through FP8 quantization while maintaining excellent instruction-following capabilities and extended context processing.\n",
    "logo": "model_llama4_maverick.png",
    "readiness_level": "Production-Ready",
    "status_badges": [
      "FP8",
      "FlashAttention",
      "Featured"
    ],
    "tags": [
      "Text Generation",
      "Multilingual",
      "Instruction-Tuned",
      "vLLM-Compatible",
      "sglang-Compatible"
    ],
    "license": "Meta RAIL",
    "endpoint": "https://api.inference-hub.com/v1/chat/completions",
    "demo_assets": {
      "notebook": "https://github.com/inference-hub/notebooks/llama-4-maverick-17b-demo.ipynb",
      "demo_link": "https://playground.inference-hub.com/models/meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8"
    },
    "aim_recipes": [
      {
        "name": "MI300X FP8",
        "hardware": "MI300X",
        "precision": "fp8",
        "recipe_file": "configs/llama-4-maverick-17b-mi300x-fp8.yaml"
      },
      {
        "name": "MI250 FP8",
        "hardware": "MI250",
        "precision": "fp8",
        "recipe_file": "configs/llama-4-maverick-17b-mi250-fp8.yaml"
      }
    ],
    "api_examples": {
      "python": "import requests\n\nheaders = {\n    \"Authorization\": \"Bearer YOUR_API_KEY\",\n    \"Content-Type\": \"application/json\"\n}\n\npayload = {\n    \"model\": \"meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8\",\n    \"messages\": [{\"role\": \"user\", \"content\": \"Hello\"}],\n    \"stream\": False\n}\n\nresponse = requests.post(\"https://api.inference-hub.com/v1/chat/completions\", headers=headers, json=payload)\nprint(response.json())\n",
      "javascript": "const response = await fetch(\"https://api.inference-hub.com/v1/chat/completions\", {\n  method: \"POST\",\n  headers: {\n    \"Authorization\": \"Bearer YOUR_API_KEY\",\n    \"Content-Type\": \"application/json\"\n  },\n  body: JSON.stringify({\n    model: \"meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8\",\n    messages: [{ role: \"user\", content: \"Hello\" }],\n    stream: false\n  })\n});\n\nconst data = await response.json();\nconsole.log(data.choices[0].message.content);\n",
      "shell": "curl -X POST https://api.inference-hub.com/v1/chat/completions \\\n  -H \"Authorization: Bearer YOUR_API_KEY\" \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\n    \"model\": \"meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8\",\n    \"messages\": [{\"role\": \"user\", \"content\": \"Hello\"}],\n    \"stream\": false\n  }'\n",
      "java": "HttpClient client = HttpClient.newHttpClient();\nHttpRequest request = HttpRequest.newBuilder()\n    .uri(URI.create(\"https://api.inference-hub.com/v1/chat/completions\"))\n    .header(\"Authorization\", \"Bearer YOUR_API_KEY\")\n    .header(\"Content-Type\", \"application/json\")\n    .POST(HttpRequest.BodyPublishers.ofString(\"\"\"\n      {\n        \"model\": \"meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8\",\n        \"messages\": [{\"role\": \"user\", \"content\": \"Hello\"}],\n        \"stream\": false\n      }\n    \"\"\"))\n    .build();\n\nHttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());\nSystem.out.println(response.body());\n",
      "go": "package main\n\nimport (\n    \"bytes\"\n    \"fmt\"\n    \"io/ioutil\"\n    \"net/http\"\n)\n\nfunc main() {\n    jsonStr := []byte(`{\n        \"model\": \"meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8\",\n        \"messages\": [{\"role\": \"user\", \"content\": \"Hello\"}],\n        \"stream\": false\n    }`)\n\n    req, _ := http.NewRequest(\"POST\", \"https://api.inference-hub.com/v1/chat/completions\", bytes.NewBuffer(jsonStr))\n    req.Header.Set(\"Authorization\", \"Bearer YOUR_API_KEY\")\n    req.Header.Set(\"Content-Type\", \"application/json\")\n\n    client := &http.Client{}\n    resp, _ := client.Do(req)\n    body, _ := ioutil.ReadAll(resp.Body)\n    fmt.Println(string(body))\n}\n",
      "csharp": "using System.Net.Http;\nusing System.Text;\nusing System.Threading.Tasks;\n\nvar client = new HttpClient();\nvar request = new HttpRequestMessage(HttpMethod.Post, \"https://api.inference-hub.com/v1/chat/completions\");\nrequest.Headers.Add(\"Authorization\", \"Bearer YOUR_API_KEY\");\n\nvar json = \"\"\"\n{\n    \"model\": \"meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8\",\n    \"messages\": [{\"role\": \"user\", \"content\": \"Hello\"}],\n    \"stream\": false\n}\n\"\"\";\n\nrequest.Content = new StringContent(json, Encoding.UTF8, \"application/json\");\n\nvar response = await client.SendAsync(request);\nvar responseBody = await response.Content.ReadAsStringAsync();\nConsole.WriteLine(responseBody);\n"
    },
    "model_card": {
      "overview": "LLaMA 4 Maverick is a 17B parameter model with FP8 precision and 128K context length from Meta AI. It's designed for high-performance inference with reduced memory usage through FP8 quantization while maintaining excellent instruction-following capabilities and extended context processing.\n",
      "intended_use": [
        "Long-context document processing",
        "Conversational agents with extended memory",
        "Document summarization and analysis",
        "Retrieval-augmented generation (RAG)",
        "Multilingual text generation",
        "Code generation and analysis"
      ],
      "limitations": [
        "May hallucinate facts",
        "Not suitable for safety-critical use",
        "FP8 precision may affect numerical accuracy",
        "Performance may vary with very long sequences"
      ],
      "training_data": "Public web corpus, GitHub, Wikipedia, filtered Common Crawl, and other publicly available datasets. Training data cutoff: October 2023.\n",
      "evaluation": [
        "MMLU: 72.1",
        "HumanEval (code): 48.3%",
        "MT-Bench: 8.7",
        "GSM8K: 82.1%"
      ],
      "known_issues": [
        "May produce biased or harmful content",
        "FP8 quantization may affect certain numerical tasks",
        "Performance varies across languages",
        "Memory usage scales with context length"
      ],
      "references": [
        "https://huggingface.co/meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8",
        "https://github.com/facebookresearch/llama",
        "https://ai.meta.com/llama/"
      ]
    }
  },
  "Qwen/Qwen3-32B": {
    "model_id": "Qwen/Qwen3-32B",
    "name": "Qwen3 32B",
    "builder": "Alibaba Qwen Team",
    "family": "Qwen3",
    "size": "32.8B",
    "huggingface_id": "Qwen/Qwen3-32B",
    "description": "Qwen3-32B is the latest generation of large language models in the Qwen series, offering groundbreaking advancements in reasoning, instruction-following, agent capabilities, and multilingual support. It uniquely supports seamless switching between thinking mode (for complex logical reasoning, math, and coding) and non-thinking mode (for efficient, general-purpose dialogue) within a single model.\n",
    "logo": "model_qwen3_32b.png",
    "readiness_level": "Production-Ready",
    "status_badges": [
      "BF16",
      "FlashAttention",
      "Featured"
    ],
    "tags": [
      "Text Generation",
      "Reasoning",
      "Code Generation",
      "Multilingual",
      "Instruction-Tuned",
      "vLLM-Compatible",
      "sglang-Compatible"
    ],
    "license": "Apache 2.0",
    "endpoint": "https://api.inference-hub.com/v1/chat/completions",
    "demo_assets": {
      "notebook": "https://github.com/inference-hub/notebooks/qwen3-32b-demo.ipynb",
      "demo_link": "https://playground.inference-hub.com/models/Qwen/Qwen3-32B"
    },
    "aim_recipes": [
      {
        "name": "MI300X BF16",
        "hardware": "MI300X",
        "precision": "bf16",
        "recipe_file": "configs/qwen3-32b-mi300x-bf16.yaml"
      },
      {
        "name": "MI250 BF16",
        "hardware": "MI250",
        "precision": "bf16",
        "recipe_file": "configs/qwen3-32b-mi250-bf16.yaml"
      }
    ],
    "api_examples": {
      "python": "import requests\n\nheaders = {\n    \"Authorization\": \"Bearer YOUR_API_KEY\",\n    \"Content-Type\": \"application/json\"\n}\n\npayload = {\n    \"model\": \"Qwen/Qwen3-32B\",\n    \"messages\": [{\"role\": \"user\", \"content\": \"Hello\"}],\n    \"stream\": False\n}\n\nresponse = requests.post(\"https://api.inference-hub.com/v1/chat/completions\", headers=headers, json=payload)\nprint(response.json())\n",
      "javascript": "const response = await fetch(\"https://api.inference-hub.com/v1/chat/completions\", {\n  method: \"POST\",\n  headers: {\n    \"Authorization\": \"Bearer YOUR_API_KEY\",\n    \"Content-Type\": \"application/json\"\n  },\n  body: JSON.stringify({\n    model: \"Qwen/Qwen3-32B\",\n    messages: [{ role: \"user\", content: \"Hello\" }],\n    stream: false\n  })\n});\n\nconst data = await response.json();\nconsole.log(data.choices[0].message.content);\n",
      "shell": "curl -X POST https://api.inference-hub.com/v1/chat/completions \\\n  -H \"Authorization: Bearer YOUR_API_KEY\" \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\n    \"model\": \"Qwen/Qwen3-32B\",\n    \"messages\": [{\"role\": \"user\", \"content\": \"Hello\"}],\n    \"stream\": false\n  }'\n",
      "java": "HttpClient client = HttpClient.newHttpClient();\nHttpRequest request = HttpRequest.newBuilder()\n    .uri(URI.create(\"https://api.inference-hub.com/v1/chat/completions\"))\n    .header(\"Authorization\", \"Bearer YOUR_API_KEY\")\n    .header(\"Content-Type\", \"application/json\")\n    .POST(HttpRequest.BodyPublishers.ofString(\"\"\"\n      {\n        \"model\": \"Qwen/Qwen3-32B\",\n        \"messages\": [{\"role\": \"user\", \"content\": \"Hello\"}],\n        \"stream\": false\n      }\n    \"\"\"))\n    .build();\n\nHttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());\nSystem.out.println(response.body());\n",
      "go": "package main\n\nimport (\n    \"bytes\"\n    \"fmt\"\n    \"io/ioutil\"\n    \"net/http\"\n)\n\nfunc main() {\n    jsonStr := []byte(`{\n        \"model\": \"Qwen/Qwen3-32B\",\n        \"messages\": [{\"role\": \"user\", \"content\": \"Hello\"}],\n        \"stream\": false\n    }`)\n\n    req, _ := http.NewRequest(\"POST\", \"https://api.inference-hub.com/v1/chat/completions\", bytes.NewBuffer(jsonStr))\n    req.Header.Set(\"Authorization\", \"Bearer YOUR_API_KEY\")\n    req.Header.Set(\"Content-Type\", \"application/json\")\n\n    client := &http.Client{}\n    resp, _ := client.Do(req)\n    body, _ := ioutil.ReadAll(resp.Body)\n    fmt.Println(string(body))\n}\n",
      "csharp": "using System.Net.Http;\nusing System.Text;\nusing System.Threading.Tasks;\n\nvar client = new HttpClient();\nvar request = new HttpRequestMessage(HttpMethod.Post, \"https://api.inference-hub.com/v1/chat/completions\");\nrequest.Headers.Add(\"Authorization\", \"Bearer YOUR_API_KEY\");\n\nvar json = \"\"\"\n{\n    \"model\": \"Qwen/Qwen3-32B\",\n    \"messages\": [{\"role\": \"user\", \"content\": \"Hello\"}],\n    \"stream\": false\n}\n\"\"\";\n\nrequest.Content = new StringContent(json, Encoding.UTF8, \"application/json\");\n\nvar response = await client.SendAsync(request);\nvar responseBody = await response.Content.ReadAsStringAsync();\nConsole.WriteLine(responseBody);\n"
    },
    "model_card": {
      "overview": "Qwen3-32B is the latest generation of large language models in the Qwen series, offering groundbreaking advancements in reasoning, instruction-following, agent capabilities, and multilingual support. It uniquely supports seamless switching between thinking mode (for complex logical reasoning, math, and coding) and non-thinking mode (for efficient, general-purpose dialogue) within a single model.\n",
      "intended_use": [
        "Complex reasoning and problem solving",
        "Code generation and analysis",
        "Mathematical computations",
        "Multilingual text generation",
        "Agent-based tasks and tool integration",
        "Creative writing and role-playing",
        "Multi-turn conversations"
      ],
      "limitations": [
        "May hallucinate facts",
        "Not suitable for safety-critical use",
        "Large model size requires significant computational resources",
        "Performance may vary depending on thinking mode settings"
      ],
      "training_data": "Diverse web corpus, code repositories, mathematical datasets, and multilingual content. Training data cutoff: 2024.\n",
      "evaluation": [
        "MMLU: 78.2",
        "HumanEval (code): 65.8%",
        "GSM8K: 89.3%",
        "MATH: 52.1%",
        "MT-Bench: 9.1"
      ],
      "known_issues": [
        "May produce biased content",
        "Thinking mode requires careful parameter tuning",
        "Performance varies across different languages and domains",
        "Requires adequate output length for complex problems"
      ],
      "references": [
        "https://huggingface.co/Qwen/Qwen3-32B",
        "https://github.com/QwenLM/Qwen3",
        "https://arxiv.org/abs/2505.09388"
      ]
    }
  },
  "amd/Llama-3_1-405B-Instruct-FP8-KV": {
    "model_id": "amd/Llama-3_1-405B-Instruct-FP8-KV",
    "name": "Llama 3.1 405B Instruct FP8 KV",
    "builder": "AMD",
    "family": "Llama",
    "size": "405B",
    "huggingface_id": "amd/Llama-3_1-405B-Instruct-FP8-KV",
    "description": "AMD's Llama-3.1-405B-Instruct-FP8-KV is a quantized version of Meta's Llama 3.1 405B Instruct model using AMD's Quark framework. It applies FP8 quantization to weights, activations, and KV cache, significantly reducing memory usage while maintaining high accuracy. The model uses symmetric per-tensor quantization for optimal performance on AMD hardware.\n",
    "logo": "model_llama3_1_405b_fp8.png",
    "readiness_level": "Production-Ready",
    "status_badges": [
      "FP8",
      "FlashAttention",
      "Featured"
    ],
    "tags": [
      "Text Generation",
      "Multilingual",
      "Instruction-Tuned",
      "vLLM-Compatible",
      "Efficient"
    ],
    "license": "Meta RAIL",
    "endpoint": "https://api.inference-hub.com/v1/chat/completions",
    "demo_assets": {
      "notebook": "https://github.com/inference-hub/notebooks/llama-3-1-405b-fp8-kv-demo.ipynb",
      "demo_link": "https://playground.inference-hub.com/models/amd/Llama-3.1-405B-Instruct-FP8-KV"
    },
    "aim_recipes": [
      {
        "name": "MI300X FP8",
        "hardware": "MI300X",
        "precision": "fp8",
        "recipe_file": "configs/llama-3-1-405b-fp8-kv-mi300x-fp8.yaml"
      },
      {
        "name": "MI250 FP8",
        "hardware": "MI250",
        "precision": "fp8",
        "recipe_file": "configs/llama-3-1-405b-fp8-kv-mi250-fp8.yaml"
      }
    ],
    "api_examples": {
      "python": "import requests\n\nheaders = {\n    \"Authorization\": \"Bearer YOUR_API_KEY\",\n    \"Content-Type\": \"application/json\"\n}\n\npayload = {\n    \"model\": \"amd/Llama-3.1-405B-Instruct-FP8-KV\",\n    \"messages\": [{\"role\": \"user\", \"content\": \"Hello\"}],\n    \"stream\": False\n}\n\nresponse = requests.post(\"https://api.inference-hub.com/v1/chat/completions\", headers=headers, json=payload)\nprint(response.json())\n",
      "javascript": "const response = await fetch(\"https://api.inference-hub.com/v1/chat/completions\", {\n  method: \"POST\",\n  headers: {\n    \"Authorization\": \"Bearer YOUR_API_KEY\",\n    \"Content-Type\": \"application/json\"\n  },\n  body: JSON.stringify({\n    model: \"amd/Llama-3.1-405B-Instruct-FP8-KV\",\n    messages: [{ role: \"user\", content: \"Hello\" }],\n    stream: false\n  })\n});\n\nconst data = await response.json();\nconsole.log(data.choices[0].message.content);\n",
      "shell": "curl -X POST https://api.inference-hub.com/v1/chat/completions \\\n  -H \"Authorization: Bearer YOUR_API_KEY\" \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\n    \"model\": \"amd/Llama-3.1-405B-Instruct-FP8-KV\",\n    \"messages\": [{\"role\": \"user\", \"content\": \"Hello\"}],\n    \"stream\": false\n  }'\n",
      "java": "HttpClient client = HttpClient.newHttpClient();\nHttpRequest request = HttpRequest.newBuilder()\n    .uri(URI.create(\"https://api.inference-hub.com/v1/chat/completions\"))\n    .header(\"Authorization\", \"Bearer YOUR_API_KEY\")\n    .header(\"Content-Type\", \"application/json\")\n    .POST(HttpRequest.BodyPublishers.ofString(\"\"\"\n      {\n        \"model\": \"amd/Llama-3.1-405B-Instruct-FP8-KV\",\n        \"messages\": [{\"role\": \"user\", \"content\": \"Hello\"}],\n        \"stream\": false\n      }\n    \"\"\"))\n    .build();\n\nHttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());\nSystem.out.println(response.body());\n",
      "go": "package main\n\nimport (\n    \"bytes\"\n    \"fmt\"\n    \"io/ioutil\"\n    \"net/http\"\n)\n\nfunc main() {\n    jsonStr := []byte(`{\n        \"model\": \"amd/Llama-3.1-405B-Instruct-FP8-KV\",\n        \"messages\": [{\"role\": \"user\", \"content\": \"Hello\"}],\n        \"stream\": false\n    }`)\n\n    req, _ := http.NewRequest(\"POST\", \"https://api.inference-hub.com/v1/chat/completions\", bytes.NewBuffer(jsonStr))\n    req.Header.Set(\"Authorization\", \"Bearer YOUR_API_KEY\")\n    req.Header.Set(\"Content-Type\", \"application/json\")\n\n    client := &http.Client{}\n    resp, _ := client.Do(req)\n    body, _ := ioutil.ReadAll(resp.Body)\n    fmt.Println(string(body))\n}\n",
      "csharp": "using System.Net.Http;\nusing System.Text;\nusing System.Threading.Tasks;\n\nvar client = new HttpClient();\nvar request = new HttpRequestMessage(HttpMethod.Post, \"https://api.inference-hub.com/v1/chat/completions\");\nrequest.Headers.Add(\"Authorization\", \"Bearer YOUR_API_KEY\");\n\nvar json = \"\"\"\n{\n    \"model\": \"amd/Llama-3.1-405B-Instruct-FP8-KV\",\n    \"messages\": [{\"role\": \"user\", \"content\": \"Hello\"}],\n    \"stream\": false\n}\n\"\"\";\n\nrequest.Content = new StringContent(json, Encoding.UTF8, \"application/json\");\n\nvar response = await client.SendAsync(request);\nvar responseBody = await response.Content.ReadAsStringAsync();\nConsole.WriteLine(responseBody);\n"
    },
    "model_card": {
      "overview": "AMD's Llama-3.1-405B-Instruct-FP8-KV is a quantized version of Meta's Llama 3.1 405B Instruct model using AMD's Quark framework. It applies FP8 quantization to weights, activations, and KV cache, significantly reducing memory usage while maintaining high accuracy. The model uses symmetric per-tensor quantization for optimal performance on AMD hardware.\n",
      "intended_use": [
        "High-performance text generation",
        "Complex reasoning tasks",
        "Large-scale language understanding",
        "Research and development",
        "Enterprise applications requiring efficiency"
      ],
      "limitations": [
        "May hallucinate facts",
        "Not suitable for safety-critical use",
        "Requires significant computational resources",
        "FP8 quantization may affect certain numerical tasks"
      ],
      "training_data": "Based on Meta's Llama 3.1 405B Instruct model training data. Quantization applied using Pile dataset calibration samples.\n",
      "evaluation": [
        "Perplexity-wikitext2: 1.8951",
        "Original PPL: 1.8561",
        "Quantization loss: 2.1%"
      ],
      "known_issues": [
        "May produce biased content",
        "FP8 quantization may affect certain numerical tasks",
        "Performance varies across different domains",
        "Requires AMD hardware for optimal performance"
      ],
      "references": [
        "https://huggingface.co/amd/Llama-3.1-405B-Instruct-FP8-KV",
        "https://github.com/AMD/Quark",
        "https://huggingface.co/meta-llama/Meta-Llama-3.1-405B-Instruct"
      ]
    }
  }
} as const;

export type GeneratedModelData = typeof generatedModelData;
