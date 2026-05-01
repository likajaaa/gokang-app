<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\CompleteRegistrationRequest;
use App\Http\Requests\Auth\SendOtpRequest;
use App\Http\Requests\Auth\VerifyOtpRequest;
use App\Http\Resources\UserResource;
use App\Models\Customer;
use App\Models\User;
use App\Services\OtpService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AuthController extends Controller
{
    use ApiResponse;

    public function __construct(private OtpService $otpService)
    {
    }

    /**
     * POST /api/v1/auth/register/send-otp
     *
     * Kirim OTP untuk registrasi.
     */
    public function sendRegisterOtp(SendOtpRequest $request): JsonResponse
    {
        $phone = $request->validated('phone');

        // Cek apakah nomor sudah terdaftar
        if (User::where('phone', $phone)->whereNotNull('phone_verified_at')->exists()) {
            return $this->errorResponse(
                'Nomor HP ini sudah terdaftar. Silakan login.',
                null,
                409
            );
        }

        try {
            $otp = $this->otpService->sendOtp($phone, 'register');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), null, 429);
        }

        return $this->successResponse(
            $this->otpResponseData($otp->otp_code),
            'Kode OTP telah dikirim ke WhatsApp'
        );
    }

    /**
     * POST /api/v1/auth/register/verify-otp
     *
     * Verifikasi OTP registrasi.
     */
    public function verifyRegisterOtp(VerifyOtpRequest $request): JsonResponse
    {
        $phone = $request->validated('phone');
        $otp = $request->validated('otp');

        if (!$this->otpService->verifyOtp($phone, $otp, 'register')) {
            return $this->errorResponse('Kode OTP salah atau sudah kadaluarsa', null, 422);
        }

        return $this->successResponse(
            ['verified' => true],
            'OTP berhasil diverifikasi. Lanjutkan lengkapi profil.'
        );
    }

    /**
     * POST /api/v1/auth/register/complete
     *
     * Complete registrasi setelah OTP terverifikasi.
     */
    public function completeRegistration(CompleteRegistrationRequest $request): JsonResponse
    {
        $data = $request->validated();

        // Pastikan phone sudah pernah diverifikasi dalam sesi register
        $hasVerified = \App\Models\OtpVerification::where('phone', $data['phone'])
            ->where('purpose', 'register')
            ->whereNotNull('verified_at')
            ->where('verified_at', '>=', now()->subMinutes(30))
            ->exists();

        if (!$hasVerified) {
            return $this->errorResponse(
                'Sesi verifikasi habis. Silakan mulai ulang registrasi.',
                null,
                403
            );
        }

        // Cek duplikat (safety net)
        if (User::where('phone', $data['phone'])->whereNotNull('phone_verified_at')->exists()) {
            return $this->errorResponse('Nomor HP sudah terdaftar', null, 409);
        }

        $user = DB::transaction(function () use ($data) {
            $user = User::create([
                'role' => 'customer',
                'name' => $data['name'],
                'phone' => $data['phone'],
                'email' => $data['email'] ?? null,
                'phone_verified_at' => now(),
                'status' => 'active',
            ]);

            Customer::create(['user_id' => $user->id]);

            return $user;
        });

        $token = $user->createToken('mobile-app', ['*'], now()->addDays(30))->plainTextToken;

        $user->update(['last_login_at' => now()]);
        $user->load('customer');

        return $this->successResponse([
            'user' => new UserResource($user),
            'token' => $token,
            'token_type' => 'Bearer',
        ], 'Registrasi berhasil', 201);
    }

    /**
     * POST /api/v1/auth/login/send-otp
     *
     * Kirim OTP untuk login.
     */
    public function sendLoginOtp(SendOtpRequest $request): JsonResponse
    {
        $phone = $request->validated('phone');

        $user = User::where('phone', $phone)
            ->whereNotNull('phone_verified_at')
            ->first();

        if (!$user) {
            return $this->errorResponse(
                'Nomor HP belum terdaftar. Silakan registrasi dulu.',
                null,
                404
            );
        }

        if ($user->status !== 'active') {
            return $this->errorResponse(
                'Akun tidak aktif. Hubungi customer service.',
                null,
                403
            );
        }

        try {
            $otp = $this->otpService->sendOtp($phone, 'login');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), null, 429);
        }

        return $this->successResponse(
            $this->otpResponseData($otp->otp_code),
            'Kode OTP telah dikirim ke WhatsApp'
        );
    }

    /**
     * Build payload for OTP-send responses. In local env with SMS disabled,
     * include the raw OTP so the mobile app can surface it (dev-only QoL).
     */
    private function otpResponseData(string $otpCode): array
    {
        $data = ['expires_in' => 300];

        $smsEnabled = (bool) config('services.sms.enabled', false);
        if (app()->environment('local') && ! $smsEnabled) {
            $data['dev_otp'] = $otpCode;
            $data['dev_note'] = 'OTP ini hanya dikembalikan saat APP_ENV=local dan SMS_ENABLED=false.';
        }

        return $data;
    }

    /**
     * POST /api/v1/auth/login/verify-otp
     *
     * Verifikasi OTP & login.
     */
    public function verifyLoginOtp(VerifyOtpRequest $request): JsonResponse
    {
        $phone = $request->validated('phone');
        $otp = $request->validated('otp');

        if (!$this->otpService->verifyOtp($phone, $otp, 'login')) {
            return $this->errorResponse('Kode OTP salah atau sudah kadaluarsa', null, 422);
        }

        $user = User::where('phone', $phone)->first();

        if (!$user) {
            return $this->notFoundResponse('User tidak ditemukan');
        }

        $token = $user->createToken('mobile-app', ['*'], now()->addDays(30))->plainTextToken;
        $user->update(['last_login_at' => now()]);

        // Load relasi sesuai role
        $user->load($user->role === 'tukang' ? 'tukang' : 'customer');

        return $this->successResponse([
            'user' => new UserResource($user),
            'token' => $token,
            'token_type' => 'Bearer',
        ], 'Login berhasil');
    }

    /**
     * POST /api/v1/auth/logout
     *
     * Logout (invalidate token saat ini).
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return $this->successResponse(null, 'Berhasil logout');
    }

    /**
     * GET /api/v1/auth/me
     *
     * Get current user info.
     */
    public function me(Request $request): JsonResponse
    {
        $user = $request->user();
        $user->load($user->role === 'tukang' ? 'tukang' : 'customer');

        return $this->successResponse(
            new UserResource($user),
            'Data user berhasil diambil'
        );
    }
}
