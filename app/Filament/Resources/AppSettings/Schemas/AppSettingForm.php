<?php

namespace App\Filament\Resources\AppSettings\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class AppSettingForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->columns(1)
            ->components([
                TextInput::make('key')
                    ->label('Key')
                    ->disabled()
                    ->dehydrated(false),

                Select::make('type')
                    ->label('Tipe')
                    ->options([
                        'string' => 'String',
                        'number' => 'Number',
                        'boolean' => 'Boolean',
                        'json' => 'JSON',
                    ])
                    ->disabled()
                    ->dehydrated(false),

                Textarea::make('value')
                    ->label('Value')
                    ->required()
                    ->rows(3)
                    ->columnSpanFull(),

                Textarea::make('description')
                    ->label('Deskripsi')
                    ->disabled()
                    ->dehydrated(false)
                    ->rows(2),
            ]);
    }
}
