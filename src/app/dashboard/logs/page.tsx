// app/dashboard/logs/page.tsx — System logs viewer with auto-refresh and filtering

'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils/cn';
import type { SystemLog } from '@/types';
import { formatDate } from '@/lib/utils/formatters';
import appConfig from '@/config/app.config';
import {
    FileText, RefreshCw, Trash2, Filter, AlertCircle, Info, AlertTriangle
} from 'lucide-react';
import toast from 'react-hot-toast';

const levelConfig = {
    info: { icon: Info, color: 'text-blue-400', bg: 'bg-blue-500/10', badge: 'info' as const },
    warning: { icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/10', badge: 'warning' as const },
    error: { icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-500/10', badge: 'destructive' as const },
};

type LogLevel = 'all' | 'info' | 'warning' | 'error';

export default function LogsPage() {
    const [logs, setLogs] = useState<SystemLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<LogLevel>('all');
    const [autoRefresh, setAutoRefresh] = useState(true);
    const supabase = createClient();

    const fetchLogs = useCallback(async () => {
        try {
            let query = supabase
                .from('system_logs')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(100);

            if (filter !== 'all') {
                query = query.eq('level', filter);
            }

            const { data, error } = await query;
            if (error) throw error;
            setLogs((data || []) as SystemLog[]);
        } catch (error) {
            console.error('Error fetching logs:', error);
        } finally {
            setLoading(false);
        }
    }, [supabase, filter]);

    // Initial fetch
    useEffect(() => {
        fetchLogs();
    }, [filter]);

    // Auto-refresh
    useEffect(() => {
        if (!autoRefresh) return;
        const interval = setInterval(fetchLogs, appConfig.logsRefreshInterval);
        return () => clearInterval(interval);
    }, [autoRefresh, fetchLogs]);

    const clearLogs = async () => {
        try {
            const { error } = await supabase.from('system_logs').delete().neq('id', '');
            if (error) throw error;
            setLogs([]);
            toast.success('Logs cleared');
        } catch {
            toast.error('Failed to clear logs');
        }
    };

    const filters: { id: LogLevel; label: string }[] = [
        { id: 'all', label: 'All' },
        { id: 'info', label: 'Info' },
        { id: 'warning', label: 'Warning' },
        { id: 'error', label: 'Error' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">System Logs</h1>
                    <p className="text-sm text-slate-400 mt-1">Monitor bot activity and troubleshoot issues</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={fetchLogs}
                        className="gap-1 border-slate-700 hover:bg-slate-700 text-xs"
                    >
                        <RefreshCw className="w-3 h-3" /> Refresh
                    </Button>
                    <Button
                        variant={autoRefresh ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setAutoRefresh(!autoRefresh)}
                        className={cn(
                            'text-xs',
                            autoRefresh ? 'bg-emerald-600 hover:bg-emerald-500' : 'border-slate-700 hover:bg-slate-700'
                        )}
                    >
                        {autoRefresh ? '\u25cf Auto' : '\u25cb Auto'}
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={clearLogs}
                        className="gap-1 border-red-900/50 text-red-400 hover:bg-red-500/10 hover:text-red-300 text-xs"
                    >
                        <Trash2 className="w-3 h-3" /> Clear
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2">
                {filters.map((f) => (
                    <button
                        key={f.id}
                        onClick={() => setFilter(f.id)}
                        className={cn(
                            'px-3 py-1.5 rounded-full text-xs font-medium transition-all',
                            filter === f.id
                                ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                                : 'text-slate-500 hover:text-slate-300 border border-transparent hover:border-slate-700'
                        )}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            {/* Logs Table */}
            <Card className="bg-slate-800/50 border-slate-700/50">
                <CardContent className="p-0">
                    {loading ? (
                        <div className="p-4 space-y-3">
                            {[...Array(8)].map((_, i) => (
                                <Skeleton key={i} className="h-12 w-full rounded-lg" />
                            ))}
                        </div>
                    ) : logs.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-slate-500">
                            <FileText className="w-12 h-12 mb-3 opacity-30" />
                            <p className="text-sm font-medium">No logs found</p>
                            <p className="text-xs mt-1">System activity will appear here</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-700/30">
                            {logs.map((log) => {
                                const config = levelConfig[log.level] || levelConfig.info;
                                const Icon = config.icon;
                                return (
                                    <div key={log.id} className="flex items-start gap-3 p-4 hover:bg-slate-700/10 transition-colors">
                                        <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5', config.bg)}>
                                            <Icon className={cn('w-4 h-4', config.color)} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <Badge variant={config.badge} className="text-[9px] uppercase">
                                                    {log.level}
                                                </Badge>
                                                <span className="text-sm font-medium text-white">{log.event}</span>
                                            </div>
                                            {log.details && Object.keys(log.details).length > 0 && (
                                                <pre className="text-xs text-slate-500 mt-1 font-mono truncate max-w-full">
                                                    {JSON.stringify(log.details, null, 0)}
                                                </pre>
                                            )}
                                        </div>
                                        <span className="text-[10px] text-slate-600 whitespace-nowrap shrink-0">
                                            {formatDate(log.created_at, 'HH:mm:ss')}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
