import { useDriverLocation } from '@/hooks/use-driver-location';
import DriverLayout from '@/layouts/driver-layout';
import { type Package as PackageType } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation, CheckCircle, Package as PackageIcon } from 'lucide-react';
import api from '@/lib/axios';

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
                    <Card className="bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-900">
                        <CardContent className="p-3 text-center">
                            <p className="text-xs text-amber-700 dark:text-amber-400 font-medium uppercase tracking-wider">Assigned</p>
                            <p className="text-2xl font-bold text-amber-900 dark:text-amber-200">{stats.assigned_packages || 0}</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-900">
                        <CardContent className="p-3 text-center">
                            <p className="text-xs text-blue-700 dark:text-blue-400 font-medium uppercase tracking-wider">Active</p>
                            <p className="text-2xl font-bold text-blue-900 dark:text-blue-200">{stats.in_transit || 0}</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-900">
                        <CardContent className="p-3 text-center">
                            <p className="text-xs text-green-700 dark:text-green-400 font-medium uppercase tracking-wider">Done</p>
                            <p className="text-2xl font-bold text-green-900 dark:text-green-200">{stats.completed_deliveries || 0}</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-4">
                    <h2 className="text-lg font-bold flex items-center gap-2 px-1">
                        <Navigation className="h-5 w-5 text-indigo-600" />
                        Active Route
                    </h2>

                    {activePackages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-white dark:bg-zinc-900 rounded-2xl border border-dashed">
                            <PackageIcon className="h-12 w-12 text-gray-300 mb-4" />
                            <p className="text-gray-500 font-medium">No deliveries assigned to you right now.</p>
                            <p className="text-sm text-gray-400 mt-1">Check back later for new orders.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {activePackages.map((pkg) => (
                                <Card key={pkg.id} className="overflow-hidden border-none shadow-md rounded-2xl">
                                    <CardContent className="p-0">
                                        <div className="p-5 space-y-4">
                                            <div className="flex justify-between items-start">
                                                <div className="space-y-1">
                                                    <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded">
                                                        {pkg.status.replace('_', ' ')}
                                                    </span>
                                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white font-mono">{pkg.tracking_code}</h3>
                                                </div>
                                                <div className="p-2 bg-gray-100 dark:bg-zinc-800 rounded-xl">
                                                    <MapPin className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <div className="flex gap-3">
                                                    <div className="mt-1 w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                                                    <div className="space-y-0.5">
                                                        <p className="text-[10px] text-gray-400 font-bold uppercase">Recipient</p>
                                                        <p className="text-sm font-semibold">{pkg.recipient_name}</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-3">
                                                    <div className="mt-1 w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                                                    <div className="space-y-0.5">
                                                        <p className="text-[10px] text-gray-400 font-bold uppercase">Address</p>
                                                        <p className="text-sm font-medium leading-relaxed">{pkg.delivery_address}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3 pt-2">
                                                <Button 
                                                    variant="outline" 
                                                    className="rounded-xl h-12 font-bold border-gray-200 dark:border-zinc-800"
                                                    asChild
                                                >
                                                    <a 
                                                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(pkg.delivery_address)}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <Navigation className="h-4 w-4 mr-2" />
                                                        GPS
                                                    </a>
                                                </Button>

                                                {pkg.status === 'pending' ? (
                                                    <Button 
                                                        className="rounded-xl h-12 font-bold bg-indigo-600 hover:bg-indigo-700"
                                                        onClick={() => handleUpdateStatus(pkg.id, 'in_transit')}
                                                    >
                                                        Start
                                                    </Button>
                                                ) : (
                                                    <Button 
                                                        className="rounded-xl h-12 font-bold bg-green-600 hover:bg-green-700"
                                                        onClick={() => handleUpdateStatus(pkg.id, 'delivered')}
                                                    >
                                                        <CheckCircle className="h-4 w-4 mr-2" />
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
