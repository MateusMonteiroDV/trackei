import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Package as PackageType, type SharedData } from '@/types';
import { Head, usePage, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Truck, CheckCircle, Users, MapPin, Clock } from 'lucide-react';
import DriverDashboard from '@/components/driver-dashboard';

interface DashboardStats {
    total_packages?: number;
    active_deliveries?: number;
    delivered_today?: number;
    active_drivers?: number;
    assigned_packages?: number;
    in_transit?: number;
    completed_deliveries?: number;
    my_packages?: number;
    delivered?: number;
    recent_packages?: PackageType[];
    current_packages?: PackageType[];
    recent_activity?: PackageType[];
}

interface DashboardProps {
    stats: DashboardStats;
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

    if (user.role === 'driver') {
        return <DriverDashboard stats={stats} />;
    }

    const getDashboardTitle = () => {
        switch (user.role) {
            case 'admin':
                return 'Business Overview';
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
            case 'client':
                return 'Recent Orders';
            default:
                return 'Recent Activity';
        }
    };

    const getRoleIcon = () => {
        switch (user.role) {
            case 'admin':
                return <Users className="h-6 w-6" />;
            case 'client':
                return <Package className="h-6 w-6" />;
            default:
                return <Package className="h-6 w-6" />;
        }
    };

    const packages = stats.recent_packages || stats.recent_activity || [];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="flex flex-col gap-6 p-4 md:p-8">
                <div className="bg-gradient-to-r from-indigo-600 to-blue-500 rounded-2xl p-6 text-white shadow-lg">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/20 rounded-xl">
                            {getRoleIcon()}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">{getDashboardTitle()}</h1>
                            <p className="text-blue-100">
                                Welcome back, {user.name}
                            </p>
                        </div>
                    </div>
                </div>

                {user.role === 'admin' && (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card className="border-l-4 border-l-blue-500">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-gray-600">Total Packages</CardTitle>
                                <Package className="h-5 w-5 text-blue-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-gray-900">{stats.total_packages || 0}</div>
                                <p className="text-xs text-gray-500">Across your business</p>
                            </CardContent>
                        </Card>
                        <Card className="border-l-4 border-l-amber-500">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-gray-600">In Transit</CardTitle>
                                <Truck className="h-5 w-5 text-amber-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-gray-900">{stats.active_deliveries || 0}</div>
                                <p className="text-xs text-gray-500">Active deliveries</p>
                            </CardContent>
                        </Card>
                        <Card className="border-l-4 border-l-green-500">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-gray-600">Delivered Today</CardTitle>
                                <CheckCircle className="h-5 w-5 text-green-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-gray-900">{stats.delivered_today || 0}</div>
                                <p className="text-xs text-gray-500">Successfully delivered</p>
                            </CardContent>
                        </Card>
                        <Card className="border-l-4 border-l-purple-500">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-gray-600">Active Drivers</CardTitle>
                                <Users className="h-5 w-5 text-purple-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-gray-900">{stats.active_drivers || 0}</div>
                                <p className="text-xs text-gray-500">Available now</p>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {user.role === 'client' && (
                    <div className="grid gap-4 md:grid-cols-3">
                        <Card className="border-l-4 border-l-gray-500">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-gray-600">My Packages</CardTitle>
                                <Package className="h-5 w-5 text-gray-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-gray-900">{stats.my_packages || 0}</div>
                                <p className="text-xs text-gray-500">Total orders</p>
                            </CardContent>
                        </Card>
                        <Card className="border-l-4 border-l-blue-500">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-gray-600">In Transit</CardTitle>
                                <Truck className="h-5 w-5 text-blue-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-gray-900">{stats.in_transit || 0}</div>
                                <p className="text-xs text-gray-500">On the way</p>
                            </CardContent>
                        </Card>
                        <Card className="border-l-4 border-l-green-500">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-gray-600">Delivered</CardTitle>
                                <CheckCircle className="h-5 w-5 text-green-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-gray-900">{stats.delivered || 0}</div>
                                <p className="text-xs text-gray-500">Received</p>
                            </CardContent>
                        </Card>
                    </div>
                )}

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-gray-900">{getPackagesTitle()}</CardTitle>
                        <Link href="/packages" className="text-sm font-medium text-blue-600 hover:underline">
                            View all
                        </Link>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {packages.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-8 text-center">
                                    <Package className="h-12 w-12 text-gray-300 mb-3" />
                                    <p className="text-gray-500">No recent activity</p>
                                    <Link href="/packages/create" className="mt-3 text-sm text-blue-600 hover:underline">
                                        Create your first package
                                    </Link>
                                </div>
                            ) : (
                                packages.map((pkg: any) => (
                                    <Link
                                        key={pkg.id}
                                        href={`/packages/${pkg.tracking_code}`}
                                        className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-gray-100 rounded-lg">
                                                <MapPin className="h-4 w-4 text-gray-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900 font-mono">{pkg.tracking_code}</p>
                                                <p className="text-xs text-gray-500">{pkg.recipient_name}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`text-xs px-2 py-1 rounded-full ${
                                                pkg.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                                pkg.status === 'in_transit' ? 'bg-blue-100 text-blue-700' :
                                                pkg.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                                'bg-gray-100 text-gray-700'
                                            }`}>
                                                {pkg.status}
                                            </span>
                                            <Clock className="h-4 w-4 text-gray-400" />
                                        </div>
                                    </Link>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
