import AppLogoIcon from '@/components/app-logo-icon';
import TextLink from '@/components/text-link';
import { home } from '@/routes';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

export default function AuthSimpleLayout({
    children,
    title,
    description,
    showLogo = true,
    footerLink,
}: PropsWithChildren<{
    title?: string;
    description?: string;
    showLogo?: boolean;
    footerLink?: {
        text: string;
        href: string;
        label: string;
    };
}>) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-8">
            <div className="w-full max-w-md">
                {showLogo && (
                    <div className="mb-6 flex justify-center">
                        <Link
                            href={home()}
                            className="flex items-center gap-2 font-medium"
                        >
                            <div className="flex h-9 w-9 items-center justify-center">
                                <AppLogoIcon className="size-9 fill-current text-black dark:text-white" />
                            </div>
                        </Link>
                    </div>
                )}

                <div className="rounded-xl bg-white p-6 shadow-lg sm:p-8">
                    {(title || description) && (
                        <div className="mb-5 text-center sm:mb-6">
                            {title && (
                                <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">
                                    {title}
                                </h1>
                            )}
                            {description && (
                                <p className="mt-1 text-sm text-gray-600">
                                    {description}
                                </p>
                            )}
                        </div>
                    )}

                    {children}

                    {footerLink && (
                        <p className="mt-5 text-center text-sm text-gray-500 sm:mt-6">
                            {footerLink.text}{' '}
                            <TextLink href={footerLink.href}>
                                {footerLink.label}
                            </TextLink>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
