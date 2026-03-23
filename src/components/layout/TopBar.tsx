// components/layout/TopBar.tsx — Top navigation bar with search, notifications, and language switcher

'use client';

import { Search, Bell, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import LanguageSwitcher from '@/components/layout/LanguageSwitcher';
import { useBotStore } from '@/store/botStore';
import translations from '@/lib/i18n/translations';

export default function TopBar() {
    const language = useBotStore((s) => s.language);
    const t = translations[language].topbar;

    return (
        <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 bg-slate-900/80 border-b border-slate-800 backdrop-blur-md">
            {/* Search */}
            <div className="relative w-72">
                <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                    placeholder={t.searchPlaceholder}
                    className="ps-10 bg-slate-800/50 border-slate-700 h-9 text-sm"
                />
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
                {/* Language Switcher */}
                <LanguageSwitcher />

                <Button variant="ghost" size="icon" className="relative text-slate-400 hover:text-slate-200">
                    <Bell className="w-5 h-5" />
                    <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-indigo-500 rounded-full border-2 border-slate-900" />
                </Button>
                <div className="flex items-center gap-2 ps-3 border-s border-slate-800">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500">
                        <User className="w-4 h-4 text-white" />
                    </div>
                    <div className="hidden md:block">
                        <p className="text-sm font-medium text-slate-200">{t.admin}</p>
                        <p className="text-[10px] text-slate-500">admin@messengerai.com</p>
                    </div>
                </div>
            </div>
        </header>
    );
}
