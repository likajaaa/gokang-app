<?php

namespace App\Filament\Resources\Tukangs\Schemas;

use Filament\Infolists\Components\ImageEntry;
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class TukangInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Profil Tukang')
                ->columns(3)
                ->components([
                    TextEntry::make('user.name')->label('Nama'),
                    TextEntry::make('user.phone')->label('Phone')->copyable(),
                    TextEntry::make('user.email')->label('Email')->placeholder('—'),

                    TextEntry::make('gender')
                        ->label('Gender')
                        ->formatStateUsing(fn (?string $state) => $state === 'male' ? 'Laki-laki' : ($state === 'female' ? 'Perempuan' : '—')),

                    TextEntry::make('date_of_birth')->label('Tgl Lahir')->date('d M Y')->placeholder('—'),
                    TextEntry::make('experience_years')->label('Pengalaman')->suffix(' tahun'),

                    TextEntry::make('bio')
                        ->label('Bio')
                        ->placeholder('—')
                        ->columnSpanFull(),
                ]),

            Section::make('Verifikasi')
                ->columns(3)
                ->components([
                    TextEntry::make('verification_status')
                        ->label('Status')
                        ->badge()
                        ->color(fn (string $state) => match ($state) {
                            'approved' => 'success',
                            'pending' => 'warning',
                            'rejected' => 'danger',
                            default => 'gray',
                        }),

                    TextEntry::make('verified_at')
                        ->label('Diverifikasi')
                        ->dateTime('d M Y H:i')
                        ->placeholder('—'),

                    TextEntry::make('verifier.name')
                        ->label('Oleh')
                        ->placeholder('—'),

                    TextEntry::make('verification_notes')
                        ->label('Catatan')
                        ->placeholder('—')
                        ->columnSpanFull(),
                ]),

            Section::make('Dokumen')
                ->description('Verifikasi visual foto KTP dan selfie')
                ->components([
                    Grid::make(2)->schema([
                        ImageEntry::make('ktp_photo')
                            ->label('Foto KTP')
                            ->height(200)
                            ->defaultImageUrl(url('/images/placeholder-ktp.png')),

                        ImageEntry::make('selfie_photo')
                            ->label('Selfie + KTP')
                            ->height(200)
                            ->defaultImageUrl(url('/images/placeholder-selfie.png')),
                    ]),
                ]),

            Section::make('Statistik')
                ->columns(4)
                ->components([
                    TextEntry::make('rating_average')
                        ->label('Rating')
                        ->suffix(' ★'),

                    TextEntry::make('total_orders')
                        ->label('Total Orders'),

                    TextEntry::make('total_earnings')
                        ->label('Total Earnings')
                        ->money('IDR'),

                    TextEntry::make('acceptance_rate')
                        ->label('Acceptance Rate')
                        ->suffix('%'),
                ]),
        ]);
    }
}
