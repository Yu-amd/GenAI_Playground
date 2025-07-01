# Unit Tests Documentation

This directory contains comprehensive unit tests for the ih-mockup-demo project, covering both the ModelDetail page component and API integration utilities.

## 📁 File Structure

```
src/tests/
├── README.md                    # This file
├── ModelDetail.test.tsx         # Main test suite for ModelDetail component
├── ModelDetail.toolCalling.test.tsx  # Tool calling functionality tests
├── apiIntegration.test.ts       # Tests for API code generation utilities
├── setup.ts                     # Global test setup configuration
└── __mocks__/                   # Mock files directory (if any)
```

## 🧪 Test Coverage Overview

### 1. **ModelDetail Component Tests** (`ModelDetail.test.tsx`)

The main test suite covers the complex ModelDetail page component:

#### Component Rendering

- ✅ Initial loading state
- ✅ Model data display (name, description, tags, logo)
- ✅ Navigation elements
- ✅ Warning banner
- ✅ Chat interface
- ✅ Code generation panel

#### State Management

- ✅ Model data loading and state updates
- ✅ Message state management
- ✅ Parameter state management
- ✅ UI state management (modals, panels, etc.)

#### User Interactions

- ✅ Message input and sending
- ✅ Keyboard shortcuts (Enter key)
- ✅ Button clicks and navigation
- ✅ Modal opening/closing
- ✅ Parameter adjustments

#### API Integration

- ✅ LM Studio service calls
- ✅ Error handling
- ✅ Loading states
- ✅ Streaming responses

#### Accessibility

- ✅ ARIA labels and roles
- ✅ Keyboard navigation
- ✅ Screen reader compatibility
- ✅ Focus management

#### UI Components

- ✅ Chat messages display
- ✅ Code generation with syntax highlighting
- ✅ Parameter sliders
- ✅ Modal dialogs
- ✅ Settings panel

### 2. **Tool Calling Tests** (`ModelDetail.toolCalling.test.tsx`)

Comprehensive test suite for the tool calling functionality that enables AI models to use external tools:

#### Tool Calling Toggle

- ✅ Enable/disable tool calling checkbox
- ✅ Visual state indicators
- ✅ State persistence across messages

#### Tool Selection

- ✅ Tool selector modal opening/closing
- ✅ Individual tool enable/disable
- ✅ Enable all/disable all functionality
- ✅ Tool count display
- ✅ Tool state persistence

#### Tool Documentation

- ✅ Documentation modal display
- ✅ Tool information rendering
- ✅ Modal interaction handling

#### Tool Test Panel

- ✅ Test panel modal functionality (accessed via Tools button)
- ✅ Tool calling status display
- ✅ Enabled tools listing
- ✅ Test message triggering
- ✅ Development mode detection

#### Tool Calling Execution

- ✅ Tools included in API requests when enabled
- ✅ Tools excluded when disabled
- ✅ Tool call execution and response handling
- ✅ Multiple tool calls in single request
- ✅ Tool response message integration

#### Error Handling

- ✅ API error handling during tool calls
- ✅ Tool execution error handling
- ✅ UI state recovery after errors
- ✅ User feedback for errors

#### State Management

- ✅ Tool calling state persistence
- ✅ Enabled tools state management
- ✅ Cross-message state maintenance

### 3. **API Integration Tests** (`apiIntegration.test.ts`)

Tests for the API code generation utilities that support multiple programming languages:

#### Language Support

- ✅ **Python** - OpenAI client integration
- ✅ **TypeScript** - Node.js OpenAI client
- ✅ **Rust** - Axum web framework implementation
- ✅ **Go** - Go-OpenAI client
- ✅ **Shell** - cURL-based implementation

#### Code Generation Features

- ✅ Parameter handling (temperature, max_tokens, top_p)
- ✅ Model ID integration
- ✅ Streaming support
- ✅ Special character escaping
- ✅ Default value fallbacks
- ✅ Input message processing

