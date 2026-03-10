// components/layout/Sidebar.tsx — Fixed sidebar navigation with bot status

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard, MessageSquare, Settings, BarChart3,
    ScrollText, Bot, Zap
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useBotStore } from '@/store/botStore';

const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/conversations', label: 'Conversations', icon: MessageSquare },
    { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/dashboard/settings', label: 'Settings', icon: Settings },
    { href: '/dashboard/logs', label: 'System Logs', icon: ScrollText },
];

export default function Sidebar() {
    const pathname = usePathname();
    const { settings } = useBotStore();

    return (
        <aside className="hidden lg:flex flex-col w-64 h-screen bg-slate-900/50 border-r border-slate-800 backdrop-blur-sm fixed left-0 top-0 z-40">
            {/* Logo */}
            <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-800">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 shadow-lg shadow-indigo-500/25">
                    <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h1 className="text-lg font-bold gradient-text">MessengerAI</h1>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest">Bot Dashboard</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                                isActive
                                    ? 'bg-indigo-500/15 text-indigo-400 shadow-sm'
                                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                            )}
                        >
                            <item.icon className={cn('w-5 h-5', isActive && 'text-indigo-400')} />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            {/* Bot Status */}
            <div className="px-4 py-4 border-t border-slate-800">
                <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-800/50">
                    <div className="relative">
                        <Zap className={cn(
                            'w-4 h-4 transition-colors',
                            settings?.is_active ? 'text-emerald-400' : 'text-slate-500'
                        )} />
                        {settings?.is_active && (
                            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                        )}
                    </div>
                    <div>
                        <p className="text-xs font-medium text-slate-300">
                            Bot {settings?.is_active ? 'Active' : 'Inactive'}
                        </p>
                        <p className="text-[10px] text-slate-500">
                            {settings?.ai_model || 'Not configured'}
                        </p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
