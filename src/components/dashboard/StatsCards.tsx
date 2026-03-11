// components/dashboard/StatsCards.tsx — Dashboard stats overview cards

'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { MessageSquare, Users, Zap, Clock } from 'lucide-react';
import type { DashboardStats } from '@/types';
import { formatNumber, formatDuration } from '@/lib/utils/formatters';

import React from 'react';

interface StatsCardsProps {
    stats: DashboardStats;
    loading: boolean;
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats, loading }) => {
    const statsConfig = [
        {
            key: 'totalConversations' as const,
            label: 'Total Conversations',
            icon: MessageSquare,
            color: 'from-indigo-500 to-indigo-600',
            shadow: 'shadow-indigo-500/20',
            format: formatNumber,
        },
        {
            key: 'messagesToday' as const,
            label: 'Messages Today',
            icon: Zap,
            color: 'from-cyan-500 to-cyan-600',
            shadow: 'shadow-cyan-500/20',
            format: formatNumber,
        },
        {
            key: 'activeUsers' as const,
            label: 'Active Users',
            icon: Users,
            color: 'from-emerald-500 to-emerald-600',
            shadow: 'shadow-emerald-500/20',
            format: formatNumber,
        },
        {
            key: 'avgResponseTime' as const,
            label: 'Avg Response Time',
            icon: Clock,
            color: 'from-amber-500 to-amber-600',
            shadow: 'shadow-amber-500/20',
            format: formatDuration,
        },
    ];

    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <Card key={i} className="bg-slate-800/50 border-slate-700/50">
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
            {statsConfig.map((config) => (
                <Card
                    key={config.key}
                    className="bg-slate-800/50 border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 group"
                >
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm text-slate-400 font-medium">{config.label}</span>
                            <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${config.color} ${config.shadow} shadow-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
                                <config.icon className="w-4.5 h-4.5 text-white" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-white">
                            {config.format(stats[config.key])}
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default StatsCards;