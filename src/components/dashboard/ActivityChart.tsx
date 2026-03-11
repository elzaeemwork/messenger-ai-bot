// components/dashboard/ActivityChart.tsx — Line chart showing messages per day

'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from 'recharts';

import React from 'react';

interface ActivityChartProps {
    data: { date: string; count: number }[];
    loading: boolean;
}

const ActivityChart: React.FC<ActivityChartProps> = ({ data, loading }) => {
    if (loading) {
        return (
            <Card className="bg-slate-800/50 border-slate-700/50">
                <CardHeader>
                    <Skeleton className="h-5 w-36" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-64 w-full rounded-lg" />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="bg-slate-800/50 border-slate-700/50">
            <CardHeader>
                <CardTitle className="text-base font-semibold text-white">
                    Messages Activity
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                            <defs>
                                <linearGradient id="colorMessages" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                            <XAxis
                                dataKey="date"
                                tick={{ fill: '#64748b', fontSize: 11 }}
                                tickLine={false}
                                axisLine={{ stroke: '#1e293b' }}
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
                            <Area
                                type="monotone"
                                dataKey="count"
                                stroke="#6366f1"
                                strokeWidth={2}
                                fill="url(#colorMessages)"
                                name="Messages"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
};

export default ActivityChart;