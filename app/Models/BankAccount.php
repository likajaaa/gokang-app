<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BankAccount extends Model
{
    protected $fillable = [
        'tukang_id', 'bank_name', 'account_number',
        'account_holder', 'is_verified',
    ];

    protected $casts = [
        'account_number' => 'encrypted',
        'is_verified' => 'boolean',
    ];

    protected $hidden = ['account_number'];

    public function tukang()
    {
        return $this->belongsTo(Tukang::class);
    }
}
