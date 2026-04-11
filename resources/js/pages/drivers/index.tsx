import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Driver, type PaginatedResponse } from '@/types';
import { Head, router, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Plus, Search, Eye } from 'lucide-react';
import { useState } from 'react';
import StatusBadge from '@/components/status-badge';

interface IndexProps {
    drivers: PaginatedResponse<Driver>;
    filters: {
        status?: string;
        search?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Drivers',
        href: '/drivers',
    },
];

export default function Index({ drivers, filters }: IndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'all');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/drivers', { search, status: status === 'all' ? '' : status }, { preserveState: true });
    };

    const handleStatusChange = (value: string) => {
        setStatus(value);
        router.get('/drivers', { search, status: value === 'all' ? '' : value }, { preserveState: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Drivers" />

            <div className="flex flex-col gap-6 p-4 md:p-8">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-black">Drivers</h1>
                        <p className="text-muted-foreground">
                            Manage your fleet and monitor driver availability.
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/drivers/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Driver
                        </Link>
                    </Button>
                </div>

                <div className="flex flex-col gap-4 md:flex-row md:items-center">
                    <form onSubmit={handleSearch} className="relative flex-1">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search by name or CPF..."
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
                            <SelectItem value="available">Available</SelectItem>
                            <SelectItem value="on_delivery">On Delivery</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>CPF</TableHead>
                                <TableHead>Vehicle</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {drivers.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">
                                        No drivers found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                drivers.data.map((driver) => (
                                    <TableRow key={driver.id}>
                                        <TableCell className="font-medium text-black">
                                            {driver.name}
                                        </TableCell>
                                        <TableCell>{driver.cpf}</TableCell>
                                        <TableCell>{driver.vehicle}</TableCell>
                                        <TableCell>
                                            <StatusBadge status={driver.status} />
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" asChild>
                                                <Link href={`/drivers/${driver.id}`}>
                                                    <Eye className="h-4 w-4" />
                                                    <span className="sr-only">View</span>
                                                </Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {drivers.last_page > 1 && (
                    <div className="flex items-center justify-end space-x-2 py-4">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={!drivers.prev_page_url}
                            asChild={!!drivers.prev_page_url}
                        >
                            {drivers.prev_page_url ? (
                                <Link href={drivers.prev_page_url}>Previous</Link>
                            ) : (
                                <span>Previous</span>
                            )}
                        </Button>
                        <div className="text-sm text-gray-500">
                            Page {drivers.current_page} of {drivers.last_page}
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={!drivers.next_page_url}
                            asChild={!!drivers.next_page_url}
                        >
                            {drivers.next_page_url ? (
                                <Link href={drivers.next_page_url}>Next</Link>
                            ) : (
                                <span>Next</span>
                            )}
                        </Button>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
