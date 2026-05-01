<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderAssignment;
use App\Models\Review;
use App\Models\Tukang;
use App\Models\User;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class ReviewController extends Controller
{
    use ApiResponse;

    const VALID_TAGS = [
        'tepat_waktu',
        'rapi',
        'profesional',
        'ramah',
        'hasil_memuaskan',
        'komunikasi_baik',
    ];

    /**
     * POST /api/v1/orders/{orderId}/review
     *
     * Customer submit review setelah order selesai.
     */
    public function store(Request $request, int $orderId): JsonResponse
    {
        $user = $request->user();

        $request->validate([
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'tags'   => ['nullable', 'array'],
            'tags.*' => ['string', 'in:' . implode(',', self::VALID_TAGS)],
            'review' => ['nullable', 'string', 'max:1000'],
            'photos' => ['nullable', 'array', 'max:3'],
            'photos.*' => ['image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
        ]);

        $order = Order::with(['assignments' => fn ($q) => $q->where('status', 'accepted')])->find($orderId);

        if (!$order) {
            return $this->notFoundResponse('Pesanan tidak ditemukan');
        }

        if ($order->customer_id !== $user->id) {
            return $this->unauthorizedResponse('Kamu bukan pemilik pesanan ini');
        }

        if ($order->status !== 'completed') {
            return $this->errorResponse(
                'Pesanan harus selesai terlebih dahulu sebelum memberi ulasan',
                null,
                422
            );
        }

        if ($order->review()->exists()) {
            return $this->errorResponse('Kamu sudah memberikan ulasan untuk pesanan ini', null, 422);
        }

        // Ambil tukang yang di-assign (untuk order multi-item, gunakan yang pertama accept)
        $acceptedAssignment = $order->assignments->first();

        if (!$acceptedAssignment) {
            return $this->errorResponse('Tidak ada tukang yang terassign pada pesanan ini', null, 422);
        }

        $tukangUserId = $acceptedAssignment->tukang_id;

        // Upload foto review (opsional)
        $photoUrls = [];
        if ($request->hasFile('photos')) {
            foreach ($request->file('photos') as $photo) {
                $path = $photo->store('review-photos/' . $orderId, 'public');
                $photoUrls[] = Storage::url($path);
            }
        }

        DB::transaction(function () use ($request, $order, $user, $tukangUserId, $photoUrls) {
            Review::create([
                'order_id'    => $order->id,
                'customer_id' => $user->id,
                'tukang_id'   => $tukangUserId,
                'rating'      => $request->integer('rating'),
                'tags'        => $request->input('tags', []),
                'review'      => $request->input('review'),
                'photos'      => $photoUrls ?: null,
                'is_visible'  => true,
            ]);

            $this->recalculateTukangRating($tukangUserId);
        });

        return $this->successResponse(null, 'Ulasan berhasil dikirim. Terima kasih!', 201);
    }

    /**
     * GET /api/v1/tukang/{tukangId}/reviews
     *
     * List ulasan publik untuk tukang tertentu (tukangId = users.id).
     */
    public function index(Request $request, int $tukangId): JsonResponse
    {
        $tukangUser = User::find($tukangId);

        if (!$tukangUser || !$tukangUser->isTukang()) {
            return $this->notFoundResponse('Tukang tidak ditemukan');
        }

        $reviews = Review::with('customer')
            ->where('tukang_id', $tukangId)
            ->where('is_visible', true)
            ->orderByDesc('created_at')
            ->paginate(10);

        $tukangProfile = $tukangUser->tukang;

        return response()->json([
            'success' => true,
            'message' => 'Ulasan berhasil diambil',
            'data' => [
                'tukang' => [
                    'id'             => $tukangUser->id,
                    'name'           => $tukangUser->name,
                    'rating_average' => $tukangProfile?->rating_average,
                    'total_reviews'  => $reviews->total(),
                ],
                'reviews' => $reviews->map(fn ($r) => $this->formatReview($r)),
            ],
            'meta' => [
                'current_page' => $reviews->currentPage(),
                'last_page'    => $reviews->lastPage(),
                'per_page'     => $reviews->perPage(),
                'total'        => $reviews->total(),
            ],
        ]);
    }

    /**
     * Recalculate rating_average tukang dari semua review-nya.
     */
    private function recalculateTukangRating(int $tukangUserId): void
    {
        $avg = Review::where('tukang_id', $tukangUserId)
            ->where('is_visible', true)
            ->avg('rating');

        Tukang::where('user_id', $tukangUserId)
            ->update(['rating_average' => $avg ? round((float) $avg, 2) : null]);
    }

    /**
     * Mask nama customer: "Sari Wijaya" → "Sari W."
     */
    private function maskName(string $name): string
    {
        $parts = explode(' ', trim($name), 2);

        if (count($parts) === 1) {
            return strlen($name) <= 3 ? $name : substr($name, 0, 2) . '***';
        }

        return $parts[0] . ' ' . strtoupper(substr($parts[1], 0, 1)) . '.';
    }

    private function formatReview(Review $review): array
    {
        return [
            'id'           => $review->id,
            'rating'       => $review->rating,
            'tags'         => $review->tags ?? [],
            'review'       => $review->review,
            'photos'       => $review->photos ?? [],
            'customer'     => [
                'name' => $this->maskName($review->customer->name ?? 'Pengguna'),
            ],
            'created_at'   => $review->created_at,
        ];
    }
}
