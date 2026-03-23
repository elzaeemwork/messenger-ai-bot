// components/layout/LanguageSwitcher.tsx — Toggle button between EN and AR

'use client';

import { useBotStore } from '@/store/botStore';

export default function LanguageSwitcher() {
    const language = useBotStore((s) => s.language);
    const setLanguage = useBotStore((s) => s.setLanguage);

    return (
        <div className="flex items-center gap-1 bg-slate-800/60 border border-slate-700/50 rounded-lg p-1 text-xs font-medium">
            <button
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 rounded-md transition-all duration-200 ${
                    language === 'en'
                        ? 'bg-indigo-500 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                }`}
            >
                EN
            </button>
            <button
                onClick={() => setLanguage('ar')}
                className={`px-2.5 py-1 rounded-md transition-all duration-200 ${
                    language === 'ar'
                        ? 'bg-indigo-500 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                }`}
            >
                عربي
            </button>
        </div>
    );
}
