<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('barangs', function (Blueprint $table) {
            $table->id();
            $table->string('nama_barang');
            $table->string('tipe');
            $table->string('satuan');
            $table->unsignedInteger('stock_awal')->default(0);
            $table->unsignedInteger('stock_masuk')->default(0);
            $table->unsignedInteger('stock_keluar')->default(0);
            $table->unsignedInteger('stock_tersedia')->default(0);
            $table->unsignedInteger('jumlah_permintaan')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('barangs');
    }
};
