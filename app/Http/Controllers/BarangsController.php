<?php

namespace App\Http\Controllers;

use App\Http\Requests\Barang\StoreRequest;
use App\Http\Requests\Barang\UpdateRequest;
use App\Models\Barangs;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Inertia\Inertia;

class BarangsController extends Controller implements HasMiddleware
{
    public static function middleware()
    {
        return [
            new Middleware('permission:barangs index', only: ['index']),
            new Middleware('permission:barangs create', only: ['create', 'store']),
            new Middleware('permission:barangs edit', only: ['edit', 'update']),
            new Middleware('permission:barangs delete', only: ['destroy']),
            new Middleware('auth', only: ['downloadPdf']),
        ];
    }

    public function index(Request $request)
    {
        $barangs = Barangs::when($request->search, fn($q, $s) => $q->where('nama_barang', 'like', "%{$s}%"))
            ->paginate(8)
            ->withQueryString();

        $hasJumlahPermintaan = Barangs::where('jumlah_permintaan', '>', 0)->exists();
        $allStockSufficient  = !Barangs::where('jumlah_permintaan', '>', 0)
            ->whereColumn('stock_tersedia', '<', 'jumlah_permintaan')
            ->exists();

        return Inertia::render('barangs/index', [
            'barangs'             => $barangs,
            'filters'             => $request->only('search'),
            'hasJumlahPermintaan' => $hasJumlahPermintaan,
            'allStockSufficient'  => $allStockSufficient,
            'flash'               => ['success' => session('success'), 'error' => session('error')],
            'can'                 => [
                'approveAllNormal'     => $request->user()?->can('pengajuans approve all normal'),
                'buatPembelianSelisih' => $request->user()?->can('pengajuans buat pembelian selisih'),
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('barangs/create');
    }

    public function store(StoreRequest $request)
    {
        $data = $request->validated();
        $data['stock_tersedia'] = (int) $data['stock_awal'];
        $data['stock_masuk']    = 0;
        $data['stock_keluar']   = 0;

        Barangs::create($data);

        return redirect()->route('barangs.index')->with('success', 'Barang berhasil ditambahkan.');
    }

    public function edit(string $id)
    {
        $barang = Barangs::findOrFail($id);
        return Inertia::render('barangs/edit', ['barang' => $barang]);
    }

    public function update(UpdateRequest $request, string $id)
    {
        $barang = Barangs::findOrFail($id);
        $barang->update($request->validated());

        return redirect()->route('barangs.index')->with('success', 'Barang berhasil diperbarui.');
    }

    public function destroy(string $id)
    {
        Barangs::findOrFail($id)->delete();

        return redirect()->route('barangs.index')->with('success', 'Barang berhasil dihapus.');
    }

    public function downloadPdf()
    {
        $barangs = Barangs::all();
        $html    = view('pdf.barang', ['barangs' => $barangs])->render();

        $pdf = Pdf::loadHTML($html);
        $pdf->setPaper('A4', 'portrait');

        return $pdf->download('Laporan-Barang-' . date('Y-m-d') . '.pdf');
    }
}
