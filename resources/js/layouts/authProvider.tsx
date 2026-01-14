
import ProtectRoute from '@/layouts/auth/auth-simple-layout';
import { useSelector, useDispatch } from 'react-redux';
import { ReactNode, useEffect, useState } from 'react';
import { router } from '@inertiajs/react';
import { Spinner } from '@/components/ui/spinner';
import api from '@/lib/axios';
import { setUser } from '@/store/slices/authSlice';

interface RootState {
  auth: {
    user: {
      role: 'admin' | 'driver' | 'client';
    } | null;
  };
}

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const token = useSelector((state: RootState) => state.auth.token);
    console.log(token)
  const [loading, setLoading] = useState(true);

useEffect(() => {
    if (!token){
       setLoading(false)
        return;
    }
    api.get('/api/me', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    .then((res) => {
        dispatch(setUser(res.data));
    })
    .catch((err) => {
        console.error(err);
    }).finally(()=>{
            setLoading(false)
    });
}, [dispatch, token]);

  if (loading) return <Spinner />;

  if (!user) return null;

  return (
    <ProtectRoute role={user.role}>
      {children}
    </ProtectRoute>
  );
}

