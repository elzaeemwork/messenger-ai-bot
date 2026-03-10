// components/conversations/ConversationDetail.tsx — Full chat view for a conversation

'use client';

import { useRef, useEffect } from 'react';
import { Bot, User } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import MessageBubble from './MessageBubble';
import type { Conversation, Message } from '@/types';

interface ConversationDetailProps {
    conversation: Conversation;
    messages: Message[];
    loading: boolean;
}

export default function ConversationDetail({
    conversation,
    messages,
    loading,
}: ConversationDetailProps) {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center gap-3 p-4 border-b border-slate-800">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-800">
                    <User className="w-5 h-5 text-slate-400" />
                </div>
                <div>
                    <p className="text-sm font-semibold text-slate-200">
                        {conversation.user_name || `User ${conversation.facebook_user_id.slice(-4)}`}
                    </p>
                    <p className="text-[10px] text-slate-500">
                        {conversation.message_count} messages · {conversation.status}
                    </p>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4">
                {loading ? (
                    <div className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className={`flex gap-3 ${i % 2 ? 'flex-row-reverse' : ''}`}>
                                <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                                <Skeleton className="h-16 w-48 rounded-2xl" />
                            </div>
                        ))}
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-500">
                        <Bot className="w-12 h-12 mb-3 opacity-30" />
                        <p className="text-sm">No messages in this conversation</p>
                    </div>
                ) : (
                    <>
                        {messages.map((message) => (
                            <MessageBubble key={message.id} message={message} />
                        ))}
                        <div ref={messagesEndRef} />
                    </>
                )}
            </div>
        </div>
    );
}
