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
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});



require __DIR__.'/settings.php';
