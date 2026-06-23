<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vendor extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    public function barangVendors()
    {
        return $this->hasMany(BarangVendor::class);
    }

    public function barangs()
    {
        return $this->belongsToMany(Barangs::class, 'barang_vendor', 'vendor_id', 'barang_id')
            ->withPivot('harga', 'terakhir_update_harga')
            ->withTimestamps();
    }

    public function pengadaan()
    {
        return $this->hasMany(Pengadaan::class);
    }
}
