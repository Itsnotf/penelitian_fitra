<?php

namespace App\Http\Controllers;

use App\Http\Requests\TipeBarang\StoreRequest;
use App\Http\Requests\TipeBarang\UpdateRequest;
use App\Models\TipeBarang;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Inertia\Inertia;

class TipeBarangController extends Controller implements HasMiddleware
{
    public static function middleware()
    {
        return [
            new Middleware('permission:tipe barangs index', only: ['index']),
            new Middleware('permission:tipe barangs create', only: ['create', 'store']),
            new Middleware('permission:tipe barangs edit', only: ['edit', 'update']),
            new Middleware('permission:tipe barangs delete', only: ['destroy']),
        ];
    }

    public function index(Request $request)
    {
        $tipeBarangs = TipeBarang::withCount('barangs')
            ->when($request->search, fn($q, $s) => $q->where('nama_tipe', 'like', "%{$s}%"))
            ->orderBy('nama_tipe')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('tipe-barangs/index', [
            'tipeBarangs' => $tipeBarangs,
            'filters'     => $request->only('search'),
            'flash'       => ['success' => session('success'), 'error' => session('error')],
        ]);
    }

    public function create()
    {
        return Inertia::render('tipe-barangs/create');
    }

    public function store(StoreRequest $request)
    {
        TipeBarang::create($request->validated());

        return redirect()->route('tipe-barangs.index')->with('success', 'Tipe barang berhasil ditambahkan.');
    }

    public function edit(string $tipe_barang)
    {
        $tipeBarang = TipeBarang::findOrFail($tipe_barang);

        return Inertia::render('tipe-barangs/edit', ['tipeBarang' => $tipeBarang]);
    }

    public function update(UpdateRequest $request, string $tipe_barang)
    {
        $tipeBarang = TipeBarang::findOrFail($tipe_barang);
        $tipeBarang->update($request->validated());

        return redirect()->route('tipe-barangs.index')->with('success', 'Tipe barang berhasil diperbarui.');
    }

    public function destroy(string $tipe_barang)
    {
        $tipeBarang = TipeBarang::findOrFail($tipe_barang);

        if ($tipeBarang->barangs()->exists()) {
            return redirect()->route('tipe-barangs.index')
                ->with('error', 'Tipe barang ini masih dipakai oleh barang lain, tidak bisa dihapus.');
        }

        $tipeBarang->delete();

        return redirect()->route('tipe-barangs.index')->with('success', 'Tipe barang berhasil dihapus.');
    }
}
