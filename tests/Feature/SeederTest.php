<?php

use Database\Seeders\PermissionSeeder;
use Database\Seeders\RoleSeeder;
use Database\Seeders\UserSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;

uses(RefreshDatabase::class);

test('full seeder sequence runs without throwing (regression: role name typo)', function () {
    // Sebelumnya UserSeeder memanggil assignRole('Tata Kelola') padahal
    // RoleSeeder membuat role dengan nama 'Tata Usaha' -> RoleDoesNotExist.
    $this->seed(PermissionSeeder::class);
    $this->seed(RoleSeeder::class);
    $this->seed(UserSeeder::class);

    expect(Role::where('name', 'Tata Usaha')->exists())->toBeTrue();
});

test('seeded Tata Usaha user actually has the Tata Usaha role', function () {
    $this->seed(PermissionSeeder::class);
    $this->seed(RoleSeeder::class);
    $this->seed(UserSeeder::class);

    $user = \App\Models\User::where('email', 'tatakelola@gmail.com')->first();

    expect($user)->not->toBeNull();
    expect($user->hasRole('Tata Usaha'))->toBeTrue();
});
