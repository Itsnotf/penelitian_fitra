<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BarangVendor extends Model
{
    protected $table = 'barang_vendor';
    protected $guarded = ['id'];

    protected $casts = [
        'terakhir_update_harga' => 'datetime',
        'harga' => 'integer',
    ];

    public function vendor()
    {
        return $this->belongsTo(Vendor::class);
    }

    public function barang()
    {
        return $this->belongsTo(Barangs::class, 'barang_id');
    }

    protected static function booted(): void
    {
        static::saving(function ($barangVendor) {
            if ($barangVendor->isDirty('harga')) {
                $barangVendor->terakhir_update_harga = now();
            }
        });
    }
}
