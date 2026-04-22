import api from '@/lib/axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
// import { useTranslation } from 'react-i18next' // Removed unused import
import { useDispatch } from 'react-redux';

import { Button } from '@/components/ui/button';
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
import ProtectRoute from '@/layouts/auth/auth-simple-layout';
import { dashboard } from '@/routes';
import { setToken } from '@/store/slices/authSlice';

const businessSchema = z.object({
    name: z
        .string()
        .min(3, { message: 'Business name must be at least 3 characters' }),
    cnpj: z.string().min(14, { message: 'Invalid CNPJ' }),
    address: z.string().optional(),
    phone: z.string().optional(),
});

type BusinessValues = z.infer<typeof businessSchema>;

interface CreateBusinessResponse {
    message: string;
    instruction: string;
    business: {
        id: number;
        name: string;
        cnpj: string;
        address: string | null;
        phone: string | null;
    };
    admin_credentials: {
        email: string;
        password: string;
    };
    token?: string;
}

export default function CreateBusiness() {
    const [processing, setProcessing] = useState(false);
    const [success, setSuccess] = useState<CreateBusinessResponse | null>(null);
    const dispatch = useDispatch();
    // const { t } = useTranslation() // Commented out unused t

    const form = useForm<BusinessValues>({
        resolver: zodResolver(businessSchema),
        defaultValues: {
            name: '',
            cnpj: '',
            address: '',
            phone: '',
        },
    });

    const onSubmit = async (values: BusinessValues) => {
        setProcessing(true);
        try {
            const response = await api.post('/api/create-business', values);
            if (response.status === 201) {
                if (response.data.token) {
                    dispatch(setToken(response.data.token));
                    router.visit(dashboard().url);
                } else {
                    setSuccess(response.data);
                }
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
        <>
            <Head title="Create Business" />

            <ProtectRoute
                role="client"
                title="Create Business"
                description="Create a new business account. An admin user will be automatically generated."
                showLogo={true}
            >
                <div className="mx-auto w-full max-w-md">
                    {success ? (
                        <div className="space-y-4 rounded-lg border border-green-200 bg-green-50 p-6">
                            <div>
                                <h3 className="text-lg font-semibold text-green-800">
                                    Business Created
                                </h3>
                                <p className="mt-1 text-sm text-green-700">
                                    {success.instruction}
                                </p>
                            </div>

                            <div className="space-y-3 text-sm text-gray-800">
                                <div className="space-y-2">
                                    <div>
                                        <strong>Name:</strong>{' '}
                                        {success.business.name}
                                    </div>
                                    <div>
                                        <strong>CNPJ:</strong>{' '}
                                        {success.business.cnpj}
                                    </div>
                                    {success.business.address && (
                                        <div>
                                            <strong>Address:</strong>{' '}
                                            {success.business.address}
                                        </div>
                                    )}
                                    {success.business.phone && (
                                        <div>
                                            <strong>Phone:</strong>{' '}
                                            {success.business.phone}
                                        </div>
                                    )}
                                </div>

                                <div className="rounded border border-red-200 bg-white p-4">
                                    <div className="mb-2 font-semibold text-red-800">
                                        Admin Credentials (save now!)
                                    </div>
                                    <div className="space-y-1">
                                        <div>
                                            Email:{' '}
                                            {success.admin_credentials.email}
                                        </div>
                                        <div>
                                            Password:{' '}
                                            <span className="font-mono">
                                                {
                                                    success.admin_credentials
                                                        .password
                                                }
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-5"
                            >
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Business Name *
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Example Logistics"
                                                    {...field}
                                                    autoFocus
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="cnpj"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>CNPJ *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="00.000.000/0000-00"
                                                    {...field}
                                                    className="font-mono"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="address"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Address</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Full address"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Phone</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="(00) 00000-0000"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button
                                    type="submit"
                                    disabled={processing}
                                    variant="blue"
                                    className="flex w-full items-center justify-center gap-2"
                                >
                                    {processing && (
                                        <Spinner className="h-4 w-4" />
                                    )}
                                    Create Business
                                </Button>
                            </form>
                        </Form>
                    )}
                </div>
            </ProtectRoute>
        </>
    );
}
