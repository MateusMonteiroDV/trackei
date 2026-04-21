import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import api from '@/lib/axios'
import { Head, router } from '@inertiajs/react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import { Button } from '@/components/ui/button'
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

import { login } from '@/routes'
import { setToken } from '@/store/slices/authSlice'

const registerSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  password_confirmation: z.string()
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords don't match",
  path: ["password_confirmation"],
})

type RegisterValues = z.infer<typeof registerSchema>

export default function Register() {
    const [processing, setProcessing] = useState(false)
    const dispatch = useDispatch()
    const { t } = useTranslation()

    const form = useForm<RegisterValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            password_confirmation: "",
        },
    })

    const onSubmit = async (values: RegisterValues) => {
        setProcessing(true)
        try {
            const res = await api.post('/api/register', values)
            if (res.status === 200) {
                dispatch(setToken(res.data.token))
                router.visit('/dashboard')
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
            <Head title={t('common.register')} />

            <AuthCardLayout
                title={t('auth.register.title')}
                description={t('auth.register.description')}
                footerLink={{
                    text: t('auth.register.haveAccount'),
                    href: login().toString(),
                    label: t('auth.register.login'),
                }}
            >
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('auth.register.nameLabel')}</FormLabel>
                                    <FormControl>
                                        <Input 
                                            placeholder={t('auth.register.namePlaceholder')} 
                                            {...field} 
                                            autoFocus
                                            autoComplete="name"
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
                                    <FormLabel>{t('auth.register.emailLabel')}</FormLabel>
                                    <FormControl>
                                        <Input 
                                            placeholder={t('auth.register.emailPlaceholder')} 
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
                                    <FormLabel>{t('auth.register.passwordLabel')}</FormLabel>
                                    <FormControl>
                                        <Input 
                                            type="password"
                                            placeholder={t('auth.register.passwordPlaceholder')} 
                                            {...field} 
                                            autoComplete="new-password"
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
                                    <FormLabel>{t('auth.register.confirmPasswordLabel')}</FormLabel>
                                    <FormControl>
                                        <Input 
                                            type="password"
                                            placeholder={t('auth.register.confirmPasswordPlaceholder')} 
                                            {...field} 
                                            autoComplete="new-password"
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
                            {processing && <Spinner className="h-4 w-4" />}
                            {t('auth.register.createAccountButton')}
                        </Button>
                    </form>
                </Form>
            </AuthCardLayout>
        </>
    )
}
