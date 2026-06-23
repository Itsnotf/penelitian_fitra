<?php

use App\Models\Barangs;
use App\Models\Pengadaan;
use App\Models\Permintaan;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Permission;

uses(RefreshDatabase::class);

beforeEach(function () {
    foreach ([
        'permintaan index', 'permintaan create', 'permintaan edit', 'permintaan delete',
        'permintaan show', 'permintaan change status', 'permintaan approve all normal',
        'permintaan buat pengadaan selisih',
    ] as $name) {
        Permission::create(['name' => $name]);
    }
});

function actingUserWithPermintaanPermissions(array $permissions = [])
{
    $user = User::factory()->create();
    $user->givePermissionTo($permissions ?: [
        'permintaan index', 'permintaan create', 'permintaan edit', 'permintaan delete',
        'permintaan show', 'permintaan change status', 'permintaan approve all normal',
        'permintaan buat pengadaan selisih',
    ]);

    return $user;
}

test('changeStatus on a normal permintaan moves it to proses and reserves stock as jumlah_permintaan', function () {
    $user = actingUserWithPermintaanPermissions();
    $barang = Barangs::factory()->create(['stock_tersedia' => 100, 'jumlah_permintaan' => 0]);

    $permintaan = Permintaan::factory()->create(['urgensi' => 'normal', 'status' => 'pending']);
    $permintaan->barang_permintaan()->create(['barang_id' => $barang->id, 'jumlah' => 10]);

    $response = $this->actingAs($user)->post("/permintaan/{$permintaan->id}/change-status");

    $response->assertRedirect('/permintaan')->assertSessionHas('success');

    $permintaan->refresh();
    expect($permintaan->status)->toBe('proses');

    $barang->refresh();
    expect($barang->jumlah_permintaan)->toBe(10);
    expect($barang->stock_tersedia)->toBe(100); // belum dikurangi, baru direservasi
});

test('changeStatus on an urgent (mendesak) permintaan with sufficient stock finalizes it immediately', function () {
    $user = actingUserWithPermintaanPermissions();
    $barang = Barangs::factory()->create(['stock_tersedia' => 50, 'stock_keluar' => 0]);

    $permintaan = Permintaan::factory()->create(['urgensi' => 'mendesak', 'status' => 'pending']);
    $permintaan->barang_permintaan()->create(['barang_id' => $barang->id, 'jumlah' => 5]);

    $this->actingAs($user)->post("/permintaan/{$permintaan->id}/change-status");

    $permintaan->refresh();
    expect($permintaan->status)->toBe('selesai');

    $barang->refresh();
    expect($barang->stock_tersedia)->toBe(45);
    expect($barang->stock_keluar)->toBe(5);
});

test('changeStatus on an urgent permintaan with insufficient stock auto-creates a deficit pengadaan', function () {
    $user = actingUserWithPermintaanPermissions();
    $barang = Barangs::factory()->create(['stock_tersedia' => 3]);

    $permintaan = Permintaan::factory()->create(['urgensi' => 'mendesak', 'status' => 'pending']);
    $permintaan->barang_permintaan()->create(['barang_id' => $barang->id, 'jumlah' => 10]);

    $this->actingAs($user)->post("/permintaan/{$permintaan->id}/change-status");

    $permintaan->refresh();
    // Masih 'proses', menunggu pengadaan defisit selesai
    expect($permintaan->status)->toBe('proses');

    $pengadaan = Pengadaan::where('permintaan_id', $permintaan->id)->first();
    expect($pengadaan)->not->toBeNull();

    $barangPengadaan = $pengadaan->barang_pengadaan()->first();
    expect($barangPengadaan->barang_id)->toBe($barang->id);
    expect($barangPengadaan->jumlah)->toBe(7); // 10 dibutuhkan - 3 tersedia
});

