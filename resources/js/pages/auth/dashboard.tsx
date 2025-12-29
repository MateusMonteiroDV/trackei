import { Head } from '@inertiajs/react'

export default function Dashboard() {
    return (
        <div className="p-6">
            <Head title="Dashboard" />

            <h1 className="text-2xl font-semibold mb-4">
                Dashboard
            </h1>

            <p className="text-muted-foreground">
                Welcome to your dashboard.
            </p>
        </div>
    )
}

