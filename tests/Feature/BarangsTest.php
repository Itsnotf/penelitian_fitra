<?php

use App\Models\Barangs;
use App\Models\TipeBarang;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Permission;

uses(RefreshDatabase::class);

beforeEach(function () {
    Permission::create(['name' => 'barangs index']);
    Permission::create(['name' => 'barangs create']);
    Permission::create(['name' => 'barangs edit']);
    Permission::create(['name' => 'barangs delete']);
});

test('store requires a valid tipe_barang_id and jenis_barang', function () {
    $user = User::factory()->create();
    $user->givePermissionTo('barangs create');

    $response = $this->actingAs($user)->post('/barangs', [
        'nama_barang' => 'Kertas A4',
        'tipe_barang_id' => 9999, // tidak ada
        'jenis_barang' => 'sangat-panjang', // bukan salah satu pendek/sedang/panjang
        'satuan' => 'Rim',
        'stock_awal' => 10,
    ]);

    $response->assertSessionHasErrors(['tipe_barang_id', 'jenis_barang']);
});

test('store creates barang and initializes stock_tersedia from stock_awal', function () {
    $user = User::factory()->create();
    $user->givePermissionTo('barangs create');
    $tipeBarang = TipeBarang::factory()->create();

    $response = $this->actingAs($user)->post('/barangs', [
        'nama_barang' => 'Kertas A4',
        'tipe_barang_id' => $tipeBarang->id,
        'jenis_barang' => 'pendek',
        'satuan' => 'Rim',
        'stock_awal' => 50,
    ]);

    $response->assertRedirect('/barangs')->assertSessionHas('success');
    $this->assertDatabaseHas('barangs', [
        'nama_barang' => 'Kertas A4',
        'tipe_barang_id' => $tipeBarang->id,
        'jenis_barang' => 'pendek',
        'stock_awal' => 50,
        'stock_tersedia' => 50,
        'stock_masuk' => 0,
        'stock_keluar' => 0,
    ]);
});

test('index filters by tipe_barang_id', function () {
    $user = User::factory()->create();
    $user->givePermissionTo('barangs index');

    $atk = TipeBarang::factory()->create(['nama_tipe' => 'ATK']);
    $elektronik = TipeBarang::factory()->create(['nama_tipe' => 'Elektronik']);

    Barangs::factory()->create(['nama_barang' => 'Kertas A4', 'tipe_barang_id' => $atk->id]);
    Barangs::factory()->create(['nama_barang' => 'Laptop', 'tipe_barang_id' => $elektronik->id]);

    $response = $this->actingAs($user)->get('/barangs?tipe_barang_id=' . $atk->id);

    $response->assertInertia(fn ($page) => $page
        ->component('barangs/index')
        ->has('barangs.data', 1)
        ->where('barangs.data.0.nama_barang', 'Kertas A4'));
});

test('index filters by jenis_barang', function () {
    $user = User::factory()->create();
    $user->givePermissionTo('barangs index');

    Barangs::factory()->create(['nama_barang' => 'Barang Pendek', 'jenis_barang' => 'pendek']);
    Barangs::factory()->create(['nama_barang' => 'Barang Panjang', 'jenis_barang' => 'panjang']);

    $response = $this->actingAs($user)->get('/barangs?jenis_barang=panjang');

    $response->assertInertia(fn ($page) => $page
        ->has('barangs.data', 1)
        ->where('barangs.data.0.nama_barang', 'Barang Panjang'));
});

test('index combines search, tipe, jenis, and stok filters together', function () {
    $user = User::factory()->create();
    $user->givePermissionTo('barangs index');

    $atk = TipeBarang::factory()->create(['nama_tipe' => 'ATK']);

    // Cocok semua filter
    Barangs::factory()->create([
        'nama_barang' => 'Kertas A4 Sinar Mas',
        'tipe_barang_id' => $atk->id,
        'jenis_barang' => 'pendek',
        'stock_tersedia' => 5,
    ]);

    // Tipe & jenis cocok, tapi nama tidak cocok search
    Barangs::factory()->create([
        'nama_barang' => 'Spidol Boardmarker',
        'tipe_barang_id' => $atk->id,
        'jenis_barang' => 'pendek',
        'stock_tersedia' => 5,
    ]);

    // Nama & tipe & jenis cocok, tapi stok tidak rendah
    Barangs::factory()->create([
        'nama_barang' => 'Kertas A4 Lokal',
        'tipe_barang_id' => $atk->id,
        'jenis_barang' => 'pendek',
        'stock_tersedia' => 100,
    ]);

    $response = $this->actingAs($user)->get('/barangs?' . http_build_query([
        'search' => 'Kertas A4',
        'tipe_barang_id' => $atk->id,
        'jenis_barang' => 'pendek',
        'stok' => 'rendah',
    ]));

    $response->assertInertia(fn ($page) => $page
        ->has('barangs.data', 1)
        ->where('barangs.data.0.nama_barang', 'Kertas A4 Sinar Mas'));
});

test('downloadPdf follows the same filters as the index page', function () {
    $user = User::factory()->create();

    $atk = TipeBarang::factory()->create(['nama_tipe' => 'ATK']);
    Barangs::factory()->create(['nama_barang' => 'Kertas A4', 'tipe_barang_id' => $atk->id, 'jenis_barang' => 'pendek']);
    Barangs::factory()->create(['nama_barang' => 'Laptop', 'jenis_barang' => 'panjang']);

    $response = $this->actingAs($user)->get('/barangs/download-pdf?tipe_barang_id=' . $atk->id);

    $response->assertStatus(200);
    expect($response->headers->get('content-type'))->toContain('application/pdf');
});
