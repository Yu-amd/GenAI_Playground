import axios from 'axios';

interface LMStudioConfig {
  endpoint: string;
  apiKey?: string;
}

interface ChatMessage {
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
  tool_calls?: Array<{
    id: string;
    type: 'function';
    function: {
      name: string;
      arguments: string;
    };
  }>;
}

interface ChatCompletionRequest {
  messages: ChatMessage[];
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  stream?: boolean;
  tools?: Array<{
    name: string;
    description: string;
    parameters: {
      type: string;
      properties: Record<string, any>;
      required: string[];
    };
  }>;
}

interface ChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string | null;
      tool_calls?: Array<{
        id: string;
        type: 'function';
        function: {
          name: string;
          arguments: string;
        };
      }>;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

interface StreamChunk {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    delta: {
      content?: string;
      role?: string;
    };
    finish_reason: string | null;
  }>;
}

export class LMStudioService {
  private config: LMStudioConfig;
  private axiosInstance;

  constructor(config: LMStudioConfig) {
    this.config = config;
    this.axiosInstance = axios.create({
      baseURL: config.endpoint,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*',
        ...(config.apiKey && { 'Authorization': `Bearer ${config.apiKey}` })
      },
      timeout: 30000,
      withCredentials: false
    });

    // Add response interceptor for debugging
    this.axiosInstance.interceptors.response.use(
      response => {
        console.log('Response received:', response);
        return response;
      },
      error => {
        console.error('Request failed:', error);
        return Promise.reject(error);
      }
    );
  }

  async chatCompletion(
    request: ChatCompletionRequest,
    onStreamChunk?: (chunk: StreamChunk) => void
  ): Promise<ChatCompletionResponse> {
    try {
      console.log('Sending request to LM-studio:', {
        url: `${this.config.endpoint}/v1/chat/completions`,
        request
      });

      if (onStreamChunk) {
        // Handle streaming response
        const response = await fetch(`${this.config.endpoint}/v1/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(this.config.apiKey && { 'Authorization': `Bearer ${this.config.apiKey}` })
          },
          body: JSON.stringify({ ...request, stream: true })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error('No reader available');
        }

        let accumulatedContent = '';
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n').filter(line => line.trim() !== '');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') continue;

              try {
                const parsed = JSON.parse(data) as StreamChunk;
                if (parsed.choices[0]?.delta?.content) {
                  accumulatedContent += parsed.choices[0].delta.content;
                }
                onStreamChunk(parsed);
              } catch (e) {
                console.error('Error parsing stream chunk:', e);
              }
            }
          }
        }

        // Return the final response
        return {
          id: 'stream-completion',
          object: 'chat.completion',
          created: Date.now(),
          model: request.messages[0]?.content || '',
          choices: [{
            index: 0,
            message: {
              role: 'assistant',
              content: accumulatedContent
            },
            finish_reason: 'stop'
          }],
          usage: {
            prompt_tokens: 0,
            completion_tokens: 0,
            total_tokens: 0
          }
        };
      } else {
        // Handle regular response
        const response = await this.axiosInstance.post('/v1/chat/completions', request);
        console.log('Received response from LM-studio:', response.data);
        return response.data;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNREFUSED') {
          throw new Error('Could not connect to LM-studio. Please make sure it is running on the correct port.');
        }
        if (error.code === 'ERR_NETWORK') {
          throw new Error('Network error. Please check if LM-studio is running and accessible.');
        }
        console.error('LM-studio API Error:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          message: error.message,
          code: error.code,
          headers: error.response?.headers
        });
        throw new Error(`LM-studio API Error: ${error.message}`);
      }
      console.error('Unexpected error:', error);
      throw error;
    }
  }

  setConfig(config: LMStudioConfig) {
    this.config = config;
    this.axiosInstance = axios.create({
      baseURL: config.endpoint,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*',
        ...(config.apiKey && { 'Authorization': `Bearer ${config.apiKey}` })
      },
      timeout: 30000,
      withCredentials: false
    });
  }
}

// Create a singleton instance
const defaultConfig: LMStudioConfig = {
  endpoint: 'http://localhost:1234',
};

export const lmStudioService = new LMStudioService(defaultConfig); 