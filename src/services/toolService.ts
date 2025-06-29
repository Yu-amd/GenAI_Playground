// Tool execution service for handling function calls
export interface ToolCall {
  id: string;
  type: 'function';
  function: {
    name: string;
    arguments: string;
  };
}

export interface ToolResult {
  tool_call_id: string;
  role: 'tool';
  content: string;
}

export class ToolService {
  private static instance: ToolService;
  
  private constructor() {}
  
  static getInstance(): ToolService {
    if (!ToolService.instance) {
      ToolService.instance = new ToolService();
    }
    return ToolService.instance;
  }

  async executeTool(toolCall: ToolCall): Promise<ToolResult> {
    try {
      const { name, arguments: args } = toolCall.function;
      const parsedArgs = JSON.parse(args);
      
      let result: string;
      
      switch (name) {
        case 'get_weather':
          result = await this.getWeather(parsedArgs);
          break;
        case 'search_web':
          result = await this.searchWeb(parsedArgs);
          break;
        case 'calculate':
          result = await this.calculate(parsedArgs);
          break;
        case 'translate':
          result = await this.translate(parsedArgs);
          break;
        case 'get_stock_price':
          result = await this.getStockPrice(parsedArgs);
          break;
        case 'get_time':
          result = await this.getTime(parsedArgs);
          break;
        default:
          throw new Error(`Unknown tool: ${name}`);
      }
      
      return {
        tool_call_id: toolCall.id,
        role: 'tool',
        content: result
      };
    } catch (error) {
      console.error(`Error executing tool ${toolCall.function.name}:`, error);
      return {
        tool_call_id: toolCall.id,
        role: 'tool',
        content: `Error executing ${toolCall.function.name}: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  private async getWeather(args: { location: string; unit?: string }): Promise<string> {
    const { location, unit = 'celsius' } = args;
    
    try {
      // Using OpenWeatherMap API (free tier)
      const apiKey = 'demo_key'; // In production, use environment variable
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${apiKey}&units=${unit === 'fahrenheit' ? 'imperial' : 'metric'}`
      );
      
      if (!response.ok) {
        // Fallback to mock data for demo
        return this.getMockWeather(location, unit);
      }
      
      const data = await response.json();
      const temp = data.main.temp;
      const description = data.weather[0].description;
      const humidity = data.main.humidity;
      const windSpeed = data.wind.speed;
      
      return `Weather in ${location}:\n• Temperature: ${temp}°${unit === 'fahrenheit' ? 'F' : 'C'}\n• Conditions: ${description}\n• Humidity: ${humidity}%\n• Wind Speed: ${windSpeed} ${unit === 'fahrenheit' ? 'mph' : 'm/s'}`;
    } catch (error) {
      // Fallback to mock data
      return this.getMockWeather(location, unit);
    }
  }

  private getMockWeather(location: string, unit: string): string {
    const temp = unit === 'fahrenheit' ? 72 : 22;
    const tempUnit = unit === 'fahrenheit' ? '°F' : '°C';
    return `Weather in ${location} (mock data):\n• Temperature: ${temp}${tempUnit}\n• Conditions: Partly cloudy\n• Humidity: 65%\n• Wind Speed: 8 ${unit === 'fahrenheit' ? 'mph' : 'm/s'}`;
  }

  private async searchWeb(args: { query: string; num_results?: number }): Promise<string> {
    const { query, num_results = 5 } = args;
    
    try {
      // Using DuckDuckGo Instant Answer API (no API key required)
      const response = await fetch(
        `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`
      );
      
      if (!response.ok) {
        return this.getMockSearchResults(query, num_results);
      }
      
      const data = await response.json();
      
      if (data.Abstract) {
        return `Search results for "${query}":\n\n${data.Abstract}\n\nSource: ${data.AbstractURL || 'DuckDuckGo'}`;
      } else {
        return this.getMockSearchResults(query, num_results);
      }
    } catch (error) {
      return this.getMockSearchResults(query, num_results);
    }
  }

