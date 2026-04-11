import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Package, type PaginatedResponse } from '@/types';
import { Head, router } from '@inertiajs/react';
import PackageList from '@/components/package-list';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Plus, Search } from 'lucide-react';
import { useState } from 'react';

interface IndexProps {
    packages: PaginatedResponse<Package>;
    filters: {
        status?: string;
        search?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Packages',
        href: '/packages',
    },
];

export default function Index({ packages, filters }: IndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'all');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/packages', { search, status: status === 'all' ? '' : status }, { preserveState: true });
    };

    const handleStatusChange = (value: string) => {
        setStatus(value);
        router.get('/packages', { search, status: value === 'all' ? '' : value }, { preserveState: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Packages" />

            <div className="flex flex-col gap-6 p-4 md:p-8">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Packages</h1>
                        <p className="text-muted-foreground">
                            Manage and track all your packages.
                        </p>
                    </div>
                    <Button asChild>
                        <a href="/packages/create">
                            <Plus className="mr-2 h-4 w-4" />
                            New Package
                        </a>
                    </Button>
                </div>

                <div className="flex flex-col gap-4 md:flex-row md:items-center">
                    <form onSubmit={handleSearch} className="relative flex-1">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search by code, recipient or sender..."
                            className="pl-8"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </form>
                    <Select value={status} onValueChange={handleStatusChange}>
                        <SelectTrigger className="w-full md:w-[180px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="in_transit">In Transit</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <PackageList packages={packages} />
            </div>
        </AppLayout>
    );
}
