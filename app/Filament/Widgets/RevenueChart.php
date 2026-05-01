<?php

namespace App\Filament\Widgets;

use App\Models\Payment;
use Filament\Widgets\ChartWidget;

class RevenueChart extends ChartWidget
{
    protected ?string $heading = 'Revenue (6 Bulan Terakhir)';

    protected int|string|array $columnSpan = 'full';

    protected ?string $maxHeight = '300px';

    protected function getData(): array
    {
        $data = collect(range(5, 0))->map(function (int $monthsAgo) {
            $date = now()->subMonths($monthsAgo)->startOfMonth();
            $end = (clone $date)->endOfMonth();

            return [
                'month' => $date->format('M Y'),
                'revenue' => (int) Payment::where('status', 'success')
                    ->whereBetween('paid_at', [$date, $end])
                    ->sum('amount'),
            ];
        });

        return [
            'datasets' => [
                [
                    'label' => 'Revenue (Rp)',
                    'data' => $data->pluck('revenue')->all(),
                    'backgroundColor' => '#E8272A',
                    'borderRadius' => 6,
                    'borderSkipped' => false,
                ],
            ],
            'labels' => $data->pluck('month')->all(),
        ];
    }

    protected function getType(): string
    {
        return 'bar';
    }

    protected function getOptions(): array
    {
        return [
            'plugins' => [
                'legend' => ['display' => false],
            ],
            'scales' => [
                'y' => [
                    'beginAtZero' => true,
                ],
            ],
        ];
    }
}
