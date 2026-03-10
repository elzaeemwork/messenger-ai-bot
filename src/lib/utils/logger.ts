// lib/utils/logger.ts — System event logger to Supabase

import { createServerClient } from '@/lib/supabase/server';

type LogLevel = 'info' | 'warning' | 'error';

export async function logEvent(
    level: LogLevel,
    event: string,
    details: Record<string, unknown> = {}
): Promise<void> {
    try {
        const supabase = createServerClient();
        await supabase.from('system_logs').insert({
            level,
            event,
            details,
        });
    } catch (error) {
        console.error('[Logger Error]', error);
        console.log(`[${level.toUpperCase()}] ${event}`, details);
    }
}