#### Code Quality

- ✅ Valid syntax for each language
- ✅ Proper imports and dependencies
- ✅ Correct API endpoint configuration
- ✅ Error handling patterns

## 🚀 Running Tests

### Prerequisites

Make sure you have all dependencies installed:

```bash
npm install
```

### Run All Tests

```bash
npm test
```

### Run Tests in Watch Mode

```bash
npm test -- --watch
```

### Run Tests with Coverage

```bash
npm test -- --coverage
```

### Run Specific Test Files

#### ModelDetail Component Tests

```bash
npm test ModelDetail.test.tsx
```

#### Tool Calling Tests

```bash
npm test ModelDetail.toolCalling.test.tsx
```

#### API Integration Tests

```bash
npm test apiIntegration.test.ts
```

### Run Tests by Category

#### Component Tests Only

```bash
npm test -- --testPathPattern="ModelDetail\.test\.tsx"
```

#### Tool Calling Tests Only

```bash
npm test -- --testPathPattern="ModelDetail\.toolCalling\.test\.tsx"
```

#### API Tests Only

```bash
npm test -- --testPathPattern="apiIntegration\.test\.ts"
```

### Run Tests Matching a Pattern

```bash
# Run tests with "send" in the name
npm test -- --testNamePattern="should send message"

# Run tests with "tool" in the name
npm test -- --testNamePattern="tool"

# Run tests with "python" in the name
npm test -- --testNamePattern="python"
```

## 📋 Test Categories

### 1. **Component Tests** (ModelDetail.test.tsx)

Tests that verify React component behavior:

#### Rendering Tests

- Loading state verification
- Error state handling
- Success state with model data
- Empty states

#### Interaction Tests

- User input simulation
- Button click handling
- Keyboard navigation
- Form submissions

#### State Tests

- Component state updates
- Props handling
- Side effects
- Lifecycle management

#### Integration Tests

- Service calls
- Response handling
- Error scenarios
- Loading indicators

#### Accessibility Tests

- ARIA attributes
- Keyboard navigation
- Screen reader support
- Focus management

### 2. **Tool Calling Tests** (ModelDetail.toolCalling.test.tsx)

Tests that verify tool calling functionality:

#### Tool Management Tests

- Tool selection and deselection
- Tool state persistence
- Tool count tracking
- Tool documentation display

#### Tool Execution Tests

- API request structure validation
- Tool call execution flow
- Response handling
- Error recovery

#### UI Integration Tests

- Modal interactions
- State synchronization
- User feedback
- Development mode features

#### Error Handling Tests

- API error scenarios
- Tool execution failures
- State recovery
- User notification

### 3. **Utility Tests** (apiIntegration.test.ts)

Tests that verify utility function behavior:

#### Code Generation Tests

- Language-specific syntax validation
- Parameter integration
- Template rendering
- Edge case handling

#### Input Processing Tests

- Special character handling
- Empty input handling
- Parameter validation
- Default value application

## 🛠️ Test Utilities and Helpers

### Mock Setup

The tests use several mocks to isolate components and utilities:

```typescript
// Mock react-router-dom for component tests
jest.mock('react-router-dom', () => ({
  useParams: () => ({ modelId: 'test-model' }),
  Link: ({ children, to }: any) => <a href={to}>{children}</a>),
}));

// Mock LM Studio service for API tests
jest.mock('../services/lmStudioService', () => ({
  lmStudioService: {
    chatCompletion: jest.fn(),
  },
}));

// Mock tool service for tool calling tests
jest.mock('../services/toolService', () => ({
  toolService: {
    executeTool: jest.fn(),
  },
}));

// Mock model loader for component tests
jest.mock('../utils/modelLoader', () => ({
  loadModelData: jest.fn(),
  modelImageMap: {},
}));

// Mock tool components for tool calling tests
jest.mock('../components/ToolSelector', () => ({
  default: ({ onClose, enabledTools, onToolToggle, onEnableAll, onDisableAll }: any) => (
    <div data-testid="tool-selector">
      <button onClick={onClose}>Close Tool Selector</button>
      <div data-testid="enabled-tools-count">{enabledTools.length}</div>
      <button onClick={() => onToolToggle('get_weather')}>Toggle Weather</button>
      <button onClick={onEnableAll}>Enable All</button>
      <button onClick={onDisableAll}>Disable All</button>
    </div>
  )
}));
```

