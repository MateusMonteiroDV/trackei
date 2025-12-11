<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class DriverLocationUpdated implements ShouldBroadcast
{
    use InteractsWithSockets;

    public $driverId;
    public $lat;
    public $lng;

    public function __construct($driverId, $lat, $lng)
    {
        $this->driverId = $driverId;
        $this->lat = $lat;
        $this->lng = $lng;
    }

    public function broadcastOn()
    {
        return new Channel('driver.' . $this->driverId);
    }
}

