import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    username?: string;
    name: string;
    email: string;
    avatar?: string;
    role: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    business_id?: number;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Business {
    id: number;
    name: string;
    cnpj: string;
    address: string | null;
    phone: string | null;
    created_at: string;
    updated_at: string;
}

export interface Driver {
    id: number;
    user_id: number;
    business_id: number;
    name: string;
    cpf: string;
    vehicle: string;
    status: 'available' | 'on_delivery';
    user?: User;
    created_at: string;
    updated_at: string;
}

export interface Package {
    id: number;
    tracking_code: string;
    sender_name: string;
    recipient_name: string;
    delivery_address: string;
    status: 'pending' | 'in_transit' | 'delivered';
    business_id: number;
    client_id: number | null;
    assigned_driver_id: number | null;
    driver?: Driver;
    business?: Business;
    client?: User;
    created_at: string;
    updated_at: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    first_page_url: string;
    last_page_url: string;
    next_page_url: string | null;
    prev_page_url: string | null;
    path: string;
    from: number;
    to: number;
}
