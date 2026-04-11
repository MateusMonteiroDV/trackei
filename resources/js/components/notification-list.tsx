import { useState } from 'react';
import { Button } from '@/components/ui/button';
import api from '@/lib/axios';
import { Check, Trash2 } from 'lucide-react';

interface Notification {
    id: string;
    data: { title: string; message: string };
    read_at: string | null;
}

export default function NotificationList({ notifications, onUpdate }: { notifications: Notification[], onUpdate: () => void }) {
    const markAsRead = async (id: string) => {
        await api.post(`/api/notifications/${id}/read`);
        onUpdate();
    };

    const deleteNotification = async (id: string) => {
        await api.delete(`/api/notifications/${id}`);
        onUpdate();
    };

    return (
        <div className="flex flex-col">
            {notifications.length === 0 ? (
                <div className="p-4 text-sm text-center text-muted-foreground">No notifications.</div>
            ) : (
                notifications.map((n) => (
                    <div key={n.id} className={`p-4 border-b flex items-start gap-3 ${!n.read_at ? 'bg-blue-50' : ''}`}>
                        <div className="flex-1">
                            <p className="text-sm font-semibold text-black">{n.data.title}</p>
                            <p className="text-xs text-muted-foreground">{n.data.message}</p>
                        </div>
                        <div className="flex flex-col gap-1">
                            {!n.read_at && (
                                <Button variant="ghost" size="icon" onClick={() => markAsRead(n.id)}>
                                    <Check className="h-4 w-4 text-blue-600" />
                                </Button>
                            )}
                            <Button variant="ghost" size="icon" onClick={() => deleteNotification(n.id)}>
                                <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}
