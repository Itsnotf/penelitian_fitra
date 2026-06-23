<?php

namespace App\Http\Requests\BarangPengadaan;

use App\Models\Barang_Pengadaan;
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
            'items'             => 'required|array|min:1',
            'items.*.barang_id' => 'required|exists:barangs,id',
            'items.*.jumlah'    => 'required|integer|min:1',
            'items.*.harga'     => 'required|integer|min:0',
        ];
    }

    public function messages(): array
    {
        return [
            'items.required'             => 'Minimal tambahkan 1 barang.',
            'items.min'                  => 'Minimal tambahkan 1 barang.',
            'items.*.barang_id.required' => 'Pilih barang.',
            'items.*.jumlah.required'    => 'Jumlah wajib diisi.',
            'items.*.jumlah.min'         => 'Jumlah minimal 1.',
            'items.*.harga.required'     => 'Harga wajib diisi.',
            'items.*.harga.min'          => 'Harga tidak boleh negatif.',
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $items = $this->input('items', []);
            $barangIds = array_column($items, 'barang_id');

            if (count($barangIds) !== count(array_unique($barangIds))) {
                $validator->errors()->add('items', 'Tidak boleh memilih barang yang sama lebih dari sekali.');
                return;
            }

            $pengadaanId = $this->route('pengadaan_id');
            $existing = Barang_Pengadaan::where('pengadaan_id', $pengadaanId)
                ->whereIn('barang_id', $barangIds)
                ->exists();

            if ($existing) {
                $validator->errors()->add('items', 'Sebagian barang yang dipilih sudah ada di pengadaan ini. Ubah baris yang sudah ada, bukan menambah baris baru.');
            }
        });
    }
}
