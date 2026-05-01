<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class CompleteRegistrationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'phone' => ['required', 'string'],
            'name' => ['required', 'string', 'min:3', 'max:100'],
            'email' => ['nullable', 'email', 'max:100', 'unique:users,email'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Nama lengkap wajib diisi',
            'name.min' => 'Nama minimal 3 karakter',
            'email.email' => 'Format email tidak valid',
            'email.unique' => 'Email sudah terdaftar',
        ];
    }

    protected function prepareForValidation(): void
    {
        if ($this->phone) {
            $phone = preg_replace('/[^\d+]/', '', $this->phone);
            if (str_starts_with($phone, '0')) {
                $phone = '+62' . substr($phone, 1);
            } elseif (str_starts_with($phone, '62')) {
                $phone = '+' . $phone;
            }
            $this->merge(['phone' => $phone]);
        }
    }
}
