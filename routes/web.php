<?php

use App\Http\Controllers\BarangPembelianController;
use App\Http\Controllers\BarangPengajuanController;
use App\Http\Controllers\BarangsController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PembeliansController;
use App\Http\Controllers\PengajuansController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return redirect()->route('login');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::resource('users', UserController::class);
    Route::resource('roles', RoleController::class);
    Route::get('barangs/download-pdf', [BarangsController::class, 'downloadPdf'])->name('barangs.downloadPdf');
    Route::resource('barangs', BarangsController::class);
    Route::resource('pembelians', PembeliansController::class);
    Route::post('pembelians/{id}/change-status', [PembeliansController::class, 'changeStatus'])->name('pembelians.changeStatus');
    Route::get('pembelians/{id}/download-pdf', [PembeliansController::class, 'downloadPdf'])->name('pembelians.downloadPdf');

    Route::resource('pengajuans', PengajuansController::class);
    Route::post('pengajuans/{id}/change-status', [PengajuansController::class, 'changeStatus'])->name('pengajuans.changeStatus');
    Route::post('pengajuans/{id}/reject-status', [PengajuansController::class, 'rejectStatus'])->name('pengajuans.rejectStatus');
    Route::get('pengajuans/{id}/download-pdf', [PengajuansController::class, 'downloadPdf'])->name('pengajuans.downloadPdf');

    Route::prefix('pembelians/{pembelian_id}/barangs')->group(function () {
        Route::get('create', [BarangPembelianController::class, 'create'])->name('pembelians.barangs.create');
        Route::get('edit/{barang_Pembelian_id}', [BarangPembelianController::class, 'edit'])->name('pembelians.barangs.edit');
        Route::put('/{barang_Pembelian_id}', [BarangPembelianController::class, 'update'])->name('pembelians.barangs.update');
        Route::delete('/{barang_Pembelian_id}', [BarangPembelianController::class, 'destroy'])->name('pembelians.barangs.destroy');
        Route::post('/', [BarangPembelianController::class, 'store'])->name('pembelians.barangs.store');
    });

    Route::prefix('pengajuans/{pengajuan_id}/barangs')->group(function () {
        Route::get('create', [BarangPengajuanController::class, 'create'])->name('pengajuans.barangs.create');
        Route::get('edit/{barang_Pengajuan_id}', [BarangPengajuanController::class, 'edit'])->name('pengajuans.barangs.edit');
        Route::put('/{barang_Pengajuan_id}', [BarangPengajuanController::class, 'update'])->name('pengajuans.barangs.update');
        Route::delete('/{barang_Pengajuan_id}', [BarangPengajuanController::class, 'destroy'])->name('pengajuans.barangs.destroy');
        Route::post('/', [BarangPengajuanController::class, 'store'])->name('pengajuans.barangs.store');
    });
});

require __DIR__ . '/settings.php';
