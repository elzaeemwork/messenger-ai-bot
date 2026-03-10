// app/api/send-message/route.ts — Manual message send endpoint

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { sendFacebookMessage } from '@/lib/facebook/sendMessage';
import { logEvent } from '@/lib/utils/logger';
import type { BotSettings } from '@/types';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
    try {
        const { facebookUserId, message, conversationId } = await request.json();

        if (!facebookUserId || !message) {
            return NextResponse.json(
                { error: 'Missing facebookUserId or message' },
                { status: 400 }
            );
        }

        const supabase = createServerClient();

        const { data: settings, error: settingsError } = await supabase
            .from('bot_settings')
            .select('page_access_token')
            .limit(1)
            .single();

        if (settingsError || !settings?.page_access_token) {
            throw new Error('Page access token not configured');
        }

        await sendFacebookMessage(
            facebookUserId,
            message,
            settings.page_access_token
        );

        if (conversationId) {
            await supabase.from('messages').insert({
                conversation_id: conversationId,
                facebook_user_id: facebookUserId,
                role: 'assistant',
                content: message,
                is_ai_generated: false,
            });

            await supabase
                .from('conversations')
                .update({
                    last_message: message,
                    last_message_at: new Date().toISOString(),
                })
                .eq('id', conversationId);
        }

        await logEvent('info', 'Manual message sent', { facebookUserId });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        await logEvent('error', 'Manual message failed', { error: error.message });
        return NextResponse.json(
            { error: error.message || 'Failed to send message' },
            { status: 500 }
        );
    }
}
