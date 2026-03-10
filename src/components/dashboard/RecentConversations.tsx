// components/dashboard/RecentConversations.tsx — Latest conversations list

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { MessageSquare, ArrowRight } from 'lucide-react';
import { timeAgo, truncate } from '@/lib/utils/formatters';
import type { Conversation } from '@/types';

export default function RecentConversations() {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchConversations() {
            const supabase = createClient();
            const { data } = await supabase
                .from('conversations')
                .select('*')
                .order('last_message_at', { ascending: false })
                .limit(5);

            setConversations((data || []) as Conversation[]);
            setLoading(false);
        }

        fetchConversations();
    }, []);

    if (loading) {
        return (
            <Card className="glass border-slate-800">
                <CardHeader><CardTitle className="text-lg">Recent Conversations</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div className="flex-1">
                                <Skeleton className="h-4 w-24 mb-1" />
                                <Skeleton className="h-3 w-36" />
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="glass border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg text-slate-200">Recent Conversations</CardTitle>
                <Link href="/dashboard/conversations" className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                    View all <ArrowRight className="w-3 h-3" />
                </Link>
            </CardHeader>
            <CardContent className="space-y-3">
                {conversations.length === 0 ? (
                    <p className="text-sm text-slate-500 text-center py-8">No conversations yet</p>
                ) : (
                    conversations.map((conv) => (
                        <Link
                            key={conv.id}
                            href="/dashboard/conversations"
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800/50 transition-colors"
                        >
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-800">
                                <MessageSquare className="w-4 h-4 text-slate-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium text-slate-200">
                                        {conv.user_name || `User ${conv.facebook_user_id.slice(-4)}`}
                                    </p>
                                    <span className="text-[10px] text-slate-500">{timeAgo(conv.last_message_at || conv.created_at)}</span>
                                </div>
                                <p className="text-xs text-slate-400 truncate">{truncate(conv.last_message || '', 40)}</p>
                            </div>
                            <Badge variant={conv.status === 'active' ? 'success' : 'secondary'} className="text-[10px]">
                                {conv.message_count}
                            </Badge>
                        </Link>
                    ))
                )}
            </CardContent>
        </Card>
    );
}
