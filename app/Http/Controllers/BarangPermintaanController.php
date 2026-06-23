<?php

namespace App\Http\Controllers;

use App\Http\Requests\BarangPermintaan\StoreRequest;
use App\Http\Requests\BarangPermintaan\UpdateRequest;
use App\Models\Barang_Permintaan;
use App\Models\Barangs;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class BarangPermintaanController extends Controller implements HasMiddleware
{
    public static function middleware()
    {
        return [
            new Middleware('permission:permintaan barang create', only: ['create', 'store']),
            new Middleware('permission:permintaan barang edit', only: ['edit', 'update']),
            new Middleware('permission:permintaan barang delete', only: ['destroy']),
        ];
    }

    public function create(string $permintaan_id)
    {
        $existingBarangIds = Barang_Permintaan::where('permintaan_id', $permintaan_id)->pluck('barang_id');

        $barangs = Barangs::with('tipeBarang:id,nama_tipe')
            ->whereNotIn('id', $existingBarangIds)
            ->orderBy('nama_barang')
            ->get(['id', 'nama_barang', 'satuan', 'tipe_barang_id']);

        return Inertia::render('permintaan/barangs/create', [
            'permintaan_id' => $permintaan_id,
            'barangs'       => $barangs,
        ]);
    }

    public function store(string $permintaan_id, StoreRequest $request)
    {
        DB::transaction(function () use ($permintaan_id, $request) {
            foreach ($request->validated('items') as $item) {
                Barang_Permintaan::create([
                    'permintaan_id' => $permintaan_id,
                    'barang_id'     => $item['barang_id'],
                    'jumlah'        => $item['jumlah'],
                ]);
            }
        });

        return redirect()->route('permintaan.show', $permintaan_id)->with('success', 'Barang permintaan berhasil ditambahkan.');
    }

    public function edit(string $permintaan_id, string $barang_Permintaan_id)
    {
        $barang_Permintaan = Barang_Permintaan::findOrFail($barang_Permintaan_id);

        $barangs = Barangs::with('tipeBarang:id,nama_tipe')
            ->orderBy('nama_barang')
            ->get(['id', 'nama_barang', 'satuan', 'tipe_barang_id']);

        return Inertia::render('permintaan/barangs/edit', [
            'permintaan_id'      => $permintaan_id,
            'barang_permintaan'  => $barang_Permintaan,
            'barangs'            => $barangs,
        ]);
    }

    public function update(string $permintaan_id, string $barang_Permintaan_id, UpdateRequest $request)
    {
        $barang_Permintaan = Barang_Permintaan::findOrFail($barang_Permintaan_id);
        $barang_Permintaan->update($request->validated());

        return redirect()->route('permintaan.show', $permintaan_id)->with('success', 'Barang permintaan berhasil diperbarui.');
    }

    public function destroy(string $permintaan_id, string $barang_Permintaan_id)
    {
        Barang_Permintaan::findOrFail($barang_Permintaan_id)->delete();

        return redirect()->route('permintaan.show', $permintaan_id)->with('success', 'Barang permintaan berhasil dihapus.');
    }
}
