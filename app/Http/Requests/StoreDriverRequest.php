<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreDriverRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->role === 'admin';
    }

    public function rules(): array
    {
        return [
            'username' => 'required|string|max:255|unique:users,name',
            'name' => 'required|string|max:255|unique:drivers,name',
            'cpf' => 'required|string|max:255|unique:drivers,cpf',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6|confirmed',
            'vehicle' => 'required|string',
        ];
    }
}
