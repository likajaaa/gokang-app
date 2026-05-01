<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    use ApiResponse;

    /**
     * GET /api/v1/notifications
     *
     * List notifikasi user, paginate 20, unread_count di meta.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $notifications = Notification::where('user_id', $user->id)
            ->orderByDesc('created_at')
            ->paginate(20);

        $unreadCount = Notification::where('user_id', $user->id)
            ->unread()
            ->count();

        return response()->json([
            'success' => true,
            'message' => 'Notifikasi berhasil diambil',
            'data'    => $notifications->map(fn ($n) => $this->formatNotification($n)),
            'meta'    => [
                'current_page' => $notifications->currentPage(),
                'last_page'    => $notifications->lastPage(),
                'per_page'     => $notifications->perPage(),
                'total'        => $notifications->total(),
                'unread_count' => $unreadCount,
            ],
        ]);
    }

    /**
     * POST /api/v1/notifications/{id}/read
     *
     * Mark satu notifikasi sebagai sudah dibaca.
     */
    public function markRead(Request $request, int $id): JsonResponse
    {
        $notification = Notification::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->first();

        if (!$notification) {
            return $this->notFoundResponse('Notifikasi tidak ditemukan');
        }

        if (!$notification->is_read) {
            $notification->update(['is_read' => true, 'read_at' => now()]);
        }

        return $this->successResponse(
            $this->formatNotification($notification),
            'Notifikasi ditandai sudah dibaca'
        );
    }

    /**
     * POST /api/v1/notifications/mark-all-read
     *
     * Mark semua notifikasi user sebagai sudah dibaca.
     */
    public function markAllRead(Request $request): JsonResponse
    {
        $markedCount = Notification::where('user_id', $request->user()->id)
            ->where('is_read', false)
            ->update(['is_read' => true, 'read_at' => now()]);

        return $this->successResponse(
            ['marked_read' => $markedCount],
            'Semua notifikasi ditandai sudah dibaca'
        );
    }

    /**
     * POST /api/v1/notifications/fcm-token
     *
     * Simpan FCM token device ke profil user.
     */
    public function updateFcmToken(Request $request): JsonResponse
    {
        $request->validate([
            'token' => ['required', 'string', 'max:255'],
        ]);

        $request->user()->update(['fcm_token' => $request->input('token')]);

        return $this->successResponse(null, 'FCM token berhasil diperbarui');
    }

    private function formatNotification(Notification $notification): array
    {
        return [
            'id'         => $notification->id,
            'type'       => $notification->type,
            'title'      => $notification->title,
            'message'    => $notification->message,
            'data'       => $notification->data ?? [],
            'is_read'    => $notification->is_read,
            'read_at'    => $notification->read_at,
            'created_at' => $notification->created_at,
        ];
    }
}
