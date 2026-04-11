<?php

namespace Database\Seeders;

use App\Models\Business;
use App\Models\Driver;
use App\Models\Package;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Test user (quick access)
        User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'password' => 'password',
                'email_verified_at' => now(),
            ]
        );

        // Create a business with admin
        $business = Business::factory()->create([
            'name' => 'Trackei Express',
            'cnpj' => '12.345.678/0001-90',
        ]);

        $admin = User::factory()->admin($business)->create([
            'name' => 'Admin User',
            'email' => 'admin@trackei.com',
            'password' => 'password',
        ]);

        // Create drivers
        $drivers = Driver::factory()
            ->for($business)
            ->for(User::factory()->driver($business))
            ->count(5)
            ->create();

        // Make 3 drivers available
        $drivers->take(3)->each(fn ($driver) => $driver->update(['status' => 'available']));

        // Make 2 drivers on delivery
        $drivers->skip(3)->each(fn ($driver) => $driver->update(['status' => 'on_delivery']));

        // Create packages
        $client = User::factory()->forBusiness($business)->create([
            'name' => 'Client User',
            'email' => 'client@trackei.com',
            'password' => 'password',
        ]);

        // Pending packages (no driver assigned)
        Package::factory()->forBusiness($business)->forClient($client)->pending()->count(5)->create();

        // In-transit packages (assigned to available drivers)
        $drivers->take(2)->each(function ($driver) use ($business, $client) {
            Package::factory()
                ->forBusiness($business)
                ->forClient($client)
                ->forDriver($driver)
                ->count(2)
                ->create();
        });

        // Delivered packages
        Package::factory()
            ->forBusiness($business)
            ->forClient($client)
            ->delivered()
            ->count(3)
            ->create();
    }
}
