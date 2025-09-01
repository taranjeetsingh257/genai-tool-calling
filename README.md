# Tool Calling in LLMs

## Why Tool Calling is Necessary

Large Language Models (LLMs) are trained on data up to a specific cutoff date, which creates limitations when dealing with recent information. This project demonstrates this limitation and how tool calling can solve it.

### Example: The iPhone 16 Knowledge Gap

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

### Solution: Tool Calling

Tool calling allows LLMs to:

1. Recognize when they need external information beyond their knowledge cutoff
2. Make API calls to retrieve up-to-date information
3. Use that information to provide accurate responses

By implementing tool calling, the model could:

-   Recognize it doesn't have information about iPhone 16
-   Call a search API or product database API
-   Return accurate launch information instead of outdated or incorrect responses

## Resources

GROQ documentation used in this project:

-   [Quickstart Guide](https://console.groq.com/docs/quickstart)
-   [Tool Use Documentation](https://console.groq.com/docs/tool-use)

```

```
