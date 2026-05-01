<?php

namespace App\Filament\Resources\Areas\Schemas;

use App\Models\Area;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class AreaForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->columns(2)
            ->components([
                TextInput::make('name')
                    ->label('Nama')
                    ->required()
                    ->maxLength(100),

                Select::make('level')
                    ->label('Level')
                    ->options([
                        'city' => 'Kota',
                        'district' => 'Kecamatan',
                        'village' => 'Kelurahan',
                    ])
                    ->required()
                    ->live()
                    ->default('district'),

                Select::make('parent_id')
                    ->label('Parent')
                    ->options(function (callable $get) {
                        $level = $get('level');
                        if ($level === 'city') {
                            return [];
                        }
                        if ($level === 'district') {
                            return Area::where('level', 'city')->pluck('name', 'id')->all();
                        }
                        if ($level === 'village') {
                            return Area::where('level', 'district')->pluck('name', 'id')->all();
                        }

                        return [];
                    })
                    ->searchable()
                    ->visible(fn (callable $get) => in_array($get('level'), ['district', 'village'], true))
                    ->required(fn (callable $get) => in_array($get('level'), ['district', 'village'], true)),

                Toggle::make('is_covered')
                    ->label('Area Terlayani')
                    ->default(true),
            ]);
    }
}
