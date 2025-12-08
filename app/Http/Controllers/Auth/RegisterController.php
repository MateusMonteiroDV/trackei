<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Business;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\QueryException;

class RegisterController extends Controller
{
    public function register(Request $request)
    {
        try {
            $data = $request->validate([
                'name' => 'required|string|max:255|unique:users,name',
                'email' => 'required|email|unique:users,email',
                'password' => 'required|string|min:6|confirmed',
                'role' => 'required|in:admin,client,driver',
                'cnpj' => 'nullable|string'
            ]);

            $business = null;

            if ($data['role'] === 'admin') {
                if (empty($data['cnpj'])) {
                    return response()->json([
                        'message' => 'Cannot register admin: CNPJ is required'
                    ], 400);
                }

                $business = Business::where('cnpj', $data['cnpj'])->first();

                if (!$business) {
                    return response()->json([
                        'message' => 'Cannot register admin: company with this CNPJ does not exist'
                    ], 400);
                }
            }

            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => Hash::make($data['password']),
                'role' => $data['role'],
                'business_id' => $data['role'] === 'admin' ? $business->id : null
            ]);

            $token = $user->createToken('api_token')->plainTextToken;

            return response()->json([
                'user' => $user,
                'token' => $token
            ]);
        } catch (QueryException $e) {
            return response()->json([
                'message' => 'Error registering user',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}

