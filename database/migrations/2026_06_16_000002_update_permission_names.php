<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $map = [
            'pembelians index'                  => 'pengadaan index',
            'pembelians create'                 => 'pengadaan create',
            'pembelians edit'                   => 'pengadaan edit',
            'pembelians delete'                 => 'pengadaan delete',
            'pembelians show'                   => 'pengadaan show',
            'pembelians change status'          => 'pengadaan change status',
            'pembelians barang create'          => 'pengadaan barang create',
            'pembelians barang edit'            => 'pengadaan barang edit',
            'pembelians barang delete'          => 'pengadaan barang delete',
            'pengajuans index'                  => 'permintaan index',
            'pengajuans create'                 => 'permintaan create',
            'pengajuans edit'                   => 'permintaan edit',
            'pengajuans delete'                 => 'permintaan delete',
            'pengajuans show'                   => 'permintaan show',
            'pengajuans change status'          => 'permintaan change status',
            'pengajuans approve all normal'     => 'permintaan approve all normal',
            'pengajuans buat pembelian selisih' => 'permintaan buat pengadaan selisih',
            'pengajuans barang create'          => 'permintaan barang create',
            'pengajuans barang edit'            => 'permintaan barang edit',
            'pengajuans barang delete'          => 'permintaan barang delete',
        ];

        foreach ($map as $old => $new) {
            DB::table('permissions')->where('name', $old)->update(['name' => $new]);
        }
    }

    public function down(): void
    {
        $map = [
            'pengadaan index'                   => 'pembelians index',
            'pengadaan create'                  => 'pembelians create',
            'pengadaan edit'                    => 'pembelians edit',
            'pengadaan delete'                  => 'pembelians delete',
            'pengadaan show'                    => 'pembelians show',
            'pengadaan change status'           => 'pembelians change status',
            'pengadaan barang create'           => 'pembelians barang create',
            'pengadaan barang edit'             => 'pembelians barang edit',
            'pengadaan barang delete'           => 'pembelians barang delete',
            'permintaan index'                  => 'pengajuans index',
            'permintaan create'                 => 'pengajuans create',
            'permintaan edit'                   => 'pengajuans edit',
            'permintaan delete'                 => 'pengajuans delete',
            'permintaan show'                   => 'pengajuans show',
            'permintaan change status'          => 'pengajuans change status',
            'permintaan approve all normal'     => 'pengajuans approve all normal',
            'permintaan buat pengadaan selisih' => 'pengajuans buat pembelian selisih',
            'permintaan barang create'          => 'pengajuans barang create',
            'permintaan barang edit'            => 'pengajuans barang edit',
            'permintaan barang delete'          => 'pengajuans barang delete',
        ];

        foreach ($map as $old => $new) {
            DB::table('permissions')->where('name', $old)->update(['name' => $new]);
        }
    }
};
