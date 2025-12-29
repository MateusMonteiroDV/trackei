<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

    Route::get('/login', function () {
        return Inertia::render('auth/login');
    })->name('login');

    Route::get('/register', function () {
        return Inertia::render('auth/register');
    })->name('register');


Route::get('/', function () {
    return Inertia::render('welcome', [
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('auth/dashboard');
    })->name('dashboard');
});
Route::middleware('web')->group(function () {
    require __DIR__.'/settings.php';
});
