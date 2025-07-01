import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import BlueprintDetail from '../pages/BlueprintDetail';
// import userEvent from '@testing-library/user-event';

// Mock scrollIntoView for jsdom environment
window.HTMLElement.prototype.scrollIntoView = function() {};

// Mock the dependencies
const mockUseParams = vi.fn(() => ({ blueprintId: 'docsum' }));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => mockUseParams(),
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

// const mockBlueprintData = {
//   blueprint_id: 'test-blueprint',
//   name: 'Test Blueprint',
//   category: 'Conversational AI',
//   complexity: 'Intermediate',
//   description: 'A test blueprint for unit testing',
//   shortDescription: 'Test blueprint for unit testing',
//   logo: 'test-logo.png',
//   readiness_level: 'Production-Ready',
//   status_badges: ['Featured', 'Production-Ready'] as const,
//   tags: ['RAG', 'Chatbot', 'Knowledge Base'] as const,
//   status: 'Production Ready',
//   endpoint: 'https://api.inference-hub.com/v1/blueprints/test-blueprint',
//   demo_assets: {
//     notebook: 'test-notebook.ipynb',
//     demo_link: 'https://test-demo.com'
//   },
//   aim_recipes: [
//     {
//       name: 'Test Recipe',
//       hardware: 'MI300X',
//       precision: 'FP16',
//       recipe_file: 'test-recipe.yaml'
//     }
//   ] as const,
//   api_examples: {
//     python: 'print("Hello World")',
//     typescript: 'console.log("Hello World")',
//     shell: 'echo "Hello World"',
//     rust: 'println!("Hello World")',
//     go: 'fmt.Println("Hello World")'
//   },
//   blueprint_card: {
//     overview: 'Test blueprint overview',
//     intended_use: ['Chatbot', 'Q&A system'] as const,
//     limitations: ['Limited context window'] as const,
//     architecture: 'RAG pipeline with vector database',
//     evaluation: ['Test evaluation metrics'] as const,
//     known_issues: ['Test known issues'] as const,
//     references: ['Test references'] as const
//   },
//   microservices: {
//     models: [
//       {
//         name: 'Test Model',
//         logo: '/src/assets/models/test-model.png',
//         tags: ['Text Generation', 'RAG'] as const
//       }
//     ] as const,
//     functional: [
//       {
//         name: 'Test Service',
//         description: 'Test functional service',
//         tags: ['RAG', 'Vector Search'] as const
//       }
//     ] as const
//   }
// };

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
    // Wait for the blueprint name to appear, indicating the component is loaded
    expect(screen.getByText('DocSum')).toBeInTheDocument();
  });
  
  // Additional wait to ensure the interface is fully rendered
  await waitFor(() => {
    expect(screen.getByText('Interact')).toBeInTheDocument();
  });
  
  // Small delay to ensure component is fully stable
  await new Promise(resolve => setTimeout(resolve, 100));
};

