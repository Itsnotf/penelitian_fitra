<?php

namespace App\Http\Requests\Pengadaan;

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
            'vendor_id' => 'nullable|exists:vendors,id',
            'deskripsi' => 'required|string|max:255',
            'dokumen'   => 'nullable|file|mimes:pdf,doc,docx,jpg,jpeg,png,gif|max:5120',
        ];
    }
}
