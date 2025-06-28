interface Parameters {
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
}

export const getDefaultCode = (
  language: 'python' | 'typescript' | 'rust' | 'go' | 'shell',
  modelId: string,
  parameters: Parameters,
  inputMessage: string
): string => {
  const temperature = parameters.temperature || 0.7;
  const maxTokens = parameters.max_tokens || 2048;
  const topP = parameters.top_p || 0.9;

  // Format the input message with proper escaping
  const formattedMessage = inputMessage
    .replace(/"/g, '\\"')
    .replace(/'/g, "\\'")
    .replace(/\n/g, '\\n');

  // Format messages for code examples
  const formattedMessages = `    {"role": "user", "content": "${formattedMessage}"}`;

  switch (language) {
    case 'python':
      return `from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:1234/v1",  # API endpoint
    api_key="your-api-key"  # Your API key
)

response = client.chat.completions.create(
    model="${modelId}",
    messages=[
${formattedMessages}
    ],
    temperature=${temperature},
    max_tokens=${maxTokens},
    top_p=${topP},
    stream=True  # Enable streaming for real-time responses
)

# Print streaming response
for chunk in response:
    if chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="", flush=True)`;

    case 'typescript':
      return `import OpenAI from 'openai';

const client = new OpenAI({
    baseURL: 'http://localhost:1234/v1',  # API endpoint
    apiKey: 'your-api-key'  # Your API key
});

const response = await client.chat.completions.create({
    model: "${modelId}",
    messages: [
${formattedMessages}
    ],
    temperature: ${temperature},
    max_tokens: ${maxTokens},
    top_p: ${topP},
    stream: true  # Enable streaming for real-time responses
});

# Print streaming response
for await (const chunk of response) {
    if (chunk.choices[0]?.delta?.content) {
        process.stdout.write(chunk.choices[0].delta.content);
    }
}`;

    case 'rust':
      return `use axum::{
    extract::Json,
    http::StatusCode,
    response::sse::{Event, Sse},
    routing::post,
    Router,
};
use serde::{Deserialize, Serialize};
use std::convert::Infallible;
use tokio_stream::wrappers::ReceiverStream;

#[derive(Deserialize)]
struct ChatRequest {
    model: String,
    messages: Vec<Message>,
    temperature: f32,
    max_tokens: u32,
    top_p: f32,
    stream: bool,
}

#[derive(Serialize, Deserialize)]
struct Message {
    role: String,
    content: String,
}

async fn chat_completion(Json(payload): Json<ChatRequest>) -> Sse<impl Stream<Item = Result<Event, Infallible>>> {
    let (tx, rx) = tokio::sync::mpsc::channel(100);
    
    tokio::spawn(async move {
        // Simulate streaming response
        let response = format!("Response for model: {}", payload.model);
        for chunk in response.chars() {
            let event = Event::default().data(chunk.to_string());
            let _ = tx.send(Ok(event)).await;
            tokio::time::sleep(tokio::time::Duration::from_millis(50)).await;
        }
    });
    
    Sse::new(ReceiverStream::new(rx))
}

#[tokio::main]
async fn main() {
    let app = Router::new()
        .route("/chat/completions", post(chat_completion));
    
    axum::Server::bind(&"0.0.0.0:3000".parse().unwrap())
        .serve(app.into_make_service())
        .await
        .unwrap();
}`;

    case 'go':
      return `package main

import (
    "context"
    "fmt"
    "io"
    "log"
    openai "github.com/sashabaranov/go-openai"
)

func main() {
    client := openai.NewClient("your-api-key")
    client.BaseURL = "http://localhost:1234/v1" // API endpoint

    req := openai.ChatCompletionRequest{
        Model: "${modelId}",
        Messages: []openai.ChatCompletionMessage{
            {
                Role:    openai.ChatMessageRoleUser,
                Content: "${formattedMessage}",
            },
        },
        Temperature: ${temperature},
        MaxTokens:   ${maxTokens},
        TopP:        ${topP},
        Stream:      true,
    }

    stream, err := client.CreateChatCompletionStream(context.Background(), req)
    if err != nil {
        log.Fatalf("Error creating stream: %v\\n", err)
    }
    defer stream.Close()

    for {
        response, err := stream.Recv()
        if err != nil {
            if err == io.EOF {
                break
            }
            log.Printf("Error receiving stream: %v\\n", err)
            break
        }
        if len(response.Choices) > 0 && response.Choices[0].Delta.Content != "" {
            fmt.Print(response.Choices[0].Delta.Content)
        }
    }
}`;

    case 'shell':
      return `curl -X POST "http://localhost:1234/v1/chat/completions" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-api-key" \
  -d '{
    "model": "${modelId}",
    "messages": [
${formattedMessages}
    ],
    "temperature": ${temperature},
    "max_tokens": ${maxTokens},
    "top_p": ${topP},
    "stream": true
  }' \
  --no-buffer | while IFS= read -r line; do
    if [[ $line == data:* ]]; then
      content=\${line#data: }
      if [[ $content != "[DONE]" ]]; then
        echo -n "$content" | jq -r '.choices[0].delta.content // empty'
      fi
    fi
  done`;
  }
}; 