<?php

namespace App\Filament\Resources\Customers\Tables;

use App\Models\Notification;
use Filament\Actions\Action;
use Filament\Actions\ActionGroup;
use Filament\Actions\ViewAction;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Textarea;
use Filament\Notifications\Notification as FilamentNotification;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\Filter;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class CustomersTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('id')->label('ID')->sortable(),

                TextColumn::make('name')
                    ->label('Nama')
                    ->searchable()
                    ->sortable()
                    ->weight('semibold'),

                TextColumn::make('phone')
                    ->label('Phone')
                    ->searchable()
                    ->copyable(),

                TextColumn::make('email')
                    ->label('Email')
                    ->searchable()
                    ->placeholder('—')
                    ->toggleable(),

                TextColumn::make('customer.total_orders')
                    ->label('Orders')
                    ->sortable()
                    ->alignEnd()
                    ->default(0),

                TextColumn::make('customer.total_spent')
                    ->label('Total Spent')
                    ->money('IDR')
                    ->sortable()
                    ->alignEnd()
                    ->default(0),

                TextColumn::make('status')
                    ->label('Status')
                    ->badge()
                    ->color(fn (string $state) => match ($state) {
                        'active' => 'success',
                        'banned' => 'danger',
                        'suspended' => 'warning',
                        default => 'gray',
                    }),

                TextColumn::make('created_at')
                    ->label('Registered')
                    ->dateTime('d M Y')
                    ->sortable(),
            ])
            ->filters([
                SelectFilter::make('status')
                    ->options([
                        'active' => 'Active',
                        'inactive' => 'Inactive',
                        'suspended' => 'Suspended',
                        'banned' => 'Banned',
                    ]),

                Filter::make('created_at')
                    ->schema([
                        DatePicker::make('from')->label('Dari'),
                        DatePicker::make('until')->label('Sampai'),
                    ])
                    ->query(function ($query, array $data) {
                        return $query
                            ->when($data['from'] ?? null, fn ($q, $d) => $q->whereDate('created_at', '>=', $d))
                            ->when($data['until'] ?? null, fn ($q, $d) => $q->whereDate('created_at', '<=', $d));
                    }),
            ])
            ->defaultSort('created_at', 'desc')
            ->recordActions([
                ActionGroup::make([
                    ViewAction::make(),

                    Action::make('ban')
                        ->label('Ban Customer')
                        ->icon('heroicon-o-no-symbol')
                        ->color('danger')
                        ->requiresConfirmation()
                        ->visible(fn ($record) => $record->status !== 'banned'
                            && in_array(auth()->user()?->role, ['super_admin', 'admin'], true))
                        ->schema([
                            Textarea::make('reason')
                                ->label('Alasan Ban')
                                ->required()
                                ->rows(3),
                        ])
                        ->action(function ($record, array $data) {
                            $record->update(['status' => 'banned']);

                            Notification::create([
                                'user_id' => $record->id,
                                'type' => 'account_status',
                                'title' => 'Akun Diblokir',
                                'body' => 'Akun kamu telah diblokir oleh admin. Alasan: '.$data['reason'],
                            ]);

                            FilamentNotification::make()
                                ->title('Customer diban')
                                ->danger()
                                ->send();
                        }),

                    Action::make('unban')
                        ->label('Unban')
                        ->icon('heroicon-o-check-circle')
                        ->color('success')
                        ->requiresConfirmation()
                        ->visible(fn ($record) => $record->status === 'banned'
                            && in_array(auth()->user()?->role, ['super_admin', 'admin'], true))
                        ->action(function ($record) {
                            $record->update(['status' => 'active']);

                            Notification::create([
                                'user_id' => $record->id,
                                'type' => 'account_status',
                                'title' => 'Akun Diaktifkan',
                                'body' => 'Akun kamu telah diaktifkan kembali oleh admin.',
                            ]);

                            FilamentNotification::make()
                                ->title('Customer diaktifkan')
                                ->success()
                                ->send();
                        }),
                ]),
            ]);
    }
}
