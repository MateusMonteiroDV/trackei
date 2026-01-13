<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\Cookie;

class LoginController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string'
        ]);

        $user = User::where('email', $credentials['email'])->first();

        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        Auth::login($user);

        $token = $user->createToken('auth_token')->plainTextToken;

        $cookie = cookie('token', $token, 60 * 24); // 1 day in minutes

        return response()->json([
            'message' => 'Login successful'
        ], 200)->withCookie($cookie);
    }
}

