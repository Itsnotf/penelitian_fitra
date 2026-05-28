<?php

use App\Http\Controllers\BarangPembelianController;
use App\Http\Controllers\BarangPengajuanController;
use App\Http\Controllers\BarangVendorController;
use App\Http\Controllers\BarangsController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PembeliansController;
use App\Http\Controllers\PengajuansController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VendorController;
use Illuminate\Support\Facades\Route;

Route::get('/', fn() => redirect()->route('login'))->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])
        ->middleware('check.dashboard.permission')
        ->name('dashboard');

    Route::resource('users', UserController::class);
    Route::resource('roles', RoleController::class);

    Route::get('barangs/download-pdf', [BarangsController::class, 'downloadPdf'])->name('barangs.downloadPdf');
    Route::resource('barangs', BarangsController::class);

    // Vendors & Barang Vendor
    Route::resource('vendors', VendorController::class);
    Route::prefix('vendors/{vendor_id}/barangs')->name('vendors.barangs.')->group(function () {
        Route::get('/', [BarangVendorController::class, 'index'])->name('index');
        Route::get('/create', [BarangVendorController::class, 'create'])->name('create');
        Route::post('/', [BarangVendorController::class, 'store'])->name('store');
        Route::get('/{barang_vendor_id}/edit', [BarangVendorController::class, 'edit'])->name('edit');
        Route::put('/{barang_vendor_id}', [BarangVendorController::class, 'update'])->name('update');
        Route::delete('/{barang_vendor_id}', [BarangVendorController::class, 'destroy'])->name('destroy');
    });

    Route::resource('pembelians', PembeliansController::class);
    Route::post('pembelians/{id}/change-status', [PembeliansController::class, 'changeStatus'])->name('pembelians.changeStatus');
    Route::get('pembelians/{id}/download-pdf', [PembeliansController::class, 'downloadPdf'])->name('pembelians.downloadPdf');

    Route::prefix('pembelians/{pembelian_id}/barangs')->group(function () {
        Route::get('/create', [BarangPembelianController::class, 'create'])->name('pembelians.barangs.create');
        Route::post('/', [BarangPembelianController::class, 'store'])->name('pembelians.barangs.store');
        Route::get('/{barang_Pembelian_id}/edit', [BarangPembelianController::class, 'edit'])->name('pembelians.barangs.edit');
        Route::put('/{barang_Pembelian_id}', [BarangPembelianController::class, 'update'])->name('pembelians.barangs.update');
        Route::delete('/{barang_Pembelian_id}', [BarangPembelianController::class, 'destroy'])->name('pembelians.barangs.destroy');
    });

    // Pengajuans — route spesifik SEBELUM resource
    Route::post('pengajuans/approve-all-normal', [PengajuansController::class, 'approveAllNormal'])->name('pengajuans.approveAllNormal');
    Route::post('pengajuans/buat-pembelian-selisih', [PengajuansController::class, 'buatPembelianSelisih'])->name('pengajuans.buatPembelianSelisih');
    Route::resource('pengajuans', PengajuansController::class);
    Route::post('pengajuans/{id}/change-status', [PengajuansController::class, 'changeStatus'])->name('pengajuans.changeStatus');
    Route::post('pengajuans/{id}/reject-status', [PengajuansController::class, 'rejectStatus'])->name('pengajuans.rejectStatus');
    Route::get('pengajuans/{id}/download-pdf', [PengajuansController::class, 'downloadPdf'])->name('pengajuans.downloadPdf');

    Route::prefix('pengajuans/{pengajuan_id}/barangs')->group(function () {
        Route::get('/create', [BarangPengajuanController::class, 'create'])->name('pengajuans.barangs.create');
        Route::post('/', [BarangPengajuanController::class, 'store'])->name('pengajuans.barangs.store');
        Route::get('/{barang_Pengajuan_id}/edit', [BarangPengajuanController::class, 'edit'])->name('pengajuans.barangs.edit');
        Route::put('/{barang_Pengajuan_id}', [BarangPengajuanController::class, 'update'])->name('pengajuans.barangs.update');
        Route::delete('/{barang_Pengajuan_id}', [BarangPengajuanController::class, 'destroy'])->name('pengajuans.barangs.destroy');
    });
});

require __DIR__ . '/settings.php';
