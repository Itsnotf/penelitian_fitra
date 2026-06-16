<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $admin        = Role::create(['name' => 'Admin']);
        $tataKelola   = Role::create(['name' => 'Tata Kelola']);
        $kepalaBidang = Role::create(['name' => 'Kepala Bidang']);
        $user         = Role::create(['name' => 'User']);

        $admin->givePermissionTo(Permission::all());

        $tataKelola->givePermissionTo([
            'dashboard',
            'barangs index',
            'vendors index', 'vendors create', 'vendors edit', 'vendors delete',
            'vendors barang create', 'vendors barang edit', 'vendors barang delete',
            'pengadaan index', 'pengadaan create', 'pengadaan edit', 'pengadaan delete',
            'pengadaan show', 'pengadaan change status',
            'pengadaan barang create', 'pengadaan barang edit', 'pengadaan barang delete',
            'permintaan index', 'permintaan show', 'permintaan change status',
            'permintaan approve all normal', 'permintaan buat pengadaan selisih',
        ]);

        $kepalaBidang->givePermissionTo([
            'dashboard',
            'barangs index',
            'permintaan index', 'permintaan show', 'permintaan change status',
            'pengadaan index', 'pengadaan show',
        ]);

        $user->givePermissionTo([
            'permintaan index', 'permintaan create', 'permintaan edit', 'permintaan delete',
            'permintaan show',
            'permintaan barang create', 'permintaan barang edit', 'permintaan barang delete',
        ]);
    }
}
