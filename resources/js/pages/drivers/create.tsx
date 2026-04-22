import api from '@/lib/axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
// import { useTranslation } from 'react-i18next' // Removed unused import

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import AppLayout from '@/layouts/app-layout';
import { ChevronLeft, Save } from 'lucide-react';

const driverSchema = z
    .object({
        name: z
            .string()
            .min(2, { message: 'Name must be at least 2 characters' }),
        username: z
            .string()
            .min(3, { message: 'Username must be at least 3 characters' }),
        email: z.string().email({ message: 'Invalid email address' }),
        cpf: z.string().min(11, { message: 'Invalid CPF' }),
        vehicle: z
            .string()
            .min(2, { message: 'Vehicle information is required' }),
        password: z
            .string()
            .min(8, { message: 'Password must be at least 8 characters' }),
        password_confirmation: z.string(),
    })
    .refine((data) => data.password === data.password_confirmation, {
        message: "Passwords don't match",
        path: ['password_confirmation'],
    });

type DriverValues = z.infer<typeof driverSchema>;

const breadcrumbs = [
    { title: 'Drivers', href: '/drivers' },
    { title: 'Add Driver', href: '/drivers/create' },
];

export default function Create() {
    const [processing, setProcessing] = useState(false);
    // const { t } = useTranslation() // Commented out unused t

    const form = useForm<DriverValues>({
        resolver: zodResolver(driverSchema),
        defaultValues: {
            name: '',
            username: '',
            email: '',
            cpf: '',
            vehicle: '',
            password: '',
            password_confirmation: '',
        },
    });

    const onSubmit = async (values: DriverValues) => {
        setProcessing(true);
        try {
            const res = await api.post('/api/create-driver', values);
            if (res.status === 201 || res.status === 200) {
                router.visit('/drivers');
            }
        } catch (error: any) {
            if (error.response?.status === 422) {
                const apiErrors = error.response.data.errors;
                Object.keys(apiErrors).forEach((key) => {
                    form.setError(key as any, {
                        type: 'manual',
                        message: apiErrors[key][0],
                    });
                });
            }
        } finally {
            setProcessing(false);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add Driver" />

            <div className="flex flex-col gap-6 p-4 md:p-8">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/drivers">
                            <ChevronLeft className="h-4 w-4" />
                            <span className="sr-only">Back</span>
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-black">
                            Add Driver
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Create a new driver profile and user account.
                        </p>
                    </div>
                </div>

                <div className="max-w-3xl">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-black">
                                Driver Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Form {...form}>
                                <form
                                    onSubmit={form.handleSubmit(onSubmit)}
                                    className="space-y-6"
                                >
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <FormField
                                            control={form.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Full Name
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="John Doe"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="cpf"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>CPF</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="000.000.000-00"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="grid gap-4 md:grid-cols-2">
                                        <FormField
                                            control={form.control}
                                            name="username"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Username
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="johndoe"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Email</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="email"
                                                            placeholder="john@example.com"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="vehicle"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Vehicle Information
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="e.g. Mercedes Sprinter (White) - ABC-1234"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="grid gap-4 md:grid-cols-2">
                                        <FormField
                                            control={form.control}
                                            name="password"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Password
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="password"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="password_confirmation"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Confirm Password
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="password"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="flex justify-end gap-4">
                                        <Button
                                            variant="outline"
                                            asChild
                                            disabled={processing}
                                        >
                                            <Link href="/drivers">Cancel</Link>
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                        >
                                            {processing && (
                                                <Spinner className="mr-2 h-4 w-4" />
                                            )}
                                            <Save className="mr-2 h-4 w-4" />
                                            Save Driver
                                        </Button>
                                    </div>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
