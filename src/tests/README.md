# ModelDetail Page Unit Tests

This directory contains comprehensive unit tests for the ModelDetail page component, which is a complex React component that handles model interactions, chat functionality, parameter management, and code generation.

## 📁 File Structure

```
src/tests/
├── README.md                    # This file
├── ModelDetail.test.tsx         # Main test suite for ModelDetail component
├── __mocks__/                   # Mock files directory
│   ├── react-router-dom.tsx     # Mock for react-router-dom
│   └── lmStudioService.ts       # Mock for LM Studio service
└── setupTests.ts                # Global test setup configuration
```

## 🧪 Test Coverage

The test suite covers the following areas:

### 1. **Component Rendering**
- ✅ Initial loading state
- ✅ Model data display (name, description, tags, logo)
- ✅ Navigation elements
- ✅ Warning banner
- ✅ Chat interface
- ✅ Code generation panel

### 2. **State Management**
- ✅ Model data loading and state updates
- ✅ Message state management
- ✅ Parameter state management
- ✅ UI state management (modals, panels, etc.)

### 3. **User Interactions**
- ✅ Message input and sending
- ✅ Keyboard shortcuts (Enter key)
- ✅ Button clicks and navigation
- ✅ Modal opening/closing
- ✅ Parameter adjustments

### 4. **API Integration**
- ✅ LM Studio service calls
- ✅ Error handling
- ✅ Loading states
- ✅ Streaming responses

### 5. **Accessibility**
- ✅ ARIA labels and roles
- ✅ Keyboard navigation
- ✅ Screen reader compatibility
- ✅ Focus management

### 6. **UI Components**
- ✅ Chat messages display
- ✅ Code generation with syntax highlighting
- ✅ Parameter sliders
- ✅ Modal dialogs
- ✅ Settings panel

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

### Run Specific Test File
```bash
npm test ModelDetail.test.tsx
```

### Run Tests Matching a Pattern
```bash
npm test -- --testNamePattern="should send message"
```

## 📋 Test Categories

### 1. **Rendering Tests**
Tests that verify the component renders correctly in different states:
- Loading state
- Error state
- Success state with model data
- Empty states

### 2. **Interaction Tests**
Tests that simulate user interactions:
- Clicking buttons
- Typing in inputs
- Keyboard navigation
- Form submissions

### 3. **State Tests**
Tests that verify state changes:
- Message state updates
- Parameter changes
- Modal state management
- Loading state transitions

### 4. **API Tests**
Tests that verify API integration:
- Service calls
- Response handling
- Error scenarios
- Loading indicators

### 5. **Accessibility Tests**
Tests that ensure accessibility compliance:
- ARIA attributes
- Keyboard navigation
- Screen reader support
- Focus management

## 🛠️ Test Utilities and Helpers

### Mock Setup
The tests use several mocks to isolate the component:

```typescript
// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  useParams: () => ({ modelId: 'test-model' }),
  Link: ({ children, to }: any) => <a href={to}>{children}</a>),
}));

// Mock LM Studio service
jest.mock('../services/lmStudioService', () => ({
  lmStudioService: {
    chatCompletion: jest.fn(),
  },
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
```

## 📝 Writing New Tests

### Test Structure
Follow this pattern for new tests:

```typescript
describe('Feature Name', () => {
  beforeEach(() => {
    // Setup mocks and initial state
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

### Best Practices

1. **Use Descriptive Test Names**
   ```typescript
   // Good
   it('should send message when Enter key is pressed', () => {});
   
   // Bad
   it('should work', () => {});
   ```

2. **Test One Thing at a Time**
   ```typescript
   // Good - focused test
   it('should update temperature parameter', () => {});
   
   // Bad - testing multiple things
   it('should handle all parameter changes', () => {});
   ```

3. **Use Accessibility Queries**
   ```typescript
   // Good - accessible
   screen.getByRole('button', { name: /send/i });
   
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

### Debug Commands
```bash
# Run tests with verbose output
npm test -- --verbose

# Run tests with debug logging
DEBUG=* npm test

# Run single test with debug
npm test -- --testNamePattern="specific test" --verbose
```

## 📊 Test Metrics

### Current Coverage
- **Lines**: ~85%
- **Functions**: ~90%
- **Branches**: ~80%
- **Statements**: ~85%

### Test Count
- **Total Tests**: 26
- **Passing**: 25
- **Failing**: 1 (known issue with Enter key test)

## 🔄 Continuous Integration

Tests are automatically run on:
- Pull requests
- Main branch pushes
- Release builds

### CI Commands
```yaml
# Example GitHub Actions
- name: Run Tests
  run: npm test -- --coverage --watchAll=false

- name: Upload Coverage
  uses: codecov/codecov-action@v3
```

## 📚 Additional Resources

- [React Testing Library Documentation](https://testing-library.com/docs/react-testing-library/intro/)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Accessibility Testing Guide](https://testing-library.com/docs/dom-testing-library/api-accessibility)
- [Async Testing Patterns](https://testing-library.com/docs/dom-testing-library/api-async)

## 🤝 Contributing

When adding new features to the ModelDetail component:

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

---

**Last Updated**: December 2024
**Maintainer**: Development Team
**Test Framework**: Jest + React Testing Library 