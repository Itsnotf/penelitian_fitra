<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('barang__pembelians', function (Blueprint $table) {
            $table->unsignedBigInteger('harga')->change();
            $table->unsignedInteger('jumlah')->change();
        });
    }

    public function down(): void
    {
        Schema::table('barang__pembelians', function (Blueprint $table) {
            $table->string('harga')->change();
            $table->string('jumlah')->change();
        });
    }
};
