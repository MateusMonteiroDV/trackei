import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, Box, Building2, Car, Folder, LayoutGrid, Plus, PlusCircle, Users } from 'lucide-react';
import AppLogo from './app-logo';

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

function getNavItemsByRole(role: string | undefined): NavItem[] {
    const baseItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: dashboard(),
            icon: LayoutGrid,
        },
    ];

    switch (role) {
        case 'admin':
            return [
                ...baseItems,
                {
                    title: 'Create Package',
                    href: '/packages/create',
                    icon: Plus,
                },
                {
                    title: 'Packages',
                    href: '/packages',
                    icon: Box,
                },
                {
                    title: 'Drivers',
                    href: '/drivers',
                    icon: Car,
                },
                {
                    title: 'Business',
                    href: '/business',
                    icon: Building2,
                },
                {
                    title: 'Admins',
                    href: '/business/admins',
                    icon: Users,
                },
            ];
        case 'driver':
            return [
                ...baseItems,
                {
                    title: 'Packages',
                    href: '/packages',
                    icon: Box,
                },
            ];
        case 'client':
            return [
                ...baseItems,
                {
                    title: 'Create Business',
                    href: '/create-business',
                    icon: PlusCircle,
                },
                {
                    title: 'My Packages',
                    href: '/packages',
                    icon: Box,
                },
            ];
        default:
            return baseItems;
    }
}

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    const mainNavItems = getNavItemsByRole(auth.user.role);

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard().url} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}