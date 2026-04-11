import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { type Package, type PaginatedResponse } from '@/types';
import { Link } from '@inertiajs/react';
import { Eye } from 'lucide-react';
import StatusBadge from '@/components/status-badge';

interface PackageListProps {
    packages: PaginatedResponse<Package>;
}

export default function PackageList({ packages }: PackageListProps) {
    return (
        <div className="space-y-4">
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Tracking Code</TableHead>
                            <TableHead>Recipient</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {packages.data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    No packages found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            packages.data.map((pkg) => (
                                <TableRow key={pkg.id}>
                                    <TableCell className="font-mono font-medium">
                                        {pkg.tracking_code}
                                    </TableCell>
                                    <TableCell>{pkg.recipient_name}</TableCell>
                                    <TableCell>
                                        <StatusBadge status={pkg.status} />
                                    </TableCell>
                                    <TableCell>
                                        {new Date(pkg.created_at).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" asChild>
                                            <Link href={`/packages/${pkg.tracking_code}`}>
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

            {/* Pagination controls could go here */}
            {packages.last_page > 1 && (
                <div className="flex items-center justify-end space-x-2 py-4">
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={!packages.prev_page_url}
                        asChild={!!packages.prev_page_url}
                    >
                        {packages.prev_page_url ? (
                            <Link href={packages.prev_page_url}>Previous</Link>
                        ) : (
                            <span>Previous</span>
                        )}
                    </Button>
                    <div className="text-sm text-gray-500">
                        Page {packages.current_page} of {packages.last_page}
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={!packages.next_page_url}
                        asChild={!!packages.next_page_url}
                    >
                        {packages.next_page_url ? (
                            <Link href={packages.next_page_url}>Next</Link>
                        ) : (
                            <span>Next</span>
                        )}
                    </Button>
                </div>
            )}
        </div>
    );
}
