@php
    $variantStyles = [
        'warning' => 'border-l-amber-500 dark:border-l-amber-400',
        'danger' => 'border-l-red-500 dark:border-l-red-400',
        'neutral' => 'border-l-gray-300 dark:border-l-gray-700',
    ];
    $iconStyles = [
        'warning' => 'text-amber-500 bg-amber-50 dark:bg-amber-500/10',
        'danger' => 'text-red-500 bg-red-50 dark:bg-red-500/10',
        'neutral' => 'text-gray-500 bg-gray-100 dark:bg-gray-800',
    ];
@endphp

<x-filament-widgets::widget>
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        @foreach ($cards as $card)
            <a
                href="{{ $card['link'] }}"
                class="fi-wi-card group relative flex items-start gap-4 overflow-hidden rounded-xl border border-l-4 {{ $variantStyles[$card['variant']] ?? $variantStyles['neutral'] }} border-gray-200 bg-white p-5 transition-colors hover:border-gray-300 hover:bg-gray-50 dark:border-white/10 dark:bg-gray-900 dark:hover:bg-white/5"
            >
                <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg {{ $iconStyles[$card['variant']] ?? $iconStyles['neutral'] }}">
                    <x-filament::icon :icon="$card['icon']" class="h-5 w-5" />
                </div>

                <div class="flex-1">
                    <div class="flex items-center justify-between">
                        <p class="text-sm font-semibold text-gray-900 dark:text-white">
                            {{ $card['title'] }}
                        </p>
                        @if ($card['count'] > 0)
                            <span class="inline-flex items-center rounded-full bg-red-50 px-2 py-0.5 text-xs font-bold text-red-600 dark:bg-red-500/10 dark:text-red-400">
                                {{ $card['count'] }}
                            </span>
                        @endif
                    </div>
                    <p class="mt-1 text-xs text-gray-600 dark:text-gray-400">
                        {{ $card['description'] }}
                    </p>
                    <p class="mt-2 text-xs font-medium text-primary-600 group-hover:underline dark:text-primary-400">
                        Lihat detail &rarr;
                    </p>
                </div>
            </a>
        @endforeach
    </div>
</x-filament-widgets::widget>