test('completing the deficit pengadaan re-triggers the urgent permintaan and finalizes it', function () {
    $user = actingUserWithPermintaanPermissions();
    $barang = Barangs::factory()->create(['stock_tersedia' => 3]);

    $permintaan = Permintaan::factory()->create(['urgensi' => 'mendesak', 'status' => 'pending']);
    $permintaan->barang_permintaan()->create(['barang_id' => $barang->id, 'jumlah' => 10]);

    $this->actingAs($user)->post("/permintaan/{$permintaan->id}/change-status");

    $pengadaan = Pengadaan::where('permintaan_id', $permintaan->id)->first();

    // Pengadaan defisit selesai -> addStockMasuk (+7) dan recheckMendesakStock -> finalizeSelesai (-10)
    // keduanya terjadi sinkron dalam satu update(), state akhir langsung 3+7-10 = 0
    $pengadaan->update(['status' => 'selesai']);

    $permintaan->refresh();
    expect($permintaan->status)->toBe('selesai');

    $barang->refresh();
    expect($barang->stock_tersedia)->toBe(0); // 3 + 7 (pengadaan) - 10 (permintaan)
});

test('rejectStatus only works while permintaan is still pending', function () {
    $user = actingUserWithPermintaanPermissions();
    $permintaan = Permintaan::factory()->create(['status' => 'proses']);

    $response = $this->actingAs($user)->post("/permintaan/{$permintaan->id}/reject-status", [
        'alasan_reject' => 'Stok tidak relevan lagi',
    ]);

    $response->assertSessionHas('error');
    $permintaan->refresh();
    expect($permintaan->status)->toBe('proses');
});

test('rejectStatus rejects a pending permintaan with a reason', function () {
    $user = actingUserWithPermintaanPermissions();
    $permintaan = Permintaan::factory()->create(['status' => 'pending']);

    $response = $this->actingAs($user)->post("/permintaan/{$permintaan->id}/reject-status", [
        'alasan_reject' => 'Tidak sesuai anggaran',
    ]);

    $response->assertRedirect('/permintaan')->assertSessionHas('success');

    $permintaan->refresh();
    expect($permintaan->status)->toBe('rejected');
    expect($permintaan->alasan_reject)->toBe('Tidak sesuai anggaran');
});

test('approveAllNormal is blocked when any barang has insufficient stock', function () {
    $user = actingUserWithPermintaanPermissions();
    $barang = Barangs::factory()->create(['stock_tersedia' => 2, 'jumlah_permintaan' => 5]);

    $permintaan = Permintaan::factory()->create(['urgensi' => 'normal', 'status' => 'proses']);
    $permintaan->barang_permintaan()->create(['barang_id' => $barang->id, 'jumlah' => 5]);

    $response = $this->actingAs($user)->post('/permintaan/approve-all-normal');

    $response->assertSessionHas('error');
    $permintaan->refresh();
    expect($permintaan->status)->toBe('proses');
});

test('approveAllNormal finalizes all normal permintaan currently in proses when stock is sufficient', function () {
    $user = actingUserWithPermintaanPermissions();
    $barang = Barangs::factory()->create(['stock_tersedia' => 20, 'jumlah_permintaan' => 5]);

    $permintaan = Permintaan::factory()->create(['urgensi' => 'normal', 'status' => 'proses']);
    $permintaan->barang_permintaan()->create(['barang_id' => $barang->id, 'jumlah' => 5]);

    $response = $this->actingAs($user)->post('/permintaan/approve-all-normal');

    $response->assertSessionHas('success');

    $permintaan->refresh();
    expect($permintaan->status)->toBe('selesai');

    $barang->refresh();
    expect($barang->stock_tersedia)->toBe(15);
    expect($barang->jumlah_permintaan)->toBe(0);
});

test('buatPengadaanSelisih creates a pengadaan covering exactly the stock deficit', function () {
    $user = actingUserWithPermintaanPermissions();
    $barang = Barangs::factory()->create(['stock_tersedia' => 4, 'jumlah_permintaan' => 10]);

    $response = $this->actingAs($user)->post('/permintaan/buat-pengadaan-selisih');

    $response->assertSessionHas('success');

    $pengadaan = Pengadaan::latest()->first();
    expect($pengadaan)->not->toBeNull();

    $barangPengadaan = $pengadaan->barang_pengadaan()->where('barang_id', $barang->id)->first();
    expect($barangPengadaan->jumlah)->toBe(6); // 10 - 4
});

test('buatPengadaanSelisih does nothing when there is no stock deficit', function () {
    $user = actingUserWithPermintaanPermissions();
    Barangs::factory()->create(['stock_tersedia' => 50, 'jumlah_permintaan' => 5]);

    $response = $this->actingAs($user)->post('/permintaan/buat-pengadaan-selisih');

    $response->assertSessionHas('error');
    expect(Pengadaan::count())->toBe(0);
});
