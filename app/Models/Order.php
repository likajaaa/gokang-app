<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Order extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'order_code',
        'customer_id',
        'order_type',
        'service_id',
        'address_id',
        'survey_address',
        'survey_address_detail',
        'survey_latitude',
        'survey_longitude',
        'survey_scheduled_at',
        'work_scheduled_at',
        'duration_hours',
        'material_included',
        'budget_range',
        'referral_sources',
        'building_type',
        'business_name',
        'branch_count',
        'promo_code',
        'problem_description',
        'status',
        'subtotal',
        'material_cost',
        'extra_fee_parking',
        'extra_fee_others',
        'voucher_id',
        'discount_amount',
        'total',
        'platform_fee',
        'terms_accepted_at',
        'started_at',
        'completed_at',
        'cancelled_at',
        'cancel_reason',
        'cancelled_by',
    ];

    protected $casts = [
        'survey_scheduled_at' => 'datetime',
        'work_scheduled_at' => 'datetime',
        'referral_sources' => 'array',
        'material_included' => 'boolean',
        'terms_accepted_at' => 'datetime',
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
        'cancelled_at' => 'datetime',
        'survey_latitude' => 'decimal:7',
        'survey_longitude' => 'decimal:7',
        'subtotal' => 'decimal:2',
        'material_cost' => 'decimal:2',
        'extra_fee_parking' => 'decimal:2',
        'extra_fee_others' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'total' => 'decimal:2',
        'platform_fee' => 'decimal:2',
    ];

    // Relationships
    public function customer()
    {
        return $this->belongsTo(User::class, 'customer_id');
    }

    public function address()
    {
        return $this->belongsTo(Address::class);
    }

    public function service()
    {
        return $this->belongsTo(Service::class);
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function assignments()
    {
        return $this->hasMany(OrderAssignment::class);
    }

    public function acceptedTukang()
    {
        // Unique tukang yang sudah accept (satu order bisa multi-tukang dari item berbeda)
        return $this->hasManyThrough(
            User::class,
            OrderAssignment::class,
            'order_id',
            'id',
            'id',
            'tukang_id'
        )->where('order_assignments.status', 'accepted')->distinct();
    }

    public function statusLogs()
    {
        return $this->hasMany(OrderStatusLog::class)->orderBy('created_at');
    }

    public function photos()
    {
        return $this->hasMany(OrderPhoto::class);
    }

    public function payment()
    {
        return $this->hasOne(Payment::class);
    }

    public function review()
    {
        return $this->hasOne(Review::class);
    }

    public function chatMessages()
    {
        return $this->hasMany(ChatMessage::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->whereIn('status', [
            'pending_payment',
            'pending_survey',
            'on_survey',
            'pending_assignment',
            'paid',
            'searching_tukang',
            'assigned',
            'on_progress',
            'in_progress',
            'waiting_payment_final',
        ]);
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    public function scopeCancelled($query)
    {
        return $query->whereIn('status', ['cancelled', 'refunded', 'rejected']);
    }

    // Helpers
    public function canBeCancelled(): bool
    {
        // Cancel diizinkan sebelum tukang mulai kerja (sesuai user spec).
        // Setelah on_progress / in_progress / waiting_payment_final, tidak bisa cancel.
        return in_array($this->status, [
            'draft',
            'pending_payment',
            'pending_survey',
            'on_survey',
            'pending_assignment',
            'paid',
            'searching_tukang',
            'assigned',
        ]);
    }

    /**
     * Generate unique order code: KNG-YYYY-NNNN
     */
    public static function generateOrderCode(): string
    {
        $year = now()->format('Y');
        $lastOrder = self::whereYear('created_at', $year)
            ->orderByDesc('id')
            ->first();

        $sequence = $lastOrder
            ? ((int) substr($lastOrder->order_code, -4)) + 1
            : 1;

        return sprintf('KNG-%s-%04d', $year, $sequence);
    }
}
