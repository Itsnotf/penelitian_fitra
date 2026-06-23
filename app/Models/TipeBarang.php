<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TipeBarang extends Model
{
    use HasFactory;

    protected $table = 'tipe_barangs';
    protected $guarded = ['id'];

    public function barangs()
    {
        return $this->hasMany(Barangs::class, 'tipe_barang_id');
    }
}
