<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePackageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'sender_name' => 'required|string|max:255',
            'recipient_name' => 'required|string|max:255',
            'delivery_address' => 'required|string|max:500',
            'business_id' => 'required|exists:business,id',
            'client_id' => 'nullable|exists:users,id',
        ];
    }
}
