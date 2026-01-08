import ProtectRoute from '@/layouts/auth/auth-simple-layout';
import { useSelector } from 'react-redux';
import { ReactNode } from 'react';
import { router } from '@inertiajs/react'
import {useEffect} from 'react'
import {Spinner} from '@/components/ui/spinner'
import axios from 'axios'
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
    axios.get('/api/me')
      .then(res => {
        if (res.data) {
          dispatch(setUser(res.data));
          router.visit('/dashboard', { replace: true });
        } else {
          router.visit('/login', { replace: true });
        }
      })
      .catch(() => {
        router.visit('/login', { replace: true });
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading || !user) {
    return <Spinner />;
  }

  return (
    <ProtectRoute role={user.role}>
      {children}
    </ProtectRoute>
  );
}
