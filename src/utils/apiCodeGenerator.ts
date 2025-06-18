interface Parameters {
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
}

export const getDefaultCode = (
  language: 'python' | 'javascript' | 'java' | 'go' | 'csharp' | 'shell',
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
    base_url="http://localhost:1234/v1",  # LM-studio endpoint
    api_key="your-api-key"  # Optional for local LM-studio
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

    case 'javascript':
      return `import OpenAI from 'openai';

const client = new OpenAI({
    baseURL: 'http://localhost:1234/v1',  // LM-studio endpoint
    apiKey: 'your-api-key'  // Optional for local LM-studio
});

const response = await client.chat.completions.create({
    model: "${modelId}",
    messages: [
${formattedMessages}
    ],
    temperature: ${temperature},
    max_tokens: ${maxTokens},
    top_p: ${topP},
    stream: true  // Enable streaming for real-time responses
});

// Print streaming response
for await (const chunk of response) {
    if (chunk.choices[0]?.delta?.content) {
        process.stdout.write(chunk.choices[0].delta.content);
    }
}`;

    case 'java':
      return `import com.theokanning.openai.completion.chat.ChatCompletionRequest;
import com.theokanning.openai.completion.chat.ChatMessage;
import com.theokanning.openai.service.OpenAiService;
import java.util.ArrayList;
import java.util.List;

public class ChatExample {
    public static void main(String[] args) {
        OpenAiService service = new OpenAiService("your-api-key", "http://localhost:1234/v1");
        
        List<ChatMessage> messages = new ArrayList<>();
        messages.add(new ChatMessage("user", "${formattedMessage}"));
        
        ChatCompletionRequest request = ChatCompletionRequest.builder()
            .model("${modelId}")
            .messages(messages)
            .temperature(${temperature})
            .maxTokens(${maxTokens})
            .topP(${topP})
            .stream(true)
            .build();
            
        service.streamChatCompletion(request)
            .doOnNext(chunk -> {
                if (chunk.getChoices().get(0).getDelta().getContent() != null) {
                    System.out.print(chunk.getChoices().get(0).getDelta().getContent());
                }
            })
            .blockingSubscribe();
    }
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
    client.BaseURL = "http://localhost:1234/v1"

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

    case 'csharp':
      return `using OpenAI;
using OpenAI.Chat;

var client = new OpenAIClient("your-api-key", new OpenAIClientSettings
{
    BaseUrl = "http://localhost:1234/v1"
});

var request = new ChatRequest
{
    Model = "${modelId}",
    Messages = new List<Message>
    {
        new Message
        {
            Role = "user",
            Content = "${formattedMessage}"
        }
    },
    Temperature = ${temperature},
    MaxTokens = ${maxTokens},
    TopP = ${topP},
    Stream = true
};

await foreach (var chunk in client.StreamChatAsync(request))
{
    if (chunk.Choices[0].Delta.Content != null)
    {
        Console.Write(chunk.Choices[0].Delta.Content);
    }
}`;

    case 'shell':
      return `curl -X POST "http://localhost:1234/v1/chat/completions" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer your-api-key" \\
  -d '{
    "model": "${modelId}",
    "messages": [
${formattedMessages}
    ],
    "temperature": ${temperature},
    "max_tokens": ${maxTokens},
    "top_p": ${topP},
    "stream": true
  }' \\
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