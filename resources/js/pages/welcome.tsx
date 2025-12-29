import { login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head,Link, usePage } from '@inertiajs/react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
        <Head title="Welcome" />
        <div className="flex min-h-screen flex-col items-center bg-[#FDFDFC] p-6 text-[#1b1b18] dark:bg-[#0a0a0a]">
            <header className="mb-6 w-full max-w-[335px] text-sm lg:max-w-4xl">
            <nav className="flex items-center justify-center gap-4">
                {auth.user ? (
                <Link
                    href="/"
                    className="inline-block px-5 py-1.5 text-sm text-[#1b1b18] dark:text-[#EDEDEC]"
                >
                    Dashboard
                </Link>
                ) : (
                <>
                    <Link
                    href={login().url}
                    className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                    >
                    Log in
                    </Link>
                    <Link
                        href={register().url}
                        className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                    >
                     Register
                    </Link>
                    )}
                </>
                )}
            </nav>
            </header>
        </div>
        </>
    );
}

