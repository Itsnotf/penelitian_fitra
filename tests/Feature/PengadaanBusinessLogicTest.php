<?php

use App\Models\Barangs;
use App\Models\BarangVendor;
use App\Models\Pengadaan;
use App\Models\User;
use App\Models\Vendor;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Permission;

uses(RefreshDatabase::class);

beforeEach(function () {
    foreach ([
        'pengadaan index', 'pengadaan create', 'pengadaan edit', 'pengadaan delete',
        'pengadaan show', 'pengadaan change status',
    ] as $name) {
        Permission::create(['name' => $name]);
    }
});

function actingUserWithPengadaanPermissions()
{
    $user = User::factory()->create();
    $user->givePermissionTo([
        'pengadaan index', 'pengadaan create', 'pengadaan edit', 'pengadaan delete',
        'pengadaan show', 'pengadaan change status',
    ]);

    return $user;
}

test('store creates a pengadaan with multiple items and computes total_harga automatically', function () {
    $user = actingUserWithPengadaanPermissions();
    $barangA = Barangs::factory()->create();
    $barangB = Barangs::factory()->create();

    $response = $this->actingAs($user)->post('/pengadaan', [
        'deskripsi' => 'Pengadaan ATK bulan ini',
        'items' => [
            ['barang_id' => $barangA->id, 'jumlah' => 10, 'harga' => 5000],
            ['barang_id' => $barangB->id, 'jumlah' => 2, 'harga' => 1000000],
        ],
    ]);

    $response->assertRedirect('/pengadaan')->assertSessionHas('success');

    $pengadaan = Pengadaan::latest()->first();
    expect($pengadaan->barang_pengadaan)->toHaveCount(2);
    // (10 * 5000) + (2 * 1000000) = 2.050.000
    expect((int) $pengadaan->total_harga)->toBe(2050000);
});

test('store requires at least one item', function () {
    $user = actingUserWithPengadaanPermissions();

    $response = $this->actingAs($user)->post('/pengadaan', [
        'deskripsi' => 'Pengadaan tanpa barang',
        'items' => [],
    ]);

    $response->assertSessionHasErrors(['items']);
});

test('changeStatus moves pengadaan from pending to proses to selesai, adding stock on completion', function () {
    $user = actingUserWithPengadaanPermissions();
    $barang = Barangs::factory()->create(['stock_masuk' => 0, 'stock_tersedia' => 10]);

    $pengadaan = Pengadaan::factory()->create(['status' => 'pending']);
    $pengadaan->barang_pengadaan()->create(['barang_id' => $barang->id, 'jumlah' => 20, 'harga' => 1000]);

    $this->actingAs($user)->post("/pengadaan/{$pengadaan->id}/change-status");
    $pengadaan->refresh();
    expect($pengadaan->status)->toBe('proses');

    $this->actingAs($user)->post("/pengadaan/{$pengadaan->id}/change-status");
    $pengadaan->refresh();
    expect($pengadaan->status)->toBe('selesai');

    $barang->refresh();
    expect($barang->stock_masuk)->toBe(20);
    expect($barang->stock_tersedia)->toBe(30); // 10 awal + 20 masuk
});

test('changeStatus cannot be changed once a pengadaan is already selesai', function () {
    $user = actingUserWithPengadaanPermissions();
    $pengadaan = Pengadaan::factory()->create(['status' => 'selesai']);

    $response = $this->actingAs($user)->post("/pengadaan/{$pengadaan->id}/change-status");

    $response->assertSessionHas('error');
    $pengadaan->refresh();
    expect($pengadaan->status)->toBe('selesai');
});

test('updating the vendor on a pengadaan syncs item prices from that vendor catalog', function () {
    $user = actingUserWithPengadaanPermissions();
    $barang = Barangs::factory()->create();
    $vendor = Vendor::factory()->create();
    BarangVendor::create(['vendor_id' => $vendor->id, 'barang_id' => $barang->id, 'harga' => 75000]);

    $pengadaan = Pengadaan::factory()->create(['vendor_id' => null]);
    $pengadaan->barang_pengadaan()->create(['barang_id' => $barang->id, 'jumlah' => 3, 'harga' => 0]);

    $this->actingAs($user)->put("/pengadaan/{$pengadaan->id}", [
        'vendor_id' => $vendor->id,
        'deskripsi' => $pengadaan->deskripsi,
    ]);

    $barangPengadaan = $pengadaan->barang_pengadaan()->first();
    expect((int) $barangPengadaan->harga)->toBe(75000);
});
