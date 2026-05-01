# API Endpoints — GoKang Clone

Base URL: `https://api.gokangclone.com/api/v1`
Authentication: **Bearer Token** (Laravel Sanctum)

---

## Response Format

### Success
```json
{
  "success": true,
  "message": "Optional message",
  "data": { ... }
}
```

### Error
```json
{
  "success": false,
  "message": "Error description",
  "errors": {
    "field_name": ["Error message"]
  }
}
```

### Pagination
```json
{
  "success": true,
  "data": [...],
  "meta": {
    "current_page": 1,
    "last_page": 10,
    "per_page": 20,
    "total": 200
  }
}
```

---

## 1. Authentication

### POST `/auth/register/send-otp`
Kirim OTP ke nomor HP untuk registrasi.

**Request:**
```json
{ "phone": "+6281234567890" }
```

**Response:**
```json
{
  "success": true,
  "message": "OTP telah dikirim ke WhatsApp",
  "data": { "expires_in": 300 }
}
```

### POST `/auth/register/verify-otp`
Verifikasi OTP.

**Request:**
```json
{
  "phone": "+6281234567890",
  "otp": "123456"
}
```

### POST `/auth/register/complete`
Complete registrasi customer.

**Request:**
```json
{
  "phone": "+6281234567890",
  "name": "Sari Wijaya",
  "email": "sari@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": { "id": 1, "name": "Sari Wijaya", "phone": "..." },
    "token": "1|abc123xyz..."
  }
}
```

### POST `/auth/login/send-otp`
Kirim OTP untuk login.

### POST `/auth/login/verify-otp`
Verifikasi OTP login.

### POST `/auth/logout` 🔒
Logout (invalidate token).

### GET `/auth/me` 🔒
Get current user info.

---

## 2. User Profile

### GET `/profile` 🔒
Get detail profil user.

### PUT `/profile` 🔒
Update profil.

**Request:**
```json
{
  "name": "Sari Wijaya",
  "email": "sari@example.com",
  "date_of_birth": "1988-05-10",
  "gender": "female"
}
```

### POST `/profile/avatar` 🔒
Upload foto profil (multipart).

---

## 3. Addresses

### GET `/addresses` 🔒
List alamat user.

### POST `/addresses` 🔒
Tambah alamat.

**Request:**
```json
{
  "label": "Rumah",
  "recipient_name": "Sari Wijaya",
  "recipient_phone": "+6281234567890",
  "full_address": "Jl. Merdeka No. 10",
  "detail": "RT 01/RW 02, depan masjid",
  "area_id": 42,
  "lat": -6.2088,
  "lng": 106.8456,
  "is_default": true
}
```

### PUT `/addresses/{id}` 🔒
Update alamat.

### DELETE `/addresses/{id}` 🔒

### PUT `/addresses/{id}/set-default` 🔒

---

## 4. Services (Jenis Jagoan)

