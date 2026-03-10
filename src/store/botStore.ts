// store/botStore.ts — Zustand global state management

import { create } from 'zustand';
import type { BotSettings, Conversation, SystemLog, DashboardStats } from '@/types';

interface BotState {
    settings: BotSettings | null;
    settingsLoading: boolean;
    setSettings: (settings: BotSettings) => void;
    setSettingsLoading: (loading: boolean) => void;
    conversations: Conversation[];
    conversationsLoading: boolean;
    selectedConversation: Conversation | null;
    setConversations: (conversations: Conversation[]) => void;
    setConversationsLoading: (loading: boolean) => void;
    setSelectedConversation: (conversation: Conversation | null) => void;
    stats: DashboardStats;
    statsLoading: boolean;
    setStats: (stats: DashboardStats) => void;
    setStatsLoading: (loading: boolean) => void;
    logs: SystemLog[];
    logsLoading: boolean;
    setLogs: (logs: SystemLog[]) => void;
    setLogsLoading: (loading: boolean) => void;
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
}

export const useBotStore = create<BotState>((set) => ({
    settings: null,
    settingsLoading: true,
    setSettings: (settings) => set({ settings }),
    setSettingsLoading: (settingsLoading) => set({ settingsLoading }),
    conversations: [],
    conversationsLoading: true,
    selectedConversation: null,
    setConversations: (conversations) => set({ conversations }),
    setConversationsLoading: (conversationsLoading) => set({ conversationsLoading }),
    setSelectedConversation: (selectedConversation) => set({ selectedConversation }),
    stats: { totalConversations: 0, messagesToday: 0, activeUsers: 0, avgResponseTime: 0 },
    statsLoading: true,
    setStats: (stats) => set({ stats }),
    setStatsLoading: (statsLoading) => set({ statsLoading }),
    logs: [],
    logsLoading: true,
    setLogs: (logs) => set({ logs }),
    setLogsLoading: (logsLoading) => set({ logsLoading }),
    sidebarOpen: false,
    setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
}));
