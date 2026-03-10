// app/layout.tsx — Root layout with dark theme, fonts, and toast provider

import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import './globals.css';

export const metadata: Metadata = {
    title: 'MessengerAI Bot Dashboard',
    description: 'Intelligent Facebook Messenger auto-reply system powered by Claude AI',
    keywords: ['messenger', 'bot', 'ai', 'claude', 'facebook', 'automation'],
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="dark">
            <body className="min-h-screen bg-[#0f172a]">
                {children}
                <Toaster
                    position="top-right"
                    toastOptions={{
                        className: '!bg-slate-800 !text-white !border !border-slate-700',
                        duration: 4000,
                        style: {
                            background: '#1e293b',
                            color: '#f1f5f9',
                            border: '1px solid #334155',
                        },
                    }}
                />
            </body>
        </html>
    );
}
