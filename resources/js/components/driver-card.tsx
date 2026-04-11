import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type Driver } from '@/types';
import StatusBadge from '@/components/status-badge';
import { User, Truck, CreditCard, Mail } from 'lucide-react';

interface DriverCardProps {
    driver: Driver;
}

export default function DriverCard({ driver }: DriverCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-black">Driver Profile</CardTitle>
                <StatusBadge status={driver.status} />
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                        <User className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-black">{driver.name}</p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            {driver.user?.email}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                            <CreditCard className="h-3 w-3" /> CPF
                        </p>
                        <p className="text-xs text-black">{driver.cpf}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                            <Truck className="h-3 w-3" /> Vehicle
                        </p>
                        <p className="text-xs text-black">{driver.vehicle}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
