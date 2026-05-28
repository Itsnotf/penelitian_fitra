<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pembelians', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('vendor_id')->nullable()->constrained('vendors')->nullOnDelete();
            $table->unsignedBigInteger('pengajuan_id')->nullable();
            $table->unsignedBigInteger('total_harga')->default(0);
            $table->string('deskripsi');
            $table->enum('status', ['pending', 'proses', 'selesai'])->default('pending');
            $table->string('dokumen')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pembelians');
    }
};
