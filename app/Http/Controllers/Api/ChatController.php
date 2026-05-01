<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ChatMessage;
use App\Models\Order;
use App\Models\OrderAssignment;
use App\Models\User;
use App\Services\NotificationService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    use ApiResponse;

    public function __construct(
        private NotificationService $notificationService,
    ) {}

    /**
     * GET /api/v1/chats
     *
     * List semua percakapan (unique order) yang melibatkan user yang login.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $customerOrderIds = Order::where('customer_id', $user->id)->pluck('id');

        $tukangOrderIds = OrderAssignment::where('tukang_id', $user->id)
            ->where('status', 'accepted')
            ->pluck('order_id');

        $orderIds = $customerOrderIds->merge($tukangOrderIds)->unique();

        $orders = Order::with([
            'customer:id,name,avatar',
            'assignments' => fn ($q) => $q->where('status', 'accepted')->with('tukang:id,name,avatar'),
        ])
            ->whereIn('id', $orderIds)
            ->whereHas('chatMessages')
            ->get();

        $chats = $orders->map(function (Order $order) use ($user) {
            $lastMessage = $order->chatMessages()->latest()->first();
            $unreadCount = $order->chatMessages()
                ->where('sender_id', '!=', $user->id)
                ->where('is_read', false)
                ->count();

            $interlocutor = $this->resolveInterlocutor($order, $user);

            return [
                'order_id'     => $order->id,
                'order_code'   => $order->order_code,
                'order_status' => $order->status,
                'interlocutor' => $interlocutor ? [
                    'id'     => $interlocutor->id,
                    'name'   => $interlocutor->name,
                    'avatar' => $interlocutor->avatar,
                ] : null,
                'last_message' => $lastMessage ? [
                    'message'    => $lastMessage->message,
                    'is_mine'    => $lastMessage->sender_id === $user->id,
                    'created_at' => $lastMessage->created_at,
                ] : null,
                'unread_count' => $unreadCount,
            ];
        })
            ->sortByDesc(fn ($c) => $c['last_message']['created_at'] ?? null)
            ->values();

        return $this->successResponse($chats, 'Daftar chat berhasil diambil');
    }

    /**
     * GET /api/v1/chats/{orderId}/messages
     *
     * List pesan dalam order (paginasi ASC), auto mark as read pesan dari lawan bicara.
     */
    public function messages(Request $request, int $orderId): JsonResponse
    {
        $user = $request->user();

        $order = Order::find($orderId);

        if (!$order) {
            return $this->notFoundResponse('Pesanan tidak ditemukan');
        }

        if (!$this->userIsInvolvedInOrder($user, $order)) {
            return $this->unauthorizedResponse('Kamu tidak terlibat dalam pesanan ini');
        }

        ChatMessage::where('order_id', $orderId)
            ->where('sender_id', '!=', $user->id)
            ->where('is_read', false)
            ->update(['is_read' => true, 'read_at' => now()]);

        $messages = ChatMessage::with('sender:id,name,avatar')
            ->where('order_id', $orderId)
            ->orderBy('created_at')
            ->paginate(50);

        return response()->json([
            'success' => true,
            'message' => 'Pesan berhasil diambil',
            'data'    => $messages->map(fn ($m) => $this->formatMessage($m, $user)),
            'meta'    => [
                'current_page' => $messages->currentPage(),
                'last_page'    => $messages->lastPage(),
                'per_page'     => $messages->perPage(),
                'total'        => $messages->total(),
            ],
        ]);
    }

    /**
     * POST /api/v1/chats/{orderId}/messages
     *
     * Kirim pesan ke order, lalu notifikasi lawan bicara.
     */
    public function send(Request $request, int $orderId): JsonResponse
    {
        $user = $request->user();

        $request->validate([
            'message' => ['required', 'string', 'max:1000'],
        ]);

        $order = Order::with([
            'customer:id,name,avatar',
            'assignments' => fn ($q) => $q->where('status', 'accepted')->with('tukang:id,name,avatar'),
        ])->find($orderId);

        if (!$order) {
            return $this->notFoundResponse('Pesanan tidak ditemukan');
        }

        if (!$this->userIsInvolvedInOrder($user, $order)) {
            return $this->unauthorizedResponse('Kamu tidak terlibat dalam pesanan ini');
        }

        if (!$this->orderIsChattable($order)) {
            return $this->errorResponse(
                'Chat tidak tersedia untuk pesanan yang sudah selesai lebih dari 24 jam atau dibatalkan',
                null,
                422
            );
        }

        $message = ChatMessage::create([
            'order_id'  => $orderId,
            'sender_id' => $user->id,
            'message'   => $request->input('message'),
            'is_read'   => false,
        ]);

        $message->load('sender:id,name,avatar');

        $recipient = $this->resolveInterlocutor($order, $user);
        if ($recipient) {
            $this->notificationService->notifyNewMessage($recipient, $order, $user);
        }

        return $this->successResponse(
            $this->formatMessage($message, $user),
            'Pesan berhasil dikirim',
            201
        );
    }

    /**
     * POST /api/v1/chats/{orderId}/mark-read
     *
     * Mark semua pesan dari lawan bicara sebagai sudah dibaca.
     */
    public function markRead(Request $request, int $orderId): JsonResponse
    {
        $user = $request->user();

        $order = Order::find($orderId);

        if (!$order) {
            return $this->notFoundResponse('Pesanan tidak ditemukan');
        }

        if (!$this->userIsInvolvedInOrder($user, $order)) {
            return $this->unauthorizedResponse('Kamu tidak terlibat dalam pesanan ini');
        }

        $markedCount = ChatMessage::where('order_id', $orderId)
            ->where('sender_id', '!=', $user->id)
            ->where('is_read', false)
            ->update(['is_read' => true, 'read_at' => now()]);

        return $this->successResponse(
            ['marked_read' => $markedCount],
            'Pesan ditandai sudah dibaca'
        );
    }

    /**
     * Cek apakah user adalah customer atau tukang yang di-assign pada order ini.
     */
    private function userIsInvolvedInOrder(User $user, Order $order): bool
    {
        if ($order->customer_id === $user->id) {
            return true;
        }

        return OrderAssignment::where('order_id', $order->id)
            ->where('tukang_id', $user->id)
            ->where('status', 'accepted')
            ->exists();
    }

    /**
     * Order bisa di-chat kalau aktif, atau completed dalam 24 jam terakhir.
     */
    private function orderIsChattable(Order $order): bool
    {
        if (in_array($order->status, ['cancelled', 'refunded'])) {
            return false;
        }

        if ($order->status === 'completed') {
            return $order->completed_at && $order->completed_at->gt(now()->subHours(24));
        }

        return true;
    }

    /**
     * Resolve lawan bicara dari perspektif $user.
     * Customer → tukang pertama yang accept.
     * Tukang → customer.
     */
    private function resolveInterlocutor(Order $order, User $user): ?User
    {
        if ($order->customer_id === $user->id) {
            return $order->assignments->first()?->tukang;
        }

        return $order->customer;
    }

    private function formatMessage(ChatMessage $message, User $currentUser): array
    {
        return [
            'id'         => $message->id,
            'message'    => $message->message,
            'is_mine'    => $message->sender_id === $currentUser->id,
            'sender'     => [
                'id'     => $message->sender->id,
                'name'   => $message->sender->name,
                'avatar' => $message->sender->avatar,
            ],
            'is_read'    => $message->is_read,
            'created_at' => $message->created_at,
        ];
    }
}
