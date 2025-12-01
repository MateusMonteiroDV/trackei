<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class LoginController extends Controller{
    public function login(Request $request){
        $data = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string'
        ]);

        $user = User::where('email', $data['email'])->first();

        if(!$user || !Hash::check($data['password'],$user->password)){
            return response()->json([
                'message' => 'Invalid credentials'
            ], 401);
        }
        $token = $user->createToken('api_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token
        ]);

    }
}
