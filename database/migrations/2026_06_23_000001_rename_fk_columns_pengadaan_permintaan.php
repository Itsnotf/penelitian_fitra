<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Tabel pembelians/pengajuans sudah di-rename jadi pengadaan/permintaan
 * (lihat 2026_06_16_000001_rename_pembelian_pengajuan_tables.php), tapi
 * kolom FK-nya masih membawa nama lama. Migration ini menyamakan nama
 * kolom dengan nama tabel barunya:
 *   - barang_pengadaan.pembelian_id   -> pengadaan_id
 *   - barang_permintaan.pengajuan_id  -> permintaan_id
 *   - pengadaan.pengajuan_id          -> permintaan_id
 */
return new class extends Migration
{
    public function up(): void
    {
        $isMySQL = DB::connection()->getDriverName() === 'mysql';

        if ($isMySQL) {
            DB::statement('ALTER TABLE barang_pengadaan DROP FOREIGN KEY barang_pengadaan_pembelian_id_foreign');
            DB::statement('ALTER TABLE barang_permintaan DROP FOREIGN KEY barang_permintaan_pengajuan_id_foreign');
        }

        Schema::table('barang_pengadaan', function (Blueprint $table) {
            $table->renameColumn('pembelian_id', 'pengadaan_id');
        });

        Schema::table('barang_permintaan', function (Blueprint $table) {
            $table->renameColumn('pengajuan_id', 'permintaan_id');
        });

        Schema::table('pengadaan', function (Blueprint $table) {
            $table->renameColumn('pengajuan_id', 'permintaan_id');
        });

        if ($isMySQL) {
            DB::statement('ALTER TABLE barang_pengadaan ADD CONSTRAINT barang_pengadaan_pengadaan_id_foreign FOREIGN KEY (pengadaan_id) REFERENCES pengadaan(id) ON DELETE CASCADE');
            DB::statement('ALTER TABLE barang_permintaan ADD CONSTRAINT barang_permintaan_permintaan_id_foreign FOREIGN KEY (permintaan_id) REFERENCES permintaan(id) ON DELETE CASCADE');
        }
    }

    public function down(): void
    {
        $isMySQL = DB::connection()->getDriverName() === 'mysql';

        if ($isMySQL) {
            DB::statement('ALTER TABLE barang_pengadaan DROP FOREIGN KEY barang_pengadaan_pengadaan_id_foreign');
            DB::statement('ALTER TABLE barang_permintaan DROP FOREIGN KEY barang_permintaan_permintaan_id_foreign');
        }

        Schema::table('barang_pengadaan', function (Blueprint $table) {
            $table->renameColumn('pengadaan_id', 'pembelian_id');
        });

        Schema::table('barang_permintaan', function (Blueprint $table) {
            $table->renameColumn('permintaan_id', 'pengajuan_id');
        });

        Schema::table('pengadaan', function (Blueprint $table) {
            $table->renameColumn('permintaan_id', 'pengajuan_id');
        });

        if ($isMySQL) {
            DB::statement('ALTER TABLE barang_pengadaan ADD CONSTRAINT barang_pengadaan_pembelian_id_foreign FOREIGN KEY (pembelian_id) REFERENCES pengadaan(id) ON DELETE CASCADE');
            DB::statement('ALTER TABLE barang_permintaan ADD CONSTRAINT barang_permintaan_pengajuan_id_foreign FOREIGN KEY (pengajuan_id) REFERENCES permintaan(id) ON DELETE CASCADE');
        }
    }
};