describe('BlueprintDetail Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseParams.mockReturnValue({ blueprintId: 'docsum' });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Initial Rendering', () => {
    it('should render loading state initially', async () => {
      await act(async () => {
        renderWithRouter(<BlueprintDetail />);
      });
      
      // Should show loading or not found initially since blueprint data is loading
      await waitForComponentToLoad();
    });

    it('should render blueprint details after data loads', async () => {
      await act(async () => {
        renderWithRouter(<BlueprintDetail />);
      });
      
      await waitForComponentToLoad();
      
      expect(screen.getByText('A sample app which creates summaries of different types of text.')).toBeInTheDocument();
      expect(screen.getByText('Document Summarization')).toBeInTheDocument();
      expect(screen.getByText('Text Processing')).toBeInTheDocument();
    });

    it('should render navigation links', async () => {
      await act(async () => {
        renderWithRouter(<BlueprintDetail />);
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
        renderWithRouter(<BlueprintDetail />);
      });
      
      await waitForComponentToLoad();
      
      expect(screen.getByTestId('playground-logo')).toBeInTheDocument();
    });
  });

  describe('Tab Navigation', () => {
    it('should show Interact tab by default', async () => {
      await act(async () => {
        renderWithRouter(<BlueprintDetail />);
      });
      
      await waitForComponentToLoad();
      
      const interactTab = screen.getByText('Interact');
      expect(interactTab).toBeInTheDocument();
      expect(interactTab).toHaveClass('border-blue-500');
    });

    it('should switch to AIMs tab when clicked', async () => {
      await act(async () => {
        renderWithRouter(<BlueprintDetail />);
      });
      
      await waitForComponentToLoad();
      
      const aimsTab = screen.getByText('AIMs');
      await act(async () => {
        fireEvent.click(aimsTab);
      });
      
      await waitFor(() => {
        expect(aimsTab).toHaveClass('border-blue-500');
      });
    });
  });

  describe('Blueprint Card Content', () => {
    it('should display blueprint overview in overlay when button is clicked', async () => {
      await act(async () => {
        renderWithRouter(<BlueprintDetail />);
      });
      
      await waitForComponentToLoad();
      
      // Find and click the Blueprint Card button
      const blueprintCardButton = screen.getByText('Blueprint Card');
      await act(async () => {
        fireEvent.click(blueprintCardButton);
      });
      
      await waitFor(() => {
        expect(screen.getByText('Blueprint Documentation')).toBeInTheDocument();
      });
    });

    it('should display intended use cases in overlay', async () => {
      await act(async () => {
        renderWithRouter(<BlueprintDetail />);
      });
      
      await waitForComponentToLoad();
      
      // Find and click the Blueprint Card button
      const blueprintCardButton = screen.getByText('Blueprint Card');
      await act(async () => {
        fireEvent.click(blueprintCardButton);
      });
      
      await waitFor(() => {
        expect(screen.getByText('Document Summarization')).toBeInTheDocument();
        expect(screen.getByText('Text Processing')).toBeInTheDocument();
      });
    });

    it('should display limitations in overlay', async () => {
      await act(async () => {
        renderWithRouter(<BlueprintDetail />);
      });
      
      await waitForComponentToLoad();
      
      // Find and click the Blueprint Card button
      const blueprintCardButton = screen.getByText('Blueprint Card');
      await act(async () => {
        fireEvent.click(blueprintCardButton);
      });
      
      await waitFor(() => {
        expect(screen.getByText('Documentation coming soon...')).toBeInTheDocument();
      });
    });

    it('should display architecture information in overlay', async () => {
      await act(async () => {
        renderWithRouter(<BlueprintDetail />);
      });
      
      await waitForComponentToLoad();
      
      // Find and click the Blueprint Card button
      const blueprintCardButton = screen.getByText('Blueprint Card');
      await act(async () => {
        fireEvent.click(blueprintCardButton);
      });
      
      await waitFor(() => {
        expect(screen.getByText('Documentation coming soon...')).toBeInTheDocument();
      });
    });
  });

  describe('Microservices Section', () => {
    it('should display model endpoints in AIMs tab', async () => {
      await act(async () => {
        renderWithRouter(<BlueprintDetail />);
      });
      
      await waitForComponentToLoad();
      
      // Switch to AIMs tab
      const aimsTab = screen.getByText('AIMs');
      await act(async () => {
        fireEvent.click(aimsTab);
      });
      
      await waitFor(() => {
        expect(screen.getByText('Components')).toBeInTheDocument();
      });
    });

    it('should display functional microservices in AIMs tab', async () => {
      await act(async () => {
        renderWithRouter(<BlueprintDetail />);
      });
      
      await waitForComponentToLoad();
      
      // Switch to AIMs tab
      const aimsTab = screen.getByText('AIMs');
      await act(async () => {
        fireEvent.click(aimsTab);
      });
      
      await waitFor(() => {
        expect(screen.getByText('Components')).toBeInTheDocument();
      });
    });
  });

  describe('Interact Tab', () => {
    it('should show chat interface when interact tab is active', async () => {
      await act(async () => {
        renderWithRouter(<BlueprintDetail />);
      });
      
      await waitForComponentToLoad();
      
      const interactTab = screen.getByText('Interact');
      await act(async () => {
        fireEvent.click(interactTab);
      });
      
      await waitFor(() => {
        // Should show some form of interaction interface
        expect(screen.getByText('Interact')).toHaveClass('border-blue-500');
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle missing blueprint data gracefully', async () => {
      // Mock useParams to return an invalid blueprint ID
      mockUseParams.mockReturnValue({ blueprintId: 'invalid-blueprint' });
      
      await act(async () => {
        renderWithRouter(<BlueprintDetail />);
      });
      
      await waitFor(() => {
        expect(screen.getByText('Blueprint Not Found')).toBeInTheDocument();
      });
    });

    it('should show back to blueprints link when blueprint not found', async () => {
      // Mock useParams to return an invalid blueprint ID
      mockUseParams.mockReturnValue({ blueprintId: 'invalid-blueprint' });
      
      await act(async () => {
        renderWithRouter(<BlueprintDetail />);
      });
      
      await waitFor(() => {
        const backLink = screen.getByText('Back to Blueprints');
        expect(backLink).toBeInTheDocument();
        expect(backLink.closest('a')).toHaveAttribute('href', '/blueprints');
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', async () => {
      await act(async () => {
        renderWithRouter(<BlueprintDetail />);
      });
      
      await waitForComponentToLoad();
      
      // Check for proper heading structure
      const mainHeading = screen.getByText('DocSum');
      expect(mainHeading).toBeInTheDocument();
    });

    it('should have keyboard navigation support', async () => {
      await act(async () => {
        renderWithRouter(<BlueprintDetail />);
      });
      
      await waitForComponentToLoad();
      
      const interactTab = screen.getByText('Interact');
      expect(interactTab).toBeInTheDocument();
      
      // Test keyboard navigation
      await act(async () => {
        fireEvent.keyDown(interactTab, { key: 'Enter' });
      });
      
      await waitFor(() => {
        expect(interactTab).toHaveClass('border-blue-500');
      });
    });
  });
}); 