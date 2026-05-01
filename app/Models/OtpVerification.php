<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OtpVerification extends Model
{
    use HasFactory;

    protected $fillable = [
        'phone',
        'otp_code',
        'purpose',
        'expires_at',
        'verified_at',
        'attempt_count',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
        'verified_at' => 'datetime',
    ];

    protected $hidden = [
        'otp_code', // Jangan expose ke response
    ];
}
