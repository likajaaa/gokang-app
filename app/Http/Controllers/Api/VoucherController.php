<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\VoucherService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class VoucherController extends Controller
{
    use ApiResponse;

    public function __construct(
        private VoucherService $voucherService,
    ) {}

    /**
     * GET /api/v1/vouchers
     *
     * List voucher yang tersedia dan bisa dipakai user yang login.
     */
    public function index(Request $request): JsonResponse
    {
        $vouchers = $this->voucherService->getAvailableForUser($request->user());

        return $this->successResponse(
            $vouchers->map(fn ($v) => $this->formatVoucher($v)),
            'Daftar voucher berhasil diambil'
        );
    }

    /**
     * GET /api/v1/vouchers/wallet
     *
     * List voucher yang sudah di-claim user ke wallet (via redeem code).
     * Format response sesuai mobile Voucher type (field-name spec).
     */
    public function wallet(Request $request): JsonResponse
    {
        $now = now();

        $vouchers = $request->user()->claimedVouchers()
            ->where('vouchers.is_active', true)
            ->where(function ($q) use ($now) {
                $q->whereNull('valid_until')->orWhere('valid_until', '>=', $now);
            })
            ->orderBy('valid_until')
            ->get();

        // Mark used vs available — voucher dianggap "used" kalau user sudah pernah pakai
        // di order (lewat voucher_usages) ATAU usage_limit_per_user terpenuhi.
        $userId = $request->user()->id;
        $usageCounts = \App\Models\VoucherUsage::where('user_id', $userId)
            ->whereIn('voucher_id', $vouchers->pluck('id'))
            ->selectRaw('voucher_id, COUNT(*) as cnt')
            ->groupBy('voucher_id')
            ->pluck('cnt', 'voucher_id');

        $payload = $vouchers->map(function (\App\Models\Voucher $v) use ($usageCounts) {
            $isUsed = ($usageCounts->get($v->id, 0)) >= $v->usage_limit_per_user;
            return $this->formatVoucherForWallet($v, $isUsed);
        });

        return $this->successResponse($payload, 'Wallet voucher berhasil diambil');
    }

    /**
     * POST /api/v1/vouchers/redeem
     *
     * Claim kode promo ke wallet user.
     * Body: { code: string }
     */
    public function redeem(Request $request): JsonResponse
    {
        $request->validate([
            'code' => ['required', 'string', 'max:30'],
        ]);

        $code = strtoupper(trim($request->string('code')->toString()));
        $user = $request->user();

        $voucher = \App\Models\Voucher::where('code', $code)->first();

        if (!$voucher) {
            return $this->errorResponse('Kode promo tidak valid', null, 422);
        }

        if (!$voucher->is_active) {
            return $this->errorResponse('Voucher tidak aktif', null, 422);
        }

        if ($voucher->isNotYetValid()) {
            return $this->errorResponse('Voucher belum berlaku', null, 422);
        }

        if ($voucher->isExpired()) {
            return $this->errorResponse('Voucher sudah kedaluwarsa', null, 422);
        }

        if ($voucher->isQuotaExhausted()) {
            return $this->errorResponse('Kuota voucher sudah habis', null, 422);
        }

        if ($user->claimedVouchers()->where('voucher_id', $voucher->id)->exists()) {
            return $this->errorResponse(
                'Kode promo ini sudah pernah kamu klaim',
                null,
                422,
            );
        }

        $usedCount = \App\Models\VoucherUsage::where('user_id', $user->id)
            ->where('voucher_id', $voucher->id)
            ->count();

        if ($usedCount >= $voucher->usage_limit_per_user) {
            return $this->errorResponse(
                'Kamu sudah pernah memakai voucher ini',
                null,
                422,
            );
        }

        $user->claimedVouchers()->attach($voucher->id, ['claimed_at' => now()]);

        return $this->successResponse(
            $this->formatVoucherForWallet($voucher, false),
            'Kode promo berhasil ditambahkan ke wallet!',
        );
    }

    /**
     * POST /api/v1/vouchers/validate
     *
     * Validasi voucher sebelum apply ke order.
     * Request: { code, service_ids, subtotal }
     */
    public function check(Request $request): JsonResponse
    {
        $request->validate([
            'code'          => ['required', 'string', 'max:30'],
            'service_ids'   => ['required', 'array', 'min:1'],
            'service_ids.*' => ['integer', 'min:1'],
            'subtotal'      => ['required', 'numeric', 'min:0'],
        ]);

        try {
            $result = $this->voucherService->validate(
                $request->input('code'),
                $request->user()->id,
                $request->input('service_ids'),
                (float) $request->input('subtotal')
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), null, 422);
        }

        $voucher = $result['voucher'];

        return $this->successResponse([
            'voucher' => $this->formatVoucher($voucher),
            'discount_amount' => $result['discount_amount'],
            'final_total'     => $result['final_total'],
        ], 'Voucher valid');
    }

    private function formatVoucher(\App\Models\Voucher $v): array
    {
        return [
            'id'                   => $v->id,
            'code'                 => $v->code,
            'title'                => $v->title,
            'description'          => $v->description,
            'type'                 => $v->type,
            'value'                => $v->value,
            'min_transaction'      => $v->min_transaction,
            'max_discount'         => $v->max_discount,
            'applicable_services'  => $v->applicable_services,
            'valid_from'           => $v->valid_from,
            'valid_until'          => $v->valid_until,
        ];
    }

    /**
     * Format voucher untuk konsumsi mobile Promo screen.
     * Map kolom DB ke field-name spec PRD (title→name, type→discount_type, dll).
     */
    private function formatVoucherForWallet(\App\Models\Voucher $v, bool $isUsed): array
    {
        return [
            'id'             => $v->id,
            'code'           => $v->code,
            'name'           => $v->title,
            'description'    => $v->description,
            'discount_type'  => $v->type,
            'discount_value' => (float) $v->value,
            'max_discount'   => $v->max_discount !== null ? (float) $v->max_discount : null,
            'min_order'      => (float) $v->min_transaction,
            'applicable_for' => $v->applicable_services ?? ['all'],
            'expires_at'     => $v->valid_until?->toIso8601String(),
            'is_active'      => (bool) $v->is_active,
            'is_used'        => $isUsed,
        ];
    }
}
