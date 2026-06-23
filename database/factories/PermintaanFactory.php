<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class PermintaanFactory extends Factory
{
    protected $model = \App\Models\Permintaan::class;

    public function definition(): array
    {
        return [
            'user_id'   => User::factory(),
            'deskripsi' => fake()->sentence(),
            'urgensi'   => 'normal',
            'status'    => 'pending',
        ];
    }
}
