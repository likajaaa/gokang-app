<?php

namespace App\Filament\Pages;

use App\Filament\Widgets\AlertCards;
use App\Filament\Widgets\OrdersChart;
use App\Filament\Widgets\RevenueChart;
use App\Filament\Widgets\StatsOverview;
use BackedEnum;
use Filament\Pages\Dashboard as BaseDashboard;
use Illuminate\Support\Facades\Auth;

class Dashboard extends BaseDashboard
{
    protected static BackedEnum|string|null $navigationIcon = 'heroicon-o-home';

    protected static ?string $title = 'Dashboard';

    public function getHeading(): string
    {
        $name = Auth::user()?->name ?? 'Admin';

        return "Selamat Datang, {$name} 👋";
    }

    public function getSubheading(): ?string
    {
        $lastLogin = Auth::user()?->last_login_at;

        if ($lastLogin) {
            return 'Terakhir login: '.$lastLogin->format('d M Y, H:i').' WIB';
        }

        return 'Selamat datang di Admin Panel GoKang Clone.';
    }

    public function getWidgets(): array
    {
        return [
            StatsOverview::class,
            OrdersChart::class,
            RevenueChart::class,
            AlertCards::class,
        ];
    }
}