### Test Utilities

```typescript
// Custom render function with providers
const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <MemoryRouter initialEntries={['/models/test-model']}>
      {component}
    </MemoryRouter>
  );
};

// Wait for async operations
const waitForElement = async (selector: string) => {
  return waitFor(() => screen.getByTestId(selector));
};

// Mock data for consistent testing
const mockModelData = {
  model_id: 'test-model',
  name: 'Test Model',
  description: 'A test model for unit testing',
  // ... other properties
};

// Mock tool call response for tool calling tests
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
```

## 📝 Writing New Tests

### Component Test Structure

Follow this pattern for new component tests:

```typescript
describe('Feature Name', () => {
  beforeEach(() => {
    // Setup mocks and initial state
    jest.clearAllMocks();
    (loadModelData as any).mockResolvedValue(mockModelData);
  });

  afterEach(() => {
    // Cleanup
    jest.clearAllMocks();
  });

  it('should do something specific', async () => {
    // Arrange
    render(<ModelDetail />);

    // Act
    const button = screen.getByRole('button', { name: /send/i });
    fireEvent.click(button);

    // Assert
    await waitFor(() => {
      expect(screen.getByText('Expected result')).toBeInTheDocument();
    });
  });
});
```

### Tool Calling Test Structure

Follow this pattern for new tool calling tests:

```typescript
describe('Tool Test Panel', () => {
  it('should access test panel through tools button', async () => {
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
});
```

### Utility Test Structure

Follow this pattern for new utility tests:

```typescript
describe('Utility Function', () => {
  it('should handle specific input correctly', () => {
    // Arrange
    const input = 'test input';
    const expected = 'expected output';

    // Act
    const result = utilityFunction(input);

    // Assert
    expect(result).toBe(expected);
  });

  it('should handle edge cases', () => {
    // Test edge cases like empty input, null values, etc.
    expect(utilityFunction('')).toBe('default');
    expect(utilityFunction(null)).toBe('default');
  });
});
```

### Best Practices

1. **Use Descriptive Test Names**

   ```typescript
   // Good
   it('should send message when Enter key is pressed', () => {});
   it('should include tools in API call when tool calling is enabled', () => {});
   it('should generate valid Python code with all required components', () => {});

   // Bad
   it('should work', () => {});
   ```

2. **Test One Thing at a Time**

   ```typescript
   // Good - focused test
   it('should update temperature parameter', () => {});
   it('should enable tool calling when toggle is switched', () => {});

   // Bad - testing multiple things
   it('should handle all parameter changes', () => {});
   ```

3. **Use Accessibility Queries**

   ```typescript
   // Good - accessible
   screen.getByRole('button', { name: /send/i });
   screen.getByLabelText('Send');

   // Bad - fragile
   screen.getByTestId('send-button');
   ```

4. **Handle Async Operations**

   ```typescript
   // Good - waits for async
   await waitFor(() => {
     expect(screen.getByText('Response')).toBeInTheDocument();
   });

   // Bad - might fail
   expect(screen.getByText('Response')).toBeInTheDocument();
   ```

5. **Test Tool Calling State Properly**

   ```typescript
   // Good - tests actual behavior
   expect(sendButton).toBeDisabled(); // Because input is empty
   expect(sendButton).toHaveClass('bg-gray-600/20'); // Disabled styling

   // Bad - incorrect expectation
   expect(sendButton).not.toBeDisabled(); // After error, input is cleared
   ```

## 🔧 Troubleshooting

### Common Issues

