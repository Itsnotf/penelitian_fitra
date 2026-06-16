<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = [
            'dashboard',
            'users index', 'users create', 'users edit', 'users delete',
            'roles index', 'roles create', 'roles edit', 'roles delete',
            'barangs index', 'barangs create', 'barangs edit', 'barangs delete',
            'vendors index', 'vendors create', 'vendors edit', 'vendors delete',
            'vendors barang create', 'vendors barang edit', 'vendors barang delete',
            'pengadaan index', 'pengadaan create', 'pengadaan edit', 'pengadaan delete',
            'pengadaan show', 'pengadaan change status',
            'pengadaan barang create', 'pengadaan barang edit', 'pengadaan barang delete',
            'permintaan index', 'permintaan create', 'permintaan edit', 'permintaan delete',
            'permintaan show', 'permintaan change status',
            'permintaan approve all normal', 'permintaan buat pengadaan selisih',
            'permintaan barang create', 'permintaan barang edit', 'permintaan barang delete',
        ];

        foreach ($permissions as $permission) {
            \Spatie\Permission\Models\Permission::create(['name' => $permission]);
        }
    }
}
