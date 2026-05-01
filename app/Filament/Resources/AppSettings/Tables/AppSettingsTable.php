<?php

namespace App\Filament\Resources\AppSettings\Tables;

use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class AppSettingsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('key')
                    ->label('Key')
                    ->searchable()
                    ->sortable()
                    ->fontFamily('mono')
                    ->weight('semibold'),

                TextColumn::make('value')
                    ->label('Value')
                    ->limit(50)
                    ->tooltip(fn ($record) => $record->value),

                TextColumn::make('type')
                    ->label('Tipe')
                    ->badge()
                    ->color(fn (string $state) => match ($state) {
                        'boolean' => 'success',
                        'number' => 'info',
                        'json' => 'warning',
                        default => 'gray',
                    }),

                TextColumn::make('description')
                    ->label('Deskripsi')
                    ->limit(60)
                    ->color('gray')
                    ->wrap(),
            ])
            ->filters([
                SelectFilter::make('type')
                    ->options([
                        'string' => 'String',
                        'number' => 'Number',
                        'boolean' => 'Boolean',
                        'json' => 'JSON',
                    ]),
            ])
            ->defaultSort('key', 'asc')
            ->paginated([25, 50, 100])
            ->recordActions([
                EditAction::make(),
            ]);
    }
}
