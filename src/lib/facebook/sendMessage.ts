// lib/facebook/sendMessage.ts — Send messages via Facebook Graph API

import axios from 'axios';
import appConfig from '@/config/app.config';

export async function sendFacebookMessage(
    recipientId: string,
    messageText: string,
    pageAccessToken: string
): Promise<void> {
    const url = `https://graph.facebook.com/${appConfig.facebookApiVersion}/me/messages`;

    try {
        await axios.post(
            url,
            {
                recipient: { id: recipientId },
                message: { text: messageText },
                messaging_type: 'RESPONSE',
            },
            {
                headers: { 'Content-Type': 'application/json' },
                params: { access_token: pageAccessToken },
            }
        );
    } catch (error: any) {
        const errorMsg = error?.response?.data?.error?.message || error.message;
        throw new Error(`Facebook API Error: ${errorMsg}`);
    }
}
