<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Models\OrderStatusLog;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/**
 * Admin endpoints untuk transition status order borongan.
 *
 * Flow yang ditangani:
 *   on_survey → pending_assignment → on_progress → waiting_payment_final → completed
 *   any (pre-execution) → rejected
 *
 * Note: pending_survey → on_survey transition tidak diperlukan endpoint terpisah
 * karena sekarang PaymentService::markAsSuccess langsung set on_survey.
 */
class OrderTransitionController extends Controller
{
    use ApiResponse;

    /**
     * POST /api/v1/admin/orders/{id}/start-survey
     * pending_survey → on_survey
     *
     * Disediakan untuk forward-compat kalau di masa depan flow di-revert
     * ke 2-step (pending_survey → on_survey).
     */
    public function startSurvey(Request $request, int $id): JsonResponse
    {
        return $this->transition($request, $id, 'pending_survey', 'on_survey', 'Survey dimulai');
    }

    /**
     * POST /api/v1/admin/orders/{id}/complete-survey
     * on_survey → pending_assignment
     */
    public function completeSurvey(Request $request, int $id): JsonResponse
    {
        return $this->transition($request, $id, 'on_survey', 'pending_assignment', 'Survey selesai');
    }

    /**
     * POST /api/v1/admin/orders/{id}/assign-tukang
     * pending_assignment → on_progress
     *
     * Body: { tukang_id: int }
     *
     * NOTE: Tabel `orders` tidak punya kolom `tukang_id`. Tukang assignment
     * untuk borongan saat ini hanya di-log di OrderStatusLog.notes (audit trail).
     * Persist real assignment perlu migration baru — tracked sebagai TODO.
     */
    public function assignTukang(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'tukang_id' => ['required', 'integer', 'exists:users,id'],
        ]);

        return $this->transition(
            $request,
            $id,
            'pending_assignment',
            'on_progress',
            'Tukang ditugaskan',
            ['notes' => 'Assigned tukang_id=' . $request->integer('tukang_id')],
        );
    }

    /**
     * POST /api/v1/admin/orders/{id}/mark-work-complete
     * on_progress → waiting_payment_final
     */
    public function markWorkComplete(Request $request, int $id): JsonResponse
    {
        return $this->transition(
            $request,
            $id,
            'on_progress',
            'waiting_payment_final',
            'Pekerjaan selesai, menunggu pelunasan',
        );
    }

    /**
     * POST /api/v1/admin/orders/{id}/complete-final-payment
     * waiting_payment_final → completed
     */
    public function completeFinalPayment(Request $request, int $id): JsonResponse
    {
        return $this->transition(
            $request,
            $id,
            'waiting_payment_final',
            'completed',
            'Pesanan selesai',
            ['extra_updates' => ['completed_at' => now()]],
        );
    }

    /**
     * POST /api/v1/admin/orders/{id}/reject
     * any (pre-execution) → rejected
     *
     * Body: { reason: string }
     */
    public function rejectOrder(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'reason' => ['required', 'string', 'max:500'],
        ]);

        $user = $request->user();
        if (!$user || !$user->isAdmin()) {
            return $this->unauthorizedResponse('Hanya admin yang bisa menolak order');
        }

        $order = Order::find($id);
        if (!$order) {
            return $this->notFoundResponse('Pesanan tidak ditemukan');
        }

        // Reject hanya valid untuk order yang belum mulai dikerjakan.
        $rejectableStatuses = [
            'pending_payment',
            'pending_survey',
            'on_survey',
            'pending_assignment',
            'paid',
            'searching_tukang',
            'assigned',
        ];
        if (!in_array($order->status, $rejectableStatuses, true)) {
            return $this->errorResponse(
                "Order dengan status '{$order->status}' tidak bisa direject",
                null,
                422,
            );
        }

        $oldStatus = $order->status;
        $reason = $request->string('reason')->toString();

        DB::transaction(function () use ($order, $user, $oldStatus, $reason) {
            $order->update([
                'status'        => 'rejected',
                'cancelled_at'  => now(),
                'cancel_reason' => $reason,
                'cancelled_by'  => 'admin',
            ]);

            OrderStatusLog::create([
                'order_id'    => $order->id,
                'from_status' => $oldStatus,
                'to_status'   => 'rejected',
                'changed_by'  => $user->id,
                'notes'       => 'Rejected by admin: ' . $reason,
            ]);
        });

        return $this->successResponse(
            new OrderResource($order->fresh()),
            'Pesanan berhasil ditolak',
        );
    }

    /**
     * Generic transition handler dengan admin auth check, validasi status,
     * DB transaction, dan OrderStatusLog write.
     *
     * @param  array{notes?: string, extra_updates?: array<string, mixed>}  $options
     */
    private function transition(
        Request $request,
        int $id,
        string $expectedStatus,
        string $newStatus,
        string $successMessage,
        array $options = [],
    ): JsonResponse {
        $user = $request->user();
        if (!$user || !$user->isAdmin()) {
            return $this->unauthorizedResponse('Hanya admin yang bisa melakukan aksi ini');
        }

        $order = Order::find($id);
        if (!$order) {
            return $this->notFoundResponse('Pesanan tidak ditemukan');
        }

        if ($order->status !== $expectedStatus) {
            return $this->errorResponse(
                "Order harus berstatus '{$expectedStatus}', saat ini: '{$order->status}'",
                null,
                422,
            );
        }

        $extraUpdates = $options['extra_updates'] ?? [];
        $logNotes = $options['notes'] ?? $successMessage;

        DB::transaction(function () use ($order, $newStatus, $extraUpdates, $expectedStatus, $logNotes, $user) {
            $order->update(array_merge(['status' => $newStatus], $extraUpdates));

            OrderStatusLog::create([
                'order_id'    => $order->id,
                'from_status' => $expectedStatus,
                'to_status'   => $newStatus,
                'changed_by'  => $user->id,
                'notes'       => $logNotes,
            ]);
        });

        return $this->successResponse(
            new OrderResource($order->fresh()),
            $successMessage,
        );
    }
}
