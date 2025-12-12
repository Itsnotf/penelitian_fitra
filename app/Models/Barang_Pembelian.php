<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Barang_Pembelian extends Model
{
    protected $guarded = ['id'];

    public function pembelian()
    {
        return $this->belongsTo(Pembelians::class, 'pembelian_id');
    }
    
    public function barang()
    {
        return $this->belongsTo(Barangs::class);
    }

    protected static function booted(): void
    {
        static::created(function ($barangPembelian) {
            $barangPembelian->updatePembelianTotal();
        });

        static::updated(function ($barangPembelian) {
            $barangPembelian->updatePembelianTotal();
        });

        static::deleted(function ($barangPembelian) {
            $barangPembelian->updatePembelianTotal();
        });
    }

    public function updatePembelianTotal(): void
    {
        $pembelian = $this->pembelian;
        if ($pembelian) {
            $total = $pembelian->barang_pembelians()
                ->get()
                ->sum(function ($item) {
                    return $item->harga * $item->jumlah;
                });
            
            $pembelian->update(['total_harga' => $total]);
        }
    }
}
