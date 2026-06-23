<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Barangs extends Model
{
    protected $guarded = ['id'];

    public function tipeBarang()
    {
        return $this->belongsTo(TipeBarang::class, 'tipe_barang_id');
    }

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

    /**
     * Filter gabungan yang dipakai bersama oleh halaman index dan unduh
     * laporan PDF, supaya keduanya selalu menampilkan data yang konsisten
     * dan logic filter tidak ditulis dua kali.
     *
     * @param array{search?: ?string, tipe_barang_id?: ?string, jenis_barang?: ?string, stok?: ?string} $params
     */
    public function scopeFiltered($query, array $params)
    {
        return $query
            ->when($params['search'] ?? null, fn($q, $s) => $q->where('nama_barang', 'like', "%{$s}%"))
            ->when($params['tipe_barang_id'] ?? null, fn($q, $v) => $q->where('tipe_barang_id', $v))
            ->when($params['jenis_barang'] ?? null, fn($q, $v) => $q->where('jenis_barang', $v))
            ->when(($params['stok'] ?? null) === 'rendah', fn($q) => $q->where('stock_tersedia', '<', 10)->where('stock_tersedia', '>', 0))
            ->when(($params['stok'] ?? null) === 'habis', fn($q) => $q->where('stock_tersedia', 0));
    }
}
