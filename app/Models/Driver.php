<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @mixin IdeHelperDriver
 */
class Driver extends Model
{
    const STATUS_AVAILABLE = 'available';

    const STATUS_ON_DELIVERY = 'on_delivery';

    protected $fillable = [
        'name',
        'cpf',
        'vehicle',
        'status',
        'user_id',
        'business_id',
    ];

    public function packages(): HasMany
    {
        return $this->hasMany(Package::class, 'assigned_driver_id');
    }

    public function locations(): HasMany
    {
        return $this->hasMany(DriverLocation::class);
    }

    public function latestLocation(): HasOne
    {
        return $this->hasOne(DriverLocation::class)->latestOfMany();
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function business(): BelongsTo
    {
        return $this->belongsTo(Business::class);
    }

    public function scopeAvailable($query)
    {
        return $query->where('status', self::STATUS_AVAILABLE);
    }

    public function scopeOnDelivery($query)
    {
        return $query->where('status', self::STATUS_ON_DELIVERY);
    }
}
