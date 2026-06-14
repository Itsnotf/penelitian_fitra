<?php

namespace App\Http\Requests\Pengajuan;

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
            'deskripsi'             => 'required|string|max:1000',
            'urgensi'               => 'required|in:normal,mendesak',
            'items'                 => 'required|array|min:1',
            'items.*.barang_id'     => 'required|exists:barangs,id',
            'items.*.jumlah'        => 'required|integer|min:1',
        ];
    }

    public function messages(): array
    {
        return [
            'items.required'             => 'Minimal tambahkan 1 barang.',
            'items.min'                  => 'Minimal tambahkan 1 barang.',
            'items.*.barang_id.required' => 'Pilih barang.',
            'items.*.barang_id.exists'   => 'Barang tidak valid.',
            'items.*.jumlah.required'    => 'Jumlah wajib diisi.',
            'items.*.jumlah.min'         => 'Jumlah minimal 1.',
        ];
    }
}
