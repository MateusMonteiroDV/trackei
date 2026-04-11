<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Business;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BusinessController extends Controller
{
    public function show(Request $request): Response
    {
        $user = $request->user();

        if ($user->role !== 'admin') {
            abort(403);
        }

        $business = Business::findOrFail($user->business_id);

        return Inertia::render('business/show', [
            'business' => $business,
        ]);
    }

    public function admins(Request $request): Response
    {
        $user = $request->user();

        if ($user->role !== 'admin') {
            abort(403);
        }

        $admins = User::where('business_id', $user->business_id)
            ->where('role', 'admin')
            ->get();

        return Inertia::render('business/admins', [
            'admins' => $admins,
        ]);
    }
}
