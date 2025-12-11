
<?php

use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\DriverController;
use App\Http\Controllers\Auth\BusinessController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/register', [RegisterController::class, 'register']);
Route::post('/login', [LoginController::class, 'login']);
Route::post('/create-business',[BusinessController::class,'store']);


Route::middleware('auth:sanctum')->group(function() {

    Route::get('/user', function(Request $request) {
        return $request->user();
    });

    Route::get('/admin-only', function(Request $request) {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Forbidden'], 403);
        }
        return ['secret' => 'Admin content'];
    });

    Route::get('/drivers',[DriverController::class,'getDriver']);
    Route::post('/create-driver',[DriverController::class,'createDriver']);
    Route::delete('/delete-driver',[DriverController::class,'deleteDriver']);
    Route::put('/edit-driver',[DriverController::class,'editDriver']);

    Route::post('/driver/location',[DriverController::class,'sendLocationDriver']);
});

Route::get('health', function () {
    return response()->json(['ok' => true]);
});

