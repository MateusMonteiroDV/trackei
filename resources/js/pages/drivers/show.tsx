import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Driver, type Package } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Package as PackageIcon } from 'lucide-react';
import DriverCard from '@/components/driver-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import StatusBadge from '@/components/status-badge';

interface ShowProps {
    driver: Driver;
    activePackages: Package[];
}

export default function Show({ driver, activePackages }: ShowProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Drivers',
            href: '/drivers',
        },
        {
            title: driver.name,
            href: `/drivers/${driver.id}`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Driver ${driver.name}`} />

            <div className="flex flex-col gap-6 p-4 md:p-8">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/drivers">
                            <ChevronLeft className="h-4 w-4" />
                            <span className="sr-only">Back</span>
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-black">Driver Detail</h1>
                        <p className="text-sm text-muted-foreground">
                            Viewing details and current activity for {driver.name}.
                        </p>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    <div className="md:col-span-1">
                        <DriverCard driver={driver} />
                    </div>

                    <div className="md:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-black flex items-center gap-2">
                                    <PackageIcon className="h-5 w-5" />
                                    Active Deliveries
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {activePackages.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-12 text-center">
                                        <PackageIcon className="h-12 w-12 text-muted-foreground mb-4" />
                                        <p className="text-muted-foreground italic">
                                            No active deliveries at the moment.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {activePackages.map((pkg) => (
                                            <div key={pkg.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted transition-colors group">
                                                <div className="space-y-1">
                                                    <p className="text-sm font-bold text-black font-mono">{pkg.tracking_code}</p>
                                                    <p className="text-xs text-muted-foreground">Recipient: {pkg.recipient_name}</p>
                                                    <p className="text-xs text-muted-foreground">Address: {pkg.delivery_address}</p>
                                                </div>
                                                <div className="flex flex-col items-end gap-2">
                                                    <StatusBadge status={pkg.status} />
                                                    <Button variant="outline" size="sm" asChild>
                                                        <Link href={`/packages/${pkg.tracking_code}`}>
                                                            Details
                                                        </Link>
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
