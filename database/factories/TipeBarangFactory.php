<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class TipeBarangFactory extends Factory
{
    protected $model = \App\Models\TipeBarang::class;

    public function definition(): array
    {
        return [
            'nama_tipe' => fake()->unique()->word(),
        ];
    }
}
