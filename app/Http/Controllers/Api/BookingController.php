<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderPhoto;
use App\Models\OrderStatusLog;
use App\Models\Service;
use App\Services\PaymentService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class BookingController extends Controller
{
    use ApiResponse;

    public function __construct(
        private PaymentService $paymentService,
    ) {
    }

    /**
     * Survey fee untuk Borongan Rumah (promo 60% dari Rp 250.000).
     */
    private const SURVEY_FEE = 100_000;

    /**
     * POST /api/v1/booking/borongan/rumah
     */
    public function createBoronganRumah(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'photos'                 => ['required', 'array', 'min:1', 'max:10'],
            'photos.*'               => ['required', 'string'],
            'address'                => ['required', 'string', 'max:500'],
            'address_detail'         => ['nullable', 'string', 'max:255'],
            'latitude'               => ['nullable', 'numeric', 'between:-90,90'],
            'longitude'              => ['nullable', 'numeric', 'between:-180,180'],
            'survey_scheduled_at'    => ['required', 'date', 'after:today'],
            'budget'                 => ['required', 'string', 'max:50'],
            'promo_code'             => ['nullable', 'string', 'max:50'],
            'referral_sources'       => ['required', 'array', 'min:1'],
            'referral_sources.*'     => ['string', 'max:100'],
            'building_type'          => ['required', 'string', 'max:50'],
            'description'            => ['nullable', 'string', 'max:500'],
        ]);

        $user = $request->user();

        return DB::transaction(function () use ($validated, $user) {
            // Order
            $order = Order::create([
                'order_code'            => Order::generateOrderCode(),
                'customer_id'           => $user->id,
                'order_type'            => 'borongan_home',
                'survey_address'        => $validated['address'],
                'survey_address_detail' => $validated['address_detail'] ?? null,
                'survey_latitude'       => $validated['latitude'] ?? null,
                'survey_longitude'      => $validated['longitude'] ?? null,
                'survey_scheduled_at'   => $validated['survey_scheduled_at'],
                'budget_range'          => $validated['budget'],
                'referral_sources'      => $validated['referral_sources'],
                'building_type'         => $validated['building_type'],
                'promo_code'            => $validated['promo_code'] ?? null,
                'problem_description'   => $validated['description'] ?? null,
                'status'                => 'pending_payment',
                'subtotal'              => self::SURVEY_FEE,
                'total'                 => self::SURVEY_FEE,
            ]);

            // Photos
            foreach ($validated['photos'] as $index => $photoData) {
                $photoUrl = $this->storePhoto($photoData, $order->id, $index);

                OrderPhoto::create([
                    'order_id'    => $order->id,
                    'type'        => 'issue',
                    'photo_url'   => $photoUrl,
                    'uploaded_by' => $user->id,
                ]);
            }

            // Initial status log
            OrderStatusLog::create([
                'order_id'    => $order->id,
                'from_status' => null,
                'to_status'   => 'pending_payment',
                'changed_by'  => $user->id,
                'notes'       => 'Order borongan rumah dibuat via mobile app',
            ]);

            // Buat payment record (dengan timer 1 jam) — required untuk simulate-payment & webhook flow
            $this->paymentService->createPayment($order);

            $order->refresh()->load('photos');

            return $this->successResponse([
                'order_id'      => $order->id,
                'order_code'    => $order->order_code,
                'total_amount'  => (float) $order->total,
                'status'        => $order->status,
                'photos_count'  => $order->photos->count(),
                'payment_url'   => "/payment/{$order->id}",
            ], 'Order berhasil dibuat', 201);
        });
    }

    /**
     * POST /api/v1/booking/borongan/bisnis
     */
    public function createBoronganBisnis(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'photos'                 => ['required', 'array', 'min:1', 'max:10'],
            'photos.*'               => ['required', 'string'],
            'address'                => ['required', 'string', 'max:500'],
            'address_detail'         => ['nullable', 'string', 'max:255'],
            'latitude'               => ['nullable', 'numeric', 'between:-90,90'],
            'longitude'              => ['nullable', 'numeric', 'between:-180,180'],
            'survey_scheduled_at'    => ['required', 'date', 'after:today'],
            'budget'                 => ['required', 'string', 'max:50'],
            'promo_code'             => ['nullable', 'string', 'max:50'],
            'referral_sources'       => ['required', 'array', 'min:1'],
            'referral_sources.*'     => ['string', 'max:100'],
            'business_name'          => ['required', 'string', 'max:100'],
            'branch_count'           => ['required', 'string', 'max:50'],
            'building_type'          => ['required', 'string', 'max:50'],
            'description'            => ['nullable', 'string', 'max:500'],
        ]);

        $user = $request->user();

        return DB::transaction(function () use ($validated, $user) {
            $order = Order::create([
                'order_code'            => Order::generateOrderCode(),
                'customer_id'           => $user->id,
                'order_type'            => 'borongan_business',
                'survey_address'        => $validated['address'],
                'survey_address_detail' => $validated['address_detail'] ?? null,
                'survey_latitude'       => $validated['latitude'] ?? null,
                'survey_longitude'      => $validated['longitude'] ?? null,
                'survey_scheduled_at'   => $validated['survey_scheduled_at'],
                'budget_range'          => $validated['budget'],
                'referral_sources'      => $validated['referral_sources'],
                'building_type'         => $validated['building_type'],
                'business_name'         => $validated['business_name'],
                'branch_count'          => $validated['branch_count'],
                'promo_code'            => $validated['promo_code'] ?? null,
                'problem_description'   => $validated['description'] ?? null,
                'status'                => 'pending_payment',
                'subtotal'              => self::SURVEY_FEE,
                'total'                 => self::SURVEY_FEE,
            ]);

            foreach ($validated['photos'] as $index => $photoData) {
                $photoUrl = $this->storePhoto($photoData, $order->id, $index);

                OrderPhoto::create([
                    'order_id'    => $order->id,
                    'type'        => 'issue',
                    'photo_url'   => $photoUrl,
                    'uploaded_by' => $user->id,
                ]);
            }

            OrderStatusLog::create([
                'order_id'    => $order->id,
                'from_status' => null,
                'to_status'   => 'pending_payment',
                'changed_by'  => $user->id,
                'notes'       => 'Order borongan bisnis dibuat via mobile app',
            ]);

            $this->paymentService->createPayment($order);

            $order->refresh()->load('photos');

            return $this->successResponse([
                'order_id'      => $order->id,
                'order_code'    => $order->order_code,
                'total_amount'  => (float) $order->total,
                'status'        => $order->status,
                'photos_count'  => $order->photos->count(),
                'payment_url'   => "/payment/{$order->id}",
            ], 'Order berhasil dibuat', 201);
        });
    }

    /**
     * POST /api/v1/booking/tukang-harian
     *
     * Tukang Harian: simple form, single service, no photos.
     * Total = price_full_day × (duration_hours / 8).
     */
    public function createTukangHarian(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'service_id'         => ['required', 'integer', 'exists:services,id'],
            'referral_sources'   => ['required', 'array', 'min:1'],
            'referral_sources.*' => ['string', 'max:100'],
            'address'            => ['required', 'string', 'max:500'],
            'address_detail'     => ['nullable', 'string', 'max:255'],
            'work_scheduled_at'  => ['required', 'date', 'after:today'],
            'duration_hours'     => ['required', 'integer', 'min:2', 'max:12'],
            'description'        => ['required', 'string', 'min:10', 'max:500'],
            'promo_code'         => ['nullable', 'string', 'max:50'],
        ]);

        $user = $request->user();

        return DB::transaction(function () use ($validated, $user) {
            $service = Service::where('id', $validated['service_id'])
                ->where('is_active', true)
                ->firstOrFail();

            // Pricing: price_full_day adalah tarif 8 jam. Pro-rate by duration.
            $basePrice = (float) $service->price_full_day;
            $total = round($basePrice * ($validated['duration_hours'] / 8), 2);

            $order = Order::create([
                'order_code'           => Order::generateOrderCode(),
                'customer_id'          => $user->id,
                'order_type'           => 'daily_tukang', // matches existing enum
                'service_id'           => $service->id,
                'survey_address'       => $validated['address'],
                'survey_address_detail' => $validated['address_detail'] ?? null,
                'work_scheduled_at'    => $validated['work_scheduled_at'],
                'duration_hours'       => $validated['duration_hours'],
                'referral_sources'     => $validated['referral_sources'],
                'promo_code'           => $validated['promo_code'] ?? null,
                'problem_description'  => $validated['description'],
                'status'               => 'pending_payment',
                'subtotal'             => $total,
                'total'                => $total,
            ]);

            OrderStatusLog::create([
                'order_id'    => $order->id,
                'from_status' => null,
                'to_status'   => 'pending_payment',
                'changed_by'  => $user->id,
                'notes'       => 'Order tukang harian dibuat via mobile app: '.$service->name,
            ]);

            $this->paymentService->createPayment($order);

            return $this->successResponse([
                'order_id'           => $order->id,
                'order_code'         => $order->order_code,
                'service_id'         => $service->id,
                'service_name'       => $service->name,
                'duration_hours'     => $order->duration_hours,
                'work_scheduled_at'  => $order->work_scheduled_at,
                'total_amount'       => (float) $order->total,
                'status'             => $order->status,
                'payment_url'        => "/payment/{$order->id}",
            ], 'Order berhasil dibuat', 201);
        });
    }

    /**
     * POST /api/v1/booking/perbaikan-material
     *
     * Layanan Perbaikan + Material. Sama flow dengan Tukang Harian,
     * tambahan flag `material_included`. Saat material included=true, tim akan
     * survey dulu untuk hitung material (total awal = jasa saja).
     */
    public function createPerbaikanMaterial(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'service_id' => ['required', 'integer', 'exists:services,id'],
            'referral_sources' => ['required', 'array', 'min:1'],
            'referral_sources.*' => ['string', 'max:100'],
            'material_included' => ['required', 'boolean'],
            'address' => ['required', 'string', 'max:500'],
            'address_detail' => ['nullable', 'string', 'max:255'],
            'work_scheduled_at' => ['required', 'date', 'after:today'],
            'duration_hours' => ['required', 'integer', 'min:2', 'max:12'],
            'description' => ['required', 'string', 'min:10', 'max:500'],
            'promo_code' => ['nullable', 'string', 'max:50'],
        ]);

        $user = $request->user();

        return DB::transaction(function () use ($validated, $user) {
            $service = Service::where('id', $validated['service_id'])
                ->where('is_active', true)
                ->firstOrFail();

            $basePrice = (float) $service->price_full_day;
            $total = round($basePrice * ($validated['duration_hours'] / 8), 2);

            $order = Order::create([
                'order_code' => Order::generateOrderCode(),
                'customer_id' => $user->id,
                'order_type' => 'daily_with_material',
                'service_id' => $service->id,
                'survey_address' => $validated['address'],
                'survey_address_detail' => $validated['address_detail'] ?? null,
                'work_scheduled_at' => $validated['work_scheduled_at'],
                'duration_hours' => $validated['duration_hours'],
                'material_included' => $validated['material_included'],
                'referral_sources' => $validated['referral_sources'],
                'promo_code' => $validated['promo_code'] ?? null,
                'problem_description' => $validated['description'],
                'status' => 'pending_payment',
                'subtotal' => $total,
                'total' => $total,
            ]);

            $noteMaterial = $validated['material_included']
                ? 'dengan material (survey menyusul)'
                : 'tanpa material';

            OrderStatusLog::create([
                'order_id' => $order->id,
                'from_status' => null,
                'to_status' => 'pending_payment',
                'changed_by' => $user->id,
                'notes' => 'Order perbaikan '.$noteMaterial.' via mobile app: '.$service->name,
            ]);

            $this->paymentService->createPayment($order);

            return $this->successResponse([
                'order_id' => $order->id,
                'order_code' => $order->order_code,
                'service_id' => $service->id,
                'service_name' => $service->name,
                'duration_hours' => $order->duration_hours,
                'material_included' => (bool) $order->material_included,
                'work_scheduled_at' => $order->work_scheduled_at,
                'total_amount' => (float) $order->total,
                'status' => $order->status,
                'payment_url' => "/payment/{$order->id}",
            ], 'Order berhasil dibuat', 201);
        });
    }

    /**
     * Simpan foto. Support data URI (base64) atau file path lokal (skip for dev).
     */
    private function storePhoto(string $photoData, int $orderId, int $index): string
    {
        if (str_starts_with($photoData, 'data:image')) {
            // Extract base64 + detect ext (jpeg/png)
            if (! preg_match('/^data:image\/(\w+);base64,/', $photoData, $matches)) {
                throw new \InvalidArgumentException('Format data URI tidak valid pada photo index '.$index);
            }
            $ext = strtolower($matches[1]);
            $ext = $ext === 'jpeg' ? 'jpg' : $ext;

            $base64 = preg_replace('/^data:image\/\w+;base64,/', '', $photoData);
            $base64 = str_replace(' ', '+', $base64);

            $binary = base64_decode($base64, true);
            if ($binary === false) {
                throw new \InvalidArgumentException('Base64 decode gagal pada photo index '.$index);
            }

            $filename = sprintf('order_%d_photo_%d_%d.%s', $orderId, $index, time(), $ext);
            $path = "uploads/orders/{$orderId}/{$filename}";

            Storage::disk('public')->put($path, $binary);

            return $path;
        }

        // Fallback untuk dev: kalau bukan data URI, simpan path apa adanya (debug only)
        Log::warning('Photo bukan data URI, disimpan as-is', ['order_id' => $orderId, 'index' => $index]);

        return $photoData;
    }
}
