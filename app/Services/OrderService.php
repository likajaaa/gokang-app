<?php

namespace App\Services;

use App\Models\Order;
use App\Models\OrderAssignment;
use App\Models\OrderItem;
use App\Models\OrderStatusLog;
use App\Models\Service;
use App\Models\Tukang;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use App\Models\Voucher;

class OrderService
{
    public function __construct(
        private NotificationService $notificationService,
        private PaymentService $paymentService,
        private VoucherService $voucherService,
    ) {
    }

    /**
     * Buat order Tukang Harian dengan multi-item.
     *
     * Struktur $data:
     * [
     *   'address_id' => 1,
     *   'problem_description' => 'Mau cat dinding',
     *   'terms_accepted' => true,
     *   'voucher_code' => null,
     *   'items' => [
     *     [
     *       'service_id' => 1,
     *       'quantity' => 2,
     *       'start_date' => '2026-05-30',
     *       'end_date' => '2026-06-01',
     *       'session' => 'morning',
     *       'include_material' => false,
     *       'notes' => null,
     *     ],
     *     ...
     *   ],
     * ]
     *
     * @throws \Exception
     */
    public function createDailyTukangOrder(User $customer, array $data): Order
    {
        // Validasi terms
        if (empty($data['terms_accepted'])) {
            throw new \Exception('Kamu harus menyetujui syarat & ketentuan');
        }

        // Validasi minimal 1 item
        if (empty($data['items']) || !is_array($data['items'])) {
            throw new \Exception('Order harus punya minimal 1 jenis tukang');
        }

        // Validasi scheduled date untuk semua items
        foreach ($data['items'] as $item) {
            $this->validateScheduling($item['start_date']);
        }

        // Cek apakah ada item yang include material
        $hasMaterial = collect($data['items'])->contains(fn ($i) => !empty($i['include_material']));

        $order = DB::transaction(function () use ($customer, $data, $hasMaterial) {
            // Step 1: Buat order header dulu dengan total 0 (akan diupdate)
            $order = Order::create([
                'order_code' => Order::generateOrderCode(),
                'customer_id' => $customer->id,
                'order_type' => $hasMaterial ? 'daily_with_material' : 'daily_tukang',
                'address_id' => $data['address_id'],
                'problem_description' => $data['problem_description'] ?? null,
                'status' => 'pending_payment',
                'subtotal' => 0,
                'total' => 0,
                'terms_accepted_at' => now(),
            ]);

            // Step 2: Buat order items
            $subtotal = 0;
            foreach ($data['items'] as $itemData) {
                $service = Service::findOrFail($itemData['service_id']);
                $pricePerSession = $service->getPriceBySession($itemData['session']);

                $startDate = Carbon::parse($itemData['start_date']);
                $endDate = Carbon::parse($itemData['end_date']);
                $totalDays = $startDate->diffInDays($endDate) + 1;

                $itemSubtotal = $pricePerSession * ($itemData['quantity'] ?? 1) * $totalDays;
                $subtotal += $itemSubtotal;

                OrderItem::create([
                    'order_id' => $order->id,
                    'service_id' => $service->id,
                    'quantity' => $itemData['quantity'] ?? 1,
                    'start_date' => $startDate,
                    'end_date' => $endDate,
                    'total_days' => $totalDays,
                    'session' => $itemData['session'],
                    'price_per_session' => $pricePerSession,
                    'subtotal' => $itemSubtotal,
                    'include_material' => $itemData['include_material'] ?? false,
                    'notes' => $itemData['notes'] ?? null,
                ]);
            }

            // Step 3: Apply voucher (kalau ada)
            $discount = 0;
            $voucherId = null;
            $appliedVoucher = null;

            if (!empty($data['voucher_code'])) {
                $serviceIds = array_column($data['items'], 'service_id');
                $voucherResult = $this->voucherService->validate(
                    $data['voucher_code'],
                    $customer->id,
                    $serviceIds,
                    $subtotal
                );
                $appliedVoucher = $voucherResult['voucher'];
                $discount = $voucherResult['discount_amount'];
                $voucherId = $appliedVoucher->id;
            }

            // Step 4: Hitung total akhir
            $extraFeeParking = 0;
            $total = $subtotal + $extraFeeParking - $discount;

            // Komisi platform
            $commissionRate = (float) config('gokang.commission_rate', 15) / 100;
            $platformFee = $total * $commissionRate;

            // Step 5: Update order dengan total
            $order->update([
                'subtotal' => $subtotal,
                'extra_fee_parking' => $extraFeeParking,
                'voucher_id' => $voucherId,
                'discount_amount' => $discount,
                'total' => $total,
                'platform_fee' => $platformFee,
            ]);

            // Step 6: Log status awal
            OrderStatusLog::create([
                'order_id' => $order->id,
                'from_status' => null,
                'to_status' => 'pending_payment',
                'changed_by' => $customer->id,
                'notes' => 'Order dibuat, menunggu pembayaran',
            ]);

            // Step 7: Buat payment record (dengan timer 1 jam)
            $this->paymentService->createPayment($order);

            // Step 8: Catat pemakaian voucher (jika ada)
            if ($appliedVoucher) {
                $this->voucherService->recordUsage($appliedVoucher, $order, $customer);
            }

            return $order;
        });

        return $order->fresh(['items.service', 'address', 'payment']);
    }

