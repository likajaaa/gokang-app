<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ServiceResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'code' => $this->code,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'icon_url' => $this->icon_url,
            'pricing' => [
                'full_day' => (float) $this->price_full_day,
                'morning' => (float) $this->price_morning,
                'afternoon' => (float) $this->price_afternoon,
            ],
            'sessions' => [
                [
                    'key' => 'full_day',
                    'label' => 'Seharian',
                    'time' => '08:00 - 17:00',
                    'price' => (float) $this->price_full_day,
                ],
                [
                    'key' => 'morning',
                    'label' => 'Pagi',
                    'time' => '08:00 - 12:00',
                    'price' => (float) $this->price_morning,
                ],
                [
                    'key' => 'afternoon',
                    'label' => 'Sore',
                    'time' => '13:00 - 17:00',
                    'price' => (float) $this->price_afternoon,
                ],
            ],
            'service_type' => $this->service_type,
            'category' => $this->category,
            'is_new' => (bool) $this->is_new,
            'sort_order' => $this->sort_order,
        ];
    }
}
