<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payout extends Model
{
    protected $fillable = [
        'tukang_id', 'amount', 'bank_account_id', 'status',
        'requested_at', 'approved_at', 'processed_at',
        'approved_by', 'rejection_reason', 'reference_number',
    ];

    protected $casts = [
        'requested_at' => 'datetime',
        'approved_at' => 'datetime',
        'processed_at' => 'datetime',
        'amount' => 'decimal:2',
    ];

    public function tukang()
    {
        return $this->belongsTo(Tukang::class);
    }

    public function bankAccount()
    {
        return $this->belongsTo(BankAccount::class);
    }
}
