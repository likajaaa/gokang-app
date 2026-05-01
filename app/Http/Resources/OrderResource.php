<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'order_code' => $this->order_code,
            'order_type' => $this->order_type,
            'status' => $this->status,
            'status_label' => $this->getStatusLabel(),

            'customer' => $this->whenLoaded('customer', fn () => [
                'id' => $this->customer->id,
                'name' => $this->customer->name,
                'phone' => $this->maskPhone($this->customer->phone),
            ]),

            'service' => $this->whenLoaded('service', fn () => $this->service ? [
                'id' => $this->service->id,
                'name' => $this->service->name,
                'slug' => $this->service->slug,
                'category' => $this->service->category,
            ] : null),

            'address' => $this->whenLoaded('address', fn () => new AddressResource($this->address)),
            'survey_address' => $this->survey_address,
            'survey_address_detail' => $this->survey_address_detail,
            'survey_scheduled_at' => $this->survey_scheduled_at?->toIso8601String(),
            'work_scheduled_at' => $this->work_scheduled_at?->toIso8601String(),
            'duration_hours' => $this->duration_hours,
            'material_included' => (bool) $this->material_included,

            'problem_description' => $this->problem_description,

            'items' => OrderItemResource::collection($this->whenLoaded('items')),

            'pricing' => [
                'subtotal' => (float) $this->subtotal,
                'material_cost' => (float) $this->material_cost,
                'extra_fee_parking' => (float) $this->extra_fee_parking,
                'extra_fee_others' => (float) $this->extra_fee_others,
                'discount_amount' => (float) $this->discount_amount,
                'total' => (float) $this->total,
            ],

            'payment' => $this->whenLoaded('payment', fn () => $this->payment ? [
                'status' => $this->payment->status,
                'expires_at' => $this->payment->expires_at?->toIso8601String(),
                'expires_in_seconds' => $this->payment->expires_at
                    ? max(0, now()->diffInSeconds($this->payment->expires_at, false))
                    : null,
                'payment_method' => $this->payment->payment_method,
                'paid_at' => $this->payment->paid_at?->toIso8601String(),
            ] : null),

            'terms_accepted_at' => $this->terms_accepted_at?->toIso8601String(),
            'started_at' => $this->started_at?->toIso8601String(),
            'completed_at' => $this->completed_at?->toIso8601String(),
            'cancelled_at' => $this->cancelled_at?->toIso8601String(),
            'cancel_reason' => $this->cancel_reason,
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }

    /**
     * Label status dalam Bahasa Indonesia untuk UI.
     */
    private function getStatusLabel(): string
    {
        return match ($this->status) {
            'draft' => 'Draft',
            'pending_payment' => 'Menunggu Pembayaran',
            'pending_survey' => 'Menunggu Survey',
            'on_survey' => 'Survey Berlangsung',
            'pending_assignment' => 'Mencari Tukang',
            'paid' => 'Sudah Dibayar',
            'searching_tukang' => 'Mencari Tukang Jagoan',
            'assigned' => 'Tukang Ditemukan',
            'on_progress', 'in_progress' => 'Sedang Dikerjakan',
            'waiting_payment_final' => 'Menunggu Pelunasan',
            'completed' => 'Selesai',
            'cancelled' => 'Dibatalkan',
            'refunded' => 'Dana Dikembalikan',
            'rejected' => 'Ditolak',
            default => $this->status,
        };
    }

    /**
     * Mask nomor HP untuk privacy.
     * +6281234567890 → +62812****7890
     */
    private function maskPhone(?string $phone): ?string
    {
        if (!$phone || strlen($phone) < 8) {
            return $phone;
        }

        return substr($phone, 0, 6) . '****' . substr($phone, -4);
    }
}
