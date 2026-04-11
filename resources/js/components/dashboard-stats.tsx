import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Truck, CheckCircle, Users } from 'lucide-react';

interface StatsProps {
    stats: {
        total_packages?: number;
        active_deliveries?: number;
        delivered_today?: number;
        active_drivers?: number;
        assigned_packages?: number;
        in_transit?: number;
        completed_deliveries?: number;
        my_packages?: number;
        delivered?: number;
    };
    role: string;
}

export default function DashboardStats({ stats, role }: StatsProps) {
    if (role === 'admin') {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-black">Total Packages</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-black">{stats.total_packages || 0}</div>
                        <p className="text-xs text-muted-foreground">Across the business</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-black">In Transit</CardTitle>
                        <Truck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-black">{stats.active_deliveries || 0}</div>
                        <p className="text-xs text-muted-foreground">Active deliveries</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-black">Delivered Today</CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-black">{stats.delivered_today || 0}</div>
                        <p className="text-xs text-muted-foreground">Successfully delivered</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-black">Active Drivers</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-black">{stats.active_drivers || 0}</div>
                        <p className="text-xs text-muted-foreground">Available for tasks</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (role === 'driver') {
        return (
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-black">Assigned</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-black">{stats.assigned_packages || 0}</div>
                        <p className="text-xs text-muted-foreground">Waiting to be accepted</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-black">In Transit</CardTitle>
                        <Truck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-black">{stats.in_transit || 0}</div>
                        <p className="text-xs text-muted-foreground">On your route</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-black">Completed</CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-black">{stats.completed_deliveries || 0}</div>
                        <p className="text-xs text-muted-foreground">Total successful deliveries</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Client
    return (
        <div className="grid gap-4 md:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-black">My Packages</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-black">{stats.my_packages || 0}</div>
                    <p className="text-xs text-muted-foreground">Total orders</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-black">In Transit</CardTitle>
                    <Truck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-black">{stats.in_transit || 0}</div>
                    <p className="text-xs text-muted-foreground">On the way to you</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-black">Delivered</CardTitle>
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-black">{stats.delivered || 0}</div>
                    <p className="text-xs text-muted-foreground">Successfully received</p>
                </CardContent>
            </Card>
        </div>
    );
}
