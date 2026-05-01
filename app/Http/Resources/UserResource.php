<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'role' => $this->role,
            'name' => $this->name,
            'phone' => $this->phone,
            'email' => $this->email,
            'avatar' => $this->avatar,
            'status' => $this->status,
            'phone_verified' => $this->phone_verified_at !== null,
            'email_verified' => $this->email_verified_at !== null,
            'created_at' => $this->created_at?->toIso8601String(),

            // Nested
            'customer' => $this->whenLoaded('customer', fn () => [
                'total_orders' => $this->customer->total_orders,
                'total_spent' => $this->customer->total_spent,
                'loyalty_tier' => $this->customer->loyalty_tier,
            ]),
            'tukang' => $this->whenLoaded('tukang', fn () => [
                'verification_status' => $this->tukang->verification_status,
                'is_online' => $this->tukang->is_online,
                'rating_average' => $this->tukang->rating_average,
                'total_orders' => $this->tukang->total_orders,
            ]),
        ];
    }
}
