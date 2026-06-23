<?php

namespace App\Http\Controllers;

use App\Models\BarangVendor;
use App\Models\Barangs;
use App\Models\Pengadaan;
use App\Models\Vendor;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PengadaanController extends Controller implements HasMiddleware
{
    public static function middleware()
    {
        return [
            new Middleware('permission:pengadaan index', only: ['index']),
            new Middleware('permission:pengadaan create', only: ['create', 'store']),
            new Middleware('permission:pengadaan show', only: ['show']),
            new Middleware('permission:pengadaan edit', only: ['edit', 'update']),
            new Middleware('permission:pengadaan delete', only: ['destroy']),
            new Middleware('permission:pengadaan change status', only: ['changeStatus']),
            new Middleware('permission:pengadaan show', only: ['downloadPdf']),
        ];
    }

    public function index(Request $request)
    {
        $pengadaan = Pengadaan::with('user', 'vendor')
            ->when($request->search, fn($q, $s) => $q
                ->whereHas('vendor', fn($v) => $v->where('nama_vendor', 'like', "%{$s}%"))
                ->orWhere('deskripsi', 'like', "%{$s}%"))
            ->latest()
            ->paginate(8)
            ->withQueryString();

        return Inertia::render('pengadaan/index', [
            'pengadaan' => $pengadaan,
            'filters'   => $request->only('search'),
            'flash'     => ['success' => session('success'), 'error' => session('error')],
        ]);
    }

    public function create()
    {
        $vendors = Vendor::orderBy('nama_vendor')->get(['id', 'nama_vendor']);
        $barangs = Barangs::with('tipeBarang:id,nama_tipe')
            ->orderBy('nama_barang')
            ->get(['id', 'nama_barang', 'satuan', 'tipe_barang_id']);

        $allVendorPrices = BarangVendor::all(['vendor_id', 'barang_id', 'harga'])
            ->groupBy('vendor_id')
            ->map(fn($items) => $items->keyBy('barang_id')->map(fn($bv) => $bv->harga));

        return Inertia::render('pengadaan/create', [
            'vendors'         => $vendors,
            'barangs'         => $barangs,
            'allVendorPrices' => $allVendorPrices,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'vendor_id'         => 'nullable|exists:vendors,id',
            'deskripsi'         => 'required|string|max:255',
            'dokumen'           => 'nullable|file|mimes:pdf,doc,docx,jpg,jpeg,png,gif|max:5120',
            'items'             => 'required|array|min:1',
            'items.*.barang_id' => 'required|exists:barangs,id',
            'items.*.jumlah'    => 'required|integer|min:1',
            'items.*.harga'     => 'required|integer|min:0',
        ], [
            'items.required'             => 'Minimal tambahkan 1 barang.',
            'items.min'                  => 'Minimal tambahkan 1 barang.',
            'items.*.barang_id.required' => 'Pilih barang.',
            'items.*.jumlah.required'    => 'Jumlah wajib diisi.',
            'items.*.jumlah.min'         => 'Jumlah minimal 1.',
            'items.*.harga.required'     => 'Harga wajib diisi.',
            'items.*.harga.min'          => 'Harga tidak boleh negatif.',
        ]);

        \Illuminate\Support\Facades\DB::transaction(function () use ($request, $validated) {
            $pengadaanData = [
                'user_id'     => Auth::id(),
                'vendor_id'   => $validated['vendor_id'] ?? null,
                'status'      => 'pending',
                'total_harga' => 0,
                'deskripsi'   => $validated['deskripsi'],
            ];

            if ($request->hasFile('dokumen')) {
                $pengadaanData['dokumen'] = $request->file('dokumen')->store('pengadaan', 'public');
            }

            $pengadaan = Pengadaan::create($pengadaanData);

            foreach ($validated['items'] as $item) {
                $pengadaan->barang_pengadaan()->create([
                    'barang_id' => $item['barang_id'],
                    'jumlah'    => $item['jumlah'],
                    'harga'     => $item['harga'],
                ]);
            }
        });

        return redirect()->route('pengadaan.index')->with('success', 'Pengadaan berhasil dibuat.');
    }

    public function show(string $pengadaan_id, Request $request)
    {
        $barangs = \App\Models\Barang_Pengadaan::with('barang', 'pengadaan')
            ->when($request->search, function ($q, $s) {
                $q->whereHas('barang', fn($b) => $b->where('nama_barang', 'like', "%{$s}%"));
            })
            ->where('pengadaan_id', $pengadaan_id)
            ->paginate(8)
            ->withQueryString();

        $pengadaan = Pengadaan::with('vendor')->findOrFail($pengadaan_id);

        return Inertia::render('pengadaan/barangs/index', [
            'barangs'   => $barangs,
            'pengadaan' => $pengadaan,
            'filters'   => $request->only('search'),
            'flash'     => ['success' => session('success')],
        ]);
    }

    public function edit(string $id)
    {
        $pengadaan = Pengadaan::findOrFail($id);
        $vendors   = Vendor::all(['id', 'nama_vendor']);

        return Inertia::render('pengadaan/edit', [
            'pengadaan' => $pengadaan,
            'vendors'   => $vendors,
        ]);
    }

    public function update(Request $request, string $id)
    {
        $pengadaan = Pengadaan::findOrFail($id);

        $validated = $request->validate([
            'vendor_id' => 'nullable|exists:vendors,id',
            'deskripsi' => 'required|string|max:255',
            'dokumen'   => 'nullable|file|mimes:pdf,doc,docx,jpg,jpeg,png,gif|max:5120',
        ]);

        if ($request->hasFile('dokumen')) {
            if ($pengadaan->dokumen && Storage::disk('public')->exists($pengadaan->dokumen)) {
                Storage::disk('public')->delete($pengadaan->dokumen);
            }
            $validated['dokumen'] = $request->file('dokumen')->store('pengadaan', 'public');
        }

        $vendorChanged = isset($validated['vendor_id']) && $validated['vendor_id'] != $pengadaan->vendor_id;

        $pengadaan->update(array_filter($validated, fn($v) => $v !== null || array_key_exists('vendor_id', $validated)));

        if ($vendorChanged && $validated['vendor_id']) {
            $this->syncHargaFromVendor($pengadaan->fresh());
        }

        return redirect()->route('pengadaan.index')->with('success', 'Pengadaan berhasil diperbarui.');
    }

    private function syncHargaFromVendor(Pengadaan $pengadaan): void
    {
        foreach ($pengadaan->barang_pengadaan as $bp) {
            $vendorBarang = BarangVendor::where('vendor_id', $pengadaan->vendor_id)
                ->where('barang_id', $bp->barang_id)
                ->first();

            if ($vendorBarang) {
                $bp->update(['harga' => $vendorBarang->harga]);
            }
        }
    }

    public function destroy(string $id)
    {
        Pengadaan::findOrFail($id)->delete();

        return redirect()->route('pengadaan.index')->with('success', 'Pengadaan berhasil dihapus.');
    }

    public function changeStatus(string $id)
    {
        $pengadaan = Pengadaan::findOrFail($id);

        if ($pengadaan->status === 'selesai') {
            return redirect()->route('pengadaan.index')
                ->with('error', 'Status selesai tidak dapat diubah.');
        }

        $newStatus = $pengadaan->status === 'pending' ? 'proses' : 'selesai';
        $pengadaan->status = $newStatus;
        $pengadaan->save();

        $msg = $newStatus === 'proses' ? 'Pengadaan ditandai sedang diproses.' : 'Pengadaan ditandai selesai.';

        return redirect()->route('pengadaan.index')->with('success', $msg);
    }

    public function downloadPdf(string $id)
    {
        $pengadaan = Pengadaan::with('barang_pengadaan.barang.tipeBarang', 'user', 'vendor')->findOrFail($id);
        $html      = view('pdf.pengadaan', ['pengadaan' => $pengadaan])->render();

        $pdf = Pdf::loadHTML($html);
        $pdf->setPaper('A4', 'portrait');

        return $pdf->download("Laporan-Pengadaan-{$pengadaan->id}.pdf");
    }
}
