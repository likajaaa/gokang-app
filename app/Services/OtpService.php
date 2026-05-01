<?php

namespace App\Services;

use App\Models\OtpVerification;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class OtpService
{
    public function __construct(private readonly SmsService $sms) {}

    /**
     * OTP expire dalam 5 menit.
     */
    private const EXPIRE_MINUTES = 5;

    /**
     * Max attempt untuk verify OTP yang sama.
     */
    private const MAX_ATTEMPTS = 5;

    /**
     * Max request OTP per phone per jam.
     */
    private const MAX_REQUESTS_PER_HOUR = 5;

    /**
     * Generate & kirim OTP.
     *
     * @throws \Exception jika rate limit exceeded
     */
    public function sendOtp(string $phone, string $purpose): OtpVerification
    {
        // Cek rate limit
        $recentCount = OtpVerification::where('phone', $phone)
            ->where('purpose', $purpose)
            ->where('created_at', '>=', now()->subHour())
            ->count();

        if ($recentCount >= self::MAX_REQUESTS_PER_HOUR) {
            throw new \Exception('Terlalu banyak permintaan OTP. Silakan coba lagi nanti.');
        }

        // Generate OTP 6 digit
        $otpCode = str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        // Bypass untuk phone test (dev only)
        if (app()->environment('local', 'staging') && $phone === '+6281234567890') {
            $otpCode = '123456';
        }

        // Invalidate OTP lama untuk phone+purpose ini
        OtpVerification::where('phone', $phone)
            ->where('purpose', $purpose)
            ->whereNull('verified_at')
            ->delete();

        // Simpan OTP baru
        $otp = OtpVerification::create([
            'phone' => $phone,
            'otp_code' => $otpCode,
            'purpose' => $purpose,
            'expires_at' => now()->addMinutes(self::EXPIRE_MINUTES),
        ]);

        // Kirim via WhatsApp/SMS (gateway integration - placeholder)
        $this->dispatchOtp($phone, $otpCode);

        return $otp;
    }

    /**
     * Verifikasi OTP.
     */
    public function verifyOtp(string $phone, string $otpCode, string $purpose): bool
    {
        $otp = OtpVerification::where('phone', $phone)
            ->where('purpose', $purpose)
            ->whereNull('verified_at')
            ->latest()
            ->first();

        if (!$otp) {
            return false;
        }

        // Cek expired
        if (Carbon::parse($otp->expires_at)->isPast()) {
            return false;
        }

        // Cek max attempt
        if ($otp->attempt_count >= self::MAX_ATTEMPTS) {
            return false;
        }

        // Increment attempt
        $otp->increment('attempt_count');

        // Cek kode
        if ($otp->otp_code !== $otpCode) {
            return false;
        }

        // Mark verified
        $otp->update(['verified_at' => now()]);

        return true;
    }

    /**
     * Kirim OTP via SMS gateway (Zenziva/RajaSMS/Twilio).
     * Saat SMS_ENABLED=false, SmsService hanya log ke laravel.log (DEV mode).
     */
    private function dispatchOtp(string $phone, string $otpCode): void
    {
        // Log OTP eksplisit dengan tag konsisten → mudah grep di laravel.log saat dev
        Log::info('OTP Generated', [
            'phone' => $phone,
            'otp_code' => $otpCode,
            'sms_enabled' => (bool) config('services.sms.enabled', false),
            'expires_in_minutes' => self::EXPIRE_MINUTES,
        ]);

        $this->sms->sendOtp($phone, $otpCode);
    }
}
