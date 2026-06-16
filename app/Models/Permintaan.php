<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Permintaan extends Model
{
    protected $table = 'permintaan';
    protected $guarded = ['id'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function barang_permintaan()
    {
        return $this->hasMany(Barang_Permintaan::class, 'pengajuan_id');
    }

    public function pengadaan()
    {
        return $this->hasMany(Pengadaan::class, 'pengajuan_id');
    }

    public function prosesApprove(): void
    {
        if ($this->urgensi === 'mendesak') {
            $this->status = 'proses';
            $this->save();
            $this->recheckMendesakStock();
        } else {
            $this->barang_permintaan()->each(function ($bp) {
                DB::table('barangs')
                    ->where('id', $bp->barang_id)
                    ->increment('jumlah_permintaan', (int) $bp->jumlah);
            });
            $this->status = 'proses';
            $this->save();
        }
    }

    public function isStockSufficient(): bool
    {
        $barangPermintaan = DB::table('barang_permintaan')
            ->where('pengajuan_id', $this->id)
            ->get();

        foreach ($barangPermintaan as $bp) {
            $stockTersedia = DB::table('barangs')->where('id', $bp->barang_id)->value('stock_tersedia');
            if ($stockTersedia === null || $stockTersedia < (int) $bp->jumlah) {
                return false;
            }
        }
        return true;
    }

    public function finalizeSelesai(): void
    {
        $barangPermintaan = DB::table('barang_permintaan')
            ->where('pengajuan_id', $this->id)
            ->get();

        foreach ($barangPermintaan as $bp) {
            $updates = [
                'stock_keluar'   => DB::raw('stock_keluar + ' . (int) $bp->jumlah),
                'stock_tersedia' => DB::raw('stock_tersedia - ' . (int) $bp->jumlah),
            ];

            if ($this->urgensi === 'normal') {
                $updates['jumlah_permintaan'] = DB::raw('GREATEST(0, jumlah_permintaan - ' . (int) $bp->jumlah . ')');
            }

            DB::table('barangs')->where('id', $bp->barang_id)->update($updates);
        }

        DB::table('permintaan')->where('id', $this->id)->update(['status' => 'selesai']);
    }

    public function createDeficitPengadaan(): void
    {
        $barangPermintaan = DB::table('barang_permintaan')
            ->where('pengajuan_id', $this->id)
            ->get();

        $deficitItems = [];
        foreach ($barangPermintaan as $bp) {
            $stockTersedia = (int) DB::table('barangs')->where('id', $bp->barang_id)->value('stock_tersedia');
            $deficit = (int) $bp->jumlah - $stockTersedia;
            if ($deficit > 0) {
                $deficitItems[] = ['barang_id' => $bp->barang_id, 'jumlah' => $deficit];
            }
        }

        if (empty($deficitItems)) return;

        $pengadaan = Pengadaan::create([
            'user_id'      => $this->user_id,
            'pengajuan_id' => $this->id,
            'total_harga'  => 0,
            'deskripsi'    => "Auto: Permintaan Mendesak #{$this->id}",
            'status'       => 'pending',
        ]);

        foreach ($deficitItems as $item) {
            $pengadaan->barang_pengadaan()->create([
                'barang_id' => $item['barang_id'],
                'jumlah'    => $item['jumlah'],
                'harga'     => 0,
            ]);
        }
    }

    public function recheckMendesakStock(): void
    {
        if ($this->status !== 'proses' || $this->urgensi !== 'mendesak') return;

        if ($this->isStockSufficient()) {
            $this->finalizeSelesai();
        } else {
            $this->createDeficitPengadaan();
        }
    }
}
