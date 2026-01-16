import { Spinner } from '@/components/ui/spinner';
import ProtectRoute from '@/layouts/auth/auth-simple-layout';
import { fetchUser } from '@/store/slices/authSlice';
import { router } from '@inertiajs/react';
import { ReactNode, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

interface RootState {
    auth: {
        token: string | null;
        user: {
            role: 'admin' | 'driver' | 'client';
        } | null;
        loading: boolean;
        authenticated: boolean;
    };
}

interface AuthProviderProps {
    children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
    const dispatch = useDispatch();
    const { user, token, loading, authenticated } = useSelector(
        (state: RootState) => state.auth,
    );

    useEffect(() => {
        if (!token) {
            router.visit('/login');
            return;
        }
        if (token && !authenticated) {
            dispatch(fetchUser());
        }
    }, [dispatch, token, authenticated]);

    if (loading) return <Spinner />;

    if (authenticated && user)
        return <ProtectRoute role={user.role}>{children}</ProtectRoute>;

    return null;
}
