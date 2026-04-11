<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Business>
 */
class BusinessFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => fake()->unique()->company(),
            'cnpj' => fake()->unique()->numerify('##.###.###/####-##'),
            'address' => fake()->address(),
            'phone' => fake()->phoneNumber(),
        ];
    }
}
