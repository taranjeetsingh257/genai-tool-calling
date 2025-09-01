# Tool Calling in LLMs

# Getting Started

## Prerequisites

Before running this project, you'll need:

1. Node.js and npm installed
2. API keys for:
    - GROQ API - Get it from [console.groq.com](https://console.groq.com/)
    - Tavily Search API - Get it from [tavily.com](https://www.tavily.com/)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/taranjeetsingh257/genai-tool-calling.git
cd tool-calling
```

2. Install dependencies:

```bash
npm install
```

3. Create a .env file in the root directory with your API keys:

```
GROQ_API_KEY=""
TAVILY_API_KEY=""
```

(Oe Rename `.env.exmaple` file to `.env`)

## Running the Application

Start the application in development mode:

```bash
npm run dev
```

This will launch an interactive CLI where you can ask questions and see the tool calling in action.

## Sample Interaction

```
You: when was iphone 16 launched
Calling Web Search Tool...
Assistant: The iPhone 16 was launched on September 20, 2024. It was announced alongside the iPhone 16 Pro and Pro Max during the Apple Event at Apple Park in Cupertino, California, on September 9, 2024. The pre-order for the new iPhone 16 and iPhone 16 Pro started on Friday, September 13, 2024.

You: what is the current weather in Washington, DC?
Calling Web Search Tool...
Assistant: The current weather in Washington, DC is partly cloudy with a temperature of 19.4°C (66.9°F) and a humidity of 59%. The wind is blowing at 2.2 mph (3.6 kph) from the NNE direction. There is no precipitation, and the feels-like temperature is also 19.4°C (66.9°F).

You: Hello! How are you?
Assistant: I'm doing well, thanks for asking. I'm a large language model, so I don't have feelings or emotions like humans do, but I'm functioning properly and ready to help with any questions or tasks you may have. How about you? How's your day going so far?

You: bye
Goodbye!
```

### Why Tool Calling Wasn't Activated for "Hello! How are you?"

The tool calling feature was not activated for the greeting "Hello! How are you?" because:

1. This query doesn't require real-time or external information - it's a conversational prompt that the LLM can handle with its existing knowledge
2. The model is programmed to use tools only when necessary (controlled by `tool_choice: 'auto'` parameter)

In contrast, questions about the iPhone 16 launch date and current weather required access to information beyond the model's training data(`llama-3.3-70b-versatile` [(knowledge cutoff: December 2023)](https://github.com/meta-llama/llama-models/blob/main/models/llama3_3/MODEL_CARD.md), which is why the web search tool was called in those cases.

## Why Tool Calling is Necessary

Large Language Models (LLMs) are trained on data up to a specific cutoff date, which creates limitations when dealing with recent information. This project demonstrates this limitation and how tool calling can solve it.

### Example 1: The iPhone 16 Knowledge Gap

Consider this interaction with `llama-3.3-70b-versatile` [(knowledge cutoff: December 2023)](https://github.com/meta-llama/llama-models/blob/main/models/llama3_3/MODEL_CARD.md):

```javascript
{
  role: 'user',
  content: 'When was iPhone 16 launched',
},
```

Response:

```javascript
{
  role: 'assistant',
  content: "There is no iPhone 16 yet. The latest iPhone models are iPhone 14 series, which were launched on September 7, 2022. Apple typically releases new iPhone models every year, but they have not announced or launched an iPhone 16 model. If you're looking for information on upcoming iPhone models, I'd be happy to provide you with the latest rumors and speculations!"
}
```

This response is incorrect because the iPhone 16 was actually launched on **September 20, 2024**. Today's date is **August 31, 2025**.

### Example 2: The Current Weather Issue

Consider this interaction with `llama-3.3-70b-versatile` [(knowledge cutoff: December 2023)](https://github.com/meta-llama/llama-models/blob/main/models/llama3_3/MODEL_CARD.md):

```javascript
{
role: 'user',
content: 'What is the current weather in Washington, DC',
},
```

Response:

```javascript
{
  role: 'assistant',
  content: "I'm a large language model, I don't have real-time access to current weather conditions. But I can suggest some ways for you to find out the current weather in Washington, DC:\n" +
    '\n' +
    '1. **Check online weather websites**: You can visit websites like AccuWeather, Weather.com, or the National Weather Service (NWS) to get the current weather conditions in Washington, DC.\n' +
    '2. **Use a mobile app**: Download a weather app like Dark Sky, Weather Underground, or The Weather Channel to get real-time weather updates on your smartphone.\n' +
    '3. **Check social media**: Follow local news stations or weather accounts on social media platforms like Twitter or Facebook to get updates on the current weather in Washington, DC.\n' +
    '\n' +
    "Please note that the weather can change rapidly, so it's always a good idea to check multiple sources for the most up-to-date information.\n" +
    '\n' +
    'If you want, I can provide you with general information about the climate in Washington, DC, or help you with anything else. Just let me know!'
}
```

### Solution: Tool Calling

Tool calling allows LLMs to:

1. Recognize when they need external information beyond their knowledge cutoff
2. Make API calls to retrieve up-to-date information
3. Use that information to provide accurate responses

By implementing tool calling, the model could:

-   Recognize it doesn't have information about iPhone 16
-   Call a search API or product database API
-   Return accurate launch information instead of outdated or incorrect responses

For this project, I implemented a Web Search Tool that integrates with the LLM through a structured API interface. When the model encounters queries requiring up-to-date information (like the iPhone 16 launch date, current weather in a city, etc.), it automatically invokes this tool, fetches real-time data from search engines, and incorporates the retrieved information into its response. This implementation demonstrates how tool calling can overcome the knowledge cutoff limitations of LLMs by providing access to current information without requiring model retraining.

Available options for these tools:

1.  [Google Search API](https://serper.dev/)
2.  [Brave Browser Search](https://brave.com/search/api/)
3.  [Tavily Search](https://www.tavily.com/)

Used for this project: [Tavily Search](https://www.tavily.com/)

## Resources

GROQ:

-   [Quickstart Guide](https://console.groq.com/docs/quickstart)
-   [Tool Use Documentation](https://console.groq.com/docs/tool-use)

Tavily:

-   [Quickstart](https://docs.tavily.com/documentation/quickstart)
-   [Tavily Search API Reference](https://docs.tavily.com/documentation/api-reference/endpoint/search)
