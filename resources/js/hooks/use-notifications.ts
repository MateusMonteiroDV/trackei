import { SharedData } from '@/types';
import {
    DriverAssignedEvent,
    NotificationPayload,
    PackageStatusUpdatedEvent,
} from '@/types/notifications';
import { router, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';

export function useNotifications() {
    const { auth } = usePage<SharedData>().props;

    useEffect(() => {
        if (!auth.user || !window.Echo) return;

        // Listen for package updates
        const channel = window.Echo.private('App.Models.User.' + auth.user.id);

        channel.notification<NotificationPayload>((notification) => {
            toast.info(notification.message || 'New notification');
            router.reload({ preserveUrl: true });
        });

        if (
            auth.user.role === 'admin' &&
            auth.user.business_id &&
            window.Echo
        ) {
            window.Echo.private(`business.${auth.user.business_id}`)
                .listen(
                    'PackageStatusUpdated',
                    (e: PackageStatusUpdatedEvent) => {
                        toast.success(
                            `Package ${e.package.tracking_code} updated to ${e.package.status}`,
                        );
                        router.reload({ preserveUrl: true });
                    },
                )
                .listen('DriverAssigned', (e: DriverAssignedEvent) => {
                    toast.success(
                        `Driver assigned to package ${e.package.tracking_code}`,
                    );
                    router.reload({ preserveUrl: true });
                });
        }

        return () => {
            window.Echo.leave(`App.Models.User.${auth.user.id}`);
            if (auth.user.business_id) {
                window.Echo.leave(`business.${auth.user.business_id}`);
            }
        };
    }, [auth.user]);
}
