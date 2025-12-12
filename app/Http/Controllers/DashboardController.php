<?php

namespace App\Http\Controllers;

use App\Models\Barangs;
use App\Models\Pembelians;
use App\Models\Pengajuans;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // Total stats
        $totalBarangs = Barangs::count();
        $totalPembelians = Pembelians::count();
        $totalPengajuans = Pengajuans::count();
        
        // Stock calculations
        $totalStockAwal = Barangs::sum('stock_awal');
        $totalStockMasuk = Barangs::sum('stock_masuk');
        $totalStockKeluar = Barangs::sum('stock_keluar');
        $totalStockTersedia = Barangs::sum('stock_tersedia');
        
        // Recent pembelians
        $recentPembelians = Pembelians::with('user')
            ->latest()
            ->limit(5)
            ->get();
        
        // Recent pengajuans
        $recentPengajuans = Pengajuans::with('user')
            ->latest()
            ->limit(5)
            ->get();
        
        // Low stock alert (stock_tersedia < 10)
        $lowStockBarangs = Barangs::where('stock_tersedia', '<', 10)
            ->orderBy('stock_tersedia')
            ->limit(5)
            ->get();
        
        // Pembelian status summary
        $pembeliansByStatus = Pembelians::selectRaw('status, count(*) as total')
            ->groupBy('status')
            ->get()
            ->keyBy('status');
        
        // Pengajuan status summary
        $pengajuansByStatus = Pengajuans::selectRaw('status, count(*) as total')
            ->groupBy('status')
            ->get()
            ->keyBy('status');
        
        return Inertia::render('dashboard', [
            'stats' => [
                'totalBarangs' => $totalBarangs,
                'totalPembelians' => $totalPembelians,
                'totalPengajuans' => $totalPengajuans,
                'totalStockAwal' => $totalStockAwal,
                'totalStockMasuk' => $totalStockMasuk,
                'totalStockKeluar' => $totalStockKeluar,
                'totalStockTersedia' => $totalStockTersedia,
            ],
            'recentPembelians' => $recentPembelians,
            'recentPengajuans' => $recentPengajuans,
            'lowStockBarangs' => $lowStockBarangs,
            'pembeliansByStatus' => $pembeliansByStatus,
            'pengajuansByStatus' => $pengajuansByStatus,
        ]);
    }
}
