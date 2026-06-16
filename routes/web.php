<?php

use App\Http\Controllers\BarangPengadaanController;
use App\Http\Controllers\BarangPermintaanController;
use App\Http\Controllers\BarangVendorController;
use App\Http\Controllers\BarangsController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PengadaanController;
use App\Http\Controllers\PermintaanController;
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

    Route::resource('pengadaan', PengadaanController::class);
    Route::post('pengadaan/{id}/change-status', [PengadaanController::class, 'changeStatus'])->name('pengadaan.changeStatus');
    Route::get('pengadaan/{id}/download-pdf', [PengadaanController::class, 'downloadPdf'])->name('pengadaan.downloadPdf');

    Route::prefix('pengadaan/{pengadaan_id}/barangs')->group(function () {
        Route::get('/create', [BarangPengadaanController::class, 'create'])->name('pengadaan.barangs.create');
        Route::post('/', [BarangPengadaanController::class, 'store'])->name('pengadaan.barangs.store');
        Route::get('/{barang_Pengadaan_id}/edit', [BarangPengadaanController::class, 'edit'])->name('pengadaan.barangs.edit');
        Route::put('/{barang_Pengadaan_id}', [BarangPengadaanController::class, 'update'])->name('pengadaan.barangs.update');
        Route::delete('/{barang_Pengadaan_id}', [BarangPengadaanController::class, 'destroy'])->name('pengadaan.barangs.destroy');
    });

    // Permintaan — route spesifik SEBELUM resource
    Route::post('permintaan/approve-all-normal', [PermintaanController::class, 'approveAllNormal'])->name('permintaan.approveAllNormal');
    Route::post('permintaan/buat-pengadaan-selisih', [PermintaanController::class, 'buatPengadaanSelisih'])->name('permintaan.buatPengadaanSelisih');
    Route::resource('permintaan', PermintaanController::class);
    Route::post('permintaan/{id}/change-status', [PermintaanController::class, 'changeStatus'])->name('permintaan.changeStatus');
    Route::post('permintaan/{id}/reject-status', [PermintaanController::class, 'rejectStatus'])->name('permintaan.rejectStatus');
    Route::get('permintaan/{id}/download-pdf', [PermintaanController::class, 'downloadPdf'])->name('permintaan.downloadPdf');

    Route::prefix('permintaan/{permintaan_id}/barangs')->group(function () {
        Route::get('/create', [BarangPermintaanController::class, 'create'])->name('permintaan.barangs.create');
        Route::post('/', [BarangPermintaanController::class, 'store'])->name('permintaan.barangs.store');
        Route::get('/{barang_Permintaan_id}/edit', [BarangPermintaanController::class, 'edit'])->name('permintaan.barangs.edit');
        Route::put('/{barang_Permintaan_id}', [BarangPermintaanController::class, 'update'])->name('permintaan.barangs.update');
        Route::delete('/{barang_Permintaan_id}', [BarangPermintaanController::class, 'destroy'])->name('permintaan.barangs.destroy');
    });
});

require __DIR__ . '/settings.php';
