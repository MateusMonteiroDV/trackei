import { type ReactNode } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Package, MapPin, User, LogOut, Bell } from 'lucide-react';
import { SharedData } from '@/types';
import { OfflineAlert } from '@/components/offline-alert';

interface DriverLayoutProps {
    children: ReactNode;
    title?: string;
}

export default function DriverLayout({ children, title }: DriverLayoutProps) {
    const { auth } = usePage<SharedData>().props;

    const isRouteActive = (name: string) => typeof route !== 'undefined' && route().current(name);

    return (
        <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100">
            <OfflineAlert />
            {/* Mobile Header */}
            <header className="sticky top-0 z-40 bg-white dark:bg-zinc-900 border-b px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="bg-amber-500 p-1.5 rounded-lg text-white">
                        <Package className="h-5 w-5" />
                    </div>
                    <h1 className="font-bold text-lg">{title || 'Driver App'}</h1>
                </div>
                <div className="flex items-center gap-3">
                    <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 relative">
                        <Bell className="h-5 w-5" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-zinc-900"></span>
                    </button>
                    <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold text-xs">
                        {auth.user.name.charAt(0)}
                    </div>
                </div>
            </header>

            <main className="flex-1 p-4 pb-24">
                {children}
            </main>

            {/* Mobile Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-zinc-900 border-t flex justify-around items-center h-20 px-2">
                <Link 
                    href="/dashboard" 
                    className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors ${
                        isRouteActive('dashboard') ? 'text-indigo-600' : 'text-gray-500'
                    }`}
                >
                    <Package className="h-6 w-6" />
                    <span className="text-xs font-medium">Deliveries</span>
                </Link>
                
                <Link 
                    href="/packages" 
                    className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors ${
                        isRouteActive('packages.*') ? 'text-indigo-600' : 'text-gray-500'
                    }`}
                >
                    <MapPin className="h-6 w-6" />
                    <span className="text-xs font-medium">Map</span>
                </Link>

                <Link 
                    href="/profile" 
                    className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors ${
                        isRouteActive('profile.*') ? 'text-indigo-600' : 'text-gray-500'
                    }`}
                >
                    <User className="h-6 w-6" />
                    <span className="text-xs font-medium">Profile</span>
                </Link>

                <Link 
                    href="/logout" 
                    method="post" 
                    as="button"
                    className="flex flex-col items-center gap-1 p-2 text-gray-500 hover:text-red-500 transition-colors"
                >
                    <LogOut className="h-6 w-6" />
                    <span className="text-xs font-medium">Exit</span>
                </Link>
            </nav>
        </div>
    );
}
