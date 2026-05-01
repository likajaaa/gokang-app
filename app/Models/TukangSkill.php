<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TukangSkill extends Model
{
    protected $fillable = ['tukang_id', 'service_id', 'is_primary'];

    public function tukang()
    {
        return $this->belongsTo(Tukang::class);
    }

    public function service()
    {
        return $this->belongsTo(Service::class);
    }
}
