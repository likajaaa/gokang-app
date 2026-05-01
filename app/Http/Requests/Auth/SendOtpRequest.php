<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class SendOtpRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'phone' => ['required', 'string', 'regex:/^(\+62|62|0)[0-9]{9,13}$/'],
        ];
    }

    public function messages(): array
    {
        return [
            'phone.required' => 'Nomor HP wajib diisi',
            'phone.regex' => 'Format nomor HP tidak valid (contoh: 08123456789 atau +628123456789)',
        ];
    }

    /**
     * Normalize phone number ke format +628xxx.
     */
    protected function prepareForValidation(): void
    {
        if ($this->phone) {
            $this->merge([
                'phone' => $this->normalizePhone($this->phone),
            ]);
        }
    }

    private function normalizePhone(string $phone): string
    {
        // Hapus semua karakter non-digit kecuali +
        $phone = preg_replace('/[^\d+]/', '', $phone);

        // 08xxx → +628xxx
        if (str_starts_with($phone, '0')) {
            return '+62' . substr($phone, 1);
        }

        // 628xxx → +628xxx
        if (str_starts_with($phone, '62')) {
            return '+' . $phone;
        }

        return $phone;
    }
}
