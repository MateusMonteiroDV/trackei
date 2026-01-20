<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Business;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Driver;
use Illuminate\Support\Facades\DB;

class BusinessController extends Controller
{

    public function store(Request $req)
    {
        DB::beginTransaction();
        try {
            $data = $req->validate([
                'name' => 'required|string|max:255|unique:business,name',
                'cnpj' => 'required|string|unique:business,cnpj',
                'address' => 'nullable|string|max:500',
                'phone' => 'nullable|string|max:20',
            ]);

            $business = Business::create($data);

            $password = Str::random(12);


            $admin = User::create([
                'name' => 'admin_' . Str::random(6),
                'email' => 'admin_' . Str::random(10) . '@temp.local',
                'password' => Hash::make($password),
                'role' => 'admin',
                'business_id' => $business->id,
            ]);

            DB::commit();
            return response()->json([
                'instruction' => 'Use this initial admin user to create your own admin user',
                'message' => 'Business created successfully',
                'business' => $business,
                'admin_credentials' => [
                    'email' => $admin->email,
                    'password' => $password
                ]
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error creating business',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function createAdmin(Request $req)
    {
        try {
            if ($req->user()->role !== 'admin') {
                return response()->json([
                    'message' => 'Unauthorized'
                ], 403);
            }

            $data = $req->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:users,email',
                'password' => 'required|string|min:8'
            ]);

            DB::beginTransaction();
            $admin = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => Hash::make($data['password']),
                'role' => 'admin',
                'business_id' => $req->user()->business_id
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Admin created successfully',
                'admin' => $admin
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error creating admin',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
