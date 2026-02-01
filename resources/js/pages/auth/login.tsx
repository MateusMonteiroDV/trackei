import api from '@/lib/axios';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthCardLayout from '@/layouts/auth/auth-card-layout';

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
    const { t } = useTranslation();

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
                dispatch(setToken(res.data.token));
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
            <Head title={t('common.login')} />

            <AuthCardLayout
                title={t('auth.login.title')}
                description={t('auth.login.description')}
                footerLink={
                    canRegister
                        ? {
                              text: t('auth.login.noAccount'),
                              href: register().toString(),
                              label: t('auth.login.signUp'),
                          }
                        : undefined
                }
            >
                <form onSubmit={submit} className="space-y-4 sm:space-y-5">
                    {/* Email */}
                    <div className="space-y-1.5">
                        <Label htmlFor="email">
                            {t('auth.login.emailLabel')}
                        </Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            required
                            autoComplete="email"
                            placeholder={t('auth.login.emailPlaceholder')}
                        />
                        <InputError message={errors.email} />
                    </div>

                    {/* Password */}
                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password">
                                {t('auth.login.passwordLabel')}
                            </Label>
                            {canResetPassword && (
                                <TextLink
                                    href={request().toString()}
                                    className="text-sm"
                                >
                                    {t('common.forgotPassword')}
                                </TextLink>
                            )}
                        </div>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            required
                            autoComplete="current-password"
                            placeholder={t('auth.login.passwordPlaceholder')}
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="flex items-center space-x-2 pt-1">
                        <Checkbox id="remember" name="remember" />
                        <Label htmlFor="remember" className="text-sm">
                            {t('common.rememberMe')}
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
                        {t('auth.login.loginButton')}
                    </Button>
                </form>

                {status && (
                    <p className="mt-3 text-center text-sm font-medium text-green-600 sm:mt-4">
                        {status}
                    </p>
                )}
            </AuthCardLayout>
        </>
    );
}
