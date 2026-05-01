# 🚀 Backend Setup Guide (v2)

Panduan setup Laravel 13 backend GoKang Clone — fase 1 lengkap (Auth + Order flow).

---

## 📋 Prerequisites

- **PHP 8.3+** (wajib untuk Laravel 13)
- Composer 2.x
- MySQL 8.0
- Redis (opsional, untuk queue)

```bash
php -v    # Harus >= 8.3
```

---

## 🎬 Step 1: Init Laravel Project

```bash
# Otomatis install Laravel 13 (versi terbaru)
composer create-project laravel/laravel gokang-backend
cd gokang-backend

php artisan --version   # Verifikasi: "Laravel Framework 13.x.x"

# Packages
composer require laravel/sanctum
composer require intervention/image
composer require midtrans/midtrans-php
```

---

## 🎬 Step 2: Copy Files dari Folder `backend/`

Copy semua file ke project Laravel kamu, replace yang sudah ada:

```
app/
├── Http/
│   ├── Controllers/Api/
│   │   ├── AuthController.php
│   │   ├── ServiceController.php
│   │   ├── AreaController.php
│   │   ├── AddressController.php
│   │   ├── OrderController.php
│   │   └── PaymentController.php
│   ├── Requests/
│   │   ├── AddressRequest.php
│   │   ├── Auth/
│   │   │   ├── SendOtpRequest.php
│   │   │   ├── VerifyOtpRequest.php
│   │   │   └── CompleteRegistrationRequest.php
│   │   └── Order/
│   │       ├── CreateDailyOrderRequest.php
│   │       └── CancelOrderRequest.php
│   └── Resources/
│       ├── UserResource.php
│       ├── ServiceResource.php
│       ├── AddressResource.php
│       ├── OrderResource.php
│       └── OrderItemResource.php
├── Models/
│   ├── User.php, Customer.php, Tukang.php
│   ├── Service.php, Area.php, Address.php
│   ├── Order.php, OrderItem.php, OrderAssignment.php
│   ├── OrderStatusLog.php, OrderMaterial.php, OrderPhoto.php
│   ├── Payment.php, Review.php
│   ├── ChatMessage.php, Notification.php
│   └── OtpVerification.php
├── Services/
│   ├── OtpService.php
│   ├── OrderService.php
│   ├── PaymentService.php
│   └── NotificationService.php
└── Traits/
    └── ApiResponse.php

config/
└── gokang.php

database/
├── migrations/*    (12 files)
└── seeders/*       (4 files)

routes/
└── api.php
```

---

## 🎬 Step 3: Configure `.env`

```env
APP_NAME="GoKang Clone"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=gokang_clone
DB_USERNAME=root
DB_PASSWORD=

# Sanctum
SANCTUM_STATEFUL_DOMAINS=localhost,127.0.0.1

# GoKang config
GOKANG_PAYMENT_MOCK=true
GOKANG_COMMISSION_RATE=15
GOKANG_PAYMENT_TIMER_MINUTES=60
```

---

## 🎬 Step 4: Database Setup

```bash
mysql -u root -p
CREATE DATABASE gokang_clone;
EXIT;

php artisan key:generate
php artisan install:api        # Setup Sanctum untuk Laravel 13
php artisan migrate:fresh --seed
```

**Expected output setelah seed:**
- 1 admin user (`+6281111111111`, password `password`)
- 17 services (Jagoan Cat, Keramik, dll) dengan 3-session pricing
- 49 areas (5 kota + 44 kecamatan Jabodetabek)
- 17 app_settings

---

## 🎬 Step 5: Jalankan Server

```bash
php artisan serve
```

API live di `http://localhost:8000/api/v1/...`

---

## 🧪 Step 6: End-to-End Test Flow

### Test 1: Register & Login

```bash
# Send OTP registrasi (pakai nomor test, OTP auto = 123456)
curl -X POST http://localhost:8000/api/v1/auth/register/send-otp \
  -H "Content-Type: application/json" -H "Accept: application/json" \
  -d '{"phone": "+6281234567890"}'

# Verify OTP
curl -X POST http://localhost:8000/api/v1/auth/register/verify-otp \
  -H "Content-Type: application/json" -H "Accept: application/json" \
  -d '{"phone": "+6281234567890", "otp": "123456"}'

# Complete registration → dapat TOKEN
curl -X POST http://localhost:8000/api/v1/auth/register/complete \
  -H "Content-Type: application/json" -H "Accept: application/json" \
  -d '{"phone": "+6281234567890", "name": "Sari Wijaya", "email": "sari@test.com"}'
```

Simpan token dari response. Pakai di test berikutnya:
```bash
export TOKEN="2|abc123xyz..."
```

### Test 2: Lihat List Services (17 Jagoan)

```bash
curl -X GET http://localhost:8000/api/v1/services \
  -H "Accept: application/json"
```

Expected: 17 services dengan 3 sesi pricing (`full_day`, `morning`, `afternoon`).

### Test 3: Tambah Alamat

