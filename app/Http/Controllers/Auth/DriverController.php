<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Driver;
use App\Models\User;
use App\Models\Business;
use App\Models\Package;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redis;
use App\Events\DriverLocationUpdated;

class DriverController extends Controller
{

    public function createDriver(Request $req)
    {
        if ($req->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $data = $req->validate([
            'username' => 'required|string|max:255|unique:users,name',
            'name'     => 'required|string|max:255|unique:drivers,name',
            'cpf'      => 'required|string|max:255|unique:drivers,cpf',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|string|min:6|confirmed',
            'vehicle'  => 'required|string',
        ]);

        $admin = $req->user();

        $business = Business::find($admin->business_id);
        if (!$business) {
            return response()->json(['message' => 'Business not found'], 404);
        }

        try {
            DB::beginTransaction();

            $user = User::create([
                'name'     => $data['username'],
                'email'    => $data['email'],
                'password' => Hash::make($data['password']),
            ]);

                $user->role = 'driver';
                $user->save();

                $driver = Driver::create([
                    'name'    => $data['name'],
                    'cpf'     => $data['cpf'],
                    'vehicle' => $data['vehicle'],
                ]);

                $driver->user_id = $user->id;
                $driver->business_id = $business->id;
                $driver->save();

                DB::commit();

                return response()->json([
                    'message' => 'Driver created successfully!',
                    'driver'  => $driver
                ], 201);

            } catch (\Exception $e) {
                DB::rollBack();

                return response()->json([
                    'message' => 'Error creating driver',
                    'error'   => $e->getMessage()
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
            $admin_id_business = $req->user()->business_id;

            if($driver->business_id !== $admin_id_business ){

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
            $admin_id_business = $req->user()->business_id;

            if($driver->business_id !== $admin_id_business ){

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

                broadcast(new DriverLocationUpdated(
                    $driverId,
                    $data['lat'],
                    $data['lng']
                ));

                return response()->json([], 200);

            } catch (\Exception $e) {
                return response()->json([], 500);
            }
        }



        public function acceptPackage(Request $req, $packageId)
        {
            $driver = Driver::where('user_id',$req->user()->id)->first();

            if (!$driver || $req->user()->role !== 'driver') {
                return response()->json([
                    'message' => 'Invalid driver'
                ], 403);
            }

            $package = Package::where('id', $packageId)
                ->whereNull('assigned_driver_id')
                ->first();

            if (!$package) {
                return response()->json([
                    'message' => 'This package is no longer available'
                ], 400);
            }

            $package->assigned_driver_id = $driver->id;
            $package->status = 'in_transit';
            $package->save();

            return response()->json([
                'message' => 'Package assigned successfully',
                'package' => $package
            ], 200);
        }

}

