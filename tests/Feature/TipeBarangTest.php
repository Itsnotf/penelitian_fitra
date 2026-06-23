<?php

use App\Models\Barangs;
use App\Models\TipeBarang;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Permission;

uses(RefreshDatabase::class);

beforeEach(function () {
    Permission::firstOrCreate(['name' => 'tipe barangs index']);
    Permission::firstOrCreate(['name' => 'tipe barangs create']);
    Permission::firstOrCreate(['name' => 'tipe barangs edit']);
    Permission::firstOrCreate(['name' => 'tipe barangs delete']);
});

test('unauthorized user cannot access tipe barangs index', function () {
    $user = User::factory()->create();

    $this->actingAs($user)->get('/tipe-barangs')->assertStatus(403);
});

test('authorized user can view tipe barangs index', function () {
    $user = User::factory()->create();
    $user->givePermissionTo('tipe barangs index');

    TipeBarang::factory()->count(3)->create();

    $this->actingAs($user)
        ->get('/tipe-barangs')
        ->assertStatus(200)
        ->assertInertia(fn ($page) => $page
            ->component('tipe-barangs/index')
            ->has('tipeBarangs.data', 3));
});

test('authorized user can create a new tipe barang', function () {
    $user = User::factory()->create();
    $user->givePermissionTo('tipe barangs create');

    $response = $this->actingAs($user)->post('/tipe-barangs', [
        'nama_tipe' => 'Alat Tulis Kantor',
    ]);

    $response->assertRedirect('/tipe-barangs')->assertSessionHas('success');
    $this->assertDatabaseHas('tipe_barangs', ['nama_tipe' => 'Alat Tulis Kantor']);
});

test('cannot create tipe barang with duplicate name', function () {
    $user = User::factory()->create();
    $user->givePermissionTo('tipe barangs create');

    TipeBarang::factory()->create(['nama_tipe' => 'Elektronik']);

    $response = $this->actingAs($user)->post('/tipe-barangs', [
        'nama_tipe' => 'Elektronik',
    ]);

    $response->assertSessionHasErrors(['nama_tipe']);
});

test('authorized user can update a tipe barang', function () {
    $user = User::factory()->create();
    $user->givePermissionTo('tipe barangs edit');

    $tipeBarang = TipeBarang::factory()->create(['nama_tipe' => 'Lama']);

    $response = $this->actingAs($user)->put("/tipe-barangs/{$tipeBarang->id}", [
        'nama_tipe' => 'Baru',
    ]);

    $response->assertRedirect('/tipe-barangs');
    $this->assertDatabaseHas('tipe_barangs', ['id' => $tipeBarang->id, 'nama_tipe' => 'Baru']);
});

test('authorized user can delete a tipe barang that is not in use', function () {
    $user = User::factory()->create();
    $user->givePermissionTo('tipe barangs delete');

    $tipeBarang = TipeBarang::factory()->create();

    $response = $this->actingAs($user)->delete("/tipe-barangs/{$tipeBarang->id}");

    $response->assertRedirect('/tipe-barangs')->assertSessionHas('success');
    $this->assertDatabaseMissing('tipe_barangs', ['id' => $tipeBarang->id]);
});

test('cannot delete a tipe barang that is still used by a barang', function () {
    $user = User::factory()->create();
    $user->givePermissionTo('tipe barangs delete');

    $tipeBarang = TipeBarang::factory()->create();
    Barangs::factory()->create(['tipe_barang_id' => $tipeBarang->id]);

    $response = $this->actingAs($user)->delete("/tipe-barangs/{$tipeBarang->id}");

    $response->assertRedirect('/tipe-barangs')->assertSessionHas('error');
    $this->assertDatabaseHas('tipe_barangs', ['id' => $tipeBarang->id]);
});
