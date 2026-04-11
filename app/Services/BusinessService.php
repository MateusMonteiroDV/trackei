<?php

namespace App\Services;

use App\Models\Business;
use App\Models\Driver;
use App\Models\Package;

class BusinessService
{
    public function findById(int $id): ?Business
    {
        return Business::find($id);
    }

    public function update(Business $business, array $data): Business
    {
        $business->update($data);

        return $business->fresh();
    }

    public function getStats(Business $business): array
    {
        return [
            'total_packages' => Package::where('business_id', $business->id)->count(),
            'total_drivers' => Driver::where('business_id', $business->id)->count(),
            'delivered_packages' => Package::where('business_id', $business->id)->where('status', 'delivered')->count(),
            'active_deliveries' => Package::where('business_id', $business->id)->where('status', 'in_transit')->count(),
        ];
    }
}
