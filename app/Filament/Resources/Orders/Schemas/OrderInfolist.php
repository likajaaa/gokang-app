<?php

namespace App\Filament\Resources\Orders\Schemas;

use Filament\Infolists\Components\RepeatableEntry;
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class OrderInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Informasi Order')
                ->columns(3)
                ->components([
                    TextEntry::make('order_code')
                        ->label('Order Code')
                        ->copyable()
                        ->weight('bold'),

                    TextEntry::make('order_type')
                        ->label('Tipe')
                        ->badge()
                        ->formatStateUsing(fn (string $state) => match ($state) {
                            'daily_tukang' => 'Tukang Harian',
                            'daily_with_material' => 'Tukang + Material',
                            'borongan_home' => 'Borongan Rumah',
                            'borongan_business' => 'Borongan Bisnis',
                            default => $state,
                        }),

                    TextEntry::make('status')
                        ->label('Status')
                        ->badge()
                        ->formatStateUsing(fn (string $state) => match ($state) {
                            'pending_payment' => 'Belum Dibayar',
                            'pending_survey' => 'Menunggu Survey',
                            'on_survey' => 'Survey Berlangsung',
                            'pending_assignment' => 'Mencari Tukang',
                            'searching_tukang' => 'Mencari Tukang',
                            'on_progress' => 'Sedang Dikerjakan',
                            'in_progress' => 'Sedang Dikerjakan',
                            'waiting_payment_final' => 'Menunggu Pelunasan',
                            'paid' => 'Sudah Dibayar',
                            'assigned' => 'Tukang Ditugaskan',
                            'completed' => 'Selesai',
                            'cancelled' => 'Dibatalkan',
                            'rejected' => 'Ditolak',
                            'refunded' => 'Refund',
                            'draft' => 'Draft',
                            default => $state,
                        })
                        ->color(fn (string $state) => match ($state) {
                            'completed' => 'gray',
                            'cancelled', 'refunded', 'rejected' => 'danger',
                            'on_survey', 'on_progress', 'in_progress', 'assigned' => 'success',
                            'pending_survey', 'paid' => 'info',
                            'pending_assignment', 'searching_tukang' => 'primary',
                            'pending_payment', 'waiting_payment_final' => 'warning',
                            default => 'gray',
                        }),

                    TextEntry::make('created_at')->label('Dibuat')->dateTime('d M Y H:i'),
                    TextEntry::make('started_at')->label('Dimulai')->dateTime('d M Y H:i')->placeholder('—'),
                    TextEntry::make('completed_at')->label('Selesai')->dateTime('d M Y H:i')->placeholder('—'),
                ]),

            Section::make('Customer')
                ->columns(2)
                ->components([
                    TextEntry::make('customer.name')->label('Nama'),
                    TextEntry::make('customer.phone')->label('Phone')->copyable(),

                    TextEntry::make('address.full_address')
                        ->label('Alamat')
                        ->placeholder('—')
                        ->columnSpanFull(),

                    TextEntry::make('problem_description')
                        ->label('Deskripsi Masalah')
                        ->placeholder('—')
                        ->columnSpanFull(),
                ]),

            Section::make('Items')
                ->components([
                    RepeatableEntry::make('items')
                        ->hiddenLabel()
                        ->columns(4)
                        ->schema([
                            TextEntry::make('service.name')->label('Layanan'),
                            TextEntry::make('quantity')->label('Qty'),
                            TextEntry::make('session')
                                ->label('Sesi')
                                ->badge()
                                ->formatStateUsing(fn (string $state) => match ($state) {
                                    'morning' => 'Pagi',
                                    'afternoon' => 'Sore',
                                    'full_day' => 'Seharian',
                                    default => $state,
                                }),
                            TextEntry::make('subtotal')->label('Subtotal')->money('IDR')->alignEnd(),
                            TextEntry::make('start_date')->label('Tgl Mulai')->date('d M Y'),
                            TextEntry::make('end_date')->label('Tgl Akhir')->date('d M Y'),
                            TextEntry::make('total_days')->label('Hari'),
                            TextEntry::make('price_per_session')->label('Per Sesi')->money('IDR'),
                        ]),
                ]),

            Section::make('Pricing')
                ->columns(2)
                ->components([
                    TextEntry::make('subtotal')->label('Subtotal')->money('IDR'),
                    TextEntry::make('material_cost')->label('Material')->money('IDR'),
                    TextEntry::make('extra_fee_parking')->label('Parkir')->money('IDR'),
                    TextEntry::make('discount_amount')->label('Diskon')->money('IDR'),
                    TextEntry::make('total')
                        ->label('Total')
                        ->money('IDR')
                        ->weight('bold')
                        ->size('lg')
                        ->columnSpanFull(),
                ]),

            Section::make('Payment')
                ->columns(3)
                ->components([
                    TextEntry::make('payment.status')
                        ->label('Status')
                        ->badge()
                        ->placeholder('—'),
                    TextEntry::make('payment.payment_method')->label('Metode')->placeholder('—'),
                    TextEntry::make('payment.paid_at')->label('Dibayar')->dateTime('d M Y H:i')->placeholder('—'),
                    TextEntry::make('payment.amount')->label('Amount')->money('IDR')->placeholder('—'),
                    TextEntry::make('payment.expires_at')->label('Kadaluarsa')->dateTime('d M Y H:i')->placeholder('—'),
                ])
                ->collapsible(),

            Section::make('Timeline')
                ->components([
                    RepeatableEntry::make('statusLogs')
                        ->hiddenLabel()
                        ->columns(4)
                        ->schema([
                            TextEntry::make('from_status')->label('Dari')->badge()->placeholder('—'),
                            TextEntry::make('to_status')->label('Ke')->badge(),
                            TextEntry::make('created_at')->label('Timestamp')->dateTime('d M H:i'),
                            TextEntry::make('notes')->label('Catatan')->placeholder('—'),
                        ]),
                ])
                ->collapsible()
                ->collapsed(),

            Section::make('Review')
                ->columns(2)
                ->components([
                    TextEntry::make('review.rating')->label('Rating')->suffix(' ★')->placeholder('—'),
                    TextEntry::make('review.created_at')->label('Tgl Review')->dateTime('d M Y')->placeholder('—'),
                    TextEntry::make('review.review_text')
                        ->label('Komentar')
                        ->placeholder('—')
                        ->columnSpanFull(),
                ])
                ->collapsible()
                ->collapsed(),
        ]);
    }
}
