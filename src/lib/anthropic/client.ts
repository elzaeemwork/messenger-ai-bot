// lib/anthropic/client.ts — Claude API client wrapper

import Anthropic from '@anthropic-ai/sdk';

let anthropicClient: Anthropic | null = null;

export function getAnthropicClient(): Anthropic {
    if (!anthropicClient) {
        anthropicClient = new Anthropic({
            apiKey: process.env.ANTHROPIC_API_KEY,
        });
    }
    return anthropicClient;
}

export async function generateResponse(
    systemPrompt: string,
    messages: { role: 'user' | 'assistant'; content: string }[],
    model: string = 'claude-sonnet-4-20250514',
    maxTokens: number = 400
): Promise<{ text: string; tokensUsed: number }> {
    const client = getAnthropicClient();

    const response = await client.messages.create({
        model,
        max_tokens: maxTokens,
        system: systemPrompt,
        messages: messages.map((m) => ({
            role: m.role,
            content: m.content,
        })),
    });

    const textBlock = response.content.find((block) => block.type === 'text');
    const text = textBlock ? textBlock.text : '';
    const tokensUsed = (response.usage?.input_tokens || 0) + (response.usage?.output_tokens || 0);

    return { text, tokensUsed };
}
