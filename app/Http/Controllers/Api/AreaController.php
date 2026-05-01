<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Area;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AreaController extends Controller
{
    use ApiResponse;

    /**
     * GET /api/v1/areas/cities
     *
     * List kota (Jakarta, Bogor, Depok, Tangerang, Bekasi).
     */
    public function cities(): JsonResponse
    {
        $cities = Area::cities()
            ->where('is_covered', true)
            ->orderBy('name')
            ->get(['id', 'name']);

        return $this->successResponse($cities, 'Data kota berhasil diambil');
    }

    /**
     * GET /api/v1/areas/districts?city_id=1
     *
     * List kecamatan dalam kota.
     */
    public function districts(Request $request): JsonResponse
    {
        $request->validate(['city_id' => 'required|integer|exists:areas,id']);

        $districts = Area::where('parent_id', $request->city_id)
            ->where('level', 'district')
            ->where('is_covered', true)
            ->orderBy('name')
            ->get(['id', 'name', 'parent_id']);

        return $this->successResponse($districts, 'Data kecamatan berhasil diambil');
    }

    /**
     * GET /api/v1/areas/check?lat=-6.2&lng=106.8
     *
     * Cek apakah lokasi dilayani.
     * Untuk MVP: anggap semua koordinat valid jika di range Jabodetabek.
     */
    public function check(Request $request): JsonResponse
    {
        $request->validate([
            'lat' => 'required|numeric|between:-90,90',
            'lng' => 'required|numeric|between:-180,180',
        ]);

        // Bounding box Jabodetabek (approx)
        $lat = (float) $request->lat;
        $lng = (float) $request->lng;

        $isInJabodetabek = $lat >= -6.8 && $lat <= -5.9
            && $lng >= 106.4 && $lng <= 107.2;

        return $this->successResponse([
            'is_covered' => $isInJabodetabek,
            'message' => $isInJabodetabek
                ? 'Lokasi ini dilayani GoKang'
                : 'Maaf, lokasi di luar area Jabodetabek',
        ]);
    }
}
