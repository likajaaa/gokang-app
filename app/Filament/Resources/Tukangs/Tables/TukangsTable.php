<?php

namespace App\Filament\Resources\Tukangs\Tables;

use App\Models\Notification;
use App\Models\Service;
use App\Models\User;
use Filament\Actions\Action;
use Filament\Actions\ActionGroup;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Notifications\Notification as FilamentNotification;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Table;

class TukangsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                ImageColumn::make('user.avatar')
                    ->label('')
                    ->circular()
                    ->defaultImageUrl(fn ($record) => 'https://ui-avatars.com/api/?name='.urlencode($record->user?->name ?? '?').'&background=E8272A&color=fff'),

                TextColumn::make('user.name')
                    ->label('Nama')
                    ->searchable()
                    ->sortable()
                    ->weight('semibold'),

                TextColumn::make('user.phone')
                    ->label('Phone')
                    ->searchable()
                    ->copyable()
                    ->toggleable(),

                TextColumn::make('services.name')
                    ->label('Keahlian')
                    ->badge()
                    ->separator(',')
                    ->limitList(2)
                    ->placeholder('—'),

                TextColumn::make('rating_average')
                    ->label('Rating')
                    ->formatStateUsing(fn ($state) => $state > 0 ? number_format((float) $state, 1).' ★' : '—')
                    ->sortable()
                    ->color(fn ($state) => $state >= 4 ? 'success' : ($state >= 3 ? 'warning' : 'gray')),

                TextColumn::make('total_orders')
                    ->label('Orders')
                    ->sortable()
                    ->alignEnd(),

                TextColumn::make('verification_status')
                    ->label('Verifikasi')
                    ->badge()
                    ->color(fn (string $state) => match ($state) {
                        'approved' => 'success',
                        'pending' => 'warning',
                        'rejected' => 'danger',
                        default => 'gray',
                    }),

                IconColumn::make('is_online')
                    ->label('Online')
                    ->boolean()
                    ->trueColor('success')
                    ->falseColor('gray'),
            ])
            ->filters([
                SelectFilter::make('verification_status')
                    ->label('Status Verifikasi')
                    ->options([
                        'pending' => 'Pending',
                        'approved' => 'Approved',
                        'rejected' => 'Rejected',
                    ]),

                SelectFilter::make('services')
                    ->label('Keahlian')
                    ->relationship('services', 'name')
                    ->multiple(),

                TernaryFilter::make('is_online')
                    ->label('Online')
                    ->placeholder('Semua')
                    ->trueLabel('Online')
                    ->falseLabel('Offline'),
            ])
            ->defaultSort('created_at', 'desc')
            ->recordActions([
                ActionGroup::make([
                    ViewAction::make(),
                    EditAction::make()
                        ->visible(fn () => in_array(auth()->user()?->role, ['super_admin', 'admin'], true)),

                    Action::make('approve')
                        ->label('Approve')
                        ->icon('heroicon-o-check-circle')
                        ->color('success')
                        ->requiresConfirmation()
                        ->visible(fn ($record) => $record->verification_status === 'pending'
                            && in_array(auth()->user()?->role, ['super_admin', 'admin'], true))
                        ->action(function ($record) {
                            $record->update([
                                'verification_status' => 'approved',
                                'verified_at' => now(),
                                'verified_by' => auth()->id(),
                            ]);

                            $record->user?->update(['status' => 'active']);

                            Notification::create([
                                'user_id' => $record->user_id,
                                'type' => 'account_status',
                                'title' => 'Akun Diverifikasi',
                                'body' => 'Selamat! Akun tukang kamu sudah disetujui dan aktif.',
                            ]);

                            FilamentNotification::make()
                                ->title('Tukang diapprove')
                                ->success()
                                ->send();
                        }),

                    Action::make('reject')
                        ->label('Reject')
                        ->icon('heroicon-o-x-circle')
                        ->color('danger')
                        ->requiresConfirmation()
                        ->visible(fn ($record) => $record->verification_status === 'pending'
                            && in_array(auth()->user()?->role, ['super_admin', 'admin'], true))
                        ->schema([
                            Textarea::make('rejection_reason')
                                ->label('Alasan Rejection')
                                ->required()
                                ->rows(3),
                        ])
                        ->action(function ($record, array $data) {
                            $record->update([
                                'verification_status' => 'rejected',
                                'verification_notes' => $data['rejection_reason'],
                                'verified_by' => auth()->id(),
                            ]);

                            Notification::create([
                                'user_id' => $record->user_id,
                                'type' => 'account_status',
                                'title' => 'Pendaftaran Ditolak',
                                'body' => 'Maaf, pendaftaran tukang kamu ditolak. Alasan: '.$data['rejection_reason'],
                            ]);

                            FilamentNotification::make()
                                ->title('Tukang direject')
                                ->warning()
                                ->send();
                        }),

                    Action::make('suspend')
                        ->label('Suspend')
                        ->icon('heroicon-o-no-symbol')
                        ->color('warning')
                        ->requiresConfirmation()
                        ->visible(fn ($record) => $record->verification_status === 'approved'
                            && $record->user?->status === 'active'
                            && in_array(auth()->user()?->role, ['super_admin', 'admin'], true))
                        ->schema([
                            Select::make('duration')
                                ->label('Durasi')
                                ->options([
                                    '7' => '7 hari',
                                    '14' => '14 hari',
                                    '30' => '30 hari',
                                    'permanent' => 'Permanent',
                                ])
                                ->required(),
                            Textarea::make('reason')
                                ->label('Alasan Suspend')
                                ->required()
                                ->rows(3),
                        ])
                        ->action(function ($record, array $data) {
                            $record->user?->update(['status' => 'suspended']);

                            Notification::create([
                                'user_id' => $record->user_id,
                                'type' => 'account_status',
                                'title' => 'Akun Di-suspend',
                                'body' => "Akun kamu di-suspend ({$data['duration']}). Alasan: {$data['reason']}",
                            ]);

                            FilamentNotification::make()
                                ->title('Tukang disuspend')
                                ->warning()
                                ->send();
                        }),

                    Action::make('ban')
                        ->label('Ban Permanent')
                        ->icon('heroicon-o-shield-exclamation')
                        ->color('danger')
                        ->requiresConfirmation()
                        ->modalHeading('Ban Tukang Secara Permanen?')
                        ->modalDescription('Tindakan ini tidak bisa dibatalkan otomatis. Tukang tidak akan bisa login kembali.')
                        ->visible(fn ($record) => $record->user?->status !== 'banned'
                            && auth()->user()?->isSuperAdmin())
                        ->action(function ($record) {
                            $record->user?->update(['status' => 'banned']);

                            Notification::create([
                                'user_id' => $record->user_id,
                                'type' => 'account_status',
                                'title' => 'Akun Diblokir',
                                'body' => 'Akun kamu telah diblokir permanent oleh admin.',
                            ]);

                            FilamentNotification::make()
                                ->title('Tukang diban')
                                ->danger()
                                ->send();
                        }),
                ]),
            ]);
    }
}
