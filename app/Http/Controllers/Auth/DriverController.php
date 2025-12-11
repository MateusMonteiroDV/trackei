<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Driver;
use App\Models\User;
use App\Models\Business;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redis;
use App\Events\DriverLocationUpdated;

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
            'cpf' => 'required|string|max:255|unique:drivers,cpf',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6|confirmed',
            'role' => 'required|in:admin,client,driver',
            'vehicle' => 'required|string',
        ]);

        $userAdmin = $req->user();

        try {
            $driver = DB::transaction(function () use ($data, $userAdmin) {
                $business = Business::where('id', $userAdmin->business_id)->first();
                if (!$business) {
                    throw new \Exception('Cannot create driver: company with this CNPJ does not exist');
                }

                $user = User::create([
                    'name' => $data['username'],
                    'email' => $data['email'],
                    'password' => Hash::make($data['password']),
                    'role' => $data['role']
                ]);

                return Driver::create([
                    'user_id' => $user->id,
                    'name' => $data['name'],
                    'cpf' => $data['cpf'],
                    'vehicle' => $data['vehicle'],
                    'business_id' => $business->id
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

    public function deleteDriver(Request $req)
    {
        try {
            if ($req->user()->role !== 'admin') {
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            $data = $req->validate([
                'cpf' => 'required|string'
            ]);

            DB::beginTransaction();

            $driver = Driver::where('cpf', $data['cpf'])->first();

            if (!$driver) {
                return response()->json(['message' => 'Driver not found'], 404);
            }

            $userId = $driver->user_id;

            $driver->delete();
            User::where('id', $userId)->delete();

            DB::commit();

            return response()->json(['message' => 'Driver and user deleted'], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Error deleting driver',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function editDriver(Request $req)
    {
        try {
            if ($req->user()->role !== 'admin') {
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            $data = $req->validate([
                'cpf' => 'required|string',
                'name' => 'sometimes|string',
                'vehicle' => 'sometimes|string',
            ]);

            $driver = Driver::where('cpf', $data['cpf'])->first();

            if (!$driver) {
                return response()->json(['message' => 'Driver not found'], 404);
            }

            unset($data['cpf']);

            $driver->update($data);

            return response()->json([
                'message' => 'Driver updated successfully',
                'driver' => $driver

            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error updating driver',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getDriver(Request $req)
    {
        try {
            if ($req->user()->role !== 'admin') {
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            $id_business = $req->user()->business_id;
            $drivers = Driver::where('business_id', $id_business)->get();

            return response()->json($drivers, 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error fetching drivers',
                'error' => $e->getMessage()
            ], 500);
        }
    }
        public function sendLocationDriver(Request $req)
        {
            try {
                if ($req->user()->role !== 'driver') {
                    return response()->json(['message' => 'You are not a driver'], 403);
                }

                $data = $req->validate([
                    'lat' => 'required|numeric',
                    'lng' => 'required|numeric',
                ]);

                $driverId = $req->user()->id;

                Redis::set("driver:$driverId:location", json_encode([
                    'lat' => $data['lat'],
                    'lng' => $data['lng'],
                    'updated_at' => now()->toDateTimeString()
                ]));

                broadcast(new DriverLocationUpdated(
                    $driverId,
                    $data['lat'],
                    $data['lng']
                ));

                return response()->json([], 200);

            } catch (\Exception $e) {
                return response()->json([], 500);
            }
        }}
    }

}

