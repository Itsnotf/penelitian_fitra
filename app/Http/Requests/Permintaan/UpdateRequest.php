<?php

namespace App\Http\Requests\Permintaan;

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
            'deskripsi' => 'required|string|max:1000',
            'urgensi'   => 'required|in:normal,mendesak',
        ];
    }
}
