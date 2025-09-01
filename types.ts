export type ChatCompletionSystemMessage = {
    role: 'system';
    content: string;
    name?: string;
};

export type ChatCompletionUserMessage = {
    role: 'user';
    content: string;
    name?: string;
};

export type ChatCompletionAssistantMessage = {
    role: 'assistant';
    content: string | null;
    tool_calls?: Array<{
        id: string;
        function: {
            name: string;
            arguments: string;
        };
        type: 'function';
    }>;
};

export type ChatCompletionToolMessage = {
    role: 'tool';
    content: string;
    tool_call_id: string;
    name: string;
};

export type ChatCompletionMessage =
    | ChatCompletionSystemMessage
    | ChatCompletionUserMessage
    | ChatCompletionAssistantMessage
    | ChatCompletionToolMessage;
