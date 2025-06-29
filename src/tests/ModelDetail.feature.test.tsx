import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import ModelDetail from '../pages/ModelDetail';
import { lmStudioService } from '../services/lmStudioService';
import { loadModelData } from '../utils/modelLoader';

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
  Highlight: ({ children }: { children: (props: any) => React.ReactNode }) => 
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

describe('ModelDetail Feature Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (loadModelData as any).mockResolvedValue(mockModelData);
    (lmStudioService as any).chatCompletion = vi.fn().mockResolvedValue(mockChatResponse);
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  // 1. Basic Rendering
  it('renders model details and logo', async () => {
    await act(async () => {
      renderWithRouter(<ModelDetail />);
    });
    await waitFor(() => {
      expect(screen.getByText('Test Model')).toBeInTheDocument();
      expect(screen.getByTestId('playground-logo')).toBeInTheDocument();
    });
  });

  // 2. Navigation Links
  it('renders navigation links', async () => {
    await act(async () => {
      renderWithRouter(<ModelDetail />);
    });
    await waitFor(() => {
      expect(screen.getByText('Models')).toBeInTheDocument();
      expect(screen.getByText('Blueprints')).toBeInTheDocument();
      expect(screen.getByText('GPU Clouds')).toBeInTheDocument();
    });
  });

  // 3. Model Card Modal
  it('opens model card modal when button is clicked', async () => {
    await act(async () => {
      renderWithRouter(<ModelDetail />);
    });
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

  // 4. Chat Interface
  it('allows user to type and send a message', async () => {
    await act(async () => {
      renderWithRouter(<ModelDetail />);
    });
    await waitFor(() => {
      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
    });
    const input = screen.getByRole('textbox');
    const sendButton = screen.getByRole('button', { name: /send/i });
    fireEvent.change(input, { target: { value: 'Hello, model!' } });
    expect(input).toHaveValue('Hello, model!');
    fireEvent.click(sendButton);
    await waitFor(() => {
      expect(screen.getByText('Hello, model!')).toBeInTheDocument();
      expect(screen.getByText('This is a test response from the model.')).toBeInTheDocument();
    });
  });

  // 5. Parameter Panel
  it('shows and updates parameter panel', async () => {
    await act(async () => {
      renderWithRouter(<ModelDetail />);
    });
    await waitFor(() => {
      const parametersButton = screen.getByRole('button', { name: /parameters/i });
      fireEvent.click(parametersButton);
    });
    await waitFor(() => {
      expect(screen.getByText('Temperature')).toBeInTheDocument();
      const temperatureSlider = screen.getByLabelText(/temperature/i);
      fireEvent.change(temperatureSlider, { target: { value: '0.5' } });
      expect(temperatureSlider).toHaveValue('0.5');
    });
  });

  // 6. Code Generation
  it('renders code generation panel and copies code', async () => {
    await act(async () => {
      renderWithRouter(<ModelDetail />);
    });
    await waitFor(() => {
      expect(screen.getByText('API Integration')).toBeInTheDocument();
      const copyButton = screen.getByRole('button', { name: /copy code/i });
      fireEvent.click(copyButton);
    });
    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('mocked-code-content');
    });
  });

  // 7. Tool Calling
  it('enables tool calling and includes tools in API call', async () => {
    await act(async () => {
      renderWithRouter(<ModelDetail />);
    });
    await waitFor(() => {
      const toolCallingToggle = screen.getByRole('checkbox', { name: /enable tool calling/i });
      fireEvent.click(toolCallingToggle);
      expect(toolCallingToggle).toBeChecked();
      const input = screen.getByRole('textbox');
      const sendButton = screen.getByRole('button', { name: /send/i });
      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.click(sendButton);
    });
    await waitFor(() => {
      expect(lmStudioService.chatCompletion).toHaveBeenCalledWith(
        expect.objectContaining({
          tools: expect.arrayContaining([
            expect.objectContaining({ name: 'get_weather' }),
            expect.objectContaining({ name: 'search_web' })
          ])
        }),
        expect.any(Function)
      );
    });
  });

  // 8. Settings Modal
  it('opens settings modal and updates endpoint', async () => {
    await act(async () => {
      renderWithRouter(<ModelDetail />);
    });
    await waitFor(() => {
      const settingsButton = screen.getByTitle('Settings');
      fireEvent.click(settingsButton);
    });
    await waitFor(() => {
      expect(screen.getByTestId('dialog')).toBeInTheDocument();
      const endpointInput = screen.getByLabelText(/endpoint/i);
      fireEvent.change(endpointInput, { target: { value: 'http://localhost:8080/v1' } });
      expect(endpointInput).toHaveValue('http://localhost:8080/v1');
    });
  });

  // 9. Error Handling
  it('handles API errors gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    (lmStudioService as any).chatCompletion.mockRejectedValue(new Error('API Error'));
    await act(async () => {
      renderWithRouter(<ModelDetail />);
    });
    await waitFor(() => {
      const input = screen.getByRole('textbox');
      const sendButton = screen.getByRole('button', { name: /send/i });
      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.click(sendButton);
    });
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Error in handleSendMessage:', expect.any(Error));
    });
    consoleSpy.mockRestore();
  });

  // 10. Accessibility
  it('has proper ARIA labels and supports keyboard navigation', async () => {
    await act(async () => {
      renderWithRouter(<ModelDetail />);
    });
    await waitFor(() => {
      const parametersButton = screen.getByRole('button', { name: /parameters/i });
      fireEvent.click(parametersButton);
    });
    await waitFor(() => {
      expect(screen.getByLabelText(/temperature/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/max tokens/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/top p/i)).toBeInTheDocument();
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('tabIndex', '0');
    });
  });
}); 