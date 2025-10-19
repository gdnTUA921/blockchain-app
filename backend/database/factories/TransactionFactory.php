<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class TransactionFactory extends Factory
{
    public function definition(): array
    {
        return [
            'sender'   => $this->faker->firstName(),
            'receiver' => $this->faker->firstName(),
            'amount'   => $this->faker->randomFloat(2, 1, 1000),
            'timestamp'=> now(),
            'status'   => 'pending',
        ];
    }
}

