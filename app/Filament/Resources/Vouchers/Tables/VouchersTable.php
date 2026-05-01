<?php

namespace App\Filament\Resources\Vouchers\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ToggleColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class VouchersTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('code')
                    ->label('Kode')
                    ->badge()
                    ->color('primary')
                    ->copyable()
                    ->searchable(),

                TextColumn::make('title')
                    ->label('Judul')
                    ->searchable()
                    ->limit(40),

                TextColumn::make('type')
                    ->label('Tipe')
                    ->badge()
                    ->formatStateUsing(fn (string $state) => $state === 'percentage' ? 'Persentase' : 'Nominal')
                    ->color(fn (string $state) => $state === 'percentage' ? 'info' : 'warning'),

                TextColumn::make('value')
                    ->label('Value')
                    ->formatStateUsing(function ($state, $record) {
                        if ($record->type === 'percentage') {
                            return rtrim(rtrim(number_format($state, 1, ',', '.'), '0'), ',').'%';
                        }

                        return 'Rp '.number_format((float) $state, 0, ',', '.');
                    })
                    ->alignEnd(),

                TextColumn::make('min_transaction')
                    ->label('Min. Trx')
                    ->money('IDR')
                    ->alignEnd()
                    ->toggleable(),

                TextColumn::make('usage_summary')
                    ->label('Pemakaian')
                    ->state(function ($record) {
                        $limit = $record->usage_limit_total ?? '∞';

                        return "{$record->used_count} / {$limit}";
                    }),

                TextColumn::make('valid_period')
                    ->label('Periode')
                    ->state(function ($record) {
                        $from = $record->valid_from?->format('d M Y') ?? '-';
                        $until = $record->valid_until?->format('d M Y') ?? '-';

                        return "{$from} — {$until}";
                    }),

                ToggleColumn::make('is_active')
                    ->label('Aktif'),
            ])
            ->filters([
                SelectFilter::make('type')
                    ->label('Tipe')
                    ->options([
                        'percentage' => 'Persentase',
                        'fixed' => 'Nominal',
                    ]),
                SelectFilter::make('is_active')
                    ->label('Status')
                    ->options([
                        1 => 'Aktif',
                        0 => 'Non-aktif',
                    ]),
            ])
            ->defaultSort('created_at', 'desc')
            ->recordActions([
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
