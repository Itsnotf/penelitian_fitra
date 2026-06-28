<?php

namespace Database\Factories;

use App\Models\TipeBarang;
use Illuminate\Database\Eloquent\Factories\Factory;

class BarangsFactory extends Factory
{
    protected $model = \App\Models\Barangs::class;

    public function definition(): array
    {
        return [
            'nama_barang'       => fake()->unique()->words(2, true),
            'tipe_barang_id'    => TipeBarang::factory(),
            'jenis_barang'      => fake()->randomElement(['habis_pakai', 'tidak_habis_pakai']),
            'satuan'            => fake()->randomElement(['Pcs', 'Rim', 'Box', 'Unit']),
            'stock_awal'        => 100,
            'stock_masuk'       => 0,
            'stock_keluar'      => 0,
            'stock_tersedia'    => 100,
            'jumlah_permintaan' => 0,
        ];
    }
}
