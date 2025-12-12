<?php

namespace App\Http\Requests\Barang;

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
            'nama_barang' => 'required|string|max:255',
            'tipe' => 'required|string|max:255',
            'stock_awal' => 'required|integer|min:0',
            'stock_masuk' => 'required|integer|min:0',
            'stock_keluar' => 'required|integer|min:0',
            'stock_tersedia' => 'required|integer|min:0',
        ];
    }
}
