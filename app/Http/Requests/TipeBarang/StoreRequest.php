<?php

namespace App\Http\Requests\TipeBarang;

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
            'nama_tipe' => 'required|string|max:255|unique:tipe_barangs,nama_tipe',
        ];
    }
}
