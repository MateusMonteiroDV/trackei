<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePackageRequest;
use App\Http\Requests\UpdatePackageRequest;
use App\Models\Business;
use App\Models\Driver;
use App\Services\PackageService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PackageController extends Controller
{
    public function __construct(
        protected PackageService $packageService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user->isAdmin()) {
            $business = Business::find($user->business_id);

            if (! $business) {
                return response()->json(['message' => 'No business associated'], 404);
            }

            $packages = $this->packageService->listByBusiness(
                $business,
                $request->only(['status', 'driver_id', 'search'])
            );
        } elseif ($user->role === 'driver') {
            $driver = Driver::where('user_id', $user->id)->first();

            if (! $driver) {
                return response()->json(['message' => 'Driver profile not found'], 404);
            }

            $packages = $this->packageService->listByDriver($driver);
        } else {
            $packages = $this->packageService->listByClient($user->id);
        }

        return response()->json($packages);
    }

    public function store(StorePackageRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['client_id'] = $request->user()->id;

        $package = $this->packageService->create($data);

        return response()->json([
            'message' => 'Package created successfully',
            'package' => $package,
        ], 201);
    }

    public function show(string $trackingCode): JsonResponse
    {
        $package = $this->packageService->findByTrackingCode($trackingCode);

        if (! $package) {
            return response()->json(['message' => 'Package not found'], 404);
        }

        return response()->json($package);
    }

    public function update(UpdatePackageRequest $request, int $id): JsonResponse
    {
        $package = $this->packageService->findById($id);

        if (! $package) {
            return response()->json(['message' => 'Package not found'], 404);
        }

        $package->update($request->validated());

        return response()->json([
            'message' => 'Package updated successfully',
            'package' => $package->fresh(),
        ]);
    }

    public function updateStatus(Request $request, int $id): JsonResponse
    {
        $data = $request->validate([
            'status' => 'required|string|in:in_transit,delivered',
        ]);

        $package = $this->packageService->findById($id);

        if (! $package) {
            return response()->json(['message' => 'Package not found'], 404);
        }

        try {
            $package = $this->packageService->updateStatus($package, $data['status']);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }

        return response()->json([
            'message' => 'Package status updated',
            'package' => $package,
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $package = $this->packageService->findById($id);

        if (! $package) {
            return response()->json(['message' => 'Package not found'], 404);
        }

        $this->packageService->destroy($package);

        return response()->json(['message' => 'Package deleted']);
    }

    public function track(string $trackingCode): JsonResponse
    {
        $package = $this->packageService->findByTrackingCode($trackingCode);

        if (! $package) {
            return response()->json(['message' => 'Package not found'], 404);
        }

        return response()->json([
            'tracking_code' => $package->tracking_code,
            'status' => $package->status,
            'sender_name' => $package->sender_name,
            'recipient_name' => $package->recipient_name,
            'delivery_address' => $package->delivery_address,
            'driver' => $package->driver ? [
                'name' => $package->driver->name,
                'vehicle' => $package->driver->vehicle,
            ] : null,
            'business' => $package->business ? [
                'name' => $package->business->name,
            ] : null,
            'created_at' => $package->created_at,
            'updated_at' => $package->updated_at,
        ]);
    }
}
