// app/dashboard/page.tsx — Main dashboard overview page

'use client';

import { useAnalytics } from '@/hooks/useAnalytics';
import { useConversations } from '@/hooks/useConversations';
import { useBotStore } from '@/store/botStore';
import DashboardStatsCards from '@/components/dashboard/DashboardStatsCards';
import ActivityChart from '@/components/dashboard/ActivityChart';
import RecentConversations from '@/components/dashboard/RecentConversations';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { useSettings } from '@/hooks/useSettings';
import { Bot, Power } from 'lucide-react';

export default function DashboardPage() {
    const { stats, statsLoading, analytics, analyticsLoading } = useAnalytics();
    const { conversations, conversationsLoading } = useConversations();
    const { settings, updateSettings } = useSettings();

    const chartData = analytics?.messagesPerDay?.slice(-7) || [];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Dashboard</h1>
                    <p className="text-sm text-slate-400 mt-1">
                        Overview of your MessengerAI bot performance
                    </p>
                </div>

                {/* Bot Toggle */}
                <Card className="bg-slate-800/50 border-slate-700/50">
                    <CardContent className="p-3 flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${settings?.is_active
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : 'bg-slate-700/50 text-slate-500'
                            }`}>
                            <Power className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-medium text-white">Bot Status</span>
                            <span className={`text-[10px] ${settings?.is_active ? 'text-emerald-400' : 'text-slate-500'}`}>
                                {settings?.is_active ? 'Online & Responding' : 'Offline'}
                            </span>
                        </div>
                        <Switch
                            checked={settings?.is_active || false}
                            onCheckedChange={(checked) => updateSettings({ is_active: checked })}
                            className="ml-2"
                        />
                    </CardContent>
                </Card>
            </div>

            {/* Stats Cards */}
            <DashboardStatsCards stats={stats} loading={statsLoading} />

            {/* Charts & Conversations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ActivityChart data={chartData} loading={analyticsLoading} />
                <RecentConversations conversations={conversations} loading={conversationsLoading} />
            </div>
        </div>
    );
}