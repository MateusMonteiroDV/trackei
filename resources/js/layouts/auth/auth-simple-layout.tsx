import { Link } from '@inertiajs/react'
import { Menu } from 'lucide-react'
import { ReactNode, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet'

interface AuthSimpleLayoutProps {
    role: 'admin' | 'driver' | 'client'
    children: ReactNode
}

export default function ProtectRoute({
    role,
    children,
}: AuthSimpleLayoutProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const renderNavigationItems = () => (
        <>
            <Link href="/home" className="rounded-md px-3 py-2 text-blue-600 hover:bg-gray-100">
                Home
            </Link>
            <Link href="/me" className="rounded-md px-3 py-2 text-blue-600 hover:bg-gray-100">
                Profile
            </Link>

            {role === 'admin' && (
                <>
                    <Link href="/createDriver" className="rounded-md px-3 py-2 text-blue-600 hover:bg-gray-100">
                        Create Driver
                    </Link>
                    <Link href="/editDriver" className="rounded-md px-3 py-2 text-blue-600 hover:bg-gray-100">
                        Edit Driver
                    </Link>
                    <Link href="/deleteDriver" className="rounded-md px-3 py-2 text-blue-600 hover:bg-gray-100">
                        Delete Driver
                    </Link>
                    <Link href="/createAdmin" className="rounded-md px-3 py-2 text-blue-600 hover:bg-gray-100">
                        Create Admin
                    </Link>
                    <Link href="/drivers" className="rounded-md px-3 py-2 text-blue-600 hover:bg-gray-100">
                        Drivers
                    </Link>
                </>
            )}

            {role === 'driver' && (
                <Link href="/acceptPackage" className="rounded-md px-3 py-2 text-blue-600 hover:bg-gray-100">
                    Accept Package
                </Link>
            )}

            {role === 'client' && (
                <Link href="/simulatePurchase" className="rounded-md px-3 py-2 text-blue-600 hover:bg-gray-100">
                    Simulate Purchase
                </Link>
            )}

            <Link
                href="/create-business"
                className="ml-2 rounded-md border border-blue-200 bg-blue-50 px-4 py-2 text-blue-600 hover:bg-blue-100"
            >
                Create Business
            </Link>
        </>
    )

    return (
        <>
            <header className="sticky top-0 z-50 border-b border-border bg-white shadow-sm">
                <div className="mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:max-w-7xl">
                    <h1 className="text-lg font-semibold text-gray-900">
                        Trackei Dashboard
                    </h1>

                    <nav className="hidden md:flex items-center space-x-1">
                        {renderNavigationItems()}
                    </nav>

                    <div className="md:hidden">
                        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-9 w-9">
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-72">
                                <SheetHeader>
                                    <SheetTitle>Navigation</SheetTitle>
                                </SheetHeader>
                                <div className="mt-6 flex flex-col space-y-1">
                                    {renderNavigationItems()}
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </header>

            <main className="min-h-screen bg-gray-100 px-4 py-8 pt-24">
                {children}
            </main>
        </>
    )
}

