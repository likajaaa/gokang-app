<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Extend users.role enum dengan 3 role admin yang hilang dari DB:
     * - super_admin (akses penuh)
     * - cs          (customer service, read-only)
     * - finance     (verifikasi pembayaran & payout)
     *
     * Migration source sudah punya 7 values tapi DB lama cuma 4
     * (customer, tukang, admin, consultant). Ini menyamakan keduanya.
     */
    public function up(): void
    {
        DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM(
            'customer',
            'tukang',
            'admin',
            'super_admin',
            'cs',
            'finance',
            'consultant'
        ) NOT NULL DEFAULT 'customer'");
    }

    public function down(): void
    {
        // Sebelum revert, demote rows ke 'admin' supaya tidak truncate error.
        DB::table('users')
            ->whereIn('role', ['super_admin', 'cs', 'finance'])
            ->update(['role' => 'admin']);

        DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM(
            'customer',
            'tukang',
            'admin',
            'consultant'
        ) NOT NULL DEFAULT 'customer'");
    }
};
