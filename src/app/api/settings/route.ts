// app/api/settings/route.ts — Bot settings API (GET + PUT)

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

export async function GET() {
    try {
        const supabase = createServerClient();
        const { data, error } = await supabase
            .from('bot_settings')
            .select('*')
            .limit(1)
            .single();

        if (error) throw error;

        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || 'Failed to load settings' },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest) {
    try {
        const supabase = createServerClient();
        const body = await request.json();

        const { data: existing, error: fetchError } = await supabase
            .from('bot_settings')
            .select('id')
            .limit(1)
            .single();

        if (fetchError || !existing) {
            throw new Error('Settings not found');
        }

        const { data, error } = await supabase
            .from('bot_settings')
            .update({
                ...body,
                updated_at: new Date().toISOString(),
            })
            .eq('id', existing.id)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || 'Failed to update settings' },
            { status: 500 }
        );
    }
}
