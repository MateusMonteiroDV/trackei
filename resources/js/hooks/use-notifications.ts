import { useEffect } from 'react';
import { usePage, router } from '@inertiajs/react';
import { toast } from 'sonner';
import { SharedData } from '@/types';

export function useNotifications() {
    const { auth } = usePage<SharedData>().props;

    useEffect(() => {
        if (!auth.user) return;

        // Listen for package updates
        const channel = window.Echo.private(`App.Models.User.${auth.user.id}`);

        channel.notification((notification: any) => {
            toast.info(notification.message || 'New notification');
            router.reload({ preserveScroll: true });
        });

        // Specific events
        if (auth.user.role === 'admin' && auth.user.business_id && window.Echo) {
            window.Echo.private(`business.${auth.user.business_id}`)
                .listen('PackageStatusUpdated', (e: any) => {
                    toast.success(`Package ${e.package.tracking_code} updated to ${e.package.status}`);
                    router.reload({ preserveScroll: true });
                })
                .listen('DriverAssigned', (e: any) => {
                    toast.success(`Driver assigned to package ${e.package.tracking_code}`);
                    router.reload({ preserveScroll: true });
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
          }
        };
    }, [auth.user]);
}
