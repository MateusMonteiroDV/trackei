<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Business;
use App\Models\Driver;
use App\Models\Package;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DriverController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        if ($user->role !== 'admin') {
            abort(403);
        }

        $businessId = $user->business_id;
        $query = Driver::where('business_id', $businessId)
            ->with('user:id,name,email');

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('cpf', 'like', "%{$search}%");
            });
        }

        return Inertia::render('drivers/index', [
            'drivers' => $query->paginate(15),
            'filters' => $request->only(['status', 'search']),
        ]);
    }

    public function show(int $id): Response
    {
        $driver = Driver::with(['user:id,name,email', 'business:id,name'])
            ->findOrFail($id);

        $activePackages = Package::where('assigned_driver_id', $driver->id)
            ->where('status', 'in_transit')
            ->get();

        return Inertia::render('drivers/show', [
            'driver' => $driver,
            'activePackages' => $activePackages,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('drivers/create');
    }
}
