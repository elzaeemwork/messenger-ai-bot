// components/dashboard/RecentConversations.tsx — Last 5 conversations widget

'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { MessageSquare, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import type { Conversation } from '@/types';
import { timeAgo, truncate } from '@/lib/utils/formatters';

import React from 'react';

interface RecentConversationsProps {
    conversations: Conversation[];
    loading: boolean;
}

const RecentConversations: React.FC<RecentConversationsProps> = ({ conversations, loading }) => {
    if (loading) {
        return (
            <Card className="bg-slate-800/50 border-slate-700/50">
                <CardHeader>
                    <Skeleton className="h-5 w-44" />
                </CardHeader>
                <CardContent className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div className="flex-1">
                                <Skeleton className="h-4 w-24 mb-1" />
                                <Skeleton className="h-3 w-48" />
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="bg-slate-800/50 border-slate-700/50">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base font-semibold text-white">
                    Recent Conversations
                </CardTitle>
                <Link href="/dashboard/conversations">
                    <Button variant="ghost" size="sm" className="text-indigo-400 hover:text-indigo-300 gap-1">
                        View All <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                </Link>
            </CardHeader>
            <CardContent>
                {conversations.length === 0 ? (
                    <div className="text-center py-8 text-slate-500">
                        <MessageSquare className="w-10 h-10 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No conversations yet</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {conversations.slice(0, 5).map((conv) => (
                            <Link
                                key={conv.id}
                                href="/dashboard/conversations"
                                className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-700/30 transition-colors group"
                            >
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 border border-slate-700 flex items-center justify-center text-sm font-medium text-indigo-300">
                                    {conv.user_name.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-white truncate">
                                            {conv.user_name}
                                        </span>
                                        <Badge
                                            variant={conv.status === 'active' ? 'success' : 'secondary'}
                                            className="text-[10px] px-1.5"
                                        >
                                            {conv.status}
                                        </Badge>
                                    </div>
                                    <p className="text-xs text-slate-500 truncate">{truncate(conv.last_message, 40)}</p>
                                </div>
                                <span className="text-[10px] text-slate-600 whitespace-nowrap">
                                    {timeAgo(conv.last_message_at)}
                                </span>
                            </Link>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default RecentConversations;