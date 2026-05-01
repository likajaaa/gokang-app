<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SmsService
{
    protected bool $enabled;

    protected string $provider;

    protected string $apiKey;

    protected string $apiSecret;

    protected ?string $fromNumber;

    public function __construct()
    {
        $this->enabled = (bool) config('services.sms.enabled', false);
        $this->provider = (string) config('services.sms.provider', 'zenziva');
        $this->apiKey = (string) config('services.sms.api_key', '');
        $this->apiSecret = (string) config('services.sms.api_secret', '');
        $this->fromNumber = config('services.sms.from_number');
    }

    /**
     * Kirim SMS ke nomor HP.
     *
     * @param string $phone Nomor HP format +62xxx
     * @param string $message Isi pesan SMS
     */
    public function send(string $phone, string $message): bool
    {
        // Development mode: log saja, tidak kirim SMS
        if (! $this->enabled) {
            Log::info('SMS (DEV MODE - NOT SENT)', [
                'phone' => $phone,
                'message' => $message,
            ]);

            return true;
        }

        // Production mode: kirim via provider
        try {
            return match ($this->provider) {
                'zenziva' => $this->sendViaZenziva($phone, $message),
                'rajasms' => $this->sendViaRajaSms($phone, $message),
                'twilio' => $this->sendViaTwilio($phone, $message),
                default => tap(false, fn () => Log::error('Unknown SMS provider', ['provider' => $this->provider])),
            };
        } catch (\Throwable $e) {
            Log::error('SMS send failed', [
                'phone' => $phone,
                'provider' => $this->provider,
                'error' => $e->getMessage(),
            ]);

            return false;
        }
    }

    /**
     * Kirim OTP dengan format pesan standar.
     */
    public function sendOtp(string $phone, string $otpCode): bool
    {
        $message = "Kode OTP GoKang kamu: {$otpCode}. Berlaku 5 menit. Jangan bagikan ke siapapun.";

        return $this->send($phone, $message);
    }

    protected function sendViaZenziva(string $phone, string $message): bool
    {
        $response = Http::asForm()
            ->timeout(15)
            ->post('https://console.zenziva.net/reguler/api/sendsms/', [
                'userkey' => $this->apiKey,
                'passkey' => $this->apiSecret,
                'to' => $this->formatPhoneLocal($phone),
                'message' => $message,
            ]);

        if (! $response->successful()) {
            Log::warning('Zenziva HTTP failed', ['status' => $response->status(), 'body' => $response->body()]);

            return false;
        }

        $data = $response->json();
        $ok = isset($data['status']) && (string) $data['status'] === '1';

        if (! $ok) {
            Log::warning('Zenziva response not success', ['response' => $data]);
        }

        return $ok;
    }

    protected function sendViaRajaSms(string $phone, string $message): bool
    {
        $response = Http::asForm()
            ->timeout(15)
            ->post('https://rajasms.id/api/send', [
                'apikey' => $this->apiKey,
                'number' => $this->formatPhoneLocal($phone),
                'message' => $message,
            ]);

        if (! $response->successful()) {
            Log::warning('RajaSMS HTTP failed', ['status' => $response->status(), 'body' => $response->body()]);

            return false;
        }

        return true;
    }

    protected function sendViaTwilio(string $phone, string $message): bool
    {
        if (! $this->fromNumber) {
            Log::error('Twilio: SMS_FROM_NUMBER not set');

            return false;
        }

        // Twilio: apiKey=Account SID, apiSecret=Auth Token
        $response = Http::withBasicAuth($this->apiKey, $this->apiSecret)
            ->asForm()
            ->timeout(15)
            ->post("https://api.twilio.com/2010-04-01/Accounts/{$this->apiKey}/Messages.json", [
                'To' => $this->formatPhoneInternational($phone),
                'From' => $this->fromNumber,
                'Body' => $message,
            ]);

        if (! $response->successful()) {
            Log::warning('Twilio HTTP failed', ['status' => $response->status(), 'body' => $response->body()]);

            return false;
        }

        return true;
    }

    /**
     * Convert +6281234567890 → 081234567890 (untuk gateway lokal).
     */
    protected function formatPhoneLocal(string $phone): string
    {
        $digits = preg_replace('/\D/', '', $phone);

        if (str_starts_with($digits, '62')) {
            return '0'.substr($digits, 2);
        }
        if (str_starts_with($digits, '0')) {
            return $digits;
        }

        return '0'.$digits;
    }

    /**
     * Convert 081234567890 → +6281234567890 (untuk gateway internasional).
     */
    protected function formatPhoneInternational(string $phone): string
    {
        $digits = preg_replace('/\D/', '', $phone);

        if (str_starts_with($digits, '0')) {
            return '+62'.substr($digits, 1);
        }
        if (str_starts_with($digits, '62')) {
            return '+'.$digits;
        }

        return '+62'.$digits;
    }
}
