<?php

namespace App\Http\Controllers;

use App\Http\Requests\Pembelian\StoreRequest;
use App\Http\Requests\Pembelian\UpdateRequest;
use App\Models\Barang_Pembelian;
use App\Models\Pembelians;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PembeliansController extends Controller implements HasMiddleware
{

    public static function middleware()
    {
        return [
            new Middleware('permission:pembelians index', only: ['index']),
            new Middleware('permission:pembelians create', only: ['create', 'store']),
            new Middleware('permission:pembelians show', only: ['show']),
            new Middleware('permission:pembelians edit', only: ['edit', 'update']),
            new Middleware('permission:pembelians delete', only: ['destroy']),
            new Middleware('permission:pembelians change status', only: ['changeStatus']),
            new Middleware('permission:pembelians show', only: ['downloadPdf']),
        ];
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $pembelians = Pembelians::with('user')->when($request->search, function ($query, $search) {
            $query->where('vendor', 'like', "%{$search}%");
        })
            ->paginate(8)
            ->withQueryString();

        return inertia('pembelians/index', [
            'pembelians' => $pembelians,
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
        return Inertia::render('pembelians/create');
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
            'total_harga' => 0,
        ];

        $finalData = $request->merge($data);
        Pembelians::create($finalData->all());

        return redirect()->route('pembelians.index')->with('success', 'Pembelian created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $pembelian_id, Request $request)
    {
        $barangs = Barang_Pembelian::with('barang', 'pembelian')
            ->when($request->search, function ($query, $search) {
                $query->whereHas('barang', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%");
                });
                $query->whereHas('pembelian', function ($q) use ($search) {
                    $q->where('vendor', 'like', "%{$search}%");
                });
            })
            ->where('pembelian_id', $pembelian_id)
            ->paginate(8)
            ->withQueryString();

        $pembelian = Pembelians::findOrFail($pembelian_id);

        return inertia('pembelians/barangs/index', [
            'barangs' => $barangs,
            'pembelian' => $pembelian,
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
        $pembelian = Pembelians::findOrFail($id);
        return Inertia::render('pembelians/edit', [
            'pembelian' => $pembelian,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRequest $request, string $id)
    {
        $pembelian = Pembelians::findOrFail($id);
        $pembelian->update($request->validated());

        return redirect()->route('pembelians.index')->with('success', 'Pembelian updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $pembelian = Pembelians::findOrFail($id);
        $pembelian->delete();
        return redirect()->route('pembelians.index')->with('success', 'Pembelian deleted successfully.');
    }

    /**
     * Change pembelian status
     */
    public function changeStatus(string $id)
    {
        $pembelian = Pembelians::findOrFail($id);
        
        // Validasi: status finished tidak bisa diubah
        if ($pembelian->status === 'finished') {
            return redirect()->route('pembelians.index')->with('error', 'Status finished tidak dapat diubah.');
        }

        // Ubah status ke finished
        $pembelian->status = 'finished';
        $pembelian->save();

        return redirect()->route('pembelians.index')->with('success', 'Pembelian status berhasil diubah ke finished.');
    }

    /**
     * Download pembelian as PDF
     */
    public function downloadPdf(string $id)
    {
        $pembelian = Pembelians::with('barang_pembelians.barang', 'user')->findOrFail($id);
        
        $html = view('pdf.pembelian', ['pembelian' => $pembelian])->render();
        
        $pdf = Pdf::loadHTML($html);
        $pdf->setPaper('A4', 'portrait');
        
        return $pdf->download("Laporan-Pembelian-{$pembelian->id}.pdf");
    }
}
