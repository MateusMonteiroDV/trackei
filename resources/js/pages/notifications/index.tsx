import NotificationList from '@/components/notification-list';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import api from '@/lib/axios';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';

// Removed unused breadcrumbs variable

export default function Notifications() {
    const [notifications, setNotifications] = useState([]);

    const fetchNotifications = async () => {
        const res = await api.get('/api/notifications');
        setNotifications(res.data.data);
    };

    useEffect(() => {
        const runFetchNotifications = async () => {
            await fetchNotifications();
        };
        runFetchNotifications();
    }, []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Notifications" />
            <div className="p-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-black">
                            All Notifications
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <NotificationList
                            notifications={notifications}
                            onUpdate={fetchNotifications}
                        />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
