<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Drop FKs on child tables first (they reference parent tables being renamed)
        DB::statement('ALTER TABLE barang__pembelians DROP FOREIGN KEY barang__pembelians_pembelian_id_foreign');
        DB::statement('ALTER TABLE barang_pengajuans DROP FOREIGN KEY barang_pengajuans_pengajuan_id_foreign');

        // Rename all four tables
        DB::statement('RENAME TABLE pembelians TO pengadaan');
        DB::statement('RENAME TABLE barang__pembelians TO barang_pengadaan');
        DB::statement('RENAME TABLE pengajuans TO permintaan');
        DB::statement('RENAME TABLE barang_pengajuans TO barang_permintaan');

        // Recreate FKs with new table names
        DB::statement('ALTER TABLE barang_pengadaan ADD CONSTRAINT barang_pengadaan_pembelian_id_foreign FOREIGN KEY (pembelian_id) REFERENCES pengadaan(id) ON DELETE CASCADE');
        DB::statement('ALTER TABLE barang_permintaan ADD CONSTRAINT barang_permintaan_pengajuan_id_foreign FOREIGN KEY (pengajuan_id) REFERENCES permintaan(id) ON DELETE CASCADE');
    }

    public function down(): void
    {
        DB::statement('ALTER TABLE barang_pengadaan DROP FOREIGN KEY barang_pengadaan_pembelian_id_foreign');
        DB::statement('ALTER TABLE barang_permintaan DROP FOREIGN KEY barang_permintaan_pengajuan_id_foreign');

        DB::statement('RENAME TABLE pengadaan TO pembelians');
        DB::statement('RENAME TABLE barang_pengadaan TO barang__pembelians');
        DB::statement('RENAME TABLE permintaan TO pengajuans');
        DB::statement('RENAME TABLE barang_permintaan TO barang_pengajuans');

        DB::statement('ALTER TABLE barang__pembelians ADD CONSTRAINT barang__pembelians_pembelian_id_foreign FOREIGN KEY (pembelian_id) REFERENCES pembelians(id) ON DELETE CASCADE');
        DB::statement('ALTER TABLE barang_pengajuans ADD CONSTRAINT barang_pengajuans_pengajuan_id_foreign FOREIGN KEY (pengajuan_id) REFERENCES pengajuans(id) ON DELETE CASCADE');
    }
};
