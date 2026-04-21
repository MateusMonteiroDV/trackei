<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateBusinessRequest;
use App\Models\Business;
use App\Models\User;
use App\Services\BusinessService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class BusinessController extends Controller
{
    public function __construct(
        protected BusinessService $businessService
    ) {}

    public function store(Request $req)
    {
        DB::beginTransaction();
        try {
            $data = $req->validate([
                'name' => 'required|string|max:255|unique:businesses,name',
                'cnpj' => 'required|string|unique:businesses,cnpj',
                'address' => 'nullable|string|max:500',
                'phone' => 'nullable|string|max:20',
            ]);

            $business = Business::create($data);

            $password = Str::random(12);

            $admin = User::create([
                'name' => 'admin_'.Str::random(6),
                'email' => 'admin_'.Str::random(10).'@temp.local',
                'password' => Hash::make($password),
                'role' => 'admin',
                'business_id' => $business->id,
            ]);

            $token = $admin->createToken('api-token')->plainTextToken;

            DB::commit();

            return response()->json([
                'instruction' => 'Use this initial admin user to create your own admin user',
                'message' => 'Business created successfully',
                'token' => $token,
                'user' => [
                    'id' => $admin->id,
                    'name' => $admin->name,
                    'email' => $admin->email,
                    'role' => $admin->role,
                    'business_id' => $admin->business_id,
                ],
                'business' => $business,
                'admin_credentials' => [
                    'email' => $admin->email,
                    'password' => $password,
                ],
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Error creating business',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function show(Request $req, int $id)
    {
        $business = $this->businessService->findById($id);

        if (! $business) {
            return response()->json(['message' => 'Business not found'], 404);
        }

        // Only allow admins to see their own business
        if ($req->user()->role === 'admin' && $req->user()->business_id !== $business->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($business);
    }

    public function update(UpdateBusinessRequest $req, int $id)
    {
        $business = $this->businessService->findById($id);

        if (! $business) {
            return response()->json(['message' => 'Business not found'], 404);
        }

        if ($req->user()->business_id !== $business->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $business = $this->businessService->update($business, $req->validated());

        return response()->json([
            'message' => 'Business updated successfully',
            'business' => $business,
        ]);
    }

    public function getStats(Request $req, int $id)
    {
        $business = $this->businessService->findById($id);

        if (! $business) {
            return response()->json(['message' => 'Business not found'], 404);
        }

        if ($req->user()->business_id !== $business->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $stats = $this->businessService->getStats($business);

        return response()->json($stats);
    }

    public function createAdmin(Request $req)
    {
        try {
            if ($req->user()->role !== 'admin') {
                return response()->json([
                    'message' => 'Unauthorized',
                ], 403);
            }

            $data = $req->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:users,email',
                'password' => 'required|string|min:8',
            ]);

            DB::beginTransaction();
            $admin = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => Hash::make($data['password']),
                'role' => 'admin',
                'business_id' => $req->user()->business_id,
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Admin created successfully',
                'admin' => $admin,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error creating admin',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
