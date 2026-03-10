// app/dashboard/conversations/page.tsx — Conversations page with list and detail view

'use client';

import { useState } from 'react';
import { useConversations } from '@/hooks/useConversations';
import ConversationList from '@/components/conversations/ConversationList';
import ConversationDetail from '@/components/conversations/ConversationDetail';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

const filters = [
    { id: 'all' as const, label: 'All' },
    { id: 'active' as const, label: 'Active' },
    { id: 'archived' as const, label: 'Archived' },
];

export default function ConversationsPage() {
    const {
        conversations,
        conversationsLoading,
        selectedConversation,
        messages,
        messagesLoading,
        filter,
        setFilter,
        searchQuery,
        setSearchQuery,
        selectConversation,
        setSelectedConversation,
    } = useConversations();

    return (
        <div className="space-y-4">
            <div>
                <h1 className="text-2xl font-bold text-white">Conversations</h1>
                <p className="text-sm text-slate-400 mt-1">View and manage all bot conversations</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 h-[calc(100vh-12rem)]">
                {/* Conversation List */}
                <Card className={cn(
                    'bg-slate-800/50 border-slate-700/50 lg:col-span-2 flex flex-col',
                    selectedConversation ? 'hidden lg:flex' : 'flex'
                )}>
                    <CardHeader className="border-b border-slate-700/50 p-4 space-y-3">
                        {/* Search */}
                        <div className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                            <Input
                                placeholder="Search conversations..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 bg-slate-900/50 border-slate-700/50 h-9 text-sm"
                            />
                        </div>

                        {/* Filters */}
                        <div className="flex gap-2">
                            {filters.map((f) => (
                                <button
                                    key={f.id}
                                    onClick={() => setFilter(f.id)}
                                    className={cn(
                                        'px-3 py-1 rounded-full text-xs font-medium transition-all',
                                        filter === f.id
                                            ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                                            : 'text-slate-500 hover:text-slate-300 border border-transparent hover:border-slate-700'
                                    )}
                                >
                                    {f.label}
                                </button>
                            ))}
                        </div>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-y-auto p-2">
                        <ConversationList
                            conversations={conversations}
                            loading={conversationsLoading}
                            selectedId={selectedConversation?.id || null}
                            onSelect={selectConversation}
                        />
                    </CardContent>
                </Card>

                {/* Conversation Detail */}
                <div className={cn(
                    'lg:col-span-3',
                    selectedConversation ? 'block' : 'hidden lg:flex lg:items-center lg:justify-center'
                )}>
                    {selectedConversation ? (
                        <ConversationDetail
                            conversation={selectedConversation}
                            messages={messages}
                            loading={messagesLoading}
                            onBack={() => setSelectedConversation(null)}
                        />
                    ) : (
                        <div className="text-center text-slate-500">
                            <MessageSquare className="w-16 h-16 mx-auto mb-3 opacity-30" />
                            <p className="text-sm font-medium">Select a conversation</p>
                            <p className="text-xs mt-1">Choose a conversation from the list to view messages</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
