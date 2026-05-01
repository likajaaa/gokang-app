<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tukang extends Model
{
    use HasFactory;

    protected $table = 'tukang';

    protected $fillable = [
        'user_id',
        'ktp_number',
        'date_of_birth',
        'gender',
        'experience_years',
        'bio',
        'verification_status',
        'verification_notes',
        'verified_at',
        'verified_by',
        'is_online',
        'current_lat',
        'current_lng',
        'last_location_update',
        'rating_average',
        'total_orders',
        'total_earnings',
        'acceptance_rate',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
        'verified_at' => 'datetime',
        'last_location_update' => 'datetime',
        'is_online' => 'boolean',
        'ktp_number' => 'encrypted', // Laravel auto encrypt
        'rating_average' => 'decimal:2',
        'total_earnings' => 'decimal:2',
        'acceptance_rate' => 'decimal:2',
    ];

    protected $hidden = [
        'ktp_number',
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function verifier()
    {
        return $this->belongsTo(User::class, 'verified_by');
    }

    public function skills()
    {
        return $this->hasMany(TukangSkill::class);
    }

    public function services()
    {
        return $this->belongsToMany(Service::class, 'tukang_skills');
    }

    public function documents()
    {
        return $this->hasMany(TukangDocument::class);
    }

    public function bankAccount()
    {
        return $this->hasOne(BankAccount::class);
    }

    public function payouts()
    {
        return $this->hasMany(Payout::class);
    }

    public function serviceAreas()
    {
        return $this->belongsToMany(Area::class, 'tukang_service_areas');
    }

    // Scopes
    public function scopeApproved($query)
    {
        return $query->where('verification_status', 'approved');
    }

    public function scopeOnline($query)
    {
        return $query->where('is_online', true);
    }
}
