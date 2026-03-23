// components/layout/MobileNav.tsx — Bottom navigation bar for mobile devices with i18n support

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, MessageSquare, Settings, BarChart3, ScrollText } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useBotStore } from '@/store/botStore';
import translations from '@/lib/i18n/translations';

export default function MobileNav() {
    const pathname = usePathname();
    const language = useBotStore((s) => s.language);
    const t = translations[language].nav;

    const navItems = [
        { href: '/dashboard', label: t.home, icon: LayoutDashboard },
        { href: '/dashboard/conversations', label: t.chat, icon: MessageSquare },
        { href: '/dashboard/analytics', label: t.stats, icon: BarChart3 },
        { href: '/dashboard/settings', label: t.config, icon: Settings },
        { href: '/dashboard/logs', label: t.logs, icon: ScrollText },
    ];

    return (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around h-16 bg-slate-900/95 border-t border-slate-800 backdrop-blur-md">
            {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            'flex flex-col items-center justify-center gap-1 w-16 py-1 transition-colors',
                            isActive ? 'text-indigo-400' : 'text-slate-500'
                        )}
                    >
                        <item.icon className="w-5 h-5" />
                        <span className="text-[10px] font-medium">{item.label}</span>
                    </Link>
                );
            })}
        </nav>
    );
}
