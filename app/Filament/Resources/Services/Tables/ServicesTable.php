<?php

namespace App\Filament\Resources\Services\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ToggleColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class ServicesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('sort_order')
                    ->label('#')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: false),

                ImageColumn::make('icon_url')
                    ->label('Icon')
                    ->circular()
                    ->defaultImageUrl(url('/images/placeholder-service.png')),

                TextColumn::make('name')
                    ->label('Nama')
                    ->searchable()
                    ->sortable()
                    ->weight('semibold'),

                TextColumn::make('code')
                    ->label('Kode')
                    ->badge()
                    ->color('gray')
                    ->searchable(),

                TextColumn::make('price_full_day')
                    ->label('Seharian')
                    ->money('IDR')
                    ->sortable()
                    ->alignEnd(),

                TextColumn::make('price_morning')
                    ->label('Pagi')
                    ->money('IDR')
                    ->sortable()
                    ->alignEnd(),

                TextColumn::make('price_afternoon')
                    ->label('Sore')
                    ->money('IDR')
                    ->sortable()
                    ->alignEnd(),

                ToggleColumn::make('is_active')
                    ->label('Aktif'),
            ])
            ->filters([
                SelectFilter::make('service_type')
                    ->label('Tipe')
                    ->options([
                        'daily' => 'Harian',
                        'consultant' => 'Konsultan',
                    ]),
                SelectFilter::make('is_active')
                    ->label('Status')
                    ->options([
                        1 => 'Aktif',
                        0 => 'Non-aktif',
                    ]),
            ])
            ->defaultSort('sort_order', 'asc')
            ->reorderable('sort_order')
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
