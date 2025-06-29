import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import ModelDetail from '../pages/ModelDetail';
import { lmStudioService } from '../services/lmStudioService';
import { toolService } from '../services/toolService';
import { loadModelData } from '../utils/modelLoader';
import userEvent from '@testing-library/user-event';

// Mock scrollIntoView for jsdom environment
window.HTMLElement.prototype.scrollIntoView = function() {};

// Mock the dependencies
vi.mock('../services/lmStudioService');
vi.mock('../services/toolService');
vi.mock('../utils/modelLoader');
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ modelId: 'test-model', '*': '' }),
    Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
      <a href={to}>{children}</a>
    )
  };
});

// Mock the assets
vi.mock('../assets/banner_wave.png', () => ({
  default: 'mocked-banner.png'
}));

// Mock the PlaygroundLogo component
vi.mock('../components/PlaygroundLogo', () => ({
  default: () => <div data-testid="playground-logo">Playground Logo</div>
}));

// Mock the Dialog component from Headless UI
vi.mock('@headlessui/react', () => ({
  Dialog: ({ children, open }: { children: React.ReactNode; open: boolean }) => 
    open ? <div data-testid="dialog">{children}</div> : null
}));

// Mock the Highlight component
vi.mock('prism-react-renderer', () => ({
  Highlight: ({ children }: { children: (props: { tokens: unknown[]; getLineProps: () => Record<string, unknown>; getTokenProps: () => Record<string, unknown> }) => React.ReactNode }) => 
    children({ tokens: [], getLineProps: () => ({}), getTokenProps: () => ({}) }),
  themes: {
    nightOwl: {}
  }
}));

// Mock the getDefaultCode utility
vi.mock('../utils/apiCodeGenerator', () => ({
  getDefaultCode: vi.fn(() => 'mocked-code-content')
}));

// Mock the tool components
vi.mock('../components/ToolSelector', () => ({
  default: ({ onClose, enabledTools, onToolToggle, onEnableAll, onDisableAll, onTestTools, isDevelopment }: {
    onClose: () => void;
    enabledTools: string[];
    onToolToggle: (toolName: string) => void;
    onEnableAll: () => void;
    onDisableAll: () => void;
    onTestTools?: () => void;
    isDevelopment: boolean;
  }) => {
    // Create a proper React component that re-renders when props change
    const MockToolSelector = () => {
      return (
        <div data-testid="tool-selector">
          <button onClick={onClose}>Close Tool Selector</button>
          <div data-testid="enabled-tools-count">{enabledTools.length}</div>
          <button onClick={() => onToolToggle('get_weather')}>Toggle Weather</button>
          <button onClick={onEnableAll}>Enable All</button>
          <button onClick={onDisableAll}>Disable All</button>
          {isDevelopment && onTestTools && (
            <button onClick={onTestTools}>Test Tools</button>
          )}
        </div>
      );
    };
    
    return <MockToolSelector />;
  }
}));

vi.mock('../components/ToolDocumentation', () => ({
  default: ({ onClose }: { onClose: () => void }) => (
    <div data-testid="tool-documentation">
      <button onClick={onClose}>Close Documentation</button>
    </div>
  )
}));

vi.mock('../components/ToolTestPanel', () => ({
  default: ({ onClose, onTestMessage, enabledTools, isToolCallingEnabled }: {
    onClose: () => void;
    onTestMessage: (message: string) => void;
    enabledTools: string[];
    isToolCallingEnabled: boolean;
  }) => (
    <div data-testid="tool-test-panel">
      <button onClick={onClose}>Close Test Panel</button>
      <div data-testid="enabled-tools-test">{enabledTools.join(',')}</div>
      <div data-testid="tool-calling-enabled">{isToolCallingEnabled.toString()}</div>
      <button onClick={() => onTestMessage('What is the weather in New York?')}>Test Weather</button>
      <button onClick={() => onTestMessage('Calculate 2 + 2')}>Test Calculate</button>
    </div>
  )
}));

