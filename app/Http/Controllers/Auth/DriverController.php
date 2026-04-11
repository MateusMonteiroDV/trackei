<?php

namespace App\Http\Controllers\Auth;

use App\Events\DriverLocationUpdated;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreDriverRequest;
use App\Http\Requests\UpdateDriverRequest;
use App\Models\Business;
use App\Models\Driver;
use App\Models\DriverLocation;
use App\Models\Package;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DriverController extends Controller
{
    public function createDriver(StoreDriverRequest $req)
    {
        $data = $req->validated();

        $admin = $req->user();
        $business = Business::find($admin->business_id);

        if (! $business) {
            return response()->json(['message' => 'Business not found'], 404);
        }

        try {
            DB::beginTransaction();

            $user = User::create([
                'name' => $data['username'],
                'email' => $data['email'],
                'password' => Hash::make($data['password']),
                'role' => 'driver',
                'business_id' => $business->id,
            ]);

            $driver = Driver::create([
                'name' => $data['name'],
                'cpf' => $data['cpf'],
                'vehicle' => $data['vehicle'],
                'user_id' => $user->id,
                'business_id' => $business->id,
                'status' => 'available',
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Driver created successfully!',
                'driver' => $driver,
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Error creating driver',
                'error' => $e->getMessage(),
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
                'cpf' => 'required|string',
            ]);

            DB::beginTransaction();

            $driver = Driver::where('cpf', $data['cpf'])->first();

            if (! $driver) {
                return response()->json(['message' => 'Driver not found'], 404);
            }
            $admin_id_business = $req->user()->business_id;

            if ($driver->business_id !== $admin_id_business) {

                return response()->json(
                    ['message' => "Driver isn't part of the company"],
                    403);
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
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function editDriver(UpdateDriverRequest $req)
    {
        try {
            $data = $req->validated();

            $driver = Driver::where('cpf', $data['cpf'])->first();

            if (! $driver) {
                return response()->json(['message' => 'Driver not found'], 404);
            }
            $admin_id_business = $req->user()->business_id;

            if ($driver->business_id !== $admin_id_business) {

                return response()->json(
                    ['message' => "Driver isn't part of the company"],
                    403);
            }

            unset($data['cpf']);

            $driver->update($data);

            return response()->json([
                'message' => 'Driver updated successfully',
                'driver' => $driver,

            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error updating driver',
                'error' => $e->getMessage(),
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
            $query = Driver::where('business_id', $id_business)
                ->with('user:id,name,email');

            if ($req->has('status')) {
                $query->where('status', $req->status);
            }

            if ($req->has('search')) {
                $search = $req->search;
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('cpf', 'like', "%{$search}%")
                        ->orWhere('vehicle', 'like', "%{$search}%");
                });
            }

            $drivers = $query->paginate($req->get('per_page', 15));

            return response()->json($drivers, 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error fetching drivers',
                'error' => $e->getMessage(),
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

            $driver = Driver::where('user_id', $req->user()->id)->first();

            if (! $driver) {
                return response()->json(['message' => 'Driver profile not found'], 404);
            }

            // Persist location
            DriverLocation::create([
                'driver_id' => $driver->id,
                'lat' => $data['lat'],
                'lng' => $data['lng'],
            ]);

            broadcast(new DriverLocationUpdated(
                $driver->id,
                $data['lat'],
                $data['lng']
            ));

            return response()->json(['message' => 'Location broadcasted'], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error sending location',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function acceptPackage(Request $req, $packageId)
    {
        if ($req->user()->role !== 'driver') {
            return response()->json([
                'message' => 'Only drivers can accept packages',
            ], 403);
        }

        $driver = Driver::where('user_id', $req->user()->id)->first();

        if (! $driver) {
            return response()->json([
                'message' => 'Driver profile not found',
            ], 404);
        }

        $package = Package::where('id', $packageId)
            ->whereNull('assigned_driver_id')
            ->first();

        if (! $package) {
            return response()->json([
                'message' => 'This package is no longer available',
            ], 400);
        }

        $package->assigned_driver_id = $driver->id;
        $package->status = 'in_transit';
        $package->save();

        return response()->json([
            'message' => 'Package assigned successfully',
            'package' => $package,
        ], 200);
    }

    public function getLocationHistory(Request $req, $driverId)
    {
        try {
            $driver = Driver::find($driverId);

            if (! $driver) {
                return response()->json(['message' => 'Driver not found'], 404);
            }

            // Authorization: Admin of the same business OR the driver themselves
            $user = $req->user();
            $isOwnHistory = $user->role === 'driver' && $driver->user_id === $user->id;
            $isAdminOfBusiness = $user->role === 'admin' && $user->business_id === $driver->business_id;

            if (! $isOwnHistory && ! $isAdminOfBusiness) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            $locations = $driver->locations()
                ->orderBy('created_at', 'desc')
                ->paginate(50);

            return response()->json($locations, 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error fetching location history',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
