<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Transaction>
 */
class TransactionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
           'name'=>fake()->sentence(),
           'description'=>fake()->realText(),
           'type' => fake()->randomElement(['Income', 'Expense']),
           'amount' => fake()->randomFloat(2, 1, 1000),
           'category' => fake()->randomElement(['Salary','Food', 'Transport', 'Entertainment', 'Education', 'Home', 'Service','Investment', 'Other']),
           'date' => $this->faker->dateTimeBetween('-6 years', 'now'),
           'user_id' => 1,
        ];
    }
}
