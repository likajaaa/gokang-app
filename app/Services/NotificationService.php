<?php

namespace App\Services;

use App\Models\Notification;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class NotificationService
{
    /**
     * Kirim tawaran order (item spesifik) ke tukang.
     */
    public function sendOrderOffer(User $tukangUser, Order $order, OrderItem $item): void
    {
        $serviceName = $item->service->name;
        $address = $order->address?->full_address ?? 'Lokasi belum diketahui';

        $this->create(
            $tukangUser,
            'order_offer',
            'Order Baru!',
            "Ada tawaran {$serviceName} di {$address}",
            [
                'order_id' => $order->id,
                'order_code' => $order->order_code,
                'order_item_id' => $item->id,
            ]
        );

        $this->sendPushNotification($tukangUser, 'Order Baru!', "{$serviceName} - Cek aplikasi untuk detail");
    }

    public function notifyCustomerOrderAccepted(Order $order): void
    {
        $this->create(
            $order->customer,
            'order_accepted',
            'Tukang Ditemukan!',
            "Tukang Jagoan siap mengerjakan order {$order->order_code}",
            ['order_id' => $order->id]
        );

        $this->sendPushNotification(
            $order->customer,
            'Tukang Ditemukan!',
            "Order {$order->order_code} diterima tukang"
        );
    }

    public function notifyStatusChange(Order $order, string $newStatus): void
    {
        $messages = [
            'on_the_way' => 'Tukang sedang menuju lokasi',
            'arrived' => 'Tukang sudah sampai di lokasi',
            'in_progress' => 'Tukang mulai mengerjakan pesananmu',
            'completed' => 'Pekerjaan selesai! Mohon konfirmasi & beri rating',
        ];

        $message = $messages[$newStatus] ?? "Status order diupdate: {$newStatus}";

        $this->create(
            $order->customer,
            'order_status',
            'Update Pesanan',
            $message,
            ['order_id' => $order->id, 'status' => $newStatus]
        );

        $this->sendPushNotification($order->customer, 'Update Pesanan', $message);
    }

    public function notifyNewMessage(User $recipient, Order $order, User $sender): void
    {
        $this->create(
            $recipient,
            'chat_message',
            'Pesan Baru',
            "{$sender->name} mengirim pesan pada order {$order->order_code}",
            ['order_id' => $order->id, 'order_code' => $order->order_code]
        );

        $this->sendPushNotification(
            $recipient,
            'Pesan Baru',
            "Kamu punya pesan baru dari {$sender->name}"
        );
    }

    public function notifyOrderCancelled(Order $order): void
    {
        $this->create(
            $order->customer,
            'order_cancelled',
            'Pesanan Dibatalkan',
            "Order {$order->order_code} dibatalkan",
            ['order_id' => $order->id]
        );

        // Notify juga semua tukang yang sudah accept
        $acceptedTukangIds = $order->assignments()
            ->where('status', 'accepted')
            ->pluck('tukang_id')
            ->filter()
            ->unique();

        foreach ($acceptedTukangIds as $tukangId) {
            $tukang = User::find($tukangId);
            if ($tukang) {
                $this->create(
                    $tukang,
                    'order_cancelled',
                    'Pesanan Dibatalkan',
                    "Order {$order->order_code} dibatalkan customer",
                    ['order_id' => $order->id]
                );
            }
        }
    }

    /**
     * Simpan notifikasi in-app.
     */
    private function create(User $user, string $type, string $title, string $message, array $data = []): Notification
    {
        return Notification::create([
            'user_id' => $user->id,
            'type' => $type,
            'title' => $title,
            'message' => $message,
            'data' => $data,
        ]);
    }

    /**
     * Kirim push notification via FCM.
     * TODO: integrate Firebase Cloud Messaging.
     */
    private function sendPushNotification(User $user, string $title, string $body): void
    {
        if (!$user->fcm_token) {
            return;
        }

        if (app()->environment('local')) {
            Log::info("[FCM] To: {$user->phone} | {$title} - {$body}");
            return;
        }

        // TODO: Call FCM HTTP v1 API
    }
}
