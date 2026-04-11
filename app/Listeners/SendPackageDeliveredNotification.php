<?php

namespace App\Listeners;

use App\Events\PackageDelivered;
use App\Models\User;
use App\Notifications\PackageStatusChanged;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class SendPackageDeliveredNotification
{
    public function handle(PackageDelivered $event): void
    {
        $package = $event->package;

        // Notify client
        if ($package->client_id) {
            $client = User::find($package->client_id);
            if ($client) {
                $client->notify(new PackageStatusChanged(
                    'Package Delivered',
                    "Your package #{$package->tracking_code} has been delivered successfully.",
                    ['package_id' => $package->id, 'tracking_code' => $package->tracking_code]
                ));
            }
        }

        // Notify business admins
        $admins = User::where('business_id', $package->business_id)->where('role', 'admin')->get();
        foreach ($admins as $admin) {
            $admin->notify(new PackageStatusChanged(
                'Delivery Confirmed',
                "Package #{$package->tracking_code} was delivered to {$package->recipient_name}.",
                ['package_id' => $package->id, 'tracking_code' => $package->tracking_code]
            ));
        }
    }
}
