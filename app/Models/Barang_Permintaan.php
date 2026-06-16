<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Barang_Permintaan extends Model
{
    protected $table = 'barang_permintaan';
    protected $guarded = ['id'];

    public function permintaan()
    {
        return $this->belongsTo(Permintaan::class, 'pengajuan_id');
    }

    public function barang()
    {
        return $this->belongsTo(Barangs::class);
    }
}
