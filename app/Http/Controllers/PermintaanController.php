<?php

namespace App\Http\Controllers;

use App\Http\Requests\Permintaan\RejectRequest;
use App\Http\Requests\Permintaan\StoreRequest;
use App\Http\Requests\Permintaan\UpdateRequest;
use App\Models\Barang_Permintaan;
use App\Models\Barangs;
use App\Models\Pengadaan;
use App\Models\Permintaan;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PermintaanController extends Controller implements HasMiddleware
{
    public static function middleware()
    {
        return [
            new Middleware('permission:permintaan index', only: ['index']),
            new Middleware('permission:permintaan create', only: ['create', 'store']),
            new Middleware('permission:permintaan show', only: ['show']),
            new Middleware('permission:permintaan edit', only: ['edit', 'update']),
            new Middleware('permission:permintaan delete', only: ['destroy']),
            new Middleware('permission:permintaan change status', only: ['changeStatus', 'rejectStatus']),
            new Middleware('permission:permintaan approve all normal', only: ['approveAllNormal']),
            new Middleware('permission:permintaan buat pengadaan selisih', only: ['buatPengadaanSelisih']),
            new Middleware('permission:permintaan show', only: ['downloadPdf']),
        ];
    }

    public function index(Request $request)
    {
        $query = Permintaan::with('user')
            ->orderByRaw("CASE
                WHEN status = 'selesai'   THEN 1
                WHEN status = 'rejected'  THEN 2
                ELSE 0
            END ASC")
            ->orderByRaw("CASE urgensi
                WHEN 'mendesak' THEN 1
                WHEN 'normal'   THEN 2
                ELSE 3
            END ASC");

        if ($request->user()?->roles()->where('name', 'User')->exists()) {
            $query->where('user_id', Auth::id());
        }

        $permintaan = $query
            ->when($request->search, fn($q, $s) => $q->where('deskripsi', 'like', "%{$s}%"))
            ->paginate(8)
            ->withQueryString();

        return Inertia::render('permintaan/index', [
            'permintaan' => $permintaan,
            'filters'    => $request->only('search'),
            'flash'      => ['success' => session('success'), 'error' => session('error')],
        ]);
    }

    public function create()
    {
        $barangs = Barangs::with('tipeBarang:id,nama_tipe')
            ->orderBy('nama_barang')
            ->get(['id', 'nama_barang', 'satuan', 'tipe_barang_id']);
        return Inertia::render('permintaan/create', [
            'barangs' => $barangs,
        ]);
    }

    public function store(StoreRequest $request)
    {
        DB::transaction(function () use ($request) {
            $permintaan = Permintaan::create([
                ...$request->only(['deskripsi', 'urgensi']),
                'user_id' => Auth::id(),
                'status'  => 'pending',
            ]);

            foreach ($request->items as $item) {
                $permintaan->barang_permintaan()->create([
                    'barang_id' => $item['barang_id'],
                    'jumlah'    => $item['jumlah'],
                ]);
            }
        });

        return redirect()->route('permintaan.index')
            ->with('success', 'Permintaan berhasil dibuat.');
    }

    public function show(string $permintaan_id, Request $request)
    {
        $barangs = Barang_Permintaan::with('barang', 'permintaan')
            ->when($request->search, function ($q, $s) {
                $q->whereHas('barang', fn($b) => $b->where('nama_barang', 'like', "%{$s}%"));
            })
            ->where('permintaan_id', $permintaan_id)
            ->paginate(8)
            ->withQueryString();

        $permintaan = Permintaan::findOrFail($permintaan_id);

        return Inertia::render('permintaan/barangs/index', [
            'barangs'    => $barangs,
            'permintaan' => $permintaan,
            'filters'    => $request->only('search'),
            'flash'      => ['success' => session('success')],
        ]);
    }

    public function edit(string $id)
    {
        $permintaan = Permintaan::findOrFail($id);
        return Inertia::render('permintaan/edit', ['permintaan' => $permintaan]);
    }

    public function update(UpdateRequest $request, string $id)
    {
        Permintaan::findOrFail($id)->update($request->validated());

        return redirect()->route('permintaan.index')->with('success', 'Permintaan berhasil diperbarui.');
    }

    public function destroy(string $id)
    {
        Permintaan::findOrFail($id)->delete();

        return redirect()->route('permintaan.index')->with('success', 'Permintaan berhasil dihapus.');
    }

    public function changeStatus(string $id)
    {
        $permintaan = Permintaan::findOrFail($id);

        if ($permintaan->status !== 'pending') {
            return redirect()->route('permintaan.index')
                ->with('error', 'Hanya permintaan berstatus pending yang dapat diproses.');
        }

        $permintaan->prosesApprove();

        $msg = $permintaan->urgensi === 'mendesak'
            ? 'Permintaan mendesak diproses. Sistem sedang mengecek stok.'
            : 'Permintaan normal diproses. Jumlah permintaan telah ditambahkan ke stok.';

        return redirect()->route('permintaan.index')->with('success', $msg);
    }

    public function rejectStatus(RejectRequest $request, string $id)
    {
        $permintaan = Permintaan::findOrFail($id);

        if ($permintaan->status !== 'pending') {
            return redirect()->route('permintaan.index')
                ->with('error', 'Permintaan yang sudah diproses tidak dapat ditolak.');
        }

        $permintaan->update([
            'status'        => 'rejected',
            'alasan_reject' => $request->alasan_reject,
        ]);

        return redirect()->route('permintaan.index')->with('success', 'Permintaan berhasil ditolak.');
    }

    public function approveAllNormal()
    {
        $insufficientBarangs = Barangs::where('jumlah_permintaan', '>', 0)
            ->whereColumn('stock_tersedia', '<', 'jumlah_permintaan')
            ->get(['id', 'nama_barang', 'stock_tersedia', 'jumlah_permintaan']);

        if ($insufficientBarangs->isNotEmpty()) {
            $names = $insufficientBarangs->map(fn($b) =>
                "{$b->nama_barang} (tersedia: {$b->stock_tersedia}, dibutuhkan: {$b->jumlah_permintaan})"
            )->join('; ');

            return back()->with('error', "Stok tidak mencukupi untuk: {$names}.");
        }

        $permintaanList = Permintaan::where('urgensi', 'normal')->where('status', 'proses')->get();

        if ($permintaanList->isEmpty()) {
            return back()->with('error', 'Tidak ada permintaan normal yang sedang diproses.');
        }

        DB::transaction(function () use ($permintaanList) {
            foreach ($permintaanList as $permintaan) {
                $permintaan->finalizeSelesai();
            }
        });

        return back()->with('success', "Berhasil menyetujui {$permintaanList->count()} permintaan normal.");
    }

    public function buatPengadaanSelisih()
    {
        $deficitBarangs = Barangs::where('jumlah_permintaan', '>', 0)
            ->whereColumn('stock_tersedia', '<', 'jumlah_permintaan')
            ->get();

        if ($deficitBarangs->isEmpty()) {
            return back()->with('error', 'Tidak ada barang yang kekurangan stok.');
        }

        $pengadaan = Pengadaan::create([
            'user_id'     => Auth::id(),
            'total_harga' => 0,
            'deskripsi'   => 'Pengadaan Selisih Normal - ' . now()->format('d/m/Y H:i'),
            'status'      => 'pending',
        ]);

        foreach ($deficitBarangs as $barang) {
            $deficit = (int) $barang->jumlah_permintaan - (int) $barang->stock_tersedia;
            if ($deficit > 0) {
                $pengadaan->barang_pengadaan()->create([
                    'barang_id' => $barang->id,
                    'jumlah'    => $deficit,
                    'harga'     => 0,
                ]);
            }
        }

        return redirect()->route('pengadaan.show', $pengadaan->id)
            ->with('success', 'Pengadaan selisih berhasil dibuat. Silakan pilih vendor dan tandai selesai.');
    }

    public function downloadPdf(string $id)
    {
        $permintaan = Permintaan::with('barang_permintaan.barang.tipeBarang', 'user')->findOrFail($id);
        $html       = view('pdf.permintaan', ['permintaan' => $permintaan])->render();

        $pdf = Pdf::loadHTML($html);
        $pdf->setPaper('A4', 'portrait');

        return $pdf->download("Laporan-Permintaan-{$permintaan->id}.pdf");
    }
}
