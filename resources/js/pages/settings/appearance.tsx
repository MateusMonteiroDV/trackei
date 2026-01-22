import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

import AppearanceTabs from '@/components/appearance-tabs';
import HeadingSmall from '@/components/heading-small';
import LanguageSelector from '@/components/language-selector';
import { type BreadcrumbItem } from '@/types';

import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { edit as editAppearance } from '@/routes/appearance';

export default function Appearance() {
    const { t } = useTranslation();

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('settings.appearance.title'),
            href: editAppearance().url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('settings.appearance.title')} />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall
                        title={t('settings.appearance.title')}
                        description={t('settings.appearance.description')}
                    />

                    {/* Theme Selection */}
                    <div className="space-y-2">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {t('settings.appearance.theme')}
                        </h3>
                        <AppearanceTabs />
                    </div>

                    {/* Language Selection */}
                    <div className="space-y-2">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {t('settings.appearance.language')}
                        </h3>
                        <LanguageSelector />
                    </div>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
