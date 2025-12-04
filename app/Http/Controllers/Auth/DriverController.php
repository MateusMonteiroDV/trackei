<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Driver;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class DriverController extends Controller
{
    public function createDriver(Request $req)
    {
        if ($req->user()->role != 'admin') {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        }


        $data = $req->validate([
            'username' => 'required|string|max:255|unique:users,name',
            'name' => 'required|string|max:255|unique:drivers,name',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6|confirmed',
            'role' => 'required|in:admin,client,driver',
            'vehicle' => 'required|string',
        ]);

        $user = User::create([
            'name' => $data['username'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'role' => $data['role']
        ]);

        $driver = Driver::create([
            'name' => $data['name'],
            'user_id' => $user->id,
            'vehicle' => $data['vehicle']
        ]);

        return response()->json([
            'user' => $user,
            'driver' => $driver
        ], 201);
    }
}

