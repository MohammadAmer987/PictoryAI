<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],

            'owner_name' => ['required', 'string', 'max:255'],
            'store_name' => ['required', 'string', 'max:255'],

            'business_type' => [
                'required',
                'string',
                Rule::in([
                    'restaurant',
                    'cafe',
                    'bakery',
                    'clothing',
                    'beauty',
                    'electronics',
                    'perfume',
                    'jewelry',
                    'home_decor',
                    'fitness',
                    'pharmacy',
                    'supermarket',
                    'bookstore',
                    'toy_store',
                    'services',
                    'other',
                ]),
            ],

            'business_description' => ['nullable', 'string'],
        ];
    }
}