<?php

namespace App\Filament\Resources\Services\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Illuminate\Support\Str;

class ServiceForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Informasi Dasar')
                ->columns(2)
                ->components([
                    TextInput::make('name')
                        ->label('Nama Layanan')
                        ->required()
                        ->maxLength(100)
                        ->live(onBlur: true)
                        ->afterStateUpdated(fn (string $operation, $state, callable $set) => $operation === 'create' ? $set('slug', Str::slug($state)) : null),

                    TextInput::make('code')
                        ->label('Kode')
                        ->required()
                        ->maxLength(50)
                        ->unique(ignoreRecord: true)
                        ->extraInputAttributes(['style' => 'text-transform:uppercase'])
                        ->dehydrateStateUsing(fn ($state) => $state ? strtoupper($state) : null),

                    TextInput::make('slug')
                        ->required()
                        ->unique(ignoreRecord: true)
                        ->maxLength(100),

                    Select::make('service_type')
                        ->label('Tipe')
                        ->options([
                            'daily' => 'Harian',
                            'consultant' => 'Konsultan',
                        ])
                        ->required()
                        ->default('daily'),

                    RichEditor::make('description')
                        ->label('Deskripsi')
                        ->columnSpanFull(),

                    FileUpload::make('icon_url')
                        ->label('Icon')
                        ->image()
                        ->maxSize(1024)
                        ->directory('service-icons')
                        ->columnSpanFull(),
                ]),

            Section::make('Harga per Sesi')
                ->description('Harga flat per tukang per sesi')
                ->components([
                    Grid::make(3)->schema([
                        TextInput::make('price_full_day')
                            ->label('Seharian (08:00-17:00)')
                            ->numeric()
                            ->prefix('Rp')
                            ->required()
                            ->default(0),

                        TextInput::make('price_morning')
                            ->label('Pagi (08:00-12:00)')
                            ->numeric()
                            ->prefix('Rp')
                            ->required()
                            ->default(0),

                        TextInput::make('price_afternoon')
                            ->label('Sore (13:00-17:00)')
                            ->numeric()
                            ->prefix('Rp')
                            ->required()
                            ->default(0),
                    ]),
                ]),

            Section::make('Pengaturan')
                ->columns(2)
                ->components([
                    Toggle::make('is_active')
                        ->label('Aktif')
                        ->default(true),

                    TextInput::make('sort_order')
                        ->label('Urutan')
                        ->numeric()
                        ->default(0),
                ]),
        ]);
    }
}
