<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePackageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'sender_name' => 'sometimes|string|max:255',
            'recipient_name' => 'sometimes|string|max:255',
            'delivery_address' => 'sometimes|string|max:500',
            'assigned_driver_id' => 'nullable|exists:drivers,id',
        ];
    }
}
