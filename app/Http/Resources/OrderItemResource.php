<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'service' => $this->whenLoaded('service', fn () => [
                'id' => $this->service->id,
                'name' => $this->service->name,
                'icon_url' => $this->service->icon_url,
            ]),
            'quantity' => $this->quantity,
            'start_date' => $this->start_date?->format('Y-m-d'),
            'end_date' => $this->end_date?->format('Y-m-d'),
            'total_days' => $this->total_days,
            'session' => $this->session,
            'session_label' => match ($this->session) {
                'morning' => 'Pagi (08:00 - 12:00)',
                'afternoon' => 'Sore (13:00 - 17:00)',
                'full_day' => 'Seharian (08:00 - 17:00)',
                default => $this->session,
            },
            'price_per_session' => (float) $this->price_per_session,
            'subtotal' => (float) $this->subtotal,
            'include_material' => $this->include_material,
            'notes' => $this->notes,
        ];
    }
}
