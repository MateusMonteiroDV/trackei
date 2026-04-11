import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChevronLeft, Save } from 'lucide-react';
import { Link } from '@inertiajs/react';
import InputError from '@/components/input-error';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Packages',
        href: '/packages',
    },
    {
        title: 'Create',
        href: '/packages/create',
    },
];

export default function Create() {
    const { auth } = usePage<any>().props;

    const { data, setData, post, processing, errors } = useForm({
        sender_name: '',
        recipient_name: '',
        delivery_address: '',
        business_id: auth.user.business_id || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/packages'); // The web route handles creation and redirection
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Package" />

            <div className="flex flex-col gap-6 p-4 md:p-8">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/packages">
                            <ChevronLeft className="h-4 w-4" />
                            <span className="sr-only">Back</span>
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">New Package</h1>
                        <p className="text-sm text-muted-foreground">
                            Register a new package for tracking.
                        </p>
                    </div>
                </div>

                <div className="max-w-2xl">
                    <Card>
                        <CardHeader>
                            <CardTitle>Package Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="sender_name">Sender Name</Label>
                                    <Input
                                        id="sender_name"
                                        value={data.sender_name}
                                        onChange={(e) => setData('sender_name', e.target.value)}
                                        placeholder="Company or Person Name"
                                        required
                                    />
                                    <InputError message={errors.sender_name} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="recipient_name">Recipient Name</Label>
                                    <Input
                                        id="recipient_name"
                                        value={data.recipient_name}
                                        onChange={(e) => setData('recipient_name', e.target.value)}
                                        placeholder="Who will receive the package"
                                        required
                                    />
                                    <InputError message={errors.recipient_name} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="delivery_address">Delivery Address</Label>
                                    <Input
                                        id="delivery_address"
                                        value={data.delivery_address}
                                        onChange={(e) => setData('delivery_address', e.target.value)}
                                        placeholder="Full address"
                                        required
                                    />
                                    <InputError message={errors.delivery_address} />
                                </div>

                                <div className="flex justify-end gap-4">
                                    <Button variant="outline" asChild disabled={processing}>
                                        <Link href="/packages">Cancel</Link>
                                    </Button>
                                    <Button type="submit" disabled={processing}>
                                        <Save className="mr-2 h-4 w-4" />
                                        Save Package
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
