<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

// NewPackageAvailable - broadcasts to drivers of a specific business
// Currently public; convert to private when driver auth is required
Broadcast::channel('drivers.available.{businessId}', function ($user, $businessId) {
    return (int) $user->business_id === (int) $businessId;
});

// DriverLocationUpdated - broadcasts driver location to clients/admins
// Currently public; convert to private when access control is required
Broadcast::channel('driver.{driverId}', function ($user, $driverId) {
    return $user->business_id === \App\Models\Driver::find($driverId)?->business_id;
});

Broadcast::channel('businesses.{businessId}', function ($user, $businessId) {
    return (int) $user->business_id === (int) $businessId && $user->role === 'admin';
});
