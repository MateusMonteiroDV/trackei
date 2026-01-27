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



Route::get('/dashboard', function () {
    return Inertia::render('auth/dashboard');
})->name('dashboard');

Route::get('/create-business', function () {
    return Inertia::render('auth/create-business');
})->name('create-business');

require __DIR__ . '/settings.php';
