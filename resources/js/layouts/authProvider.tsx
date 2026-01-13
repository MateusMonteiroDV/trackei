import ProtectRoute from '@/layouts/auth/auth-simple-layout';
import { useSelector,useDispatch } from 'react-redux';
import { ReactNode } from 'react';
import { router } from '@inertiajs/react'
import {useEffect,useState} from 'react'
import {Spinner} from '@/components/ui/spinner'
import api from '@/lib/axios'
interface RootState {

    auth: {
        user: {
            role: 'admin' | 'driver' | 'client';
        };
    };
}

interface AuthProviderProps {
    children: ReactNode;
}
export default function AuthProvider({ children }: AuthProviderProps) {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const [loading, setLoading] = useState(true);

useEffect(() => {
   api.get('/api/me')
    .then(res => {
      dispatch(setUser(res.data));
    })
    .catch(() => {
      router.visit('/login', { replace: true });
    })
    .finally(() => setLoading(false));
}, []);



if (loading) return <Spinner />;

if (!user) return null;


  return (
    <ProtectRoute role={user.role}>
      {children}
    </ProtectRoute>
  );
}
