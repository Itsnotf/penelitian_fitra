<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Barang_Pengadaan extends Model
{
    protected $table = 'barang_pengadaan';
    protected $guarded = ['id'];

    public function pengadaan()
    {
        return $this->belongsTo(Pengadaan::class, 'pembelian_id');
    }

    public function barang()
    {
        return $this->belongsTo(Barangs::class);
    }

    protected static function booted(): void
    {
        static::created(function ($barangPengadaan) {
            $barangPengadaan->updatePengadaanTotal();
        });

        static::updated(function ($barangPengadaan) {
            $barangPengadaan->updatePengadaanTotal();
        });

        static::deleted(function ($barangPengadaan) {
            $barangPengadaan->updatePengadaanTotal();
        });
    }

    public function updatePengadaanTotal(): void
    {
        $pengadaan = $this->pengadaan;
        if ($pengadaan) {
            $total = $pengadaan->barang_pengadaan()
                ->get()
                ->sum(function ($item) {
                    return $item->harga * $item->jumlah;
                });

            $pengadaan->update(['total_harga' => $total]);
        }
    }
}
