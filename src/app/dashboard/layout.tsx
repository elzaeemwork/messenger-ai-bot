// app/dashboard/layout.tsx — Dashboard layout with sidebar, top bar, mobile nav, and RTL support

'use client';

import Sidebar from '@/components/layout/Sidebar';
import TopBar from '@/components/layout/TopBar';
import MobileNav from '@/components/layout/MobileNav';
import { useBotStore } from '@/store/botStore';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const language = useBotStore((s) => s.language);
    const isRtl = language === 'ar';

    return (
        <div className="flex min-h-screen bg-[#0f172a]">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content — shift based on language direction */}
            <div className={`flex-1 ${isRtl ? 'lg:mr-64' : 'lg:ml-64'}`}>
                <TopBar />
                <main className="p-6 pb-20 lg:pb-6 page-transition">
                    {children}
                </main>
            </div>

            {/* Mobile Navigation */}
            <MobileNav />
        </div>
    );
}
