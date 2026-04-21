import PublicLayout from '@/layouts/public-layout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Search, Package, MapPin, Clock, CheckCircle, Truck } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import api from '@/lib/axios';
import TrackingTimeline from '@/components/tracking-timeline';
import Map from '@/components/map';

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
            setError(err.response?.data?.message || 'Package not found. Please check the code.');
        } finally {
            setLoading(false);
        }
    };

    const driverLocation = pkg?.driver?.latest_location;

    return (
        <PublicLayout>
            <Head title="Track your package" />
            
            <div className="container mx-auto px-4 py-12 max-w-4xl">
                <div className="text-center space-y-4 mb-12">
                    <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
                        Where is my <span className="text-indigo-600">package?</span>
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        Enter your tracking code below to see the current status and location.
                    </p>
                </div>

                <Card className="shadow-xl border-none ring-1 ring-gray-200">
                    <CardContent className="p-6 sm:p-10">
                        <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <Input 
                                    className="h-14 pl-11 text-lg rounded-xl font-mono"
                                    placeholder="TRKXXXXXXXX"
                                    value={trackingCode}
                                    onChange={(e) => setTrackingCode(e.target.value.toUpperCase())}
                                />
                            </div>
                            <Button 
                                type="submit" 
                                disabled={loading}
                                className="h-14 px-8 text-lg font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
                            >
                                {loading ? 'Searching...' : 'Track Now'}
                            </Button>
                        </form>

                        {error && (
                            <div className="mt-6 p-4 rounded-xl bg-red-50 text-red-700 text-sm font-medium border border-red-100">
                                {error}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {pkg && (
                    <div className="mt-12 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="grid gap-8 md:grid-cols-3">
                            <div className="md:col-span-2 space-y-8">
                                <Card className="border-none shadow-lg rounded-2xl overflow-hidden">
                                    <CardHeader className="bg-gray-50 dark:bg-zinc-900 border-b">
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
                                    <Card className="border-none shadow-lg rounded-2xl overflow-hidden">
                                        <CardHeader className="bg-gray-50 dark:bg-zinc-900 border-b">
                                            <CardTitle className="flex items-center gap-2">
                                                <MapPin className="h-5 w-5 text-indigo-600" />
                                                Live Map
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-0 h-[400px]">
                                            <Map 
                                                center={[driverLocation.lat, driverLocation.lng]} 
                                                markers={[
                                                    {
                                                        id: pkg.id,
                                                        position: [driverLocation.lat, driverLocation.lng],
                                                        label: 'Your package is here'
                                                    }
                                                ]}
                                            />
                                        </CardContent>
                                    </Card>
                                )}
                            </div>

                            <div className="space-y-8">
                                <Card className="border-none shadow-lg rounded-2xl overflow-hidden h-full">
                                    <CardHeader className="bg-gray-50 dark:bg-zinc-900 border-b">
                                        <CardTitle className="text-lg">Package Info</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-6 space-y-6">
                                        <div className="space-y-1">
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Status</p>
                                            <div className="flex items-center gap-2">
                                                <span className={`h-2 w-2 rounded-full ${
                                                    pkg.status === 'delivered' ? 'bg-green-500' : 'bg-amber-500'
                                                }`} />
                                                <p className="font-bold text-gray-900 dark:text-white capitalize">{pkg.status.replace('_', ' ')}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="space-y-1">
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Recipient</p>
                                            <p className="font-medium text-gray-900 dark:text-white">{pkg.recipient_name}</p>
                                        </div>

                                        <div className="space-y-1">
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Address</p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{pkg.delivery_address}</p>
                                        </div>

                                        {pkg.business && (
                                            <div className="pt-4 border-t">
                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Shipped via</p>
                                                <div className="flex items-center gap-2">
                                                    <div className="bg-indigo-100 dark:bg-indigo-900/40 p-1.5 rounded-lg text-indigo-600">
                                                        <Package className="h-4 w-4" />
                                                    </div>
                                                    <p className="font-bold text-sm">{pkg.business.name}</p>
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
