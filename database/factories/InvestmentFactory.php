<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Investment>
 */
class InvestmentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
           //$table->id();
           //$table->string('name');
           //$table->longText('description')->nullable();
           //$table->enum('type', ['Stock', 'Bond', 'Futures', 'Precious Metals', 'Real Estate', 'Cryptocurrency']);
           //$table->decimal('amount', 10, 2);
           //$table->date('start_date');
           //$table->date('end_date')->nullable();
           //$table->decimal('value', 10, 2);
           //$table->foreignId('user_id')->constrained(table: 'users');
           //$table->timestamps();
           'name' => fake()->sentence(),
            'description' => fake()->realText(),
            'type' => fake()->randomElement(['Stock', 'Bond', 'Futures', 'Precious Metals', 'Real Estate', 'Cryptocurrency']),
            'action' => fake()->randomElement(['Buy', 'Sell']),
            'amount' => fake()->numberBetween(1,100),
            'date_of_operation' => $this->faker->dateTimeBetween('-6 years', 'now'),
            'value' => fake()->randomFloat(2, 10, 10),
            'user_id' => 1,
        ];
    }
}
