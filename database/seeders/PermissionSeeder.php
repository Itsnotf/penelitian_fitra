<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permissions = [
            'users index',
            'users create',
            'users edit',
            'users delete',
            'roles index',
            'roles create',
            'roles edit',
            'roles delete',
            'barangs index',
            'barangs create',
            'barangs edit',
            'barangs delete',
            'pembelians index',
            'pembelians create',
            'pembelians edit',
            'pembelians delete',
            'pembelians show',
            'pembelians change status',
            'pembelians barang create',
            'pembelians barang edit',
            'pembelians barang delete',
            'pengajuans index',
            'pengajuans create',
            'pengajuans edit',
            'pengajuans delete',
            'pengajuans show',
            'pengajuans change status',
            'pengajuans barang create',
            'pengajuans barang edit',
            'pengajuans barang delete',
        ];

        foreach ($permissions as $permission) {
            \Spatie\Permission\Models\Permission::create(['name' => $permission]);
        }
    }
}
