<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Package;
use App\Models\Driver;
use App\Models\Business;
use App\Models\Client;
use App\Events\NewPackageAvailable;

class clientController extends Controller
{
    public function simulatePurchase(Request $req)
    {
        try {
            if ($req->user()->role != 'client') {
                return response()->json([
                    'message' => 'You are not client'
                ], 400);
            }
            $data = $req->validate([
                'business_cnpj' => 'required|string',
                'recipient_name' => 'required|string',
                'delivery_address' => 'required|string',
            ]);

            $business = Business::where('cnpj', $data['business_cnpj'])->firstOrFail();

            $package = Package::create([
                'tracking_code' => 'PKG' . rand(1000, 9999),
                'sender_name' => $business->name,
                'recipient_name' => $data['recipient_name'],
                'delivery_address' => $data['delivery_address'],
                'status' => 'pending',
                'business_id' => $business->id
            ]);

            $availableDrivers = Driver::where('status', 'available')
                ->where('business_id', $business->id)
                ->get();

            broadcast(new NewPackageAvailable($package));

            return response()->json([
                'message' => 'Package created and broadcasted to available drivers of this business',
                'package' => $package,
                'available_drivers_count' => $availableDrivers->count()
            ], 200);
        } catch (\Exception $e) {

            return response()->json([
                'message' => 'Error fetching drivers',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
