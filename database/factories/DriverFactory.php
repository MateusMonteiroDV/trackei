<?php

namespace Database\Factories;

use App\Models\Business;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Driver>
 */
class DriverFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'business_id' => Business::factory(),
            'name' => fake()->name(),
            'cpf' => fake()->numerify('###.###.###-##'),
            'vehicle' => fake()->randomElement(['Van', 'Truck', 'Motorcycle', 'Car']),
            'status' => fake()->randomElement(['available', 'on_delivery']),
        ];
    }

    public function available(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'available',
        ]);
    }

    public function onDelivery(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'on_delivery',
        ]);
    }
}