const mockModelData = {
  model_id: 'test-model',
  name: 'Test Model',
  builder: 'Test Builder',
  family: 'Test Family',
  size: '7B',
  huggingface_id: 'test/model',
  description: 'A test model for unit testing',
  logo: 'test-logo.png',
  readiness_level: 'Production-Ready',
  status_badges: ['Featured', 'FP16-Compatible'] as const,
  tags: ['Text Generation', 'Code Generation'] as const,
  license: 'MIT',
  endpoint: 'http://localhost:1234/v1',
  demo_assets: {
    notebook: 'test-notebook.ipynb',
    demo_link: 'https://test-demo.com'
  },
  aim_recipes: [
    {
      name: 'Test Recipe',
      hardware: 'GPU',
      precision: 'FP16',
      recipe_file: 'test-recipe.yaml'
    }
  ] as const,
  api_examples: {
    python: 'print("Hello World")',
    typescript: 'console.log("Hello World")',
    shell: 'echo "Hello World"',
    rust: 'println!("Hello World")',
    go: 'fmt.Println("Hello World")'
  },
  model_card: {
    overview: 'Test model overview',
    intended_use: ['Text generation', 'Code completion'] as const,
    limitations: ['Limited context window'] as const,
    training_data: 'Test training data',
    evaluation: ['Test evaluation metrics'] as const,
    known_issues: ['Test known issues'] as const,
    references: ['Test references'] as const
  }
};

const mockChatResponse = {
  id: 'test-response-id',
  object: 'chat.completion',
  created: Date.now(),
  model: 'test-model',
  choices: [{
    index: 0,
    message: {
      role: 'assistant',
      content: 'This is a test response from the model.'
    },
    finish_reason: 'stop'
  }],
  usage: {
    prompt_tokens: 10,
    completion_tokens: 20,
    total_tokens: 30
  }
};

const mockToolCallResponse = {
  id: 'test-tool-response-id',
  object: 'chat.completion',
  created: Date.now(),
  model: 'test-model',
  choices: [{
    index: 0,
    message: {
      role: 'assistant',
      content: 'I will check the weather for you.',
      tool_calls: [{
        id: 'call_123',
        type: 'function',
        function: {
          name: 'get_weather',
          arguments: JSON.stringify({
            location: 'New York, NY',
            unit: 'fahrenheit'
          })
        }
      }]
    },
    finish_reason: 'tool_calls'
  }],
  usage: {
    prompt_tokens: 15,
    completion_tokens: 25,
    total_tokens: 40
  }
};

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

// Helper function to wait for component to be fully loaded
const waitForComponentToLoad = async () => {
  await waitFor(() => {
    expect(screen.getByText('Test Model')).toBeInTheDocument();
  });
  
  await waitFor(() => {
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });
  
  await new Promise(resolve => setTimeout(resolve, 100));
};

