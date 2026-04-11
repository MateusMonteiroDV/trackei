import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type Package } from '@/types';
import { Link } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { ChevronRight } from 'lucide-react';

interface RecentPackagesProps {
    packages: Package[];
    title: string;
}

export default function RecentPackages({ packages, title }: RecentPackagesProps) {
    const getStatusBadge = (status: Package['status']) => {
        switch (status) {
            case 'pending':
                return <Badge variant="outline" className="border-yellow-500 text-yellow-600">Pending</Badge>;
            case 'in_transit':
                return <Badge variant="outline" className="border-blue-500 text-blue-600">In Transit</Badge>;
            case 'delivered':
                return <Badge variant="outline" className="border-green-500 text-green-600">Delivered</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-black">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {packages.length === 0 ? (
                        <p className="text-sm text-muted-foreground italic py-4">No recent activity.</p>
                    ) : (
                        packages.map((pkg) => (
                            <div key={pkg.id} className="flex items-center justify-between group">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-black font-mono">{pkg.tracking_code}</p>
                                    <div className="flex items-center gap-2">
                                        <p className="text-xs text-muted-foreground">{pkg.recipient_name}</p>
                                        {getStatusBadge(pkg.status)}
                                    </div>
                                </div>
                                <Link
                                    href={`/packages/${pkg.tracking_code}`}
                                    className="p-2 rounded-full hover:bg-muted transition-colors"
                                >
                                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-black" />
                                </Link>
                            </div>
                        ))
                    )}
                </div>
                {packages.length > 0 && (
                    <div className="mt-6 pt-4 border-t text-center">
                        <Link href="/packages" className="text-sm font-medium text-primary hover:underline">
                            View all packages
                        </Link>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
