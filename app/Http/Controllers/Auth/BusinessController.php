<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Business;
use Illuminate\Database\QueryException;

class BusinessController extends Controller
{
    public function store(Request $req)
    {

        try {
            $data = $req->validate([
                'name' => 'required|string|max:255|unique:business,name',
                'cnpj' => 'required|string|unique:business,cnpj',
                'address' => 'nullable|string|max:500',
                'phone' => 'nullable|string|max:20',
            ]);

            $business = Business::create($data);

            return response()->json([
                'message' => 'Business created successfully',
                'business' => $business
            ], 201);
        } catch (QueryException $e) {
            return response()->json([
                'message' => 'Error creating business',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}


