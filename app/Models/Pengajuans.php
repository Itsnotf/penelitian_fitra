<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Pengajuans extends Model
{
    protected $guarded = ['id'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function barang_pengajuans()
    {
        return $this->hasMany(Barang_Pengajuan::class, 'pengajuan_id');
    }

    public function pembelians()
    {
        return $this->hasMany(Pembelians::class, 'pengajuan_id');
    }

    /**
     * Dipanggil saat status berubah pending → proses.
     * Mendesak: cek stock & auto-buat pembelian jika kurang.
     * Normal: tambah jumlah_permintaan ke barangs.
     */
    public function prosesApprove(): void
    {
        if ($this->urgensi === 'mendesak') {
            $this->status = 'proses';
            $this->save();
            $this->recheckMendesakStock();
        } else {
            $this->barang_pengajuans()->each(function ($bp) {
                DB::table('barangs')
                    ->where('id', $bp->barang_id)
                    ->increment('jumlah_permintaan', (int) $bp->jumlah);
            });
            $this->status = 'proses';
            $this->save();
        }
    }

    /**
     * Cek apakah stock tersedia mencukupi untuk semua barang pengajuan ini.
     */
    public function isStockSufficient(): bool
    {
        $barangPengajuans = DB::table('barang_pengajuans')
            ->where('pengajuan_id', $this->id)
            ->get();

        foreach ($barangPengajuans as $bp) {
            $stockTersedia = DB::table('barangs')->where('id', $bp->barang_id)->value('stock_tersedia');
            if ($stockTersedia === null || $stockTersedia < (int) $bp->jumlah) {
                return false;
            }
        }
        return true;
    }

    /**
     * Selesaikan pengajuan: kurangi stock, set status selesai.
     * Untuk urgensi normal, juga kurangi jumlah_permintaan.
     */
    public function finalizeSelesai(): void
    {
        $barangPengajuans = DB::table('barang_pengajuans')
            ->where('pengajuan_id', $this->id)
            ->get();

        foreach ($barangPengajuans as $bp) {
            $updates = [
                'stock_keluar'   => DB::raw('stock_keluar + ' . (int) $bp->jumlah),
                'stock_tersedia' => DB::raw('stock_tersedia - ' . (int) $bp->jumlah),
            ];

            if ($this->urgensi === 'normal') {
                $updates['jumlah_permintaan'] = DB::raw('GREATEST(0, jumlah_permintaan - ' . (int) $bp->jumlah . ')');
            }

            DB::table('barangs')->where('id', $bp->barang_id)->update($updates);
        }

        DB::table('pengajuans')->where('id', $this->id)->update(['status' => 'selesai']);
    }

    /**
     * Auto-buat pembelian untuk barang yang defisit (khusus mendesak).
     */
    public function createDeficitPembelian(): void
    {
        $barangPengajuans = DB::table('barang_pengajuans')
            ->where('pengajuan_id', $this->id)
            ->get();

        $deficitItems = [];
        foreach ($barangPengajuans as $bp) {
            $stockTersedia = (int) DB::table('barangs')->where('id', $bp->barang_id)->value('stock_tersedia');
            $deficit = (int) $bp->jumlah - $stockTersedia;
            if ($deficit > 0) {
                $deficitItems[] = ['barang_id' => $bp->barang_id, 'jumlah' => $deficit];
            }
        }

        if (empty($deficitItems)) return;

        $pembelian = Pembelians::create([
            'user_id'      => $this->user_id,
            'pengajuan_id' => $this->id,
            'total_harga'  => 0,
            'deskripsi'    => "Auto: Pengajuan Mendesak #{$this->id}",
            'status'       => 'pending',
        ]);

        foreach ($deficitItems as $item) {
            $pembelian->barang_pembelians()->create([
                'barang_id' => $item['barang_id'],
                'jumlah'    => $item['jumlah'],
                'harga'     => 0,
            ]);
        }
    }

    /**
     * Re-check stock untuk pengajuan mendesak.
     * Dipanggil saat status proses, dan setiap kali linked pembelian selesai.
     */
    public function recheckMendesakStock(): void
    {
        if ($this->status !== 'proses' || $this->urgensi !== 'mendesak') return;

        if ($this->isStockSufficient()) {
            $this->finalizeSelesai();
        } else {
            $this->createDeficitPembelian();
        }
    }
}
