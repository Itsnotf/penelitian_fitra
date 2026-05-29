<?php

namespace App\Http\Controllers;

use App\Models\Barangs;
use App\Models\Pembelians;
use App\Models\Pengajuans;
use App\Models\User;
use App\Models\Vendor;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        if ($user->hasRole('Admin')) {
            return $this->adminDashboard();
        }

        if ($user->hasRole('Tata Kelola')) {
            return $this->tataKelolaDashboard();
        }

        if ($user->hasRole('Kepala Bidang')) {
            return $this->kepalaBidangDashboard();
        }

        return $this->userDashboard();
    }

    private function adminDashboard()
    {
        $pembelianBulanan = collect(range(5, 0))->map(function ($i) {
            $month = now()->subMonths($i);
            return [
                'bulan'   => $month->format('M Y'),
                'total'   => Pembelians::whereYear('created_at', $month->year)->whereMonth('created_at', $month->month)->count(),
                'selesai' => Pembelians::whereYear('created_at', $month->year)->whereMonth('created_at', $month->month)->where('status', 'selesai')->count(),
            ];
        });

        $usersByRole = User::with('roles')->get()
            ->flatMap(fn($u) => $u->roles->pluck('name'))
            ->countBy()
            ->map(fn($count, $role) => ['role' => $role, 'total' => $count])
            ->values();

        return Inertia::render('dashboard/admin', [
            'stats' => [
                'totalBarangs'       => Barangs::count(),
                'totalVendors'       => Vendor::count(),
                'totalPembelians'    => Pembelians::count(),
                'totalPengajuans'    => Pengajuans::count(),
                'totalUsers'         => User::count(),
                'totalStockTersedia' => Barangs::sum('stock_tersedia'),
                'pembelianPending'   => Pembelians::where('status', 'pending')->count(),
                'pengajuanPending'   => Pengajuans::where('status', 'pending')->count(),
            ],
            'pembelianByStatus'  => Pembelians::selectRaw('status, count(*) as total')->groupBy('status')->pluck('total', 'status'),
            'pengajuanByStatus'  => Pengajuans::selectRaw('status, count(*) as total')->groupBy('status')->pluck('total', 'status'),
            'pengajuanByUrgensi' => Pengajuans::selectRaw('urgensi, count(*) as total')->groupBy('urgensi')->pluck('total', 'urgensi'),
            'pembelianBulanan'   => $pembelianBulanan,
            'usersByRole'        => $usersByRole,
            'lowStockBarangs'    => Barangs::where('stock_tersedia', '<', 10)->orderBy('stock_tersedia')->limit(5)->get(['id', 'nama_barang', 'stock_tersedia', 'satuan']),
            'recentPembelians'   => Pembelians::with('user', 'vendor')->latest()->limit(5)->get(),
            'recentPengajuans'   => Pengajuans::with('user')->latest()->limit(5)->get(),
        ]);
    }

    private function tataKelolaDashboard()
    {
        $stockVsPermintaan = Barangs::where('jumlah_permintaan', '>', 0)
            ->orderByDesc('jumlah_permintaan')
            ->limit(8)
            ->get(['id', 'nama_barang', 'stock_tersedia', 'jumlah_permintaan', 'satuan'])
            ->map(fn($b) => [
                'nama'              => $b->nama_barang,
                'stock_tersedia'    => (int) $b->stock_tersedia,
                'jumlah_permintaan' => (int) $b->jumlah_permintaan,
            ]);

        return Inertia::render('dashboard/tata-kelola', [
            'stats' => [
                'totalBarangs'          => Barangs::count(),
                'totalVendors'          => Vendor::count(),
                'pembelianPending'      => Pembelians::where('status', 'pending')->count(),
                'pembelianProses'       => Pembelians::where('status', 'proses')->count(),
                'totalJumlahPermintaan' => (int) Barangs::sum('jumlah_permintaan'),
                'deficitCount'          => Barangs::where('jumlah_permintaan', '>', 0)->whereColumn('stock_tersedia', '<', 'jumlah_permintaan')->count(),
            ],
            'stockVsPermintaan'  => $stockVsPermintaan,
            'pembelianByStatus'  => Pembelians::selectRaw('status, count(*) as total')->groupBy('status')->pluck('total', 'status'),
            'deficitBarangs'     => Barangs::where('jumlah_permintaan', '>', 0)->whereColumn('stock_tersedia', '<', 'jumlah_permintaan')->get(['id', 'nama_barang', 'stock_tersedia', 'jumlah_permintaan', 'satuan']),
            'pembelianMenunggu'  => Pembelians::with('vendor')->whereIn('status', ['pending', 'proses'])->latest()->limit(5)->get(),
        ]);
    }

    private function kepalaBidangDashboard()
    {
        return Inertia::render('dashboard/kepala-bidang', [
            'stats' => [
                'pengajuanPending'         => Pengajuans::where('status', 'pending')->count(),
                'pengajuanProses'          => Pengajuans::where('status', 'proses')->count(),
                'pengajuanSelesaiBulanIni' => Pengajuans::where('status', 'selesai')->whereMonth('updated_at', now()->month)->count(),
                'pembelianSelesaiBulanIni' => Pembelians::where('status', 'selesai')->whereMonth('updated_at', now()->month)->count(),
            ],
            'pengajuanByStatus'  => Pengajuans::selectRaw('status, count(*) as total')->groupBy('status')->pluck('total', 'status'),
            'pengajuanByUrgensi' => Pengajuans::selectRaw('urgensi, count(*) as total')->groupBy('urgensi')->pluck('total', 'urgensi'),
            'pengajuanMenunggu'  => Pengajuans::with('user')->where('status', 'pending')->latest()->limit(10)->get(),
            'recentSelesai'      => Pengajuans::with('user')->where('status', 'selesai')->latest()->limit(5)->get(),
        ]);
    }

    private function userDashboard()
    {
        $myPengajuans = Pengajuans::with(['barang_pengajuans.barang', 'pembelians'])
            ->where('user_id', Auth::id())
            ->latest()
            ->get();

        $summary = [
            'total'    => $myPengajuans->count(),
            'pending'  => $myPengajuans->where('status', 'pending')->count(),
            'proses'   => $myPengajuans->where('status', 'proses')->count(),
            'selesai'  => $myPengajuans->where('status', 'selesai')->count(),
            'rejected' => $myPengajuans->where('status', 'rejected')->count(),
        ];

        return Inertia::render('dashboard/user', [
            'myPengajuans' => $myPengajuans,
            'summary'      => $summary,
        ]);
    }
}
