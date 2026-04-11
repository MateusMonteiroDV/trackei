import { type Package } from '@/types';
import { CheckCircle, Truck, Package as PackageIcon, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TrackingTimelineProps {
    package: Package;
}

export default function TrackingTimeline({ package: pkg }: TrackingTimelineProps) {
    const steps = [
        {
            id: 'pending',
            label: 'Order Placed',
            description: 'The package has been registered in our system.',
            icon: PackageIcon,
            isCompleted: true, // Always true if it exists
        },
        {
            id: 'in_transit',
            label: 'In Transit',
            description: 'The package is on its way to the destination.',
            icon: Truck,
            isCompleted: pkg.status === 'in_transit' || pkg.status === 'delivered',
        },
        {
            id: 'delivered',
            label: 'Delivered',
            description: 'The package has been successfully delivered.',
            icon: CheckCircle,
            isCompleted: pkg.status === 'delivered',
        },
    ];

    return (
        <div className="relative space-y-8">
            {steps.map((step, index) => (
                <div key={step.id} className="relative flex gap-x-4">
                    {index !== steps.length - 1 && (
                        <div
                            className={cn(
                                "absolute left-4 top-8 -ml-px h-full w-0.5",
                                step.isCompleted && steps[index + 1].isCompleted
                                    ? "bg-primary"
                                    : "bg-muted"
                            )}
                        />
                    )}
                    <div className="relative flex h-8 w-8 items-center justify-center">
                        <div
                            className={cn(
                                "flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors",
                                step.isCompleted
                                    ? "border-primary bg-primary text-primary-foreground"
                                    : "border-muted bg-background text-muted-foreground"
                            )}
                        >
                            <step.icon className="h-4 w-4" />
                        </div>
                    </div>
                    <div className="flex flex-col py-0.5">
                        <h4 className={cn("text-sm font-semibold", step.isCompleted ? "text-foreground" : "text-muted-foreground")}>
                            {step.label}
                        </h4>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {step.description}
                        </p>
                        {step.id === pkg.status && (
                            <div className="mt-2 flex items-center gap-2 text-xs font-medium text-primary">
                                <Clock className="h-3 w-3" />
                                Current Status
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
