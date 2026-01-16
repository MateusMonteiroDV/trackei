import api from '@/lib/axios';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';

import { register } from '@/routes';
import { request } from '@/routes/password';
import { useDispatch } from 'react-redux';

import { setToken } from '@/store/slices/authSlice';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
}

export default function Login({
    status,
    canResetPassword,
    canRegister,
}: LoginProps) {
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const dispatch = useDispatch();

    const submit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});
        const form = new FormData(e.currentTarget);

        try {
            const res = await api.post('/api/login', {
                email: form.get('email'),
                password: form.get('password'),
                remember: !!form.get('remember'),
            });
            if (res.status == 200) {
                await dispatch(setToken(res.data.token));
                router.visit('/dashboard');
            }
        } catch (error: any) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors);
            }
        } finally {
            setProcessing(false);
        }
    };

    return (
        <>
            <Head title="Log in" />

            <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
                <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Log in to your account
                    </h1>
                    <p className="mt-1 mb-6 text-sm text-black">
                        Enter your email and password below
                    </p>

                    <form onSubmit={submit} className="space-y-5">
                        {/* Email */}
                        <div className="space-y-1">
                            <Label htmlFor="email">Email address</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                required
                                autoComplete="email"
                            />
                            <InputError message={errors.email} />
                        </div>

                        {/* Password */}
                        <div className="space-y-1">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                                {canResetPassword && (
                                    <TextLink
                                        href={request()}
                                        className="text-sm"
                                    >
                                        Forgot password?
                                    </TextLink>
                                )}
                            </div>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                required
                                autoComplete="current-password"
                            />
                            <InputError message={errors.password} />
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox id="remember" name="remember" />
                            <Label htmlFor="remember" className="text-sm">
                                Remember me
                            </Label>
                        </div>

                        {/* Submit */}
                        <Button
                            type="submit"
                            disabled={processing}
                            variant="blue"
                            className="flex w-full items-center justify-center gap-2"
                        >
                            {processing && <Spinner className="h-4 w-4" />}
                            Log in
                        </Button>
                    </form>

                    {canRegister && (
                        <p className="mt-6 text-center text-sm text-gray-500">
                            Don’t have an account?{' '}
                            <TextLink href={register()}>Sign up</TextLink>
                        </p>
                    )}

                    {status && (
                        <p className="mt-4 text-center text-sm font-medium text-green-600">
                            {status}
                        </p>
                    )}
                </div>
            </div>
        </>
    );
}
