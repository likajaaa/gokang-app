<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TukangDocument extends Model
{
    protected $fillable = [
        'tukang_id', 'document_type', 'file_path',
        'status', 'reviewed_by', 'reviewed_at', 'notes',
    ];

    protected $casts = ['reviewed_at' => 'datetime'];

    public function tukang()
    {
        return $this->belongsTo(Tukang::class);
    }
}
