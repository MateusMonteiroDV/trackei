<?php


namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Package extends Model
{
    protected $fillable = [
        'id',
        'tracking_code',
        'sender_name',
        'recipient_name',
        'delivery_address',
        'status',
        'business_id',
        'assigned_driver_id'
    ];

    public function driver()
    {
        return $this->belongsTo(Driver::class, 'assigned_driver_id');
    }
}

