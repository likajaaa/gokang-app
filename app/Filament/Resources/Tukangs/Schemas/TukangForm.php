<?php

namespace App\Filament\Resources\Tukangs\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class TukangForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Status Verifikasi')
                ->columns(2)
                ->components([
                    Select::make('verification_status')
                        ->label('Status Verifikasi')
                        ->options([
                            'pending' => 'Pending',
                            'approved' => 'Approved',
                            'rejected' => 'Rejected',
                        ])
                        ->required(),

                    Textarea::make('verification_notes')
                        ->label('Catatan Verifikasi')
                        ->rows(3)
                        ->columnSpanFull(),
                ]),

            Section::make('Profil Tukang')
                ->columns(2)
                ->components([
                    TextInput::make('user.name')
                        ->label('Nama')
                        ->disabled()
                        ->dehydrated(false),

                    TextInput::make('user.phone')
                        ->label('Phone')
                        ->disabled()
                        ->dehydrated(false),

                    TextInput::make('experience_years')
                        ->label('Tahun Pengalaman')
                        ->numeric()
                        ->minValue(0),

                    Select::make('gender')
                        ->label('Gender')
                        ->options([
                            'male' => 'Laki-laki',
                            'female' => 'Perempuan',
                        ]),

                    Textarea::make('bio')
                        ->label('Bio')
                        ->rows(3)
                        ->columnSpanFull(),
                ]),

            Section::make('Statistik')
                ->columns(3)
                ->components([
                    TextInput::make('rating_average')
                        ->label('Rating')
                        ->disabled()
                        ->dehydrated(false),

                    TextInput::make('total_orders')
                        ->label('Total Orders')
                        ->disabled()
                        ->dehydrated(false),

                    TextInput::make('total_earnings')
                        ->label('Total Earnings')
                        ->prefix('Rp')
                        ->disabled()
                        ->dehydrated(false),

                    Toggle::make('is_online')
                        ->label('Online')
                        ->disabled()
                        ->dehydrated(false),
                ]),
        ]);
    }
}
