// components/conversations/ConversationList.tsx — List of all conversations

'use client';

import { MessageSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils/cn';
import { timeAgo, truncate } from '@/lib/utils/formatters';
import type { Conversation } from '@/types';

interface ConversationListProps {
    conversations: Conversation[];
    loading: boolean;
    selectedId: string | null;
    onSelect: (conversation: Conversation) => void;
}

export default function ConversationList({
    conversations,
    loading,
    selectedId,
    onSelect,
}: ConversationListProps) {
    if (loading) {
        return (
            <div className="space-y-3">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3 p-3">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="flex-1">
                            <Skeleton className="h-4 w-24 mb-1" />
                            <Skeleton className="h-3 w-36" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (conversations.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-slate-500">
                <MessageSquare className="w-12 h-12 mb-3 opacity-30" />
                <p className="text-sm">No conversations found</p>
            </div>
        );
    }

    return (
        <div className="space-y-1">
            {conversations.map((conv) => (
                <button
                    key={conv.id}
                    onClick={() => onSelect(conv)}
                    className={cn(
                        'flex items-center gap-3 w-full p-3 rounded-lg text-left transition-all duration-200',
                        selectedId === conv.id
                            ? 'bg-indigo-500/15 border border-indigo-500/30'
                            : 'hover:bg-slate-800/50 border border-transparent'
                    )}
                >
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-800 shrink-0">
                        <MessageSquare className="w-4 h-4 text-slate-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-slate-200 truncate">
                                {conv.user_name || `User ${conv.facebook_user_id.slice(-4)}`}
                            </p>
                            <span className="text-[10px] text-slate-500 shrink-0 ml-2">
                                {timeAgo(conv.last_message_at || conv.created_at)}
                            </span>
                        </div>
                        <p className="text-xs text-slate-400 truncate mt-0.5">
                            {truncate(conv.last_message || 'No messages', 35)}
                        </p>
                    </div>
                    <Badge variant="secondary" className="text-[10px] shrink-0">
                        {conv.message_count}
                    </Badge>
                </button>
            ))}
        </div>
    );
}
