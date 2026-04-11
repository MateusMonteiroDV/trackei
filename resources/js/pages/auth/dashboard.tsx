import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import DashboardStats from '@/components/dashboard-stats';
import RecentPackages from '@/components/recent-packages';

interface DashboardProps {
    stats: any;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard({ stats }: DashboardProps) {
    const { auth } = usePage<SharedData>().props;
    const user = auth.user;

    const getDashboardTitle = () => {
        switch (user.role) {
            case 'admin':
                return 'Business Overview';
            case 'driver':
                return 'Driver Dashboard';
            case 'client':
                return 'My Tracking';
            default:
                return 'Dashboard';
        }
    };

    const getPackagesTitle = () => {
        switch (user.role) {
            case 'admin':
                return 'Recent Packages';
            case 'driver':
                return 'Active Routes';
            case 'client':
                return 'Recent Orders';
            default:
                return 'Recent Activity';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="flex flex-col gap-6 p-4 md:p-8">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-black">{getDashboardTitle()}</h1>
                    <p className="text-muted-foreground text-sm">
                        Welcome back, {user.name}.
                    </p>
                </div>

                <DashboardStats stats={stats} role={user.role} />

                <div className="grid gap-6 md:grid-cols-2">
                    <RecentPackages
                        packages={user.role === 'driver' ? (stats.current_packages || []) : (stats.recent_packages || stats.recent_activity || [])}
                        title={getPackagesTitle()}
                    />

                    {/* Quick Actions Card */}
                    <div className="rounded-xl border bg-card text-card-foreground shadow">
                        <div className="p-6 pb-4">
                            <h3 className="text-lg font-semibold text-black">Quick Actions</h3>
                        </div>
                        <div className="p-6 pt-0 space-y-3">
                            {user.role === 'admin' && (
                                <>
                                    <a href="/packages/create" className="flex items-center p-3 rounded-lg border hover:bg-muted transition-colors text-sm font-medium text-black">
                                        Register New Package
                                    </a>
                                    <a href="/drivers" className="flex items-center p-3 rounded-lg border hover:bg-muted transition-colors text-sm font-medium text-black">
                                        Manage Drivers
                                    </a>
                                </>
                            )}
                            {user.role === 'driver' && (
                                <>
                                    <a href="/packages" className="flex items-center p-3 rounded-lg border hover:bg-muted transition-colors text-sm font-medium text-black">
                                        View Assigned Packages
                                    </a>
                                </>
                            )}
                            {user.role === 'client' && (
                                <>
                                    <a href="/packages" className="flex items-center p-3 rounded-lg border hover:bg-muted transition-colors text-sm font-medium text-black">
                                        Track my Packages
                                    </a>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
