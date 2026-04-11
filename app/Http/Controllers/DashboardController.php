<?php

namespace App\Http\Controllers;

use App\Services\DashboardService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct(
        protected DashboardService $dashboardService
    ) {}

    public function index(Request $request): Response
    {
        $stats = $this->dashboardService->getStats($request->user());

        return Inertia::render('auth/dashboard', [
            'stats' => $stats,
        ]);
    }

    public function getApiStats(Request $request)
    {
        $stats = $this->dashboardService->getStats($request->user());

        return response()->json($stats);
    }
}
