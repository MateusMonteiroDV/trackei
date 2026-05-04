import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useDriverLocation } from '@/hooks/use-driver-location';
import DriverLayout from '@/layouts/driver-layout';
import api from '@/lib/axios';
import { type Package as PackageType } from '@/types';
import { Head, router } from '@inertiajs/react';
import {
    CheckCircle,
    MapPin,
    Navigation,
    Package as PackageIcon,
} from 'lucide-react';

interface DriverDashboardProps {
    stats: {
        assigned_packages?: number;
        in_transit?: number;
        completed_deliveries?: number;
        current_packages?: PackageType[];
    };
}

export default function DriverDashboard({ stats }: DriverDashboardProps) {
    // Start tracking location if the driver has packages in transit
    useDriverLocation((stats.in_transit || 0) > 0);

    const activePackages = stats.current_packages || [];

    const handleUpdateStatus = async (pkgId: number, status: string) => {
        try {
            await api.patch(`/api/packages/${pkgId}/status`, { status });
            router.reload();
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    return (
        <DriverLayout title="My Deliveries">
            <Head title="Driver Dashboard" />

            <div className="space-y-6">
                {/* Stats Summary */}
                <div className="grid grid-cols-3 gap-3">
                    <Card className="border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/20">
                        <CardContent className="p-3 text-center">
                            <p className="text-xs font-medium tracking-wider text-amber-700 uppercase dark:text-amber-400">
                                Assigned
                            </p>
                            <p className="text-2xl font-bold text-amber-900 dark:text-amber-200">
                                {stats.assigned_packages || 0}
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/20">
                        <CardContent className="p-3 text-center">
                            <p className="text-xs font-medium tracking-wider text-blue-700 uppercase dark:text-blue-400">
                                Active
                            </p>
                            <p className="text-2xl font-bold text-blue-900 dark:text-blue-200">
                                {stats.in_transit || 0}
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/20">
                        <CardContent className="p-3 text-center">
                            <p className="text-xs font-medium tracking-wider text-green-700 uppercase dark:text-green-400">
                                Done
                            </p>
                            <p className="text-2xl font-bold text-green-900 dark:text-green-200">
                                {stats.completed_deliveries || 0}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-4">
                    <h2 className="flex items-center gap-2 px-1 text-lg font-bold">
                        <Navigation className="h-5 w-5 text-indigo-600" />
                        Active Route
                    </h2>

                    {activePackages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed bg-white px-4 py-12 text-center dark:bg-zinc-900">
                            <PackageIcon className="mb-4 h-12 w-12 text-gray-300" />
                            <p className="font-medium text-gray-500">
                                No deliveries assigned to you right now.
                            </p>
                            <p className="mt-1 text-sm text-gray-400">
                                Check back later for new orders.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {activePackages.map((pkg) => (
                                <Card
                                    key={pkg.id}
                                    className="overflow-hidden rounded-2xl border-none shadow-md"
                                >
                                    <CardContent className="p-0">
                                        <div className="space-y-4 p-5">
                                            <div className="flex items-start justify-between">
                                                <div className="space-y-1">
                                                    <span className="rounded bg-indigo-50 px-2 py-0.5 text-[10px] font-bold tracking-widest text-indigo-600 uppercase dark:bg-indigo-900/30">
                                                        {pkg.status.replace(
                                                            '_',
                                                            ' ',
                                                        )}
                                                    </span>
                                                    <h3 className="font-mono text-lg font-bold text-gray-900 dark:text-white">
                                                        {pkg.tracking_code}
                                                    </h3>
                                                </div>
                                                <div className="rounded-xl bg-gray-100 p-2 dark:bg-zinc-800">
                                                    <MapPin className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <div className="flex gap-3">
                                                    <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-indigo-500" />
                                                    <div className="space-y-0.5">
                                                        <p className="text-[10px] font-bold text-gray-400 uppercase">
                                                            Recipient
                                                        </p>
                                                        <p className="text-sm font-semibold">
                                                            {pkg.recipient_name}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-3">
                                                    <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-amber-500" />
                                                    <div className="space-y-0.5">
                                                        <p className="text-[10px] font-bold text-gray-400 uppercase">
                                                            Address
                                                        </p>
                                                        <p className="text-sm leading-relaxed font-medium">
                                                            {
                                                                pkg.delivery_address
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3 pt-2">
                                                <Button
                                                    variant="outline"
                                                    className="h-12 rounded-xl border-gray-200 font-bold dark:border-zinc-800"
                                                    asChild
                                                >
                                                    <a
                                                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(pkg.delivery_address)}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <Navigation className="mr-2 h-4 w-4" />
                                                        GPS
                                                    </a>
                                                </Button>

                                                {pkg.status === 'pending' ? (
                                                    <Button
                                                        className="h-12 rounded-xl bg-indigo-600 font-bold hover:bg-indigo-700"
                                                        onClick={() =>
                                                            handleUpdateStatus(
                                                                pkg.id,
                                                                'in_transit',
                                                            )
                                                        }
                                                    >
                                                        Start
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        className="h-12 rounded-xl bg-green-600 font-bold hover:bg-green-700"
                                                        onClick={() =>
                                                            handleUpdateStatus(
                                                                pkg.id,
                                                                'delivered',
                                                            )
                                                        }
                                                    >
                                                        <CheckCircle className="mr-2 h-4 w-4" />
                                                        Finish
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </DriverLayout>
    );
}
