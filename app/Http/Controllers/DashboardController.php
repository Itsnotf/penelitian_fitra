<?php

namespace App\Http\Controllers;

use App\Models\Barangs;
use App\Models\Pengadaan;
use App\Models\Permintaan;
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

        if ($user->hasRole('Tata Usaha')) {
            return $this->tataKelolaDashboard();
        }

        if ($user->hasRole('Kepala Bidang')) {
            return $this->kepalaBidangDashboard();
        }

        return $this->userDashboard();
    }

    private function adminDashboard()
    {
        $pengadaanBulanan = collect(range(5, 0))->map(function ($i) {
            $month = now()->subMonths($i);
            return [
                'bulan'   => $month->format('M Y'),
                'total'   => Pengadaan::whereYear('created_at', $month->year)->whereMonth('created_at', $month->month)->count(),
                'selesai' => Pengadaan::whereYear('created_at', $month->year)->whereMonth('created_at', $month->month)->where('status', 'selesai')->count(),
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
                'totalPengadaan'     => Pengadaan::count(),
                'totalPermintaan'    => Permintaan::count(),
                'totalUsers'         => User::count(),
                'totalStockTersedia' => Barangs::sum('stock_tersedia'),
                'pengadaanPending'   => Pengadaan::where('status', 'pending')->count(),
                'permintaanPending'  => Permintaan::where('status', 'pending')->count(),
            ],
            'pengadaanByStatus'  => Pengadaan::selectRaw('status, count(*) as total')->groupBy('status')->pluck('total', 'status'),
            'permintaanByStatus' => Permintaan::selectRaw('status, count(*) as total')->groupBy('status')->pluck('total', 'status'),
            'permintaanByUrgensi' => Permintaan::selectRaw('urgensi, count(*) as total')->groupBy('urgensi')->pluck('total', 'urgensi'),
            'pengadaanBulanan'   => $pengadaanBulanan,
            'usersByRole'        => $usersByRole,
            'lowStockBarangs'    => Barangs::where('stock_tersedia', '<', 10)->orderBy('stock_tersedia')->limit(5)->get(['id', 'nama_barang', 'stock_tersedia', 'satuan']),
            'recentPengadaan'    => Pengadaan::with('user', 'vendor')->latest()->limit(5)->get(),
            'recentPermintaan'   => Permintaan::with('user')->latest()->limit(5)->get(),
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
                'pengadaanPending'      => Pengadaan::where('status', 'pending')->count(),
                'pengadaanProses'       => Pengadaan::where('status', 'proses')->count(),
                'totalJumlahPermintaan' => (int) Barangs::sum('jumlah_permintaan'),
                'deficitCount'          => Barangs::where('jumlah_permintaan', '>', 0)->whereColumn('stock_tersedia', '<', 'jumlah_permintaan')->count(),
            ],
            'stockVsPermintaan'  => $stockVsPermintaan,
            'pengadaanByStatus'  => Pengadaan::selectRaw('status, count(*) as total')->groupBy('status')->pluck('total', 'status'),
            'deficitBarangs'     => Barangs::where('jumlah_permintaan', '>', 0)->whereColumn('stock_tersedia', '<', 'jumlah_permintaan')->get(['id', 'nama_barang', 'stock_tersedia', 'jumlah_permintaan', 'satuan']),
            'pengadaanMenunggu'  => Pengadaan::with('vendor')->whereIn('status', ['pending', 'proses'])->latest()->limit(5)->get(),
        ]);
    }

    private function kepalaBidangDashboard()
    {
        return Inertia::render('dashboard/kepala-bidang', [
            'stats' => [
                'permintaanPending'         => Permintaan::where('status', 'pending')->count(),
                'permintaanProses'          => Permintaan::where('status', 'proses')->count(),
                'permintaanSelesaiBulanIni' => Permintaan::where('status', 'selesai')->whereMonth('updated_at', now()->month)->count(),
                'pengadaanSelesaiBulanIni'  => Pengadaan::where('status', 'selesai')->whereMonth('updated_at', now()->month)->count(),
            ],
            'permintaanByStatus'  => Permintaan::selectRaw('status, count(*) as total')->groupBy('status')->pluck('total', 'status'),
            'permintaanByUrgensi' => Permintaan::selectRaw('urgensi, count(*) as total')->groupBy('urgensi')->pluck('total', 'urgensi'),
            'permintaanMenunggu'  => Permintaan::with('user')->where('status', 'pending')->latest()->limit(10)->get(),
            'recentSelesai'       => Permintaan::with('user')->where('status', 'selesai')->latest()->limit(5)->get(),
        ]);
    }

    private function userDashboard()
    {
        $myPermintaan = Permintaan::with(['barang_permintaan.barang', 'pengadaan'])
            ->where('user_id', Auth::id())
            ->latest()
            ->get();

        $summary = [
            'total'    => $myPermintaan->count(),
            'pending'  => $myPermintaan->where('status', 'pending')->count(),
            'proses'   => $myPermintaan->where('status', 'proses')->count(),
            'selesai'  => $myPermintaan->where('status', 'selesai')->count(),
            'rejected' => $myPermintaan->where('status', 'rejected')->count(),
        ];

        return Inertia::render('dashboard/user', [
            'myPermintaan' => $myPermintaan,
            'summary'      => $summary,
        ]);
    }
}
