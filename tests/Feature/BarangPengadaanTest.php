<?php

use App\Models\Barang_Pengadaan;
use App\Models\Barangs;
use App\Models\Pengadaan;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Permission;

uses(RefreshDatabase::class);

beforeEach(function () {
    foreach ([
        'pengadaan barang create', 'pengadaan barang edit', 'pengadaan barang delete',
    ] as $name) {
        Permission::create(['name' => $name]);
    }
});

function actingUserWithBarangPengadaanPermissions()
{
    $user = User::factory()->create();
    $user->givePermissionTo([
        'pengadaan barang create', 'pengadaan barang edit', 'pengadaan barang delete',
    ]);

    return $user;
}

test('create page excludes barangs already added to this pengadaan', function () {
    $user = actingUserWithBarangPengadaanPermissions();
    $pengadaan = Pengadaan::factory()->create();
    $sudahAda = Barangs::factory()->create(['nama_barang' => 'Sudah Ada']);
    $belumAda = Barangs::factory()->create(['nama_barang' => 'Belum Ada']);

    $pengadaan->barang_pengadaan()->create(['barang_id' => $sudahAda->id, 'jumlah' => 1, 'harga' => 100]);

    $response = $this->actingAs($user)->get("/pengadaan/{$pengadaan->id}/barangs/create");

    $response->assertInertia(fn ($page) => $page
        ->has('barangs', 1)
        ->where('barangs.0.nama_barang', 'Belum Ada'));
});

test('store adds multiple items in a single request and recalculates total_harga', function () {
    $user = actingUserWithBarangPengadaanPermissions();
    $pengadaan = Pengadaan::factory()->create(['total_harga' => 0]);
    $barangA = Barangs::factory()->create();
    $barangB = Barangs::factory()->create();

    $response = $this->actingAs($user)->post("/pengadaan/{$pengadaan->id}/barangs", [
        'items' => [
            ['barang_id' => $barangA->id, 'jumlah' => 2, 'harga' => 10000],
            ['barang_id' => $barangB->id, 'jumlah' => 1, 'harga' => 50000],
        ],
    ]);

    $response->assertRedirect("/pengadaan/{$pengadaan->id}")->assertSessionHas('success');

    expect($pengadaan->barang_pengadaan()->count())->toBe(2);

    $pengadaan->refresh();
    expect((int) $pengadaan->total_harga)->toBe(70000); // (2*10000) + (1*50000)
});

test('store rejects duplicate barang within the same submission', function () {
    $user = actingUserWithBarangPengadaanPermissions();
    $pengadaan = Pengadaan::factory()->create();
    $barang = Barangs::factory()->create();

    $response = $this->actingAs($user)->post("/pengadaan/{$pengadaan->id}/barangs", [
        'items' => [
            ['barang_id' => $barang->id, 'jumlah' => 1, 'harga' => 1000],
            ['barang_id' => $barang->id, 'jumlah' => 2, 'harga' => 2000],
        ],
    ]);

    $response->assertSessionHasErrors(['items']);
    expect(Barang_Pengadaan::count())->toBe(0);
});

test('store rejects a barang that is already attached to this pengadaan', function () {
    $user = actingUserWithBarangPengadaanPermissions();
    $pengadaan = Pengadaan::factory()->create();
    $barang = Barangs::factory()->create();
    $pengadaan->barang_pengadaan()->create(['barang_id' => $barang->id, 'jumlah' => 1, 'harga' => 1000]);

    $response = $this->actingAs($user)->post("/pengadaan/{$pengadaan->id}/barangs", [
        'items' => [
            ['barang_id' => $barang->id, 'jumlah' => 5, 'harga' => 1000],
        ],
    ]);

    $response->assertSessionHasErrors(['items']);
    expect($pengadaan->barang_pengadaan()->count())->toBe(1);
});

test('update edits a single barang pengadaan line item', function () {
    $user = actingUserWithBarangPengadaanPermissions();
    $pengadaan = Pengadaan::factory()->create();
    $barang = Barangs::factory()->create();
    $barangPengadaan = $pengadaan->barang_pengadaan()->create(['barang_id' => $barang->id, 'jumlah' => 1, 'harga' => 1000]);

    $response = $this->actingAs($user)->put("/pengadaan/{$pengadaan->id}/barangs/{$barangPengadaan->id}", [
        'barang_id' => $barang->id,
        'jumlah' => 9,
        'harga' => 2500,
    ]);

    $response->assertRedirect("/pengadaan/{$pengadaan->id}")->assertSessionHas('success');

    $barangPengadaan->refresh();
    expect($barangPengadaan->jumlah)->toBe(9);
    expect((int) $barangPengadaan->harga)->toBe(2500);
});
