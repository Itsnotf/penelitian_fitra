<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $isMySQL = DB::connection()->getDriverName() === 'mysql';

        if ($isMySQL) {
            DB::statement('ALTER TABLE barang__pembelians DROP FOREIGN KEY barang__pembelians_pembelian_id_foreign');
            DB::statement('ALTER TABLE barang_pengajuans DROP FOREIGN KEY barang_pengajuans_pengajuan_id_foreign');
        }

        Schema::rename('pembelians', 'pengadaan');
        Schema::rename('barang__pembelians', 'barang_pengadaan');
        Schema::rename('pengajuans', 'permintaan');
        Schema::rename('barang_pengajuans', 'barang_permintaan');

        if ($isMySQL) {
            DB::statement('ALTER TABLE barang_pengadaan ADD CONSTRAINT barang_pengadaan_pembelian_id_foreign FOREIGN KEY (pembelian_id) REFERENCES pengadaan(id) ON DELETE CASCADE');
            DB::statement('ALTER TABLE barang_permintaan ADD CONSTRAINT barang_permintaan_pengajuan_id_foreign FOREIGN KEY (pengajuan_id) REFERENCES permintaan(id) ON DELETE CASCADE');
        }
    }

    public function down(): void
    {
        $isMySQL = DB::connection()->getDriverName() === 'mysql';

        if ($isMySQL) {
            DB::statement('ALTER TABLE barang_pengadaan DROP FOREIGN KEY barang_pengadaan_pembelian_id_foreign');
            DB::statement('ALTER TABLE barang_permintaan DROP FOREIGN KEY barang_permintaan_pengajuan_id_foreign');
        }

        Schema::rename('pengadaan', 'pembelians');
        Schema::rename('barang_pengadaan', 'barang__pembelians');
        Schema::rename('permintaan', 'pengajuans');
        Schema::rename('barang_permintaan', 'barang_pengajuans');

        if ($isMySQL) {
            DB::statement('ALTER TABLE barang__pembelians ADD CONSTRAINT barang__pembelians_pembelian_id_foreign FOREIGN KEY (pembelian_id) REFERENCES pembelians(id) ON DELETE CASCADE');
            DB::statement('ALTER TABLE barang_pengajuans ADD CONSTRAINT barang_pengajuans_pengajuan_id_foreign FOREIGN KEY (pengajuan_id) REFERENCES pengajuans(id) ON DELETE CASCADE');
        }
    }
};
