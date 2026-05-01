<?php

namespace App\Filament\Resources\Areas\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ToggleColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class AreasTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')
                    ->label('Nama')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('level')
                    ->label('Level')
                    ->badge()
                    ->formatStateUsing(fn (string $state) => match ($state) {
                        'city' => 'Kota',
                        'district' => 'Kecamatan',
                        'village' => 'Kelurahan',
                        default => $state,
                    })
                    ->color(fn (string $state) => match ($state) {
                        'city' => 'primary',
                        'district' => 'info',
                        'village' => 'gray',
                        default => 'gray',
                    }),

                TextColumn::make('parent.name')
                    ->label('Parent')
                    ->placeholder('—')
                    ->searchable(),

                ToggleColumn::make('is_covered')
                    ->label('Terlayani'),
            ])
            ->filters([
                SelectFilter::make('level')
                    ->options([
                        'city' => 'Kota',
                        'district' => 'Kecamatan',
                        'village' => 'Kelurahan',
                    ]),
                SelectFilter::make('is_covered')
                    ->label('Status')
                    ->options([
                        1 => 'Terlayani',
                        0 => 'Tidak Terlayani',
                    ]),
            ])
            ->defaultSort('name', 'asc')
            ->groups(['parent.name'])
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
