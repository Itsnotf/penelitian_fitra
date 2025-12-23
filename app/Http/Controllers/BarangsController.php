<?php

namespace App\Http\Controllers;

use App\Http\Requests\Barang\StoreRequest;
use App\Http\Requests\Barang\UpdateRequest;
use App\Models\Barangs;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Inertia\Inertia;

class BarangsController extends Controller implements HasMiddleware
{
    public static function middleware()
    {
        return [
            new Middleware('permission:barangs index', only: ['index']),
            new Middleware('permission:barangs create', only: ['create', 'store']),
            new Middleware('permission:barangs edit', only: ['edit', 'update   ']),
            new Middleware('permission:barangs delete', only: ['destroy']),
        ];
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $barangs = Barangs::when($request->search, function ($query, $search) {
            $query->where('nama_barang', 'like', "%{$search}%");
        })
            ->paginate(8)
            ->withQueryString();

        return inertia('barangs/index', [
            'barangs' => $barangs,
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
        return Inertia::render('barangs/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRequest $request)
    {
        Barangs::create($request->validated());

        return redirect()->route('barangs.index')->with('success', 'Barang created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Barangs $barangs)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $barang = Barangs::findOrFail($id);
        return Inertia::render('barangs/edit', [
            'barang' => $barang,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRequest $request, string $id)
    {
        $barang = Barangs::findOrFail($id);
        $barang->update($request->validated());

        return redirect()->route('barangs.index')->with('success', 'Barang updated successfully.');
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $barang = Barangs::findOrFail($id);
        $barang->delete();

        return redirect()->route('barangs.index')->with('success', 'Barang deleted successfully.');
    }
}
