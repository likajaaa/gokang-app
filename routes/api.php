<?php

use App\Http\Controllers\Api\AddressController;
use App\Http\Controllers\Api\Admin\OrderTransitionController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\ChatController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\AreaController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\TukangController;
use App\Http\Controllers\Api\VoucherController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes - v1
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {

    // ================== AUTH ==================
    Route::prefix('auth')->group(function () {

        // Public — Registrasi
        Route::prefix('register')->group(function () {
            Route::post('send-otp', [AuthController::class, 'sendRegisterOtp']);
            Route::post('verify-otp', [AuthController::class, 'verifyRegisterOtp']);
            Route::post('complete', [AuthController::class, 'completeRegistration']);
        });

        // Public — Login
        Route::prefix('login')->group(function () {
            Route::post('send-otp', [AuthController::class, 'sendLoginOtp']);
            Route::post('verify-otp', [AuthController::class, 'verifyLoginOtp']);
        });

        // Protected
        Route::middleware('auth:sanctum')->group(function () {
            Route::post('logout', [AuthController::class, 'logout']);
            Route::get('me', [AuthController::class, 'me']);
        });
    });


    // ================== PUBLIC DATA ==================
    // Services (17 Jagoan)
    Route::get('services', [ServiceController::class, 'index']);
    Route::get('services/{idOrSlug}', [ServiceController::class, 'show']);

    // Areas (Jabodetabek)
    Route::get('areas/cities', [AreaController::class, 'cities']);
    Route::get('areas/districts', [AreaController::class, 'districts']);
    Route::get('areas/check', [AreaController::class, 'check']);

    // Tukang Reviews (public)
    Route::get('tukang/{tukangId}/reviews', [ReviewController::class, 'index']);


    // ================== PROTECTED ==================
    Route::middleware('auth:sanctum')->group(function () {

        // Addresses
        Route::get('addresses', [AddressController::class, 'index']);
        Route::post('addresses', [AddressController::class, 'store']);
        Route::get('addresses/{id}', [AddressController::class, 'show']);
        Route::put('addresses/{id}', [AddressController::class, 'update']);
        Route::delete('addresses/{id}', [AddressController::class, 'destroy']);
        Route::put('addresses/{id}/set-default', [AddressController::class, 'setDefault']);

        // Orders
        Route::get('orders', [OrderController::class, 'index']);
        Route::post('orders/daily-tukang', [OrderController::class, 'createDailyTukang']);
        Route::get('orders/{id}', [OrderController::class, 'show']);
        Route::post('orders/{id}/cancel', [OrderController::class, 'cancel']);
        Route::post('orders/{id}/review', [ReviewController::class, 'store']);
        Route::post('orders/{id}/simulate-payment', [OrderController::class, 'simulatePayment']);

        // ================== ADMIN ORDER TRANSITIONS ==================
        // Admin role check di-handle di tiap method controller (User::isAdmin()).
        Route::prefix('admin/orders/{id}')->group(function () {
            Route::post('start-survey', [OrderTransitionController::class, 'startSurvey']);
            Route::post('complete-survey', [OrderTransitionController::class, 'completeSurvey']);
            Route::post('assign-tukang', [OrderTransitionController::class, 'assignTukang']);
            Route::post('mark-work-complete', [OrderTransitionController::class, 'markWorkComplete']);
            Route::post('complete-final-payment', [OrderTransitionController::class, 'completeFinalPayment']);
            Route::post('reject', [OrderTransitionController::class, 'rejectOrder']);
        });

        // Booking (form-based intake)
        Route::prefix('booking')->group(function () {
            Route::post('borongan/rumah', [BookingController::class, 'createBoronganRumah']);
            Route::post('borongan/bisnis', [BookingController::class, 'createBoronganBisnis']);
            Route::post('tukang-harian', [BookingController::class, 'createTukangHarian']);
            Route::post('perbaikan-material', [BookingController::class, 'createPerbaikanMaterial']);
        });

        // Notifications (mark-all-read harus sebelum {id}/read)
        Route::get('notifications', [NotificationController::class, 'index']);
        Route::post('notifications/mark-all-read', [NotificationController::class, 'markAllRead']);
        Route::post('notifications/{id}/read', [NotificationController::class, 'markRead']);
        Route::post('notifications/fcm-token', [NotificationController::class, 'updateFcmToken']);

        // Chat
        Route::get('chats', [ChatController::class, 'index']);
        Route::get('chats/{orderId}/messages', [ChatController::class, 'messages']);
        Route::post('chats/{orderId}/messages', [ChatController::class, 'send']);
        Route::post('chats/{orderId}/mark-read', [ChatController::class, 'markRead']);

        // Payments
        Route::get('payments/{orderId}', [PaymentController::class, 'show']);

        // ================== VOUCHERS ==================
        Route::get('vouchers', [VoucherController::class, 'index']);
        Route::get('vouchers/wallet', [VoucherController::class, 'wallet']);
        Route::post('vouchers/redeem', [VoucherController::class, 'redeem']);
        Route::post('vouchers/validate', [VoucherController::class, 'check']);

        // ================== TUKANG ==================
        Route::prefix('tukang')->group(function () {
            Route::get('orders/available', [TukangController::class, 'availableOrders']);
            Route::post('orders/{assignmentId}/accept', [TukangController::class, 'acceptAssignment']);
            Route::post('orders/{assignmentId}/reject', [TukangController::class, 'rejectAssignment']);
            Route::post('orders/{orderId}/on-the-way', [TukangController::class, 'onTheWay']);
            Route::post('orders/{orderId}/arrived', [TukangController::class, 'arrived']);
            Route::post('orders/{orderId}/start-working', [TukangController::class, 'startWorking']);
            Route::post('orders/{orderId}/complete', [TukangController::class, 'complete']);
            Route::put('online-status', [TukangController::class, 'updateOnlineStatus']);
        });
    });


    // ================== PAYMENT ENDPOINTS (PUBLIC / WEBHOOK) ==================
    // Mock success untuk development (no auth, but gated by config)
    Route::get('payments/mock-success/{paymentId}', [PaymentController::class, 'mockSuccess']);

    // Midtrans webhook (signed, no auth)
    Route::post('payments/webhook/midtrans', [PaymentController::class, 'midtransWebhook']);

});
