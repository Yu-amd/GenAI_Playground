import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
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

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('ModelDetail Component - Simple Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (loadModelData as any).mockResolvedValue(mockModelData);
    (lmStudioService as any).chatCompletion = vi.fn().mockResolvedValue({
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
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render model details after data loads', async () => {
    await act(async () => {
      renderWithRouter(<ModelDetail />);
    });
    
    await waitFor(() => {
      expect(screen.getByText('Test Model')).toBeInTheDocument();
    });
    
    expect(screen.getByText('A test model for unit testing')).toBeInTheDocument();
  });

  it('should render navigation links', async () => {
    await act(async () => {
      renderWithRouter(<ModelDetail />);
    });
    
    await waitFor(() => {
      expect(screen.getByText('Models')).toBeInTheDocument();
      expect(screen.getByText('Blueprints')).toBeInTheDocument();
      expect(screen.getByText('GPU Clouds')).toBeInTheDocument();
    });
  });

  it('should handle model not found', async () => {
    (loadModelData as any).mockResolvedValue(null);
    
    await act(async () => {
      renderWithRouter(<ModelDetail />);
    });
    
    await waitFor(() => {
      expect(screen.getByText('Model Not Found')).toBeInTheDocument();
      expect(screen.getByText(/Back to Models/)).toBeInTheDocument();
    });
  });
}); 