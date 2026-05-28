<?php

namespace App\Http\Controllers;

use App\Models\Barang_Pembelian;
use App\Models\BarangVendor;
use App\Models\Barangs;
use App\Models\Pembelians;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Inertia\Inertia;

class BarangPembelianController extends Controller implements HasMiddleware
{
    public static function middleware()
    {
        return [
            new Middleware('permission:pembelians barang create', only: ['create', 'store']),
            new Middleware('permission:pembelians barang edit', only: ['edit', 'update']),
            new Middleware('permission:pembelians barang delete', only: ['destroy']),
        ];
    }

    public function create(string $pembelian_id)
    {
        $pembelian = Pembelians::findOrFail($pembelian_id);

        if ($pembelian->status === 'selesai') {
            return redirect()->route('pembelians.show', $pembelian_id)
                ->with('error', 'Tidak dapat menambah barang ke pembelian yang sudah selesai.');
        }

        $barangs = Barangs::all(['id', 'nama_barang', 'satuan', 'tipe']);

        $vendorPrices = $pembelian->vendor_id
            ? BarangVendor::where('vendor_id', $pembelian->vendor_id)
                ->get(['barang_id', 'harga'])
                ->keyBy('barang_id')
                ->map(fn($bv) => $bv->harga)
            : collect();

        return Inertia::render('pembelians/barangs/create', [
            'pembelian_id' => $pembelian_id,
            'pembelian'    => $pembelian,
            'barangs'      => $barangs,
            'vendorPrices' => $vendorPrices,
        ]);
    }

    public function store(string $pembelian_id, Request $request)
    {
        $pembelian = Pembelians::findOrFail($pembelian_id);

        if ($pembelian->status === 'selesai') {
            return redirect()->route('pembelians.show', $pembelian_id)
                ->with('error', 'Tidak dapat menambah barang ke pembelian yang sudah selesai.');
        }

        $validated = $request->validate([
            'barang_id' => 'required|exists:barangs,id',
            'harga'     => 'required|integer|min:0',
            'jumlah'    => 'required|integer|min:1',
        ]);

        $validated['pembelian_id'] = $pembelian_id;
        Barang_Pembelian::create($validated);

        return redirect()->route('pembelians.show', $pembelian_id)
            ->with('success', 'Barang berhasil ditambahkan ke pembelian.');
    }

    public function edit(string $pembelian_id, string $barang_Pembelian_id)
    {
        $pembelian       = Pembelians::findOrFail($pembelian_id);
        $barangPembelian = Barang_Pembelian::findOrFail($barang_Pembelian_id);

        if ($pembelian->status === 'selesai') {
            return redirect()->route('pembelians.show', $pembelian_id)
                ->with('error', 'Tidak dapat mengedit barang pada pembelian yang sudah selesai.');
        }

        $barangs = Barangs::all(['id', 'nama_barang', 'satuan', 'tipe']);

        $vendorPrices = $pembelian->vendor_id
            ? BarangVendor::where('vendor_id', $pembelian->vendor_id)
                ->get(['barang_id', 'harga'])
                ->keyBy('barang_id')
                ->map(fn($bv) => $bv->harga)
            : collect();

        return Inertia::render('pembelians/barangs/edit', [
            'pembelian_id'     => $pembelian_id,
            'pembelian'        => $pembelian,
            'barang_pembelian' => $barangPembelian,
            'barangs'          => $barangs,
            'vendorPrices'     => $vendorPrices,
        ]);
    }

    public function update(string $pembelian_id, string $barang_Pembelian_id, Request $request)
    {
        $pembelian = Pembelians::findOrFail($pembelian_id);

        if ($pembelian->status === 'selesai') {
            return redirect()->route('pembelians.show', $pembelian_id)
                ->with('error', 'Tidak dapat mengedit barang pada pembelian yang sudah selesai.');
        }

        $barangPembelian = Barang_Pembelian::findOrFail($barang_Pembelian_id);

        $validated = $request->validate([
            'barang_id' => 'required|exists:barangs,id',
            'harga'     => 'required|integer|min:0',
            'jumlah'    => 'required|integer|min:1',
        ]);

        $barangPembelian->update($validated);

        return redirect()->route('pembelians.show', $pembelian_id)
            ->with('success', 'Barang pembelian berhasil diperbarui.');
    }

    public function destroy(string $pembelian_id, string $barang_Pembelian_id)
    {
        $pembelian = Pembelians::findOrFail($pembelian_id);

        if ($pembelian->status === 'selesai') {
            return redirect()->route('pembelians.show', $pembelian_id)
                ->with('error', 'Tidak dapat menghapus barang dari pembelian yang sudah selesai.');
        }

        Barang_Pembelian::findOrFail($barang_Pembelian_id)->delete();

        return redirect()->route('pembelians.show', $pembelian_id)
            ->with('success', 'Barang berhasil dihapus dari pembelian.');
    }
}
