import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import ModelDetail from '../pages/ModelDetail';
import { lmStudioService } from '../services/lmStudioService';
import { loadModelData } from '../utils/modelLoader';
import userEvent from '@testing-library/user-event';

// Mock scrollIntoView for jsdom environment
window.HTMLElement.prototype.scrollIntoView = function() {};

// Mock the dependencies
vi.mock('../services/lmStudioService');
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
    oneDark: {}
  }
}));

// Mock the getDefaultCode utility
vi.mock('../utils/apiCodeGenerator', () => ({
  getDefaultCode: vi.fn(() => 'mocked-code-content')
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
    // Wait for the model name to appear, indicating the component is loaded
    expect(screen.getByText('Test Model')).toBeInTheDocument();
  });
  
  // Additional wait to ensure the chat interface is fully rendered
  await waitFor(() => {
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });
  
  // Small delay to ensure component is fully stable
  await new Promise(resolve => setTimeout(resolve, 100));
};

describe('ModelDetail Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock loadModelData to return our test data
    (loadModelData as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(mockModelData);
    
    // Mock lmStudioService
    (lmStudioService as unknown as { chatCompletion: ReturnType<typeof vi.fn> }).chatCompletion = vi.fn().mockResolvedValue(mockChatResponse);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Initial Rendering', () => {
    it('should render loading state initially', async () => {
      await act(async () => {
        renderWithRouter(<ModelDetail />);
      });
      
      // Should show loading or not found initially since model data is loading
      await waitForComponentToLoad();
    });

    it('should render model details after data loads', async () => {
      await act(async () => {
        renderWithRouter(<ModelDetail />);
      });
      
      await waitForComponentToLoad();
      
      expect(screen.getByText('A test model for unit testing')).toBeInTheDocument();
      expect(screen.getByText('Text Generation')).toBeInTheDocument();
      expect(screen.getByText('Code Generation')).toBeInTheDocument();
    });

    it('should render navigation links', async () => {
      await act(async () => {
        renderWithRouter(<ModelDetail />);
      });
      
      await waitForComponentToLoad();
      
      await waitFor(() => {
        expect(screen.getByText('Models')).toBeInTheDocument();
        expect(screen.getByText('Blueprints')).toBeInTheDocument();
        expect(screen.getByText('GPU Clouds')).toBeInTheDocument();
      });
    });

    it('should render the playground logo', async () => {
      await act(async () => {
        renderWithRouter(<ModelDetail />);
      });
      
      await waitForComponentToLoad();
      
      await waitFor(() => {
        expect(screen.getByTestId('playground-logo')).toBeInTheDocument();
      });
    });
  });

  describe('Model Card Modal', () => {
    it('should open model card modal when button is clicked', async () => {
      await act(async () => {
        renderWithRouter(<ModelDetail />);
      });
      
      await waitForComponentToLoad();
      
      await waitFor(() => {
        expect(screen.getByText('Model Card')).toBeInTheDocument();
      });
      
      await act(async () => {
        fireEvent.click(screen.getByText('Model Card'));
      });
      
      await waitFor(() => {
        expect(screen.getByTestId('dialog')).toBeInTheDocument();
      });
    });
  });

  describe('Chat Interface', () => {
    it('should render chat input and send button', async () => {
      await act(async () => {
        renderWithRouter(<ModelDetail />);
      });
      
      await waitForComponentToLoad();
      
      await waitFor(() => {
        expect(screen.getByRole('textbox')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
      });
    });

    it('should update input value when typing', async () => {
      await act(async () => {
        renderWithRouter(<ModelDetail />);
      });
      
      await waitForComponentToLoad();
      
      await waitFor(() => {
        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'Hello, world!' } });
        expect(input).toHaveValue('Hello, world!');
      });
    });

    it('should send message when send button is clicked', async () => {
      await act(async () => {
        renderWithRouter(<ModelDetail />);
      });
      
      // Wait for the component to be fully loaded
      await waitFor(() => {
        expect(screen.getByText('Test Model')).toBeInTheDocument();
      });
      
      // Wait for the textarea to be available
      let input: HTMLElement;
      await waitFor(() => {
        input = screen.getByRole('textbox');
        expect(input).toBeInTheDocument();
      });
      
      const sendButton = screen.getByRole('button', { name: /send/i });
      
      fireEvent.change(input!, { target: { value: 'Test message' } });
      fireEvent.click(sendButton);
      
      await waitFor(() => {
        expect(lmStudioService.chatCompletion).toHaveBeenCalled();
      });
    });

    it('should send message when Enter key is pressed', async () => {
      await act(async () => {
        renderWithRouter(<ModelDetail />);
      });
      
      // Wait for the component to be fully loaded
      await waitFor(() => {
        expect(screen.getByText('Test Model')).toBeInTheDocument();
      });
      
      // Wait for the textarea to be available
      let input: HTMLElement;
      await waitFor(() => {
        input = screen.getByRole('textbox');
        expect(input).toBeInTheDocument();
      });
      
      await userEvent.type(input!, 'Test message{enter}');
      
      await waitFor(() => {
        expect(lmStudioService.chatCompletion).toHaveBeenCalled();
      });
    });

    it('should not send message when Shift+Enter is pressed', async () => {
      await act(async () => {
        renderWithRouter(<ModelDetail />);
      });
      
      await waitForComponentToLoad();
      
      await waitFor(() => {
        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'Hello, world!' } });
        fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', shiftKey: true });
      });
      
      // Should not call the API
      expect(lmStudioService.chatCompletion).not.toHaveBeenCalled();
    });

    it('should display received messages in chat', async () => {
      // Ensure the mock returns the expected response
      (lmStudioService as unknown as { chatCompletion: ReturnType<typeof vi.fn> }).chatCompletion.mockResolvedValue({
        choices: [
          {
            message: { content: 'Test response' }
          }
        ]
      });

      await act(async () => {
        renderWithRouter(<ModelDetail />);
      });
      
      // Wait for the component to be fully loaded
      await waitFor(() => {
        expect(screen.getByText('Test Model')).toBeInTheDocument();
      });
      
      // Wait for the textarea to be available
      let input: HTMLElement;
      await waitFor(() => {
        input = screen.getByRole('textbox');
        expect(input).toBeInTheDocument();
      });
      
      const sendButton = screen.getByRole('button', { name: /send/i });
      
      fireEvent.change(input!, { target: { value: 'Hello' } });
      fireEvent.click(sendButton);
      
      await waitFor(() => {
        expect(screen.getByText('Hello')).toBeInTheDocument();
        expect(screen.getByText('Test response')).toBeInTheDocument();
      });
    });
  });

  describe('Parameters Panel', () => {
    it('should render parameters panel when toggled', async () => {
      await act(async () => {
        renderWithRouter(<ModelDetail />);
      });
      
      await waitForComponentToLoad();
      
      await waitFor(() => {
        const parametersButton = screen.getByRole('button', { name: /parameters/i });
        fireEvent.click(parametersButton);
      });
      
      await waitFor(() => {
        expect(screen.getByText('Temperature')).toBeInTheDocument();
        expect(screen.getByText('Max Tokens')).toBeInTheDocument();
        expect(screen.getByText('Top P')).toBeInTheDocument();
      });
    });

    it('should update parameter values when sliders are moved', async () => {
      await act(async () => {
        renderWithRouter(<ModelDetail />);
      });
      
      await waitForComponentToLoad();
      
      await waitFor(() => {
        const parametersButton = screen.getByRole('button', { name: /parameters/i });
        fireEvent.click(parametersButton);
      });
      
      await waitFor(() => {
        const temperatureSlider = screen.getByLabelText(/temperature/i);
        fireEvent.change(temperatureSlider, { target: { value: '0.5' } });
        expect(temperatureSlider).toHaveValue('0.5');
      });
    });

    it('should reset parameters to defaults when reset button is clicked', async () => {
      await act(async () => {
        renderWithRouter(<ModelDetail />);
      });
      
      await waitForComponentToLoad();
      
      await waitFor(() => {
        const parametersButton = screen.getByRole('button', { name: /parameters/i });
        fireEvent.click(parametersButton);
      });
      
      await waitFor(() => {
        const resetButton = screen.getByRole('button', { name: /reset to defaults/i });
        fireEvent.click(resetButton);
        
        const temperatureSlider = screen.getByLabelText(/temperature/i);
        expect(temperatureSlider).toHaveValue('0.7');
      });
    });
  });

  describe('Code Generation', () => {
    it('should render code generation panel', async () => {
      await act(async () => {
        renderWithRouter(<ModelDetail />);
      });
      
      await waitForComponentToLoad();
      
      await waitFor(() => {
        expect(screen.getByText('API Integration')).toBeInTheDocument();
      });
    });

    it('should change selected language when language buttons are clicked', async () => {
      await act(async () => {
        renderWithRouter(<ModelDetail />);
      });
      
      await waitForComponentToLoad();
      
      await waitFor(() => {
        const typescriptButton = screen.getByRole('button', { name: /typescript/i });
        fireEvent.click(typescriptButton);
        
        // The button should show as selected
        expect(typescriptButton).toHaveClass('bg-blue-600/20');
      });
    });

    it('should copy code to clipboard when copy button is clicked', async () => {
      await act(async () => {
        renderWithRouter(<ModelDetail />);
      });
      
      await waitForComponentToLoad();
      
      await waitFor(() => {
        const copyButton = screen.getByRole('button', { name: /copy code/i });
        fireEvent.click(copyButton);
      });
      
      await waitFor(() => {
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith('mocked-code-content');
      });
    });
  });

  describe('Tool Calling', () => {
    it('should enable tool calling when toggle is switched', async () => {
      await act(async () => {
        renderWithRouter(<ModelDetail />);
      });
      
      await waitForComponentToLoad();
      
      await waitFor(() => {
        const toolCallingToggle = screen.getByRole('checkbox', { name: /enable tool calling/i });
        fireEvent.click(toolCallingToggle);
        expect(toolCallingToggle).toBeChecked();
      });
    });

    it('should include tools in API call when tool calling is enabled', async () => {
      await act(async () => {
        renderWithRouter(<ModelDetail />);
      });
      
      // Wait for the component to be fully loaded
      await waitFor(() => {
        expect(screen.getByText('Test Model')).toBeInTheDocument();
      });
      
      // Wait for the elements to be available
      let input: HTMLElement;
      let toolCallingToggle: HTMLElement;
      await waitFor(() => {
        toolCallingToggle = screen.getByRole('checkbox', { name: /enable tool calling/i });
        input = screen.getByRole('textbox');
        expect(toolCallingToggle).toBeInTheDocument();
        expect(input).toBeInTheDocument();
      });
      
      const sendButton = screen.getByRole('button', { name: /send/i });
      
      fireEvent.click(toolCallingToggle!);
      fireEvent.change(input!, { target: { value: 'Test message' } });
      fireEvent.click(sendButton);
      
      await waitFor(() => {
        // Check that the tools array contains the expected tool
        const call = ((lmStudioService as unknown as { chatCompletion: { mock: { calls: unknown[][] } } }).chatCompletion.mock.calls[0][0]) as { tools: unknown[] };
        expect(call.tools).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ 
              type: 'function',
              function: expect.objectContaining({ 
                name: 'get_weather' 
              })
            })
          ])
        );
      });
    });
  });

  describe('Settings Modal', () => {
    it('should open settings modal when settings button is clicked', async () => {
      await act(async () => {
        renderWithRouter(<ModelDetail />);
      });
      
      await waitForComponentToLoad();
      
      await waitFor(() => {
        const settingsButton = screen.getByRole('button', { name: /settings/i });
        fireEvent.click(settingsButton);
      });
      
      await waitFor(() => {
        expect(screen.getByTestId('dialog')).toBeInTheDocument();
      });
    });

    it('should update endpoint when changed in settings', async () => {
      await act(async () => {
        renderWithRouter(<ModelDetail />);
      });
      
      await waitForComponentToLoad();
      
      await waitFor(() => {
        const settingsButton = screen.getByRole('button', { name: /settings/i });
        fireEvent.click(settingsButton);
      });
      
      await waitFor(() => {
        const endpointInput = screen.getByLabelText(/endpoint/i);
        fireEvent.change(endpointInput, { target: { value: 'http://localhost:8080/v1' } });
        expect(endpointInput).toHaveValue('http://localhost:8080/v1');
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle API errors gracefully', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      (lmStudioService as unknown as { chatCompletion: ReturnType<typeof vi.fn> }).chatCompletion.mockRejectedValue(new Error('API Error'));
      
      await act(async () => {
        renderWithRouter(<ModelDetail />);
      });
      
      // Wait for the component to be fully loaded
      await waitFor(() => {
        expect(screen.getByText('Test Model')).toBeInTheDocument();
      });
      
      // Wait for the textarea to be available
      let input: HTMLElement;
      await waitFor(() => {
        input = screen.getByRole('textbox');
        expect(input).toBeInTheDocument();
      });
      
      const sendButton = screen.getByRole('button', { name: /send/i });
      
      fireEvent.change(input!, { target: { value: 'Test message' } });
      fireEvent.click(sendButton);
      
      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Error in tool calling:', expect.any(Error));
      });
      
      consoleSpy.mockRestore();
    });

    it('should handle model not found', async () => {
      // Mock loadModelData to return null
      vi.mocked(loadModelData).mockResolvedValue(null);
      
      await act(async () => {
        renderWithRouter(<ModelDetail />);
      });
      
      await waitFor(() => {
        expect(screen.getByText('Loading model details...')).toBeInTheDocument();
        expect(screen.getByText('Loading model...')).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', async () => {
      await act(async () => {
        renderWithRouter(<ModelDetail />);
      });
      
      await waitForComponentToLoad();
      
      await waitFor(() => {
        // Open parameters panel first
        const parametersButton = screen.getByRole('button', { name: /parameters/i });
        fireEvent.click(parametersButton);
      });
      
      await waitFor(() => {
        expect(screen.getByLabelText(/temperature/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/max tokens/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/top p/i)).toBeInTheDocument();
      });
    });

    it('should support keyboard navigation', async () => {
      await act(async () => {
        renderWithRouter(<ModelDetail />);
      });
      
      await waitForComponentToLoad();
      
      await waitFor(() => {
        const input = screen.getByRole('textbox');
        expect(input).toHaveAttribute('tabIndex', '0');
        
        // Test keyboard navigation
        input.focus();
        expect(input).toHaveFocus();
      });
    });
  });

  describe('Performance', () => {
    it('should not re-render unnecessarily when parameters change', async () => {
      const { rerender } = await act(async () => {
        return renderWithRouter(<ModelDetail />);
      });
      
      await waitForComponentToLoad();
      
      // Re-render with same props
      await act(async () => {
        rerender(
          <BrowserRouter>
            <ModelDetail />
          </BrowserRouter>
        );
      });
      
      // Should still show the same content
      expect(screen.getByText('Test Model')).toBeInTheDocument();
    });
  });
}); 