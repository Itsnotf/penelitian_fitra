<?php

namespace App\Http\Requests\Barang;

use Illuminate\Foundation\Http\FormRequest;

class UpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nama_barang'    => 'required|string|max:255',
            'tipe_barang_id' => 'required|exists:tipe_barangs,id',
            'jenis_barang'   => 'required|in:habis_pakai,tidak_habis_pakai',
            'satuan'         => 'required|string|max:50',
            'stock_awal'     => 'required|integer|min:0',
        ];
    }
}
