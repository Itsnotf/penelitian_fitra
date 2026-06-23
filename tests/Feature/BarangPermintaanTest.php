<?php

use App\Models\Barang_Permintaan;
use App\Models\Barangs;
use App\Models\Permintaan;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Permission;

uses(RefreshDatabase::class);

beforeEach(function () {
    foreach ([
        'permintaan barang create', 'permintaan barang edit', 'permintaan barang delete',
    ] as $name) {
        Permission::create(['name' => $name]);
    }
});

function actingUserWithBarangPermintaanPermissions()
{
    $user = User::factory()->create();
    $user->givePermissionTo([
        'permintaan barang create', 'permintaan barang edit', 'permintaan barang delete',
    ]);

    return $user;
}

test('create page excludes barangs already added to this permintaan', function () {
    $user = actingUserWithBarangPermintaanPermissions();
    $permintaan = Permintaan::factory()->create();
    $sudahAda = Barangs::factory()->create(['nama_barang' => 'Sudah Ada']);
    $belumAda = Barangs::factory()->create(['nama_barang' => 'Belum Ada']);

    $permintaan->barang_permintaan()->create(['barang_id' => $sudahAda->id, 'jumlah' => 1]);

    $response = $this->actingAs($user)->get("/permintaan/{$permintaan->id}/barangs/create");

    $response->assertInertia(fn ($page) => $page
        ->has('barangs', 1)
        ->where('barangs.0.nama_barang', 'Belum Ada'));
});

test('store adds multiple items to a permintaan in a single request', function () {
    $user = actingUserWithBarangPermintaanPermissions();
    $permintaan = Permintaan::factory()->create();
    $barangA = Barangs::factory()->create();
    $barangB = Barangs::factory()->create();

    $response = $this->actingAs($user)->post("/permintaan/{$permintaan->id}/barangs", [
        'items' => [
            ['barang_id' => $barangA->id, 'jumlah' => 3],
            ['barang_id' => $barangB->id, 'jumlah' => 1],
        ],
    ]);

    $response->assertRedirect("/permintaan/{$permintaan->id}")->assertSessionHas('success');
    expect($permintaan->barang_permintaan()->count())->toBe(2);
});

test('store rejects duplicate barang within the same submission', function () {
    $user = actingUserWithBarangPermintaanPermissions();
    $permintaan = Permintaan::factory()->create();
    $barang = Barangs::factory()->create();

    $response = $this->actingAs($user)->post("/permintaan/{$permintaan->id}/barangs", [
        'items' => [
            ['barang_id' => $barang->id, 'jumlah' => 1],
            ['barang_id' => $barang->id, 'jumlah' => 2],
        ],
    ]);

    $response->assertSessionHasErrors(['items']);
    expect(Barang_Permintaan::count())->toBe(0);
});

test('store rejects a barang that is already attached to this permintaan', function () {
    $user = actingUserWithBarangPermintaanPermissions();
    $permintaan = Permintaan::factory()->create();
    $barang = Barangs::factory()->create();
    $permintaan->barang_permintaan()->create(['barang_id' => $barang->id, 'jumlah' => 1]);

    $response = $this->actingAs($user)->post("/permintaan/{$permintaan->id}/barangs", [
        'items' => [
            ['barang_id' => $barang->id, 'jumlah' => 5],
        ],
    ]);

    $response->assertSessionHasErrors(['items']);
    expect($permintaan->barang_permintaan()->count())->toBe(1);
});

test('update edits a single barang permintaan line item', function () {
    $user = actingUserWithBarangPermintaanPermissions();
    $permintaan = Permintaan::factory()->create();
    $barang = Barangs::factory()->create();
    $barangPermintaan = $permintaan->barang_permintaan()->create(['barang_id' => $barang->id, 'jumlah' => 1]);

    $response = $this->actingAs($user)->put("/permintaan/{$permintaan->id}/barangs/{$barangPermintaan->id}", [
        'barang_id' => $barang->id,
        'jumlah' => 12,
    ]);

    $response->assertRedirect("/permintaan/{$permintaan->id}")->assertSessionHas('success');

    $barangPermintaan->refresh();
    expect($barangPermintaan->jumlah)->toBe(12);
});
