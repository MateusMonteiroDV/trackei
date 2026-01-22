import { cn } from '@/lib/utils';
import { HTMLAttributes } from 'react';
import { useTranslation } from 'react-i18next';

interface LanguageOption {
    code: string;
    name: string;
    flag: string;
}

const languages: LanguageOption[] = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'pt', name: 'Português', flag: '🇧🇷' },
];

export default function LanguageSelector({
    className = '',
    ...props
}: HTMLAttributes<HTMLDivElement>) {
    const { i18n } = useTranslation();

    const handleLanguageChange = (languageCode: string) => {
        i18n.changeLanguage(languageCode);
    };

    return (
        <div
            className={cn(
                'inline-flex gap-1 rounded-lg bg-neutral-100 p-1 dark:bg-neutral-800',
                className,
            )}
            {...props}
        >
            {languages.map(({ code, name, flag }) => (
                <button
                    key={code}
                    onClick={() => handleLanguageChange(code)}
                    className={cn(
                        'flex items-center rounded-md px-3.5 py-1.5 transition-colors',
                        i18n.language === code
                            ? 'bg-white shadow-xs dark:bg-neutral-700 dark:text-neutral-100'
                            : 'text-neutral-500 hover:bg-neutral-200/60 hover:text-black dark:text-neutral-400 dark:hover:bg-neutral-700/60',
                    )}
                >
                    <span className="mr-1.5 text-sm">{flag}</span>
                    <span className="text-sm">{name}</span>
                </button>
            ))}
        </div>
    );
}
