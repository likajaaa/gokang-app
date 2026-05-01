<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AddressResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'label' => $this->label,
            'recipient_name' => $this->recipient_name,
            'recipient_phone' => $this->recipient_phone,
            'full_address' => $this->full_address,
            'address_note' => $this->address_note,
            'postal_code' => $this->postal_code,
            'area_id' => $this->area_id,
            'area_name' => $this->whenLoaded('area', fn () => $this->area?->name),
            'lat' => (float) $this->lat,
            'lng' => (float) $this->lng,
            'is_default' => $this->is_default,
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
