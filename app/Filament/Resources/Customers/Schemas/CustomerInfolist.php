<?php

namespace App\Filament\Resources\Customers\Schemas;

use Filament\Infolists\Components\RepeatableEntry;
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class CustomerInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Profile')
                ->columns(3)
                ->components([
                    TextEntry::make('name')->label('Nama')->weight('bold'),
                    TextEntry::make('phone')->label('Phone')->copyable(),
                    TextEntry::make('email')->label('Email')->placeholder('—')->copyable(),

                    TextEntry::make('customer.gender')
                        ->label('Gender')
                        ->formatStateUsing(fn (?string $state) => match ($state) {
                            'male' => 'Laki-laki',
                            'female' => 'Perempuan',
                            'other' => 'Lainnya',
                            default => '—',
                        }),

                    TextEntry::make('customer.date_of_birth')
                        ->label('Tgl Lahir')
                        ->date('d M Y')
                        ->placeholder('—'),

                    TextEntry::make('status')
                        ->label('Status Akun')
                        ->badge()
                        ->color(fn (string $state) => match ($state) {
                            'active' => 'success',
                            'banned' => 'danger',
                            'suspended' => 'warning',
                            default => 'gray',
                        }),

                    TextEntry::make('phone_verified_at')
                        ->label('Phone Verified')
                        ->dateTime('d M Y H:i')
                        ->placeholder('Belum verified'),

                    TextEntry::make('created_at')
                        ->label('Bergabung')
                        ->dateTime('d M Y H:i'),

                    TextEntry::make('last_login_at')
                        ->label('Last Login')
                        ->dateTime('d M Y H:i')
                        ->placeholder('—'),
                ]),

            Section::make('Statistik')
                ->columns(3)
                ->components([
                    TextEntry::make('customer.total_orders')
                        ->label('Total Orders')
                        ->default(0),

                    TextEntry::make('customer.total_spent')
                        ->label('Total Spent')
                        ->money('IDR')
                        ->default(0),

                    TextEntry::make('customer.loyalty_tier')
                        ->label('Loyalty Tier')
                        ->badge()
                        ->formatStateUsing(fn (?string $state) => ucfirst($state ?? 'new'))
                        ->color(fn (?string $state) => match ($state) {
                            'vip' => 'success',
                            'regular' => 'info',
                            default => 'gray',
                        }),
                ]),

            Section::make('Alamat Tersimpan')
                ->components([
                    RepeatableEntry::make('addresses')
                        ->hiddenLabel()
                        ->columns(2)
                        ->schema([
                            TextEntry::make('label')->label('Label')->badge(),
                            TextEntry::make('recipient_name')->label('Nama Penerima'),
                            TextEntry::make('full_address')
                                ->label('Alamat')
                                ->columnSpanFull(),
                        ]),
                ])
                ->collapsible(),
        ]);
    }
}