1. **React act() Warnings**
   - Wrap async operations in `act()`
   - Use `waitFor()` for async state updates

2. **Mock Not Working**
   - Ensure mocks are defined before imports
   - Check mock implementation matches expected interface

3. **Element Not Found**
   - Use `screen.debug()` to see current DOM
   - Check if element is conditionally rendered
   - Verify test data setup

4. **Async Test Failures**
   - Add proper `await` statements
   - Use `waitFor()` for state changes
   - Check mock timing

5. **Tool Calling Test Failures**
   - Check that tool calling is enabled before testing
   - Verify tool selection in the tool selector
   - Ensure test panel is accessed via Tools button (not standalone)
   - Check that NODE_ENV is set to 'development' for test features
   - Verify tool service mocks are properly configured
   - Test button state expectations match actual behavior

### Debug Commands

```bash
# Run tests with verbose output
npm test -- --verbose

# Run tests with debug logging
DEBUG=* npm test

# Run single test with debug
npm test -- --testNamePattern="specific test" --verbose

# Run specific test file with coverage
npm test apiIntegration.test.ts -- --coverage

# Run tool calling tests only
npm test ModelDetail.toolCalling.test.tsx -- --verbose
```

## 📊 Test Metrics

### Current Coverage

- **ModelDetail Component**: ~85% line coverage
- **Tool Calling Functionality**: ~90% line coverage
- **API Integration**: ~95% line coverage
- **Overall Project**: ~88% line coverage

### Test Count

- **ModelDetail Tests**: 26 tests (all passing)
- **Tool Calling Tests**: 24 tests (all passing)
- **API Integration Tests**: 12 tests (all passing)
- **Total Tests**: 62 tests

### Test Performance

- **Component Tests**: ~3-5 seconds
- **Tool Calling Tests**: ~4-6 seconds
- **API Tests**: ~1-2 seconds
- **Full Suite**: ~8-12 seconds

## 🔄 Continuous Integration

Tests are automatically run on:

- Pull requests
- Main branch pushes
- Release builds

### CI Commands

```yaml
# Example GitHub Actions
- name: Run All Tests
  run: npm test -- --coverage --watchAll=false

- name: Run Component Tests
  run: npm test ModelDetail.test.tsx -- --coverage

- name: Run Tool Calling Tests
  run: npm test ModelDetail.toolCalling.test.tsx -- --coverage

- name: Run API Tests
  run: npm test apiIntegration.test.ts -- --coverage

- name: Upload Coverage
  uses: codecov/codecov-action@v3
```

## 📚 Additional Resources

- [React Testing Library Documentation](https://testing-library.com/docs/react-testing-library/intro/)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Vitest Documentation](https://vitest.dev/guide/)
- [Accessibility Testing Guide](https://testing-library.com/docs/dom-testing-library/api-accessibility)
- [Async Testing Patterns](https://testing-library.com/docs/dom-testing-library/api-async)
- [OpenAI Function Calling Documentation](https://platform.openai.com/docs/guides/function-calling)

## 🤝 Contributing

When adding new features to the project:

1. **Write tests first** (TDD approach)
2. **Ensure all existing tests pass**
3. **Add tests for new functionality**
4. **Update this README if needed**
5. **Maintain test coverage above 80%**

### Test Review Checklist

- [ ] Tests are descriptive and focused
- [ ] Async operations are properly handled
- [ ] Accessibility is considered
- [ ] Edge cases are covered
- [ ] Mocks are appropriate and minimal
- [ ] Tests are independent and repeatable
- [ ] Code generation tests validate syntax
- [ ] Component tests cover user interactions
- [ ] Tool calling tests verify API structure
- [ ] Error handling scenarios are tested
- [ ] State management is properly tested

---

**Last Updated**: June 28, 2025
**Maintainer**: Yu Wang ([yu.wang6@amd.com](mailto:yu.wang6@amd.com))
**Test Frameworks**: Jest + React Testing Library, Vitest
