<?php

namespace App\Http\Requests\BarangPembelian;

use Illuminate\Foundation\Http\FormRequest;

class UpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'pembelian_id' => 'required|exists:pembelians,id',
            'barang_id' => 'required|exists:barangs,id',
            'harga' => 'required|string|max:255',
            'jumlah' => 'required|string|max:255',
        ];
    }
}
