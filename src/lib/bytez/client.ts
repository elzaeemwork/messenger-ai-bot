// lib/bytez/client.ts — Bytez AI client (primary AI provider)
// Uses google/gemma-4-E4B-it as default, with automatic model mapping

import Bytez from 'bytez.js';

let bytezInstance: Bytez | null = null;

function getBytez(): Bytez {
    if (!bytezInstance) {
        bytezInstance = new Bytez(process.env.BYTEZ_API_KEY!);
    }
    return bytezInstance;
}

/**
 * Generate a response using Bytez AI (google/gemma-4-E4B-it or similar)
 * Drop-in replacement for the Gemini/Groq generateResponse function.
 */
export async function generateResponse(
    systemPrompt: string,
    messages: { role: 'user' | 'assistant'; content: string }[],
    modelName: string = 'google/gemma-4-E4B-it',
    maxTokens: number = 400
): Promise<{ text: string; tokensUsed: number }> {
    const sdk = getBytez();
    const bytezModel = sdk.model(mapModel(modelName));

    // Build messages with system prompt injected at the start
    const allMessages = [
        { role: 'system', content: systemPrompt },
        ...messages,
    ];

    const { error, output } = await bytezModel.run(allMessages);

    if (error) {
        throw new Error(typeof error === 'string' ? error : JSON.stringify(error));
    }

    // Bytez returns: {role: "assistant", content: "..."} or OpenAI-format
    const text =
        (output as any)?.content ||
        (output as any)?.choices?.[0]?.message?.content ||
        '';

    if (!text) {
        throw new Error('Empty response from Bytez: ' + JSON.stringify(output));
    }

    const tokensUsed = Math.ceil(
        (systemPrompt.length + messages.reduce((a, m) => a + m.content.length, 0) + text.length) / 4
    );

    return { text, tokensUsed };
}

/**
 * Map Gemini/Groq model names to Bytez-supported models.
 * Defaults to gemma-4-E4B-it (free, fast, multilingual).
 */
function mapModel(model: string): string {
    // If already a Bytez model (has /), use as-is
    if (model.includes('/')) return model;

    const modelMap: Record<string, string> = {
        'gemini-2.0-flash': 'google/gemma-4-E4B-it',
        'gemini-1.5-flash': 'google/gemma-4-E4B-it',
        'gemini-1.5-pro': 'google/gemma-4-E4B-it',
        'llama-3.3-70b-versatile': 'google/gemma-4-E4B-it',
    };

    return modelMap[model] || 'google/gemma-4-E4B-it';
}
