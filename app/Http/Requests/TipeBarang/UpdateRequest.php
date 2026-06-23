<?php

namespace App\Http\Requests\TipeBarang;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nama_tipe' => [
                'required',
                'string',
                'max:255',
                Rule::unique('tipe_barangs', 'nama_tipe')->ignore($this->route('tipe_barang')),
            ],
        ];
    }
}
