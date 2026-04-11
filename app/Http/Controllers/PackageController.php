<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePackageRequest;
use App\Models\Business;
use App\Models\Driver;
use App\Services\PackageService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PackageController extends Controller
{
    public function __construct(
        protected PackageService $packageService
    ) {}

    public function index(Request $request): Response
    {
        $user = $request->user();
        $filters = $request->only(['status', 'search']);

        if ($user->isAdmin()) {
            $business = Business::find($user->business_id);
            if (! $business) {
                return Inertia::render('error', ['message' => 'No business associated']);
            }
            $packages = $this->packageService->listByBusiness($business, $filters);
        } elseif ($user->role === 'driver') {
            $driver = Driver::where('user_id', $user->id)->first();
            if (! $driver) {
                return Inertia::render('error', ['message' => 'Driver profile not found']);
            }
            $packages = $this->packageService->listByDriver($driver);
        } else {
            $packages = $this->packageService->listByClient($user->id);
        }

        return Inertia::render('packages/index', [
            'packages' => $packages,
            'filters' => $filters,
        ]);
    }

    public function show(string $trackingCode): Response
    {
        $package = $this->packageService->findByTrackingCode($trackingCode);

        if (! $package) {
            abort(404);
        }

        return Inertia::render('packages/show', [
            'package' => $package,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('packages/create');
    }

    public function store(StorePackageRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $data['client_id'] = $request->user()->id;

        $this->packageService->create($data);

        return redirect()->route('packages.index')->with('message', 'Package created successfully');
    }
}
