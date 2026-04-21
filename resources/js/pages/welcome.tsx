import PublicLayout from '@/layouts/public-layout';
import { Head, Link } from '@inertiajs/react';
import { Search, MapPin, ShieldCheck, Zap, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Welcome() {
    return (
        <PublicLayout>
            <Head title="Welcome to TrackEi" />

            {/* Hero Section */}
            <section className="relative overflow-hidden pt-16 pb-24 sm:pt-24 sm:pb-32">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                        <div className="sm:text-center md:mx-auto md:max-w-2xl lg:col-span-6 lg:text-left">
                            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-6xl dark:text-white">
                                Logistics tracking <span className="text-indigo-600">made simple.</span>
                            </h1>
                            <p className="mt-6 text-xl text-gray-500 dark:text-gray-400">
                                TrackEi provides real-time visibility for your deliveries. Manage your fleet, track packages, and keep your customers informed.
                            </p>
                            <div className="mt-10 flex flex-col sm:flex-row sm:justify-center lg:justify-start gap-4">
                                <Button asChild size="lg" className="h-14 px-8 text-lg font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700">
                                    <Link href="/register">Start for Free</Link>
                                </Button>
                                <Button asChild variant="outline" size="lg" className="h-14 px-8 text-lg font-bold rounded-xl border-2">
                                    <Link href="/track">
                                        <Search className="mr-2 h-5 w-5" />
                                        Track Package
                                    </Link>
                                </Button>
                            </div>
                        </div>
                        <div className="relative mt-12 sm:mx-auto sm:max-w-lg lg:col-span-6 lg:mx-0 lg:mt-0 lg:flex lg:items-center">
                            <div className="relative mx-auto w-full rounded-3xl shadow-2xl overflow-hidden ring-1 ring-gray-200">
                                <img
                                    className="w-full"
                                    src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1000"
                                    alt="Logistics warehouse"
                                />
                                <div className="absolute inset-0 bg-indigo-600/10 mix-blend-multiply" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="bg-gray-50 dark:bg-zinc-900/50 py-24">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
                            Everything you need to manage deliveries
                        </h2>
                    </div>

                    <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
                        <div className="space-y-4">
                            <div className="bg-indigo-600 w-12 h-12 rounded-xl flex items-center justify-center text-white">
                                <MapPin className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-bold">Real-time GPS</h3>
                            <p className="text-gray-500 dark:text-gray-400">
                                Monitor your drivers' exact location and delivery progress in real-time on our live map.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <div className="bg-indigo-600 w-12 h-12 rounded-xl flex items-center justify-center text-white">
                                <ShieldCheck className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-bold">Secure Delivery</h3>
                            <p className="text-gray-500 dark:text-gray-400">
                                Confirmation protocols ensure that packages reach the right hands every time.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <div className="bg-indigo-600 w-12 h-12 rounded-xl flex items-center justify-center text-white">
                                <Zap className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-bold">Instant Notifications</h3>
                            <p className="text-gray-500 dark:text-gray-400">
                                Keep clients informed with automatic updates when status changes from pending to delivered.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="bg-indigo-600 rounded-3xl p-8 sm:p-16 text-center text-white shadow-2xl shadow-indigo-200 dark:shadow-none">
                        <h2 className="text-3xl font-bold tracking-tight sm:text-5xl mb-6">
                            Ready to streamline your logistics?
                        </h2>
                        <p className="text-indigo-100 text-xl mb-10 max-w-2xl mx-auto">
                            Join hundreds of businesses that trust TrackEi for their delivery management.
                        </p>
                        <Button asChild size="lg" variant="secondary" className="h-14 px-8 text-lg font-bold rounded-xl">
                            <Link href="/register">
                                Create your account
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
