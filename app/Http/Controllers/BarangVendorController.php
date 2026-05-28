<?php

namespace App\Http\Controllers;

use App\Models\BarangVendor;
use App\Models\Barangs;
use App\Models\Vendor;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Inertia\Inertia;

class BarangVendorController extends Controller implements HasMiddleware
{
    public static function middleware()
    {
        return [
            new Middleware('permission:vendors barang create', only: ['create', 'store']),
            new Middleware('permission:vendors barang edit', only: ['edit', 'update']),
            new Middleware('permission:vendors barang delete', only: ['destroy']),
        ];
    }

    public function index(string $vendor_id, Request $request)
    {
        $vendor = Vendor::findOrFail($vendor_id);

        $barangVendors = BarangVendor::with('barang')
            ->where('vendor_id', $vendor_id)
            ->when($request->search, function ($q, $s) {
                $q->whereHas('barang', fn($b) => $b->where('nama_barang', 'like', "%{$s}%"));
            })
            ->paginate(8)
            ->withQueryString();

        return Inertia::render('vendors/barangs/index', [
            'vendor'        => $vendor,
            'barangVendors' => $barangVendors,
            'filters'       => $request->only('search'),
            'flash'         => ['success' => session('success')],
        ]);
    }

    public function create(string $vendor_id)
    {
        $vendor = Vendor::findOrFail($vendor_id);

        $existingBarangIds = BarangVendor::where('vendor_id', $vendor_id)->pluck('barang_id');
        $barangs = Barangs::whereNotIn('id', $existingBarangIds)->get(['id', 'nama_barang', 'satuan', 'tipe']);

        return Inertia::render('vendors/barangs/create', [
            'vendor'  => $vendor,
            'barangs' => $barangs,
        ]);
    }

    public function store(string $vendor_id, Request $request)
    {
        Vendor::findOrFail($vendor_id);

        $validated = $request->validate([
            'barang_id' => 'required|exists:barangs,id|unique:barang_vendor,barang_id,NULL,id,vendor_id,' . $vendor_id,
            'harga'     => 'required|integer|min:0',
        ]);

        BarangVendor::create([
            'vendor_id' => $vendor_id,
            'barang_id' => $validated['barang_id'],
            'harga'     => $validated['harga'],
        ]);

        return redirect()->route('vendors.barangs.index', $vendor_id)
            ->with('success', 'Barang berhasil ditambahkan ke vendor.');
    }

    public function edit(string $vendor_id, string $barang_vendor_id)
    {
        $vendor       = Vendor::findOrFail($vendor_id);
        $barangVendor = BarangVendor::with('barang')->findOrFail($barang_vendor_id);

        return Inertia::render('vendors/barangs/edit', [
            'vendor'       => $vendor,
            'barangVendor' => $barangVendor,
        ]);
    }

    public function update(string $vendor_id, string $barang_vendor_id, Request $request)
    {
        $barangVendor = BarangVendor::findOrFail($barang_vendor_id);

        $validated = $request->validate([
            'harga' => 'required|integer|min:0',
        ]);

        $barangVendor->update($validated);

        return redirect()->route('vendors.barangs.index', $vendor_id)
            ->with('success', 'Harga berhasil diperbarui.');
    }

    public function destroy(string $vendor_id, string $barang_vendor_id)
    {
        BarangVendor::findOrFail($barang_vendor_id)->delete();

        return redirect()->route('vendors.barangs.index', $vendor_id)
            ->with('success', 'Barang berhasil dihapus dari vendor.');
    }
}
