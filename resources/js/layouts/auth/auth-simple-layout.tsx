
import { ReactNode } from 'react';
import { Link } from '@inertiajs/react';
import { home, login, register } from '@/routes';

interface AuthSimpleLayoutProps {
    children: ReactNode;
}

export default function AuthSimpleLayout({ children,title,description}: AuthSimpleLayoutProps) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
            <header className="mb-6">
                <h1 className="text-3xl font-bold">My App</h1>
                <nav className="mt-2">
                    <Link href="/home" className="mr-4 text-blue-600">Home</Link>
                    <Link href="/login"className="mr-4 text-blue-600">Login</Link>
                    <Link href="/register" className="text-blue-600">Register</Link>
                </nav>
            </header>

            <main className="w-full max-w-md p-6 bg-white rounded shadow">
                {children}
            </main>
        </div>
    );
}

