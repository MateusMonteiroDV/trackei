<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/login', function () {
    return Inertia::render('auth/login');
})->name('login');

Route::get('/register', function () {
    return Inertia::render('auth/register');
})->name('register');

Route::get('/', function () {
    return Inertia::render('welcome', []);
})->name('home');

Route::get('/dashboard', [\App\Http\Controllers\DashboardController::class, 'index'])->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/create-business', function () {
    return Inertia::render('auth/create-business');
})->name('create-business');

Route::get('/profile', function () {
    return Inertia::render('profile');
})->name('profile');

Route::middleware('auth')->group(function () {
    Route::get('/packages', [\App\Http\Controllers\PackageController::class, 'index'])->name('packages.index');
    Route::get('/packages/create', [\App\Http\Controllers\PackageController::class, 'create'])->name('packages.create');
    Route::post('/packages', [\App\Http\Controllers\PackageController::class, 'store'])->name('packages.store');
    Route::get('/packages/{trackingCode}', [\App\Http\Controllers\PackageController::class, 'show'])->name('packages.show');

    // Drivers
    Route::get('/drivers', [\App\Http\Controllers\Web\DriverController::class, 'index'])->name('drivers.index');
    Route::get('/drivers/create', [\App\Http\Controllers\Web\DriverController::class, 'create'])->name('drivers.create');
    Route::get('/drivers/{id}', [\App\Http\Controllers\Web\DriverController::class, 'show'])->name('drivers.show');

    // Business
    Route::get('/business/settings', [\App\Http\Controllers\Web\BusinessController::class, 'show'])->name('business.show');
    Route::get('/business/admins', [\App\Http\Controllers\Web\BusinessController::class, 'admins'])->name('business.admins');
    // Notifications
    Route::get('/notifications', function () {
        return \Inertia\Inertia::render('notifications/index');
    })->name('notifications.index');
});

require __DIR__.'/settings.php';
