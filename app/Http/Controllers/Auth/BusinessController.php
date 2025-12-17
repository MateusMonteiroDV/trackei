<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Business;
use Illuminate\Database\QueryException;

class BusinessController extends Controller
{
    public function store(Request $req)
    {
        try {
            $data = $req->validate([
                'name' => 'required|string|max:255|unique:business,name',
                'cnpj' => 'required|string|unique:business,cnpj',
                'address' => 'nullable|string|max:500',
                'phone' => 'nullable|string|max:20',
            ]);

            if(Business::where('cnpj',$data['cnpj'])){
                return response()->json([
                    'message' => 'Business already exists',
                ], 400);

            }

            $business = Business::create($data);

            $password = Str::random(12);

            $admin = User::create([
                'name' => 'admin_' . Str::random(6),
                'email' => 'admin_' . Str::random(10) . '@temp.local',
                'password' => Hash::make($password),
            ]);

            $admin->role = 'admin';
            $admin->business_id = $business->id;
            $admin->save();

            return response()->json([
                'instruction'=>'Use this initial admin user to create your own admin user',
                'message' => 'Business created successfully',
                'business' => $business,
                'admin_credentials' => [
                    'email' => $admin->email,
                    'password' => $password
                ]
            ], 201);

        } catch (QueryException $e) {
            return response()->json([
                'message' => 'Error creating business',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}

