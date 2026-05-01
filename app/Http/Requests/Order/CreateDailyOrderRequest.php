<?php

namespace App\Http\Requests\Order;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CreateDailyOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->isCustomer();
    }

    public function rules(): array
    {
        return [
            'address_id' => ['required', 'integer', 'exists:addresses,id'],
            'problem_description' => ['nullable', 'string', 'max:2000'],
            'terms_accepted' => ['required', 'boolean', 'accepted'],
            'voucher_code' => ['nullable', 'string', 'max:30'],

            // Items (minimal 1, maksimal 5 jenis tukang per order)
            'items' => ['required', 'array', 'min:1', 'max:5'],
            'items.*.service_id' => ['required', 'integer', 'exists:services,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1', 'max:5'],
            'items.*.start_date' => ['required', 'date', 'after:today'],
            'items.*.end_date' => ['required', 'date', 'after_or_equal:items.*.start_date'],
            'items.*.session' => ['required', Rule::in(['morning', 'afternoon', 'full_day'])],
            'items.*.include_material' => ['nullable', 'boolean'],
            'items.*.notes' => ['nullable', 'string', 'max:500'],
        ];
    }

    public function messages(): array
    {
        return [
            'address_id.required' => 'Pilih alamat pengerjaan',
            'address_id.exists' => 'Alamat tidak valid',
            'terms_accepted.required' => 'Kamu harus menyetujui syarat & ketentuan',
            'terms_accepted.accepted' => 'Kamu harus menyetujui syarat & ketentuan',

            'items.required' => 'Minimal harus pilih 1 jenis tukang',
            'items.min' => 'Minimal harus pilih 1 jenis tukang',
            'items.max' => 'Maksimal 5 jenis tukang per order',

            'items.*.service_id.required' => 'Pilih jenis tukang untuk setiap item',
            'items.*.quantity.required' => 'Jumlah tukang wajib diisi',
            'items.*.quantity.min' => 'Jumlah tukang minimal 1',
            'items.*.quantity.max' => 'Jumlah tukang maksimal 5 per jenis',

            'items.*.start_date.required' => 'Pilih tanggal mulai',
            'items.*.start_date.after' => 'Tanggal mulai minimal besok',
            'items.*.end_date.after_or_equal' => 'Tanggal selesai harus sama atau setelah tanggal mulai',

            'items.*.session.required' => 'Pilih sesi kerja (pagi, sore, atau seharian)',
            'items.*.session.in' => 'Sesi tidak valid',
        ];
    }

    protected function prepareForValidation(): void
    {
        // Pastikan terms_accepted jadi boolean
        if ($this->has('terms_accepted')) {
            $this->merge([
                'terms_accepted' => filter_var($this->terms_accepted, FILTER_VALIDATE_BOOLEAN),
            ]);
        }

        // Pastikan items array
        if (!$this->has('items')) {
            $this->merge(['items' => []]);
        }
    }
}
