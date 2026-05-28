<?php

namespace App\Http\Requests\Barang;

use Illuminate\Foundation\Http\FormRequest;

class StoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nama_barang' => 'required|string|max:255',
            'tipe'        => 'required|string|max:255',
            'satuan'      => 'required|string|max:50',
            'stock_awal'  => 'required|integer|min:0',
        ];
    }
}
