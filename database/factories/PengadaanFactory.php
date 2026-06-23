<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class PengadaanFactory extends Factory
{
    protected $model = \App\Models\Pengadaan::class;

    public function definition(): array
    {
        return [
            'user_id'     => User::factory(),
            'vendor_id'   => null,
            'total_harga' => 0,
            'deskripsi'   => fake()->sentence(),
            'status'      => 'pending',
        ];
    }
}
