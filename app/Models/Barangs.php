<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Barangs extends Model
{
    protected $guarded = ['id'];

    public function barang_pengadaan()
    {
        return $this->hasMany(Barang_Pengadaan::class, 'barang_id');
    }

    public function barang_permintaan()
    {
        return $this->hasMany(Barang_Permintaan::class, 'barang_id');
    }

    public function barangVendors()
    {
        return $this->hasMany(BarangVendor::class, 'barang_id');
    }

    public function vendors()
    {
        return $this->belongsToMany(Vendor::class, 'barang_vendor', 'barang_id', 'vendor_id')
            ->withPivot('harga', 'terakhir_update_harga')
            ->withTimestamps();
    }
}
