import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import ProtectRoute from '@/layouts/auth/auth-simple-layout';
import api from '@/lib/axios';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

interface BusinessFormData {
    name: string;
    cnpj: string;
    address: string;
    phone: string;
}

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
}

function CreateBusiness() {
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [success, setSuccess] = useState<CreateBusinessResponse | null>(null);
    const [formData, setFormData] = useState<BusinessFormData>({
        name: '',
        cnpj: '',
        address: '',
        phone: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    };

    const submit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});
        setSuccess(null);
        try {
            const response = await api.post('/api/create-business', formData);
            if (response.status === 201) {
                setSuccess(response.data);
                setFormData({ name: '', cnpj: '', address: '', phone: '' });
            }
        } catch (error: unknown) {
            const axiosError = error as {
                response?: {
                    status: number;
                    data?: { errors?: Record<string, string>; error?: string };
                };
            };
            if (axiosError.response?.status === 422) {
                setErrors(axiosError.response.data?.errors || {});
            } else {
                setErrors({
                    general:
                        axiosError.response?.data?.error ||
                        'Error creating business',
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
                        <form onSubmit={submit} className="space-y-5">
                            {errors.general && (
                                <div className="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                    {errors.general}
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="name">Business Name *</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    autoFocus
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="cnpj">CNPJ *</Label>
                                <Input
                                    id="cnpj"
                                    name="cnpj"
                                    value={formData.cnpj}
                                    onChange={handleInputChange}
                                    className="font-mono"
                                    placeholder="00.000.000/0000-00"
                                />
                                <InputError message={errors.cnpj} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="address">Address</Label>
                                <Input
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                />
                                <InputError message={errors.address} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone</Label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    placeholder="(00) 00000-0000"
                                />
                                <InputError message={errors.phone} />
                            </div>

                            <Button
                                type="submit"
                                disabled={processing}
                                variant="blue"
                                className="flex w-full items-center justify-center gap-2"
                            >
                                {processing && <Spinner className="h-4 w-4" />}
                                Create Business
                            </Button>
                        </form>
                    )}
                </div>
            </ProtectRoute>
        </>
    );
}

export default CreateBusiness;
