// hooks/useAnalytics.ts — Hook for fetching analytics data

'use client';

import { useEffect, useCallback, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useBotStore } from '@/store/botStore';
import type { AnalyticsData } from '@/types';
import { subDays, format, startOfDay } from 'date-fns';
import toast from 'react-hot-toast';

export function useAnalytics() {
    const { stats, statsLoading, setStats, setStatsLoading } = useBotStore();
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
    const [analyticsLoading, setAnalyticsLoading] = useState(true);
    const supabase = createClient();

    const fetchStats = useCallback(async () => {
        try {
            setStatsLoading(true);
            const today = startOfDay(new Date()).toISOString();

            // Total conversations
            const { count: totalConversations } = await supabase
                .from('conversations')
                .select('*', { count: 'exact', head: true });

            // Messages today
            const { count: messagesToday } = await supabase
                .from('messages')
                .select('*', { count: 'exact', head: true })
                .gte('created_at', today);

            // Active users (conversations with messages in last 24h)
            const { count: activeUsers } = await supabase
                .from('conversations')
                .select('*', { count: 'exact', head: true })
                .eq('status', 'active')
                .gte('last_message_at', subDays(new Date(), 1).toISOString());

            // Average response time
            const { data: responseData } = await supabase
                .from('messages')
                .select('response_time_ms')
                .eq('role', 'assistant')
                .gt('response_time_ms', 0)
                .limit(100)
                .order('created_at', { ascending: false });

            const avgResponseTime = responseData && responseData.length > 0
                ? Math.round(responseData.reduce((acc: number, m: { response_time_ms: number }) => acc + m.response_time_ms, 0) / responseData.length)
                : 0;

            setStats({
                totalConversations: totalConversations || 0,
                messagesToday: messagesToday || 0,
                activeUsers: activeUsers || 0,
                avgResponseTime,
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setStatsLoading(false);
        }
    }, [supabase, setStats, setStatsLoading]);

    const fetchAnalytics = useCallback(async () => {
        try {
            setAnalyticsLoading(true);
            const thirtyDaysAgo = subDays(new Date(), 30).toISOString();

            // Messages per day (last 30 days)
            const { data: messagesData } = await supabase
                .from('messages')
                .select('created_at')
                .gte('created_at', thirtyDaysAgo)
                .order('created_at', { ascending: true });

            const messagesPerDay: Record<string, number> = {};
            for (let i = 29; i >= 0; i--) {
                const date = format(subDays(new Date(), i), 'MMM dd');
                messagesPerDay[date] = 0;
            }
            messagesData?.forEach((m: { created_at: string }) => {
                const date = format(new Date(m.created_at), 'MMM dd');
                if (messagesPerDay[date] !== undefined) {
                    messagesPerDay[date]++;
                }
            });

            // User vs Bot messages
            const { count: userMessages } = await supabase
                .from('messages')
                .select('*', { count: 'exact', head: true })
                .eq('role', 'user');

            const { count: botMessages } = await supabase
                .from('messages')
                .select('*', { count: 'exact', head: true })
                .eq('role', 'assistant');

            // Top 5 conversations
            const { data: topConversations } = await supabase
                .from('conversations')
                .select('*')
                .order('message_count', { ascending: false })
                .limit(5);

            // Total tokens used
            const { data: tokensData } = await supabase
                .from('messages')
                .select('tokens_used')
                .eq('role', 'assistant');

            const totalTokensUsed = tokensData?.reduce((acc: number, m: { tokens_used: number }) => acc + (m.tokens_used || 0), 0) || 0;

            setAnalytics({
                messagesPerDay: Object.entries(messagesPerDay).map(([date, count]) => ({ date, count })),
                userVsBotMessages: [
                    { name: 'User Messages', value: userMessages || 0 },
                    { name: 'Bot Messages', value: botMessages || 0 },
                ],
                topConversations: (topConversations || []) as any,
                totalTokensUsed,
                estimatedCost: totalTokensUsed * 0.000003, // rough estimate
            });
        } catch (error) {
            console.error('Error fetching analytics:', error);
            toast.error('Failed to load analytics');
        } finally {
            setAnalyticsLoading(false);
        }
    }, [supabase]);

    useEffect(() => {
        fetchStats();
        fetchAnalytics();
    }, []);

    return { stats, statsLoading, analytics, analyticsLoading, refetchStats: fetchStats, refetchAnalytics: fetchAnalytics };
}
