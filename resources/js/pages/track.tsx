import { lazy, Suspense } from 'react';
import ErrorBoundary from '@/components/error-boundary';
import { Skeleton } from '@/components/ui/skeleton';
import TrackingTimeline from '@/components/tracking-timeline';

const Map = lazy(() => import('@/components/map'));
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import PublicLayout from '@/layouts/public-layout';
import api from '@/lib/axios';
import { Head } from '@inertiajs/react';
import { Clock, MapPin, Package, Search } from 'lucide-react';
import { useState } from 'react';

export default function Track() {
    const [trackingCode, setTrackingCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [pkg, setPkg] = useState<any>(null);
    const [error, setError] = useState('');

    const handleTrack = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!trackingCode) return;

        setLoading(true);
        setError('');
        setPkg(null);

        try {
            const res = await api.get(`/api/track/${trackingCode}`);
            setPkg(res.data);
        } catch (err: any) {
            setError(
                err.response?.data?.message ||
                    'Package not found. Please check the code.',
            );
        } finally {
            setLoading(false);
        }
    };

    const driverLocation = pkg?.driver?.latest_location;

    return (
        <PublicLayout>
            <Head title="Track your package" />

            <div className="container mx-auto max-w-4xl px-4 py-12">
                <div className="mb-12 space-y-4 text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
                        Where is my{' '}
                        <span className="text-indigo-600">package?</span>
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        Enter your tracking code below to see the current status
                        and location.
                    </p>
                </div>

                <Card className="border-none shadow-xl ring-1 ring-gray-200">
                    <CardContent className="p-6 sm:p-10">
                        <form
                            onSubmit={handleTrack}
                            className="flex flex-col gap-4 sm:flex-row"
                        >
                            <div className="relative flex-1">
                                <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
                                <Input
                                    className="h-14 rounded-xl pl-11 font-mono text-lg"
                                    placeholder="TRKXXXXXXXX"
                                    value={trackingCode}
                                    onChange={(e) =>
                                        setTrackingCode(
                                            e.target.value.toUpperCase(),
                                        )
                                    }
                                />
                            </div>
                            <Button
                                type="submit"
                                disabled={loading}
                                className="h-14 rounded-xl bg-indigo-600 px-8 text-lg font-bold shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700"
                            >
                                {loading ? 'Searching...' : 'Track Now'}
                            </Button>
                        </form>

                        {error && (
                            <div className="mt-6 rounded-xl border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-700">
                                {error}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {pkg && (
                    <div className="mt-12 animate-in space-y-8 duration-500 fade-in slide-in-from-bottom-4">
                        <div className="grid gap-8 md:grid-cols-3">
                            <div className="space-y-8 md:col-span-2">
                                <Card className="overflow-hidden rounded-2xl border-none shadow-lg">
                                    <CardHeader className="border-b bg-gray-50 dark:bg-zinc-900">
                                        <CardTitle className="flex items-center gap-2">
                                            <Clock className="h-5 w-5 text-indigo-600" />
                                            Tracking Timeline
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-8">
                                        <TrackingTimeline package={pkg} />
                                    </CardContent>
                                </Card>

                                {driverLocation && (
                                    <Card className="overflow-hidden rounded-2xl border-none shadow-lg">
                                        <CardHeader className="border-b bg-gray-50 dark:bg-zinc-900">
                                            <CardTitle className="flex items-center gap-2">
                                                <MapPin className="h-5 w-5 text-indigo-600" />
                                                Live Map
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="h-[400px] p-0">
                                            <ErrorBoundary>
                                                <Suspense fallback={<Skeleton className="h-full w-full" />}>
                                                    <Map
                                                        center={[
                                                            driverLocation.lat,
                                                            driverLocation.lng,
                                                        ]}
                                                        markers={[
                                                            {
                                                                id: pkg.id,
                                                                position: [
                                                                    driverLocation.lat,
                                                                    driverLocation.lng,
                                                                ],
                                                                label: 'Your package is here',
                                                            },
                                                        ]}
                                                    />
                                                </Suspense>
                                            </ErrorBoundary>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>

                            <div className="space-y-8">
                                <Card className="h-full overflow-hidden rounded-2xl border-none shadow-lg">
                                    <CardHeader className="border-b bg-gray-50 dark:bg-zinc-900">
                                        <CardTitle className="text-lg">
                                            Package Info
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6 p-6">
                                        <div className="space-y-1">
                                            <p className="text-xs font-bold tracking-wider text-gray-400 uppercase">
                                                Status
                                            </p>
                                            <div className="flex items-center gap-2">
                                                <span
                                                    className={`h-2 w-2 rounded-full ${
                                                        pkg.status ===
                                                        'delivered'
                                                            ? 'bg-green-500'
                                                            : 'bg-amber-500'
                                                    }`}
                                                />
                                                <p className="font-bold text-gray-900 capitalize dark:text-white">
                                                    {pkg.status.replace(
                                                        '_',
                                                        ' ',
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <p className="text-xs font-bold tracking-wider text-gray-400 uppercase">
                                                Recipient
                                            </p>
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                {pkg.recipient_name}
                                            </p>
                                        </div>

                                        <div className="space-y-1">
                                            <p className="text-xs font-bold tracking-wider text-gray-400 uppercase">
                                                Address
                                            </p>
                                            <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                                                {pkg.delivery_address}
                                            </p>
                                        </div>

                                        {pkg.business && (
                                            <div className="border-t pt-4">
                                                <p className="mb-2 text-xs font-bold tracking-wider text-gray-400 uppercase">
                                                    Shipped via
                                                </p>
                                                <div className="flex items-center gap-2">
                                                    <div className="rounded-lg bg-indigo-100 p-1.5 text-indigo-600 dark:bg-indigo-900/40">
                                                        <Package className="h-4 w-4" />
                                                    </div>
                                                    <p className="text-sm font-bold">
                                                        {pkg.business.name}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}
