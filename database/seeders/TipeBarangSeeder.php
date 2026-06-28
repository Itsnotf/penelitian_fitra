<?php

namespace Database\Seeders;

use App\Models\TipeBarang;
use Illuminate\Database\Seeder;

class TipeBarangSeeder extends Seeder
{
    public function run(): void
    {
        $tipeList = [
            'Alat Tulis Kantor',
            'Alat Elektronik',
            'Furnitur',
            'Alat Kebersihan',
            'Alat Kesehatan',
            'Bahan Kimia',
            'Peralatan Laboratorium',
            'Komputer & Perangkat IT',
            'Alat Komunikasi',
            'Perlengkapan Keamanan',
        ];

        foreach ($tipeList as $nama) {
            TipeBarang::firstOrCreate(['nama_tipe' => $nama]);
        }
    }
}
