// lib/groq/client.ts — Groq AI client wrapper (OpenAI-compatible API)

import Groq from 'groq-sdk';

let groqClient: Groq | null = null;

function getGroqClient(): Groq {
    if (!groqClient) {
        groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY });
    }
    return groqClient;
}

/**
 * Generate a response using Groq AI (Llama, Mixtral, etc.)
 * Drop-in replacement for the Gemini generateResponse function.
 */
export async function generateResponse(
    systemPrompt: string,
    messages: { role: 'user' | 'assistant'; content: string }[],
    model: string = 'llama-3.3-70b-versatile',
    maxTokens: number = 400
): Promise<{ text: string; tokensUsed: number }> {
    const client = getGroqClient();

    // Map to Groq-compatible format
    const groqModel = mapModel(model);

    const chatMessages: Groq.Chat.ChatCompletionMessageParam[] = [
        { role: 'system', content: systemPrompt },
        ...messages.map((m) => ({
            role: m.role as 'user' | 'assistant',
            content: m.content,
        })),
    ];

    const completion = await client.chat.completions.create({
        model: groqModel,
        messages: chatMessages,
        max_tokens: maxTokens,
        temperature: 0.7,
    });

    const text = completion.choices[0]?.message?.content || '';
    const tokensUsed = completion.usage?.total_tokens || Math.ceil(text.length / 4);

    return { text, tokensUsed };
}

/**
 * Map Gemini model names to equivalent Groq models
 */
function mapModel(model: string): string {
    const modelMap: Record<string, string> = {
        'gemini-2.0-flash': 'llama-3.3-70b-versatile',
        'gemini-1.5-flash': 'llama-3.1-8b-instant',
        'gemini-1.5-pro': 'llama-3.3-70b-versatile',
        'gemini-pro': 'mixtral-8x7b-32768',
    };
    // If it's already a Groq model, use as-is
    if (model.startsWith('llama') || model.startsWith('mixtral') || model.startsWith('gemma')) {
        return model;
    }
    return modelMap[model] || 'llama-3.3-70b-versatile';
}
