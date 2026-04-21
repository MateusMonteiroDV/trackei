import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import api from '@/lib/axios'
import { Head, router } from '@inertiajs/react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import AuthCardLayout from '@/layouts/auth/auth-card-layout'
import TextLink from '@/components/text-link'

import { register } from '@/routes'
import { request } from '@/routes/password'
import { setToken } from '@/store/slices/authSlice'

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  remember: z.boolean().default(false),
})

type LoginValues = z.infer<typeof loginSchema>

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
    const [processing, setProcessing] = useState(false)
    const dispatch = useDispatch()
    const { t } = useTranslation()

    const form = useForm<LoginValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
            remember: false,
        },
    })

    const onSubmit = async (values: LoginValues) => {
        setProcessing(true)
        try {
            const res = await api.post('/api/login', values)
            if (res.status === 200) {
                dispatch(setToken(res.data.token))
                const user = res.data.user
                if (!user.business_id && user.role === 'user') {
                    router.visit('/create-business')
                } else {
                    router.visit('/dashboard')
                }
            }
        } catch (error: any) {
            if (error.response?.status === 422) {
                const apiErrors = error.response.data.errors
                Object.keys(apiErrors).forEach((key) => {
                    form.setError(key as any, {
                        type: "manual",
                        message: apiErrors[key][0],
                    })
                })
            }
        } finally {
            setProcessing(false)
        }
    }

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
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('auth.login.emailLabel')}</FormLabel>
                                    <FormControl>
                                        <Input 
                                            placeholder={t('auth.login.emailPlaceholder')} 
                                            {...field} 
                                            autoComplete="email"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex items-center justify-between">
                                        <FormLabel>{t('auth.login.passwordLabel')}</FormLabel>
                                        {canResetPassword && (
                                            <TextLink
                                                href={request().toString()}
                                                className="text-sm"
                                            >
                                                {t('common.forgotPassword')}
                                            </TextLink>
                                        )}
                                    </div>
                                    <FormControl>
                                        <Input 
                                            type="password"
                                            placeholder={t('auth.login.passwordPlaceholder')} 
                                            {...field} 
                                            autoComplete="current-password"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="remember"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center space-x-2 space-y-0 pt-1">
                                    <FormControl>
                                        <Checkbox 
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormLabel className="text-sm font-normal">
                                        {t('common.rememberMe')}
                                    </FormLabel>
                                </FormItem>
                            )}
                        />

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
                </Form>

                {status && (
                    <p className="mt-3 text-center text-sm font-medium text-green-600 sm:mt-4">
                        {status}
                    </p>
                )}
            </AuthCardLayout>
        </>
    )
}
