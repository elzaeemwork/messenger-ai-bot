// app/dashboard/layout.tsx — Dashboard layout with sidebar, top bar, and mobile nav

'use client';

import Sidebar from '@/components/layout/Sidebar';
import TopBar from '@/components/layout/TopBar';
import MobileNav from '@/components/layout/MobileNav';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-[#0f172a]">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex-1 lg:ml-64">
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
