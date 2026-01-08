<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Cookie;

class LoginController extends Controller
{
    public function login(Request $request)
    {
        $data = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string'
        ]);

        $user = User::where('email', $data['email'])->first();

        if (!$user || !Hash::check($data['password'], $user->password)) {
            return response()->json([
                'message' => 'Invalid credentials'
            ], 401);
        }

        $token = $user->createToken('api_token')->plainTextToken;

        $cookie = cookie('token', $token, 60 * 24, '/', null, true, true, false, 'Strict');

        return response()->json([
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
               'role' => $user->role
            ],
            'message' => 'Logged in successfully'
        ])->withCookie($cookie);
    }
}

