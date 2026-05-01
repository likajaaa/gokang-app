<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'name',
        'slug',
        'description',
        'icon_url',
        'price_full_day',
        'price_morning',
        'price_afternoon',
        'service_type',
        'category',
        'is_new',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'is_new' => 'boolean',
        'price_full_day' => 'decimal:2',
        'price_morning' => 'decimal:2',
        'price_afternoon' => 'decimal:2',
    ];

    public function scopeActive($query)
    {
        return $query->where('is_active', true)->orderBy('sort_order');
    }

    /**
     * Get harga berdasarkan session type.
     */
    public function getPriceBySession(string $session): float
    {
        return match ($session) {
            'full_day' => (float) $this->price_full_day,
            'morning' => (float) $this->price_morning,
            'afternoon' => (float) $this->price_afternoon,
            default => throw new \InvalidArgumentException("Session tidak valid: {$session}"),
        };
    }
}
