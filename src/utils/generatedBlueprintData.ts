// This file is auto-generated. Do not edit manually.
// Run 'npm run generate-blueprint-data' to regenerate.

export const generatedBlueprintData = {
  "chatqna": {
    "blueprint_id": "chatqna",
    "name": "ChatQnA",
    "category": "Conversational AI",
    "complexity": "Intermediate",
    "description": "Chatbot application based on Retrieval Augmented Generation architecture.",
    "shortDescription": "RAG-based chatbot for knowledge base interactions with advanced retrieval capabilities.",
    "logo": "bp_chatqna.png",
    "readiness_level": "Production-Ready",
    "status_badges": [
      "Featured",
      "Production-Ready",
      "RAG"
    ],
    "tags": [
      "RAG",
      "Chatbot",
      "Knowledge Base",
      "Vector Search",
      "Document Processing"
    ],
    "status": "Production Ready",
    "endpoint": "https://api.inference-hub.com/v1/blueprints/chatqna",
    "demo_assets": {
      "notebook": "https://github.com/inference-hub/blueprints/chatqna-demo.ipynb",
      "demo_link": "https://playground.inference-hub.com/blueprints/chatqna"
    },
    "api_examples": {
      "python": "import requests\n\nheaders = {\n    \"Authorization\": \"Bearer YOUR_API_KEY\",\n    \"Content-Type\": \"application/json\"\n}\n\npayload = {\n    \"model\": \"chatqna\",\n    \"messages\": [{\"role\": \"user\", \"content\": \"Hello\"}],\n    \"stream\": False\n}\n\nresponse = requests.post(\"https://api.inference-hub.com/v1/chat/completions\", headers=headers, json=payload)\nprint(response.json())\n",
      "typescript": "const response = await fetch(\"https://api.inference-hub.com/v1/chat/completions\", {\n  method: \"POST\",\n  headers: {\n    \"Authorization\": \"Bearer YOUR_API_KEY\",\n    \"Content-Type\": \"application/json\"\n  },\n  body: JSON.stringify({\n    model: \"chatqna\",\n    messages: [{ role: \"user\", content: \"Hello\" }],\n    stream: false\n  })\n});\n\nconst data = await response.json();\nconsole.log(data.choices[0].message.content);\n",
      "shell": "curl -X POST https://api.inference-hub.com/v1/chat/completions \\\n  -H \"Authorization: Bearer YOUR_API_KEY\" \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\n    \"model\": \"chatqna\",\n    \"messages\": [{\"role\": \"user\", \"content\": \"Hello\"}],\n    \"stream\": false\n  }'\n",
      "rust": "use reqwest;\nuse serde_json::{json, Value};\n\n#[tokio::main]\nasync fn main() -> Result<(), Box<dyn std::error::Error>> {\n    let client = reqwest::Client::new();\n    let response = client.post(\"https://api.inference-hub.com/v1/chat/completions\")\n        .header(\"Authorization\", \"Bearer YOUR_API_KEY\")\n        .header(\"Content-Type\", \"application/json\")\n        .json(&json!({\n            \"model\": \"chatqna\",\n            \"messages\": [{\"role\": \"user\", \"content\": \"Hello\"}],\n            \"stream\": false\n        }))\n        .send()\n        .await?;\n    \n    let data: Value = response.json().await?;\n    println!(\"{:?}\", data);\n    Ok(())\n}\n",
      "go": "package main\n\nimport (\n    \"bytes\"\n    \"fmt\"\n    \"io/ioutil\"\n    \"net/http\"\n)\n\nfunc main() {\n    jsonStr := []byte(`{\n        \"model\": \"chatqna\",\n        \"messages\": [{\"role\": \"user\", \"content\": \"Hello\"}],\n        \"stream\": false\n    }`)\n\n    req, _ := http.NewRequest(\"POST\", \"https://api.inference-hub.com/v1/chat/completions\", bytes.NewBuffer(jsonStr))\n    req.Header.Set(\"Authorization\", \"Bearer YOUR_API_KEY\")\n    req.Header.Set(\"Content-Type\", \"application/json\")\n\n    client := &http.Client{}\n    resp, _ := client.Do(req)\n    body, _ := ioutil.ReadAll(resp.Body)\n    fmt.Println(string(body))\n}\n"
    },
    "aim_recipes": [
      {
        "name": "MI300X FP16",
        "hardware": "MI300X",
        "precision": "fp16",
        "recipe_file": "configs/chatqna-mi300x-fp16.yaml"
      },
      {
        "name": "MI250 FP16",
        "hardware": "MI250",
        "precision": "fp16",
        "recipe_file": "configs/chatqna-mi250-fp16.yaml"
      }
    ],
    "blueprint_card": {
      "overview": "ChatQnA is a Retrieval Augmented Generation (RAG) based chatbot that combines large language models with external knowledge bases to provide accurate, context-aware responses.",
      "intended_use": [
        "Customer support chatbots",
        "Knowledge base querying",
        "Document-based Q&A systems",
        "Technical support automation"
      ],
      "limitations": [
        "Requires well-structured knowledge base",
        "Response quality depends on retrieval accuracy",
        "May not handle complex multi-step reasoning",
        "Limited to information in the knowledge base"
      ],
      "architecture": "RAG pipeline with vector database, embedding model, and LLM for generation",
      "evaluation": [
        "Response accuracy: 92%",
        "Retrieval precision: 89%",
        "User satisfaction: 4.2/5",
        "Response time: <2 seconds"
      ],
      "known_issues": [
        "Occasional hallucination when knowledge base is incomplete",
        "Performance degradation with very large knowledge bases",
        "Limited context window for complex queries"
      ],
      "references": [
        "https://arxiv.org/abs/2005.11401",
        "https://github.com/inference-hub/blueprints/chatqna"
      ]
    },
    "microservices": {
      "models": [
        {
          "name": "Qwen3 32B",
          "logo": "/src/assets/models/model_Qwen2-7B.png",
          "tags": [
            "Text Generation",
            "RAG",
            "Inference",
            "Reasoning",
            "Code Generation",
            "Multilingual"
          ]
        }
      ],
      "functional": [
        {
          "name": "Retriever",
          "description": "Vector-based document retrieval service",
          "tags": [
            "RAG",
            "Vector Search",
            "Document Processing"
          ]
        },
        {
          "name": "Reranking",
          "description": "Re-ranks retrieved documents for better relevance",
          "tags": [
            "RAG",
            "Document Ranking",
            "Relevance"
          ]
        }
      ]
    }
  }
} as const;

export type GeneratedBlueprintData = typeof generatedBlueprintData;
