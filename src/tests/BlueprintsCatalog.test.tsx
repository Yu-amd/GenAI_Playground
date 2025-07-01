import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import BlueprintsCatalog from '../pages/BlueprintsCatalog';

// Mock the dependencies
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    Link: ({ children, to, ...rest }: { children: React.ReactNode; to: string }) => (
      <a href={to} {...rest}>{children}</a>
    )
  };
});

// Mock the assets
vi.mock('../assets/banner_wave.png', () => ({
  default: 'mocked-banner.png'
}));

// Mock the blueprint images
vi.mock('../assets/blueprints/bp_chatqna.png', () => ({
  default: 'mocked-chatqna.png'
}));
vi.mock('../assets/blueprints/bp_agentqna.png', () => ({
  default: 'mocked-agentqna.png'
}));
vi.mock('../assets/blueprints/bp_codeTrans.png', () => ({
  default: 'mocked-codeTrans.png'
}));
vi.mock('../assets/blueprints/bp_docsum.png', () => ({
  default: 'mocked-docsum.png'
}));

// Mock the PlaygroundLogo component
vi.mock('../components/PlaygroundLogo', () => ({
  default: () => <div data-testid="playground-logo">Playground Logo</div>
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('BlueprintsCatalog Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Initial Rendering', () => {
    it('should render all blueprints', async () => {
      await act(async () => {
        renderWithRouter(<BlueprintsCatalog />);
      });

      await waitFor(() => {
        expect(screen.getByText('ChatQnA')).toBeInTheDocument();
        expect(screen.getByText('AgentQnA')).toBeInTheDocument();
        expect(screen.getByText('CodeTrans')).toBeInTheDocument();
        expect(screen.getByText('DocSum')).toBeInTheDocument();
      });
    });

    it('should display blueprint categories', async () => {
      await act(async () => {
        renderWithRouter(<BlueprintsCatalog />);
      });

      await waitFor(() => {
        expect(screen.getAllByText('Conversational AI').length).toBeGreaterThan(0);
        expect(screen.getAllByText('Multi-Agent Systems').length).toBeGreaterThan(0);
        expect(screen.getAllByText('Development Tools').length).toBeGreaterThan(0);
        expect(screen.getAllByText('Document AI').length).toBeGreaterThan(0);
      });
    });

    it('should display blueprint complexities', async () => {
      await act(async () => {
        renderWithRouter(<BlueprintsCatalog />);
      });

      await waitFor(() => {
        const intermediateElements = screen.getAllByText('Intermediate');
        const advancedElements = screen.getAllByText('Advanced');
        
        expect(intermediateElements.length).toBeGreaterThan(0);
        expect(advancedElements.length).toBeGreaterThan(0);
      });
    });

    it('should display blueprint statuses', async () => {
      await act(async () => {
        renderWithRouter(<BlueprintsCatalog />);
      });

      await waitFor(() => {
        const productionReadyElements = screen.getAllByText('Production Ready');
        const techPreviewElements = screen.getAllByText('Tech Preview');
        
        expect(productionReadyElements.length).toBeGreaterThan(0);
        expect(techPreviewElements.length).toBeGreaterThan(0);
      });
    });

    it('should display blueprint tags', async () => {
      await act(async () => {
        renderWithRouter(<BlueprintsCatalog />);
      });

      await waitFor(() => {
        expect(screen.getByText('RAG')).toBeInTheDocument();
        expect(screen.getByText('Chatbot')).toBeInTheDocument();
        expect(screen.getByText('Knowledge Base')).toBeInTheDocument();
        expect(screen.getByText('Multi-Agent')).toBeInTheDocument();
        expect(screen.getByText('Hierarchical')).toBeInTheDocument();
        expect(screen.getByText('Orchestration')).toBeInTheDocument();
        expect(screen.getByText('Code Translation')).toBeInTheDocument();
        expect(screen.getByText('Language Conversion')).toBeInTheDocument();
        expect(screen.getByText('Transpilation')).toBeInTheDocument();
        expect(screen.getByText('Documentation')).toBeInTheDocument();
        expect(screen.getByText('Technical Writing')).toBeInTheDocument();
        expect(screen.getByText('API Docs')).toBeInTheDocument();
      });
    });

    it('should display blueprint descriptions', async () => {
      await act(async () => {
        renderWithRouter(<BlueprintsCatalog />);
      });

      await waitFor(() => {
        expect(screen.getByText('RAG-based chatbot for knowledge base interactions with advanced retrieval capabilities.')).toBeInTheDocument();
        expect(screen.getByText('Multi-agent orchestration system for complex question-answering workflows.')).toBeInTheDocument();
        expect(screen.getByText('Cross-language code translation and transpilation with syntax preservation.')).toBeInTheDocument();
        expect(screen.getByText('Summarize technical documentation and extract key insights from code comments and API docs.')).toBeInTheDocument();
      });
    });
  });

  describe('Badge Display', () => {
    it('should display Featured badge for ChatQnA', async () => {
      await act(async () => {
        renderWithRouter(<BlueprintsCatalog />);
      });

      await waitFor(() => {
        const featuredBadge = screen.getByText('Featured');
        expect(featuredBadge).toBeInTheDocument();
        expect(featuredBadge).toHaveClass('bg-blue-600');
      });
    });

    it('should display New badge for AgentQnA', async () => {
      await act(async () => {
        renderWithRouter(<BlueprintsCatalog />);
      });

      await waitFor(() => {
        const newBadges = screen.getAllByText('New');
        expect(newBadges.length).toBe(1);
        newBadges.forEach(badge => {
          expect(badge).toHaveClass('bg-green-600');
        });
      });
    });

    it('should not display badge for blueprints without badges', async () => {
      await act(async () => {
        renderWithRouter(<BlueprintsCatalog />);
      });

      await waitFor(() => {
        // CodeTrans and DocSum have no badges
        const codetransCard = screen.getByText('CodeTrans').closest('a');
        const docsumCard = screen.getByText('DocSum').closest('a');
        expect(codetransCard).not.toHaveTextContent('Featured');
        expect(codetransCard).not.toHaveTextContent('New');
        expect(docsumCard).not.toHaveTextContent('Featured');
        expect(docsumCard).not.toHaveTextContent('New');
      });
    });
  });

  describe('Navigation', () => {
    it('should render navigation links', async () => {
      await act(async () => {
        renderWithRouter(<BlueprintsCatalog />);
      });

      await waitFor(() => {
        expect(screen.getByText('Models')).toBeInTheDocument();
        expect(screen.getByText('Blueprints')).toBeInTheDocument();
        expect(screen.getByText('GPU Clouds')).toBeInTheDocument();
      });
    });

    it('should have correct navigation links', async () => {
      await act(async () => {
        renderWithRouter(<BlueprintsCatalog />);
      });

      await waitFor(() => {
        const modelsLink = screen.getByText('Models').closest('a');
        const blueprintsLink = screen.getByText('Blueprints').closest('a');
        const gpuCloudsLink = screen.getByText('GPU Clouds').closest('a');

        expect(modelsLink).toHaveAttribute('href', '/models');
        expect(blueprintsLink).toHaveAttribute('href', '/blueprints');
        expect(gpuCloudsLink).toHaveAttribute('href', '/gpu-cloud');
      });
    });

    it('should have correct blueprint detail links', async () => {
      await act(async () => {
        renderWithRouter(<BlueprintsCatalog />);
      });

      await waitFor(() => {
        const chatqnaLink = screen.getByText('ChatQnA').closest('a');
        const agentqnaLink = screen.getByText('AgentQnA').closest('a');
        const codetransLink = screen.getByText('CodeTrans').closest('a');
        const docsumLink = screen.getByText('DocSum').closest('a');

        expect(chatqnaLink).toHaveAttribute('href', '/blueprints/chatqna');
        expect(agentqnaLink).toHaveAttribute('href', '/blueprints/agentqna');
        expect(codetransLink).toHaveAttribute('href', '/blueprints/codetrans');
        expect(docsumLink).toHaveAttribute('href', '/blueprints/docsum');
      });
    });
  });

  describe('Card Layout', () => {
    it('should render cards in horizontal layout', async () => {
      await act(async () => {
        renderWithRouter(<BlueprintsCatalog />);
      });

      await waitFor(() => {
        const cards = screen.getAllByRole('link').filter(link => 
          link.getAttribute('href')?.startsWith('/blueprints/')
        );
        expect(cards.length).toBe(4); // All 4 blueprints
      });
    });

    it('should have proper card styling', async () => {
      await act(async () => {
        renderWithRouter(<BlueprintsCatalog />);
      });

      await waitFor(() => {
        const chatqnaCard = screen.getByText('ChatQnA').closest('a');
        expect(chatqnaCard).toHaveClass('bg-white/10', 'backdrop-blur-md', 'border', 'border-white/20', 'rounded-2xl');
      });
    });

    it('should have hover effects', async () => {
      await act(async () => {
        renderWithRouter(<BlueprintsCatalog />);
      });

      await waitFor(() => {
        const chatqnaCard = screen.getByText('ChatQnA').closest('a');
        expect(chatqnaCard).toHaveClass('hover:bg-white/20', 'hover:shadow-2xl', 'hover:shadow-white/30', 'hover:-translate-y-1');
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', async () => {
      await act(async () => {
        renderWithRouter(<BlueprintsCatalog />);
      });

      await waitFor(() => {
        const chatqnaCard = screen.getByText('ChatQnA').closest('a');
        expect(chatqnaCard).toHaveAttribute('title', 'open in playground');
      });
    });

    it('should have proper heading structure', async () => {
      await act(async () => {
        renderWithRouter(<BlueprintsCatalog />);
      });

      await waitFor(() => {
        const headings = screen.getAllByRole('heading');
        expect(headings.length).toBeGreaterThan(0);
      });
    });
  });
}); 