  private getMockSearchResults(query: string, numResults: number): string {
    const mockResults = [
      'This is a mock search result for demonstration purposes.',
      'In a real implementation, this would show actual web search results.',
      'The search would use APIs like Google Custom Search, Bing Search, or DuckDuckGo.',
      'Results would include titles, snippets, and URLs.',
      'Pagination and filtering options would also be available.'
    ];
    
    const results = mockResults.slice(0, numResults);
    return `Search results for "${query}" (mock data):\n\n${results.map((result, i) => `${i + 1}. ${result}`).join('\n')}`;
  }

  private async calculate(args: { expression: string; precision?: number }): Promise<string> {
    const { expression, precision = 2 } = args;
    
    try {
      // Safe evaluation of mathematical expressions
      const sanitizedExpression = expression.replace(/[^0-9+\-*/()., ]/g, '');
      
      // Using Function constructor for safe evaluation
      const result = new Function(`return ${sanitizedExpression}`)();
      
      if (typeof result === 'number' && !isNaN(result) && isFinite(result)) {
        return `Calculation: ${expression} = ${result.toFixed(precision)}`;
      } else {
        throw new Error('Invalid mathematical expression');
      }
    } catch (error) {
      return `Error calculating "${expression}": Invalid mathematical expression. Please use only numbers, operators (+, -, *, /), and parentheses.`;
    }
  }

