<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AppSettingsAndAdminSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            // Commission & payout
            ['key' => 'commission_rate_default', 'value' => '15', 'type' => 'number', 'description' => 'Default komisi platform (%)'],
            ['key' => 'min_payout_amount', 'value' => '50000', 'type' => 'number', 'description' => 'Minimum pencairan tukang'],

            // Order timings
            ['key' => 'payment_timer_minutes', 'value' => '60', 'type' => 'number', 'description' => 'Timer bayar (menit, sesuai UI 0:59:55)'],
            ['key' => 'order_accept_timeout_minutes', 'value' => '15', 'type' => 'number', 'description' => 'Timeout tukang accept order'],
            ['key' => 'order_cutoff_hour', 'value' => '15', 'type' => 'number', 'description' => 'Batas jam pesan untuk H+1'],

            // Sessions (sesuai UI GoKang Image 2)
            ['key' => 'session_morning_start', 'value' => '08:00', 'type' => 'string', 'description' => 'Jam mulai sesi Pagi'],
            ['key' => 'session_morning_end', 'value' => '12:00', 'type' => 'string', 'description' => 'Jam selesai sesi Pagi'],
            ['key' => 'session_afternoon_start', 'value' => '13:00', 'type' => 'string', 'description' => 'Jam mulai sesi Sore'],
            ['key' => 'session_afternoon_end', 'value' => '17:00', 'type' => 'string', 'description' => 'Jam selesai sesi Sore'],
            ['key' => 'session_full_day_start', 'value' => '08:00', 'type' => 'string', 'description' => 'Jam mulai Seharian'],
            ['key' => 'session_full_day_end', 'value' => '17:00', 'type' => 'string', 'description' => 'Jam selesai Seharian'],

            // Matching
            ['key' => 'broadcast_radius_km', 'value' => '15', 'type' => 'number', 'description' => 'Radius broadcast awal'],
            ['key' => 'broadcast_radius_max_km', 'value' => '25', 'type' => 'number', 'description' => 'Radius broadcast maksimal'],

            // Borongan
            ['key' => 'survey_fee_default', 'value' => '250000', 'type' => 'number', 'description' => 'Biaya survey borongan'],
            ['key' => 'survey_fee_promo', 'value' => '100000', 'type' => 'number', 'description' => 'Biaya survey promo'],

            // Others
            ['key' => 'garansi_hari', 'value' => '7', 'type' => 'number', 'description' => 'Durasi garansi (hari)'],
            ['key' => 'maintenance_mode', 'value' => 'false', 'type' => 'boolean', 'description' => 'Mode maintenance'],
            ['key' => 'payment_mock_mode', 'value' => 'true', 'type' => 'boolean', 'description' => 'Mock payment untuk dev'],
        ];

        foreach ($settings as $setting) {
            DB::table('app_settings')->updateOrInsert(
                ['key' => $setting['key']],
                array_merge($setting, [
                    'created_at' => now(),
                    'updated_at' => now(),
                ])
            );
        }

        // Admin users — 4 roles
        $adminUsers = [
            [
                'phone' => '+6281111111111',
                'email' => 'superadmin@gokang.test',
                'name' => 'Super Admin',
                'role' => 'super_admin',
            ],
            [
                'phone' => '+6281111111112',
                'email' => 'admin@gokang.test',
                'name' => 'Admin',
                'role' => 'admin',
            ],
            [
                'phone' => '+6281111111113',
                'email' => 'cs@gokang.test',
                'name' => 'Customer Service',
                'role' => 'cs',
            ],
            [
                'phone' => '+6281111111114',
                'email' => 'finance@gokang.test',
                'name' => 'Finance',
                'role' => 'finance',
            ],
        ];

        foreach ($adminUsers as $admin) {
            User::updateOrCreate(
                ['phone' => $admin['phone']],
                [
                    'role' => $admin['role'],
                    'name' => $admin['name'],
                    'email' => $admin['email'],
                    'password' => Hash::make('password'),
                    'phone_verified_at' => now(),
                    'email_verified_at' => now(),
                    'status' => 'active',
                ]
            );
        }
    }
}
