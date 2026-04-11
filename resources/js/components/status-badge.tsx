import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { CheckCircle, Truck, Clock, AlertCircle } from 'lucide-react';

interface StatusBadgeProps {
    status: string;
    className?: string;
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
    switch (status) {
        case 'pending':
            return (
                <Badge variant="outline" className={cn("flex w-fit items-center gap-1 border-yellow-500 text-yellow-600", className)}>
                    <Clock className="h-3 w-3" />
                    Pending
                </Badge>
            );
        case 'in_transit':
            return (
                <Badge variant="outline" className={cn("flex w-fit items-center gap-1 border-blue-500 text-blue-600", className)}>
                    <Truck className="h-3 w-3" />
                    In Transit
                </Badge>
            );
        case 'delivered':
            return (
                <Badge variant="outline" className={cn("flex w-fit items-center gap-1 border-green-500 text-green-600", className)}>
                    <CheckCircle className="h-3 w-3" />
                    Delivered
                </Badge>
            );
        case 'available':
            return (
                <Badge variant="outline" className={cn("flex w-fit items-center gap-1 border-emerald-500 text-emerald-600", className)}>
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    Available
                </Badge>
            );
        case 'on_delivery':
            return (
                <Badge variant="outline" className={cn("flex w-fit items-center gap-1 border-orange-500 text-orange-600", className)}>
                    <Truck className="h-3 w-3" />
                    On Delivery
                </Badge>
            );
        default:
            return (
                <Badge variant="secondary" className={cn("flex w-fit items-center gap-1", className)}>
                    <AlertCircle className="h-3 w-3" />
                    {status}
                </Badge>
            );
    }
}
