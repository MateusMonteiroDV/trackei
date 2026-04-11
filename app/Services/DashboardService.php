<?php

namespace App\Services;

use App\Models\Business;
use App\Models\Driver;
use App\Models\Package;
use App\Models\User;

class DashboardService
{
    public function getStats(User $user): array
    {
        if ($user->role === 'admin') {
            return $this->getAdminStats($user);
        } elseif ($user->role === 'driver') {
            return $this->getDriverStats($user);
        } else {
            return $this->getClientStats($user);
        }
    }

    private function getAdminStats(User $user): array
    {
        $businessId = $user->business_id;

        return [
            'total_packages' => Package::where('business_id', $businessId)->count(),
            'active_deliveries' => Package::where('business_id', $businessId)->where('status', 'in_transit')->count(),
            'delivered_today' => Package::where('business_id', $businessId)
                ->where('status', 'delivered')
                ->whereDate('updated_at', now()->today())
                ->count(),
            'active_drivers' => Driver::where('business_id', $businessId)->where('status', 'available')->count(),
            'recent_packages' => Package::with(['driver.user:id,name'])
                ->where('business_id', $businessId)
                ->latest()
                ->take(5)
                ->get(),
        ];
    }

    private function getDriverStats(User $user): array
    {
        $driver = Driver::where('user_id', $user->id)->first();

        if (! $driver) {
            return [];
        }

        return [
            'assigned_packages' => Package::where('assigned_driver_id', $driver->id)->where('status', 'pending')->count(),
            'in_transit' => Package::where('assigned_driver_id', $driver->id)->where('status', 'in_transit')->count(),
            'completed_deliveries' => Package::where('assigned_driver_id', $driver->id)->where('status', 'delivered')->count(),
            'current_packages' => Package::with(['business:id,name'])
                ->where('assigned_driver_id', $driver->id)
                ->whereIn('status', ['in_transit'])
                ->latest()
                ->get(),
        ];
    }

    private function getClientStats(User $user): array
    {
        return [
            'my_packages' => Package::where('client_id', $user->id)->count(),
            'in_transit' => Package::where('client_id', $user->id)->where('status', 'in_transit')->count(),
            'delivered' => Package::where('client_id', $user->id)->where('status', 'delivered')->count(),
            'recent_activity' => Package::with(['driver.user:id,name', 'business:id,name'])
                ->where('client_id', $user->id)
                ->latest()
                ->take(5)
                ->get(),
        ];
    }
}
