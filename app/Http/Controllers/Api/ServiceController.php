<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ServiceResource;
use App\Models\Service;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    use ApiResponse;

    /**
     * GET /api/v1/services[?category=tukang_harian|perbaikan]
     *
     * List semua service aktif, bisa filter by category.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Service::active();

        if ($category = $request->query('category')) {
            $query->where('category', $category);
        }

        return $this->successResponse(
            ServiceResource::collection($query->get()),
            'Data layanan berhasil diambil'
        );
    }

    /**
     * GET /api/v1/services/{idOrSlug}
     */
    public function show(string $idOrSlug): JsonResponse
    {
        $service = is_numeric($idOrSlug)
            ? Service::find($idOrSlug)
            : Service::where('slug', $idOrSlug)->first();

        if (!$service || !$service->is_active) {
            return $this->notFoundResponse('Layanan tidak ditemukan');
        }

        return $this->successResponse(
            new ServiceResource($service),
            'Detail layanan berhasil diambil'
        );
    }
}
