// components/layout/LanguageProvider.tsx — Initializes language from localStorage on mount

'use client';

import { useEffect } from 'react';
import { useBotStore } from '@/store/botStore';
import type { Language } from '@/lib/i18n/translations';

export default function LanguageProvider({ children }: { children: React.ReactNode }) {
    const setLanguage = useBotStore((s) => s.setLanguage);
    const language = useBotStore((s) => s.language);

    // On mount: read saved language from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('app-language') as Language | null;
        if (saved && saved !== language) {
            setLanguage(saved);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Apply dir + lang on <html> whenever language changes
    useEffect(() => {
        const html = document.documentElement;
        html.setAttribute('lang', language);
        html.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr');
    }, [language]);

    return <>{children}</>;
}
