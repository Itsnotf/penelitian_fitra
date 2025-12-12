<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pengajuans extends Model
{
    protected $guarded = ['id'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function barang_pengajuans()
    {
        return $this->hasMany(Barang_Pengajuan::class, 'pengajuan_id');
    }

    protected static function booted(): void
    {
        static::updating(function ($pengajuan) {
            // Jika status berubah dari pending ke approved
            if ($pengajuan->isDirty('status') && 
                $pengajuan->getOriginal('status') === 'pending' && 
                $pengajuan->status === 'approved') {
                
                // Kurangi stock_tersedia untuk semua barang
                $pengajuan->reduceStockKeluar();
            }
        });
    }

    /**
     * Kurangi stock_keluar saat pengajuan disetujui
     */
    public function reduceStockKeluar(): void
    {
        $this->barang_pengajuans()->each(function ($barangPengajuan) {
            $barang = $barangPengajuan->barang;
            if ($barang) {
                $currentStockKeluar = (int) $barang->stock_keluar;
                $newStockKeluar = $currentStockKeluar + (int) $barangPengajuan->jumlah;
                
                // Update stock_keluar
                $barang->query()->where('id', $barang->id)->update(['stock_keluar' => $newStockKeluar]);
                
                // Hitung ulang stock_tersedia
                $stockAwal = (int) $barang->stock_awal;
                $stockMasuk = (int) $barang->stock_masuk;
                $stockTersedia = $stockAwal + $stockMasuk - $newStockKeluar;
                
                // Update stock_tersedia
                $barang->query()->where('id', $barang->id)->update(['stock_tersedia' => $stockTersedia]);
            }
        });
    }
}
