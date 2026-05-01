<?php

namespace App\Filament\Resources\Vouchers\Schemas;

use App\Models\Service;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class VoucherForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Detail Voucher')
                ->columns(2)
                ->components([
                    TextInput::make('code')
                        ->label('Kode')
                        ->required()
                        ->unique(ignoreRecord: true)
                        ->maxLength(30)
                        ->extraInputAttributes(['style' => 'text-transform:uppercase'])
                        ->dehydrateStateUsing(fn ($state) => $state ? strtoupper($state) : null),

                    TextInput::make('title')
                        ->label('Judul')
                        ->required()
                        ->maxLength(100),

                    Textarea::make('description')
                        ->label('Deskripsi')
                        ->rows(2)
                        ->columnSpanFull(),
                ]),

            Section::make('Nilai Diskon')
                ->components([
                    Grid::make(2)->schema([
                        Select::make('type')
                            ->label('Tipe')
                            ->options([
                                'percentage' => 'Persentase (%)',
                                'fixed' => 'Nominal (Rp)',
                            ])
                            ->required()
                            ->live()
                            ->default('percentage'),

                        TextInput::make('value')
                            ->label('Value')
                            ->numeric()
                            ->required()
                            ->suffix(fn (callable $get) => $get('type') === 'percentage' ? '%' : 'Rp'),
                    ]),
                    Grid::make(2)->schema([
                        TextInput::make('min_transaction')
                            ->label('Minimum Transaksi')
                            ->numeric()
                            ->prefix('Rp')
                            ->default(0),

                        TextInput::make('max_discount')
                            ->label('Maksimum Diskon')
                            ->numeric()
                            ->prefix('Rp')
                            ->visible(fn (callable $get) => $get('type') === 'percentage')
                            ->helperText('Khusus voucher persentase'),
                    ]),
                ]),

            Section::make('Periode & Kuota')
                ->components([
                    Grid::make(2)->schema([
                        DateTimePicker::make('valid_from')
                            ->label('Berlaku Mulai')
                            ->required(),

                        DateTimePicker::make('valid_until')
                            ->label('Berlaku Sampai')
                            ->required()
                            ->after('valid_from'),

                        TextInput::make('usage_limit_total')
                            ->label('Kuota Total')
                            ->numeric()
                            ->helperText('Kosongkan untuk unlimited'),

                        TextInput::make('usage_limit_per_user')
                            ->label('Kuota per User')
                            ->numeric()
                            ->default(1),
                    ]),
                ]),

            Section::make('Pembatasan Layanan')
                ->components([
                    Select::make('applicable_services')
                        ->label('Layanan yang berlaku')
                        ->multiple()
                        ->options(fn () => Service::pluck('name', 'id')->all())
                        ->helperText('Kosongkan untuk semua layanan'),

                    Toggle::make('is_active')
                        ->label('Aktif')
                        ->default(true),
                ]),
        ]);
    }
}
