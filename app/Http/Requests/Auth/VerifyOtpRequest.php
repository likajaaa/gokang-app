<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class VerifyOtpRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'phone' => ['required', 'string'],
            'otp' => ['required', 'string', 'size:6'],
        ];
    }

    public function messages(): array
    {
        return [
            'otp.required' => 'Kode OTP wajib diisi',
            'otp.size' => 'Kode OTP harus 6 digit',
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
