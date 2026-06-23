<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::firstOrCreate(
            ['email' => 'admin@gmail.com'],
            ['name' => 'Admin', 'password' => bcrypt('password'), 'email_verified_at' => now()]
        );
        $admin->assignRole('Admin');

        $tataKelola = User::firstOrCreate(
            ['email' => 'tatakelola@gmail.com'],
            ['name' => 'Tata Kelola', 'password' => bcrypt('password'), 'email_verified_at' => now()]
        );
        $tataKelola->assignRole('Tata Usaha');

        $kepalaBidang = User::firstOrCreate(
            ['email' => 'kepalabidang@gmail.com'],
            ['name' => 'Kepala Bidang', 'password' => bcrypt('password'), 'email_verified_at' => now()]
        );
        $kepalaBidang->assignRole('Kepala Bidang');

        User::factory(5)->create()->each(fn($u) => $u->assignRole('User'));
    }
}
