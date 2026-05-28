<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $admin      = Role::create(['name' => 'Admin']);
        $tataKelola = Role::create(['name' => 'Tata Kelola']);
        $user       = Role::create(['name' => 'User']);

        $admin->givePermissionTo(Permission::all());

        $tataKelola->givePermissionTo([
            'dashboard',
            'barangs index',
            'vendors index', 'vendors create', 'vendors edit', 'vendors delete',
            'vendors barang create', 'vendors barang edit', 'vendors barang delete',
            'pembelians index', 'pembelians create', 'pembelians edit', 'pembelians delete',
            'pembelians show', 'pembelians change status',
            'pembelians barang create', 'pembelians barang edit', 'pembelians barang delete',
            'pengajuans index', 'pengajuans show', 'pengajuans change status',
            'pengajuans approve all normal', 'pengajuans buat pembelian selisih',
        ]);

        $user->givePermissionTo([
            'pengajuans index', 'pengajuans create', 'pengajuans edit', 'pengajuans delete',
            'pengajuans show',
            'pengajuans barang create', 'pengajuans barang edit', 'pengajuans barang delete',
        ]);
    }
}
