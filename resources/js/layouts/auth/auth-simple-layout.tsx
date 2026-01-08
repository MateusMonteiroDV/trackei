import { ReactNode } from 'react';
import { Link } from '@inertiajs/react';

interface AuthSimpleLayoutProps {
    role: 'admin' | 'driver' | 'client';
    children: ReactNode;
}

export default function ProtectRoute({ role, children }: AuthSimpleLayoutProps) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-200">

            {/* ADMIN NAV */}
            {role === 'admin' && (
                <header className="mb-6">
                    <nav className="mt-2">
                        <Link href="/home" className="mr-4 text-blue-600">Home</Link>
                        <Link href="/me" className="mr-4 text-blue-600">Profile</Link>
                        <Link href="/createDriver" className="mr-4 text-blue-600">Create Driver</Link>
                        <Link href="/editDriver" className="mr-4 text-blue-600">Edit Driver</Link>
                        <Link href="/deleteDriver" className="mr-4 text-blue-600">Delete Driver</Link>
                        <Link href="/createAdmin" className="mr-4 text-blue-600">Create Admin</Link>
                        <Link href="/drivers" className="mr-4 text-blue-600">Drivers</Link>
                    </nav>
                </header>
            )}

            {/* DRIVER NAV */}
            {role === 'driver' && (
                <header className="mb-6">
                    <nav className="mt-2">
                        <Link href="/home" className="mr-4 text-blue-600">Home</Link>
                        <Link href="/me" className="mr-4 text-blue-600">Profile</Link>
                        <Link href="/acceptPackage" className="mr-4 text-blue-600">Accept Package</Link>
                    </nav>
                </header>
            )}

            {/* CLIENT NAV */}
            {role === 'client' && (
                <header className="mb-6">
                    <nav className="mt-2">
                        <Link href="/home" className="mr-4 text-blue-600">Home</Link>
                        <Link href="/me" className="mr-4 text-blue-600">Profile</Link>
                        <Link href="/simulatePurchase" className="mr-4 text-blue-600">
                            Simulate Purchase
                        </Link>
                    </nav>
                </header>
            )}

            <main className="w-full max-w-md p-6 bg-white rounded shadow text-black">
                {children}
            </main>
        </div>
    );
}

