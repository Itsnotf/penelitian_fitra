<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * PENTING: jalankan migration ini HANYA setelah memverifikasi hasil backfill
 * pada 2026_06_23_000004 sudah benar (cek query di bawah). Migration ini
 * menghapus kolom `tipe` (string) lama secara permanen.
 */
return new class extends Migration
{
    public function up(): void
    {
        $belumTerklasifikasi = DB::table('barangs')->whereNull('tipe_barang_id')->count();

        if ($belumTerklasifikasi > 0) {
            throw new \RuntimeException(
                "Migration dibatalkan: masih ada {$belumTerklasifikasi} baris di tabel barangs yang belum " .
                "punya tipe_barang_id. Perbaiki data terlebih dahulu (cek hasil migration backfill " .
                "2026_06_23_000004) sebelum menjalankan migration ini."
            );
        }

        DB::statement('ALTER TABLE barangs MODIFY tipe_barang_id BIGINT UNSIGNED NOT NULL');

        Schema::table('barangs', function (Blueprint $table) {
            $table->dropColumn('tipe');
        });
    }

    public function down(): void
    {
        Schema::table('barangs', function (Blueprint $table) {
            $table->string('tipe')->nullable()->after('nama_barang');
        });

        DB::statement('
            UPDATE barangs
            JOIN tipe_barangs ON tipe_barangs.id = barangs.tipe_barang_id
            SET barangs.tipe = tipe_barangs.nama_tipe
        ');

        DB::statement('ALTER TABLE barangs MODIFY tipe_barang_id BIGINT UNSIGNED NULL');
    }
};
