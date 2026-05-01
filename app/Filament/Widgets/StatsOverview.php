<?php

namespace App\Filament\Widgets;

use App\Models\Order;
use App\Models\Payment;
use App\Models\User;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class StatsOverview extends BaseWidget
{
    protected ?string $pollingInterval = null;

    protected function getStats(): array
    {
        $totalCustomers = User::where('role', 'customer')->count();
        $customersLastMonth = User::where('role', 'customer')
            ->where('created_at', '<', now()->subDays(30))
            ->count();
        $customerDelta = $this->deltaPercent($totalCustomers, $customersLastMonth);

        $activeTukang = User::where('role', 'tukang')
            ->where('status', 'active')
            ->count();
        $tukangLastMonth = User::where('role', 'tukang')
            ->where('status', 'active')
            ->where('created_at', '<', now()->subDays(30))
            ->count();
        $tukangDelta = $this->deltaPercent($activeTukang, $tukangLastMonth);

        $ordersToday = Order::whereDate('created_at', today())->count();
        $ordersYesterday = Order::whereDate('created_at', today()->subDay())->count();
        $ordersDelta = $this->deltaPercent($ordersToday, $ordersYesterday);

        $revenueToday = (int) Payment::where('status', 'success')
            ->whereDate('paid_at', today())
            ->sum('amount');
        $revenueYesterday = (int) Payment::where('status', 'success')
            ->whereDate('paid_at', today()->subDay())
            ->sum('amount');
        $revenueDelta = $this->deltaPercent($revenueToday, $revenueYesterday);

        $pendingPayment = Order::where('status', 'pending_payment')->count();

        $activeOrders = Order::whereIn('status', [
            'pending_survey',
            'on_survey',
            'pending_assignment',
            'searching_tukang',
            'assigned',
            'on_progress',
            'in_progress',
            'waiting_payment_final',
        ])->count();

        $completedThisMonth = Order::where('status', 'completed')
            ->whereYear('completed_at', now()->year)
            ->whereMonth('completed_at', now()->month)
            ->count();

        $revenueThisMonth = (int) Order::where('status', 'completed')
            ->whereYear('completed_at', now()->year)
            ->whereMonth('completed_at', now()->month)
            ->sum('total');

        return [
            Stat::make('Total Customer', number_format($totalCustomers, 0, ',', '.'))
                ->description($this->formatDelta($customerDelta).' dari bulan lalu')
                ->descriptionIcon($customerDelta >= 0 ? 'heroicon-m-arrow-trending-up' : 'heroicon-m-arrow-trending-down')
                ->color($customerDelta >= 0 ? 'success' : 'danger'),

            Stat::make('Tukang Aktif', number_format($activeTukang, 0, ',', '.'))
                ->description($this->formatDelta($tukangDelta).' dari bulan lalu')
                ->descriptionIcon($tukangDelta >= 0 ? 'heroicon-m-arrow-trending-up' : 'heroicon-m-arrow-trending-down')
                ->color($tukangDelta >= 0 ? 'success' : 'danger'),

            Stat::make('Orders Hari Ini', number_format($ordersToday, 0, ',', '.'))
                ->description($this->formatDelta($ordersDelta).' dari kemarin')
                ->descriptionIcon($ordersDelta >= 0 ? 'heroicon-m-arrow-trending-up' : 'heroicon-m-arrow-trending-down')
                ->color($ordersDelta >= 0 ? 'success' : 'danger'),

            Stat::make('Revenue Hari Ini', 'Rp '.$this->formatCompact($revenueToday))
                ->description($this->formatDelta($revenueDelta).' dari kemarin')
                ->descriptionIcon($revenueDelta >= 0 ? 'heroicon-m-arrow-trending-up' : 'heroicon-m-arrow-trending-down')
                ->color($revenueDelta >= 0 ? 'success' : 'danger'),

            Stat::make('Menunggu Bayar', number_format($pendingPayment, 0, ',', '.'))
                ->description($pendingPayment > 0 ? 'Perlu tindakan segera' : 'Tidak ada tagihan tertunggak')
                ->descriptionIcon('heroicon-m-clock')
                ->color($pendingPayment > 0 ? 'warning' : 'gray'),

            Stat::make('Order Aktif', number_format($activeOrders, 0, ',', '.'))
                ->description('Sedang berjalan')
                ->descriptionIcon('heroicon-m-arrow-trending-up')
                ->color('success'),

            Stat::make('Selesai Bulan Ini', number_format($completedThisMonth, 0, ',', '.'))
                ->description('Order completed bulan ini')
                ->descriptionIcon('heroicon-m-check-circle')
                ->color('success'),

            Stat::make('Revenue Bulan Ini', 'Rp '.$this->formatCompact($revenueThisMonth))
                ->description('Total order completed bulan ini')
                ->descriptionIcon('heroicon-m-banknotes')
                ->color('success'),
        ];
    }

    private function deltaPercent(int $current, int $previous): float
    {
        if ($previous === 0) {
            return $current > 0 ? 100.0 : 0.0;
        }

        return round((($current - $previous) / $previous) * 100, 1);
    }

    private function formatDelta(float $delta): string
    {
        $sign = $delta >= 0 ? '+' : '';

        return $sign.$delta.'%';
    }

    private function formatCompact(int $value): string
    {
        if ($value >= 1_000_000_000) {
            return number_format($value / 1_000_000_000, 1, ',', '.').' M';
        }
        if ($value >= 1_000_000) {
            return number_format($value / 1_000_000, 1, ',', '.').' jt';
        }
        if ($value >= 1_000) {
            return number_format($value / 1_000, 0, ',', '.').' rb';
        }

        return number_format($value, 0, ',', '.');
    }
}
