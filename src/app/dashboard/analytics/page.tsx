// app/dashboard/analytics/page.tsx — Analytics page with charts and stats

'use client';

import { useAnalytics } from '@/hooks/useAnalytics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { formatNumber, formatDuration } from '@/lib/utils/formatters';
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    PieChart,
    Pie,
    Cell,
} from 'recharts';
import {
    BarChart3, PieChart as PieChartIcon, TrendingUp, Coins, MessageSquare
} from 'lucide-react';

const COLORS = ['#6366f1', '#22d3ee'];

export default function AnalyticsPage() {
    const { stats, statsLoading, analytics, analyticsLoading } = useAnalytics();

    if (analyticsLoading || statsLoading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-8 w-32" />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[...Array(3)].map((_, i) => (
                        <Skeleton key={i} className="h-28 rounded-xl" />
                    ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Skeleton className="h-80 rounded-xl" />
                    <Skeleton className="h-80 rounded-xl" />
                </div>
            </div>
        );
    }

    const totalMessages = (analytics?.userVsBotMessages?.[0]?.value || 0) + (analytics?.userVsBotMessages?.[1]?.value || 0);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white">Analytics</h1>
                <p className="text-sm text-slate-400 mt-1">Detailed performance metrics and usage statistics</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="bg-slate-800/50 border-slate-700/50">
                    <CardContent className="p-5">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                                <MessageSquare className="w-5 h-5 text-indigo-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-white">{formatNumber(totalMessages)}</p>
                                <p className="text-xs text-slate-400">Total Messages</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700/50">
                    <CardContent className="p-5">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                                <Coins className="w-5 h-5 text-cyan-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-white">{formatNumber(analytics?.totalTokensUsed || 0)}</p>
                                <p className="text-xs text-slate-400">Tokens Used</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700/50">
                    <CardContent className="p-5">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-emerald-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-white">${(analytics?.estimatedCost || 0).toFixed(4)}</p>
                                <p className="text-xs text-slate-400">Estimated Cost</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Bar Chart */}
                <Card className="bg-slate-800/50 border-slate-700/50">
                    <CardHeader className="flex flex-row items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-indigo-400" />
                        <CardTitle className="text-base text-white">Messages per Day (30 days)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={analytics?.messagesPerDay || []} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                    <XAxis
                                        dataKey="date"
                                        tick={{ fill: '#64748b', fontSize: 10 }}
                                        tickLine={false}
                                        axisLine={{ stroke: '#1e293b' }}
                                        interval="preserveStartEnd"
                                    />
                                    <YAxis
                                        tick={{ fill: '#64748b', fontSize: 11 }}
                                        tickLine={false}
                                        axisLine={{ stroke: '#1e293b' }}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#1e293b',
                                            border: '1px solid #334155',
                                            borderRadius: '8px',
                                            color: '#f1f5f9',
                                            fontSize: '13px',
                                        }}
                                    />
                                    <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} name="Messages" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Pie Chart */}
                <Card className="bg-slate-800/50 border-slate-700/50">
                    <CardHeader className="flex flex-row items-center gap-2">
                        <PieChartIcon className="w-4 h-4 text-cyan-400" />
                        <CardTitle className="text-base text-white">User vs Bot Messages</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-72 flex items-center justify-center">
                            {totalMessages > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={analytics?.userVsBotMessages || []}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={100}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {analytics?.userVsBotMessages?.map((_, index) => (
                                                <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: '#1e293b',
                                                border: '1px solid #334155',
                                                borderRadius: '8px',
                                                color: '#f1f5f9',
                                                fontSize: '13px',
                                            }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <p className="text-sm text-slate-500">No data available</p>
                            )}
                        </div>
                        {/* Legend */}
                        <div className="flex justify-center gap-6 mt-2">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-indigo-500" />
                                <span className="text-xs text-slate-400">User Messages</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-cyan-400" />
                                <span className="text-xs text-slate-400">Bot Messages</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Top Conversations */}
            <Card className="bg-slate-800/50 border-slate-700/50">
                <CardHeader>
                    <CardTitle className="text-base text-white">Top 5 Most Active Conversations</CardTitle>
                </CardHeader>
                <CardContent>
                    {analytics?.topConversations && analytics.topConversations.length > 0 ? (
                        <div className="space-y-3">
                            {analytics.topConversations.map((conv, idx) => (
                                <div key={conv.id} className="flex items-center gap-3 p-3 rounded-lg bg-slate-900/30">
                                    <span className="text-lg font-bold text-slate-600 w-6 text-center">#{idx + 1}</span>
                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 border border-slate-700 flex items-center justify-center text-sm font-medium text-indigo-300">
                                        {conv.user_name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-white">{conv.user_name}</p>
                                        <p className="text-xs text-slate-500">{conv.facebook_user_id}</p>
                                    </div>
                                    <Badge variant="info" className="text-xs">{conv.message_count} messages</Badge>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-slate-500 text-center py-4">No conversation data available</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
