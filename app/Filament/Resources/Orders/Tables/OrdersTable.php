<?php

namespace App\Filament\Resources\Orders\Tables;

use App\Models\Order;
use App\Models\OrderStatusLog;
use Filament\Actions\Action;
use Filament\Actions\ActionGroup;
use Filament\Actions\BulkAction;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\ViewAction;
use Filament\Forms\Components\Textarea;
use Filament\Notifications\Notification as FilamentNotification;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\Filter;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Collection;
use Symfony\Component\HttpFoundation\StreamedResponse;

class OrdersTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('order_code')
                    ->label('Kode')
                    ->searchable()
                    ->sortable()
                    ->copyable()
                    ->weight('semibold'),

                TextColumn::make('customer.name')
                    ->label('Customer')
                    ->searchable()
                    ->limit(25),

                TextColumn::make('order_type')
                    ->label('Tipe')
                    ->badge()
                    ->formatStateUsing(fn (string $state) => match ($state) {
                        'daily_tukang' => 'Tukang',
                        'daily_with_material' => 'Tukang+Material',
                        'borongan_home' => 'Borongan Rumah',
                        'borongan_business' => 'Borongan Bisnis',
                        default => $state,
                    })
                    ->color(fn (string $state) => match ($state) {
                        'borongan_home' => 'info',
                        'borongan_business' => 'success',
                        'daily_tukang' => 'warning',
                        'daily_with_material' => 'danger',
                        default => 'gray',
                    }),

                TextColumn::make('items.service.name')
                    ->label('Services')
                    ->badge()
                    ->separator(',')
                    ->limitList(2)
                    ->placeholder('—'),

                TextColumn::make('survey_address')
                    ->label('Alamat')
                    ->state(fn ($record) => $record->survey_address ?? $record->address?->full_address ?? '—')
                    ->limit(30)
                    ->toggleable(isToggledHiddenByDefault: true),

                TextColumn::make('survey_scheduled_at')
                    ->label('Jadwal Survey')
                    ->dateTime('d M Y H:i')
                    ->placeholder('—')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),

                TextColumn::make('status')
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

                TextColumn::make('total')
                    ->label('Total')
                    ->money('IDR')
                    ->sortable()
                    ->alignEnd(),

                TextColumn::make('created_at')
                    ->label('Dibuat')
                    ->dateTime('d M Y H:i')
                    ->sortable(),
            ])
            ->filters([
                SelectFilter::make('status')
                    ->options([
                        'draft' => 'Draft',
                        'pending_payment' => 'Belum Dibayar',
                        'pending_survey' => 'Menunggu Survey',
                        'on_survey' => 'Survey Berlangsung',
                        'pending_assignment' => 'Mencari Tukang',
                        'paid' => 'Sudah Dibayar',
                        'searching_tukang' => 'Searching Tukang',
                        'assigned' => 'Tukang Ditugaskan',
                        'on_progress' => 'Sedang Dikerjakan',
                        'in_progress' => 'In Progress',
                        'waiting_payment_final' => 'Menunggu Pelunasan',
                        'completed' => 'Selesai',
                        'cancelled' => 'Dibatalkan',
                        'rejected' => 'Ditolak',
                        'refunded' => 'Refunded',
                    ]),

                SelectFilter::make('order_type')
                    ->options([
                        'daily_tukang' => 'Tukang Harian',
                        'daily_with_material' => 'Tukang + Material',
                        'borongan_home' => 'Borongan Rumah',
                        'borongan_business' => 'Borongan Bisnis',
                    ]),

                Filter::make('created_at')
                    ->schema([
                        \Filament\Forms\Components\DatePicker::make('from')->label('Dari'),
                        \Filament\Forms\Components\DatePicker::make('until')->label('Sampai'),
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

                    Action::make('start_survey')
                        ->label('Mulai Survey')
                        ->icon('heroicon-o-map-pin')
                        ->color('info')
                        ->visible(fn (Order $record) => $record->status === 'pending_survey'
                            && (auth()->user()?->isAnyAdmin() ?? false))
                        ->requiresConfirmation()
                        ->modalDescription('Apakah surveyor sudah siap ke lokasi?')
                        ->action(function (Order $record) {
                            $from = $record->status;
                            $record->update(['status' => 'on_survey']);

                            OrderStatusLog::create([
                                'order_id' => $record->id,
                                'from_status' => $from,
                                'to_status' => 'on_survey',
                                'changed_by' => auth()->id(),
                                'notes' => '[ADMIN] Mulai survey',
                            ]);

                            FilamentNotification::make()
                                ->title('Survey dimulai')
                                ->success()
                                ->send();
                        }),

                    Action::make('complete_survey')
                        ->label('Selesai Survey')
                        ->icon('heroicon-o-check-circle')
                        ->color('success')
                        ->visible(fn (Order $record) => $record->status === 'on_survey'
                            && (auth()->user()?->isAnyAdmin() ?? false))
                        ->requiresConfirmation()
                        ->modalDescription('Survey sudah selesai dilakukan?')
                        ->action(function (Order $record) {
                            $from = $record->status;
                            $record->update(['status' => 'pending_assignment']);

                            OrderStatusLog::create([
                                'order_id' => $record->id,
                                'from_status' => $from,
                                'to_status' => 'pending_assignment',
                                'changed_by' => auth()->id(),
                                'notes' => '[ADMIN] Survey selesai',
                            ]);

                            FilamentNotification::make()
                                ->title('Survey selesai, mencari tukang')
                                ->success()
                                ->send();
                        }),

                    Action::make('assign_tukang')
                        ->label('Tugaskan Tukang')
                        ->icon('heroicon-o-user-plus')
                        ->color('warning')
                        ->visible(fn (Order $record) => $record->status === 'pending_assignment'
                            && (auth()->user()?->isAnyAdmin() ?? false))
                        ->requiresConfirmation()
                        ->modalDescription('Tukang sudah ditugaskan?')
                        ->action(function (Order $record) {
                            $from = $record->status;
                            $record->update([
                                'status' => 'on_progress',
                                'started_at' => $record->started_at ?? now(),
                            ]);

                            OrderStatusLog::create([
                                'order_id' => $record->id,
                                'from_status' => $from,
                                'to_status' => 'on_progress',
                                'changed_by' => auth()->id(),
                                'notes' => '[ADMIN] Tukang ditugaskan',
                            ]);

                            FilamentNotification::make()
                                ->title('Tukang ditugaskan')
                                ->success()
                                ->send();
                        }),

                    Action::make('mark_complete')
                        ->label('Tandai Selesai')
                        ->icon('heroicon-o-flag')
                        ->color('success')
                        ->visible(fn (Order $record) => in_array($record->status, ['on_progress', 'in_progress'], true)
                            && (auth()->user()?->isAnyAdmin() ?? false))
                        ->requiresConfirmation()
                        ->modalDescription('Pekerjaan sudah selesai?')
                        ->action(function (Order $record) {
                            $from = $record->status;
                            $record->update(['status' => 'waiting_payment_final']);

                            OrderStatusLog::create([
                                'order_id' => $record->id,
                                'from_status' => $from,
                                'to_status' => 'waiting_payment_final',
                                'changed_by' => auth()->id(),
                                'notes' => '[ADMIN] Pekerjaan selesai, menunggu pelunasan',
                            ]);

                            FilamentNotification::make()
                                ->title('Order siap dilunasi')
                                ->success()
                                ->send();
                        }),

                    Action::make('complete_payment')
                        ->label('Konfirmasi Lunas')
                        ->icon('heroicon-o-banknotes')
                        ->color('success')
                        ->visible(fn (Order $record) => $record->status === 'waiting_payment_final'
                            && (auth()->user()?->isAnyAdmin() ?? false))
                        ->requiresConfirmation()
                        ->modalDescription('Konfirmasi pembayaran lunas?')
                        ->action(function (Order $record) {
                            $from = $record->status;
                            $record->update([
                                'status' => 'completed',
                                'completed_at' => now(),
                            ]);

                            OrderStatusLog::create([
                                'order_id' => $record->id,
                                'from_status' => $from,
                                'to_status' => 'completed',
                                'changed_by' => auth()->id(),
                                'notes' => '[ADMIN] Pembayaran lunas, order selesai',
                            ]);

                            FilamentNotification::make()
                                ->title('Order selesai')
                                ->success()
                                ->send();
                        }),

                    Action::make('reject')
                        ->label('Tolak')
                        ->icon('heroicon-o-x-circle')
                        ->color('danger')
                        ->visible(fn (Order $record) => ! in_array($record->status, ['completed', 'cancelled', 'rejected', 'refunded'], true)
                            && in_array(auth()->user()?->role, ['super_admin', 'admin'], true))
                        ->schema([
                            Textarea::make('reason')
                                ->label('Alasan Penolakan')
                                ->required()
                                ->rows(3),
                        ])
                        ->action(function (Order $record, array $data) {
                            $from = $record->status;
                            $record->update([
                                'status' => 'rejected',
                                'cancelled_at' => now(),
                                'cancelled_by' => 'admin',
                                'cancel_reason' => $data['reason'],
                            ]);

                            $record->assignments()
                                ->whereIn('status', ['broadcasting', 'offered', 'accepted'])
                                ->update(['status' => 'cancelled']);

                            OrderStatusLog::create([
                                'order_id' => $record->id,
                                'from_status' => $from,
                                'to_status' => 'rejected',
                                'changed_by' => auth()->id(),
                                'notes' => '[ADMIN REJECT] '.$data['reason'],
                            ]);

                            FilamentNotification::make()
                                ->title('Order ditolak')
                                ->danger()
                                ->send();
                        }),

                    Action::make('force_cancel')
                        ->label('Force Cancel')
                        ->icon('heroicon-o-x-circle')
                        ->color('danger')
                        ->requiresConfirmation()
                        ->visible(fn ($record) => $record->canBeCancelled()
                            && in_array(auth()->user()?->role, ['super_admin', 'admin'], true))
                        ->schema([
                            Textarea::make('reason')
                                ->label('Alasan Cancel')
                                ->required()
                                ->rows(3),
                        ])
                        ->action(function ($record, array $data) {
                            $record->update([
                                'status' => 'cancelled',
                                'cancelled_at' => now(),
                                'cancelled_by' => 'admin',
                                'cancel_reason' => $data['reason'],
                            ]);

                            $record->assignments()
                                ->whereIn('status', ['broadcasting', 'offered', 'accepted'])
                                ->update(['status' => 'cancelled']);

                            OrderStatusLog::create([
                                'order_id' => $record->id,
                                'from_status' => $record->getOriginal('status'),
                                'to_status' => 'cancelled',
                                'changed_by' => auth()->id(),
                                'notes' => '[FORCE CANCEL] '.$data['reason'],
                            ]);

                            FilamentNotification::make()
                                ->title('Order dibatalkan')
                                ->danger()
                                ->send();
                        }),

                    Action::make('add_note')
                        ->label('Catatan Internal')
                        ->icon('heroicon-o-pencil-square')
                        ->color('info')
                        ->visible(fn () => auth()->user()?->isAnyAdmin() ?? false)
                        ->schema([
                            Textarea::make('note')
                                ->label('Catatan')
                                ->required()
                                ->rows(3),
                        ])
                        ->action(function ($record, array $data) {
                            OrderStatusLog::create([
                                'order_id' => $record->id,
                                'from_status' => $record->status,
                                'to_status' => $record->status,
                                'changed_by' => auth()->id(),
                                'notes' => '[ADMIN NOTE] '.$data['note'],
                            ]);

                            FilamentNotification::make()
                                ->title('Catatan ditambahkan')
                                ->success()
                                ->send();
                        }),
                ]),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    BulkAction::make('export_csv')
                        ->label('Export CSV')
                        ->icon('heroicon-o-arrow-down-tray')
                        ->color('info')
                        ->visible(fn () => auth()->user()?->isAnyAdmin() ?? false)
                        ->action(function (Collection $records): StreamedResponse {
                            $filename = 'orders-'.now()->format('Y-m-d_His').'.csv';

                            return response()->streamDownload(function () use ($records) {
                                $records->loadMissing(['customer', 'address']);
                                $out = fopen('php://output', 'w');
                                // BOM supaya Excel kenal UTF-8
                                fwrite($out, "\xEF\xBB\xBF");
                                fputcsv($out, [
                                    'Kode',
                                    'Customer',
                                    'Tipe',
                                    'Status',
                                    'Alamat',
                                    'Jadwal Survey',
                                    'Total',
                                    'Dibuat',
                                ]);

                                foreach ($records as $order) {
                                    /** @var Order $order */
                                    fputcsv($out, [
                                        $order->order_code,
                                        $order->customer?->name ?? '—',
                                        $order->order_type,
                                        $order->status,
                                        $order->survey_address ?? $order->address?->full_address ?? '—',
                                        $order->survey_scheduled_at?->format('Y-m-d H:i') ?? '—',
                                        (string) $order->total,
                                        $order->created_at?->format('Y-m-d H:i') ?? '—',
                                    ]);
                                }

                                fclose($out);
                            }, $filename, [
                                'Content-Type' => 'text/csv; charset=UTF-8',
                            ]);
                        })
                        ->deselectRecordsAfterCompletion(),
                ]),
            ]);
    }
}
