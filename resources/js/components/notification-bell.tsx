import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import api from '@/lib/axios';
import { Bell } from 'lucide-react';
import { useEffect, useState } from 'react';
import NotificationList from './notification-list';

export default function NotificationBell() {
    const [unreadCount, setUnreadCount] = useState(0);
    const [notifications, setNotifications] = useState([]);

    const fetchNotifications = async () => {
        try {
            const res = await api.get('/api/notifications');
            setNotifications(res.data.data);
            setUnreadCount(res.data.data.filter((n: any) => !n.read_at).length);
        } catch (error) {
            console.error('Failed to fetch notifications', error);
        }
    };

    useEffect(() => {
        const runFetchNotifications = async () => {
            try {
                const res = await api.get('/api/notifications');
                setNotifications(res.data.data);
                setUnreadCount(
                    res.data.data.filter(
                        (n: { read_at: string | null }) => !n.read_at,
                    ).length,
                );
            } catch (error) {
                console.error('Failed to fetch notifications', error);
            }
        };
        runFetchNotifications();
    }, []);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 flex h-2 w-2 rounded-full bg-red-600" />
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 p-0">
                <div className="border-b p-4 font-medium text-black">
                    Notifications
                </div>
                <div className="max-h-60 overflow-y-auto">
                    <NotificationList
                        notifications={notifications}
                        onUpdate={fetchNotifications}
                    />
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
