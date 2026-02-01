import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
import { useInitials } from '@/hooks/use-initials';
import ProtectRoute from '@/layouts/auth/auth-simple-layout';
import api from '@/lib/axios';
import { type SharedData, type User } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    Calendar,
    Mail,
    Shield,
    User as UserIcon,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

function Profile() {
    const { auth } = usePage<SharedData>().props;
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const getInitials = useInitials();
    const token = useSelector(
        (state: { auth: { token: string | null } }) => state.auth.token,
    );

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                const response = await api.get('/api/me', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUser(response.data);
                setError(null);
            } catch (err: unknown) {
                const axiosError = err as {
                    response?: { data?: { message?: string } };
                    message?: string;
                };
                setError(
                    axiosError.response?.data?.message ||
                    axiosError.message ||
                    'Failed to load profile',
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    return (
        <ProtectRoute role={auth.user.role as 'admin' | 'driver' | 'client'}>
            <Head title="Profile" />

            <div className="w-full bg-white px-4 py-6 text-black">
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Spinner className="h-8 w-8" />
                    </div>
                ) : error ? (
                    <Card className="border-destructive/50 bg-destructive/10">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-2 text-destructive">
                                <AlertCircle className="h-5 w-5" />
                                <p className="font-medium">Error</p>
                            </div>
                            <p className="mt-2 text-sm text-gray-500">
                                {error}
                            </p>
                        </CardContent>
                    </Card>
                ) : user ? (
                    <div className="space-y-6">
                        <div className="space-y-0.5">
                            <h2 className="text-2xl font-semibold tracking-tight text-black">
                                Profile
                            </h2>
                            <p className="text-sm text-gray-500">
                                View your account information
                            </p>
                        </div>

                        <Card>
                            <CardHeader>
                                <div className="flex items-start gap-4">
                                    <Avatar className="h-16 w-16">
                                        <AvatarImage
                                            src={user.avatar}
                                            alt={user.name}
                                        />
                                        <AvatarFallback className="text-lg">
                                            {getInitials(user.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 space-y-1">
                                        <CardTitle className="text-2xl text-black">
                                            {user.name}
                                        </CardTitle>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <Badge variant="secondary">
                                                {user.role}
                                            </Badge>
                                            {user.email_verified_at && (
                                                <Badge
                                                    variant="outline"
                                                    className="border-green-600 text-green-600"
                                                >
                                                    Verified
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <Separator />

                                <div className="space-y-4">
                                    <h3 className="text-sm font-medium text-gray-500">
                                        Account Information
                                    </h3>

                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-sm font-medium text-black">
                                                <UserIcon className="h-4 w-4 text-gray-500" />
                                                Username
                                            </div>
                                            <p className="text-sm text-gray-500">
                                                {user.username || '-'}
                                            </p>
                                        </div>

                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-sm font-medium text-black">
                                                <Mail className="h-4 w-4 text-gray-500" />
                                                Email
                                            </div>
                                            <p className="text-sm text-gray-500">
                                                {user.email}
                                            </p>
                                        </div>

                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-sm font-medium text-black">
                                                <Shield className="h-4 w-4 text-gray-500" />
                                                Role
                                            </div>
                                            <p className="text-sm text-gray-500">
                                                {user.role}
                                            </p>
                                        </div>

                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-sm font-medium text-black">
                                                <Calendar className="h-4 w-4 text-gray-500" />
                                                Member Since
                                            </div>
                                            <p className="text-sm text-gray-500">
                                                {new Date(
                                                    user.created_at,
                                                ).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                <div className="space-y-4">
                                    <h3 className="text-sm font-medium text-gray-500">
                                        Account Details
                                    </h3>

                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium text-black">
                                                User ID
                                            </p>
                                            <p className="font-mono text-sm text-gray-500">
                                                #{user.id}
                                            </p>
                                        </div>

                                        <div className="space-y-1">
                                            <p className="text-sm font-medium text-black">
                                                Business ID
                                            </p>
                                            <p className="font-mono text-sm text-gray-500">
                                                {user.business_id
                                                    ? `#${user.business_id}`
                                                    : '-'}
                                            </p>
                                        </div>

                                        <div className="space-y-1">
                                            <p className="text-sm font-medium text-black">
                                                Email Verified
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {user.email_verified_at
                                                    ? new Date(
                                                        user.email_verified_at,
                                                    ).toLocaleDateString()
                                                    : 'Not verified'}
                                            </p>
                                        </div>

                                        <div className="space-y-1">
                                            <p className="text-sm font-medium text-black">
                                                Last Updated
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {new Date(
                                                    user.updated_at,
                                                ).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {user.two_factor_enabled !== undefined && (
                                    <>
                                        <Separator />
                                        <div className="space-y-4">
                                            <h3 className="text-sm font-medium text-gray-500">
                                                Security
                                            </h3>
                                            <div className="flex items-center gap-2">
                                                {user.two_factor_enabled ? (
                                                    <Badge
                                                        variant="default"
                                                        className="bg-green-600 hover:bg-green-700"
                                                    >
                                                        Two-Factor Auth Enabled
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="secondary">
                                                        Two-Factor Auth Disabled
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                ) : null}
            </div>
        </ProtectRoute>
    );
}

export default Profile;
