import Groq from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function main() {
    const completions = await getGroqChatCompletions();
    console.log(completions.choices[0]?.message);
}

const getGroqChatCompletions = async () => {
    return groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        temperature: 0,
        messages: [
            // Set an optional system message. This sets the behavior of the
            // assistant and can be used to provide specific instructions for
            // how it should behave throughout the conversation.
            {
                role: 'system',
                content: `You are a smart personal assistant who answers the asked questions.`,
            },
            // Set a user message for the assistant to respond to.
            {
                role: 'user',
                content: 'When was iphone 16 launched',
            },
        ],
    });
};

main();
