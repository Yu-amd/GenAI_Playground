# Model Catalog & Model Details Development Documentation

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Model Catalog Page](#model-catalog-page)
4. [Model Details Page](#model-details-page)
5. [Data Models & Types](#data-models--types)
6. [Components](#components)
7. [Services & Utilities](#services--utilities)
8. [Testing Strategy](#testing-strategy)
9. [Development Guidelines](#development-guidelines)
10. [CI/CD Pipeline](#cicd-pipeline)
11. [Performance Considerations](#performance-considerations)
12. [Security Considerations](#security-considerations)
13. [Troubleshooting](#troubleshooting)

## Overview

The Model Catalog and Model Details pages form the core of the GenAI Playground application, providing users with comprehensive access to AI models and their capabilities. This documentation covers the complete software development lifecycle for these features.

### Key Features

- **Model Catalog**: Browse and filter AI models with detailed metadata
- **Model Details**: Interactive model exploration with chat interface, code generation, and model card editing
- **Real-time Interaction**: Direct model testing through chat interface
- **API Integration**: Multi-language code examples for model integration
- **Content Management**: Model card editing capabilities (debug mode)
- **Tool Calling**: Advanced AI model interaction with external tools

## Architecture

### High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Model Catalog │    │  Model Details  │    │   Model Cards   │
│      Page       │    │      Page       │    │   (Markdown)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Model Loader   │    │   LM Studio     │    │  Content Editor │
│    Utility      │    │    Service      │    │   Components    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Model Data    │    │   Tool Service  │    │   Test Suite    │
│   (TypeScript)  │    │   & Utilities   │    │   (Vitest)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Technology Stack

- **Frontend Framework**: React 19.1.0 with TypeScript
- **Build Tool**: Vite 6.3.5
- **Styling**: Tailwind CSS 3.4.1
- **Testing**: Vitest 3.2.4 with React Testing Library
- **Routing**: React Router DOM 7.6.2
- **UI Components**: Headless UI, Heroicons, React Icons
- **Markdown**: React Markdown with GFM support
- **Code Highlighting**: Prism React Renderer
- **State Management**: React Hooks (useState, useEffect, useRef)

## Model Catalog Page

### File Location
```
src/pages/ModelsCatalog.tsx
```

### Component Structure

```typescript
const ModelsCatalog: React.FC = () => {
  const [models, setModels] = useState<ModelCatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Component logic and rendering
};
```

### Key Features

1. **Model Loading**: Asynchronous loading of model data via `loadAllModels()`
2. **Error Handling**: Graceful error states with user feedback
3. **Responsive Design**: Grid layout adapting to screen sizes
4. **Interactive Cards**: Hover effects and navigation to detail pages
5. **Badge System**: Visual indicators for model status (New, Featured, Tech Preview)
6. **Tag System**: Categorized model capabilities and use cases

### Data Flow

```
User Request → ModelsCatalog Component → loadAllModels() → 
Model Loader Utility → Generated Model Data → State Update → 
Rendered Model Cards
```

### Styling Classes

- **Container**: `min-h-screen bg-neutral-900 text-white font-sans flex flex-col`
- **Banner**: `relative w-full h-56 md:h-72 lg:h-80 overflow-hidden`
- **Model Cards**: `bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl`
- **Hover Effects**: `hover:bg-white/20 hover:shadow-2xl hover:shadow-white/30 hover:-translate-y-1`

## Model Details Page

### File Location
```
src/pages/ModelDetail.tsx (1,619 lines)
```

### Component Structure

```typescript
const ModelDetail: React.FC = () => {
  // State management for complex interactions
  const [modelData, setModelData] = useState<ModelData | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [parameters, setParameters] = useState<Parameter[]>([]);
  const [modelCardContent, setModelCardContent] = useState<any>(null);
  
  // Multiple UI states
  const [isLoading, setIsLoading] = useState(false);
  const [showModelCard, setShowModelCard] = useState(false);
  const [isEditingModelCard, setIsEditingModelCard] = useState(false);
  
  // Component logic and rendering
};
```

### Key Features

1. **Chat Interface**: Real-time model interaction with message history
2. **Parameter Control**: Adjustable model parameters (temperature, max_tokens, etc.)
3. **Code Generation**: Multi-language API integration examples
4. **Model Card Display**: Comprehensive model documentation
5. **Content Editing**: Debug-mode model card editing capabilities
6. **Tool Calling**: Advanced AI model interaction with external tools
7. **API Integration**: Live code examples in multiple languages

### Sub-Components

#### ModelCardViewContent
- **Purpose**: Display model card content in read-only mode
- **Features**: Markdown rendering, section organization, link handling

#### ModelCardEditingContent
- **Purpose**: Edit model card content in debug mode
- **Features**: Section management, content editing, reordering capabilities

### State Management

```typescript
interface Message {
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
  timestamp: Date;
  tool_calls?: Array<{
    id: string;
    type: 'function';
    function: {
      name: string;
      arguments: string;
    };
  }>;
}

interface Parameter {
  name: string;
  value: number;
  type: 'number';
  description: string;
  min?: number;
  max?: number;
  step?: number;
}
```

## Data Models & Types

### ModelCatalogItem Interface

```typescript
export interface ModelCatalogItem {
  id: string;
  org: string;
  builder: string;
  family: string;
  name: string;
  variant: string;
  size: string;
  description: string;
  shortDescription: string;
  image: string;
  localCard: string;
  tags: string[];
  useCase: string;
  precision: string;
  license: string;
  compatibility: string[];
  readiness: string;
  badge: string;
}
```

### ModelData Interface

```typescript
export interface ModelData {
  model_id: string;
  name: string;
  builder: string;
  family: string;
  size: string;
  huggingface_id: string;
  description: string;
  logo: string;
  readiness_level: string;
  status_badges: readonly string[];
  tags: readonly string[];
  license: string;
  endpoint: string;
  demo_assets: {
    notebook: string;
    demo_link: string;
  };
  aim_recipes: ReadonlyArray<{
    name: string;
    hardware: string;
    precision: string;
    recipe_file: string;
  }>;
  api_examples: {
    python: string;
    typescript: string;
    shell: string;
    rust: string;
    go: string;
  };
  model_card: {
    overview: string;
    intended_use: readonly string[];
    limitations: readonly string[];
    training_data: string;
    evaluation: readonly string[];
    known_issues: readonly string[];
    references: readonly string[];
  };
}
```

## Components

### Core Components

#### PlaygroundLogo
- **Location**: `src/components/PlaygroundLogo.tsx`
- **Purpose**: Application branding and navigation
- **Usage**: Consistent across all pages

#### ModelCardEditor
- **Location**: `src/components/ModelCardEditor.tsx` (548 lines)
- **Purpose**: Standalone model card editing component
- **Features**: Section management, content editing, preview mode

#### ToolSelector
- **Location**: `src/components/ToolSelector.tsx` (195 lines)
- **Purpose**: Tool calling interface for AI models
- **Features**: Tool enable/disable, documentation access

#### ToolDocumentation
- **Location**: `src/components/ToolDocumentation.tsx` (414 lines)
- **Purpose**: Display tool documentation and usage examples

#### ToolTestPanel
- **Location**: `src/components/ToolTestPanel.tsx` (242 lines)
- **Purpose**: Test tool calling functionality
- **Features**: Test message generation, tool status display

### Utility Components

#### DeploymentGuide
- **Location**: `src/components/DeploymentGuide.tsx` (1,958 lines)
- **Purpose**: Model deployment instructions and guides

#### DeploymentGuideEditor
- **Location**: `src/components/DeploymentGuideEditor.tsx` (772 lines)
- **Purpose**: Edit deployment guide content

## Services & Utilities

### Model Loader Utility
- **Location**: `src/utils/modelLoader.ts`
- **Purpose**: Load and transform model data
- **Key Functions**:
  - `loadModelData(modelId: string)`: Load specific model data
  - `loadAllModels()`: Load all available models
  - `convertToCatalogItem(modelData: ModelData)`: Transform data for catalog display

### LM Studio Service
- **Location**: `src/services/lmStudioService.ts`
- **Purpose**: Handle model API interactions
- **Features**: Chat completion, streaming responses, error handling

### Tool Service
- **Location**: `src/services/toolService.ts`
- **Purpose**: Manage tool calling functionality
- **Features**: Tool registration, execution, response handling

### API Code Generator
- **Location**: `src/utils/apiCodeGenerator.ts`
- **Purpose**: Generate language-specific API integration code
- **Supported Languages**: Python, TypeScript, Shell, Rust, Go

## Testing Strategy

### Test Structure

```
src/tests/
├── ModelDetail.test.tsx (677 lines)
├── ModelDetail.toolCalling.test.tsx (891 lines)
├── apiIntegration.test.ts (129 lines)
├── setup.ts
└── README.md (650 lines)
```

### Test Categories

#### 1. Component Rendering Tests
- Initial loading states
- Model data display
- Navigation elements
- UI component rendering

#### 2. User Interaction Tests
- Message input and sending
- Keyboard shortcuts
- Button clicks and navigation
- Modal interactions

#### 3. API Integration Tests
- Service calls
- Error handling
- Loading states
- Response processing

#### 4. Tool Calling Tests
- Tool enable/disable
- Tool execution
- Documentation display
- Test panel functionality

#### 5. Accessibility Tests
- ARIA labels and roles
- Keyboard navigation
- Screen reader compatibility
- Focus management

### Test Coverage

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run specific test files
npm test ModelDetail.test.tsx
npm test ModelDetail.toolCalling.test.tsx
npm test apiIntegration.test.ts

# Run tests in watch mode
npm test -- --watch
```

### Mock Strategy

```typescript
// Service mocks
vi.mock('../services/lmStudioService');
vi.mock('../utils/modelLoader');

// Component mocks
vi.mock('../components/PlaygroundLogo', () => ({
  default: () => <div data-testid="playground-logo">Playground Logo</div>
}));

// Asset mocks
vi.mock('../assets/banner_wave.png', () => ({
  default: 'mocked-banner.png'
}));
```

## Development Guidelines

### Code Style

#### TypeScript Guidelines
- Use strict TypeScript configuration
- Define explicit interfaces for all data structures
- Use readonly arrays for immutable data
- Implement proper error handling with typed errors

#### React Guidelines
- Use functional components with hooks
- Implement proper dependency arrays in useEffect
- Use React.memo for performance optimization where needed
- Follow React best practices for state management

#### Component Structure
```typescript
// 1. Imports
import React, { useState, useEffect } from 'react';

// 2. Type definitions
interface ComponentProps {
  // Define props
}

// 3. Component definition
const ComponentName: React.FC<ComponentProps> = ({ prop1, prop2 }) => {
  // 4. State declarations
  const [state, setState] = useState<StateType>(initialValue);
  
  // 5. Effects
  useEffect(() => {
    // Effect logic
  }, [dependencies]);
  
  // 6. Event handlers
  const handleEvent = () => {
    // Event logic
  };
  
  // 7. Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
};

// 8. Export
export default ComponentName;
```

### Performance Guidelines

#### Optimization Techniques
- Use React.memo for expensive components
- Implement proper dependency arrays in useEffect
- Use useCallback for event handlers passed to child components
- Use useMemo for expensive calculations
- Implement virtual scrolling for large lists

#### Bundle Optimization
- Lazy load components using React.lazy
- Use dynamic imports for heavy dependencies
- Optimize images and assets
- Implement code splitting by routes

### Error Handling

#### Error Boundaries
```typescript
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}
```

#### Service Error Handling
```typescript
try {
  const response = await serviceCall();
  // Handle success
} catch (error) {
  if (error instanceof NetworkError) {
    // Handle network errors
  } else if (error instanceof ValidationError) {
    // Handle validation errors
  } else {
    // Handle generic errors
  }
}
```

## CI/CD Pipeline

### GitHub Actions Workflow

The CI/CD pipeline is implemented using GitHub Actions with the workflow file located at `.github/workflows/ci-cd.yml`. The pipeline includes comprehensive quality checks, testing, security scanning, and deployment automation.

#### Workflow Structure

```yaml
name: Model Catalog CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  quality-check:      # TypeScript, ESLint, Prettier
  test:              # Unit tests with coverage
  security-scan:     # npm audit, Snyk scanning
  build:             # Production build
  performance-test:  # Lighthouse CI, bundle analysis
  validate-model-data: # Model data validation
  bundle-analysis:   # Bundle size checks
  deploy-staging:    # Staging deployment (develop branch)
  deploy-production: # Production deployment (main branch)
```

#### Quality Gates

1. **TypeScript Compilation**: `npm run type-check`
2. **ESLint**: `npm run lint` (no errors)
3. **Prettier**: `npm run format:check` (consistent formatting)
4. **Test Coverage**: >80% coverage required
5. **Security**: No high/critical vulnerabilities
6. **Performance**: Lighthouse score >80
7. **Bundle Size**: <2MB total bundle size
8. **Model Data**: Valid structure and assets

#### Available Scripts

```bash
# Quality Assurance
npm run type-check          # TypeScript compilation check
npm run lint               # ESLint code linting
npm run lint:fix           # Auto-fix linting issues
npm run format             # Prettier code formatting
npm run format:check       # Check code formatting

# Testing
npm run test               # Run all tests
npm run test:coverage      # Run tests with coverage
npm run test:watch         # Run tests in watch mode
npm run test:ui            # Run tests with UI

# Building
npm run build              # Production build
npm run build:analyze      # Build with bundle analysis
npm run preview            # Preview production build

# Validation
npm run validate-model-data # Validate model data structure
npm run validate-markdown   # Validate markdown files
npm run check-bundle-size   # Check bundle size limits

# CI/CD Commands
npm run ci:quality         # Run all quality checks
npm run ci:test           # Run tests for CI
npm run ci:build          # Build for CI
npm run ci:security       # Security checks
npm run ci:validate       # Data validation
npm run pre-commit        # Pre-commit hook (all checks)
```

### Validation Scripts

#### Model Data Validation (`scripts/validateModelData.ts`)
- Validates model data structure and types
- Checks for required fields and valid values
- Verifies model card files exist
- Validates image assets exist
- Ensures model loader functionality

#### Bundle Size Check (`scripts/checkBundleSize.ts`)
- Analyzes production bundle size
- Enforces size limits (500KB main, 1MB vendor, 2MB total)
- Provides optimization suggestions
- Generates size reports

### Configuration Files

#### Prettier Configuration (`.prettierrc`)
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "bracketSameLine": false,
  "arrowParens": "avoid",
  "endOfLine": "lf"
}
```

#### Markdown Lint Configuration (`.markdownlint.json`)
```json
{
  "default": true,
  "MD013": {
    "line_length": 120,
    "code_blocks": false,
    "tables": false
  },
  "MD024": false,
  "MD033": false,
  "MD041": false
}
```

### Deployment Strategy

#### Staging Environment
- **Trigger**: Automatic on `develop` branch
- **Purpose**: Integration testing and validation
- **Features**: Full CI/CD pipeline, smoke tests
- **Approval**: None required

#### Production Environment
- **Trigger**: Manual approval on `main` branch
- **Purpose**: Live production deployment
- **Features**: Health checks, monitoring, notifications
- **Approval**: Required (environment protection)

### Security Scanning

#### npm Audit
- Scans for known vulnerabilities in dependencies
- Fails on moderate or higher severity issues
- Automatic fix suggestions

#### Snyk Security
- Advanced security vulnerability scanning
- Custom security policies
- Integration with GitHub security alerts

### Performance Testing

#### Lighthouse CI
- Automated performance audits
- Accessibility, SEO, and best practices checks
- Performance budget enforcement
- Historical performance tracking

#### Bundle Analysis
- Real-time bundle size monitoring
- Dependency analysis
- Code splitting optimization
- Tree shaking verification

## Performance Considerations

### Loading Performance

#### Model Data Loading
- Implement lazy loading for model cards
- Use pagination for large model catalogs
- Cache model data in localStorage
- Implement progressive loading indicators

#### Image Optimization
- Use WebP format for model logos
- Implement lazy loading for images
- Use appropriate image sizes for different screen densities
- Implement image compression

### Runtime Performance

#### Chat Interface
- Implement message virtualization for long conversations
- Use debouncing for real-time features
- Optimize re-renders with React.memo
- Implement proper cleanup in useEffect

#### Code Generation
- Cache generated code examples
- Implement syntax highlighting optimization
- Use web workers for heavy computations
- Optimize markdown rendering

### Memory Management

#### State Management
- Implement proper cleanup for subscriptions
- Use AbortController for API requests
- Implement garbage collection for large objects
- Monitor memory usage in development

## Security Considerations

### Input Validation

#### User Input Sanitization
```typescript
const sanitizeInput = (input: string): string => {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a'],
    ALLOWED_ATTR: ['href', 'target']
  });
};
```

#### API Request Validation
```typescript
const validateApiRequest = (request: ApiRequest): boolean => {
  // Validate request structure
  // Check for required fields
  // Validate data types
  // Check for malicious content
  return isValid;
};
```

### Authentication & Authorization

#### Route Protection
```typescript
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};
```

#### Debug Mode Protection
```typescript
const isDebugMode = process.env.NODE_ENV === 'development';
const canEditModelCard = isDebugMode && userHasPermission;
```

### Data Protection

#### Sensitive Data Handling
- Never log sensitive information
- Implement proper data encryption
- Use secure communication protocols
- Implement data retention policies

#### API Security
- Implement rate limiting
- Use HTTPS for all API calls
- Validate API responses
- Implement proper error handling

## Troubleshooting

### Common Issues

#### 1. Model Loading Failures
```bash
# Check network connectivity
curl -I https://api.example.com/models

# Verify model data structure
npm run type-check

# Check browser console for errors
```

#### 2. Chat Interface Issues
```bash
# Verify LM Studio service
curl -X POST http://localhost:1234/v1/chat/completions

# Check WebSocket connections
# Verify message format
```

#### 3. Tool Calling Problems
```bash
# Verify tool service availability
# Check tool registration
# Validate tool response format
```

#### 4. Performance Issues
```bash
# Run performance audit
npm run lighthouse

# Check bundle size
npm run build -- --analyze

# Monitor memory usage
```

#### 5. CI/CD Pipeline Issues
```bash
# Run CI checks locally
npm run pre-commit

# Check specific validations
npm run validate-model-data
npm run check-bundle-size

# Fix formatting issues
npm run format
npm run lint:fix
```

### Debug Tools

#### Development Tools
- React Developer Tools
- Redux DevTools (if using Redux)
- Network tab for API debugging
- Performance tab for performance analysis

#### Logging
```typescript
const logger = {
  debug: (message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[DEBUG] ${message}`, data);
    }
  },
  error: (message: string, error?: Error) => {
    console.error(`[ERROR] ${message}`, error);
    // Send to error tracking service
  }
};
```

### Support Resources

#### Documentation
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

#### Community Resources
- Stack Overflow tags: `react`, `typescript`, `vite`
- GitHub Issues for specific libraries
- Discord communities for React and TypeScript

#### Internal Resources
- Project README: `README.md`
- Content Editor Guide: `CONTENT_EDITOR_GUIDE.md`
- Tool Calling Documentation: `TOOL_CALLING_README.md`
- Test Documentation: `src/tests/README.md`
- CI/CD Setup Guide: `CI_CD_SETUP_GUIDE.md`

---

## Appendix

### File Structure Summary

```
src/
├── pages/
│   ├── ModelsCatalog.tsx          # Model catalog page
│   └── ModelDetail.tsx            # Model details page
├── components/
│   ├── ModelCardEditor.tsx        # Model card editing
│   ├── ToolSelector.tsx           # Tool calling interface
│   ├── ToolDocumentation.tsx      # Tool documentation
│   ├── ToolTestPanel.tsx          # Tool testing
│   └── PlaygroundLogo.tsx         # Application branding
├── services/
│   ├── lmStudioService.ts         # Model API service
│   └── toolService.ts             # Tool calling service
├── utils/
│   ├── modelLoader.ts             # Model data loading
│   └── apiCodeGenerator.ts        # Code generation
├── data/
│   └── models.ts                  # Model definitions
├── modelcards/
│   ├── llama-3-8b.md             # Model card content
│   ├── qwen2-7b-instruct.md      # Model card content
│   ├── deepseek-r1-0528.md       # Model card content
│   └── gemma-3-4b-it.md          # Model card content
└── tests/
    ├── ModelDetail.test.tsx       # Main test suite
    ├── ModelDetail.toolCalling.test.tsx  # Tool calling tests
    ├── apiIntegration.test.ts     # API integration tests
    └── README.md                  # Test documentation

scripts/
├── validateModelData.ts           # Model data validation
├── checkBundleSize.ts             # Bundle size analysis
└── generateModelData.ts           # Model data generation

.github/workflows/
└── ci-cd.yml                     # CI/CD pipeline configuration

Configuration Files:
├── .prettierrc                   # Code formatting rules
├── .markdownlint.json            # Markdown linting rules
├── package.json                  # Dependencies and scripts
└── CI_CD_SETUP_GUIDE.md          # CI/CD setup instructions
```

### Dependencies Summary

#### Core Dependencies
- React 19.1.0
- TypeScript 5.8.3
- Vite 6.3.5
- Tailwind CSS 3.4.1

#### UI Dependencies
- Headless UI 2.2.4
- Heroicons 2.2.0
- React Icons 5.5.0

#### Development Dependencies
- Vitest 3.2.4
- React Testing Library 16.3.0
- ESLint 9.25.0
- Prettier 3.3.3
- Markdownlint CLI 0.38.0

### Performance Benchmarks

#### Load Times
- Initial page load: < 2 seconds
- Model catalog load: < 1 second
- Model details load: < 1.5 seconds
- Chat response: < 3 seconds

#### Bundle Sizes
- Main bundle: < 500KB
- Vendor bundle: < 1MB
- Total bundle: < 2MB

#### Memory Usage
- Base memory usage: < 50MB
- Peak memory usage: < 200MB
- Memory leak threshold: < 10MB/hour

This documentation provides a comprehensive guide for developing, testing, and maintaining the Model Catalog and Model Details features of the GenAI Playground application. 