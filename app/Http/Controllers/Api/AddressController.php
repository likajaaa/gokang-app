<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\AddressRequest;
use App\Http\Resources\AddressResource;
use App\Models\Address;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AddressController extends Controller
{
    use ApiResponse;

    /**
     * GET /api/v1/addresses
     */
    public function index(Request $request): JsonResponse
    {
        $addresses = $request->user()
            ->addresses()
            ->with('area')
            ->orderByDesc('is_default')
            ->orderByDesc('created_at')
            ->get();

        return $this->successResponse(
            AddressResource::collection($addresses),
            'Data alamat berhasil diambil'
        );
    }

    /**
     * POST /api/v1/addresses
     */
    public function store(AddressRequest $request): JsonResponse
    {
        $data = $request->validated();
        $user = $request->user();

        $address = DB::transaction(function () use ($data, $user) {
            // Kalau is_default = true, unset default dari alamat lain
            if (!empty($data['is_default'])) {
                $user->addresses()->update(['is_default' => false]);
            }

            // Kalau ini alamat pertama, otomatis jadi default
            if ($user->addresses()->count() === 0) {
                $data['is_default'] = true;
            }

            $address = $user->addresses()->create($data);
            $address->load('area');

            return $address;
        });

        return $this->successResponse(
            new AddressResource($address),
            'Alamat berhasil ditambahkan',
            201
        );
    }

    /**
     * GET /api/v1/addresses/{id}
     */
    public function show(Request $request, int $id): JsonResponse
    {
        $address = $request->user()->addresses()->with('area')->find($id);

        if (!$address) {
            return $this->notFoundResponse('Alamat tidak ditemukan');
        }

        return $this->successResponse(
            new AddressResource($address),
            'Detail alamat berhasil diambil'
        );
    }

    /**
     * PUT /api/v1/addresses/{id}
     */
    public function update(AddressRequest $request, int $id): JsonResponse
    {
        $address = $request->user()->addresses()->find($id);

        if (!$address) {
            return $this->notFoundResponse('Alamat tidak ditemukan');
        }

        $data = $request->validated();

        DB::transaction(function () use ($data, $address, $request) {
            if (!empty($data['is_default'])) {
                $request->user()->addresses()
                    ->where('id', '!=', $address->id)
                    ->update(['is_default' => false]);
            }

            $address->update($data);
        });

        $address->load('area');

        return $this->successResponse(
            new AddressResource($address),
            'Alamat berhasil diupdate'
        );
    }

    /**
     * DELETE /api/v1/addresses/{id}
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        $address = $request->user()->addresses()->find($id);

        if (!$address) {
            return $this->notFoundResponse('Alamat tidak ditemukan');
        }

        $wasDefault = $address->is_default;
        $address->delete();

        // Kalau alamat yang dihapus adalah default, jadikan alamat lain sebagai default
        if ($wasDefault) {
            $nextAddress = $request->user()->addresses()->first();
            if ($nextAddress) {
                $nextAddress->update(['is_default' => true]);
            }
        }

        return $this->successResponse(null, 'Alamat berhasil dihapus');
    }

    /**
     * PUT /api/v1/addresses/{id}/set-default
     */
    public function setDefault(Request $request, int $id): JsonResponse
    {
        $address = $request->user()->addresses()->find($id);

        if (!$address) {
            return $this->notFoundResponse('Alamat tidak ditemukan');
        }

        DB::transaction(function () use ($request, $address) {
            $request->user()->addresses()->update(['is_default' => false]);
            $address->update(['is_default' => true]);
        });

        return $this->successResponse(
            new AddressResource($address->fresh('area')),
            'Alamat utama berhasil diubah'
        );
    }
}
