<?php


namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @mixin IdeHelperPackage
 */
class Package extends Model
{
    protected $fillable = [
        'sender_name',
        'recipient_name',
        'delivery_address',
        'status',
    ];

    public function driver()
    {
        return $this->belongsTo(Driver::class, 'assigned_driver_id');
    }
}

