# Tool Calling Implementation

This document describes the comprehensive tool calling system implemented for the AI model playground, featuring six fully functional tools with real API integrations.

## Overview

The tool calling system allows AI models to interact with external services and perform real-time operations like weather lookup, web search, calculations, translation, stock price checking, and time zone queries.

## Available Tools

### 1. Weather Tool (`get_weather`)
- **Purpose**: Get current weather for any location worldwide
- **API**: OpenWeatherMap (with fallback to mock data)
- **Parameters**:
  - `location` (required): City and state/country
  - `unit` (optional): Temperature unit (`celsius` or `fahrenheit`)
- **Example**: "What's the weather like in Tokyo?"

### 2. Web Search Tool (`search_web`)
- **Purpose**: Search the web for real-time information
- **API**: DuckDuckGo Instant Answer API (with fallback to mock data)
- **Parameters**:
  - `query` (required): Search query
  - `num_results` (optional): Number of results (1-10)
- **Example**: "What are the latest developments in AI?"

### 3. Calculator Tool (`calculate`)
- **Purpose**: Perform mathematical calculations
- **Implementation**: Safe JavaScript evaluation
- **Parameters**:
  - `expression` (required): Mathematical expression
  - `precision` (optional): Decimal places (0-10)
- **Example**: "What is 25% of 480?"

### 4. Translation Tool (`translate`)
- **Purpose**: Translate text between languages
- **API**: LibreTranslate (with fallback to mock data)
- **Parameters**:
  - `text` (required): Text to translate
  - `target_language` (required): Target language code
  - `source_language` (optional): Source language code
- **Example**: "Translate 'Hello world' to Spanish"

### 5. Stock Price Tool (`get_stock_price`)
- **Purpose**: Get real-time stock prices
- **API**: Alpha Vantage (with fallback to mock data)
- **Parameters**:
  - `symbol` (required): Stock ticker symbol
  - `include_currency` (optional): Include currency in response
- **Example**: "What's the current price of Apple stock?"

### 6. Time Tool (`get_time`)
- **Purpose**: Get current time for any timezone
- **Implementation**: Native JavaScript Date API
- **Parameters**:
  - `timezone` (required): Timezone identifier
  - `format` (optional): Time format (`12h` or `24h`)
- **Example**: "What time is it in Tokyo?"

## Architecture

### Core Components

1. **ToolService** (`src/services/toolService.ts`)
   - Singleton service for tool execution
   - Handles API calls and error handling
   - Provides fallback mock data
   - Manages tool result formatting

2. **ToolSelector** (`src/components/ToolSelector.tsx`)
   - UI component for enabling/disabling tools
   - Categorized tool display
   - Bulk enable/disable functionality

3. **ToolDocumentation** (`src/components/ToolDocumentation.tsx`)
   - Comprehensive tool documentation
   - Parameter descriptions and examples
   - Usage tips and best practices

4. **ModelDetail Integration** (`src/pages/ModelDetail.tsx`)
   - Tool calling toggle
   - Tool selection interface
   - Real-time tool execution
   - Tool result display

### Data Flow

1. User enables tool calling and selects tools
2. User sends message to AI model
3. Model decides which tools to use (if any)
4. Tool calls are executed via ToolService
5. Results are formatted and displayed in chat
6. AI model can reference tool results in responses

## API Integrations

### Real APIs (with Fallbacks)

#### Weather API
- **Primary**: OpenWeatherMap
- **Endpoint**: `https://api.openweathermap.org/data/2.5/weather`
- **Fallback**: Mock weather data
- **Rate Limits**: 60 calls/minute (free tier)

#### Web Search API
- **Primary**: DuckDuckGo Instant Answer
- **Endpoint**: `https://api.duckduckgo.com/`
- **Fallback**: Mock search results
- **Rate Limits**: No API key required

#### Translation API
- **Primary**: LibreTranslate
- **Endpoint**: `https://libretranslate.de/translate`
- **Fallback**: Mock translations
- **Rate Limits**: No API key required

#### Stock API
- **Primary**: Alpha Vantage
- **Endpoint**: `https://www.alphavantage.co/query`
- **Fallback**: Mock stock data
- **Rate Limits**: 5 calls/minute (free tier)

### Mock Data Strategy

Each tool includes comprehensive mock data that:
- Provides realistic responses
- Covers common use cases
- Maintains consistent formatting
- Includes error scenarios

## Usage Instructions

### For Users

1. **Enable Tool Calling**
   - Toggle "Enable Tool Calling" in the chat interface
   - Tools will be available for the AI to use

2. **Select Tools**
   - Click the "Tools" button to open tool selector
   - Choose which tools you want to enable
   - Use "Enable All" or "Disable All" for bulk operations

