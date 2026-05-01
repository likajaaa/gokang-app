<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Services\PaymentService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    use ApiResponse;

    public function __construct(private PaymentService $paymentService)
    {
    }

    /**
     * GET /api/v1/payments/{orderId}
     *
     * Get payment info untuk order.
     */
    public function show(Request $request, int $orderId): JsonResponse
    {
        $payment = Payment::whereHas('order', function ($q) use ($request, $orderId) {
            $q->where('id', $orderId)
                ->where('customer_id', $request->user()->id);
        })->first();

        if (!$payment) {
            return $this->notFoundResponse('Pembayaran tidak ditemukan');
        }

        return $this->successResponse([
            'id' => $payment->id,
            'order_id' => $payment->order_id,
            'amount' => (float) $payment->amount,
            'status' => $payment->status,
            'payment_method' => $payment->payment_method,
            'expires_at' => $payment->expires_at?->toIso8601String(),
            'expires_in_seconds' => $payment->expires_at
                ? max(0, now()->diffInSeconds($payment->expires_at, false))
                : null,
            'paid_at' => $payment->paid_at?->toIso8601String(),
            'payment_url' => $payment->status === 'pending'
                ? $this->paymentService->getPaymentUrl($payment)
                : null,
        ]);
    }

    /**
     * GET /api/v1/payments/mock-success/{paymentId}
     *
     * MOCK ONLY: trigger payment success manual untuk development.
     * Di production, endpoint ini harus DISABLE atau return 404.
     */
    public function mockSuccess(int $paymentId): JsonResponse
    {
        if (!config('gokang.payment_mock_mode', true)) {
            return $this->notFoundResponse('Endpoint tidak tersedia');
        }

        $payment = Payment::find($paymentId);

        if (!$payment) {
            return $this->notFoundResponse('Payment tidak ditemukan');
        }

        try {
            $this->paymentService->markAsSuccess($payment, [
                'payment_method' => 'mock_va_bca',
                'mode' => 'mock',
            ]);
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), null, 422);
        }

        return $this->successResponse(
            [
                'payment_id' => $payment->id,
                'order_id' => $payment->order_id,
                'status' => 'success',
            ],
            '[MOCK] Pembayaran berhasil diproses'
        );
    }

    /**
     * POST /api/v1/payments/webhook/midtrans
     *
     * Webhook dari Midtrans. Signature SHA512 diverifikasi sebelum diproses.
     * Mock mode melewati verifikasi supaya bisa di-test tanpa kredensial nyata.
     */
    public function midtransWebhook(Request $request): JsonResponse
    {
        $payload = $request->all();

        $midtransOrderId = $payload['order_id'] ?? null;
        if (!$midtransOrderId) {
            return $this->errorResponse('Invalid payload', null, 400);
        }

        // Verifikasi signature kecuali saat mock mode (dev/testing)
        $mockMode = (bool) config('gokang.payment_mock_mode', true);
        if (!$mockMode && !$this->paymentService->verifyMidtransSignature($payload)) {
            return $this->errorResponse('Invalid signature', null, 403);
        }

        $payment = Payment::where('midtrans_order_id', $midtransOrderId)->first();
        if (!$payment) {
            return $this->notFoundResponse('Payment tidak ditemukan');
        }

        $transactionStatus = $payload['transaction_status'] ?? null;
        $fraudStatus = $payload['fraud_status'] ?? null;

        // Mapping status Midtrans → status internal
        if (in_array($transactionStatus, ['capture', 'settlement'])
            && ($fraudStatus === null || $fraudStatus === 'accept')) {
            try {
                $this->paymentService->markAsSuccess($payment, $payload);
            } catch (\Exception $e) {
                return $this->errorResponse($e->getMessage(), null, 422);
            }
        } elseif (in_array($transactionStatus, ['deny', 'cancel', 'failure'])) {
            $this->paymentService->markAsFailed($payment, $transactionStatus);
        } elseif ($transactionStatus === 'expire') {
            $this->paymentService->markAsExpired($payment);
        }

        return $this->successResponse(null, 'Webhook processed');
    }
}
