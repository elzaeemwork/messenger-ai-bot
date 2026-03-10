// config/app.config.ts — App-wide configuration (desktop-ready)

const appConfig = {
    /** Base URL for API calls (supports both web and future desktop) */
    baseUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',

    /** App name displayed in the UI */
    appName: 'MessengerAI Bot',

    /** Default AI model */
    defaultModel: 'gemini-2.0-flash',

    /** Available AI models */
    models: [
        { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', description: 'Fast & smart — best for chat' },
        { id: 'gemini-2.0-flash-lite', name: 'Gemini 2.0 Flash Lite', description: 'Fastest, lowest cost' },
        { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', description: 'Most capable, higher cost' },
    ],

    /** Available dialects */
    dialects: [
        { id: 'iraqi', name: 'عراقية', nameEn: 'Iraqi' },
        { id: 'gulf', name: 'خليجية', nameEn: 'Gulf' },
        { id: 'egyptian', name: 'مصرية', nameEn: 'Egyptian' },
        { id: 'levantine', name: 'شامية', nameEn: 'Levantine' },
        { id: 'msa', name: 'فصحى', nameEn: 'Modern Standard' },
    ],

    /** Available tones */
    tones: [
        { id: 'friendly', name: 'ودية', nameEn: 'Friendly' },
        { id: 'formal', name: 'رسمية', nameEn: 'Formal' },
        { id: 'casual', name: 'عادية', nameEn: 'Casual' },
        { id: 'enthusiastic', name: 'حماسية', nameEn: 'Enthusiastic' },
    ],

    /** Facebook Graph API version */
    facebookApiVersion: 'v19.0',

    /** Logs auto-refresh interval (ms) */
    logsRefreshInterval: 10000,

    /** Max conversation history to send to Gemini */
    maxHistoryMessages: 10,
};

export default appConfig;
