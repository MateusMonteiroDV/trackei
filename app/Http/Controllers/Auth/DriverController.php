<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Driver;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class DriverController extends Controller
{
    public function createDriver(Request $req)
    {
        if ($req->user()->role != 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $data = $req->validate([
            'username' => 'required|string|max:255|unique:users,name',
            'name' => 'required|string|max:255|unique:drivers,name',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6|confirmed',
            'role' => 'required|in:admin,client,driver',
            'vehicle' => 'required|string',
        ]);

        try {
            $driver = DB::transaction(function () use ($data) {
                $user = User::create([
                    'name' => $data['username'],
                    'email' => $data['email'],
                    'password' => Hash::make($data['password']),
                    'role' => $data['role']
                ]);

                return Driver::create([
                    'user_id' => $user->id,
                    'name' => $data['name'],
                    'vehicle' => $data['vehicle']
                ]);
            });

            return response()->json([
                'message' => 'Driver created successfully!',
                'driver' => $driver
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error creating driver',
                'error' => $e->getMessage()
            ], 400);
        }
    }
}

