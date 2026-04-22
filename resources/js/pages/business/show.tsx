import BusinessInfo from '@/components/business-info';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Business } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Save } from 'lucide-react';

interface ShowProps {
    business: Business;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Business',
        href: '/business/settings',
    },
    {
        title: 'Settings',
        href: '/business/settings',
    },
];

export default function Show({ business }: ShowProps) {
    const { data, setData, patch, processing, errors } = useForm({
        name: business.name,
        address: business.address || '',
        phone: business.phone || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(`/api/business/${business.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Business Settings" />

            <div className="flex flex-col gap-6 p-4 md:p-8">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-black">
                        Business Settings
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Manage your company information and preferences.
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    <div className="md:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-black">
                                    Update Information
                                </CardTitle>
                                <CardDescription>
                                    Update your company's public details.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-6"
                                >
                                    <div className="space-y-2">
                                        <Label htmlFor="name">
                                            Business Name
                                        </Label>
                                        <Input
                                            id="name"
                                            value={data.name}
                                            onChange={(e) =>
                                                setData('name', e.target.value)
                                            }
                                            required
                                        />
                                        <InputError message={errors.name} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="address">Address</Label>
                                        <Input
                                            id="address"
                                            value={data.address}
                                            onChange={(e) =>
                                                setData(
                                                    'address',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        <InputError message={errors.address} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="phone">
                                            Phone Number
                                        </Label>
                                        <Input
                                            id="phone"
                                            value={data.phone}
                                            onChange={(e) =>
                                                setData('phone', e.target.value)
                                            }
                                        />
                                        <InputError message={errors.phone} />
                                    </div>

                                    <div className="flex justify-end">
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                        >
                                            <Save className="mr-2 h-4 w-4" />
                                            Save Changes
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="md:col-span-1">
                        <BusinessInfo business={business} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
