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

    public function barang_pengajuans()
    {
        return $this->hasMany(Barang_Pengajuan::class);
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
