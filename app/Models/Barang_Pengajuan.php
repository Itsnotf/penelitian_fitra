<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Barang_Pengajuan extends Model
{
    protected $table = 'barang_pengajuans';
    protected $guarded = ['id'];

    public function pengajuan()
    {
        return $this->belongsTo(Pengajuans::class, 'pengajuan_id');
    }
    
    public function barang()
    {
        return $this->belongsTo(Barangs::class);
    }
}
