import { describe, it, expect } from 'vitest';
import { getDefaultCode } from '../utils/apiCodeGenerator';

describe('API Code Generation', () => {
  const mockModelId = 'test-model';
  const mockParameters = {
    temperature: 0.7,
    max_tokens: 2048,
    top_p: 0.9
  };
  const mockInputMessage = 'Hello, how are you?';

  describe('Python Code Generation', () => {
    it('should generate valid Python code with all required components', () => {
      const code = getDefaultCode('python', mockModelId, mockParameters, mockInputMessage);
      
      expect(code).toContain('from openai import OpenAI');
      expect(code).toContain('base_url="http://localhost:1234/v1"');
      expect(code).toContain(`model="${mockModelId}"`);
      expect(code).toContain(`temperature=${mockParameters.temperature}`);
      expect(code).toContain(`max_tokens=${mockParameters.max_tokens}`);
      expect(code).toContain(`top_p=${mockParameters.top_p}`);
      expect(code).toContain('stream=True');
      expect(code).toContain('print(chunk.choices[0].delta.content, end="", flush=True)');
    });

    it('should handle special characters in input message', () => {
      const specialMessage = 'Hello, "quoted" and \'single quoted\' text\nwith newline';
      const code = getDefaultCode('python', mockModelId, mockParameters, specialMessage);
      
      expect(code).toContain('\\"quoted\\"');
      expect(code).toContain("\\'single quoted\\'");
      expect(code).toContain('\\n');
    });
  });

  describe('JavaScript Code Generation', () => {
    it('should generate valid JavaScript code with all required components', () => {
      const code = getDefaultCode('javascript', mockModelId, mockParameters, mockInputMessage);
      
      expect(code).toContain('import OpenAI from \'openai\'');
      expect(code).toContain('baseURL: \'http://localhost:1234/v1\'');
      expect(code).toContain(`model: "${mockModelId}"`);
      expect(code).toContain(`temperature: ${mockParameters.temperature}`);
      expect(code).toContain(`max_tokens: ${mockParameters.max_tokens}`);
      expect(code).toContain(`top_p: ${mockParameters.top_p}`);
      expect(code).toContain('stream: true');
      expect(code).toContain('process.stdout.write(chunk.choices[0].delta.content)');
    });
  });

  describe('Java Code Generation', () => {
    it('should generate valid Java code with all required components', () => {
      const code = getDefaultCode('java', mockModelId, mockParameters, mockInputMessage);
      
      expect(code).toContain('import com.theokanning.openai.completion.chat.ChatCompletionRequest');
      expect(code).toContain('import com.theokanning.openai.completion.chat.ChatMessage');
      expect(code).toContain('import com.theokanning.openai.service.OpenAiService');
      expect(code).toContain(`model("${mockModelId}")`);
      expect(code).toContain(`temperature(${mockParameters.temperature})`);
      expect(code).toContain(`maxTokens(${mockParameters.max_tokens})`);
      expect(code).toContain(`topP(${mockParameters.top_p})`);
      expect(code).toContain('stream(true)');
    });
  });

  describe('Go Code Generation', () => {
    it('should generate valid Go code with all required components', () => {
      const code = getDefaultCode('go', mockModelId, mockParameters, mockInputMessage);
      
      expect(code).toContain('package main');
      expect(code).toContain('import (');
      expect(code).toContain('"context"');
      expect(code).toContain('"fmt"');
      expect(code).toContain('"log"');
      expect(code).toContain('openai "github.com/sashabaranov/go-openai"');
      expect(code).toContain('client.BaseURL = "http://localhost:1234/v1"');
      expect(code).toContain(`Model: "${mockModelId}"`);
      expect(code).toContain(`Temperature: ${mockParameters.temperature}`);
      expect(code).toContain(`MaxTokens:   ${mockParameters.max_tokens}`);
      expect(code).toContain(`TopP:        ${mockParameters.top_p}`);
      expect(code).toContain('Stream:      true');
      expect(code).toContain('stream, err := client.CreateChatCompletionStream');
      expect(code).toContain('if len(response.Choices) > 0 && response.Choices[0].Delta.Content != ""');
    });
  });

  describe('C# Code Generation', () => {
    it('should generate valid C# code with all required components', () => {
      const code = getDefaultCode('csharp', mockModelId, mockParameters, mockInputMessage);
      
      expect(code).toContain('using OpenAI;');
      expect(code).toContain('using OpenAI.Chat;');
      expect(code).toContain(`Model = "${mockModelId}"`);
      expect(code).toContain(`Temperature = ${mockParameters.temperature}`);
      expect(code).toContain(`MaxTokens = ${mockParameters.max_tokens}`);
      expect(code).toContain(`TopP = ${mockParameters.top_p}`);
      expect(code).toContain('Stream = true');
      expect(code).toContain('Console.Write(chunk.Choices[0].Delta.Content)');
    });
  });

  describe('Shell Code Generation', () => {
    it('should generate valid Shell code with all required components', () => {
      const code = getDefaultCode('shell', mockModelId, mockParameters, mockInputMessage);
      
      expect(code).toContain('curl -X POST "http://localhost:1234/v1/chat/completions"');
      expect(code).toContain('"Content-Type: application/json"');
      expect(code).toContain(`"model": "${mockModelId}"`);
      expect(code).toContain(`"temperature": ${mockParameters.temperature}`);
      expect(code).toContain(`"max_tokens": ${mockParameters.max_tokens}`);
      expect(code).toContain(`"top_p": ${mockParameters.top_p}`);
      expect(code).toContain('"stream": true');
      expect(code).toContain('jq -r \'.choices[0].delta.content // empty\'');
    });

    it('should handle empty input message', () => {
      const code = getDefaultCode('shell', mockModelId, mockParameters, '');
      expect(code).toContain('"content": ""');
    });
  });

  describe('Parameter Handling', () => {
    it('should use default values when parameters are not provided', () => {
      const code = getDefaultCode('python', mockModelId, {}, mockInputMessage);
      
      expect(code).toContain('temperature=0.7');
      expect(code).toContain('max_tokens=2048');
      expect(code).toContain('top_p=0.9');
    });

    it('should use provided parameter values', () => {
      const customParams = {
        temperature: 0.5,
        max_tokens: 1024,
        top_p: 0.8
      };
      const code = getDefaultCode('python', mockModelId, customParams, mockInputMessage);
      
      expect(code).toContain(`temperature=${customParams.temperature}`);
      expect(code).toContain(`max_tokens=${customParams.max_tokens}`);
      expect(code).toContain(`top_p=${customParams.top_p}`);
    });
  });
}); 