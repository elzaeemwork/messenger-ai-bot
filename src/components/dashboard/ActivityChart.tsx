// components/dashboard/ActivityChart.tsx — Message activity area chart (Recharts)

'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { subDays, format } from 'date-fns';

export default function ActivityChart() {
    const [data, setData] = useState<{ date: string; messages: number }[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            const supabase = createClient();
            const sevenDaysAgo = subDays(new Date(), 7).toISOString();

            const { data: messages } = await supabase
                .from('messages')
                .select('created_at')
                .gte('created_at', sevenDaysAgo)
                .order('created_at', { ascending: true });

            const dailyCounts: Record<string, number> = {};
            for (let i = 6; i >= 0; i--) {
                const date = format(subDays(new Date(), i), 'EEE');
                dailyCounts[date] = 0;
            }

            messages?.forEach((m) => {
                const day = format(new Date(m.created_at), 'EEE');
                if (dailyCounts[day] !== undefined) {
                    dailyCounts[day]++;
                }
            });

            setData(Object.entries(dailyCounts).map(([date, messages]) => ({ date, messages })));
            setLoading(false);
        }

        fetchData();
    }, []);

    if (loading) {
        return (
            <Card className="glass border-slate-800">
                <CardHeader><CardTitle className="text-lg">Activity</CardTitle></CardHeader>
                <CardContent><Skeleton className="h-64 w-full" /></CardContent>
            </Card>
        );
    }

    return (
        <Card className="glass border-slate-800">
            <CardHeader>
                <CardTitle className="text-lg text-slate-200">Message Activity</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorMessages" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                        <YAxis stroke="#64748b" fontSize={12} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#1e293b',
                                border: '1px solid #334155',
                                borderRadius: '8px',
                                color: '#f1f5f9',
                            }}
                        />
                        <Area type="monotone" dataKey="messages" stroke="#6366f1" fillOpacity={1} fill="url(#colorMessages)" strokeWidth={2} />
                    </AreaChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
