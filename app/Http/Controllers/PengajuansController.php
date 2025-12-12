<?php

namespace App\Http\Controllers;

use App\Http\Requests\Pengajuan\StoreRequest;
use App\Http\Requests\Pengajuan\UpdateRequest;
use App\Models\Barang_Pengajuan;
use App\Models\Pengajuans;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PengajuansController extends Controller implements HasMiddleware
{
    public static function middleware()
    {
        return [
            new Middleware('permission:pengajuans index', only: ['index']),
            new Middleware('permission:pengajuans create', only: ['create', 'store']),
            new Middleware('permission:pengajuans show', only: ['show']),
            new Middleware('permission:pengajuans edit', only: ['edit', 'update']),
            new Middleware('permission:pengajuans delete', only: ['destroy']),
            new Middleware('permission:pengajuans change status', only: ['changeStatus']),
        ];
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $pengajuans = Pengajuans::with('user')->when($request->search, function ($query, $search) {
            $query->where('deskripsi', 'like', "%{$search}%");
        })
            ->paginate(8)
            ->withQueryString();

        return inertia('pengajuans/index', [
            'pengajuans' => $pengajuans,
            'filters' => $request->only('search'),
            'flash' => [
                'success' => session('success'),
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('pengajuans/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRequest $request)
    {
        $user = Auth::user();
        $data = [
            'user_id' => $user->id,
            'status' => 'pending',
        ];

        $finalData = $request->merge($data);
        Pengajuans::create($finalData->all());

        return redirect()->route('pengajuans.index')->with('success', 'Pengajuan created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $pengajuan_id, Request $request)
    {
        $barangs = Barang_Pengajuan::with('barang', 'pengajuan')
            ->when($request->search, function ($query, $search) {
                $query->whereHas('barang', function ($q) use ($search) {
                    $q->where('nama_barang', 'like', "%{$search}%");
                });
            })
            ->where('pengajuan_id', $pengajuan_id)
            ->paginate(8)
            ->withQueryString();

        $pengajuan = Pengajuans::findOrFail($pengajuan_id);

        return inertia('pengajuans/barangs/index', [
            'barangs' => $barangs,
            'pengajuan' => $pengajuan,
            'filters' => $request->only('search'),
            'flash' => [
                'success' => session('success'),
            ],
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $pengajuan = Pengajuans::findOrFail($id);
        return Inertia::render('pengajuans/edit', [
            'pengajuan' => $pengajuan,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRequest $request, string $id)
    {
        $pengajuan = Pengajuans::findOrFail($id);
        $pengajuan->update($request->validated());

        return redirect()->route('pengajuans.index')->with('success', 'Pengajuan updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $pengajuan = Pengajuans::findOrFail($id);
        $pengajuan->delete();
        return redirect()->route('pengajuans.index')->with('success', 'Pengajuan deleted successfully.');
    }

    /**
     * Change pengajuan status
     */
    public function changeStatus(string $id)
    {
        $pengajuan = Pengajuans::findOrFail($id);
        
        // Validasi: status approved/rejected tidak bisa diubah
        if ($pengajuan->status !== 'pending') {
            return redirect()->route('pengajuans.index')->with('error', 'Status tidak dapat diubah.');
        }

        // Ubah status ke approved
        $pengajuan->status = 'approved';
        $pengajuan->save();

        return redirect()->route('pengajuans.index')->with('success', 'Pengajuan status berhasil diubah ke approved.');
    }

    /**
     * Reject pengajuan status
     */
    public function rejectStatus(string $id)
    {
        $pengajuan = Pengajuans::findOrFail($id);
        
        // Validasi: status approved/rejected tidak bisa diubah
        if ($pengajuan->status !== 'pending') {
            return redirect()->route('pengajuans.index')->with('error', 'Status tidak dapat diubah.');
        }

        // Ubah status ke rejected
        $pengajuan->status = 'rejected';
        $pengajuan->save();

        return redirect()->route('pengajuans.index')->with('success', 'Pengajuan berhasil ditolak.');
    }
}