describe('ModelDetail Tool Calling', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock loadModelData to return our test data
    (loadModelData as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(mockModelData);
    
    // Mock lmStudioService
    (lmStudioService as unknown as { chatCompletion: ReturnType<typeof vi.fn> }).chatCompletion = vi.fn().mockResolvedValue(mockChatResponse);
    
    // Mock toolService
    (toolService as unknown as { executeTool: ReturnType<typeof vi.fn> }).executeTool = vi.fn().mockResolvedValue({
      content: 'Weather data: Sunny, 75°F'
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Tool Calling Toggle', () => {
    it('should have tool calling disabled by default', async () => {
      await act(async () => {
        renderWithRouter(<ModelDetail />);
      });
      
      await waitForComponentToLoad();
      
      const toolCallingCheckbox = screen.getByRole('checkbox');
      expect(toolCallingCheckbox).not.toBeChecked();
      expect(screen.getByText('Enable Tool Calling')).toBeInTheDocument();
    });

    it('should enable tool calling when checkbox is clicked', async () => {
      const user = userEvent.setup();
      
      await act(async () => {
        renderWithRouter(<ModelDetail />);
      });
      
      await waitForComponentToLoad();
      
      const toolCallingCheckbox = screen.getByRole('checkbox');
      await user.click(toolCallingCheckbox);
      
      expect(toolCallingCheckbox).toBeChecked();
      expect(screen.getByText('Tool Calling Active')).toBeInTheDocument();
    });

    it('should disable tool calling when checkbox is unchecked', async () => {
      const user = userEvent.setup();
      
      await act(async () => {
        renderWithRouter(<ModelDetail />);
      });
      
      await waitForComponentToLoad();
      
      const toolCallingCheckbox = screen.getByRole('checkbox');
      
      // Enable first
      await user.click(toolCallingCheckbox);
      expect(toolCallingCheckbox).toBeChecked();
      
      // Then disable
      await user.click(toolCallingCheckbox);
      expect(toolCallingCheckbox).not.toBeChecked();
      expect(screen.getByText('Enable Tool Calling')).toBeInTheDocument();
    });
  });

  describe('Tool Selection', () => {
    it('should show tool selector button with correct count', async () => {
      await act(async () => {
        renderWithRouter(<ModelDetail />);
      });
      
      await waitForComponentToLoad();
      
      // Should show "Tools (6/6)" by default (all tools enabled)
      expect(screen.getByText('Tools (6/6)')).toBeInTheDocument();
    });

    it('should open tool selector modal when clicked', async () => {
      const user = userEvent.setup();
      
      await act(async () => {
        renderWithRouter(<ModelDetail />);
      });
      
      await waitForComponentToLoad();
      
      const toolSelectorButton = screen.getByTitle('Tool Selection');
      await user.click(toolSelectorButton);
      
      expect(screen.getByTestId('tool-selector')).toBeInTheDocument();
    });

    it('should close tool selector modal when close button is clicked', async () => {
      const user = userEvent.setup();
      
      await act(async () => {
        renderWithRouter(<ModelDetail />);
      });
      
      await waitForComponentToLoad();
      
      // Open tool selector
      const toolSelectorButton = screen.getByTitle('Tool Selection');
      await user.click(toolSelectorButton);
      
      expect(screen.getByTestId('tool-selector')).toBeInTheDocument();
      
      // Close tool selector
      const closeButton = screen.getByText('Close Tool Selector');
      await user.click(closeButton);
      
      await waitFor(() => {
        expect(screen.queryByTestId('tool-selector')).not.toBeInTheDocument();
      });
    });

    it('should enable all tools when enable all is clicked', async () => {
      const user = userEvent.setup();
      
      await act(async () => {
        renderWithRouter(<ModelDetail />);
      });
      
      await waitForComponentToLoad();
      
      // Open tool selector
      const toolSelectorButton = screen.getByTitle('Tool Selection');
      await user.click(toolSelectorButton);
      
      // Click enable all
      const enableAllButton = screen.getByText('Enable All');
      await user.click(enableAllButton);
      
      // Should show all 6 tools enabled - wait for state to update
      await waitFor(() => {
        expect(screen.getByTestId('enabled-tools-count')).toHaveTextContent('6');
      });
    });

    it('should disable all tools when disable all is clicked', async () => {
      const user = userEvent.setup();
      
      await act(async () => {
        renderWithRouter(<ModelDetail />);
      });
      
      await waitForComponentToLoad();
      
      // Open tool selector
      const toolSelectorButton = screen.getByTitle('Tool Selection');
      await user.click(toolSelectorButton);
      
      // Click disable all
      const disableAllButton = screen.getByText('Disable All');
      await user.click(disableAllButton);
      
      // Should show 0 tools enabled - wait for state to update
      await waitFor(() => {
        expect(screen.getByTestId('enabled-tools-count')).toHaveTextContent('0');
      });
    });

    it('should toggle individual tools', async () => {
      const user = userEvent.setup();
      
      await act(async () => {
        renderWithRouter(<ModelDetail />);
      });
      
      await waitForComponentToLoad();
      
      // Open tool selector
      const toolSelectorButton = screen.getByTitle('Tool Selection');
      await user.click(toolSelectorButton);
      
      // Toggle weather tool
      const toggleWeatherButton = screen.getByText('Toggle Weather');
      await user.click(toggleWeatherButton);
      
      // Should show 5 tools enabled (one disabled) - wait for state to update
      await waitFor(() => {
        expect(screen.getByTestId('enabled-tools-count')).toHaveTextContent('5');
      });
    });
  });

  describe('Tool Documentation', () => {
    it('should open tool documentation modal when clicked', async () => {
      const user = userEvent.setup();
      
      await act(async () => {
        renderWithRouter(<ModelDetail />);
      });
      
      await waitForComponentToLoad();
      
      const documentationButton = screen.getByTitle('Tool Documentation');
      await user.click(documentationButton);
      
      expect(screen.getByTestId('tool-documentation')).toBeInTheDocument();
    });

    it('should close tool documentation modal when close button is clicked', async () => {
      const user = userEvent.setup();
      
      await act(async () => {
        renderWithRouter(<ModelDetail />);
      });
      
      await waitForComponentToLoad();
      
      // Open documentation
      const documentationButton = screen.getByTitle('Tool Documentation');
      await user.click(documentationButton);
      
      expect(screen.getByTestId('tool-documentation')).toBeInTheDocument();
      
      // Close documentation
      const closeButton = screen.getByText('Close Documentation');
      await user.click(closeButton);
      
      await waitFor(() => {
        expect(screen.queryByTestId('tool-documentation')).not.toBeInTheDocument();
      });
    });
  });

  describe('Tool Test Panel', () => {
    it('should show tool test panel when test button is clicked', async () => {
      const user = userEvent.setup();
      
      await act(async () => {
        renderWithRouter(<ModelDetail />);
      });
      
      await waitForComponentToLoad();
      
      // Open tool selector first
      const toolSelectorButton = screen.getByTitle('Tool Selection');
      await user.click(toolSelectorButton);
      
      // Click test tools button inside tool selector
      const testPanelButton = screen.getByText('Test Tools');
      await user.click(testPanelButton);
      
      expect(screen.getByTestId('tool-test-panel')).toBeInTheDocument();
    });

    it('should show correct tool calling status in test panel', async () => {
      const user = userEvent.setup();
      
      await act(async () => {
        renderWithRouter(<ModelDetail />);
      });
      
      await waitForComponentToLoad();
      
      // Enable tool calling first
      const toolCallingCheckbox = screen.getByRole('checkbox');
      await user.click(toolCallingCheckbox);
      
      // Open tool selector
      const toolSelectorButton = screen.getByTitle('Tool Selection');
      await user.click(toolSelectorButton);
      
      // Click test tools button inside tool selector
      const testPanelButton = screen.getByText('Test Tools');
      await user.click(testPanelButton);
      
      expect(screen.getByTestId('tool-calling-enabled')).toHaveTextContent('true');
    });

    it('should show enabled tools in test panel', async () => {
      const user = userEvent.setup();
      
      await act(async () => {
        renderWithRouter(<ModelDetail />);
      });
      
      await waitForComponentToLoad();
      
      // Open tool selector
      const toolSelectorButton = screen.getByTitle('Tool Selection');
      await user.click(toolSelectorButton);
      
      // Click test tools button inside tool selector
      const testPanelButton = screen.getByText('Test Tools');
      await user.click(testPanelButton);
      
      // Should show all enabled tools
      expect(screen.getByTestId('enabled-tools-test')).toHaveTextContent('get_weather,search_web,calculate,translate,get_stock_price,get_time');
    });

    it('should trigger test message when test button is clicked', async () => {
      const user = userEvent.setup();
      
      await act(async () => {
        renderWithRouter(<ModelDetail />);
      });
      
      await waitForComponentToLoad();
      
      // Open tool selector
      const toolSelectorButton = screen.getByTitle('Tool Selection');
      await user.click(toolSelectorButton);
      
      // Click test tools button inside tool selector
      const testPanelButton = screen.getByText('Test Tools');
      await user.click(testPanelButton);
      
      // Click test weather button
      const testWeatherButton = screen.getByText('Test Weather');
      await user.click(testWeatherButton);
      
      // Should populate the input with test message
      await waitFor(() => {
        const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
        expect(textarea.value).toBe('What is the weather in New York?');
      });
    });
  });

  describe('Tool Calling Execution', () => {
    it('should send tools in request when tool calling is enabled', async () => {
      const user = userEvent.setup();
      
      await act(async () => {
        renderWithRouter(<ModelDetail />);
      });
      
      await waitForComponentToLoad();
      
      // Enable tool calling
      const toolCallingCheckbox = screen.getByRole('checkbox');
      await user.click(toolCallingCheckbox);
      
      // Send a message
      const textarea = screen.getByRole('textbox');
      await user.type(textarea, 'What is the weather in New York?');
      
      const sendButton = screen.getByLabelText('Send');
      await user.click(sendButton);
      
      await waitFor(() => {
        expect(lmStudioService.chatCompletion).toHaveBeenCalledWith(
          expect.objectContaining({
            tools: expect.arrayContaining([
              expect.objectContaining({
                function: expect.objectContaining({
                  name: 'get_weather'
                })
              })
            ])
          }),
          undefined
        );
      });
    });

    it('should not send tools in request when tool calling is disabled', async () => {
      const user = userEvent.setup();
      
      await act(async () => {
        renderWithRouter(<ModelDetail />);
      });
      
      await waitForComponentToLoad();
      
      // Ensure tool calling is disabled (default state)
      const toolCallingCheckbox = screen.getByRole('checkbox');
      expect(toolCallingCheckbox).not.toBeChecked();
      
      // Send a message
      const textarea = screen.getByRole('textbox');
      await user.type(textarea, 'Hello, how are you?');
      
      const sendButton = screen.getByLabelText('Send');
      await user.click(sendButton);
      
      await waitFor(() => {
        expect(lmStudioService.chatCompletion).toHaveBeenCalledWith(
          expect.not.objectContaining({
            tools: expect.anything()
          }),
          expect.any(Function)
        );
      });
    });

    it('should execute tool calls when received from model', async () => {
      const user = userEvent.setup();
      
      // Mock tool call response
      (lmStudioService as unknown as { chatCompletion: ReturnType<typeof vi.fn> }).chatCompletion = vi.fn().mockResolvedValue(mockToolCallResponse);
      
      await act(async () => {
        renderWithRouter(<ModelDetail />);
      });
      
      await waitForComponentToLoad();
      
      // Enable tool calling
      const toolCallingCheckbox = screen.getByRole('checkbox');
      await user.click(toolCallingCheckbox);
      
      // Send a message
      const textarea = screen.getByRole('textbox');
      await user.type(textarea, 'What is the weather in New York?');
      
      const sendButton = screen.getByLabelText('Send');
      await user.click(sendButton);
      
      await waitFor(() => {
        expect(toolService.executeTool).toHaveBeenCalledWith(
          expect.objectContaining({
            id: 'call_123',
            type: 'function',
            function: expect.objectContaining({
              name: 'get_weather',
              arguments: expect.stringContaining('New York')
            })
          })
        );
      });
    });

    it('should add tool response to messages after execution', async () => {
      const user = userEvent.setup();
      
      // Mock tool call response
      (lmStudioService as unknown as { chatCompletion: ReturnType<typeof vi.fn> }).chatCompletion = vi.fn().mockResolvedValue(mockToolCallResponse);
      
      await act(async () => {
        renderWithRouter(<ModelDetail />);
      });
      
      await waitForComponentToLoad();
      
      // Enable tool calling
      const toolCallingCheckbox = screen.getByRole('checkbox');
      await user.click(toolCallingCheckbox);
      
      // Send a message
      const textarea = screen.getByRole('textbox');
      await user.type(textarea, 'What is the weather in New York?');
      
      const sendButton = screen.getByLabelText('Send');
      await user.click(sendButton);
      
      // Wait for tool execution and message addition
      await waitFor(() => {
        expect(screen.getByText('Weather data: Sunny, 75°F')).toBeInTheDocument();
      });
    });

    it('should handle multiple tool calls in sequence', async () => {
      const user = userEvent.setup();
      
      // Mock response with multiple tool calls
      const multiToolResponse = {
        ...mockToolCallResponse,
        choices: [{
          index: 0,
          message: {
            role: 'assistant',
            content: 'I will check the weather and calculate something.',
            tool_calls: [
              {
                id: 'call_123',
                type: 'function',
                function: {
                  name: 'get_weather',
                  arguments: JSON.stringify({
                    location: 'New York, NY',
                    unit: 'fahrenheit'
                  })
                }
              },
              {
                id: 'call_124',
                type: 'function',
                function: {
                  name: 'calculate',
                  arguments: JSON.stringify({
                    expression: '2 + 2'
                  })
                }
              }
            ]
          },
          finish_reason: 'tool_calls'
        }]
      };
      
      (lmStudioService as unknown as { chatCompletion: ReturnType<typeof vi.fn> }).chatCompletion = vi.fn().mockResolvedValue(multiToolResponse);
      
      await act(async () => {
        renderWithRouter(<ModelDetail />);
      });
      
      await waitForComponentToLoad();
      
      // Enable tool calling
      const toolCallingCheckbox = screen.getByRole('checkbox');
      await user.click(toolCallingCheckbox);
      
      // Send a message
      const textarea = screen.getByRole('textbox');
      await user.type(textarea, 'What is the weather and calculate 2+2?');
      
      const sendButton = screen.getByLabelText('Send');
      await user.click(sendButton);
      
      // Should execute both tools
      await waitFor(() => {
        expect(toolService.executeTool).toHaveBeenCalledTimes(2);
      });
      
      expect(toolService.executeTool).toHaveBeenCalledWith(
        expect.objectContaining({
          function: expect.objectContaining({
            name: 'get_weather'
          })
        })
      );
      
      expect(toolService.executeTool).toHaveBeenCalledWith(
        expect.objectContaining({
          function: expect.objectContaining({
            name: 'calculate'
          })
        })
      );
    });
  });

  describe('Tool Calling Error Handling', () => {
    it('should handle tool execution errors gracefully', async () => {
      const user = userEvent.setup();
      
      // Mock tool call response
      (lmStudioService as unknown as { chatCompletion: ReturnType<typeof vi.fn> }).chatCompletion = vi.fn().mockResolvedValue(mockToolCallResponse);
      
      // Mock tool execution error
      (toolService as unknown as { executeTool: ReturnType<typeof vi.fn> }).executeTool = vi.fn().mockRejectedValue(new Error('Tool execution failed'));
      
      await act(async () => {
        renderWithRouter(<ModelDetail />);
      });
      
      await waitForComponentToLoad();
      
      // Enable tool calling
      const toolCallingCheckbox = screen.getByRole('checkbox');
      await user.click(toolCallingCheckbox);
      
      // Send a message
      const textarea = screen.getByRole('textbox');
      await user.type(textarea, 'What is the weather in New York?');
      
      const sendButton = screen.getByLabelText('Send');
      await user.click(sendButton);
      
      // Should not crash and should still show the assistant message
      await waitFor(() => {
        expect(screen.getByText('I will check the weather for you.')).toBeInTheDocument();
      });
    });

    it('should handle API errors during tool calling', async () => {
      const user = userEvent.setup();
      
      // Mock API error
      (lmStudioService as unknown as { chatCompletion: ReturnType<typeof vi.fn> }).chatCompletion = vi.fn().mockRejectedValue(new Error('API Error'));
      
      await act(async () => {
        renderWithRouter(<ModelDetail />);
      });
      
      await waitForComponentToLoad();
      
      // Enable tool calling
      const toolCallingCheckbox = screen.getByRole('checkbox');
      await user.click(toolCallingCheckbox);
      
      // Send a message
      const textarea = screen.getByRole('textbox');
      await user.type(textarea, 'What is the weather in New York?');
      
      const sendButton = screen.getByLabelText('Send');
      await user.click(sendButton);
      
      // Should not crash and should re-enable the input
      await waitFor(() => {
        const sendButton = screen.getByLabelText('Send');
        // Button should be disabled because input is empty, but not because of loading
        expect(sendButton).toBeDisabled();
        // Verify that the disabled state is due to empty input, not loading
        expect(sendButton).toHaveClass('bg-gray-600/20');
      });
    });
  });

  describe('Tool Calling State Management', () => {
    it('should maintain tool calling state across messages', async () => {
      const user = userEvent.setup();
      
      await act(async () => {
        renderWithRouter(<ModelDetail />);
      });
      
      await waitForComponentToLoad();
      
      // Enable tool calling
      const toolCallingCheckbox = screen.getByRole('checkbox');
      await user.click(toolCallingCheckbox);
      expect(toolCallingCheckbox).toBeChecked();
      
      // Send first message
      const textarea = screen.getByRole('textbox');
      await user.type(textarea, 'Hello');
      
      const sendButton = screen.getByLabelText('Send');
      await user.click(sendButton);
      
      // Wait for response
      await waitFor(() => {
        expect(screen.getByText('This is a test response from the model.')).toBeInTheDocument();
      });
      
      // Tool calling should still be enabled
      expect(toolCallingCheckbox).toBeChecked();
      
      // Send second message
      await user.type(textarea, 'How are you?');
      await user.click(sendButton);
      
      // Tool calling should still be enabled
      expect(toolCallingCheckbox).toBeChecked();
    });

    it('should maintain enabled tools state across messages', async () => {
      const user = userEvent.setup();
      
      await act(async () => {
        renderWithRouter(<ModelDetail />);
      });
      
      await waitForComponentToLoad();
      
      // Open tool selector and disable a tool
      const toolSelectorButton = screen.getByTitle('Tool Selection');
      await user.click(toolSelectorButton);
      
      const toggleWeatherButton = screen.getByText('Toggle Weather');
      await user.click(toggleWeatherButton);
      
      // Close tool selector
      const closeButton = screen.getByText('Close Tool Selector');
      await user.click(closeButton);
      
      // Should show 5 tools enabled
      expect(screen.getByText('Tools (5/6)')).toBeInTheDocument();
      
      // Send a message
      const textarea = screen.getByRole('textbox');
      await user.type(textarea, 'Hello');
      
      const sendButton = screen.getByLabelText('Send');
      await user.click(sendButton);
      
      // Wait for response
      await waitFor(() => {
        expect(screen.getByText('This is a test response from the model.')).toBeInTheDocument();
      });
      
      // Should still show 5 tools enabled
      expect(screen.getByText('Tools (5/6)')).toBeInTheDocument();
    });
  });
}); 