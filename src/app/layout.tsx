// app/layout.tsx — Root layout with dark theme, fonts, toast provider, and language support

import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import LanguageProvider from '@/components/layout/LanguageProvider';
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
        <html lang="en" dir="ltr" className="dark">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Noto+Kufi+Arabic:wght@400;500;600;700&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body className="min-h-screen bg-[#0f172a]">
                <LanguageProvider>
                    {children}
                </LanguageProvider>
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
