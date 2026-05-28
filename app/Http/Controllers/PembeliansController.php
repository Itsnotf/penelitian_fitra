<?php

namespace App\Http\Controllers;

use App\Models\BarangVendor;
use App\Models\Pembelians;
use App\Models\Vendor;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PembeliansController extends Controller implements HasMiddleware
{
    public static function middleware()
    {
        return [
            new Middleware('permission:pembelians index', only: ['index']),
            new Middleware('permission:pembelians create', only: ['create', 'store']),
            new Middleware('permission:pembelians show', only: ['show']),
            new Middleware('permission:pembelians edit', only: ['edit', 'update']),
            new Middleware('permission:pembelians delete', only: ['destroy']),
            new Middleware('permission:pembelians change status', only: ['changeStatus']),
            new Middleware('permission:pembelians show', only: ['downloadPdf']),
        ];
    }

    public function index(Request $request)
    {
        $pembelians = Pembelians::with('user', 'vendor')
            ->when($request->search, fn($q, $s) => $q
                ->whereHas('vendor', fn($v) => $v->where('nama_vendor', 'like', "%{$s}%"))
                ->orWhere('deskripsi', 'like', "%{$s}%"))
            ->latest()
            ->paginate(8)
            ->withQueryString();

        return Inertia::render('pembelians/index', [
            'pembelians' => $pembelians,
            'filters'    => $request->only('search'),
            'flash'      => ['success' => session('success'), 'error' => session('error')],
        ]);
    }

    public function create()
    {
        $vendors = Vendor::all(['id', 'nama_vendor']);
        return Inertia::render('pembelians/create', ['vendors' => $vendors]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'vendor_id' => 'nullable|exists:vendors,id',
            'deskripsi' => 'required|string|max:255',
            'dokumen'   => 'nullable|file|mimes:pdf,doc,docx,jpg,jpeg,png,gif|max:5120',
        ]);

        $data = array_merge($validated, [
            'user_id'     => Auth::id(),
            'status'      => 'pending',
            'total_harga' => 0,
        ]);

        if ($request->hasFile('dokumen')) {
            $data['dokumen'] = $request->file('dokumen')->store('pembelians', 'public');
        }

        Pembelians::create($data);

        return redirect()->route('pembelians.index')->with('success', 'Pembelian berhasil dibuat.');
    }

    public function show(string $pembelian_id, Request $request)
    {
        $barangs = \App\Models\Barang_Pembelian::with('barang', 'pembelian')
            ->when($request->search, function ($q, $s) {
                $q->whereHas('barang', fn($b) => $b->where('nama_barang', 'like', "%{$s}%"));
            })
            ->where('pembelian_id', $pembelian_id)
            ->paginate(8)
            ->withQueryString();

        $pembelian = Pembelians::with('vendor')->findOrFail($pembelian_id);

        return Inertia::render('pembelians/barangs/index', [
            'barangs'   => $barangs,
            'pembelian' => $pembelian,
            'filters'   => $request->only('search'),
            'flash'     => ['success' => session('success')],
        ]);
    }

    public function edit(string $id)
    {
        $pembelian = Pembelians::findOrFail($id);
        $vendors   = Vendor::all(['id', 'nama_vendor']);

        return Inertia::render('pembelians/edit', [
            'pembelian' => $pembelian,
            'vendors'   => $vendors,
        ]);
    }

    public function update(Request $request, string $id)
    {
        $pembelian = Pembelians::findOrFail($id);

        $validated = $request->validate([
            'vendor_id' => 'nullable|exists:vendors,id',
            'deskripsi' => 'required|string|max:255',
            'dokumen'   => 'nullable|file|mimes:pdf,doc,docx,jpg,jpeg,png,gif|max:5120',
        ]);

        if ($request->hasFile('dokumen')) {
            if ($pembelian->dokumen && Storage::disk('public')->exists($pembelian->dokumen)) {
                Storage::disk('public')->delete($pembelian->dokumen);
            }
            $validated['dokumen'] = $request->file('dokumen')->store('pembelians', 'public');
        }

        $vendorChanged = isset($validated['vendor_id']) && $validated['vendor_id'] != $pembelian->vendor_id;

        $pembelian->update(array_filter($validated, fn($v) => $v !== null || array_key_exists('vendor_id', $validated)));

        if ($vendorChanged && $validated['vendor_id']) {
            $this->syncHargaFromVendor($pembelian->fresh());
        }

        return redirect()->route('pembelians.index')->with('success', 'Pembelian berhasil diperbarui.');
    }

    private function syncHargaFromVendor(Pembelians $pembelian): void
    {
        foreach ($pembelian->barang_pembelians as $bp) {
            $vendorBarang = BarangVendor::where('vendor_id', $pembelian->vendor_id)
                ->where('barang_id', $bp->barang_id)
                ->first();

            if ($vendorBarang) {
                $bp->update(['harga' => $vendorBarang->harga]);
            }
        }
    }

    public function destroy(string $id)
    {
        Pembelians::findOrFail($id)->delete();

        return redirect()->route('pembelians.index')->with('success', 'Pembelian berhasil dihapus.');
    }

    public function changeStatus(string $id)
    {
        $pembelian = Pembelians::findOrFail($id);

        if ($pembelian->status === 'selesai') {
            return redirect()->route('pembelians.index')
                ->with('error', 'Status selesai tidak dapat diubah.');
        }

        $newStatus = $pembelian->status === 'pending' ? 'proses' : 'selesai';
        $pembelian->status = $newStatus;
        $pembelian->save();

        $msg = $newStatus === 'proses' ? 'Pembelian ditandai sedang diproses.' : 'Pembelian ditandai selesai.';

        return redirect()->route('pembelians.index')->with('success', $msg);
    }

    public function downloadPdf(string $id)
    {
        $pembelian = Pembelians::with('barang_pembelians.barang', 'user', 'vendor')->findOrFail($id);
        $html      = view('pdf.pembelian', ['pembelian' => $pembelian])->render();

        $pdf = Pdf::loadHTML($html);
        $pdf->setPaper('A4', 'portrait');

        return $pdf->download("Laporan-Pembelian-{$pembelian->id}.pdf");
    }
}
