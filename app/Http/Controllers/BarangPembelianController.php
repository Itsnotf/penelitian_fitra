<?php

namespace App\Http\Controllers;

use App\Http\Requests\BarangPembelian\StoreRequest;
use App\Http\Requests\BarangPembelian\UpdateRequest;
use App\Models\Barang_Pembelian;
use App\Models\Barangs;
use App\Models\Pembelians;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Inertia\Inertia;

class BarangPembelianController extends Controller implements HasMiddleware
{
    public static function middleware()
    {
        return [
            new Middleware('permission:pembelians barang create', only: ['create', 'store']),
            new Middleware('permission:pembelians barang edit', only: ['edit', 'update   ']),
            new Middleware('permission:pembelians barang delete', only: ['destroy']),
        ];
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request) {}

    /**
     * Show the form for creating a new resource.
     */
    public function create(string $pembelian_id)
    {
        $pembelian = Pembelians::findOrFail($pembelian_id);
        
        if ($pembelian->status === 'finished') {
            return redirect()->route('pembelians.show', $pembelian_id)
                ->with('error', 'Cannot add barang to finished pembelian.');
        }
        
        $barangs = Barangs::all();
        return Inertia::render('pembelians/barangs/create', [
            'pembelian_id' => $pembelian_id,
            'pembelian' => $pembelian,
            'barangs' => $barangs
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(string $pembelian_id, StoreRequest $request)
    {
        $pembelian = Pembelians::findOrFail($pembelian_id);
        
        if ($pembelian->status === 'finished') {
            return redirect()->route('pembelians.show', $pembelian_id)
                ->with('error', 'Cannot add barang to finished pembelian.');
        }
        
        $validated = $request->validated();
        $validated['pembelian_id'] = $pembelian_id;

        Barang_Pembelian::create($validated);

        return redirect()->route('pembelians.show', $pembelian_id)->with('success', 'Barang Pembelian created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Barang_Pembelian $barang_Pembelian)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $pembelian_id, string $barang_Pembelian_id)
    {
        $pembelian = Pembelians::findOrFail($pembelian_id);
        $barang_Pembelian = Barang_Pembelian::findOrFail($barang_Pembelian_id);
        
        if ($pembelian->status === 'finished') {
            return redirect()->route('pembelians.show', $pembelian_id)
                ->with('error', 'Cannot edit barang in finished pembelian.');
        }
        
        $barangs = Barangs::all();
        return Inertia::render('pembelians/barangs/edit', [
            'pembelian_id' => $pembelian_id,
            'pembelian' => $pembelian,
            'barang_pembelian' => $barang_Pembelian,
            'barangs' => $barangs
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(string $pembelian_id, string $barang_Pembelian_id, UpdateRequest $request)
    {
        $pembelian = Pembelians::findOrFail($pembelian_id);
        
        if ($pembelian->status === 'finished') {
            return redirect()->route('pembelians.show', $pembelian_id)
                ->with('error', 'Cannot edit barang in finished pembelian.');
        }
        
        $barang_Pembelian = Barang_Pembelian::findOrFail($barang_Pembelian_id);
        $validated = $request->validated();
        $validated['pembelian_id'] = $pembelian_id;
        $barang_Pembelian->update($validated);

        return redirect()->route('pembelians.show', $pembelian_id)->with('success', 'Barang Pembelian updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Barang_Pembelian $barang_Pembelian, string $pembelian_id)
    {
        $pembelian = Pembelians::findOrFail($pembelian_id);
        
        if ($pembelian->status === 'finished') {
            return redirect()->route('pembelians.show', $pembelian_id)
                ->with('error', 'Cannot delete barang from finished pembelian.');
        }
        
        $barang_Pembelian->delete();

        return redirect()->route('pembelians.show', $pembelian_id)->with('success', 'Barang Pembelian deleted successfully.');
    }
}
