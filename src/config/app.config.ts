// config/app.config.ts — App-wide configuration (desktop-ready)

const appConfig = {
    baseUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    appName: 'MessengerAI Bot',
    defaultModel: 'claude-sonnet-4-20250514',
    models: [
        { id: 'claude-sonnet-4-20250514', name: 'Claude Sonnet 4', description: 'Best balance of speed and quality' },
        { id: 'claude-haiku-4-20250414', name: 'Claude Haiku 4', description: 'Fastest responses, lower cost' },
    ],
    dialects: [
        { id: 'iraqi', name: '\u0639\u0631\u0627\u0642\u064a\u0629', nameEn: 'Iraqi' },
        { id: 'gulf', name: '\u062e\u0644\u064a\u062c\u064a\u0629', nameEn: 'Gulf' },
        { id: 'egyptian', name: '\u0645\u0635\u0631\u064a\u0629', nameEn: 'Egyptian' },
        { id: 'levantine', name: '\u0634\u0627\u0645\u064a\u0629', nameEn: 'Levantine' },
        { id: 'msa', name: '\u0641\u0635\u062d\u0649', nameEn: 'Modern Standard' },
    ],
    tones: [
        { id: 'friendly', name: '\u0648\u062f\u064a\u0629', nameEn: 'Friendly' },
        { id: 'formal', name: '\u0631\u0633\u0645\u064a\u0629', nameEn: 'Formal' },
        { id: 'casual', name: '\u0639\u0627\u062f\u064a\u0629', nameEn: 'Casual' },
        { id: 'enthusiastic', name: '\u062d\u0645\u0627\u0633\u064a\u0629', nameEn: 'Enthusiastic' },
    ],
    facebookApiVersion: 'v19.0',
    logsRefreshInterval: 10000,
    maxHistoryMessages: 10,
};

export default appConfig;
