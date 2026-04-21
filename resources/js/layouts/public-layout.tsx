import { type ReactNode } from 'react';
import { Link } from '@inertiajs/react';
import { Package } from 'lucide-react';

interface PublicLayoutProps {
    children: ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
    return (
        <div className="flex min-h-screen flex-col bg-[#FDFDFC] text-[#1b1b18] dark:bg-[#0a0a0a] dark:text-[#EDEDEC]">
            <header className="border-b bg-white/50 backdrop-blur-md dark:bg-black/50 sticky top-0 z-50">
                <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-8">
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl">
                        <div className="bg-indigo-600 p-1.5 rounded-lg">
                            <Package className="h-6 w-6 text-white" />
                        </div>
                        <span>TrackEi</span>
                    </Link>
                    
                    <nav className="flex items-center gap-4">
                        <Link
                            href="/login"
                            className="text-sm font-medium hover:text-indigo-600 transition-colors"
                        >
                            Log in
                        </Link>
                        <Link
                            href="/register"
                            className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-indigo-700 transition-colors"
                        >
                            Get Started
                        </Link>
                    </nav>
                </div>
            </header>
            
            <main className="flex-1">
                {children}
            </main>
            
            <footer className="border-t py-8 mt-12">
                <div className="container mx-auto px-4 text-center text-sm text-gray-500">
                    <p>&copy; {new Date().getFullYear()} TrackEi. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
