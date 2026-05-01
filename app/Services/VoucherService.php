<?php

namespace App\Services;

use App\Models\Order;
use App\Models\User;
use App\Models\Voucher;
use App\Models\VoucherUsage;
use Illuminate\Support\Collection;

class VoucherService
{
    /**
     * Validasi voucher dan hitung diskon.
     *
     * @param  array<int>  $serviceIds  Service ID yang ada di order
     * @return array{ voucher: Voucher, discount_amount: float, final_total: float }
     *
     * @throws \Exception
     */
    public function validate(
        string $code,
        int $userId,
        array $serviceIds,
        float $subtotal
    ): array {
        $voucher = Voucher::where('code', strtoupper(trim($code)))->first();

        if (!$voucher) {
            throw new \Exception('Voucher tidak ditemukan');
        }

        if (!$voucher->is_active) {
            throw new \Exception('Voucher tidak aktif');
        }

        if ($voucher->isNotYetValid()) {
            throw new \Exception('Voucher belum berlaku');
        }

        if ($voucher->isExpired()) {
            throw new \Exception('Voucher sudah kadaluarsa');
        }

        if ($voucher->isQuotaExhausted()) {
            throw new \Exception('Kuota voucher sudah habis');
        }

        $userUsageCount = VoucherUsage::where('voucher_id', $voucher->id)
            ->where('user_id', $userId)
            ->count();

        if ($userUsageCount >= $voucher->usage_limit_per_user) {
            throw new \Exception('Kamu sudah menggunakan voucher ini sebelumnya');
        }

        if ($subtotal < (float) $voucher->min_transaction) {
            $min = number_format((float) $voucher->min_transaction, 0, ',', '.');
            throw new \Exception("Minimum transaksi untuk voucher ini adalah Rp $min");
        }

        // null = berlaku untuk semua service
        if ($voucher->applicable_services !== null) {
            $overlap = array_intersect($serviceIds, $voucher->applicable_services);
            if (empty($overlap)) {
                throw new \Exception('Voucher ini tidak berlaku untuk layanan yang dipilih');
            }
        }

        $discountAmount = $this->calculateDiscount($voucher, $subtotal);
        $finalTotal = max(0, $subtotal - $discountAmount);

        return [
            'voucher'         => $voucher,
            'discount_amount' => $discountAmount,
            'final_total'     => $finalTotal,
        ];
    }

    /**
     * Catat pemakaian voucher setelah order dibuat (dipanggil dalam DB transaction).
     */
    public function recordUsage(Voucher $voucher, Order $order, User $user): void
    {
        VoucherUsage::create([
            'voucher_id' => $voucher->id,
            'user_id'    => $user->id,
            'order_id'   => $order->id,
            'used_at'    => now(),
        ]);

        $voucher->increment('used_count');
    }

    /**
     * List voucher yang tersedia untuk user tertentu:
     * aktif, belum expired, belum habis quota, dan user belum mencapai limit pemakaian.
     */
    public function getAvailableForUser(User $user): Collection
    {
        $now = now();

        $candidates = Voucher::where('is_active', true)
            ->where(fn ($q) => $q->whereNull('valid_from')->orWhere('valid_from', '<=', $now))
            ->where(fn ($q) => $q->whereNull('valid_until')->orWhere('valid_until', '>=', $now))
            ->where(fn ($q) => $q->whereNull('usage_limit_total')
                ->orWhereRaw('used_count < usage_limit_total'))
            ->orderBy('valid_until')
            ->get();

        // Filter per-user usage — tidak bisa dilakukan pure SQL dengan whereRaw yang portable
        $usedCounts = VoucherUsage::where('user_id', $user->id)
            ->whereIn('voucher_id', $candidates->pluck('id'))
            ->selectRaw('voucher_id, COUNT(*) as cnt')
            ->groupBy('voucher_id')
            ->pluck('cnt', 'voucher_id');

        return $candidates->filter(function (Voucher $v) use ($usedCounts) {
            $used = $usedCounts->get($v->id, 0);
            return $used < $v->usage_limit_per_user;
        })->values();
    }

    /**
     * Hitung nominal diskon berdasarkan type voucher.
     */
    public function calculateDiscount(Voucher $voucher, float $subtotal): float
    {
        if ($voucher->type === 'percentage') {
            $discount = $subtotal * ((float) $voucher->value / 100);
            if ($voucher->max_discount !== null) {
                $discount = min($discount, (float) $voucher->max_discount);
            }
        } else {
            // fixed — diskon tidak boleh melebihi subtotal
            $discount = min((float) $voucher->value, $subtotal);
        }

        return round($discount, 2);
    }
}
