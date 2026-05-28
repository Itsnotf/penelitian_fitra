<?php

namespace App\Http\Controllers;

use App\Http\Requests\Pengajuan\RejectRequest;
use App\Http\Requests\Pengajuan\StoreRequest;
use App\Http\Requests\Pengajuan\UpdateRequest;
use App\Models\Barang_Pengajuan;
use App\Models\Barangs;
use App\Models\Pembelians;
use App\Models\Pengajuans;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PengajuansController extends Controller implements HasMiddleware
{
    public static function middleware()
    {
        return [
            new Middleware('permission:pengajuans index', only: ['index']),
            new Middleware('permission:pengajuans create', only: ['create', 'store']),
            new Middleware('permission:pengajuans show', only: ['show']),
            new Middleware('permission:pengajuans edit', only: ['edit', 'update']),
            new Middleware('permission:pengajuans delete', only: ['destroy']),
            new Middleware('permission:pengajuans change status', only: ['changeStatus', 'rejectStatus']),
            new Middleware('permission:pengajuans approve all normal', only: ['approveAllNormal']),
            new Middleware('permission:pengajuans buat pembelian selisih', only: ['buatPembelianSelisih']),
            new Middleware('permission:pengajuans show', only: ['downloadPdf']),
        ];
    }

    public function index(Request $request)
    {
        $query = Pengajuans::with('user')
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

        $pengajuans = $query
            ->when($request->search, fn($q, $s) => $q->where('deskripsi', 'like', "%{$s}%"))
            ->paginate(8)
            ->withQueryString();

        return Inertia::render('pengajuans/index', [
            'pengajuans' => $pengajuans,
            'filters'    => $request->only('search'),
            'flash'      => ['success' => session('success'), 'error' => session('error')],
        ]);
    }

    public function create()
    {
        return Inertia::render('pengajuans/create');
    }

    public function store(StoreRequest $request)
    {
        Pengajuans::create(array_merge($request->validated(), [
            'user_id' => Auth::id(),
            'status'  => 'pending',
        ]));

        return redirect()->route('pengajuans.index')->with('success', 'Pengajuan berhasil dibuat.');
    }

    public function show(string $pengajuan_id, Request $request)
    {
        $barangs = Barang_Pengajuan::with('barang', 'pengajuan')
            ->when($request->search, function ($q, $s) {
                $q->whereHas('barang', fn($b) => $b->where('nama_barang', 'like', "%{$s}%"));
            })
            ->where('pengajuan_id', $pengajuan_id)
            ->paginate(8)
            ->withQueryString();

        $pengajuan = Pengajuans::findOrFail($pengajuan_id);

        return Inertia::render('pengajuans/barangs/index', [
            'barangs'   => $barangs,
            'pengajuan' => $pengajuan,
            'filters'   => $request->only('search'),
            'flash'     => ['success' => session('success')],
        ]);
    }

    public function edit(string $id)
    {
        $pengajuan = Pengajuans::findOrFail($id);
        return Inertia::render('pengajuans/edit', ['pengajuan' => $pengajuan]);
    }

    public function update(UpdateRequest $request, string $id)
    {
        Pengajuans::findOrFail($id)->update($request->validated());

        return redirect()->route('pengajuans.index')->with('success', 'Pengajuan berhasil diperbarui.');
    }

    public function destroy(string $id)
    {
        Pengajuans::findOrFail($id)->delete();

        return redirect()->route('pengajuans.index')->with('success', 'Pengajuan berhasil dihapus.');
    }

    /**
     * Approve: pending → proses.
     * Sistem otomatis mengecek stock (mendesak) atau menambah jumlah_permintaan (normal).
     */
    public function changeStatus(string $id)
    {
        $pengajuan = Pengajuans::findOrFail($id);

        if ($pengajuan->status !== 'pending') {
            return redirect()->route('pengajuans.index')
                ->with('error', 'Hanya pengajuan berstatus pending yang dapat diproses.');
        }

        $pengajuan->prosesApprove();

        $msg = $pengajuan->urgensi === 'mendesak'
            ? 'Pengajuan mendesak diproses. Sistem sedang mengecek stok.'
            : 'Pengajuan normal diproses. Jumlah permintaan telah ditambahkan ke stok.';

        return redirect()->route('pengajuans.index')->with('success', $msg);
    }

    /**
     * Reject: hanya dari status pending.
     */
    public function rejectStatus(RejectRequest $request, string $id)
    {
        $pengajuan = Pengajuans::findOrFail($id);

        if ($pengajuan->status !== 'pending') {
            return redirect()->route('pengajuans.index')
                ->with('error', 'Pengajuan yang sudah diproses tidak dapat ditolak.');
        }

        $pengajuan->update([
            'status'        => 'rejected',
            'alasan_reject' => $request->alasan_reject,
        ]);

        return redirect()->route('pengajuans.index')->with('success', 'Pengajuan berhasil ditolak.');
    }

    /**
     * Setujui semua pengajuan normal yang berstatus proses.
     * Syarat: stock_tersedia ≥ jumlah_permintaan untuk semua barang.
     */
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

        $pengajuans = Pengajuans::where('urgensi', 'normal')->where('status', 'proses')->get();

        if ($pengajuans->isEmpty()) {
            return back()->with('error', 'Tidak ada pengajuan normal yang sedang diproses.');
        }

        DB::transaction(function () use ($pengajuans) {
            foreach ($pengajuans as $pengajuan) {
                $pengajuan->finalizeSelesai();
            }
        });

        return back()->with('success', "Berhasil menyetujui {$pengajuans->count()} pengajuan normal.");
    }

    /**
     * Buat pembelian untuk selisih stok yang kurang dari jumlah permintaan normal.
     */
    public function buatPembelianSelisih()
    {
        $deficitBarangs = Barangs::where('jumlah_permintaan', '>', 0)
            ->whereColumn('stock_tersedia', '<', 'jumlah_permintaan')
            ->get();

        if ($deficitBarangs->isEmpty()) {
            return back()->with('error', 'Tidak ada barang yang kekurangan stok.');
        }

        $pembelian = Pembelians::create([
            'user_id'     => Auth::id(),
            'total_harga' => 0,
            'deskripsi'   => 'Pembelian Selisih Normal - ' . now()->format('d/m/Y H:i'),
            'status'      => 'pending',
        ]);

        foreach ($deficitBarangs as $barang) {
            $deficit = (int) $barang->jumlah_permintaan - (int) $barang->stock_tersedia;
            if ($deficit > 0) {
                $pembelian->barang_pembelians()->create([
                    'barang_id' => $barang->id,
                    'jumlah'    => $deficit,
                    'harga'     => 0,
                ]);
            }
        }

        return redirect()->route('pembelians.show', $pembelian->id)
            ->with('success', 'Pembelian selisih berhasil dibuat. Silakan pilih vendor dan tandai selesai.');
    }

    public function downloadPdf(string $id)
    {
        $pengajuan = Pengajuans::with('barang_pengajuans.barang', 'user')->findOrFail($id);
        $html      = view('pdf.pengajuan', ['pengajuan' => $pengajuan])->render();

        $pdf = Pdf::loadHTML($html);
        $pdf->setPaper('A4', 'portrait');

        return $pdf->download("Laporan-Pengajuan-{$pengajuan->id}.pdf");
    }
}
