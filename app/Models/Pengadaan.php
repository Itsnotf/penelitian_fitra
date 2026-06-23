<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Pengadaan extends Model
{
    protected $table = 'pengadaan';
    protected $guarded = ['id'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function vendor()
    {
        return $this->belongsTo(Vendor::class);
    }

    public function barang_pengadaan()
    {
        return $this->hasMany(Barang_Pengadaan::class, 'pengadaan_id');
    }

    public function permintaan()
    {
        return $this->belongsTo(Permintaan::class, 'permintaan_id');
    }

    protected static function booted(): void
    {
        static::updating(function ($pengadaan) {
            if ($pengadaan->isDirty('status') && $pengadaan->status === 'selesai') {
                $pengadaan->addStockMasuk();
            }
        });

        static::updated(function ($pengadaan) {
            if ($pengadaan->getOriginal('status') !== 'selesai' &&
                $pengadaan->status === 'selesai' &&
                $pengadaan->permintaan_id) {
                $permintaan = Permintaan::find($pengadaan->permintaan_id);
                if ($permintaan) {
                    $permintaan->recheckMendesakStock();
                }
            }
        });
    }

    public function addStockMasuk(): void
    {
        $this->barang_pengadaan()->each(function ($bp) {
            DB::table('barangs')
                ->where('id', $bp->barang_id)
                ->update([
                    'stock_masuk'    => DB::raw('stock_masuk + ' . (int) $bp->jumlah),
                    'stock_tersedia' => DB::raw('stock_tersedia + ' . (int) $bp->jumlah),
                ]);
        });
    }
}
