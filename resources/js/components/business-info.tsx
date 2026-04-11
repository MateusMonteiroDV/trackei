import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type Business } from '@/types';
import { Building, MapPin, Phone, CreditCard } from 'lucide-react';

interface BusinessInfoProps {
    business: Business;
}

export default function BusinessInfo({ business }: BusinessInfoProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-black flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    Company Information
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
                <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                        <Building className="h-3 w-3" /> Name
                    </p>
                    <p className="text-sm font-bold text-black">{business.name}</p>
                </div>

                <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                        <CreditCard className="h-3 w-3" /> CNPJ
                    </p>
                    <p className="text-sm text-black">{business.cnpj}</p>
                </div>

                <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> Address
                    </p>
                    <p className="text-sm text-black">{business.address || 'Not specified'}</p>
                </div>

                <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                        <Phone className="h-3 w-3" /> Phone
                    </p>
                    <p className="text-sm text-black">{business.phone || 'Not specified'}</p>
                </div>
            </CardContent>
        </Card>
    );
}
