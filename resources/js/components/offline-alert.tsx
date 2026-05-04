import { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';

export function OfflineAlert() {
    const [isOffline, setIsOffline] = useState(!navigator.onLine);

    useEffect(() => {
        const handleOnline = () => setIsOffline(false);
        const handleOffline = () => setIsOffline(true);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    if (!isOffline) return null;

    return (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-md animate-in fade-in slide-in-from-bottom-4">
            <div className="bg-red-600 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-red-500/20">
                <div className="bg-white/20 p-2 rounded-xl">
                    <WifiOff className="h-5 w-5" />
                </div>
                <div>
                    <p className="font-bold text-sm">Você está offline</p>
                    <p className="text-xs text-red-100">Algumas funcionalidades podem estar indisponíveis.</p>
                </div>
            </div>
        </div>
    );
}
