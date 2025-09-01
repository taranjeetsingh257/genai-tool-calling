import Groq from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function main() {
    const completions = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        temperature: 0,
        messages: [
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
        ],
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
        }
    }

    // console.log(JSON.stringify(completions.choices[0]?.message, null, 2));
}

main();

async function webSearch({ query }: { query: string }): Promise<string> {
    console.log('Calling Web Search Tool...');
    return 'Iphone was launched on 20 September 2024';
}
