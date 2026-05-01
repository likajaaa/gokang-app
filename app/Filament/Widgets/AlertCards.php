<?php

namespace App\Filament\Widgets;

use App\Models\Order;
use App\Models\Payout;
use App\Models\Tukang;
use Filament\Widgets\Widget;

class AlertCards extends Widget
{
    protected string $view = 'filament.widgets.alert-cards';

    protected int|string|array $columnSpan = 'full';

    protected function getViewData(): array
    {
        $pendingTukang = Tukang::where('verification_status', 'pending')->count();
        $pendingPayments = Order::where('status', 'pending_payment')->count();
        $pendingPayouts = Payout::where('status', 'pending')->count();
        $disputedOrders = Order::whereIn('status', ['disputed'])->count();

        return [
            'cards' => [
                [
                    'title' => 'Tukang Pending Verifikasi',
                    'count' => $pendingTukang,
                    'description' => $pendingTukang > 0
                        ? "{$pendingTukang} tukang menunggu review dokumen"
                        : 'Semua tukang sudah terverifikasi',
                    'link' => url('/admin/tukangs?tableFilters[verification_status][value]=pending'),
                    'icon' => 'heroicon-o-identification',
                    'variant' => $pendingTukang > 0 ? 'warning' : 'neutral',
                ],
                [
                    'title' => 'Orders Belum Dibayar',
                    'count' => $pendingPayments,
                    'description' => $pendingPayments > 0
                        ? "{$pendingPayments} order menunggu pembayaran"
                        : 'Tidak ada order menunggu pembayaran',
                    'link' => url('/admin/orders?tableFilters[status][value]=pending_payment'),
                    'icon' => 'heroicon-o-credit-card',
                    'variant' => $pendingPayments > 0 ? 'warning' : 'neutral',
                ],
                [
                    'title' => 'Payout Menunggu Approval',
                    'count' => $pendingPayouts,
                    'description' => $pendingPayouts > 0
                        ? "{$pendingPayouts} pencairan tukang menunggu review"
                        : 'Tidak ada payout tertunda',
                    'link' => url('/admin/payouts?tableFilters[status][value]=pending'),
                    'icon' => 'heroicon-o-banknotes',
                    'variant' => $pendingPayouts > 0 ? 'danger' : 'neutral',
                ],
                [
                    'title' => 'Disputes Aktif',
                    'count' => $disputedOrders,
                    'description' => $disputedOrders > 0
                        ? "{$disputedOrders} order dalam sengketa"
                        : 'Tidak ada sengketa aktif',
                    'link' => url('/admin/orders?tableFilters[status][value]=disputed'),
                    'icon' => 'heroicon-o-exclamation-triangle',
                    'variant' => $disputedOrders > 0 ? 'danger' : 'neutral',
                ],
            ],
        ];
    }
}
