<?php

namespace Database\Factories;

use App\Models\Business;
use App\Models\Driver;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Package>
 */
class PackageFactory extends Factory
{
    public function definition(): array
    {
        return [
            'tracking_code' => 'PKG'.strtoupper(fake()->unique()->bothify('??????')),
            'sender_name' => fake()->name(),
            'recipient_name' => fake()->name(),
            'delivery_address' => fake()->address(),
            'status' => fake()->randomElement(['pending', 'in_transit', 'delivered']),
            'business_id' => Business::factory(),
            'client_id' => User::factory(),
            'assigned_driver_id' => null,
        ];
    }

    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'pending',
        ]);
    }

    public function inTransit(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'in_transit',
            'assigned_driver_id' => Driver::factory(),
        ]);
    }

    public function delivered(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'delivered',
            'assigned_driver_id' => Driver::factory(),
        ]);
    }

    public function forBusiness(Business $business): static
    {
        return $this->state(fn (array $attributes) => [
            'business_id' => $business->id,
        ]);
    }

    public function forDriver(Driver $driver): static
    {
        return $this->state(fn (array $attributes) => [
            'assigned_driver_id' => $driver->id,
            'status' => 'in_transit',
        ]);
    }

    public function forClient(User $client): static
    {
        return $this->state(fn (array $attributes) => [
            'client_id' => $client->id,
        ]);
    }
}