```bash
curl -X POST http://localhost:8000/api/v1/addresses \
  -H "Accept: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "label": "Rumah",
    "recipient_name": "Sari Wijaya",
    "recipient_phone": "+6281234567890",
    "full_address": "Jalan Australia Boulevard No. 2, Cipondoh, Kota Tangerang",
    "address_note": "Depan Asinan Merem Melek",
    "postal_code": "15140",
    "lat": -6.1702,
    "lng": 106.7065,
    "is_default": true
  }'
```

Simpan `address.id` dari response.

### Test 4: Buat Order Tukang Harian (Multi-Item!)

Ini **contoh persis flow di screenshot** — order dengan multiple items & sessions:

```bash
curl -X POST http://localhost:8000/api/v1/orders/daily-tukang \
  -H "Accept: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "address_id": 1,
    "problem_description": "Mau cat dinding yang masih polos",
    "terms_accepted": true,
    "items": [
      {
        "service_id": 1,
        "quantity": 1,
        "start_date": "2026-05-30",
        "end_date": "2026-05-30",
        "session": "morning",
        "include_material": false
      }
    ]
  }'
```

Expected response:
```json
{
  "success": true,
  "message": "Pesanan berhasil dibuat. Silakan lakukan pembayaran.",
  "data": {
    "order": {
      "order_code": "KNG-2026-0001",
      "status": "pending_payment",
      "pricing": {
        "subtotal": 199000,
        "total": 199000
      },
      "payment": {
        "status": "pending",
        "expires_in_seconds": 3599
      }
    },
    "payment_url": "http://localhost:8000/api/v1/payments/mock-success/1"
  }
}
```

### Test 5: MOCK PAYMENT — Bayar Order

```bash
curl http://localhost:8000/api/v1/payments/mock-success/1
```

Ini akan:
- ✅ Mark payment sebagai `success`
- ✅ Update order status → `paid` → `searching_tukang`
- ✅ Buat `order_assignments` record untuk tiap order_item
- ✅ Trigger auto-assign tukang (kalau ada tukang online)

### Test 6: Cek Order Detail

```bash
curl -X GET http://localhost:8000/api/v1/orders/1 \
  -H "Accept: application/json" \
  -H "Authorization: Bearer $TOKEN"
```

Perhatikan status berubah & items ter-load.

### Test 7: Test Multi-Item Order

Order dengan **2 jenis tukang berbeda, tanggal berbeda**:

```bash
curl -X POST http://localhost:8000/api/v1/orders/daily-tukang \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "address_id": 1,
    "problem_description": "Renovasi ringan kamar mandi",
    "terms_accepted": true,
    "items": [
      {
        "service_id": 2,
        "quantity": 2,
        "start_date": "2026-06-01",
        "end_date": "2026-06-03",
        "session": "full_day"
      },
      {
        "service_id": 7,
        "quantity": 1,
        "start_date": "2026-06-02",
        "end_date": "2026-06-02",
        "session": "morning"
      }
    ]
  }'
```

Perhitungan total:
- Item 1: 2 tukang Keramik × 3 hari × Rp 264.000 = Rp 1.584.000
- Item 2: 1 tukang Pipa × 1 hari × Rp 239.000 = Rp 239.000
- **Total: Rp 1.823.000**

---

## 🛠️ Useful Commands

```bash
# Reset database dari awal
php artisan migrate:fresh --seed

# Tinker untuk test model
php artisan tinker
>>> App\Models\Service::count()       // 17
>>> App\Models\Area::count()          // 49
>>> App\Models\Service::first()->getPriceBySession('morning')

# Cek routes
php artisan route:list --path=api/v1
```

---

## 🐛 Troubleshooting

### `Target class [OrderController] does not exist`
Pastikan semua file di `app/Http/Controllers/Api/` sudah di-copy.

### `Class "Laravel\Sanctum\HasApiTokens" not found`
```bash
composer require laravel/sanctum
php artisan install:api
```

### Error saat `migrate:fresh`
Hapus database, buat ulang, lalu run `migrate:fresh --seed`.

### `config('gokang.xxx')` return null
Clear cache: `php artisan config:clear`.

---

## ✅ Next Steps

Setelah Fase 1 berjalan, yang perlu ditambahkan di **Fase 2**:

### Backend
- `TukangController` — registrasi tukang, accept/reject order, update status pekerjaan (on_the_way, arrived, in_progress, completed)
- `VoucherController` — validate & apply voucher
- `ReviewController` — rating & review setelah order selesai
- `ChatController` — in-app chat antara customer & tukang
- `NotificationController` — list & mark-read notif
- Laravel Filament (admin dashboard)
- Midtrans real integration (ganti mock payment)
- Firebase Cloud Messaging untuk push notif

### Mobile
- Expo project setup
- Auth screens (register, OTP, login)
- Home screen + list Jagoan
- Form booking (multi-item, sesuai flow di screenshot)
- Order tracking

---

**Rekomendasi**: lanjutkan di VS Code dengan Claude Code. Prompt berikut sudah cukup untuk Claude Code generate semua Fase 2:

> "Baca CLAUDE.md, CLAUDE-CONTEXT.md, docs/database/erd.md (v2), docs/api/endpoints.md, dan semua file di app/. Lanjutkan generate: TukangController dengan flow accept/reject/update-status, VoucherController dengan validate endpoint, ReviewController, ChatController, dan NotificationController. Ikuti pattern AuthController dan OrderController yang sudah ada."
