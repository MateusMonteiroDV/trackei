<?php
namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class NewPackageAvailable implements ShouldBroadcast
{
    use InteractsWithSockets;

    public $packageId;
    public $trackingCode;
    public $deliveryAddress;

    public function __construct($package)
    {
        $$this->packageId = $package->id;
        $this->trackingCode = $package->tracking_code;
        $this->deliveryAddress = $package->delivery_address;
        $this->businessId = $package->business_id;
    }

    public function broadcastOn()
    {
        return new Channel('drivers.available.' . $this->businessId);
    }
}
