// hooks/useConversations.ts — Hook for managing conversations and messages

'use client';

import { useEffect, useCallback, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useBotStore } from '@/store/botStore';
import type { Conversation, Message } from '@/types';
import toast from 'react-hot-toast';

export function useConversations() {
    const {
        conversations, conversationsLoading,
        selectedConversation,
        setConversations, setConversationsLoading,
        setSelectedConversation,
    } = useBotStore();

    const [messages, setMessages] = useState<Message[]>([]);
    const [messagesLoading, setMessagesLoading] = useState(false);
    const [filter, setFilter] = useState<'all' | 'active' | 'archived'>('all');
    const [searchQuery, setSearchQuery] = useState('');

    const supabase = createClient();

    const fetchConversations = useCallback(async () => {
        try {
            setConversationsLoading(true);
            let query = supabase
                .from('conversations')
                .select('*')
                .order('last_message_at', { ascending: false });

            if (filter !== 'all') {
                query = query.eq('status', filter);
            }

            if (searchQuery) {
                query = query.or(`user_name.ilike.%${searchQuery}%,last_message.ilike.%${searchQuery}%`);
            }

            const { data, error } = await query;
            if (error) throw error;
            setConversations((data || []) as Conversation[]);
        } catch (error) {
            console.error('Error fetching conversations:', error);
            toast.error('Failed to load conversations');
        } finally {
            setConversationsLoading(false);
        }
    }, [supabase, setConversations, setConversationsLoading, filter, searchQuery]);

    const fetchMessages = useCallback(async (conversationId: string) => {
        try {
            setMessagesLoading(true);
            const { data, error } = await supabase
                .from('messages')
                .select('*')
                .eq('conversation_id', conversationId)
                .order('created_at', { ascending: true });

            if (error) throw error;
            setMessages((data || []) as Message[]);
        } catch (error) {
            console.error('Error fetching messages:', error);
            toast.error('Failed to load messages');
        } finally {
            setMessagesLoading(false);
        }
    }, [supabase]);

    const selectConversation = useCallback(async (conversation: Conversation) => {
        setSelectedConversation(conversation);
        await fetchMessages(conversation.id);
    }, [setSelectedConversation, fetchMessages]);

    useEffect(() => {
        fetchConversations();
    }, [filter, searchQuery]);

    return {
        conversations, conversationsLoading,
        selectedConversation, messages, messagesLoading,
        filter, setFilter, searchQuery, setSearchQuery,
        selectConversation, setSelectedConversation,
        refetch: fetchConversations,
    };
}
