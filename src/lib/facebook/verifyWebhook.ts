// lib/facebook/verifyWebhook.ts — Facebook webhook signature verification

import crypto from 'crypto';

export function verifyFacebookSignature(
    payload: string,
    signature: string | null,
    appSecret: string
): boolean {
    if (!signature) return false;

    const expectedSignature = crypto
        .createHmac('sha256', appSecret)
        .update(payload)
        .digest('hex');

    const expectedHeader = `sha256=${expectedSignature}`;

    try {
        return crypto.timingSafeEqual(
            Buffer.from(expectedHeader),
            Buffer.from(signature)
        );
    } catch {
        return false;
    }
}
