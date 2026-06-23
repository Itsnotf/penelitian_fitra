<?php

namespace App\Http\Controllers;

use App\Http\Requests\BarangPengadaan\StoreRequest;
use App\Http\Requests\BarangPengadaan\UpdateRequest;
use App\Models\Barang_Pengadaan;
use App\Models\Barangs;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class BarangPengadaanController extends Controller implements HasMiddleware
{
    public static function middleware()
    {
        return [
            new Middleware('permission:pengadaan barang create', only: ['create', 'store']),
            new Middleware('permission:pengadaan barang edit', only: ['edit', 'update']),
            new Middleware('permission:pengadaan barang delete', only: ['destroy']),
        ];
    }

    public function create(string $pengadaan_id)
    {
        $existingBarangIds = Barang_Pengadaan::where('pengadaan_id', $pengadaan_id)->pluck('barang_id');

        $barangs = Barangs::with('tipeBarang:id,nama_tipe')
            ->whereNotIn('id', $existingBarangIds)
            ->orderBy('nama_barang')
            ->get(['id', 'nama_barang', 'satuan', 'tipe_barang_id']);

        return Inertia::render('pengadaan/barangs/create', [
            'pengadaan_id' => $pengadaan_id,
            'barangs'      => $barangs,
        ]);
    }

    public function store(string $pengadaan_id, StoreRequest $request)
    {
        DB::transaction(function () use ($pengadaan_id, $request) {
            foreach ($request->validated('items') as $item) {
                Barang_Pengadaan::create([
                    'pengadaan_id' => $pengadaan_id,
                    'barang_id'    => $item['barang_id'],
                    'jumlah'       => $item['jumlah'],
                    'harga'        => $item['harga'],
                ]);
            }
        });

        return redirect()->route('pengadaan.show', $pengadaan_id)->with('success', 'Barang pengadaan berhasil ditambahkan.');
    }

    public function edit(string $pengadaan_id, string $barang_Pengadaan_id)
    {
        $barang_Pengadaan = Barang_Pengadaan::findOrFail($barang_Pengadaan_id);

        $barangs = Barangs::with('tipeBarang:id,nama_tipe')
            ->orderBy('nama_barang')
            ->get(['id', 'nama_barang', 'satuan', 'tipe_barang_id']);

        return Inertia::render('pengadaan/barangs/edit', [
            'pengadaan_id'      => $pengadaan_id,
            'barang_pengadaan'  => $barang_Pengadaan,
            'barangs'           => $barangs,
        ]);
    }

    public function update(string $pengadaan_id, string $barang_Pengadaan_id, UpdateRequest $request)
    {
        $barang_Pengadaan = Barang_Pengadaan::findOrFail($barang_Pengadaan_id);
        $barang_Pengadaan->update($request->validated());

        return redirect()->route('pengadaan.show', $pengadaan_id)->with('success', 'Barang pengadaan berhasil diperbarui.');
    }

    public function destroy(string $pengadaan_id, string $barang_Pengadaan_id)
    {
        Barang_Pengadaan::findOrFail($barang_Pengadaan_id)->delete();

        return redirect()->route('pengadaan.show', $pengadaan_id)->with('success', 'Barang pengadaan berhasil dihapus.');
    }
}