    /**
     * Validasi scheduling: minimum H+1, cutoff jam 15:00.
     */
    private function validateScheduling(string $dateStr): void
    {
        $scheduledDate = Carbon::parse($dateStr);

        if ($scheduledDate->isToday() || $scheduledDate->isPast()) {
            throw new \Exception('Tanggal pengerjaan minimal hari berikutnya');
        }

        if ($scheduledDate->isTomorrow() && now()->hour >= 15) {
            throw new \Exception('Untuk kedatangan besok, pesan sebelum jam 3 sore');
        }
    }

    /**
     * Trigger setelah payment sukses:
     * buat assignment untuk tiap order_item, lalu mulai hybrid matching.
     */
    public function onPaymentSuccess(Order $order): void
    {
        DB::transaction(function () use ($order) {
            $order->update(['status' => 'searching_tukang']);

            OrderStatusLog::create([
                'order_id' => $order->id,
                'from_status' => 'pending_payment',
                'to_status' => 'searching_tukang',
                'changed_by' => null,
                'notes' => 'Pembayaran berhasil, mencari tukang',
            ]);

            // Buat 1 assignment record per order_item
            foreach ($order->items as $item) {
                OrderAssignment::create([
                    'order_id' => $order->id,
                    'order_item_id' => $item->id,
                    'status' => 'broadcasting',
                    'assignment_round' => 1,
                ]);
            }
        });

        // Mulai hybrid matching untuk tiap item
        foreach ($order->items as $item) {
            $this->autoAssignTukangForItem($order, $item);
        }
    }

    /**
     * Hybrid matching per order_item: auto-assign tukang terbaik,
     * fallback ke broadcast kalau tidak ada match.
     */
    public function autoAssignTukangForItem(Order $order, OrderItem $item): void
    {
        $address = $order->address;
        if (!$address) {
            return;
        }

        $radiusKm = (float) config('gokang.broadcast_radius_km', 15);

        // Cari tukang eligible
        $eligibleTukang = Tukang::approved()
            ->online()
            ->whereHas('skills', fn ($q) => $q->where('service_id', $item->service_id))
            ->whereNotNull('current_lat')
            ->whereNotNull('current_lng')
            ->get()
            ->map(function ($tukang) use ($address) {
                $tukang->distance_km = $this->haversineDistance(
                    (float) $address->lat,
                    (float) $address->lng,
                    (float) $tukang->current_lat,
                    (float) $tukang->current_lng
                );
                return $tukang;
            })
            ->filter(fn ($t) => $t->distance_km <= $radiusKm);

        if ($eligibleTukang->isEmpty()) {
            // TODO: schedule retry dengan radius maksimal (25km)
            // atau notify admin untuk manual intervention
            return;
        }

        // Pilih tukang terbaik: rating tinggi + jarak dekat
        // Skor = rating - (distance × 0.1) — simple scoring
        $bestTukang = $eligibleTukang->sortByDesc(fn ($t) => ($t->rating_average ?? 4.0) - ($t->distance_km * 0.1))
            ->first();

        // Update assignment jadi 'offered'
        $assignment = OrderAssignment::where('order_id', $order->id)
            ->where('order_item_id', $item->id)
            ->where('status', 'broadcasting')
            ->latest()
            ->first();

        if ($assignment) {
            $assignment->update([
                'tukang_id' => $bestTukang->user_id,
                'status' => 'offered',
                'offered_at' => now(),
            ]);
        }

        // Notify tukang
        $this->notificationService->sendOrderOffer($bestTukang->user, $order, $item);

        // TODO: schedule job untuk fallback broadcast kalau timeout 5 menit
    }

