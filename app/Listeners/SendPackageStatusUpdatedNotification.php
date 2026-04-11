<?php

namespace App\Listeners;

use App\Events\PackageStatusUpdated;
use App\Models\User;
use App\Notifications\PackageStatusChanged;

class SendPackageStatusUpdatedNotification
{
    public function handle(PackageStatusUpdated $event): void
    {
        $package = $event->package;

        // Notify client
        if ($package->client_id) {
            $client = User::find($package->client_id);
            if ($client) {
                $status = str_replace('_', ' ', ucfirst($package->status));
                $client->notify(new PackageStatusChanged(
                    'Package Status Updated',
                    "Your package #{$package->tracking_code} is now: {$status}.",
                    ['package_id' => $package->id, 'tracking_code' => $package->tracking_code]
                ));
            }
        }
    }
}
