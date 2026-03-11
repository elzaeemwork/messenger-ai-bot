// components/conversations/ConversationDetail.tsx — Full chat view for a conversation

'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import MessageBubble from './MessageBubble';
import type { Conversation, Message } from '@/types';
import { formatDate } from '@/lib/utils/formatters';
import { ArrowLeft, MessageSquare } from 'lucide-react';

interface ConversationDetailProps {
    conversation: Conversation;
    messages: Message[];
    loading: boolean;
    onBack: () => void;
}

export default function ConversationDetail({
    conversation,
    messages,
    loading,
    onBack,
}: ConversationDetailProps) {
    return (
        <Card className="bg-slate-800/50 border-slate-700/50 flex flex-col h-[calc(100vh-12rem)]">
            {/* Header */}
            <CardHeader className="border-b border-slate-700/50 p-4">
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onBack}
                        className="lg:hidden text-slate-400 hover:text-white"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 border border-slate-700 flex items-center justify-center text-sm font-medium text-indigo-300">
                        {conversation.user_name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <h3 className="text-sm font-semibold text-white">{conversation.user_name}</h3>
                            <Badge variant={conversation.status === 'active' ? 'success' : 'secondary'} className="text-[9px]">
                                {conversation.status}
                            </Badge>
                        </div>
                        <p className="text-xs text-slate-500">
                            ID: {conversation.facebook_user_id} • {conversation.message_count} messages
                        </p>
                    </div>
                    <span className="text-[10px] text-slate-600">
                        Since {formatDate(conversation.created_at, 'MMM dd, yyyy')}
                    </span>
                </div>
            </CardHeader>

            {/* Messages */}
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                {loading ? (
                    <div className="space-y-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className={`flex gap-2 ${i % 2 === 0 ? '' : 'justify-end'}`}>
                                <Skeleton className="h-7 w-7 rounded-full" />
                                <Skeleton className="h-16 w-48 rounded-2xl" />
                            </div>
                        ))}
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-500">
                        <MessageSquare className="w-10 h-10 mb-2 opacity-40" />
                        <p className="text-sm">No messages in this conversation</p>
                    </div>
                ) : (
                    messages.map((msg) => <MessageBubble key={msg.id} message={msg} />)
                )}
            </CardContent>
        </Card>
    );
}