3. **Ask Questions**
   - Ask questions that would benefit from real-time data
   - Examples:
     - "What's the weather like in Paris?"
     - "What are the latest AI developments?"
     - "Calculate 15% of 250"
     - "Translate 'Hello' to French"
     - "What's Apple's stock price?"
     - "What time is it in London?"

4. **View Results**
   - Tool results appear as tool messages in the chat
   - AI can reference tool data in its responses
   - Results are clearly formatted and easy to read

### For Developers

#### Adding New Tools

1. **Define Tool Schema**
   ```typescript
   {
     name: 'new_tool',
     description: 'Tool description',
     parameters: {
       type: 'object',
       properties: {
         // Define parameters
       },
       required: ['param1']
     }
   }
   ```

2. **Implement Tool Logic**
   ```typescript
   private async newTool(args: ToolArgs): Promise<string> {
     // Implement tool logic
     // Include error handling
     // Provide fallback data
   }
   ```

3. **Add to ToolService**
   ```typescript
   case 'new_tool':
     result = await this.newTool(parsedArgs);
     break;
   ```

4. **Update UI Components**
   - Add to ToolSelector
   - Add to ToolDocumentation
   - Update tool categories if needed

#### Environment Variables

For production deployment, set these environment variables:

```bash
# Weather API
VITE_OPENWEATHER_API_KEY=your_api_key

# Stock API
VITE_ALPHA_VANTAGE_API_KEY=your_api_key

# Translation API (optional)
VITE_LIBRETRANSLATE_API_KEY=your_api_key
```

## Error Handling

### API Failures
- All tools include fallback mock data
- Network errors are gracefully handled
- User-friendly error messages
- Logging for debugging

### Invalid Inputs
- Parameter validation
- Safe mathematical evaluation
- Input sanitization
- Clear error messages

### Rate Limiting
- Respects API rate limits
- Graceful degradation to mock data
- User notification of limitations

## Performance Considerations

### Caching
- Consider implementing response caching
- Cache weather data for 5-10 minutes
- Cache stock prices for 1-2 minutes
- Cache search results briefly

### Rate Limiting
- Implement client-side rate limiting
- Queue requests when approaching limits
- Provide user feedback on limits

### Optimization
- Lazy load tool components
- Minimize API calls
- Use efficient data structures

## Security Considerations

### Input Validation
- Sanitize all user inputs
- Validate parameter types
- Prevent injection attacks
- Limit expression complexity

### API Security
- Use environment variables for API keys
- Implement request signing where needed
- Validate API responses
- Handle sensitive data appropriately

### Data Privacy
- Don't log sensitive user data
- Clear tool results from memory
- Respect user privacy preferences

## Testing

### Unit Tests
- Test each tool individually
- Mock API responses
- Test error scenarios
- Validate parameter handling

### Integration Tests
- Test tool calling flow
- Test API integrations
- Test error handling
- Test UI interactions

### Manual Testing
- Test with real API keys
- Test rate limiting scenarios
- Test network failures
- Test user workflows

## Future Enhancements

### Additional Tools
- **File Operations**: Read/write files
- **Database Queries**: SQL execution
- **Email**: Send emails
- **Calendar**: Schedule management
- **Maps**: Location services
- **News**: Current events

### Advanced Features
- **Tool Chaining**: Multiple tools in sequence
- **Conditional Logic**: Tool selection based on context
- **Custom Tools**: User-defined tools
- **Tool History**: Track tool usage
- **Analytics**: Usage statistics

### UI Improvements
- **Tool Status**: Show API health
- **Usage Limits**: Display remaining calls
- **Tool Preferences**: User-specific settings
- **Quick Actions**: Common tool combinations

## Troubleshooting

### Common Issues

1. **Tools Not Working**
   - Check if tool calling is enabled
   - Verify tool selection
   - Check browser console for errors
   - Ensure API keys are configured

2. **API Errors**
   - Check API key validity
   - Verify rate limits
   - Check network connectivity
   - Review API documentation

3. **Performance Issues**
   - Monitor API response times
   - Check for rate limiting
   - Review caching implementation
   - Optimize tool selection

### Debug Mode

Enable debug logging by setting:
```javascript
localStorage.setItem('debug', 'true');
```

This will log:
- Tool execution details
- API request/response data
- Error information
- Performance metrics

## Support

For issues or questions:
1. Check this documentation
2. Review browser console logs
3. Test with different tools
4. Verify API configurations
5. Contact development team

---

**Note**: This implementation provides a robust foundation for tool calling with real API integrations while maintaining graceful fallbacks for reliability and user experience. 