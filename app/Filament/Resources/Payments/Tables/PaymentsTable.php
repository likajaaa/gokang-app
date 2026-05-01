<?php

namespace App\Filament\Resources\Payments\Tables;

use Filament\Forms\Components\DatePicker;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\Filter;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class PaymentsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('order.order_code')
                    ->label('Kode Order')
                    ->searchable()
                    ->sortable()
                    ->copyable()
                    ->weight('semibold'),

                TextColumn::make('midtrans_order_id')
                    ->label('Midtrans ID')
                    ->searchable()
                    ->copyable()
                    ->limit(20)
                    ->toggleable(isToggledHiddenByDefault: true),

                TextColumn::make('order.customer.name')
                    ->label('Customer')
                    ->searchable()
                    ->limit(25)
                    ->placeholder('—'),

                TextColumn::make('payment_method')
                    ->label('Metode')
                    ->badge()
                    ->color('gray')
                    ->placeholder('—'),

                TextColumn::make('amount')
                    ->label('Jumlah')
                    ->money('IDR')
                    ->sortable()
                    ->alignEnd(),

                TextColumn::make('status')
                    ->label('Status')
                    ->badge()
                    ->formatStateUsing(fn (string $state) => match ($state) {
                        'pending' => 'Menunggu',
                        'success' => 'Berhasil',
                        'failed' => 'Gagal',
                        'expired' => 'Kadaluarsa',
                        'refunded' => 'Refund',
                        default => $state,
                    })
                    ->color(fn (string $state) => match ($state) {
                        'success' => 'success',
                        'pending' => 'warning',
                        'failed', 'expired' => 'danger',
                        'refunded' => 'gray',
                        default => 'gray',
                    }),

                TextColumn::make('paid_at')
                    ->label('Dibayar')
                    ->dateTime('d M Y H:i')
                    ->sortable()
                    ->placeholder('—'),

                TextColumn::make('expires_at')
                    ->label('Kadaluarsa')
                    ->dateTime('d M Y H:i')
                    ->sortable()
                    ->placeholder('—')
                    ->toggleable(isToggledHiddenByDefault: true),

                TextColumn::make('created_at')
                    ->label('Dibuat')
                    ->dateTime('d M Y H:i')
                    ->sortable(),
            ])
            ->filters([
                SelectFilter::make('status')
                    ->label('Status')
                    ->options([
                        'pending' => 'Menunggu',
                        'success' => 'Berhasil',
                        'failed' => 'Gagal',
                        'expired' => 'Kadaluarsa',
                        'refunded' => 'Refund',
                    ]),

                SelectFilter::make('payment_method')
                    ->label('Metode')
                    ->options(fn () => \App\Models\Payment::query()
                        ->whereNotNull('payment_method')
                        ->distinct()
                        ->pluck('payment_method', 'payment_method')
                        ->toArray()
                    ),

                Filter::make('paid_at')
                    ->label('Tanggal Bayar')
                    ->schema([
                        DatePicker::make('from')->label('Dari'),
                        DatePicker::make('until')->label('Sampai'),
                    ])
                    ->query(function ($query, array $data) {
                        return $query
                            ->when($data['from'] ?? null, fn ($q, $d) => $q->whereDate('paid_at', '>=', $d))
                            ->when($data['until'] ?? null, fn ($q, $d) => $q->whereDate('paid_at', '<=', $d));
                    }),
            ])
            ->defaultSort('created_at', 'desc');
    }
}
