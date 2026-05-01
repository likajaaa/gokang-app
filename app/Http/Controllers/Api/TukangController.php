<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderAssignment;
use App\Models\OrderPhoto;
use App\Models\OrderStatusLog;
use App\Services\OrderService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class TukangController extends Controller
{
    use ApiResponse;

    public function __construct(
        private OrderService $orderService,
    ) {}

    /**
     * GET /api/v1/tukang/orders/available
     *
     * List assignment yang status 'offered' untuk tukang yang login.
     */
    public function availableOrders(Request $request): JsonResponse
    {
        $user = $request->user();

        if (!$user->isTukang()) {
            return $this->unauthorizedResponse('Hanya tukang yang bisa akses endpoint ini');
        }

        $assignments = OrderAssignment::with([
            'order.address',
            'order.customer',
            'orderItem.service',
        ])
            ->where('tukang_id', $user->id)
            ->where('status', 'offered')
            ->orderByDesc('offered_at')
            ->get();

        return $this->successResponse(
            $assignments->map(fn ($a) => $this->formatAssignment($a)),
            'Daftar order tersedia berhasil diambil'
        );
    }

    /**
     * POST /api/v1/tukang/orders/{assignmentId}/accept
     */
    public function acceptAssignment(Request $request, int $assignmentId): JsonResponse
    {
        $user = $request->user();

        if (!$user->isTukang()) {
            return $this->unauthorizedResponse('Hanya tukang yang bisa akses endpoint ini');
        }

        $assignment = OrderAssignment::find($assignmentId);

        if (!$assignment) {
            return $this->notFoundResponse('Assignment tidak ditemukan');
        }

        // Validasi ownership sebelum memanggil service (service juga akan cek, ini early exit)
        if ($assignment->tukang_id !== $user->id) {
            return $this->unauthorizedResponse('Order ini tidak di-offer ke kamu');
        }

        try {
            $this->orderService->acceptAssignment($assignment, $user);
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), null, 422);
        }

        return $this->successResponse(
            $this->formatAssignment($assignment->fresh(['order.address', 'orderItem.service'])),
            'Order berhasil diterima'
        );
    }

    /**
     * POST /api/v1/tukang/orders/{assignmentId}/reject
     */
    public function rejectAssignment(Request $request, int $assignmentId): JsonResponse
    {
        $user = $request->user();

        if (!$user->isTukang()) {
            return $this->unauthorizedResponse('Hanya tukang yang bisa akses endpoint ini');
        }

        $assignment = OrderAssignment::find($assignmentId);

        if (!$assignment) {
            return $this->notFoundResponse('Assignment tidak ditemukan');
        }

        if ($assignment->tukang_id !== $user->id) {
            return $this->unauthorizedResponse('Order ini tidak di-offer ke kamu');
        }

        try {
            $this->orderService->rejectAssignment($assignment, $user);
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), null, 422);
        }

        return $this->successResponse(null, 'Order berhasil ditolak');
    }

    /**
     * POST /api/v1/tukang/orders/{orderId}/on-the-way
     *
     * Log status OTW ke OrderStatusLog (tidak ubah order.status karena
     * 'on_the_way' bukan nilai enum di tabel orders).
     */
    public function onTheWay(Request $request, int $orderId): JsonResponse
    {
        $user = $request->user();

        if (!$user->isTukang()) {
            return $this->unauthorizedResponse('Hanya tukang yang bisa akses endpoint ini');
        }

        $order = Order::find($orderId);

        if (!$order) {
            return $this->notFoundResponse('Pesanan tidak ditemukan');
        }

        if ($order->status !== 'assigned') {
            return $this->errorResponse(
                'Pesanan harus dalam status assigned terlebih dahulu',
                null,
                422
            );
        }

        if (!$this->tukangIsAssignedTo($user->id, $orderId)) {
            return $this->unauthorizedResponse('Kamu tidak di-assign ke pesanan ini');
        }

        $tukang = $user->tukang;
        if (!$tukang || !$tukang->current_lat || !$tukang->current_lng) {
            return $this->errorResponse(
                'Aktifkan lokasi GPS kamu terlebih dahulu sebelum berangkat',
                null,
                422
            );
        }

        OrderStatusLog::create([
            'order_id' => $order->id,
            'from_status' => 'assigned',
            'to_status' => 'on_the_way',
            'changed_by' => $user->id,
            'notes' => 'Tukang Jagoan sedang dalam perjalanan',
        ]);

        return $this->successResponse(null, 'Status berhasil diperbarui: kamu sedang dalam perjalanan');
    }

    /**
     * POST /api/v1/tukang/orders/{orderId}/arrived
     */
    public function arrived(Request $request, int $orderId): JsonResponse
    {
        $user = $request->user();

        if (!$user->isTukang()) {
            return $this->unauthorizedResponse('Hanya tukang yang bisa akses endpoint ini');
        }

        $order = Order::find($orderId);

        if (!$order) {
            return $this->notFoundResponse('Pesanan tidak ditemukan');
        }

        if ($order->status !== 'assigned') {
            return $this->errorResponse(
                'Pesanan harus dalam status assigned terlebih dahulu',
                null,
                422
            );
        }

        if (!$this->tukangIsAssignedTo($user->id, $orderId)) {
            return $this->unauthorizedResponse('Kamu tidak di-assign ke pesanan ini');
        }

        OrderStatusLog::create([
            'order_id' => $order->id,
            'from_status' => 'assigned',
            'to_status' => 'arrived',
            'changed_by' => $user->id,
            'notes' => 'Tukang Jagoan sudah tiba di lokasi',
        ]);

        return $this->successResponse(null, 'Status berhasil diperbarui: kamu sudah tiba di lokasi');
    }

    /**
     * POST /api/v1/tukang/orders/{orderId}/start-working
     *
     * Ubah order.status ke 'in_progress'.
     */
    public function startWorking(Request $request, int $orderId): JsonResponse
    {
        $user = $request->user();

        if (!$user->isTukang()) {
            return $this->unauthorizedResponse('Hanya tukang yang bisa akses endpoint ini');
        }

        $order = Order::find($orderId);

        if (!$order) {
            return $this->notFoundResponse('Pesanan tidak ditemukan');
        }

        if ($order->status !== 'assigned') {
            return $this->errorResponse(
                'Pesanan harus dalam status assigned terlebih dahulu',
                null,
                422
            );
        }

        if (!$this->tukangIsAssignedTo($user->id, $orderId)) {
            return $this->unauthorizedResponse('Kamu tidak di-assign ke pesanan ini');
        }

        DB::transaction(function () use ($order, $user) {
            $order->update([
                'status' => 'in_progress',
                'started_at' => now(),
            ]);

            OrderStatusLog::create([
                'order_id' => $order->id,
                'from_status' => 'assigned',
                'to_status' => 'in_progress',
                'changed_by' => $user->id,
                'notes' => 'Pekerjaan dimulai',
            ]);
        });

        return $this->successResponse(null, 'Pekerjaan berhasil dimulai');
    }

    /**
     * POST /api/v1/tukang/orders/{orderId}/complete
     *
     * Upload foto hasil (minimal 2), ubah status ke 'completed'.
     */
    public function complete(Request $request, int $orderId): JsonResponse
    {
        $user = $request->user();

        if (!$user->isTukang()) {
            return $this->unauthorizedResponse('Hanya tukang yang bisa akses endpoint ini');
        }

        $request->validate([
            'photos'   => ['required', 'array', 'min:2'],
            'photos.*' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'notes'    => ['nullable', 'string', 'max:1000'],
        ]);

        $order = Order::find($orderId);

        if (!$order) {
            return $this->notFoundResponse('Pesanan tidak ditemukan');
        }

        if ($order->status !== 'in_progress') {
            return $this->errorResponse(
                'Pesanan harus dalam status in_progress terlebih dahulu',
                null,
                422
            );
        }

        if (!$this->tukangIsAssignedTo($user->id, $orderId)) {
            return $this->unauthorizedResponse('Kamu tidak di-assign ke pesanan ini');
        }

        DB::transaction(function () use ($request, $order, $user) {
            foreach ($request->file('photos') as $photo) {
                $path = $photo->store('order-photos/' . $order->id, 'public');

                OrderPhoto::create([
                    'order_id' => $order->id,
                    'type' => 'after',
                    'photo_url' => Storage::url($path),
                    'uploaded_by' => $user->id,
                ]);
            }

            $order->update([
                'status' => 'completed',
                'completed_at' => now(),
            ]);

            OrderStatusLog::create([
                'order_id' => $order->id,
                'from_status' => 'in_progress',
                'to_status' => 'completed',
                'changed_by' => $user->id,
                'notes' => $request->input('notes', 'Pekerjaan selesai'),
            ]);
        });

        return $this->successResponse(null, 'Pekerjaan berhasil diselesaikan. Terima kasih!');
    }

    /**
     * PUT /api/v1/tukang/online-status
     *
     * Toggle online/offline dan update koordinat GPS.
     */
    public function updateOnlineStatus(Request $request): JsonResponse
    {
        $user = $request->user();

        if (!$user->isTukang()) {
            return $this->unauthorizedResponse('Hanya tukang yang bisa akses endpoint ini');
        }

        $request->validate([
            'is_online' => ['required', 'boolean'],
            'lat'       => ['required_if:is_online,true', 'nullable', 'numeric', 'between:-90,90'],
            'lng'       => ['required_if:is_online,true', 'nullable', 'numeric', 'between:-180,180'],
        ]);

        $tukang = $user->tukang;

        if (!$tukang) {
            return $this->notFoundResponse('Profil tukang tidak ditemukan');
        }

        $isOnline = $request->boolean('is_online');
        $updateData = ['is_online' => $isOnline];

        if ($isOnline) {
            $updateData['current_lat'] = $request->input('lat');
            $updateData['current_lng'] = $request->input('lng');
            $updateData['last_location_update'] = now();
        }

        $tukang->update($updateData);

        $statusLabel = $isOnline ? 'online' : 'offline';

        return $this->successResponse(
            ['is_online' => $tukang->is_online],
            "Status kamu sekarang $statusLabel"
        );
    }

    /**
     * Cek apakah tukang punya assignment 'accepted' untuk order ini.
     */
    private function tukangIsAssignedTo(int $tukangUserId, int $orderId): bool
    {
        return OrderAssignment::where('order_id', $orderId)
            ->where('tukang_id', $tukangUserId)
            ->where('status', 'accepted')
            ->exists();
    }

    /**
     * Format assignment untuk response agar konsisten.
     */
    private function formatAssignment(OrderAssignment $assignment): array
    {
        $order = $assignment->order;
        $item = $assignment->orderItem;

        return [
            'assignment_id' => $assignment->id,
            'status'        => $assignment->status,
            'offered_at'    => $assignment->offered_at,
            'order' => [
                'id'                  => $order->id,
                'order_code'          => $order->order_code,
                'order_type'          => $order->order_type,
                'problem_description' => $order->problem_description,
                'address' => $order->address ? [
                    'full_address' => $order->address->full_address,
                    'detail'       => $order->address->detail,
                    'lat'          => $order->address->lat,
                    'lng'          => $order->address->lng,
                ] : null,
                'customer' => $order->customer ? [
                    'name' => $order->customer->name,
                ] : null,
            ],
            'item' => $item ? [
                'service' => [
                    'name' => $item->service->name ?? null,
                    'code' => $item->service->code ?? null,
                ],
                'session'           => $item->session,
                'start_date'        => $item->start_date,
                'end_date'          => $item->end_date,
                'quantity'          => $item->quantity,
                'price_per_session' => $item->price_per_session,
                'subtotal'          => $item->subtotal,
            ] : null,
        ];
    }
}
