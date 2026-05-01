<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Payment;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class PaymentService
{
    /**
     * Buat payment record saat order dibuat.
     * Timer: 60 menit dari created (sesuai UI GoKang "Sisa waktu pemesanan 0:59:55")
     */
    public function createPayment(Order $order): Payment
    {
        $mockMode = (bool) config('gokang.payment_mock_mode', true);
        $timerMinutes = (int) config('gokang.payment_timer_minutes', 60);

        return Payment::create([
            'order_id'          => $order->id,
            'midtrans_order_id' => 'KNG-' . $order->order_code . '-' . Str::random(6),
            'amount'            => $order->total,
            'status'            => 'pending',
            'expires_at'        => now()->addMinutes($timerMinutes),
            'raw_response'      => $mockMode ? ['mode' => 'mock'] : null,
        ]);
    }

    /**
     * Get payment URL untuk user bayar.
     *
     * Mock mode  → URL lokal yang auto-trigger success.
     * Real mode  → Midtrans Snap redirect URL (di-cache di raw_response setelah generate pertama).
     */
    public function getPaymentUrl(Payment $payment): string
    {
        $mockMode = (bool) config('gokang.payment_mock_mode', true);

        if ($mockMode) {
            return config('app.url') . '/api/v1/payments/mock-success/' . $payment->id;
        }

        // Return cached URL supaya tidak memanggil Snap API berulang kali
        if (!empty($payment->raw_response['snap_redirect_url'])) {
            return $payment->raw_response['snap_redirect_url'];
        }

        $payment->load(['order.items.service', 'order.customer']);
        $order = $payment->order;

        $this->configureMidtrans();

        $itemDetails = $order->items->map(fn ($item) => [
            'id'       => 'item-' . $item->id,
            'price'    => (int) $item->subtotal,
            'quantity' => 1,
            // Midtrans item name max 50 chars
            'name'     => mb_substr($item->service->name . ' (' . $item->total_days . ' hari)', 0, 50),
        ])->toArray();

        if ((float) $order->discount_amount > 0) {
            $itemDetails[] = [
                'id'       => 'discount',
                'price'    => -(int) $order->discount_amount,
                'quantity' => 1,
                'name'     => 'Diskon Voucher',
            ];
        }

        if ((float) $order->extra_fee_parking > 0) {
            $itemDetails[] = [
                'id'       => 'parking',
                'price'    => (int) $order->extra_fee_parking,
                'quantity' => 1,
                'name'     => 'Biaya Parkir',
            ];
        }

        // Midtrans requires sum(item prices) == gross_amount; add adjustment if rounding drift
        $grossAmount = (int) $payment->amount;
        $itemTotal = (int) collect($itemDetails)->sum(fn ($i) => $i['price'] * $i['quantity']);

        if ($itemTotal !== $grossAmount) {
            $itemDetails[] = [
                'id'       => 'adjustment',
                'price'    => $grossAmount - $itemTotal,
                'quantity' => 1,
                'name'     => 'Penyesuaian',
            ];
        }

        $params = [
            'transaction_details' => [
                'order_id'     => $payment->midtrans_order_id,
                'gross_amount' => $grossAmount,
            ],
            'customer_details' => [
                'first_name' => $order->customer->name,
                'phone'      => $order->customer->phone,
            ],
            'item_details' => $itemDetails,
        ];

        try {
            $snap = \Midtrans\Snap::createTransaction($params);

            // Cache agar GET berikutnya tidak perlu memanggil Snap API lagi
            $payment->update([
                'raw_response' => array_merge($payment->raw_response ?? [], [
                    'snap_token'        => $snap->token,
                    'snap_redirect_url' => $snap->redirect_url,
                ]),
            ]);

            return $snap->redirect_url;
        } catch (\Exception $e) {
            Log::error('[Midtrans] Snap createTransaction error', [
                'payment_id' => $payment->id,
                'order_id'   => $order->id,
                'error'      => $e->getMessage(),
            ]);

            throw new \Exception('Gagal membuat link pembayaran: ' . $e->getMessage());
        }
    }

    /**
     * Verifikasi signature Midtrans webhook.
     * Formula: SHA512(order_id + status_code + gross_amount + ServerKey)
     *
     * @see https://docs.midtrans.com/docs/verifying-data-integrity
     */
    public function verifyMidtransSignature(array $payload): bool
    {
        $serverKey       = config('services.midtrans.server_key', '');
        $orderId         = $payload['order_id'] ?? '';
        $statusCode      = $payload['status_code'] ?? '';
        $grossAmount     = $payload['gross_amount'] ?? '';
        $receivedSig     = $payload['signature_key'] ?? '';

        $expectedSig = hash('sha512', $orderId . $statusCode . $grossAmount . $serverKey);

        // hash_equals mencegah timing attack
        return hash_equals($expectedSig, $receivedSig);
    }

    /**
     * Mark payment as success.
     * Trigger order flow (assign tukang).
     */
    public function markAsSuccess(Payment $payment, ?array $data = null): void
    {
        // Guard: jangan proses yang sudah success
        if ($payment->status === 'success') {
            return;
        }

        // Cek expired
        if ($payment->expires_at && $payment->expires_at->isPast()) {
            $this->markAsFailed($payment, 'Payment expired');
            throw new \Exception('Pembayaran sudah kadaluarsa');
        }

        $payment->update([
            'status'         => 'success',
            'paid_at'        => now(),
            'payment_method' => $data['payment_type'] ?? $data['payment_method'] ?? 'mock',
            'raw_response'   => $data ?? ['mode' => 'mock', 'paid_at' => now()->toIso8601String()],
        ]);

        $order = $payment->order;
        $isBorongan = in_array($order->order_type, ['borongan_home', 'borongan_business'], true);

        if ($isBorongan) {
            // Borongan flow: setelah DP dibayar langsung 'on_survey' (Tab Aktif).
            // pending_survey enum tetap ada untuk forward-compat tapi tidak di-trigger di flow ini.
            $order->update(['status' => 'on_survey']);

            \App\Models\OrderStatusLog::create([
                'order_id'    => $order->id,
                'from_status' => 'pending_payment',
                'to_status'   => 'on_survey',
                'changed_by'  => null,
                'notes'       => 'DP dibayar, konsultan akan datang untuk survey',
            ]);
        } else {
            // Daily tukang flow (existing): pending_payment → paid → searching_tukang.
            $order->update(['status' => 'paid']);
            app(OrderService::class)->onPaymentSuccess($order);
        }
    }

    /**
     * Mark payment as failed.
     */
    public function markAsFailed(Payment $payment, string $reason = 'Payment failed'): void
    {
        $payment->update([
            'status'       => 'failed',
            'raw_response' => ['reason' => $reason],
        ]);
    }

    /**
     * Mark payment as expired (scheduled job akan call ini).
     */
    public function markAsExpired(Payment $payment): void
    {
        if (!in_array($payment->status, ['pending'])) {
            return;
        }

        $payment->update([
            'status'       => 'expired',
            'raw_response' => ['expired_at' => now()->toIso8601String()],
        ]);

        // Cancel order juga
        $payment->order->update([
            'status'       => 'cancelled',
            'cancelled_at' => now(),
            'cancel_reason' => 'Pembayaran kadaluarsa',
            'cancelled_by'  => 'system',
        ]);
    }

    /**
     * Set Midtrans static config sebelum setiap API call.
     */
    private function configureMidtrans(): void
    {
        \Midtrans\Config::$serverKey    = config('services.midtrans.server_key');
        \Midtrans\Config::$isProduction = (bool) config('services.midtrans.is_production', false);
        \Midtrans\Config::$isSanitized  = true;
        \Midtrans\Config::$is3ds        = true;
    }
}
