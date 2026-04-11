<?php

namespace App\Listeners;

use App\Events\DriverAssigned;
use App\Models\User;
use App\Notifications\PackageStatusChanged;

class SendDriverAssignedNotification
{
    public function handle(DriverAssigned $event): void
    {
        $package = $event->package;

        // Notify driver
        if ($package->assigned_driver_id) {
            $driver = \App\Models\Driver::find($package->assigned_driver_id);
            if ($driver && $driver->user_id) {
                $user = User::find($driver->user_id);
                if ($user) {
                    $user->notify(new PackageStatusChanged(
                        'New Package Assigned',
                        "A new package #{$package->tracking_code} has been assigned to you.",
                        ['package_id' => $package->id, 'tracking_code' => $package->tracking_code]
                    ));
                }
            }
        }

        // Notify client
        if ($package->client_id) {
            $client = User::find($package->client_id);
            if ($client) {
                $client->notify(new PackageStatusChanged(
                    'Driver Assigned',
                    "A driver has been assigned to your package #{$package->tracking_code}.",
                    ['package_id' => $package->id, 'tracking_code' => $package->tracking_code]
                ));
            }
        }
    }
}
