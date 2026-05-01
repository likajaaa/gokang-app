<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'service_id',
        'quantity',
        'start_date',
        'end_date',
        'total_days',
        'session',
        'price_per_session',
        'subtotal',
        'include_material',
        'notes',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'include_material' => 'boolean',
        'price_per_session' => 'decimal:2',
        'subtotal' => 'decimal:2',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function service()
    {
        return $this->belongsTo(Service::class);
    }

    public function assignment()
    {
        return $this->hasOne(OrderAssignment::class);
    }

    public function materials()
    {
        return $this->hasMany(OrderMaterial::class);
    }

    /**
     * Calculate subtotal: price × quantity × total_days
     */
    public function calculateSubtotal(): float
    {
        return (float) $this->price_per_session * $this->quantity * $this->total_days;
    }

    /**
     * Get jam kerja berdasarkan session.
     */
    public function getSessionTimeRange(): array
    {
        return match ($this->session) {
            'morning' => ['start' => '08:00', 'end' => '12:00'],
            'afternoon' => ['start' => '13:00', 'end' => '17:00'],
            'full_day' => ['start' => '08:00', 'end' => '17:00'],
        };
    }
}
