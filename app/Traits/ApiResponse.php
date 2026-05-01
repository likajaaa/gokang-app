<?php

namespace App\Traits;

use Illuminate\Http\JsonResponse;

trait ApiResponse
{
    /**
     * Format success response.
     */
    protected function successResponse(
        mixed $data = null,
        string $message = 'Success',
        int $status = 200
    ): JsonResponse {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $data,
        ], $status);
    }

    /**
     * Format error response.
     */
    protected function errorResponse(
        string $message = 'Error',
        mixed $errors = null,
        int $status = 400
    ): JsonResponse {
        $response = [
            'success' => false,
            'message' => $message,
        ];

        if ($errors !== null) {
            $response['errors'] = $errors;
        }

        return response()->json($response, $status);
    }

    /**
     * Not found response.
     */
    protected function notFoundResponse(string $message = 'Data tidak ditemukan'): JsonResponse
    {
        return $this->errorResponse($message, null, 404);
    }

    /**
     * Unauthorized response.
     */
    protected function unauthorizedResponse(string $message = 'Tidak memiliki akses'): JsonResponse
    {
        return $this->errorResponse($message, null, 401);
    }

    /**
     * Validation error response.
     */
    protected function validationErrorResponse(mixed $errors, string $message = 'Validasi gagal'): JsonResponse
    {
        return $this->errorResponse($message, $errors, 422);
    }
}
