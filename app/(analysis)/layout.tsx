import React from 'react';
import { SessionProvider } from 'next-auth/react';
import Header from '@/components/shared/header';
import Footer from '@/components/footer';

export const dynamic = 'force-dynamic';

export default function AnalysisLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <SessionProvider>
            <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-1">
                    {children}
                </main>
                <Footer />
            </div>
        </SessionProvider>
    );
}
