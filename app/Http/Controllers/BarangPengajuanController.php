<?php

namespace App\Http\Controllers;

use App\Http\Requests\BarangPengajuan\StoreRequest;
use App\Models\Barang_Pengajuan;
use App\Models\Barangs;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BarangPengajuanController extends Controller
{
    /**
     * Show the form for creating a new resource.
     */
    public function create(string $pengajuan_id)
    {
        $barangs = Barangs::all(); 
        return Inertia::render('pengajuans/barangs/create', [
            'pengajuan_id' => $pengajuan_id,
            'barangs' => $barangs
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(string $pengajuan_id, StoreRequest $request)
    {
        $validated = $request->validated();
        $validated['pengajuan_id'] = $pengajuan_id;
        
        Barang_Pengajuan::create($validated);
        
        return redirect()->route('pengajuans.show', $pengajuan_id)->with('success', 'Barang Pengajuan created successfully.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Barang_Pengajuan $barang_Pengajuan, string $pengajuan_id)
    {
        $barangs = Barangs::all();
        return Inertia::render('pengajuans/barangs/edit', [
            'pengajuan_id' => $pengajuan_id,
            'barang_pengajuan' => $barang_Pengajuan,
            'barangs' => $barangs
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Barang_Pengajuan $barang_Pengajuan, string $pengajuan_id, StoreRequest $request)
    {
        $validated = $request->validated();
        $barang_Pengajuan->update($validated);
        
        return redirect()->route('pengajuans.show', $pengajuan_id)->with('success', 'Barang Pengajuan updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Barang_Pengajuan $barang_Pengajuan, string $pengajuan_id)
    {
        $barang_Pengajuan->delete();
        
        return redirect()->route('pengajuans.show', $pengajuan_id)->with('success', 'Barang Pengajuan deleted successfully.');
    }
}
