// hooks/useSettings.ts — Hook for managing bot settings

'use client';

import { useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useBotStore } from '@/store/botStore';
import type { BotSettings } from '@/types';
import toast from 'react-hot-toast';

export function useSettings() {
    const { settings, settingsLoading, setSettings, setSettingsLoading } = useBotStore();
    const supabase = createClient();

    const fetchSettings = useCallback(async () => {
        try {
            setSettingsLoading(true);
            const { data, error } = await supabase
                .from('bot_settings')
                .select('*')
                .limit(1)
                .single();

            if (error) throw error;
            setSettings(data as BotSettings);
        } catch (error) {
            console.error('Error fetching settings:', error);
            toast.error('Failed to load settings');
        } finally {
            setSettingsLoading(false);
        }
    }, [supabase, setSettings, setSettingsLoading]);

    const updateSettings = useCallback(async (updates: Partial<BotSettings>) => {
        if (!settings?.id) return;

        try {
            const { data, error } = await supabase
                .from('bot_settings')
                .update({ ...updates, updated_at: new Date().toISOString() })
                .eq('id', settings.id)
                .select()
                .single();

            if (error) throw error;
            setSettings(data as BotSettings);
            toast.success('Settings saved successfully!');
        } catch (error) {
            console.error('Error updating settings:', error);
            toast.error('Failed to save settings');
        }
    }, [settings?.id, supabase, setSettings]);

    useEffect(() => {
        fetchSettings();
    }, []);

    return { settings, settingsLoading, updateSettings, refetch: fetchSettings };
}
