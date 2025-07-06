import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import GPUCloud from '../pages/GPUCloud';

// Mock the dependencies
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    Link: ({
      children,
      to,
      ...rest
    }: {
      children: React.ReactNode;
      to: string;
    }) => (
      <a href={to} {...rest}>
        {children}
      </a>
    ),
  };
});

// Mock the assets
vi.mock('../assets/banner_wave.png', () => ({
  default: 'mocked-banner.png',
}));

// Mock the PlaygroundLogo component
vi.mock('../components/PlaygroundLogo', () => ({
  default: () => <div data-testid='playground-logo'>Playground Logo</div>,
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('GPUCloud Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock scrollIntoView
    Element.prototype.scrollIntoView = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Initial Rendering', () => {
    it('should render the main page title and description', async () => {
      await act(async () => {
        renderWithRouter(<GPUCloud />);
      });

      await waitFor(() => {
        // Use getAllByText since there might be multiple instances
        const titles = screen.getAllByText('AMD Instinct™ GPU Cloud Access');
        expect(titles.length).toBeGreaterThan(0);
        expect(screen.getByText(/From experimentation to enterprise deployment/)).toBeInTheDocument();
      });
    });

    it('should render the navigation menu', async () => {
      await act(async () => {
        renderWithRouter(<GPUCloud />);
      });

      await waitFor(() => {
        expect(screen.getByText('Models')).toBeInTheDocument();
        expect(screen.getByText('Blueprints')).toBeInTheDocument();
        expect(screen.getByText('GPU Clouds')).toBeInTheDocument();
      });
    });

    it('should render the deploy button', async () => {
      await act(async () => {
        renderWithRouter(<GPUCloud />);
      });

      await waitFor(() => {
        expect(screen.getByText('Deploy to Any Cloud Provider')).toBeInTheDocument();
        expect(screen.getByText('Coming Soon')).toBeInTheDocument();
      });
    });
  });

  describe('Path to Production Section', () => {
    it('should render the Path to Production section', async () => {
      await act(async () => {
        renderWithRouter(<GPUCloud />);
      });

      await waitFor(() => {
        expect(screen.getByText('Path to Production')).toBeInTheDocument();
        expect(screen.getByText(/Enables developers to learn and validate/)).toBeInTheDocument();
      });
    });

    it('should render all four path cards', async () => {
      await act(async () => {
        renderWithRouter(<GPUCloud />);
      });

      await waitFor(() => {
        expect(screen.getByText('Developer Cloud')).toBeInTheDocument();
        expect(screen.getByText('Public Cloud')).toBeInTheDocument();
        expect(screen.getByText('On-Premises')).toBeInTheDocument();
        // Use getAllByText since there might be multiple instances
        const enterpriseProductionElements = screen.getAllByText('Enterprise Production');
        expect(enterpriseProductionElements.length).toBeGreaterThan(0);
      });
    });

    it('should display path card descriptions', async () => {
      await act(async () => {
        renderWithRouter(<GPUCloud />);
      });

      await waitFor(() => {
        expect(screen.getByText(/Get hands-on experience with ROCm/)).toBeInTheDocument();
        expect(screen.getByText(/Deploy to major cloud providers/)).toBeInTheDocument();
        expect(screen.getByText(/Reference architecture for AMD Instinct/)).toBeInTheDocument();
        expect(screen.getByText(/Comprehensive guidance for production/)).toBeInTheDocument();
      });
    });

    it('should display path card features', async () => {
      await act(async () => {
        renderWithRouter(<GPUCloud />);
      });

      await waitFor(() => {
        expect(screen.getByText('• MI300X & MI250X Instances')).toBeInTheDocument();
        expect(screen.getByText('• Pre-configured ROCm Environment')).toBeInTheDocument();
        expect(screen.getByText('• Vultr MI300X/MI325X')).toBeInTheDocument();
        expect(screen.getByText('• Oracle Cloud MI300X')).toBeInTheDocument();
        expect(screen.getByText('• Cluster Architecture Design')).toBeInTheDocument();
        expect(screen.getByText('• Bare-metal & Virtualization')).toBeInTheDocument();
        expect(screen.getByText('• Model Optimization & Performance')).toBeInTheDocument();
        expect(screen.getByText('• Deployment & Orchestration')).toBeInTheDocument();
      });
    });
  });

  describe('Availability Legend', () => {
    it('should render the availability legend', async () => {
      await act(async () => {
        renderWithRouter(<GPUCloud />);
      });

      await waitFor(() => {
        // Use getAllByText since there might be multiple instances
        const highElements = screen.getAllByText('High');
        expect(highElements.length).toBeGreaterThan(0);
        const mediumElements = screen.getAllByText('Medium');
        expect(mediumElements.length).toBeGreaterThan(0);
        const lowElements = screen.getAllByText('Low');
        expect(lowElements.length).toBeGreaterThan(0);
        expect(screen.getByText('- Readily available')).toBeInTheDocument();
        expect(screen.getByText('- Limited availability')).toBeInTheDocument();
        expect(screen.getByText('- Waitlist or restricted')).toBeInTheDocument();
      });
    });
  });

  describe('AMD Developer Cloud Section', () => {
    it('should render the AMD Developer Cloud section', async () => {
      await act(async () => {
        renderWithRouter(<GPUCloud />);
      });

      await waitFor(() => {
        expect(screen.getByText('AMD Developer Cloud')).toBeInTheDocument();
        expect(screen.getByText(/Gain hands-on experience with a variety of workloads/)).toBeInTheDocument();
      });
    });

    it('should display AMD Developer Cloud features', async () => {
      await act(async () => {
        renderWithRouter(<GPUCloud />);
      });

      await waitFor(() => {
        expect(screen.getByText('Hands-on ROCm Software Stack Experience')).toBeInTheDocument();
        expect(screen.getByText('MI300X Instances Available')).toBeInTheDocument();
        expect(screen.getByText('Pre-configured ROCm Environment')).toBeInTheDocument();
        expect(screen.getByText('Highly Competitive Pricing')).toBeInTheDocument();
        expect(screen.getByText('24/7 Developer Support')).toBeInTheDocument();
        // Use getAllByText since there might be multiple instances
        const globalDataCentersElements = screen.getAllByText('Global Data Centers');
        expect(globalDataCentersElements.length).toBeGreaterThan(0);
      });
    });

    it('should display AMD Developer Cloud pricing', async () => {
      await act(async () => {
        renderWithRouter(<GPUCloud />);
      });

      await waitFor(() => {
        expect(screen.getByText('$0.95/hour')).toBeInTheDocument();
      });
    });

    it('should display AMD Developer Cloud regions', async () => {
      await act(async () => {
        renderWithRouter(<GPUCloud />);
      });

      await waitFor(() => {
        expect(screen.getByText('US East')).toBeInTheDocument();
        expect(screen.getByText('US West')).toBeInTheDocument();
        expect(screen.getByText('Europe')).toBeInTheDocument();
        expect(screen.getByText('Asia Pacific')).toBeInTheDocument();
      });
    });

    it('should have a working Start Learning link', async () => {
      await act(async () => {
        renderWithRouter(<GPUCloud />);
      });

      await waitFor(() => {
        // Find the link specifically in the AMD Developer Cloud section
        const link = screen.getByRole('link', { name: /Start Learning/i });
        expect(link).toHaveAttribute('href', '/gpu-cloud/amd-developer-cloud');
      });
    });
  });

  describe('Public Cloud Providers Section', () => {
    it('should render the public cloud providers section', async () => {
      await act(async () => {
        renderWithRouter(<GPUCloud />);
      });

      await waitFor(() => {
        expect(screen.getByText('Public Cloud Providers')).toBeInTheDocument();
        expect(screen.getByText(/Deploy to major cloud providers/)).toBeInTheDocument();
      });
    });

    it('should display Vultr cloud provider', async () => {
      await act(async () => {
        renderWithRouter(<GPUCloud />);
      });

      await waitFor(() => {
        expect(screen.getByText('Vultr')).toBeInTheDocument();
        expect(screen.getByText(/Offers AMD Instinct™ MI325X and MI300X GPUs/)).toBeInTheDocument();
      });
    });

    it('should display Oracle Cloud provider', async () => {
      await act(async () => {
        renderWithRouter(<GPUCloud />);
      });

      await waitFor(() => {
        expect(screen.getByText('Oracle Cloud Infrastructure')).toBeInTheDocument();
        expect(screen.getByText(/Provides AMD Instinct™ MI300X GPUs/)).toBeInTheDocument();
      });
    });

    it('should display Microsoft Azure provider', async () => {
      await act(async () => {
        renderWithRouter(<GPUCloud />);
      });

      await waitFor(() => {
        expect(screen.getByText('Microsoft Azure')).toBeInTheDocument();
        expect(screen.getByText(/Offers virtual machines featuring AMD Instinct/)).toBeInTheDocument();
      });
    });

    it('should display Hot Aisle provider', async () => {
      await act(async () => {
        renderWithRouter(<GPUCloud />);
      });

      await waitFor(() => {
        expect(screen.getByText('Hot Aisle')).toBeInTheDocument();
        expect(screen.getByText(/A NeoCloud service provider offering/)).toBeInTheDocument();
      });
    });

    it('should display TensorWave provider', async () => {
      await act(async () => {
        renderWithRouter(<GPUCloud />);
      });

      await waitFor(() => {
        expect(screen.getByText('TensorWave')).toBeInTheDocument();
        expect(screen.getByText(/Leverages the next generation of AMD accelerators/)).toBeInTheDocument();
      });
    });
  });

  describe('On-Premises Deployment Section', () => {
    it('should render the On-Premises deployment section', async () => {
      await act(async () => {
        renderWithRouter(<GPUCloud />);
      });

      await waitFor(() => {
        expect(screen.getByText('On-premises Deployment')).toBeInTheDocument();
        expect(screen.getByText(/Comprehensive reference architecture for deploying/)).toBeInTheDocument();
      });
    });

    it('should display architecture components', async () => {
      await act(async () => {
        renderWithRouter(<GPUCloud />);
      });

      await waitFor(() => {
        expect(screen.getByText('AMD Instinct™ GPU Cluster Design')).toBeInTheDocument();
        expect(screen.getByText('Bare-metal Infrastructure Stack')).toBeInTheDocument();
        expect(screen.getByText('Virtualization Layer (KVM/VMware)')).toBeInTheDocument();
        expect(screen.getByText('ROCm Software Stack Integration')).toBeInTheDocument();
      });
    });

    it('should display supported GPU models', async () => {
      await act(async () => {
        renderWithRouter(<GPUCloud />);
      });

      await waitFor(() => {
        expect(screen.getByText('MI300X')).toBeInTheDocument();
        expect(screen.getByText('MI250X')).toBeInTheDocument();
        expect(screen.getByText('MI210')).toBeInTheDocument();
        expect(screen.getByText('MI100')).toBeInTheDocument();
      });
    });

    it('should display whitepaper contents', async () => {
      await act(async () => {
        renderWithRouter(<GPUCloud />);
      });

      await waitFor(() => {
        expect(screen.getByText('Cluster Architecture Design')).toBeInTheDocument();
        expect(screen.getByText('Bare-metal vs Virtualization Comparison')).toBeInTheDocument();
        expect(screen.getByText('Software Stack Recommendations')).toBeInTheDocument();
        expect(screen.getByText('Performance Optimization Guide')).toBeInTheDocument();
      });
    });

    it('should display implementation timeline', async () => {
      await act(async () => {
        renderWithRouter(<GPUCloud />);
      });

      await waitFor(() => {
        expect(screen.getByText('• Architecture Planning: 1-2 weeks')).toBeInTheDocument();
        expect(screen.getByText('• Hardware Procurement: 4-8 weeks')).toBeInTheDocument();
        expect(screen.getByText('• Cluster Deployment: 2-4 weeks')).toBeInTheDocument();
        expect(screen.getByText('Total: 7-14 weeks')).toBeInTheDocument();
      });
    });

    it('should have a download whitepaper button', async () => {
      await act(async () => {
        renderWithRouter(<GPUCloud />);
      });

      await waitFor(() => {
        // Use getAllByText since there might be multiple instances
        const downloadButtons = screen.getAllByText('Download Whitepaper');
        expect(downloadButtons.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Enterprise Production Section', () => {
    it('should render the Enterprise Production section', async () => {
      await act(async () => {
        renderWithRouter(<GPUCloud />);
      });

      await waitFor(() => {
        // Use getAllByText since there might be multiple instances
        const enterpriseProductionElements = screen.getAllByText('Enterprise Production');
        expect(enterpriseProductionElements.length).toBeGreaterThan(0);
        expect(screen.getByText(/Many large enterprises trust AMD Instinct™ clusters/)).toBeInTheDocument();
      });
    });

    it('should display Production Guidance title', async () => {
      await act(async () => {
        renderWithRouter(<GPUCloud />);
      });

      await waitFor(() => {
        expect(screen.getByText('Production Guidance')).toBeInTheDocument();
      });
    });

    it('should display model optimization features', async () => {
      await act(async () => {
        renderWithRouter(<GPUCloud />);
      });

      await waitFor(() => {
        expect(screen.getByText('Model Quantization & Pruning')).toBeInTheDocument();
        expect(screen.getByText('AMD ROCm Performance Tuning')).toBeInTheDocument();
        expect(screen.getByText('Batch Processing Optimization')).toBeInTheDocument();
        expect(screen.getByText('Memory & GPU Utilization')).toBeInTheDocument();
        expect(screen.getByText('Inference Latency Optimization')).toBeInTheDocument();
        expect(screen.getByText('Throughput Maximization')).toBeInTheDocument();
      });
    });

    it('should display deployment and orchestration tools', async () => {
      await act(async () => {
        renderWithRouter(<GPUCloud />);
      });

      await waitFor(() => {
        expect(screen.getByText('Kubernetes')).toBeInTheDocument();
        expect(screen.getByText('Docker')).toBeInTheDocument();
        expect(screen.getByText('CI/CD')).toBeInTheDocument();
        expect(screen.getByText('Auto-scaling')).toBeInTheDocument();
      });
    });

    it('should display security and compliance description', async () => {
      await act(async () => {
        renderWithRouter(<GPUCloud />);
      });

      await waitFor(() => {
        expect(screen.getByText(/Comprehensive security and compliance guidance/)).toBeInTheDocument();
      });
    });

    it('should display lifecycle and governance features', async () => {
      await act(async () => {
        renderWithRouter(<GPUCloud />);
      });

      await waitFor(() => {
        expect(screen.getByText('• Model Versioning & Tracking')).toBeInTheDocument();
        expect(screen.getByText('• A/B Testing & Monitoring')).toBeInTheDocument();
        expect(screen.getByText('• Cost Management')).toBeInTheDocument();
        expect(screen.getByText('End-to-end governance')).toBeInTheDocument();
      });
    });

    it('should display enterprise proven section', async () => {
      await act(async () => {
        renderWithRouter(<GPUCloud />);
      });

      await waitFor(() => {
        expect(screen.getByText('Enterprise Proven')).toBeInTheDocument();
      });
    });

    it('should display enterprise logos', async () => {
      await act(async () => {
        renderWithRouter(<GPUCloud />);
      });

      await waitFor(() => {
        expect(screen.getByText('MICROSOFT')).toBeInTheDocument();
        expect(screen.getByText('NETFLIX')).toBeInTheDocument();
        expect(screen.getByText('JPMORGAN')).toBeInTheDocument();
        expect(screen.getByText('PFIZER')).toBeInTheDocument();
        expect(screen.getByText('NASA')).toBeInTheDocument();
      });
    });

    it('should have a contact enterprise sales button', async () => {
      await act(async () => {
        renderWithRouter(<GPUCloud />);
      });

      await waitFor(() => {
        expect(screen.getByText('Contact Enterprise Sales')).toBeInTheDocument();
      });
    });
  });

  describe('Navigation and Interaction', () => {
    it('should have working navigation links', async () => {
      await act(async () => {
        renderWithRouter(<GPUCloud />);
      });

      await waitFor(() => {
        const modelsLink = screen.getByText('Models');
        const blueprintsLink = screen.getByText('Blueprints');
        const gpuCloudsLink = screen.getByText('GPU Clouds');

        expect(modelsLink.closest('a')).toHaveAttribute('href', '/models');
        expect(blueprintsLink.closest('a')).toHaveAttribute('href', '/blueprints');
        expect(gpuCloudsLink.closest('a')).toHaveAttribute('href', '/gpu-cloud');
      });
    });

    it('should have working path card buttons', async () => {
      await act(async () => {
        renderWithRouter(<GPUCloud />);
      });

      await waitFor(() => {
        // Use getAllByText for elements that might appear multiple times
        const startLearningButtons = screen.getAllByText('Start Learning');
        expect(startLearningButtons.length).toBeGreaterThan(0);
        expect(screen.getByText('Cloud providers')).toBeInTheDocument();
        const downloadButtons = screen.getAllByText('Download Whitepaper');
        expect(downloadButtons.length).toBeGreaterThan(0);
        expect(screen.getByText('Access Guidance')).toBeInTheDocument();
      });
    });

    it('should handle hash navigation for AMD Developer Cloud', async () => {
      // Mock window.location.hash
      Object.defineProperty(window, 'location', {
        value: {
          hash: '#amd-developer-cloud',
        },
        writable: true,
      });

      await act(async () => {
        renderWithRouter(<GPUCloud />);
      });

      await waitFor(() => {
        expect(Element.prototype.scrollIntoView).toHaveBeenCalled();
      });
    });
  });

  describe('Responsive Design', () => {
    it('should render on different screen sizes', async () => {
      // Test mobile view
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      await act(async () => {
        renderWithRouter(<GPUCloud />);
      });

      await waitFor(() => {
        // Use getAllByText since there might be multiple instances
        const titles = screen.getAllByText('AMD Instinct™ GPU Cloud Access');
        expect(titles.length).toBeGreaterThan(0);
      });

      // Test desktop view
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1920,
      });

      await act(async () => {
        renderWithRouter(<GPUCloud />);
      });

      await waitFor(() => {
        // Use getAllByText since there might be multiple instances
        const titles = screen.getAllByText('AMD Instinct™ GPU Cloud Access');
        expect(titles.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', async () => {
      await act(async () => {
        renderWithRouter(<GPUCloud />);
      });

      await waitFor(() => {
        const h1Elements = screen.getAllByRole('heading', { level: 1 });
        const h2Elements = screen.getAllByRole('heading', { level: 2 });
        const h3Elements = screen.getAllByRole('heading', { level: 3 });

        expect(h1Elements.length).toBeGreaterThan(0);
        expect(h2Elements.length).toBeGreaterThan(0);
        expect(h3Elements.length).toBeGreaterThan(0);
      });
    });

    it('should have proper alt text for images', async () => {
      await act(async () => {
        renderWithRouter(<GPUCloud />);
      });

      await waitFor(() => {
        const bannerImage = screen.getByAltText('Banner');
        expect(bannerImage).toBeInTheDocument();
      });
    });

    it('should have proper ARIA labels and roles', async () => {
      await act(async () => {
        renderWithRouter(<GPUCloud />);
      });

      await waitFor(() => {
        // Check for navigation role
        const nav = screen.getByRole('navigation');
        expect(nav).toBeInTheDocument();
      });
    });
  });

  describe('Performance and Loading', () => {
    it('should render without errors', async () => {
      await act(async () => {
        renderWithRouter(<GPUCloud />);
      });

      await waitFor(() => {
        expect(screen.getByTestId('playground-logo')).toBeInTheDocument();
      });
    });

    it('should handle scroll events properly', async () => {
      await act(async () => {
        renderWithRouter(<GPUCloud />);
      });

      await waitFor(() => {
        // Test that scrollIntoView is available
        expect(Element.prototype.scrollIntoView).toBeDefined();
      });
    });
  });
}); 