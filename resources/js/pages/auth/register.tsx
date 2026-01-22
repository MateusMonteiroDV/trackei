import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';

import { login } from '@/routes';
import { useDispatch } from 'react-redux';

import api from '@/lib/axios';
import { setToken } from '@/store/slices/authSlice';

export default function Register() {
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
            const res = await api.post('/api/register', {
                name: form.get('name'),
                email: form.get('email'),
                password: form.get('password'),
                password_confirmation: form.get('password_confirmation'),
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
            <Head title={t('common.register')} />

            <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-8">
                <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg sm:p-8">
                    <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">
                        {t('auth.register.title')}
                    </h1>
                    <p className="mt-1 mb-5 text-sm text-gray-600 sm:mb-6">
                        {t('auth.register.description')}
                    </p>

                    <form onSubmit={submit} className="space-y-4 sm:space-y-5">
                        {/* Name */}
                        <div className="space-y-1.5">
                            <Label htmlFor="name">
                                {t('auth.register.nameLabel')}
                            </Label>
                            <Input
                                id="name"
                                name="name"
                                required
                                autoFocus
                                autoComplete="name"
                                placeholder={t('auth.register.namePlaceholder')}
                            />
                            <InputError message={errors.name} />
                        </div>

                        {/* Email */}
                        <div className="space-y-1.5">
                            <Label htmlFor="email">
                                {t('auth.register.emailLabel')}
                            </Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                required
                                autoComplete="email"
                                placeholder={t(
                                    'auth.register.emailPlaceholder',
                                )}
                            />
                            <InputError message={errors.email} />
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5">
                            <Label htmlFor="password">
                                {t('auth.register.passwordLabel')}
                            </Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                required
                                autoComplete="new-password"
                                placeholder={t(
                                    'auth.register.passwordPlaceholder',
                                )}
                            />
                            <InputError message={errors.password} />
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-1.5">
                            <Label htmlFor="password_confirmation">
                                {t('auth.register.confirmPasswordLabel')}
                            </Label>
                            <Input
                                id="password_confirmation"
                                name="password_confirmation"
                                type="password"
                                required
                                autoComplete="new-password"
                                placeholder={t(
                                    'auth.register.confirmPasswordPlaceholder',
                                )}
                            />
                            <InputError
                                message={errors.password_confirmation}
                            />
                        </div>

                        {/* Submit */}
                        <Button
                            type="submit"
                            disabled={processing}
                            variant="blue"
                            className="flex w-full items-center justify-center gap-2"
                        >
                            {processing && <Spinner className="h-4 w-4" />}
                            {t('auth.register.createAccountButton')}
                        </Button>
                    </form>

                    <p className="mt-5 text-center text-sm text-gray-500 sm:mt-6">
                        {t('auth.register.haveAccount')}{' '}
                        <TextLink href={login()}>
                            {t('auth.register.login')}
                        </TextLink>
                    </p>
                </div>
            </div>
        </>
    );
}
