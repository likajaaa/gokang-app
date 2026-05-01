<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Area extends Model
{
    use HasFactory;

    protected $fillable = ['parent_id', 'level', 'name', 'is_covered'];

    protected $casts = [
        'is_covered' => 'boolean',
    ];

    public function parent()
    {
        return $this->belongsTo(Area::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(Area::class, 'parent_id');
    }

    public function scopeCities($query)
    {
        return $query->where('level', 'city');
    }

    public function scopeDistricts($query)
    {
        return $query->where('level', 'district');
    }
}
