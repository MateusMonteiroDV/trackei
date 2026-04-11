<?php

use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\PackageController;
use App\Http\Controllers\Auth\BusinessController;
use App\Http\Controllers\Auth\ClientController;
use App\Http\Controllers\Auth\DriverController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/register', [RegisterController::class, 'register']);
Route::middleware('web')->post('/login', [LoginController::class, 'login']);
Route::post('/create-business', [BusinessController::class, 'store']);

// Public tracking endpoint
Route::get('/track/{trackingCode}', [PackageController::class, 'track']);

Route::middleware('auth:sanctum')->group(function () {

    Route::get('/me', function (Request $request) {
        return $request->user();
    });

    Route::get('/dashboard', [\App\Http\Controllers\DashboardController::class, 'getApiStats']);

    Route::get('/admin-only', function (Request $request) {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        return ['secret' => 'Admin content'];
    });
    // logic-admin
    Route::post('/create-admin', [BusinessController::class, 'createAdmin']);

    // Business Management
    Route::get('/business/{id}', [BusinessController::class, 'show']);
    Route::patch('/business/{id}', [BusinessController::class, 'update']);
    Route::get('/business/{id}/stats', [BusinessController::class, 'getStats']);

    // Notifications
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::get('/notifications/unread', [NotificationController::class, 'unread']);
    Route::post('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::post('/notifications/read-all', [NotificationController::class, 'markAllAsRead']);
    Route::delete('/notifications/{id}', [NotificationController::class, 'destroy']);

    // logic-driver
    Route::get('/drivers', [DriverController::class, 'getDriver']);
    Route::post('/create-driver', [DriverController::class, 'createDriver']);
    Route::delete('/delete-driver', [DriverController::class, 'deleteDriver']);
    Route::put('/edit-driver', [DriverController::class, 'editDriver']);
    Route::post('/driver/location', [DriverController::class, 'sendLocationDriver']);
    Route::get('/drivers/{id}/locations', [DriverController::class, 'getLocationHistory']);
    Route::post('/driver/accept-package/{packageId}', [DriverController::class, 'acceptPackage']);

    // logic-client
    Route::post('/simulate-purchase', [ClientController::class, 'simulatePurchase']);

    // Package CRUD
    Route::apiResource('packages', PackageController::class)->except(['show']);
    Route::get('/packages/{trackingCode}', [PackageController::class, 'show']);
    Route::patch('/packages/{id}/status', [PackageController::class, 'updateStatus'])->name('api.packages.update-status');
});

Route::get('health', function () {
    return response()->json(['ok' => true]);
});
