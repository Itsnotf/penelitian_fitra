<?php

namespace App\Http\Controllers;

use App\Http\Requests\Barang\StoreRequest;
use App\Http\Requests\Barang\UpdateRequest;
use App\Models\Barangs;
use App\Models\TipeBarang;
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

    private function filterParams(Request $request): array
    {
        return $request->only(['search', 'tipe_barang_id', 'jenis_barang', 'stok']);
    }

    public function index(Request $request)
    {
        $barangs = Barangs::with('tipeBarang')
            ->filtered($this->filterParams($request))
            ->paginate(8)
            ->withQueryString();

        $hasJumlahPermintaan = Barangs::where('jumlah_permintaan', '>', 0)->exists();
        $allStockSufficient  = !Barangs::where('jumlah_permintaan', '>', 0)
            ->whereColumn('stock_tersedia', '<', 'jumlah_permintaan')
            ->exists();

        return Inertia::render('barangs/index', [
            'barangs'             => $barangs,
            'filters'             => $this->filterParams($request),
            'hasJumlahPermintaan' => $hasJumlahPermintaan,
            'allStockSufficient'  => $allStockSufficient,
            'flash'               => ['success' => session('success'), 'error' => session('error')],
            'can'                 => [
                'approveAllNormal'     => $request->user()?->can('permintaan approve all normal'),
                'buatPengadaanSelisih' => $request->user()?->can('permintaan buat pengadaan selisih'),
            ],
            'tipeBarangs' => TipeBarang::orderBy('nama_tipe')->get(['id', 'nama_tipe']),
        ]);
    }

    public function create()
    {
        return Inertia::render('barangs/create', [
            'tipeBarangs' => TipeBarang::orderBy('nama_tipe')->get(['id', 'nama_tipe']),
        ]);
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

        return Inertia::render('barangs/edit', [
            'barang'      => $barang,
            'tipeBarangs' => TipeBarang::orderBy('nama_tipe')->get(['id', 'nama_tipe']),
        ]);
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

    /**
     * Mengikuti filter yang sedang aktif di halaman index (satu sumber
     * filter) — parameter yang dikirim persis sama dengan query string
     * yang sedang dipakai di /barangs.
     */
    public function downloadPdf(Request $request)
    {
        $request->validate([
            'search'         => 'nullable|string',
            'tipe_barang_id' => 'nullable|exists:tipe_barangs,id',
            'jenis_barang'   => 'nullable|in:pendek,sedang,panjang',
            'stok'           => 'nullable|in:semua,rendah,habis',
        ]);

        $barangs = Barangs::with('tipeBarang')
            ->filtered($this->filterParams($request))
            ->orderBy('nama_barang')
            ->get();

        $filterInfo = $this->buildFilterInfo($request);

        $html = view('pdf.barang', [
            'barangs'    => $barangs,
            'filterInfo' => $filterInfo,
        ])->render();

        $pdf = Pdf::loadHTML($html)->setPaper('A4', 'portrait');

        return $pdf->download('Laporan-Barang-' . date('Y-m-d') . '.pdf');
    }

    private function buildFilterInfo(Request $request): string
    {
        $parts = [];

        if ($request->search) {
            $parts[] = 'Pencarian: ' . $request->search;
        }

        if ($request->tipe_barang_id) {
            $namaTipe = TipeBarang::find($request->tipe_barang_id)?->nama_tipe;
            if ($namaTipe) {
                $parts[] = 'Tipe: ' . $namaTipe;
            }
        }

        if ($request->jenis_barang) {
            $parts[] = 'Jenis: ' . match ($request->jenis_barang) {
                'pendek'  => 'Pendek',
                'sedang'  => 'Sedang',
                'panjang' => 'Panjang',
                default   => $request->jenis_barang,
            };
        }

        if ($request->stok && $request->stok !== 'semua') {
            $parts[] = 'Stok: ' . match ($request->stok) {
                'rendah' => 'Stok Rendah (< 10)',
                'habis'  => 'Stok Habis',
                default  => $request->stok,
            };
        }

        return $parts ? implode(' | ', $parts) : 'Semua barang';
    }
}
