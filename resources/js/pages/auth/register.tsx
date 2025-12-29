import { useState } from 'react'
import axios from 'axios'
import { router, Head } from '@inertiajs/react'
import { login } from '@/routes'

import InputError from '@/components/input-error'
import TextLink from '@/components/text-link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'
import AuthLayout from '@/layouts/auth-layout'

export default function Register() {
    const [processing, setProcessing] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})

    const submit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setProcessing(true)
        setErrors({})

        const form = new FormData(e.currentTarget)

        try {
            const res = await axios.post('/api/register', {
                name: form.get('name'),
                email: form.get('email'),
                password: form.get('password'),
                password_confirmation: form.get('password_confirmation'),
            })

            localStorage.setItem('token', res.data.token)

            router.visit('/dashboard')
        } catch (error: any) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors)
            }
        } finally {
            setProcessing(false)
        }
    }

    return (
        <AuthLayout
            title="Create an account"
            description="Enter your details below to create your account"
        >
            <Head title="Register" />

            <form onSubmit={submit} className="flex flex-col gap-6">
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" name="name" required autoFocus />
                        <InputError message={errors.name} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email">Email address</Label>
                        <Input id="email" name="email" type="email" required />
                        <InputError message={errors.email} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" name="password" type="password" required />
                        <InputError message={errors.password} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password_confirmation">
                            Confirm password
                        </Label>
                        <Input
                            id="password_confirmation"
                            name="password_confirmation"
                            type="password"
                            required
                        />
                        <InputError message={errors.password_confirmation} />
                    </div>

                    <Button
                        type="submit"
                        className="mt-2 w-full"
                        variant="blue"
                        disabled={processing}
                    >
                        {processing && <Spinner />}
                        Create account
                    </Button>
                </div>

                <div className="text-center text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <TextLink href={login()}>
                        Log in
                    </TextLink>
                </div>
            </form>
        </AuthLayout>
    )
}

