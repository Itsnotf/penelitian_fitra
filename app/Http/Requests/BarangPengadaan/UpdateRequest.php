<?php

namespace App\Http\Requests\BarangPengadaan;

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
            'pembelian_id' => 'required|exists:pengadaan,id',
            'barang_id'    => 'required|exists:barangs,id',
            'harga'        => 'required|string|max:255',
            'jumlah'       => 'required|string|max:255',
        ];
    }
}
