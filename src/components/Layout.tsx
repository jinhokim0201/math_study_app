import React from 'react';
import { Calculator } from 'lucide-react';

interface LayoutProps {
    children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-indigo-600">
                        <Calculator className="w-6 h-6" />
                        <span className="font-bold text-xl tracking-tight">수학 마스터</span>
                    </div>
                    <div className="text-sm text-slate-500 font-medium">
                        자기주도학습 시스템
                    </div>
                </div>
            </header>

            <main className="flex-1 w-full max-w-4xl mx-auto p-4 md:p-6">
                {children}
            </main>

            <footer className="py-6 text-center text-slate-400 text-sm">
                © 2024 Math Master. All rights reserved.
            </footer>
        </div>
    );
}
