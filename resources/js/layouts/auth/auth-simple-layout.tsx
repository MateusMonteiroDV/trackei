import { Link } from '@inertiajs/react';
import { ReactNode, useState } from 'react';

interface AuthSimpleLayoutProps {
    role?: 'admin' | 'driver' | 'client';
    children: ReactNode;
    title?: string;
    description?: string;
    showLogo?: boolean;
}

export default function ProtectRoute({
    role,
    children,
    title,
    description,
    showLogo,
}: AuthSimpleLayoutProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const renderNavigationItems = () => (
        <>
            <Link
                href="/home"
                className="rounded-md px-3 py-2 text-blue-600 hover:bg-gray-100"
            >
                Home
            </Link>
            <Link
                href="/profile"
                className="rounded-md px-3 py-2 text-blue-600 hover:bg-gray-100"
            >
                Profile
            </Link>
            {role === 'admin' && (
                <>
                    <Link
                        href="/createDriver"
                        className="rounded-md px-3 py-2 text-blue-600 hover:bg-gray-100"
                    >
                        Create Driver
                    </Link>
                    <Link
                        href="/editDriver"
                        className="rounded-md px-3 py-2 text-blue-600 hover:bg-gray-100"
                    >
                        Edit Driver
                    </Link>
                    <Link
                        href="/deleteDriver"
                        className="rounded-md px-3 py-2 text-blue-600 hover:bg-gray-100"
                    >
                        Delete Driver
                    </Link>
                    <Link
                        href="/createAdmin"
                        className="rounded-md px-3 py-2 text-blue-600 hover:bg-gray-100"
                    >
                        Create Admin
                    </Link>
                    <Link
                        href="/drivers"
                        className="rounded-md px-3 py-2 text-blue-600 hover:bg-gray-100"
                    >
                        Drivers
                    </Link>
                </>
            )}
            {role === 'driver' && (
                <Link
                    href="/acceptPackage"
                    className="rounded-md px-3 py-2 text-blue-600 hover:bg-gray-100"
                >
                    Accept Package
                </Link>
            )}
            {role === 'client' && (
                <Link
                    href="/simulatePurchase"
                    className="rounded-md px-3 py-2 text-blue-600 hover:bg-gray-100"
                >
                    Simulate Purchase
                </Link>
            )}
            <Link
                href="/create-business"
                className="mt-2 rounded-md border border-blue-200 bg-blue-50 px-4 py-2 text-blue-600 hover:bg-blue-100"
            >
                Create Business
            </Link>
        </>
    );

    return (
        <div className="min-h-screen !bg-white bg-white">
            <>
                <header className="sticky top-0 z-50 w-full border-b !bg-white bg-white shadow-sm">
                    <div className="mx-auto flex h-16 w-full items-center justify-between px-4 sm:px-6 lg:max-w-7xl">
                        <h1 className="text-lg font-semibold text-gray-900">
                            Trackei Dashboard
                        </h1>

                        <nav className="hidden items-center space-x-1 md:flex">
                            {renderNavigationItems()}
                        </nav>

                        <div className="relative md:hidden">
                            <button
                                type="button"
                                onClick={() =>
                                    setMobileMenuOpen(!mobileMenuOpen)
                                }
                                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-gray-300 bg-white hover:bg-gray-100"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="black"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <line x1="3" y1="6" x2="21" y2="6" />
                                    <line x1="3" y1="12" x2="21" y2="12" />
                                    <line x1="3" y1="18" x2="21" y2="18" />
                                </svg>
                            </button>

                            {mobileMenuOpen && (
                                <div className="absolute top-full right-0 z-50 mt-2 flex w-72 flex-col space-y-2 rounded border border-gray-200 bg-white p-4 shadow-lg">
                                    {renderNavigationItems()}
                                    <button
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="mt-4 rounded bg-gray-100 px-3 py-2 hover:bg-gray-200"
                                    >
                                        Close
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                <main className="!bg-white bg-white px-4 py-8 pt-24">
                    {title && (
                        <div className="mb-6 space-y-1">
                            <h1 className="text-2xl font-semibold tracking-tight text-black">
                                {title}
                            </h1>
                            {description && (
                                <p className="text-sm text-gray-500">
                                    {description}
                                </p>
                            )}
                        </div>
                    )}
                    {children}
                </main>
            </>
        </div>
    );
}
