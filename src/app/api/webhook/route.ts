// app/api/webhook/route.ts — Facebook Messenger Webhook Handler
// GET: Verify webhook subscription
// POST: Process incoming messages via Claude AI

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { generateResponse } from '@/lib/anthropic/client';
import { buildPrompt } from '@/lib/anthropic/buildPrompt';
import { sendFacebookMessage } from '@/lib/facebook/sendMessage';
import { logEvent } from '@/lib/utils/logger';
import type { BotSettings, FacebookWebhookEntry } from '@/types';

export const runtime = 'nodejs';
export const maxDuration = 30;

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const mode = searchParams.get('hub.mode');
    const token = searchParams.get('hub.verify_token');
    const challenge = searchParams.get('hub.challenge');

    const verifyToken = process.env.VERIFY_TOKEN || 'messengerai_verify_2024';

    if (mode === 'subscribe' && token === verifyToken) {
        await logEvent('info', 'Webhook verified successfully');
        return new NextResponse(challenge, { status: 200 });
    }

    return NextResponse.json({ error: 'Verification failed' }, { status: 403 });
}

export async function POST(request: NextRequest) {
    const body = await request.json();

    processWebhookEvent(body).catch((error) => {
        console.error('Webhook processing error:', error);
        logEvent('error', 'Webhook processing failed', { error: error.message });
    });

    return NextResponse.json({ status: 'ok' }, { status: 200 });
}

async function processWebhookEvent(body: { object: string; entry: FacebookWebhookEntry[] }) {
    if (body.object !== 'page') return;

    const supabase = createServerClient();

    const { data: settingsData, error: settingsError } = await supabase
        .from('bot_settings')
        .select('*')
        .limit(1)
        .single();

    if (settingsError || !settingsData) {
        await logEvent('error', 'Failed to load bot settings', { error: settingsError?.message });
        return;
    }

    const settings = settingsData as BotSettings;

    if (!settings.is_active) {
        await logEvent('info', 'Bot is inactive, skipping message');
        return;
    }

    for (const entry of body.entry) {
        for (const event of entry.messaging) {
            if (!event.message?.text) continue;

            const senderId = event.sender.id;
            const messageText = event.message.text;
            const startTime = Date.now();

            try {
                let { data: conversation } = await supabase
                    .from('conversations')
                    .select('*')
                    .eq('facebook_user_id', senderId)
                    .single();

                if (!conversation) {
                    const { data: newConversation } = await supabase
                        .from('conversations')
                        .insert({
                            facebook_user_id: senderId,
                            user_name: `User ${senderId.slice(-4)}`,
                            message_count: 0,
                            last_message: messageText,
                        })
                        .select()
                        .single();
                    conversation = newConversation;
                }

                if (!conversation) {
                    await logEvent('error', 'Failed to create conversation', { senderId });
                    continue;
                }

                await supabase.from('messages').insert({
                    conversation_id: conversation.id,
                    facebook_user_id: senderId,
                    role: 'user',
                    content: messageText,
                    is_ai_generated: false,
                });

                const { data: history } = await supabase
                    .from('messages')
                    .select('role, content')
                    .eq('conversation_id', conversation.id)
                    .order('created_at', { ascending: false })
                    .limit(10);

                const messages = (history || [])
                    .reverse()
                    .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content }));

                const systemPrompt = buildPrompt(settings);
                const { text: aiReply, tokensUsed } = await generateResponse(
                    systemPrompt,
                    messages,
                    settings.ai_model,
                    settings.max_tokens
                );

                const responseTime = Date.now() - startTime;

                await supabase.from('messages').insert({
                    conversation_id: conversation.id,
                    facebook_user_id: senderId,
                    role: 'assistant',
                    content: aiReply,
                    is_ai_generated: true,
                    tokens_used: tokensUsed,
                    response_time_ms: responseTime,
                });

                await supabase
                    .from('conversations')
                    .update({
                        message_count: (conversation.message_count || 0) + 2,
                        last_message: aiReply,
                        last_message_at: new Date().toISOString(),
                    })
                    .eq('id', conversation.id);

                await sendFacebookMessage(senderId, aiReply, settings.page_access_token);

                await logEvent('info', 'Message processed successfully', {
                    senderId,
                    tokensUsed,
                    responseTime,
                });
            } catch (error: any) {
                await logEvent('error', 'Message processing failed', {
                    senderId,
                    error: error.message,
                });
            }
        }
    }
}
