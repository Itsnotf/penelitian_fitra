<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('barang_vendor', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vendor_id')->constrained('vendors')->onDelete('cascade');
            $table->foreignId('barang_id')->constrained('barangs')->onDelete('cascade');
            $table->unsignedBigInteger('harga');
            $table->timestamp('terakhir_update_harga')->nullable();
            $table->timestamps();
            $table->unique(['vendor_id', 'barang_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('barang_vendor');
    }
};
