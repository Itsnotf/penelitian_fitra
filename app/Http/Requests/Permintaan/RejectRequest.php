<?php

namespace App\Http\Requests\Permintaan;

use Illuminate\Foundation\Http\FormRequest;

class RejectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'alasan_reject' => 'required|string|max:1000',
        ];
    }
}
