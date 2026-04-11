import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import NotificationList from '@/components/notification-list';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Notifications', href: '/notifications' },
];

export default function Notifications() {
    const [notifications, setNotifications] = useState([]);

    const fetchNotifications = async () => {
        const res = await api.get('/api/notifications');
        setNotifications(res.data.data);
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Notifications" />
            <div className="p-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-black">All Notifications</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <NotificationList notifications={notifications} onUpdate={fetchNotifications} />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
