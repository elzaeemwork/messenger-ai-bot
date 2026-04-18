// types/index.ts — Global TypeScript type definitions for the MessengerAI Bot Dashboard

export interface BotSettings {
    id: string;
    business_name: string;
    business_description: string;
    services: Service[];
    working_hours: string;
    address: string;
    phone: string;
    whatsapp: string;
    dialect: 'iraqi' | 'gulf' | 'egyptian' | 'levantine' | 'msa';
    tone: 'friendly' | 'formal' | 'casual' | 'enthusiastic';
    custom_rules: string;
    ai_model: string;
    max_tokens: number;
    is_active: boolean;
    use_bytez: boolean;
    page_access_token: string;
    verify_token: string;
    created_at: string;
    updated_at: string;
}

export interface Service {
    name: string;
    price: string;
    description: string;
}

export interface Conversation {
    id: string;
    facebook_user_id: string;
    user_name: string;
    user_avatar: string;
    message_count: number;
    last_message: string;
    last_message_at: string;
    status: 'active' | 'archived' | 'blocked';
    created_at: string;
}

export interface Message {
    id: string;
    conversation_id: string;
    facebook_user_id: string;
    role: 'user' | 'assistant';
    content: string;
    is_ai_generated: boolean;
    tokens_used: number;
    response_time_ms: number;
    created_at: string;
}

export interface SystemLog {
    id: string;
    level: 'info' | 'warning' | 'error';
    event: string;
    details: Record<string, unknown>;
    created_at: string;
}

export interface DashboardStats {
    totalConversations: number;
    messagesToday: number;
    activeUsers: number;
    avgResponseTime: number;
}

export interface AnalyticsData {
    messagesPerDay: { date: string; count: number }[];
    userVsBotMessages: { name: string; value: number }[];
    topConversations: Conversation[];
    totalTokensUsed: number;
    estimatedCost: number;
}

export interface FacebookWebhookEntry {
    id: string;
    time: number;
    messaging: FacebookMessagingEvent[];
}

export interface FacebookMessagingEvent {
    sender: { id: string };
    recipient: { id: string };
    timestamp: number;
    message?: {
        mid: string;
        text: string;
    };
}
