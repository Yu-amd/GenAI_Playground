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
      "Knowledge Base"
    ],
    "status": "Production Ready",
    "endpoint": "https://api.inference-hub.com/v1/blueprints/chatqna",
    "demo_assets": {
      "notebook": "https://github.com/inference-hub/blueprints/chatqna-demo.ipynb",
      "demo_link": "https://playground.inference-hub.com/blueprints/chatqna"
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
    "api_examples": {
      "python": "import requests\n\nheaders = {\n    \"Authorization\": \"Bearer YOUR_API_KEY\",\n    \"Content-Type\": \"application/json\"\n}\n\npayload = {\n    \"blueprint\": \"chatqna\",\n    \"query\": \"What is the OPEA Framework?\",\n    \"knowledge_base\": \"opea_docs\",\n    \"stream\": False\n}\n\nresponse = requests.post(\"https://api.inference-hub.com/v1/blueprints/chatqna\", headers=headers, json=payload)\nprint(response.json())\n",
      "shell": "curl -X POST https://api.inference-hub.com/v1/blueprints/chatqna \\\n  -H \"Authorization: Bearer YOUR_API_KEY\" \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\n    \"blueprint\": \"chatqna\",\n    \"query\": \"What is the OPEA Framework?\",\n    \"knowledge_base\": \"opea_docs\",\n    \"stream\": false\n  }'\n",
      "go": "package main\n\nimport (\n    \"bytes\"\n    \"fmt\"\n    \"io/ioutil\"\n    \"net/http\"\n)\n\nfunc main() {\n    jsonStr := []byte(`{\n        \"blueprint\": \"chatqna\",\n        \"query\": \"What is the OPEA Framework?\",\n        \"knowledge_base\": \"opea_docs\",\n        \"stream\": false\n    }`)\n\n    req, _ := http.NewRequest(\"POST\", \"https://api.inference-hub.com/v1/blueprints/chatqna\", bytes.NewBuffer(jsonStr))\n    req.Header.Set(\"Authorization\", \"Bearer YOUR_API_KEY\")\n    req.Header.Set(\"Content-Type\", \"application/json\")\n\n    client := &http.Client{}\n    resp, _ := client.Do(req)\n    body, _ := ioutil.ReadAll(resp.Body)\n    fmt.Println(string(body))\n}\n",
      "typescript": "const response = await fetch(\"https://api.inference-hub.com/v1/blueprints/chatqna\", {\n  method: \"POST\",\n  headers: {\n    \"Authorization\": \"Bearer YOUR_API_KEY\",\n    \"Content-Type\": \"application/json\"\n  },\n  body: JSON.stringify({\n    blueprint: \"chatqna\",\n    query: \"What is the OPEA Framework?\",\n    knowledge_base: \"opea_docs\",\n    stream: false\n  })\n});\n\nconst data = await response.json();\nconsole.log(data.response);\n",
      "rust": "use axum::{\n    extract::Json,\n    http::StatusCode,\n    response::sse::{Event, Sse},\n    routing::post,\n    Router,\n};\nuse serde::{Deserialize, Serialize};\nuse std::convert::Infallible;\nuse tokio_stream::wrappers::ReceiverStream;\n\n#[derive(Deserialize)]\nstruct ChatQnARequest {\n    blueprint: String,\n    query: String,\n    knowledge_base: String,\n    stream: bool,\n}\n\nasync fn chatqna_completion(Json(payload): Json<ChatQnARequest>) -> Sse<impl Stream<Item = Result<Event, Infallible>>> {\n    let (tx, rx) = tokio::sync::mpsc::channel(100);\n    \n    tokio::spawn(async move {\n        // Simulate RAG response\n        let response = format!(\"RAG response for query: {}\", payload.query);\n        for chunk in response.chars() {\n            let event = Event::default().data(chunk.to_string());\n            let _ = tx.send(Ok(event)).await;\n            tokio::time::sleep(tokio::time::Duration::from_millis(50)).await;\n        }\n    });\n    \n    Sse::new(ReceiverStream::new(rx))\n}\n\n#[tokio::main]\nasync fn main() {\n    let app = Router::new()\n        .route(\"/blueprints/chatqna\", post(chatqna_completion));\n    \n    axum::Server::bind(&\"0.0.0.0:3000\".parse().unwrap())\n        .serve(app.into_make_service())\n        .await\n        .unwrap();\n}"
    },
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
          "name": "Qwen2 7B",
          "logo": "/src/assets/models/model_Qwen2-7B.png",
          "tags": ["Text Generation", "RAG", "Inference"]
        },
        {
          "name": "Embedding Model",
          "logo": "/src/assets/models/model_embedding.png",
          "tags": ["Embeddings", "Vector Search"]
        }
      ],
      "functional": [
        {
          "name": "Retriever",
          "description": "Vector-based document retrieval service",
          "tags": ["RAG", "Vector Search", "Document Processing"]
        },
        {
          "name": "Reranking",
          "description": "Re-ranks retrieved documents for better relevance",
          "tags": ["RAG", "Document Ranking", "Relevance"]
        }
      ]
    }
  },
  "agentqna": {
    "blueprint_id": "agentqna",
    "name": "AgentQnA",
    "category": "Multi-Agent Systems",
    "complexity": "Advanced",
    "description": "A hierarchical multi-agent system for question-answering applications.",
    "shortDescription": "Multi-agent orchestration system for complex question-answering workflows.",
    "logo": "bp_agentqna.png",
    "readiness_level": "Tech-Preview",
    "status_badges": [
      "New",
      "Tech-Preview",
      "Multi-Agent"
    ],
    "tags": [
      "Multi-Agent",
      "Hierarchical",
      "Orchestration"
    ],
    "status": "Tech Preview",
    "endpoint": "https://api.inference-hub.com/v1/blueprints/agentqna",
    "demo_assets": {
      "notebook": "https://github.com/inference-hub/blueprints/agentqna-demo.ipynb",
      "demo_link": "https://playground.inference-hub.com/blueprints/agentqna"
    },
    "aim_recipes": [
      {
        "name": "MI300X FP16",
        "hardware": "MI300X",
        "precision": "fp16",
        "recipe_file": "configs/agentqna-mi300x-fp16.yaml"
      }
    ],
    "api_examples": {
      "python": "import requests\n\nheaders = {\n    \"Authorization\": \"Bearer YOUR_API_KEY\",\n    \"Content-Type\": \"application/json\"\n}\n\npayload = {\n    \"blueprint\": \"agentqna\",\n    \"query\": \"Analyze this complex problem step by step\",\n    \"agents\": [\"researcher\", \"analyst\", \"synthesizer\"],\n    \"stream\": False\n}\n\nresponse = requests.post(\"https://api.inference-hub.com/v1/blueprints/agentqna\", headers=headers, json=payload)\nprint(response.json())\n",
      "shell": "curl -X POST https://api.inference-hub.com/v1/blueprints/agentqna \\\n  -H \"Authorization: Bearer YOUR_API_KEY\" \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\n    \"blueprint\": \"agentqna\",\n    \"query\": \"Analyze this complex problem step by step\",\n    \"agents\": [\"researcher\", \"analyst\", \"synthesizer\"],\n    \"stream\": false\n  }'\n",
      "go": "package main\n\nimport (\n    \"bytes\"\n    \"fmt\"\n    \"io/ioutil\"\n    \"net/http\"\n)\n\nfunc main() {\n    jsonStr := []byte(`{\n        \"blueprint\": \"agentqna\",\n        \"query\": \"Analyze this complex problem step by step\",\n        \"agents\": [\"researcher\", \"analyst\", \"synthesizer\"],\n        \"stream\": false\n    }`)\n\n    req, _ := http.NewRequest(\"POST\", \"https://api.inference-hub.com/v1/blueprints/agentqna\", bytes.NewBuffer(jsonStr))\n    req.Header.Set(\"Authorization\", \"Bearer YOUR_API_KEY\")\n    req.Header.Set(\"Content-Type\", \"application/json\")\n\n    client := &http.Client{}\n    resp, _ := client.Do(req)\n    body, _ := ioutil.ReadAll(resp.Body)\n    fmt.Println(string(body))\n}\n",
      "typescript": "const response = await fetch(\"https://api.inference-hub.com/v1/blueprints/agentqna\", {\n  method: \"POST\",\n  headers: {\n    \"Authorization\": \"Bearer YOUR_API_KEY\",\n    \"Content-Type\": \"application/json\"\n  },\n  body: JSON.stringify({\n    blueprint: \"agentqna\",\n    query: \"Analyze this complex problem step by step\",\n    agents: [\"researcher\", \"analyst\", \"synthesizer\"],\n    stream: false\n  })\n});\n\nconst data = await response.json();\nconsole.log(data.response);\n",
      "rust": "use axum::{\n    extract::Json,\n    http::StatusCode,\n    response::sse::{Event, Sse},\n    routing::post,\n    Router,\n};\nuse serde::{Deserialize, Serialize};\nuse std::convert::Infallible;\nuse tokio_stream::wrappers::ReceiverStream;\n\n#[derive(Deserialize)]\nstruct AgentQnARequest {\n    blueprint: String,\n    query: String,\n    agents: Vec<String>,\n    stream: bool,\n}\n\nasync fn agentqna_completion(Json(payload): Json<AgentQnARequest>) -> Sse<impl Stream<Item = Result<Event, Infallible>>> {\n    let (tx, rx) = tokio::sync::mpsc::channel(100);\n    \n    tokio::spawn(async move {\n        // Simulate multi-agent response\n        let response = format!(\"Multi-agent response for query: {}\", payload.query);\n        for chunk in response.chars() {\n            let event = Event::default().data(chunk.to_string());\n            let _ = tx.send(Ok(event)).await;\n            tokio::time::sleep(tokio::time::Duration::from_millis(50)).await;\n        }\n    });\n    \n    Sse::new(ReceiverStream::new(rx))\n}\n\n#[tokio::main]\nasync fn main() {\n    let app = Router::new()\n        .route(\"/blueprints/agentqna\", post(agentqna_completion));\n    \n    axum::Server::bind(&\"0.0.0.0:3000\".parse().unwrap())\n        .serve(app.into_make_service())\n        .await\n        .unwrap();\n}"
    },
    "blueprint_card": {
      "overview": "AgentQnA is a hierarchical multi-agent system that orchestrates multiple specialized AI agents to solve complex questions through collaborative reasoning.",
      "intended_use": [
        "Complex problem solving",
        "Multi-step reasoning tasks",
        "Research and analysis",
        "Decision support systems"
      ],
      "limitations": [
        "Higher computational overhead",
        "Complex orchestration logic",
        "May require fine-tuning for specific domains",
        "Longer response times due to agent coordination"
      ],
      "architecture": "Hierarchical agent orchestration with specialized agents for different tasks",
      "evaluation": [
        "Problem-solving accuracy: 94%",
        "Agent coordination efficiency: 87%",
        "Response time: <5 seconds",
        "Scalability: Up to 10 concurrent agents"
      ],
      "known_issues": [
        "Agent conflicts in edge cases",
        "Memory overhead with many agents",
        "Complex debugging of agent interactions"
      ],
      "references": [
        "https://arxiv.org/abs/2308.11432",
        "https://github.com/inference-hub/blueprints/agentqna"
      ]
    },
    "microservices": {
      "models": [
        {
          "name": "DeepSeek R1 0528",
          "logo": "/src/assets/models/model_DeepSeek_MoE_18B.png",
          "tags": ["Reasoning", "Multi-Agent", "Inference"]
        }
      ],
      "functional": [
        {
          "name": "Agent Orchestrator",
          "description": "Coordinates multiple agents and manages workflow",
          "tags": ["Multi-Agent", "Orchestration", "Workflow"]
        },
        {
          "name": "Agent",
          "description": "Specialized agent for specific task types",
          "tags": ["Multi-Agent", "Specialized", "Task Execution"]
        }
      ]
    }
  },
  "codegen": {
    "blueprint_id": "codegen",
    "name": "CodeGen",
    "category": "Development Tools",
    "complexity": "Intermediate",
    "description": "A code copilot application for executing code generation.",
    "shortDescription": "AI-powered code generation and completion with multiple language support.",
    "logo": "bp_codegen.png",
    "readiness_level": "Production-Ready",
    "status_badges": [
      "Production-Ready",
      "Code Generation"
    ],
    "tags": [
      "Code Generation",
      "Copilot",
      "Development"
    ],
    "status": "Production Ready",
    "endpoint": "https://api.inference-hub.com/v1/blueprints/codegen",
    "demo_assets": {
      "notebook": "https://github.com/inference-hub/blueprints/codegen-demo.ipynb",
      "demo_link": "https://playground.inference-hub.com/blueprints/codegen"
    },
    "aim_recipes": [
      {
        "name": "MI300X FP16",
        "hardware": "MI300X",
        "precision": "fp16",
        "recipe_file": "configs/codegen-mi300x-fp16.yaml"
      }
    ],
    "api_examples": {
      "python": "import requests\n\nheaders = {\n    \"Authorization\": \"Bearer YOUR_API_KEY\",\n    \"Content-Type\": \"application/json\"\n}\n\npayload = {\n    \"blueprint\": \"codegen\",\n    \"prompt\": \"Create a Python function to calculate fibonacci numbers\",\n    \"language\": \"python\",\n    \"stream\": False\n}\n\nresponse = requests.post(\"https://api.inference-hub.com/v1/blueprints/codegen\", headers=headers, json=payload)\nprint(response.json())\n",
      "shell": "curl -X POST https://api.inference-hub.com/v1/blueprints/codegen \\\n  -H \"Authorization: Bearer YOUR_API_KEY\" \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\n    \"blueprint\": \"codegen\",\n    \"prompt\": \"Create a Python function to calculate fibonacci numbers\",\n    \"language\": \"python\",\n    \"stream\": false\n  }'\n",
      "go": "package main\n\nimport (\n    \"bytes\"\n    \"fmt\"\n    \"io/ioutil\"\n    \"net/http\"\n)\n\nfunc main() {\n    jsonStr := []byte(`{\n        \"blueprint\": \"codegen\",\n        \"prompt\": \"Create a Python function to calculate fibonacci numbers\",\n        \"language\": \"python\",\n        \"stream\": false\n    }`)\n\n    req, _ := http.NewRequest(\"POST\", \"https://api.inference-hub.com/v1/blueprints/codegen\", bytes.NewBuffer(jsonStr))\n    req.Header.Set(\"Authorization\", \"Bearer YOUR_API_KEY\")\n    req.Header.Set(\"Content-Type\", \"application/json\")\n\n    client := &http.Client{}\n    resp, _ := client.Do(req)\n    body, _ := ioutil.ReadAll(resp.Body)\n    fmt.Println(string(body))\n}\n",
      "typescript": "const response = await fetch(\"https://api.inference-hub.com/v1/blueprints/codegen\", {\n  method: \"POST\",\n  headers: {\n    \"Authorization\": \"Bearer YOUR_API_KEY\",\n    \"Content-Type\": \"application/json\"\n  },\n  body: JSON.stringify({\n    blueprint: \"codegen\",\n    prompt: \"Create a Python function to calculate fibonacci numbers\",\n    language: \"python\",\n    stream: false\n  })\n});\n\nconst data = await response.json();\nconsole.log(data.code);\n",
      "rust": "use axum::{\n    extract::Json,\n    http::StatusCode,\n    response::sse::{Event, Sse},\n    routing::post,\n    Router,\n};\nuse serde::{Deserialize, Serialize};\nuse std::convert::Infallible;\nuse tokio_stream::wrappers::ReceiverStream;\n\n#[derive(Deserialize)]\nstruct CodeGenRequest {\n    blueprint: String,\n    prompt: String,\n    language: String,\n    stream: bool,\n}\n\nasync fn codegen_completion(Json(payload): Json<CodeGenRequest>) -> Sse<impl Stream<Item = Result<Event, Infallible>>> {\n    let (tx, rx) = tokio::sync::mpsc::channel(100);\n    \n    tokio::spawn(async move {\n        // Simulate code generation\n        let response = format!(\"Generated code for {}: {}\", payload.language, payload.prompt);\n        for chunk in response.chars() {\n            let event = Event::default().data(chunk.to_string());\n            let _ = tx.send(Ok(event)).await;\n            tokio::time::sleep(tokio::time::Duration::from_millis(50)).await;\n        }\n    });\n    \n    Sse::new(ReceiverStream::new(rx))\n}\n\n#[tokio::main]\nasync fn main() {\n    let app = Router::new()\n        .route(\"/blueprints/codegen\", post(codegen_completion));\n    \n    axum::Server::bind(&\"0.0.0.0:3000\".parse().unwrap())\n        .serve(app.into_make_service())\n        .await\n        .unwrap();\n}"
    },
    "blueprint_card": {
      "overview": "CodeGen is an AI-powered code generation and completion system that helps developers write code faster and more efficiently across multiple programming languages.",
      "intended_use": [
        "Code completion and generation",
        "Function and class creation",
        "Code refactoring assistance",
        "Documentation generation"
      ],
      "limitations": [
        "May generate incorrect or insecure code",
        "Requires human review for production code",
        "Limited to supported programming languages",
        "Context window limitations for large codebases"
      ],
      "architecture": "Code generation pipeline with language-specific models and syntax validation",
      "evaluation": [
        "Code accuracy: 89%",
        "Syntax correctness: 94%",
        "Developer productivity improvement: 35%",
        "Supported languages: 15+"
      ],
      "known_issues": [
        "Occasional syntax errors in generated code",
        "Limited understanding of complex codebases",
        "May suggest deprecated patterns"
      ],
      "references": [
        "https://arxiv.org/abs/2303.08774",
        "https://github.com/inference-hub/blueprints/codegen"
      ]
    },
    "microservices": {
      "models": [
        {
          "name": "DeepSeek R1 0528",
          "logo": "/src/assets/models/model_DeepSeek_MoE_18B.png",
          "tags": ["Code Generation", "Programming", "Inference"]
        }
      ],
      "functional": [
        {
          "name": "Code Validator",
          "description": "Validates generated code for syntax and security",
          "tags": ["Code Generation", "Validation", "Security"]
        },
        {
          "name": "Language Parser",
          "description": "Parses and understands code structure",
          "tags": ["Code Generation", "Parsing", "AST"]
        }
      ]
    }
  }
} as const;

export type GeneratedBlueprintData = typeof generatedBlueprintData; 