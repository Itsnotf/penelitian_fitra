<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Pembelians extends Model
{
    protected $guarded = ['id'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function vendor()
    {
        return $this->belongsTo(Vendor::class);
    }

    public function barang_pembelians()
    {
        return $this->hasMany(Barang_Pembelian::class, 'pembelian_id');
    }

    public function pengajuan()
    {
        return $this->belongsTo(Pengajuans::class, 'pengajuan_id');
    }

    protected static function booted(): void
    {
        static::updating(function ($pembelian) {
            if ($pembelian->isDirty('status') && $pembelian->status === 'selesai') {
                $pembelian->addStockMasuk();
            }
        });

        static::updated(function ($pembelian) {
            if ($pembelian->getOriginal('status') !== 'selesai' &&
                $pembelian->status === 'selesai' &&
                $pembelian->pengajuan_id) {
                $pengajuan = Pengajuans::find($pembelian->pengajuan_id);
                if ($pengajuan) {
                    $pengajuan->recheckMendesakStock();
                }
            }
        });
    }

    public function addStockMasuk(): void
    {
        $this->barang_pembelians()->each(function ($bp) {
            DB::table('barangs')
                ->where('id', $bp->barang_id)
                ->update([
                    'stock_masuk'    => DB::raw('stock_masuk + ' . (int) $bp->jumlah),
                    'stock_tersedia' => DB::raw('stock_tersedia + ' . (int) $bp->jumlah),
                ]);
        });
    }
}
