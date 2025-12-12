<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pembelians extends Model
{
    protected $guarded = ['id'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function barang_pembelians()
    {
        return $this->hasMany(Barang_Pembelian::class, 'pembelian_id');
    }

    protected static function booted(): void
    {
        static::updating(function ($pembelian) {
            // Jika status berubah dari pending ke finished
            if ($pembelian->isDirty('status') && 
                $pembelian->getOriginal('status') === 'pending' && 
                $pembelian->status === 'finished') {
                
                // Update stock_masuk untuk semua barang
                $pembelian->addStockMasuk();
            }
        });
    }

    /**
     * Tambah stock_masuk ke semua barang saat pembelian selesai
     */
    public function addStockMasuk(): void
    {
        $this->barang_pembelians()->each(function ($barangPembelian) {
            $barang = $barangPembelian->barang;
            if ($barang) {
                $currentStockMasuk = (int) $barang->stock_masuk;
                $newStockMasuk = $currentStockMasuk + (int) $barangPembelian->jumlah;
                
                // Update stock_masuk
                $barang->query()->where('id', $barang->id)->update(['stock_masuk' => $newStockMasuk]);
                
                // Hitung ulang stock_tersedia
                $stockAwal = (int) $barang->stock_awal;
                $stockKeluar = (int) $barang->stock_keluar;
                $stockTersedia = $stockAwal + $newStockMasuk - $stockKeluar;
                
                // Update stock_tersedia
                $barang->query()->where('id', $barang->id)->update(['stock_tersedia' => $stockTersedia]);
            }
        });
    }
}