  private async translate(args: { text: string; target_language: string; source_language?: string }): Promise<string> {
    const { text, target_language, source_language } = args;
    
    try {
      // Using LibreTranslate API (free, no API key required for demo)
      const response = await fetch('https://libretranslate.de/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          source: source_language || 'auto',
          target: target_language,
        }),
      });
      
      if (!response.ok) {
        return this.getMockTranslation(text, target_language, source_language);
      }
      
      const data = await response.json();
      const detectedLanguage = data.detected?.language || source_language || 'auto';
      
      return `Translation:\n• Original (${detectedLanguage}): ${text}\n• Translated (${target_language}): ${data.translatedText}`;
    } catch (error) {
      return this.getMockTranslation(text, target_language, source_language);
    }
  }

  private getMockTranslation(text: string, targetLanguage: string, sourceLanguage?: string): string {
    const mockTranslations: Record<string, string> = {
      'es': 'Hola mundo',
      'fr': 'Bonjour le monde',
      'de': 'Hallo Welt',
      'it': 'Ciao mondo',
      'pt': 'Olá mundo',
      'ja': 'こんにちは世界',
      'ko': '안녕하세요 세계',
      'zh': '你好世界',
      'ru': 'Привет мир',
      'ar': 'مرحبا بالعالم'
    };
    
    const translation = mockTranslations[targetLanguage] || `[Translated to ${targetLanguage}: ${text}]`;
    const source = sourceLanguage || 'auto';
    
    return `Translation (mock data):\n• Original (${source}): ${text}\n• Translated (${targetLanguage}): ${translation}`;
  }

  private async getStockPrice(args: { symbol: string; include_currency?: boolean; date?: string }): Promise<string> {
    const { symbol, include_currency = false, date } = args;
    
    try {
      // Check if user is asking for historical data
      const isHistoricalQuery = date || symbol.toLowerCase().includes('on') || symbol.toLowerCase().includes('june') || symbol.toLowerCase().includes('2025');
      
      if (isHistoricalQuery) {
        return this.getHistoricalStockPrice(symbol, date);
      }
      
      // Use Alpha Vantage API for current price (better CORS support)
      const apiKey = 'demo'; // Free demo key
      const response = await fetch(
        `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol.toUpperCase()}&apikey=${apiKey}`
      );
      
      if (!response.ok) {
        return this.getMockStockPrice(symbol, include_currency);
      }
      
      const data = await response.json();
      
      if (data['Global Quote']) {
        const quote = data['Global Quote'];
        const price = parseFloat(quote['05. price']);
        const change = parseFloat(quote['09. change']);
        const changePercent = quote['10. change percent'];
        const previousClose = parseFloat(quote['08. previous close']);
        
        let resultText = `Stock Price for ${symbol.toUpperCase()}:\n• Current Price: $${price.toFixed(2)}`;
        
        if (include_currency) {
          resultText += ' USD';
        }
        
        resultText += `\n• Change: ${change >= 0 ? '+' : ''}$${change.toFixed(2)} (${changePercent})`;
        resultText += `\n• Previous Close: $${previousClose.toFixed(2)}`;
        
        return resultText;
      } else {
        return this.getMockStockPrice(symbol, include_currency);
      }
    } catch (error) {
      console.error('Error fetching stock price:', error);
      return this.getMockStockPrice(symbol, include_currency);
    }
  }

  private async getHistoricalStockPrice(symbol: string, date?: string): Promise<string> {
    try {
      // Parse the date from the query or use provided date
      let targetDate = date;
      
      if (!targetDate) {
        // Try to extract date from symbol (e.g., "AMD on June 20, 2025")
        const dateMatch = symbol.match(/(?:on\s+)?(january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{1,2},?\s+\d{4}/i);
        if (dateMatch) {
          targetDate = dateMatch[0];
        }
      }
      
      if (!targetDate) {
        return `Please specify a date for historical stock data. Example: "AMD stock price on June 20, 2024"`;
      }
      
      // Convert date to YYYY-MM-DD format for Alpha Vantage
      let formattedDate: string;
      
      if (targetDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
        // Already in YYYY-MM-DD format
        formattedDate = targetDate;
      } else {
        // Try to parse natural language date
        const dateMatch = targetDate.match(/(january|february|march|april|may|june|july|august|september|october|november|december)\s+(\d{1,2}),?\s+(\d{4})/i);
        if (dateMatch) {
          const monthNames = ['january', 'february', 'march', 'april', 'may', 'june', 
                            'july', 'august', 'september', 'october', 'november', 'december'];
          const monthIndex = monthNames.indexOf(dateMatch[1].toLowerCase());
          const day = parseInt(dateMatch[2]);
          const year = parseInt(dateMatch[3]);
          
          formattedDate = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        } else {
          return `Unable to parse date: ${targetDate}. Please use format like "June 20, 2024" or "2024-06-20"`;
        }
      }
      
      // Check if date is in the future
      const targetDateObj = new Date(formattedDate);
      if (targetDateObj > new Date()) {
        return `Cannot get stock data for future date: ${targetDate}. Historical data is only available for past dates.`;
      }
      
      // Use Alpha Vantage API for historical data
      const apiKey = 'demo'; // Free demo key
      const response = await fetch(
        `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol.toUpperCase()}&apikey=${apiKey}`
      );
      
      if (!response.ok) {
        return `Error fetching historical data for ${symbol.toUpperCase()}. Please check the symbol and try again.`;
      }
      
      const data = await response.json();
      
      if (data['Time Series (Daily)'] && data['Time Series (Daily)'][formattedDate]) {
        const dailyData = data['Time Series (Daily)'][formattedDate];
        const open = parseFloat(dailyData['1. open']);
        const high = parseFloat(dailyData['2. high']);
        const low = parseFloat(dailyData['3. low']);
        const close = parseFloat(dailyData['4. close']);
        const volume = parseInt(dailyData['5. volume']);
        
        const dateObj = new Date(formattedDate);
        const formattedDisplayDate = dateObj.toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
        
        let resultText = `Historical Stock Price for ${symbol.toUpperCase()}:\n• Date: ${formattedDisplayDate}\n• Close Price: $${close.toFixed(2)} USD`;
        resultText += `\n• Open: $${open.toFixed(2)}`;
        resultText += `\n• High: $${high.toFixed(2)}`;
        resultText += `\n• Low: $${low.toFixed(2)}`;
        resultText += `\n• Volume: ${volume.toLocaleString()}`;
        
        return resultText;
      } else {
        // Try to find the closest available date
        if (data['Time Series (Daily)']) {
          const availableDates = Object.keys(data['Time Series (Daily)']).sort();
          const targetTime = targetDateObj.getTime();
          let closestDate = availableDates[0];
          let minDiff = Math.abs(new Date(closestDate).getTime() - targetTime);
          
          for (const date of availableDates) {
            const diff = Math.abs(new Date(date).getTime() - targetTime);
            if (diff < minDiff) {
              minDiff = diff;
              closestDate = date;
            }
          }
          
          const dailyData = data['Time Series (Daily)'][closestDate];
          const close = parseFloat(dailyData['4. close']);
          const open = parseFloat(dailyData['1. open']);
          const high = parseFloat(dailyData['2. high']);
          const low = parseFloat(dailyData['3. low']);
          const volume = parseInt(dailyData['5. volume']);
          
          const dateObj = new Date(closestDate);
          const formattedDisplayDate = dateObj.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          });
          
          let resultText = `Historical Stock Price for ${symbol.toUpperCase()}:\n• Date: ${formattedDisplayDate} (closest available to ${targetDate})\n• Close Price: $${close.toFixed(2)} USD`;
          resultText += `\n• Open: $${open.toFixed(2)}`;
          resultText += `\n• High: $${high.toFixed(2)}`;
          resultText += `\n• Low: $${low.toFixed(2)}`;
          resultText += `\n• Volume: ${volume.toLocaleString()}`;
          
          return resultText;
        } else {
          return `No historical data found for ${symbol.toUpperCase()} on ${targetDate}. Please check the date and symbol.`;
        }
      }
    } catch (error) {
      console.error('Error fetching historical stock price:', error);
      
      // If it's a CORS error, provide a helpful message
      if (error instanceof TypeError && error.message.includes('NetworkError')) {
        return `Network error: Unable to fetch stock data due to CORS restrictions. This is a browser security feature. For now, please use the mock data or try a different approach.`;
      }
      
      return `Error fetching historical data for ${symbol.toUpperCase()}: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  }

  private getMockStockPrice(symbol: string, includeCurrency: boolean): string {
    const mockPrices: Record<string, { price: number; change: number; percent: string }> = {
      'AAPL': { price: 150.25, change: 2.15, percent: '+1.45%' },
      'GOOGL': { price: 2750.80, change: -15.20, percent: '-0.55%' },
      'MSFT': { price: 320.45, change: 5.30, percent: '+1.68%' },
      'TSLA': { price: 245.90, change: -8.75, percent: '-3.44%' },
      'AMZN': { price: 135.60, change: 1.25, percent: '+0.93%' }
    };
    
    const stock = mockPrices[symbol.toUpperCase()] || { price: 100.00, change: 0.00, percent: '0.00%' };
    
    let result = `Stock Price for ${symbol.toUpperCase()} (mock data):\n• Current Price: $${stock.price.toFixed(2)}`;
    
    if (includeCurrency) {
      result += ' USD';
    }
    
    result += `\n• Change: ${stock.change >= 0 ? '+' : ''}$${stock.change.toFixed(2)} (${stock.percent})`;
    
    return result;
  }

  private async getTime(args: { timezone: string; format?: string }): Promise<string> {
    const { timezone, format = '24h' } = args;
    
    try {
      // Using a timezone API or built-in Date functionality
      const now = new Date();
      
      // For demo purposes, we'll use a simple approach
      // In production, you might use a library like moment-timezone or date-fns-tz
      let timeString: string;
      
      if (timezone === 'UTC') {
        timeString = now.toISOString();
      } else {
        // Try to format for the specified timezone
        try {
          timeString = now.toLocaleString('en-US', {
            timeZone: timezone,
            hour12: format === '12h',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          });
        } catch (error) {
          // Fallback to local time with timezone info
          timeString = `${now.toLocaleString('en-US', {
            hour12: format === '12h',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          })} (Local Time)`;
        }
      }
      
      return `Current time in ${timezone}:\n• ${timeString}\n• Format: ${format === '12h' ? '12-hour' : '24-hour'}`;
    } catch (error) {
      return `Error getting time for ${timezone}: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  }
}

export const toolService = ToolService.getInstance(); 