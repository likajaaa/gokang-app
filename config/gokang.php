<?php

/*
|--------------------------------------------------------------------------
| GoKang Clone Configuration
|--------------------------------------------------------------------------
| Settings yang bisa di-override via .env atau di-seed ke app_settings.
*/

return [

    /*
     * Commission rate platform (percent)
     */
    'commission_rate' => env('GOKANG_COMMISSION_RATE', 15),

    /*
     * Payment
     */
    'payment_mock_mode' => env('GOKANG_PAYMENT_MOCK', true),
    'payment_timer_minutes' => env('GOKANG_PAYMENT_TIMER_MINUTES', 60),

    /*
     * Matching algorithm
     */
    'broadcast_radius_km' => env('GOKANG_BROADCAST_RADIUS_KM', 15),
    'broadcast_radius_max_km' => env('GOKANG_BROADCAST_RADIUS_MAX_KM', 25),
    'order_accept_timeout_minutes' => env('GOKANG_ACCEPT_TIMEOUT_MINUTES', 15),

    /*
     * Payout
     */
    'min_payout_amount' => env('GOKANG_MIN_PAYOUT', 50000),

    /*
     * Work sessions (jam default)
     */
    'sessions' => [
        'morning' => ['start' => '08:00', 'end' => '12:00'],
        'afternoon' => ['start' => '13:00', 'end' => '17:00'],
        'full_day' => ['start' => '08:00', 'end' => '17:00'],
    ],

    /*
     * Order cutoff: untuk pesan besok (H+1) harus sebelum jam ini
     */
    'order_cutoff_hour' => env('GOKANG_ORDER_CUTOFF_HOUR', 15),

    /*
     * Garansi pekerjaan (hari)
     */
    'garansi_hari' => env('GOKANG_GARANSI_HARI', 7),

];
