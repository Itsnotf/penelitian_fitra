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
            'pembelians index', 'pembelians create', 'pembelians edit', 'pembelians delete',
            'pembelians show', 'pembelians change status',
            'pembelians barang create', 'pembelians barang edit', 'pembelians barang delete',
            'pengajuans index', 'pengajuans create', 'pengajuans edit', 'pengajuans delete',
            'pengajuans show', 'pengajuans change status',
            'pengajuans approve all normal', 'pengajuans buat pembelian selisih',
            'pengajuans barang create', 'pengajuans barang edit', 'pengajuans barang delete',
        ];

        foreach ($permissions as $permission) {
            \Spatie\Permission\Models\Permission::create(['name' => $permission]);
        }
    }
}
