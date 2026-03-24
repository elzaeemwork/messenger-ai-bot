// lib/gemini/client.ts — Google Gemini API client wrapper

import { GoogleGenerativeAI, type GenerativeModel } from '@google/generative-ai';

let genAI: GoogleGenerativeAI | null = null;

/**
 * Get or create the Google GenAI client instance
 */
function getGenAIClient(): GoogleGenerativeAI {
    if (!genAI) {
        genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    }
    return genAI;
}

/**
 * Generate a response using Google Gemini AI
 */
export async function generateResponse(
    systemPrompt: string,
    messages: { role: 'user' | 'assistant'; content: string }[],
    model: string = 'gemini-2.0-flash',
    maxTokens: number = 400
): Promise<{ text: string; tokensUsed: number }> {
    const client = getGenAIClient();
    const genModel = client.getGenerativeModel({
        model,
        systemInstruction: systemPrompt,
        generationConfig: {
            maxOutputTokens: maxTokens,
            temperature: 0.7,
        },
    });

    // Convert message history to Gemini format (excluding last message)
    const rawHistory = messages.slice(0, -1).map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
    }));

    // Gemini requires history to start with 'user' role — drop any leading 'model' messages
    const firstUserIdx = rawHistory.findIndex((m) => m.role === 'user');
    const history = firstUserIdx >= 0 ? rawHistory.slice(firstUserIdx) : [];

    // The last message is the user's current message
    const lastMessage = messages[messages.length - 1];

    const chat = genModel.startChat({
        history: history.length > 0 ? history : undefined,
    });

    const result = await chat.sendMessage(lastMessage.content);
    const response = result.response;
    const text = response.text();

    // Estimate tokens (Gemini doesn't always return exact token counts in all SDKs)
    const tokensUsed = response.usageMetadata?.totalTokenCount ||
        Math.ceil((systemPrompt.length + messages.reduce((a, m) => a + m.content.length, 0) + text.length) / 4);

    return { text, tokensUsed };
}
