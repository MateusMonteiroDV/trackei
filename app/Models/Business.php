<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Business extends Model
{
    use HasFactory;

    protected $table = 'business';

    protected $fillable = [
        'id',
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
}

