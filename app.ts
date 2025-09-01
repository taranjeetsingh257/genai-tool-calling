import Groq from 'groq-sdk';
import dotenv from 'dotenv';
import { tavily } from '@tavily/core';
import { ChatCompletionMessage, ChatCompletionAssistantMessage } from './types';

dotenv.config();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY as string });

async function main() {
    const messages: ChatCompletionMessage[] = [
        // Set an optional system message. This sets the behavior of the
        // assistant and can be used to provide specific instructions for
        // how it should behave throughout the conversation.
        {
            role: 'system',
            content: `You are a smart personal assistant who answers the asked questions. 
                You have access to the following tools:
                1. webSearch({query}: {query: string}) // Search the latest information and realtime data on the internet.`,
        },
        // Set a user message for the assistant to respond to.
        {
            role: 'user',
            content: 'When was iphone 16 launched',
        },
    ];

    const completions = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        temperature: 0,
        messages: messages,
        tools: [
            {
                type: 'function',
                function: {
                    name: 'webSearch',
                    description:
                        'Search the latest information and realtime data on the internet',
                    parameters: {
                        type: 'object',
                        properties: {
                            query: {
                                type: 'string',
                                description:
                                    'The search query to perform search on.',
                            },
                        },
                        required: ['query'],
                    },
                },
            },
        ],
        tool_choice: 'auto',
    });

    if (completions.choices[0]?.message) {
        messages.push(
            completions.choices[0].message as ChatCompletionAssistantMessage
        );
    }
    const toolCalls = completions.choices[0]?.message.tool_calls;

    if (!toolCalls) {
        console.log(`Assistant: ${completions.choices[0]?.message.content}`);
        return;
    }

    for (const tool of toolCalls) {
        console.log('tool: ', tool);
        // tool:  {
        //   id: '0wpm5z3mz',
        //   type: 'function',
        //   function: { name: 'webSearch', arguments: '{"query":"iPhone 16 launch date"}' }
        // }
        const functionName: string = tool.function.name;
        const functionParams: string = tool.function.arguments;

        if (functionName === 'webSearch') {
            const toolResult = await webSearch(JSON.parse(functionParams));

            console.log('Tool result: ', toolResult);

            messages.push({
                role: 'tool',
                tool_call_id: tool.id,
                name: functionName,
                content: toolResult,
            });
        }
    }

    const completions2 = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        temperature: 0,
        messages: messages,
        tools: [
            {
                type: 'function',
                function: {
                    name: 'webSearch',
                    description:
                        'Search the latest information and realtime data on the internet',
                    parameters: {
                        type: 'object',
                        properties: {
                            query: {
                                type: 'string',
                                description:
                                    'The search query to perform search on.',
                            },
                        },
                        required: ['query'],
                    },
                },
            },
        ],
        tool_choice: 'auto',
    });

    console.log(JSON.stringify(completions2.choices[0]?.message, null, 2));
}

main();

async function webSearch({ query }: { query: string }): Promise<string> {
    console.log('Calling Web Search Tool...');
    const response = await tvly.search(query);
    // console.log('Response: ', response);
    // Response: {
    //   query: 'iPhone 16 launch date',
    //   responseTime: 0.88,
    //   images: [],
    //   results: [
    //     {
    //       title: 'New report confirms iPhone 16 launch is on September 10',
    //       url: 'https://forums.appleinsider.com/discussion/237394/new-report-confirms-iphone-16-launch-is-on-september-10',
    //       content: "Following our original report putting the iPhone 16 and other hardware event on September 10...",
    //       rawContent: null,
    //       score: 0.933969,
    //       publishedDate: undefined,
    //       favicon: undefined
    //     },
    //     {
    //       title: "The official announcement and release dates of Apple's iPhone 16 ...",
    //       url: 'https://www.reddit.com/r/iPhoneAssist/comments/1f2anap/the_official_announcement_and_release_dates_of/',
    //       content: "The official announcement and release dates of Apple's iPhone 16 have been disclosed...",
    //       rawContent: null,
    //       score: 0.8588255,
    //       publishedDate: undefined,
    //       favicon: undefined
    //     },
    //   ],
    //   answer: null,
    //   requestId: '3c4e2fce-4c8d-408e-b35b-9cdf52047766'
    // }
    const finalResult = response.results
        .map((result) => result.content)
        .join('\n\n');
    return finalResult;
}
