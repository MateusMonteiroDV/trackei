<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateDriverRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->role === 'admin';
    }

    public function rules(): array
    {
        return [
            'cpf' => 'required|string|exists:drivers,cpf',
            'name' => 'sometimes|string|max:255',
            'vehicle' => 'sometimes|string|max:255',
            'status' => 'sometimes|string|in:available,on_delivery',
        ];
    }
}
