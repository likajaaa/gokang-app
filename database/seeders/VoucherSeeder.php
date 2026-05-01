<?php

namespace Database\Seeders;

use App\Models\Voucher;
use Illuminate\Database\Seeder;

class VoucherSeeder extends Seeder
{
    /**
     * Seed sample vouchers untuk Promo screen testing.
     * Pakai column existing schema: title, type, value, min_transaction, valid_until, applicable_services.
     */
    public function run(): void
    {
        $vouchers = [
            [
                'code'                 => 'SURVEY60',
                'title'                => 'Diskon 60% Biaya Survey',
                'description'          => 'Hemat hingga Rp 150.000 untuk biaya survey borongan',
                'type'                 => 'percentage',
                'value'                => 60,
                'max_discount'         => 150000,
                'min_transaction'      => 100000,
                'usage_limit_total'    => null,
                'usage_limit_per_user' => 1,
                'used_count'           => 0,
                'applicable_services'  => null, // null = semua layanan
                'is_active'            => true,
                'valid_from'           => null,
                'valid_until'          => '2026-12-31 23:59:59',
            ],
            [
                'code'                 => 'NEWUSER150',
                'title'                => 'Diskon Pengguna Baru',
                'description'          => 'Dapatkan diskon Rp 150.000 untuk order pertama kamu',
                'type'                 => 'fixed',
                'value'                => 150000,
                'max_discount'         => 150000,
                'min_transaction'      => 200000,
                'usage_limit_total'    => null,
                'usage_limit_per_user' => 1,
                'used_count'           => 0,
                'applicable_services'  => null,
                'is_active'            => true,
                'valid_from'           => null,
                'valid_until'          => '2026-12-31 23:59:59',
            ],
            [
                'code'                 => 'GOKANG50',
                'title'                => 'Diskon 50rb untuk Semua Layanan',
                'description'          => 'Potongan langsung Rp 50.000 minimal order Rp 150.000',
                'type'                 => 'fixed',
                'value'                => 50000,
                'max_discount'         => 50000,
                'min_transaction'      => 150000,
                'usage_limit_total'    => null,
                'usage_limit_per_user' => 1,
                'used_count'           => 0,
                'applicable_services'  => null,
                'is_active'            => true,
                'valid_from'           => null,
                'valid_until'          => '2026-12-31 23:59:59',
            ],
        ];

        foreach ($vouchers as $data) {
            Voucher::updateOrCreate(['code' => $data['code']], $data);
        }
    }
}
