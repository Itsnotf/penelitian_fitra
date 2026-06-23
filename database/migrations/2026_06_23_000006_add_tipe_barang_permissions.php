<?php

use Illuminate\Database\Migrations\Migration;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

return new class extends Migration
{
    private array $permissions = [
        'tipe barangs index',
        'tipe barangs create',
        'tipe barangs edit',
        'tipe barangs delete',
    ];

    public function up(): void
    {
        foreach ($this->permissions as $name) {
            Permission::firstOrCreate(['name' => $name, 'guard_name' => 'web']);
        }

        $admin = Role::where('name', 'Admin')->first();
        $admin?->givePermissionTo($this->permissions);

        $tataUsaha = Role::where('name', 'Tata Usaha')->first();
        $tataUsaha?->givePermissionTo($this->permissions);
    }

    public function down(): void
    {
        Permission::whereIn('name', $this->permissions)->get()->each(fn ($permission) => $permission->delete());
    }
};
