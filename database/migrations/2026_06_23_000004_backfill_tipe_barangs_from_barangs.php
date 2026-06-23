<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * Backfill data lama: kolom `tipe` (string bebas) di tabel barangs dipetakan
 * ke baris baru di tabel master `tipe_barangs`, lalu `tipe_barang_id` diisi.
 *
 * Dua nilai legacy yang sebelumnya hardcode di form ("ATK", "ELEKTRONIK")
 * dipetakan ke nama yang lebih deskriptif. Nilai lain (kalau ada di data
 * produksi) tetap dibawa apa adanya (di-trim saja) supaya tidak ada data
 * yang hilang/tertukar.
 */
return new class extends Migration
{
    private array $knownLabels = [
        'ATK'        => 'Alat Tulis Kantor',
        'ELEKTRONIK' => 'Elektronik',
    ];

    public function up(): void
    {
        $distinctTipe = DB::table('barangs')
            ->whereNotNull('tipe')
            ->where('tipe', '!=', '')
            ->distinct()
            ->pluck('tipe');

        foreach ($distinctTipe as $tipeLama) {
            $namaTipe = $this->knownLabels[$tipeLama] ?? trim($tipeLama);

            if ($namaTipe === '') {
                continue;
            }

            $tipeBarangId = DB::table('tipe_barangs')->where('nama_tipe', $namaTipe)->value('id');

            if (! $tipeBarangId) {
                $tipeBarangId = DB::table('tipe_barangs')->insertGetId([
                    'nama_tipe'  => $namaTipe,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            DB::table('barangs')->where('tipe', $tipeLama)->update(['tipe_barang_id' => $tipeBarangId]);
        }
    }

    public function down(): void
    {
        // Kolom `tipe` (string) lama masih ada sampai migration drop-kolom
        // berikutnya dijalankan, jadi data asli tidak pernah hilang di sini.
        DB::table('barangs')->update(['tipe_barang_id' => null]);
        DB::table('tipe_barangs')->truncate();
    }
};
