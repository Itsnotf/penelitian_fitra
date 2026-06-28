<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (DB::connection()->getDriverName() === 'mysql') {
            DB::statement("UPDATE barangs SET jenis_barang = NULL WHERE jenis_barang IN ('pendek','sedang','panjang')");
            DB::statement("ALTER TABLE barangs MODIFY COLUMN jenis_barang ENUM('habis_pakai','tidak_habis_pakai') NULL");
        } else {
            Schema::table('barangs', function (Blueprint $table) {
                $table->dropColumn('jenis_barang');
            });
            Schema::table('barangs', function (Blueprint $table) {
                $table->enum('jenis_barang', ['habis_pakai', 'tidak_habis_pakai'])->nullable()->after('tipe_barang_id');
            });
        }
    }

    public function down(): void
    {
        if (DB::connection()->getDriverName() === 'mysql') {
            DB::statement("UPDATE barangs SET jenis_barang = NULL WHERE jenis_barang IN ('habis_pakai','tidak_habis_pakai')");
            DB::statement("ALTER TABLE barangs MODIFY COLUMN jenis_barang ENUM('pendek','sedang','panjang') NULL");
        } else {
            Schema::table('barangs', function (Blueprint $table) {
                $table->dropColumn('jenis_barang');
            });
            Schema::table('barangs', function (Blueprint $table) {
                $table->enum('jenis_barang', ['pendek', 'sedang', 'panjang'])->nullable()->after('tipe_barang_id');
            });
        }
    }
};