### GET `/services`
List semua service (public).

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "code": "JAGOAN_CAT",
      "name": "Jagoan Cat",
      "description": "Bantu cat dinding, plafon...",
      "icon_url": "https://.../cat.svg",
      "price_full_day": 259000,
      "price_half_day": 199000
    }
  ]
}
```

### GET `/services/{id}`
Detail service.

---

## 5. Areas

### GET `/areas/cities`
List kota (Jakarta, Bogor, Depok, Tangerang, Bekasi).

### GET `/areas/districts?city_id=1`
List kecamatan dalam kota.

### GET `/areas/check?lat=-6.2&lng=106.8`
Cek apakah lokasi dilayani.

---

## 6. Orders (Customer)

### POST `/orders/daily-tukang` 🔒
Buat order Tukang Harian.

**Request:**
```json
{
  "service_id": 1,
  "duration": "full_day",
  "quantity": 2,
  "address_id": 10,
  "scheduled_date": "2026-04-21",
  "scheduled_time": "08:00",
  "notes": "Pintu depan perlu dicat ulang",
  "voucher_code": "HEMAT50",
  "include_material": false
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "order": {
      "id": 100,
      "order_code": "KNG-2026-0100",
      "status": "pending",
      "total": 518000
    },
    "payment_url": "https://app.midtrans.com/..."
  }
}
```

### POST `/orders/borongan/survey` 🔒
Submit form survey borongan (lihat Image 2 & 3).

**Request:**
```json
{
  "source": "instagram",
  "building_type": "rumah",
  "description": "Bocor di plafon kamar, cat pudar",
  "photos": ["photo_1.jpg", "photo_2.jpg"],
  "address_id": 10,
  "scheduled_at": "2026-04-22T10:00:00Z",
  "budget_range": "10-25jt",
  "promo_code": "SURVEY60"
}
```

### GET `/orders` 🔒
List order user (customer atau tukang).

**Query:** `status`, `page`, `per_page`

### GET `/orders/{id}` 🔒
Detail order.

### POST `/orders/{id}/cancel` 🔒
Cancel order.

**Request:**
```json
{ "reason": "Berubah rencana" }
```

### POST `/orders/{id}/confirm-completion` 🔒
Customer konfirmasi pekerjaan selesai.

---

## 7. Orders (Tukang)

### GET `/tukang/orders/available` 🔒
List order yang broadcast ke tukang ini.

### POST `/tukang/orders/{id}/accept` 🔒
Accept order.

### POST `/tukang/orders/{id}/reject` 🔒
Reject order.

### POST `/tukang/orders/{id}/on-the-way` 🔒
Mark "berangkat".

### POST `/tukang/orders/{id}/arrived` 🔒
Mark "tiba di lokasi" (validasi GPS).

### POST `/tukang/orders/{id}/start-working` 🔒
Mulai kerja.

### POST `/tukang/orders/{id}/complete` 🔒
Selesaikan kerja + upload foto hasil.

**Request (multipart):**
```json
{
  "photos": [...], // file array
  "notes": "Semua selesai, bocor sudah tertangani"
}
```

### POST `/tukang/orders/{id}/materials` 🔒
Submit list material (untuk Layanan + Material).

**Request:**
```json
{
  "materials": [
    { "name": "Cat Dulux 2.5L", "quantity": 2, "unit": "kaleng", "price": 250000 },
    { "name": "Kuas 3 inch", "quantity": 1, "unit": "pcs", "price": 25000 }
  ],
  "receipt_photo": "receipt.jpg"
}
```

---

## 8. Payments

### GET `/payments/{order_id}` 🔒
Get payment info order.

### POST `/payments/{order_id}/retry` 🔒
Retry payment.

### POST `/payments/webhook/midtrans` 🌐
Webhook dari Midtrans (public, signature verified).

---

## 9. Vouchers

### GET `/vouchers` 🔒
List voucher yang bisa dipakai user.

### POST `/vouchers/validate` 🔒
Validasi voucher sebelum apply.

**Request:**
```json
{
  "code": "HEMAT50",
  "service_id": 1,
  "subtotal": 518000
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "voucher": {...},
    "discount_amount": 50000,
    "final_total": 468000
  }
}
```

---

## 10. Reviews

### POST `/orders/{id}/review` 🔒
Kirim review (customer).

**Request:**
```json
{
  "rating": 5,
  "tags": ["tepat_waktu", "rapi"],
  "review": "Bang Madi ramah banget, hasil kerjanya rapi!",
  "photos": ["photo_after.jpg"]
}
```

### GET `/tukang/{id}/reviews`
Public - list review tukang.

---

## 11. Chat

### GET `/chats` 🔒
List chat user.

### GET `/chats/{order_id}/messages` 🔒
List messages per order.

### POST `/chats/{order_id}/messages` 🔒
Kirim pesan.

**Request:**
```json
{ "message": "Halo Bang, udah di lokasi?" }
```

### POST `/chats/{order_id}/mark-read` 🔒

---

## 12. Notifications

### GET `/notifications` 🔒
List notifikasi.

### POST `/notifications/{id}/read` 🔒

### POST `/notifications/mark-all-read` 🔒

### POST `/notifications/fcm-token` 🔒
Register FCM token.

---

## 13. Tukang Specific

### POST `/tukang/register` 🌐
Daftar sebagai tukang (multi-step).

**Step 1: basic info**
**Step 2: keahlian**
**Step 3: upload dokumen**
**Step 4: bank account**

### GET `/tukang/profile` 🔒
Get profil tukang lengkap.

### PUT `/tukang/online-status` 🔒
Toggle online/offline.

**Request:**
```json
{ "is_online": true, "lat": -6.2, "lng": 106.8 }
```

### PUT `/tukang/location` 🔒
Update GPS real-time (saat online).

### GET `/tukang/earnings` 🔒
Summary penghasilan.

### GET `/tukang/earnings/history` 🔒
Riwayat transaksi earning.

### POST `/tukang/payouts` 🔒
Request pencairan.

**Request:**
```json
{ "amount": 500000 }
```

### GET `/tukang/payouts` 🔒
Riwayat pencairan.

---

## 14. Uploads

### POST `/uploads/image` 🔒
Upload image umum (multipart).

**Response:**
```json
{
  "success": true,
  "data": { "url": "https://.../image.jpg", "path": "uploads/xyz.jpg" }
}
```

### POST `/uploads/document` 🔒
Upload dokumen private (KTP, dll).

---

## 15. Content

### GET `/banners`
List banner aktif di home.

### GET `/articles`
List artikel blog (paginated).

### GET `/articles/{slug}`
Detail artikel.

### GET `/faqs`
List FAQ.

---

## 16. Misc

### GET `/app/config`
Get app config publik (min version, maintenance mode, dll).

### POST `/support/contact`
Submit form kontak CS.

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 204 | No content (delete) |
| 400 | Bad request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not found |
| 422 | Validation error |
| 429 | Too many requests |
| 500 | Server error |
| 503 | Service unavailable (maintenance) |

---

## Rate Limiting

- Unauthenticated: 30 req/min
- Authenticated: 60 req/min
- OTP endpoints: 5 req/hour per phone
- Webhook: unlimited (signed)

---

## Legend

🔒 = Requires authentication
🌐 = Public endpoint
