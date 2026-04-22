<?php

namespace App\Http\Controllers\Auth;

use App\Events\NewPackageAvailable;
use App\Http\Controllers\Controller;
use App\Models\Business;
use App\Models\Driver;
use App\Models\Package;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response; // Importando o Facade Response

class ClientController extends Controller
{
    public function simulatePurchase(Request $req): JsonResponse
    {
        try {
            if ($req->user()->role != 'client') {
                // Usando Response::json em vez de response()->json
                return Response::json([
                    'message' => 'You are not client',
                ], 400);
            }
            $data = $req->validate([
                'business_cnpj' => 'required|string',
                'recipient_name' => 'required|string',
                'delivery_address' => 'required|string',
            ]);

            $business = Business::where('cnpj', $data['business_cnpj'])->firstOrFail();

            $package = Package::create([
                'tracking_code' => 'PKG'.strtoupper(uniqid()),
                'sender_name' => $business->name,
                'recipient_name' => $data['recipient_name'],
                'delivery_address' => $data['delivery_address'],
                'status' => 'pending',
                'business_id' => $business->id,
                'client_id' => $req->user()->id,
            ]);

            $availableDrivers = Driver::where('status', 'available')
                ->where('business_id', $business->id)
                ->get();

            broadcast(new NewPackageAvailable($package));

            // Usando Response::json em vez de response()->json
            return Response::json([
                'message' => 'Package created and broadcasted to available drivers of this business',
                'package' => $package,
                'available_drivers_count' => $availableDrivers->count(),
            ], 200);
        } catch (\Exception $e) {
            // Usando Response::json em vez de response()->json
            return Response::json([
                'message' => 'Error creating package',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
