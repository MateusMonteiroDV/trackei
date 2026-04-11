<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @mixin IdeHelperBusiness
 */
class Business extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'cnpj',
        'address',
        'phone',
    ];

    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function drivers()
    {
        return $this->hasMany(Driver::class);
    }

    public function packages()
    {
        return $this->hasMany(Package::class);
    }
}
