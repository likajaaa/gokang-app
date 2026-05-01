<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AppSetting extends Model
{
    protected $fillable = [
        'key',
        'value',
        'type',
        'description',
    ];

    public static function get(string $key, mixed $default = null): mixed
    {
        $row = static::query()->where('key', $key)->first();

        if (! $row) {
            return $default;
        }

        return match ($row->type) {
            'boolean' => filter_var($row->value, FILTER_VALIDATE_BOOLEAN),
            'number' => is_numeric($row->value) ? $row->value + 0 : $default,
            'json' => json_decode($row->value ?? '', true) ?: $default,
            default => $row->value,
        };
    }

    public static function put(string $key, mixed $value, string $type = 'string', ?string $description = null): self
    {
        $stringValue = match ($type) {
            'boolean' => $value ? 'true' : 'false',
            'json' => json_encode($value, JSON_UNESCAPED_UNICODE),
            default => (string) $value,
        };

        return static::updateOrCreate(
            ['key' => $key],
            [
                'value' => $stringValue,
                'type' => $type,
                'description' => $description,
            ]
        );
    }
}
