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

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run linting
      run: npm run lint
    
    - name: Run tests
      run: npm test -- --coverage
    
    - name: Upload coverage
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage/lcov.info

  build:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build application
      run: npm run build
    
    - name: Deploy to staging
      run: |
        # Deployment logic
```

### Quality Gates

1. **Linting**: ESLint must pass with no errors
2. **Testing**: All tests must pass with >80% coverage
3. **Type Checking**: TypeScript compilation must succeed
4. **Build**: Production build must complete successfully
5. **Performance**: Lighthouse scores must meet thresholds

### Deployment Strategy

#### Staging Environment
- Automatic deployment on main branch commits
- Integration testing with real services
- Performance monitoring and alerting

#### Production Environment
- Manual approval required for production deployment
- Blue-green deployment strategy
- Rollback capabilities
- Health checks and monitoring

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