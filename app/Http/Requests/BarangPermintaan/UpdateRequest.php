<?php

namespace App\Http\Requests\BarangPermintaan;

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
            'barang_id' => 'required|exists:barangs,id',
            'jumlah'    => 'required|integer|min:1',
        ];
    }
}
