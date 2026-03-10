// components/dashboard/StatsCards.tsx — Dashboard metrics cards with gradients

'use client';

import { MessageSquare, Users, Zap, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useBotStore } from '@/store/botStore';
import { formatNumber, formatDuration } from '@/lib/utils/formatters';

const statConfig = [
    {
        key: 'totalConversations',
        label: 'Total Conversations',
        icon: MessageSquare,
        gradient: 'from-indigo-500 to-purple-500',
        shadowColor: 'shadow-indigo-500/20',
        format: (v: number) => formatNumber(v),
    },
    {
        key: 'messagesToday',
        label: 'Messages Today',
        icon: Zap,
        gradient: 'from-cyan-500 to-blue-500',
        shadowColor: 'shadow-cyan-500/20',
        format: (v: number) => formatNumber(v),
    },
    {
        key: 'activeUsers',
        label: 'Active Users',
        icon: Users,
        gradient: 'from-emerald-500 to-teal-500',
        shadowColor: 'shadow-emerald-500/20',
        format: (v: number) => formatNumber(v),
    },
    {
        key: 'avgResponseTime',
        label: 'Avg. Response Time',
        icon: Clock,
        gradient: 'from-amber-500 to-orange-500',
        shadowColor: 'shadow-amber-500/20',
        format: (v: number) => formatDuration(v),
    },
];

export default function StatsCards() {
    const { stats, statsLoading } = useBotStore();

    if (statsLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <Card key={i} className="glass border-slate-800">
                        <CardContent className="p-6">
                            <Skeleton className="h-4 w-24 mb-3" />
                            <Skeleton className="h-8 w-16" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {statConfig.map((stat) => (
                <Card key={stat.key} className={`glass border-slate-800 ${stat.shadowColor} shadow-lg`}>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-sm font-medium text-slate-400">{stat.label}</p>
                            <div className={`flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br ${stat.gradient} shadow-lg`}>
                                <stat.icon className="w-5 h-5 text-white" />
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-white">
                            {stat.format((stats as any)[stat.key])}
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
