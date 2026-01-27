import api from '@/lib/axios'
import { Head } from '@inertiajs/react'
import { useState } from 'react'
import ProtectRoute from '@/layouts/auth/auth-simple-layout'
import InputError from '@/components/input-error'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'

interface BusinessFormData {
    name: string
    cnpj: string
    address: string
    phone: string
}

interface CreateBusinessResponse {
    message: string
    instruction: string
    business: {
        id: number
        name: string
        cnpj: string
        address: string | null
        phone: string | null
    }
    admin_credentials: {
        email: string
        password: string
    }
}

function CreateBusiness() {
    const [processing, setProcessing] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [success, setSuccess] = useState<CreateBusinessResponse | null>(null)
    const [formData, setFormData] = useState<BusinessFormData>({
        name: '',
        cnpj: '',
        address: '',
        phone: '',
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
    }

    const submit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setProcessing(true)
        setErrors({})
        setSuccess(null)
        try {
            const response = await api.post('/api/create-business', formData)
            if (response.status === 201) {
                setSuccess(response.data)
                setFormData({ name: '', cnpj: '', address: '', phone: '' })
            }
        } catch (error: unknown) {
            const axiosError = error as {
                response?: { status: number; data?: { errors?: Record<string, string>; error?: string } }
            }
            if (axiosError.response?.status === 422) {
                setErrors(axiosError.response.data?.errors || {})
            } else {
                setErrors({ general: axiosError.response?.data?.error || 'Error creating business' })
            }
        } finally {
            setProcessing(false)
        }
    }

    return (
        <>
            <Head title="Create Business" />

            <div className="min-h-screen flex items-center justify-center bg-white px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900">Create Business</h1>
                        <p className="mt-2 text-sm text-gray-600">
                            Create a new business account. An admin user will be automatically generated.
                        </p>
                    </div>

                    {success ? (
                        <Card className="border-green-200 bg-green-50">
                            <CardHeader>
                                <CardTitle className="text-green-800">Business Created</CardTitle>
                                <CardDescription className="text-green-700">
                                    {success.instruction}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4 text-sm text-gray-800">
                                <div className="space-y-1">
                                    <div><strong>Name:</strong> {success.business.name}</div>
                                    <div><strong>CNPJ:</strong> {success.business.cnpj}</div>
                                    {success.business.address && (
                                        <div><strong>Address:</strong> {success.business.address}</div>
                                    )}
                                    {success.business.phone && (
                                        <div><strong>Phone:</strong> {success.business.phone}</div>
                                    )}
                                </div>
                                <div className="rounded border border-red-200 bg-white p-4">
                                    <div className="font-semibold text-red-800 mb-2">Admin Credentials (save now!)</div>
                                    <div>Email: {success.admin_credentials.email}</div>
                                    <div>
                                        Password:{' '}
                                        <span className="font-mono">{success.admin_credentials.password}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="border-gray-200 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-gray-900">Business Information</CardTitle>
                                <CardDescription>Fill in the details below to create a new business.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={submit} className="space-y-5">
                                    {errors.general && (
                                        <div className="rounded bg-red-50 px-4 py-3 text-sm text-red-700 border border-red-200">
                                            {errors.general}
                                        </div>
                                    )}

                                    <div className="space-y-2">
                                        <Label htmlFor="name" className="text-gray-700">Business Name *</Label>
                                        <Input id="name" name="name" value={formData.name} onChange={handleInputChange} autoFocus />
                                        <InputError message={errors.name} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="cnpj" className="text-gray-700">CNPJ *</Label>
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
                                        <Label htmlFor="address" className="text-gray-700">Address</Label>
                                        <Input id="address" name="address" value={formData.address} onChange={handleInputChange} />
                                        <InputError message={errors.address} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="phone" className="text-gray-700">Phone</Label>
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
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white h-11 text-base font-medium"
                                    >
                                        {processing && <Spinner className="mr-2 h-5 w-5" />}
                                        Create Business
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    )}

                    <p className="text-center text-sm text-gray-500">
                        © {new Date().getFullYear()} Trackkei
                    </p>
                </div>
            </div>
        </>
    )
}

CreateBusiness.layout = (page: React.ReactNode) => (
    <ProtectRoute role="client">{page}</ProtectRoute>
)

export default CreateBusiness
