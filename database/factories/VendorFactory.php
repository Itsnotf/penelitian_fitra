<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class VendorFactory extends Factory
{
    protected $model = \App\Models\Vendor::class;

    public function definition(): array
    {
        return [
            'nama_vendor' => fake()->unique()->company(),
            'alamat'      => fake()->address(),
            'telepon'     => fake()->phoneNumber(),
            'email'       => fake()->unique()->companyEmail(),
        ];
    }
}
