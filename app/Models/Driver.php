<?php


namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Driver extends Model
{
    protected $fillable = ['name', 'vehicle', 'status'];

    public function packages()
    {
        return $this->hasMany(Package::class, 'assigned_driver_id');
    }
}

