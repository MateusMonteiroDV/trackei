<?php

namespace App\Services;

use App\Events\DriverAssigned;
use App\Events\PackageDelivered;
use App\Events\PackageStatusUpdated;
use App\Models\Business;
use App\Models\Driver;
use App\Models\Package;
use Illuminate\Support\Str;

class PackageService
{
    public function create(array $data): Package
    {
        $business = Business::findOrFail($data['business_id']);

        return Package::create([
            'tracking_code' => $this->generateTrackingCode(),
            'sender_name' => $data['sender_name'],
            'recipient_name' => $data['recipient_name'],
            'delivery_address' => $data['delivery_address'],
            'status' => 'pending',
            'business_id' => $business->id,
            'client_id' => $data['client_id'] ?? null,
        ]);
    }

    public function findByTrackingCode(string $trackingCode): ?Package
    {
        return Package::with(['driver.user:id,name', 'business:id,name', 'client:id,name,email'])
            ->where('tracking_code', $trackingCode)
            ->first();
    }

    public function findById(int $id): ?Package
    {
        return Package::with(['driver.user:id,name', 'business:id,name', 'client:id,name,email'])
            ->find($id);
    }

    public function updateStatus(Package $package, string $status): Package
    {
        $validTransitions = [
            'pending' => ['in_transit'],
            'in_transit' => ['delivered'],
            'delivered' => [],
        ];

        $allowed = $validTransitions[$package->status] ?? [];

        if (! in_array($status, $allowed)) {
            throw new \InvalidArgumentException(
                "Cannot transition from '{$package->status}' to '{$status}'"
            );
        }

        $package->update(['status' => $status]);

        if ($status === 'delivered') {
            event(new PackageDelivered($package));
        } else {
            event(new PackageStatusUpdated($package));
        }

        return $package->fresh();
    }

    public function assignDriver(Package $package, Driver $driver): Package
    {
        if ($package->assigned_driver_id !== null) {
            throw new \InvalidArgumentException('Package already has a driver assigned');
        }

        $package->update([
            'assigned_driver_id' => $driver->id,
            'status' => 'in_transit',
        ]);

        event(new DriverAssigned($package));

        return $package->fresh();
    }

    public function listByBusiness(Business $business, array $filters = [], int $perPage = 15)
    {
        $query = Package::with(['driver.user:id,name', 'client:id,name,email'])
            ->where('business_id', $business->id)
            ->latest();

        if (isset($filters['status']) && $filters['status'] !== '') {
            $query->where('status', $filters['status']);
        }

        if (isset($filters['driver_id']) && $filters['driver_id'] !== '') {
            $query->where('assigned_driver_id', $filters['driver_id']);
        }

        if (isset($filters['search']) && $filters['search'] !== '') {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('tracking_code', 'like', "%{$search}%")
                    ->orWhere('recipient_name', 'like', "%{$search}%")
                    ->orWhere('sender_name', 'like', "%{$search}%");
            });
        }

        return $query->paginate($perPage);
    }

    public function listByClient(int $clientId, int $perPage = 15)
    {
        return Package::with(['driver.user:id,name', 'business:id,name'])
            ->where('client_id', $clientId)
            ->latest()
            ->paginate($perPage);
    }

    public function listByDriver(Driver $driver, int $perPage = 15)
    {
        return Package::with(['business:id,name', 'client:id,name,email'])
            ->where('assigned_driver_id', $driver->id)
            ->latest()
            ->paginate($perPage);
    }

    public function destroy(Package $package): bool
    {
        return $package->delete();
    }

    private function generateTrackingCode(): string
    {
        do {
            $code = 'TRK'.strtoupper(Str::random(8));
        } while (Package::where('tracking_code', $code)->exists());

        return $code;
    }
}
