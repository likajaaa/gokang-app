<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Order\CancelOrderRequest;
use App\Http\Requests\Order\CreateDailyOrderRequest;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Services\OrderService;
use App\Services\PaymentService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    use ApiResponse;

    public function __construct(
        private OrderService $orderService,
        private PaymentService $paymentService,
    ) {
    }

    private const TAB_STATUS_MAP = [
        // Rencana = order belum mulai dikerjakan (pre-execution).
        'rencana' => [
            'pending_payment',
            'pending_survey',
            'pending_assignment',
            'paid',
            'searching_tukang',
            'assigned',
        ],
        // Aktif = order sedang berjalan (survey/work/menunggu pelunasan).
        'aktif' => [
            'on_survey',
            'on_progress',
            'in_progress',
            'waiting_payment_final',
        ],
        // Arsip = order final state.
        'arsip' => [
            'completed',
            'cancelled',
            'refunded',
            'rejected',
        ],
    ];

    /**
     * GET /api/v1/orders
     *
     * List order customer. Support two filtering modes:
     *   ?tab=rencana|aktif|arsip   (mobile Pesanan page)
     *   ?status=active|completed|cancelled  (legacy)
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $baseQuery = fn () => Order::query()
            ->when($user->isCustomer(), fn ($q) => $q->where('customer_id', $user->id))
            ->when($user->isTukang(), function ($q) use ($user) {
                $q->whereHas('assignments', function ($sub) use ($user) {
                    $sub->where('tukang_id', $user->id)
                        ->whereIn('status', ['accepted', 'offered']);
                });
            });

        $query = $baseQuery()
            ->with(['items.service', 'service', 'address', 'payment'])
            ->orderByDesc('created_at');

        $tab = $request->get('tab');
        if ($tab && isset(self::TAB_STATUS_MAP[$tab])) {
            $query->whereIn('status', self::TAB_STATUS_MAP[$tab]);
        } else {
            // Legacy status filter
            $statusFilter = $request->get('status');
            if ($statusFilter === 'active') {
                $query->active();
            } elseif ($statusFilter === 'completed') {
                $query->completed();
            } elseif ($statusFilter === 'cancelled') {
                $query->cancelled();
            }
        }

        $perPage = min((int) $request->get('per_page', 20), 50);
        $orders = $query->paginate($perPage);

        // Tab counts only when tab mode is used (customer view)
        $tabCounts = null;
        if ($tab && $user->isCustomer()) {
            $tabCounts = [];
            foreach (self::TAB_STATUS_MAP as $key => $statuses) {
                $tabCounts[$key] = $baseQuery()->whereIn('status', $statuses)->count();
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Data pesanan berhasil diambil',
            'data' => OrderResource::collection($orders),
            'meta' => array_filter([
                'current_page' => $orders->currentPage(),
                'last_page' => $orders->lastPage(),
                'per_page' => $orders->perPage(),
                'total' => $orders->total(),
                'tab_counts' => $tabCounts,
            ], fn ($v) => $v !== null),
        ]);
    }

    /**
     * POST /api/v1/orders/daily-tukang
     *
     * Buat order Tukang Harian dengan multi-item.
     */
    public function createDailyTukang(CreateDailyOrderRequest $request): JsonResponse
    {
        try {
            $order = $this->orderService->createDailyTukangOrder(
                $request->user(),
                $request->validated()
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), null, 422);
        }

        $order->load(['items.service', 'address', 'payment']);

        // Payment URL untuk frontend redirect
        $paymentUrl = $order->payment
            ? $this->paymentService->getPaymentUrl($order->payment)
            : null;

        return $this->successResponse(
            [
                'order' => new OrderResource($order),
                'payment_url' => $paymentUrl,
            ],
            'Pesanan berhasil dibuat. Silakan lakukan pembayaran.',
            201
        );
    }

    /**
     * GET /api/v1/orders/{id}
     */
    public function show(Request $request, int $id): JsonResponse
    {
        $user = $request->user();

        $order = Order::with([
            'items.service',
            'address',
            'payment',
            'customer',
            'statusLogs',
            'assignments.tukang',
        ])->find($id);

        if (!$order) {
            return $this->notFoundResponse('Pesanan tidak ditemukan');
        }

        // Authorization: hanya customer pemilik atau tukang yang di-assign yang bisa lihat
        $isOwner = $user->isCustomer() && $order->customer_id === $user->id;
        $isAssigned = $user->isTukang() && $order->assignments()
            ->where('tukang_id', $user->id)
            ->exists();
        $isAdmin = $user->isAdmin();

        if (!$isOwner && !$isAssigned && !$isAdmin) {
            return $this->unauthorizedResponse('Kamu tidak memiliki akses ke pesanan ini');
        }

        return $this->successResponse(
            new OrderResource($order),
            'Detail pesanan berhasil diambil'
        );
    }

    /**
     * POST /api/v1/orders/{id}/cancel
     */
    public function cancel(CancelOrderRequest $request, int $id): JsonResponse
    {
        $user = $request->user();

        $order = Order::find($id);

        if (!$order) {
            return $this->notFoundResponse('Pesanan tidak ditemukan');
        }

        // Authorization
        $isOwner = $user->isCustomer() && $order->customer_id === $user->id;
        if (!$isOwner && !$user->isAdmin()) {
            return $this->unauthorizedResponse('Kamu tidak bisa membatalkan pesanan ini');
        }

        try {
            $this->orderService->cancelOrder($order, $user, $request->validated('reason'));
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), null, 422);
        }

        return $this->successResponse(
            new OrderResource($order->fresh(['items.service', 'address', 'payment'])),
            'Pesanan berhasil dibatalkan'
        );
    }

    /**
     * POST /api/v1/orders/{id}/simulate-payment
     *
     * Dev-only endpoint untuk mock payment success dari mobile.
     * Internally panggil PaymentService::markAsSuccess yang routes status per order_type
     * (borongan → on_survey, daily_tukang → paid + auto-assign).
     *
     * Hanya aktif kalau config('gokang.payment_mock_mode') = true.
     * Authorization: customer pemilik order saja.
     */
    public function simulatePayment(Request $request, int $id): JsonResponse
    {
        if (!config('gokang.payment_mock_mode', true)) {
            return $this->errorResponse(
                'Mock payment dinonaktifkan. Gunakan flow Midtrans real.',
                null,
                403,
            );
        }

        $user = $request->user();
        $order = Order::with('payment')->find($id);

        if (!$order) {
            return $this->notFoundResponse('Pesanan tidak ditemukan');
        }

        $isOwner = $user->isCustomer() && $order->customer_id === $user->id;
        if (!$isOwner) {
            return $this->unauthorizedResponse('Kamu bukan pemilik pesanan ini');
        }

        if (!$order->payment) {
            return $this->errorResponse('Pesanan tidak punya record pembayaran', null, 422);
        }

        if ($order->payment->status === 'success') {
            return $this->errorResponse('Pembayaran sudah berhasil sebelumnya', null, 422);
        }

        try {
            $this->paymentService->markAsSuccess($order->payment);
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), null, 422);
        }

        $fresh = $order->fresh(['items.service', 'address', 'payment']);

        return $this->successResponse(
            new OrderResource($fresh),
            'Mock payment berhasil — status order updated'
        );
    }
}
