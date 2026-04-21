import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Package } from '@/types';
import { Head, Link } from '@inertiajs/react';
import TrackingTimeline from '@/components/tracking-timeline';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, MapPin, Phone, User, Building, Truck } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import StatusBadge from '@/components/status-badge';
import Map from '@/components/map';

interface ShowProps {
    package: Package;
}

export default function Show({ package: pkg }: ShowProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Packages',
            href: '/packages',
        },
        {
            title: pkg.tracking_code,
            href: `/packages/${pkg.tracking_code}`,
        },
    ];

    const driverLocation = pkg.driver?.latest_location;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Package ${pkg.tracking_code}`} />

            <div className="flex flex-col gap-6 p-4 md:p-8">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/packages">
                            <ChevronLeft className="h-4 w-4" />
                            <span className="sr-only">Back</span>
                        </Link>
                    </Button>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold tracking-tight text-black">Package Detail</h1>
                            <StatusBadge status={pkg.status} />
                        </div>
                        <p className="text-sm text-muted-foreground font-mono">
                            {pkg.tracking_code}
                        </p>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    <div className="md:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Tracking Status</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <TrackingTimeline package={pkg} />
                            </CardContent>
                        </Card>

                        {driverLocation && (
                            <Card className="overflow-hidden">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <MapPin className="h-5 w-5" />
                                        Current Location
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-0 h-[400px]">
                                    <Map 
                                        center={[driverLocation.lat, driverLocation.lng]} 
                                        markers={[
                                            {
                                                id: pkg.id,
                                                position: [driverLocation.lat, driverLocation.lng],
                                                label: `Package ${pkg.tracking_code}`
                                            }
                                        ]}
                                    />
                                </CardContent>
                            </Card>
                        )}

                        <Card>
                            <CardHeader>
                                <CardTitle>Package Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                            <User className="h-3 w-3" /> Sender
                                        </p>
                                        <p className="text-sm">{pkg.sender_name}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                            <User className="h-3 w-3" /> Recipient
                                        </p>
                                        <p className="text-sm">{pkg.recipient_name}</p>
                                    </div>
                                </div>
                                <Separator />
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                        <MapPin className="h-3 w-3" /> Delivery Address
                                    </p>
                                    <p className="text-sm">{pkg.delivery_address}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Business</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <Building className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-medium">{pkg.business?.name || 'N/A'}</span>
                                </div>
                                {pkg.business?.phone && (
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Phone className="h-3 w-3" />
                                        {pkg.business.phone}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Driver</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {pkg.driver ? (
                                    <>
                                        <div className="flex items-center gap-2">
                                            <User className="h-4 w-4 text-muted-foreground" />
                                            <span className="font-medium">{pkg.driver.name}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Truck className="h-3 w-3" />
                                            {pkg.driver.vehicle}
                                        </div>
                                    </>
                                ) : (
                                    <p className="text-sm text-muted-foreground italic">
                                        No driver assigned yet.
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
