<?php

namespace App\Models;

use Filament\Models\Contracts\FilamentUser;
use Filament\Panel;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable implements FilamentUser
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    public function canAccessPanel(Panel $panel): bool
    {
        return $this->isAnyAdmin() && $this->status === 'active';
    }

    protected $fillable = [
        'role',
        'name',
        'phone',
        'email',
        'password',
        'avatar',
        'status',
        'fcm_token',
        'phone_verified_at',
        'email_verified_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
        'fcm_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'phone_verified_at' => 'datetime',
            'last_login_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // Relationships
    public function customer()
    {
        return $this->hasOne(Customer::class);
    }

    public function tukang()
    {
        return $this->hasOne(Tukang::class);
    }

    public function addresses()
    {
        return $this->hasMany(Address::class);
    }

    /**
     * Voucher yang sudah di-claim user ke wallet via redeem code.
     * Berbeda dari voucher_usages yang track per-order usage.
     */
    public function claimedVouchers()
    {
        return $this->belongsToMany(Voucher::class, 'user_vouchers')
            ->withPivot('claimed_at')
            ->withTimestamps();
    }

    public function ordersAsCustomer()
    {
        return $this->hasMany(Order::class, 'customer_id');
    }

    public function ordersAsTukang()
    {
        return $this->hasMany(Order::class, 'tukang_id');
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }

    // Helpers
    public function isCustomer(): bool
    {
        return $this->role === 'customer';
    }

    public function isTukang(): bool
    {
        return $this->role === 'tukang';
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isSuperAdmin(): bool
    {
        return $this->role === 'super_admin';
    }

    public function isCs(): bool
    {
        return $this->role === 'cs';
    }

    public function isFinance(): bool
    {
        return $this->role === 'finance';
    }

    public function isAnyAdmin(): bool
    {
        return in_array($this->role, ['super_admin', 'admin', 'cs', 'finance'], true);
    }

    public function defaultAddress()
    {
        return $this->addresses()->where('is_default', true)->first();
    }
}
