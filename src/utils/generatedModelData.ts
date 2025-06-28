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
      "shell": "curl -X POST https://api.inference-hub.com/v1/chat/completions \\\n  -H \"Authorization: Bearer YOUR_API_KEY\" \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\n    \"model\": \"deepseek-ai/DeepSeek-R1-0528\",\n    \"messages\": [{\"role\": \"user\", \"content\": \"Hello\"}],\n    \"stream\": false\n  }'\n",
      "go": "package main\n\nimport (\n    \"bytes\"\n    \"fmt\"\n    \"io/ioutil\"\n    \"net/http\"\n)\n\nfunc main() {\n    jsonStr := []byte(`{\n        \"model\": \"deepseek-ai/DeepSeek-R1-0528\",\n        \"messages\": [{\"role\": \"user\", \"content\": \"Hello\"}],\n        \"stream\": false\n    }`)\n\n    req, _ := http.NewRequest(\"POST\", \"https://api.inference-hub.com/v1/chat/completions\", bytes.NewBuffer(jsonStr))\n    req.Header.Set(\"Authorization\", \"Bearer YOUR_API_KEY\")\n    req.Header.Set(\"Content-Type\", \"application/json\")\n\n    client := &http.Client{}\n    resp, _ := client.Do(req)\n    body, _ := ioutil.ReadAll(resp.Body)\n    fmt.Println(string(body))\n}\n",
      "typescript": "const response = await fetch(\"https://api.inference-hub.com/v1/chat/completions\", {\n  method: \"POST\",\n  headers: {\n    \"Authorization\": \"Bearer YOUR_API_KEY\",\n    \"Content-Type\": \"application/json\"\n  },\n  body: JSON.stringify({\n    model: \"deepseek-ai/DeepSeek-R1-0528\",\n    messages: [{ role: \"user\", content: \"Hello\" }],\n    stream: false\n  })\n});\n\nconst data = await response.json();\nconsole.log(data.choices[0].message.content);\n",
      "rust": "use axum::{\n    extract::Json,\n    http::StatusCode,\n    response::sse::{Event, Sse},\n    routing::post,\n    Router,\n};\nuse serde::{Deserialize, Serialize};\nuse std::convert::Infallible;\nuse tokio_stream::wrappers::ReceiverStream;\n\n#[derive(Deserialize)]\nstruct ChatRequest {\n    model: String,\n    messages: Vec<Message>,\n    temperature: f32,\n    max_tokens: u32,\n    top_p: f32,\n    stream: bool,\n}\n\n#[derive(Serialize, Deserialize)]\nstruct Message {\n    role: String,\n    content: String,\n}\n\nasync fn chat_completion(Json(payload): Json<ChatRequest>) -> Sse<impl Stream<Item = Result<Event, Infallible>>> {\n    let (tx, rx) = tokio::sync::mpsc::channel(100);\n    \n    tokio::spawn(async move {\n        // Simulate streaming response\n        let response = format!(\"Response for model: {}\", payload.model);\n        for chunk in response.chars() {\n            let event = Event::default().data(chunk.to_string());\n            let _ = tx.send(Ok(event)).await;\n            tokio::time::sleep(tokio::time::Duration::from_millis(50)).await;\n        }\n    });\n    \n    Sse::new(ReceiverStream::new(rx))\n}\n\n#[tokio::main]\nasync fn main() {\n    let app = Router::new()\n        .route(\"/chat/completions\", post(chat_completion));\n    \n    axum::Server::bind(&\"0.0.0.0:3000\".parse().unwrap())\n        .serve(app.into_make_service())\n        .await\n        .unwrap();\n}"
    },
    "model_card": {
      "overview": "library_name: transformers",
      "intended_use": [
        "Text-Generation tasks"
      ],
      "limitations": [
        "May generate biased or harmful content",
        "Not suitable for safety-critical applications",
        "Performance may vary across different tasks and domains"
      ],
      "training_data": "Training data information not specified in model card.",
      "evaluation": [
        "Evaluation metrics not specified in model card"
      ],
      "known_issues": [
        "May produce biased content",
        "Limited reasoning capabilities",
        "Performance varies across languages and domains"
      ],
      "references": [
        "https://arxiv.org/abs/2501.12948},",
        "https://huggingface.co/deepseek-ai/DeepSeek-R1-0528"
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
    "description": "AMD's Llama-3.1-405B-Instruct-FP8-KV is a quantized version of Meta's Llama 3.1 405B Instruct model  using AMD's Quark framework. It applies FP8 quantization to weights, activations, and KV cache,  significantly reducing memory usage while maintaining high accuracy. The model uses symmetric per-tensor  quantization for optimal performance on AMD hardware.\n",
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
      "shell": "curl -X POST https://api.inference-hub.com/v1/chat/completions \\\n  -H \"Authorization: Bearer YOUR_API_KEY\" \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\n    \"model\": \"amd/Llama-3.1-405B-Instruct-FP8-KV\",\n    \"messages\": [{\"role\": \"user\", \"content\": \"Hello\"}],\n    \"stream\": false\n  }'\n",
      "go": "package main\n\nimport (\n    \"bytes\"\n    \"fmt\"\n    \"io/ioutil\"\n    \"net/http\"\n)\n\nfunc main() {\n    jsonStr := []byte(`{\n        \"model\": \"amd/Llama-3.1-405B-Instruct-FP8-KV\",\n        \"messages\": [{\"role\": \"user\", \"content\": \"Hello\"}],\n        \"stream\": false\n    }`)\n\n    req, _ := http.NewRequest(\"POST\", \"https://api.inference-hub.com/v1/chat/completions\", bytes.NewBuffer(jsonStr))\n    req.Header.Set(\"Authorization\", \"Bearer YOUR_API_KEY\")\n    req.Header.Set(\"Content-Type\", \"application/json\")\n\n    client := &http.Client{}\n    resp, _ := client.Do(req)\n    body, _ := ioutil.ReadAll(resp.Body)\n    fmt.Println(string(body))\n}\n",
      "typescript": "const response = await fetch(\"https://api.inference-hub.com/v1/chat/completions\", {\n  method: \"POST\",\n  headers: {\n    \"Authorization\": \"Bearer YOUR_API_KEY\",\n    \"Content-Type\": \"application/json\"\n  },\n  body: JSON.stringify({\n    model: \"amd/Llama-3.1-405B-Instruct-FP8-KV\",\n    messages: [{ role: \"user\", content: \"Hello\" }],\n    stream: false\n  })\n});\n\nconst data = await response.json();\nconsole.log(data.choices[0].message.content);\n",
      "rust": "use axum::{\n    extract::Json,\n    http::StatusCode,\n    response::sse::{Event, Sse},\n    routing::post,\n    Router,\n};\nuse serde::{Deserialize, Serialize};\nuse std::convert::Infallible;\nuse tokio_stream::wrappers::ReceiverStream;\n\n#[derive(Deserialize)]\nstruct ChatRequest {\n    model: String,\n    messages: Vec<Message>,\n    temperature: f32,\n    max_tokens: u32,\n    top_p: f32,\n    stream: bool,\n}\n\n#[derive(Serialize, Deserialize)]\nstruct Message {\n    role: String,\n    content: String,\n}\n\nasync fn chat_completion(Json(payload): Json<ChatRequest>) -> Sse<impl Stream<Item = Result<Event, Infallible>>> {\n    let (tx, rx) = tokio::sync::mpsc::channel(100);\n    \n    tokio::spawn(async move {\n        // Simulate streaming response\n        let response = format!(\"Response for model: {}\", payload.model);\n        for chunk in response.chars() {\n            let event = Event::default().data(chunk.to_string());\n            let _ = tx.send(Ok(event)).await;\n            tokio::time::sleep(tokio::time::Duration::from_millis(50)).await;\n        }\n    });\n    \n    Sse::new(ReceiverStream::new(rx))\n}\n\n#[tokio::main]\nasync fn main() {\n    let app = Router::new()\n        .route(\"/chat/completions\", post(chat_completion));\n    \n    axum::Server::bind(&\"0.0.0.0:3000\".parse().unwrap())\n        .serve(app.into_make_service())\n        .await\n        .unwrap();\n}"
    },
    "model_card": {
      "overview": "",
      "intended_use": [],
      "limitations": [],
      "training_data": "",
      "evaluation": [],
      "known_issues": [],
      "references": []
    }
  },
  "meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8": {
    "model_id": "meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8",
    "name": "LLaMA 4 Maverick 17B 128E Instruct FP8",
    "builder": "Meta AI",
    "family": "Llama",
    "size": "17B",
    "huggingface_id": "meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8",
    "description": "LLaMA 4 Maverick is a 17B parameter model with FP8 precision and 128K context length.  It's designed for high-performance inference with reduced memory usage through FP8 quantization  while maintaining excellent instruction-following capabilities and extended context processing.\n",
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
      "shell": "curl -X POST https://api.inference-hub.com/v1/chat/completions \\\n  -H \"Authorization: Bearer YOUR_API_KEY\" \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\n    \"model\": \"meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8\",\n    \"messages\": [{\"role\": \"user\", \"content\": \"Hello\"}],\n    \"stream\": false\n  }'\n",
      "go": "package main\n\nimport (\n    \"bytes\"\n    \"fmt\"\n    \"io/ioutil\"\n    \"net/http\"\n)\n\nfunc main() {\n    jsonStr := []byte(`{\n        \"model\": \"meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8\",\n        \"messages\": [{\"role\": \"user\", \"content\": \"Hello\"}],\n        \"stream\": false\n    }`)\n\n    req, _ := http.NewRequest(\"POST\", \"https://api.inference-hub.com/v1/chat/completions\", bytes.NewBuffer(jsonStr))\n    req.Header.Set(\"Authorization\", \"Bearer YOUR_API_KEY\")\n    req.Header.Set(\"Content-Type\", \"application/json\")\n\n    client := &http.Client{}\n    resp, _ := client.Do(req)\n    body, _ := ioutil.ReadAll(resp.Body)\n    fmt.Println(string(body))\n}\n",
      "typescript": "const response = await fetch(\"https://api.inference-hub.com/v1/chat/completions\", {\n  method: \"POST\",\n  headers: {\n    \"Authorization\": \"Bearer YOUR_API_KEY\",\n    \"Content-Type\": \"application/json\"\n  },\n  body: JSON.stringify({\n    model: \"meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8\",\n    messages: [{ role: \"user\", content: \"Hello\" }],\n    stream: false\n  })\n});\n\nconst data = await response.json();\nconsole.log(data.choices[0].message.content);\n",
      "rust": "use axum::{\n    extract::Json,\n    http::StatusCode,\n    response::sse::{Event, Sse},\n    routing::post,\n    Router,\n};\nuse serde::{Deserialize, Serialize};\nuse std::convert::Infallible;\nuse tokio_stream::wrappers::ReceiverStream;\n\n#[derive(Deserialize)]\nstruct ChatRequest {\n    model: String,\n    messages: Vec<Message>,\n    temperature: f32,\n    max_tokens: u32,\n    top_p: f32,\n    stream: bool,\n}\n\n#[derive(Serialize, Deserialize)]\nstruct Message {\n    role: String,\n    content: String,\n}\n\nasync fn chat_completion(Json(payload): Json<ChatRequest>) -> Sse<impl Stream<Item = Result<Event, Infallible>>> {\n    let (tx, rx) = tokio::sync::mpsc::channel(100);\n    \n    tokio::spawn(async move {\n        // Simulate streaming response\n        let response = format!(\"Response for model: {}\", payload.model);\n        for chunk in response.chars() {\n            let event = Event::default().data(chunk.to_string());\n            let _ = tx.send(Ok(event)).await;\n            tokio::time::sleep(tokio::time::Duration::from_millis(50)).await;\n        }\n    });\n    \n    Sse::new(ReceiverStream::new(rx))\n}\n\n#[tokio::main]\nasync fn main() {\n    let app = Router::new()\n        .route(\"/chat/completions\", post(chat_completion));\n    \n    axum::Server::bind(&\"0.0.0.0:3000\".parse().unwrap())\n        .serve(app.into_make_service())\n        .await\n        .unwrap();\n}"
    },
    "model_card": {
      "overview": "",
      "intended_use": [],
      "limitations": [],
      "training_data": "",
      "evaluation": [],
      "known_issues": [],
      "references": []
    }
  },
  "Qwen/Qwen3-32B": {
    "model_id": "Qwen/Qwen3-32B",
    "name": "Qwen3 32B",
    "builder": "Alibaba Qwen Team",
    "family": "Qwen3",
    "size": "32.8B",
    "huggingface_id": "Qwen/Qwen3-32B",
    "description": "Qwen3-32B is the latest generation of large language models in the Qwen series, offering groundbreaking  advancements in reasoning, instruction-following, agent capabilities, and multilingual support.  It uniquely supports seamless switching between thinking mode (for complex logical reasoning, math, and coding)  and non-thinking mode (for efficient, general-purpose dialogue) within a single model.\n",
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
      "shell": "curl -X POST https://api.inference-hub.com/v1/chat/completions \\\n  -H \"Authorization: Bearer YOUR_API_KEY\" \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\n    \"model\": \"Qwen/Qwen3-32B\",\n    \"messages\": [{\"role\": \"user\", \"content\": \"Hello\"}],\n    \"stream\": false\n  }'\n",
      "go": "package main\n\nimport (\n    \"bytes\"\n    \"fmt\"\n    \"io/ioutil\"\n    \"net/http\"\n)\n\nfunc main() {\n    jsonStr := []byte(`{\n        \"model\": \"Qwen/Qwen3-32B\",\n        \"messages\": [{\"role\": \"user\", \"content\": \"Hello\"}],\n        \"stream\": false\n    }`)\n\n    req, _ := http.NewRequest(\"POST\", \"https://api.inference-hub.com/v1/chat/completions\", bytes.NewBuffer(jsonStr))\n    req.Header.Set(\"Authorization\", \"Bearer YOUR_API_KEY\")\n    req.Header.Set(\"Content-Type\", \"application/json\")\n\n    client := &http.Client{}\n    resp, _ := client.Do(req)\n    body, _ := ioutil.ReadAll(resp.Body)\n    fmt.Println(string(body))\n}\n",
      "typescript": "const response = await fetch(\"https://api.inference-hub.com/v1/chat/completions\", {\n  method: \"POST\",\n  headers: {\n    \"Authorization\": \"Bearer YOUR_API_KEY\",\n    \"Content-Type\": \"application/json\"\n  },\n  body: JSON.stringify({\n    model: \"Qwen/Qwen3-32B\",\n    messages: [{ role: \"user\", content: \"Hello\" }],\n    stream: false\n  })\n});\n\nconst data = await response.json();\nconsole.log(data.choices[0].message.content);\n",
      "rust": "use axum::{\n    extract::Json,\n    http::StatusCode,\n    response::sse::{Event, Sse},\n    routing::post,\n    Router,\n};\nuse serde::{Deserialize, Serialize};\nuse std::convert::Infallible;\nuse tokio_stream::wrappers::ReceiverStream;\n\n#[derive(Deserialize)]\nstruct ChatRequest {\n    model: String,\n    messages: Vec<Message>,\n    temperature: f32,\n    max_tokens: u32,\n    top_p: f32,\n    stream: bool,\n}\n\n#[derive(Serialize, Deserialize)]\nstruct Message {\n    role: String,\n    content: String,\n}\n\nasync fn chat_completion(Json(payload): Json<ChatRequest>) -> Sse<impl Stream<Item = Result<Event, Infallible>>> {\n    let (tx, rx) = tokio::sync::mpsc::channel(100);\n    \n    tokio::spawn(async move {\n        // Simulate streaming response\n        let response = format!(\"Response for model: {}\", payload.model);\n        for chunk in response.chars() {\n            let event = Event::default().data(chunk.to_string());\n            let _ = tx.send(Ok(event)).await;\n            tokio::time::sleep(tokio::time::Duration::from_millis(50)).await;\n        }\n    });\n    \n    Sse::new(ReceiverStream::new(rx))\n}\n\n#[tokio::main]\nasync fn main() {\n    let app = Router::new()\n        .route(\"/chat/completions\", post(chat_completion));\n    \n    axum::Server::bind(&\"0.0.0.0:3000\".parse().unwrap())\n        .serve(app.into_make_service())\n        .await\n        .unwrap();\n}"
    },
    "model_card": {
      "overview": "library_name: transformers license_link: https://huggingface.co/Qwen/Qwen3-32B/blob/main/LICENSE pipeline_tag: text-generation",
      "intended_use": [
        "Text-Generation tasks"
      ],
      "limitations": [
        "May generate biased or harmful content",
        "Not suitable for safety-critical applications",
        "Performance may vary across different tasks and domains"
      ],
      "training_data": "Training data information not specified in model card.",
      "evaluation": [
        "Evaluation metrics not specified in model card"
      ],
      "known_issues": [
        "May produce biased content",
        "Limited reasoning capabilities",
        "Performance varies across languages and domains"
      ],
      "references": [
        "https://arxiv.org/abs/2505.09388},",
        "https://huggingface.co/Qwen/Qwen3-32B"
      ]
    }
  }
} as const;

export type GeneratedModelData = typeof generatedModelData;
