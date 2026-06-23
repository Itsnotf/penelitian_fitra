<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('barangs', function (Blueprint $table) {
            $table->foreignId('tipe_barang_id')
                ->nullable()
                ->after('nama_barang')
                ->constrained('tipe_barangs')
                ->restrictOnDelete();

            $table->enum('jenis_barang', ['pendek', 'sedang', 'panjang'])
                ->nullable()
                ->after('tipe_barang_id');
        });
    }

    public function down(): void
    {
        Schema::table('barangs', function (Blueprint $table) {
            $table->dropConstrainedForeignId('tipe_barang_id');
            $table->dropColumn('jenis_barang');
        });
    }
};
