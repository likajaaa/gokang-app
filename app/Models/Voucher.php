<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

class Voucher extends Model
{
    protected $fillable = [
        'code', 'title', 'description', 'type', 'value',
        'min_transaction', 'max_discount',
        'usage_limit_total', 'usage_limit_per_user', 'used_count',
        'valid_from', 'valid_until', 'applicable_services', 'is_active',
    ];

    protected $casts = [
        'applicable_services' => 'array',
        'is_active' => 'boolean',
        'valid_from' => 'datetime',
        'valid_until' => 'datetime',
        'value' => 'decimal:2',
        'min_transaction' => 'decimal:2',
        'max_discount' => 'decimal:2',
    ];

    public function usages()
    {
        return $this->hasMany(VoucherUsage::class);
    }

    /**
     * Users yang sudah claim voucher ini ke wallet mereka via redeem code.
     */
    public function claimedByUsers()
    {
        return $this->belongsToMany(User::class, 'user_vouchers')
            ->withPivot('claimed_at')
            ->withTimestamps();
    }

    public function isExpired(): bool
    {
        return $this->valid_until && now()->gt($this->valid_until);
    }

    public function isNotYetValid(): bool
    {
        return $this->valid_from && now()->lt($this->valid_from);
    }

    public function isQuotaExhausted(): bool
    {
        return $this->usage_limit_total !== null
            && $this->used_count >= $this->usage_limit_total;
    }
}
