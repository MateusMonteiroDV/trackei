<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Client;

class clientController extends Controller
{
    public function getTrackCode(Request $req)
    {
        try{
            if($req->user()->role != 'client'){
                return response()->json([
                    'message' => 'You are not client'
                ], 400);
            }

        }catch(\Exception $e){
            return response()->json([
                'message' => 'Error fetching drivers',
                'error' => $e->getMessage()
            ], 500);

        }
    }
}
