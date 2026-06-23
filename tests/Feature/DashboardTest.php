<?php

use App\Models\User;
use Spatie\Permission\Models\Permission;

test('guests are redirected to the login page', function () {
    $this->get(route('dashboard'))->assertRedirect(route('login'));
});

test('authenticated users can visit the dashboard', function () {
    Permission::firstOrCreate(['name' => 'dashboard']);

    $user = User::factory()->create();
    $user->givePermissionTo('dashboard');

    $this->actingAs($user)->get(route('dashboard'))->assertOk();
});