    /**
     * Tukang accept item tertentu.
     */
    public function acceptAssignment(OrderAssignment $assignment, User $tukangUser): void
    {
        if ($assignment->status !== 'offered') {
            throw new \Exception('Order sudah tidak tersedia');
        }

        if ($assignment->tukang_id !== $tukangUser->id) {
            throw new \Exception('Order ini tidak di-offer ke kamu');
        }

        DB::transaction(function () use ($assignment, $tukangUser) {
            $assignment->update([
                'status' => 'accepted',
                'responded_at' => now(),
            ]);

            $order = $assignment->order;

            // Kalau semua item sudah ada tukang yang accept, order jadi 'assigned'
            $totalItems = $order->items()->count();
            $acceptedCount = $order->assignments()->where('status', 'accepted')->count();

            if ($totalItems === $acceptedCount && $order->status === 'searching_tukang') {
                $order->update(['status' => 'assigned']);

                OrderStatusLog::create([
                    'order_id' => $order->id,
                    'from_status' => 'searching_tukang',
                    'to_status' => 'assigned',
                    'changed_by' => $tukangUser->id,
                    'notes' => 'Semua tukang sudah terassign',
                ]);
            }
        });

        $this->notificationService->notifyCustomerOrderAccepted($assignment->order);
    }

    /**
     * Tukang reject assignment → lempar ke tukang berikutnya.
     */
    public function rejectAssignment(OrderAssignment $assignment, User $tukang): void
    {
        if ($assignment->status !== 'offered') {
            throw new \Exception('Order sudah tidak tersedia');
        }

        DB::transaction(function () use ($assignment) {
            $assignment->update([
                'status' => 'rejected',
                'responded_at' => now(),
            ]);

            // Buat assignment baru untuk item yang sama (round berikutnya)
            OrderAssignment::create([
                'order_id' => $assignment->order_id,
                'order_item_id' => $assignment->order_item_id,
                'status' => 'broadcasting',
                'assignment_round' => $assignment->assignment_round + 1,
            ]);
        });

        // Re-trigger matching untuk item ini
        $this->autoAssignTukangForItem($assignment->order, $assignment->orderItem);
    }

    /**
     * Cancel order.
     */
    public function cancelOrder(Order $order, User $user, string $reason): void
    {
        if (!$order->canBeCancelled()) {
            throw new \Exception('Order tidak bisa dibatalkan pada status ini');
        }

        $cancelledBy = match (true) {
            $user->isCustomer() => 'customer',
            $user->isTukang() => 'tukang',
            $user->isAdmin() => 'admin',
            default => 'system',
        };

        DB::transaction(function () use ($order, $user, $reason, $cancelledBy) {
            $oldStatus = $order->status;

            $order->update([
                'status' => 'cancelled',
                'cancelled_at' => now(),
                'cancel_reason' => $reason,
                'cancelled_by' => $cancelledBy,
            ]);

            // Cancel semua assignment yang belum accepted
            $order->assignments()
                ->whereIn('status', ['broadcasting', 'offered'])
                ->update(['status' => 'cancelled']);

            OrderStatusLog::create([
                'order_id' => $order->id,
                'from_status' => $oldStatus,
                'to_status' => 'cancelled',
                'changed_by' => $user->id,
                'notes' => $reason,
            ]);
        });

        $this->notificationService->notifyOrderCancelled($order);
    }

    /**
     * Haversine formula untuk hitung jarak 2 koordinat (km).
     */
    private function haversineDistance(float $lat1, float $lng1, float $lat2, float $lng2): float
    {
        $earthRadius = 6371; // km

        $latDelta = deg2rad($lat2 - $lat1);
        $lngDelta = deg2rad($lng2 - $lng1);

        $a = sin($latDelta / 2) ** 2
            + cos(deg2rad($lat1)) * cos(deg2rad($lat2)) * sin($lngDelta / 2) ** 2;

        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

        return $earthRadius * $c;
    }
}
