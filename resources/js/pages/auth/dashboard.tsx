import { Head,router } from '@inertiajs/react'
import { useEffect } from 'react'
import {useSelector} from 'react-redux'

export default function Dashboard() {
    const user = useSelector((state)=>state.auth.user);
    useEffect(()=>{
        if(!user || user.role != 'admin'){
            router.visit('/')
        }
    },[user])


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

