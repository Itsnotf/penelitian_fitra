<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Barangs extends Model
{
    protected $guarded = ['id'];

    public function barang_pembelians()
    {
        return $this->hasMany(Barang_Pembelian::class);
    }

    protected static function booted(): void
    {
        static::updated(function ($barang) {
            // Setiap kali stock_masuk atau stock_keluar berubah, update stock_tersedia
            if ($barang->isDirty(['stock_masuk', 'stock_keluar'])) {
                $barang->updateStockTersedia();
            }
        });
    }

    /**
     * Hitung dan update stock_tersedia berdasarkan formula:
     * stock_tersedia = stock_awal + stock_masuk - stock_keluar
     */
    public function updateStockTersedia(): void
    {
        $stockAwal = (int) $this->stock_awal;
        $stockMasuk = (int) $this->stock_masuk;
        $stockKeluar = (int) $this->stock_keluar;
        
        $stockTersedia = $stockAwal + $stockMasuk - $stockKeluar;
        
        // Update langsung tanpa trigger event lagi untuk menghindari loop
        $this->query()->where('id', $this->id)->update(['stock_tersedia' => $stockTersedia]);
    }
}
