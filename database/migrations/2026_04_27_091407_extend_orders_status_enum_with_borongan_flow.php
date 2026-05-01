<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Extend orders.status enum dengan 6 status borongan flow:
     * - pending_survey       (setelah DP dibayar untuk borongan)
     * - on_survey            (konsultan datang ke lokasi)
     * - pending_assignment   (survey selesai, cari tukang)
     * - on_progress          (tukang mulai kerja, alias borongan untuk in_progress)
     * - waiting_payment_final (pekerjaan selesai, tunggu pelunasan)
     * - rejected             (ditolak admin)
     *
     * Existing values (daily_tukang flow) tetap support:
     * draft, pending_payment, paid, searching_tukang, assigned, in_progress, completed, cancelled, refunded
     */
    public function up(): void
    {
        DB::statement("ALTER TABLE orders MODIFY COLUMN status ENUM(
            'draft',
            'pending_payment',
            'pending_survey',
            'on_survey',
            'pending_assignment',
            'paid',
            'searching_tukang',
            'assigned',
            'on_progress',
            'in_progress',
            'waiting_payment_final',
            'completed',
            'cancelled',
            'refunded',
            'rejected'
        ) NOT NULL DEFAULT 'draft'");
    }

    public function down(): void
    {
        // Sebelum revert: pastikan tidak ada rows dengan status yang akan dihapus,
        // kalau ada → reset ke 'cancelled' supaya tidak data-loss/truncate error.
        DB::table('orders')
            ->whereIn('status', [
                'pending_survey',
                'on_survey',
                'pending_assignment',
                'on_progress',
                'waiting_payment_final',
                'rejected',
            ])
            ->update(['status' => 'cancelled']);

        DB::statement("ALTER TABLE orders MODIFY COLUMN status ENUM(
            'draft',
            'pending_payment',
            'paid',
            'searching_tukang',
            'assigned',
            'in_progress',
            'completed',
            'cancelled',
            'refunded'
        ) NOT NULL DEFAULT 'draft'");
    }
};
