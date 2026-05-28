<?php

namespace App\Http\Controllers;

use App\Models\Vendor;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Inertia\Inertia;

class VendorController extends Controller implements HasMiddleware
{
    public static function middleware()
    {
        return [
            new Middleware('permission:vendors index', only: ['index']),
            new Middleware('permission:vendors create', only: ['create', 'store']),
            new Middleware('permission:vendors edit', only: ['edit', 'update']),
            new Middleware('permission:vendors delete', only: ['destroy']),
        ];
    }

    public function index(Request $request)
    {
        $vendors = Vendor::withCount('barangVendors')
            ->when($request->search, fn($q, $s) => $q->where('nama_vendor', 'like', "%{$s}%"))
            ->paginate(8)
            ->withQueryString();

        return Inertia::render('vendors/index', [
            'vendors' => $vendors,
            'filters' => $request->only('search'),
            'flash'   => ['success' => session('success')],
        ]);
    }

    public function create()
    {
        return Inertia::render('vendors/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_vendor' => 'required|string|max:255',
            'alamat'      => 'nullable|string|max:500',
            'telepon'     => 'nullable|string|max:50',
            'email'       => 'nullable|email|max:255',
        ]);

        Vendor::create($validated);

        return redirect()->route('vendors.index')->with('success', 'Vendor berhasil ditambahkan.');
    }

    public function edit(string $id)
    {
        $vendor = Vendor::findOrFail($id);
        return Inertia::render('vendors/edit', ['vendor' => $vendor]);
    }

    public function update(Request $request, string $id)
    {
        $vendor = Vendor::findOrFail($id);

        $validated = $request->validate([
            'nama_vendor' => 'required|string|max:255',
            'alamat'      => 'nullable|string|max:500',
            'telepon'     => 'nullable|string|max:50',
            'email'       => 'nullable|email|max:255',
        ]);

        $vendor->update($validated);

        return redirect()->route('vendors.index')->with('success', 'Vendor berhasil diperbarui.');
    }

    public function destroy(string $id)
    {
        $vendor = Vendor::findOrFail($id);
        $vendor->delete();

        return redirect()->route('vendors.index')->with('success', 'Vendor berhasil dihapus.');
    }
}
