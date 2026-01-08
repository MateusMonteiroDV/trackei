import AuthProvider from '@/layouts/authProvider';

export default function Dashboard() {
  return
    {
        <h1>Dashboard</h1>;
    }

}

Dashboard.layout = (page: React.ReactNode) => (
  <AuthProvider>
    {page}
  </AuthProvider>
);

