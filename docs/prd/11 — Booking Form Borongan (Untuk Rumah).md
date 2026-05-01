# PRD 11 — Booking Form Borongan (Untuk Rumah)

> Form pemesanan layanan borongan full service untuk rumah: upload foto masalah, pilih tanggal survey, budget, dan detail proyek.
> Referensi visual: screenshot form GoKang "Untuk Rumah".

---

## 1. Overview

Form ini muncul setelah user tap card **"Untuk Rumah"** di home screen (kategori Borongan Full Service).

**Flow:**
```
Home → Tap "Untuk Rumah" → Booking Form (scroll panjang) → Submit → Payment → Order Created
```

**Tujuan form:**
- Kumpulkan info proyek: foto masalah, alamat, tanggal survey, budget, deskripsi
- User pilih jenis bangunan (Rumah/Apartment/Ruko)
- User dapat apply promo code
- Upsell promo survey 60% discount

---

## 2. Screen Layout — Booking Form (Borongan Rumah)

### 2.1 Header (Sticky)

```
┌────────────────────────────────────────────┐
│ ← Butuh Jasa Tukang + Material?           │
│   GoKang Solusi tepat untuk rumahmu!      │
└────────────────────────────────────────────┘
```

**Spec:**
- Background: putih
- Border bottom: 1px #E5E7EB
- Back button (←): navigate back ke home
- Title: "Butuh Jasa Tukang + Material?"
  - Font: Poppins_700Bold, 20px, hitam
- Subtitle: "GoKang Solusi tepat untuk rumahmu!"
  - Font: Poppins_400Regular, 14px, abu #6B7280

---

### 2.2 Section: Upload Foto Masalah

```
┌────────────────────────────────────────────┐
│ 📷 Masukkan Foto Masalah*                  │
│    Maksimal foto diupload adalah 10 foto   │
│                                            │
│  ┌──────────────┐  ┌──────────────┐       │
│  │ 🖼️ Pilih dari │  │ 📷 Buka      │       │
│  │   galeri     │  │   kamera     │       │
│  └──────────────┘  └──────────────┘       │
│                                            │
│  [Preview foto yang sudah dipilih]         │
│  [Foto 1] [Foto 2] [Foto 3] ... max 10     │
└────────────────────────────────────────────┘
```

**Label:**
- Icon: 📷 (merah #E8272A)
- Text: "Masukkan Foto Masalah" + asterisk merah
- Subtext: "Maksimal foto diupload adalah 10 foto"
  - Font: Poppins_400Regular, 13px, abu italic

**Buttons (horizontal row):**

Button 1 — "Pilih dari galeri":
- Background: putih
- Border: 2px solid #E8272A
- Text: merah, Poppins_600SemiBold, 14px
- Icon: 🖼️ (image icon) kiri
- Height: 48px
- Border radius: 24px (pill)
- Flex: 1
- onPress: buka image picker (expo-image-picker) dengan option multiple (max 10)

Button 2 — "Buka kamera":
- Sama style dengan Button 1
- Icon: 📷 (camera icon)
- onPress: buka camera (expo-image-picker camera mode)

**Photo Preview Grid:**
- Grid layout: 3 kolom
- Setiap foto: 100x100px, rounded-lg, border 1px abu
- Max 10 foto
- Setiap foto punya icon X kecil di pojok kanan atas untuk hapus
- Kalau belum ada foto: tidak tampil grid

**Validasi:**
- Required: minimal 1 foto
- Max: 10 foto
- Error message: "Minimal upload 1 foto masalah"

---

### 2.3 Section: Alamat Survey

```
┌────────────────────────────────────────────┐
│ 📍 Alamat Survey*                          │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │ Tentukan alamat survey             → │ │
│  └──────────────────────────────────────┘ │
└────────────────────────────────────────────┘
```

**Label:**
- Icon: 📍 (map pin) merah
- Text: "Alamat Survey" + asterisk merah
- Font: Poppins_600SemiBold, 16px

**Input Field:**
- Height: 56px
- Border: 1.5px solid #D1D5DB
- Border radius: 12px
- Padding: 16px
- Placeholder: "Tentukan alamat survey"
- Font: Poppins_400Regular, 14px, abu
- Chevron kanan (→) di dalam field
- onPress: navigate ke Address Picker screen (Google Maps / manual input)
  - User bisa pilih dari alamat tersimpan
  - Atau input alamat baru
  - Atau pin point di map

**Validasi:**
- Required
- Error: "Alamat survey wajib diisi"

---

### 2.4 Section: Tanggal Survey

```
┌────────────────────────────────────────────┐
│ ⏰ Tanggal Survey*                         │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │   Pilih Tanggal & Waktu              │ │
│  └──────────────────────────────────────┘ │
└────────────────────────────────────────────┘
```

**Label:**
- Icon: ⏰ (alarm clock) merah
- Text: "Tanggal Survey" + asterisk
- Font: Poppins_600SemiBold, 16px

**Button:**
- Background: putih
- Border: 2px solid #E8272A
- Text: "Pilih Tanggal & Waktu" (merah, bold)
  - Setelah dipilih: tampilkan tanggal terpilih, misal "Senin, 22 Mei 2025 • 10:00 WIB"
- Height: 56px
- Border radius: 28px (pill)
- Full width
- onPress: buka Date Time Picker modal
  - Step 1: pilih tanggal (calendar)
  - Step 2: pilih waktu (time picker)
  - Min date: besok (tidak bisa hari ini atau kemarin)
  - Max date: 30 hari dari sekarang

**Validasi:**
- Required
- Error: "Tanggal survey wajib dipilih"

---

### 2.5 Section: Budget

```
┌────────────────────────────────────────────┐
│ 💰 Budget yang kamu siapkan*               │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │ Pilih budget                       → │ │
│  └──────────────────────────────────────┘ │
└────────────────────────────────────────────┘
```

**Label:**
- Icon: 💰 (money bag) merah
- Text: "Budget yang kamu siapkan" + asterisk
- Font: Poppins_600SemiBold, 16px

**Dropdown Field:**
- Height: 56px
- Border: 1.5px solid #D1D5DB
- Border radius: 12px
- Placeholder: "Pilih budget"
- Chevron kanan (→)
- onPress: buka bottom sheet dengan options:

Options:
```
• < Rp 5 juta
• Rp 5 juta - Rp 10 juta
• Rp 10 juta - Rp 20 juta
• Rp 20 juta - Rp 50 juta
• > Rp 50 juta
• Belum tahu (konsultasi dulu)
```

Setelah pilih: tampilkan text pilihan di field.

**Validasi:**
- Required
- Error: "Budget wajib dipilih"

---

### 2.6 Section: Kode Pesanan (Optional)

```
┌────────────────────────────────────────────┐
│ 🎫 Kode Pesanan                            │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │ Masukkan kode pesanan bila ada       │ │
│  └──────────────────────────────────────┘ │
└────────────────────────────────────────────┘
```

**Label:**
- Icon: 🎫 (ticket) merah
- Text: "Kode Pesanan" (tanpa asterisk — optional)
- Font: Poppins_600SemiBold, 16px

**Input:**
- Text input biasa
- Placeholder: "Masukkan kode pesanan bila ada"
- Optional — user bisa skip

**Logic:**
- Kalau user punya voucher/promo code dari CS, bisa input di sini
- Backend validate code saat submit
- Kalau valid: apply discount
- Kalau invalid: tampilkan error "Kode tidak valid"

---

### 2.7 Section: Promo Survey Banner

```
┌────────────────────────────────────────────┐
│  ╔══════════════════════════════════════╗  │
│  ║ Promo Survey 60%              ✓      ║  │
│  ║ Rp250.000                            ║  │
│  ║ Rp100.000    Lanjut Pembayaran →     ║  │
│  ╚══════════════════════════════════════╝  │
│                                            │
│  Termasuk:                                 │
│  ✅ Diskusi dengan ahli bangunan           │
│  ✅ Penawaran pekerjaan dengan harga       │
│     terbaik                                │
│                                            │
│  Disclamer:                                │
│  ⛔ Harap menyiapkan tanggal, karena       │
│     konsultan tidak membawa tanggal saat   │
│     survey                                 │
└────────────────────────────────────────────┘
```

**Banner Card:**
- Background: gradient abu terang ke putih
- Border: 1px solid #E5E7EB
- Border radius: 16px
- Padding: 16px

**Content:**

Row 1:
- "Promo Survey 60%" — bold hitam 16px
- Icon checkmark hijau di kanan (✓)

Row 2:
- "Rp250.000" — strikethrough, abu #9CA3AF, 14px
- "Rp100.000" — merah #E8272A, bold, 20px
- Button "Lanjut Pembayaran →" — merah, rounded-full, padding 12px 20px
  - onPress: validate form → navigate ke payment screen

**Termasuk (checklist):**
- Icon ✅ hijau
- Text: Poppins_400Regular, 14px, abu
- 2 items dalam list

**Disclamer:**
- Icon ⛔ merah
- Text: Poppins_400Regular, 13px, abu #6B7280, italic
- Margin top: 12px

---

### 2.8 Section: Tahu GoKang dari mana? (Di atas, scroll position awal)

```
┌────────────────────────────────────────────┐
│ 📢 Tahu GoKang dari mana?*                 │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │ Pilih sumber informasi             → │ │
│  └──────────────────────────────────────┘ │
└────────────────────────────────────────────┘
```

**Label:**
- Icon: 📢 (megaphone) merah
- Text: "Tahu GoKang dari mana?" + asterisk
- Font: Poppins_600SemiBold, 16px

**Dropdown:**
- Height: 56px
- Border: 1.5px #D1D5DB
- Placeholder: "Pilih sumber informasi"
- Options:
  - Instagram
  - Facebook
  - Teman/Keluarga
  - Google Search
  - TikTok
  - WhatsApp
  - Lainnya

---

### 2.9 Section: Jenis Bangunan

```
┌────────────────────────────────────────────┐
│ 🏠 Jenis Bangunan*                         │
│                                            │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│  │🏢Apartment│ │🏢 Ruko  │ │🏠 Rumah  │   │
│  └──────────┘ └──────────┘ └──────────┘   │
└────────────────────────────────────────────┘
```

**Label:**
- Icon: 🏠 merah
- Text: "Jenis Bangunan" + asterisk
- Font: Poppins_600SemiBold, 16px

**Chips (3 horizontal):**
- Layout: row, gap 12px
- Setiap chip:
  - Height: 56px
  - Flex: 1 (equal width)
  - Border: 1.5px solid #D1D5DB
  - Border radius: 12px
  - Active: border merah #E8272A, background #FEE2E2 (pink terang)
  - Inactive: border abu, background putih
  - Icon: building icon (🏢 atau 🏠)
  - Text: "Apartment" / "Ruko" / "Rumah"
  - Font: Poppins_600SemiBold, 14px

**Validasi:**
- Required: harus pilih 1
- Error: "Jenis bangunan wajib dipilih"

---

### 2.10 Section: Perbaikan/Pekerjaan

```
┌────────────────────────────────────────────┐
│ 🔧 Perbaikan/pekerjaan bangunan yang       │
│    dibutuhkan                              │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │                                      │ │
│  │ Isi dengan jelas                     │ │
│  │                                      │ │
│  │                                      │ │
│  └──────────────────────────────────────┘ │
└────────────────────────────────────────────┘
```

**Label:**
- Icon: 🔧 (wrench) merah
- Text: "Perbaikan/pekerjaan bangunan yang dibutuhkan"
- Font: Poppins_600SemiBold, 16px
- Tanpa asterisk — optional tapi recommended

**Textarea:**
- Height: 120px (multiline)
- Border: 1.5px solid #D1D5DB
- Border radius: 12px
- Padding: 16px
- Placeholder: "Isi dengan jelas"
- Font: Poppins_400Regular, 14px
- Max length: 500 karakter
- Character counter: "{charCount}/500" di bawah

---

### 2.11 Bottom CTA (Sticky Bottom)

```
┌────────────────────────────────────────────┐
│  ┌──────────────────────────────────────┐  │
│  │      Lanjut ke Pembayaran        →   │  │
│  └──────────────────────────────────────┘  │
└────────────────────────────────────────────┘
```

**Button:**
- Background: #E8272A (merah)
- Text: "Lanjut ke Pembayaran →" putih, Poppins_700Bold, 16px
- Height: 56px
- Border radius: 28px (pill)
- Full width (padding 16px kiri-kanan)
- Shadow: medium
- Position: sticky bottom (safe area + 16px padding)
- Disabled state: opacity 50% + background abu
  - Disabled kalau ada field required yang belum diisi

**onPress:**
1. Validate semua field required
2. Kalau ada error: scroll ke field pertama yang error + tampilkan error message
3. Kalau valid: submit data ke backend
4. Backend create order draft (status: pending_payment)
5. Navigate ke Payment screen dengan order_id

---

## 3. Form Validation Rules

| Field | Required | Validation |
|---|---|---|
| Foto masalah | ✅ | Min 1, max 10 foto |
| Alamat survey | ✅ | Tidak boleh kosong |
| Tanggal survey | ✅ | Min besok, max 30 hari |
| Budget | ✅ | Harus pilih 1 option |
| Kode pesanan | ❌ | Optional, validate di backend kalau diisi |
| Tahu dari mana | ✅ | Harus pilih 1 option |
| Jenis bangunan | ✅ | Harus pilih 1 chip |
| Deskripsi pekerjaan | ❌ | Optional, max 500 char |

---

## 4. API Integration

### 4.1 Submit Booking Form

**POST /api/v1/orders/borongan/create**

Request body:
```json
{
  "order_type": "borongan",
  "category": "rumah",
  "photos": [
    "base64_string_photo_1",
    "base64_string_photo_2"
  ],
  "address_id": 123,
  "survey_date": "2025-05-22",
  "survey_time": "10:00",
  "budget_range": "Rp 10 juta - Rp 20 juta",
  "promo_code": "SURVEY60",
  "referral_source": "Instagram",
  "building_type": "rumah",
  "work_description": "Perbaikan atap bocor dan cat ulang dinding"
}
```

Response (success):
```json
{
  "success": true,
  "message": "Order berhasil dibuat",
  "data": {
    "order_id": 456,
    "order_code": "KGO-2025-0456",
    "total_amount": 100000,
    "payment_url": "/payment/456"
  }
}
```

Response (error — promo code invalid):
```json
{
  "success": false,
  "message": "Kode promo tidak valid",
  "errors": {
    "promo_code": ["Kode SURVEY60 tidak tersedia"]
  }
}
```

### 4.2 Upload Photos

**Approach 1 — Upload langsung di submit form:**
- Convert foto ke base64
- Kirim dalam 1 request bersama form data
- Max size per foto: 2MB
- Backend save ke storage (S3 / local)

**Approach 2 — Upload terpisah (recommended):**

**POST /api/v1/upload/photos**

Request:
- Multipart form data
- Field: `photos[]` (array of files)

Response:
```json
{
  "success": true,
  "data": {
    "photo_urls": [
      "https://storage.gokang.com/uploads/abc123.jpg",
      "https://storage.gokang.com/uploads/def456.jpg"
    ]
  }
}
```

Lalu di submit form, kirim array of URLs instead of base64.

---

## 5. Database Schema

### 5.1 Update Table `orders`

Tambahkan kolom:

```sql
ALTER TABLE orders ADD COLUMN survey_date DATE NULL;
ALTER TABLE orders ADD COLUMN survey_time TIME NULL;
ALTER TABLE orders ADD COLUMN budget_range VARCHAR(50) NULL;
ALTER TABLE orders ADD COLUMN referral_source VARCHAR(50) NULL;
ALTER TABLE orders ADD COLUMN building_type VARCHAR(20) NULL;
ALTER TABLE orders ADD COLUMN work_description TEXT NULL;
ALTER TABLE orders ADD COLUMN promo_code VARCHAR(50) NULL;
```

### 5.2 Table `order_photos`

```sql
CREATE TABLE order_photos (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_id BIGINT UNSIGNED NOT NULL,
  photo_url VARCHAR(255) NOT NULL,
  photo_type ENUM('problem', 'before', 'after') DEFAULT 'problem',
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);
```

---

## 6. Navigation Flow

```
Home Screen
└── Tap "Untuk Rumah" card
    └── Booking Form Borongan Rumah (ini PRD)
        └── Tap "Lanjut Pembayaran"
            ├── Validate form
            ├── Submit to backend
            ├── Create order (status: pending_payment)
            └── Navigate to Payment Screen
                └── Pilih metode pembayaran
                    └── Bayar sukses
                        └── Order status: pending_survey
                        └── Navigate to Order Detail
```

---

## 7. Edge Cases & Error Handling

| Scenario | Behavior |
|---|---|
| Upload foto > 10 | Tampilkan alert "Maksimal 10 foto" |
| Upload foto > 2MB per file | Tampilkan alert "Foto terlalu besar, max 2MB" |
| Tanggal survey = hari ini | Disable, min besok |
| Backend error saat submit | Tampilkan toast "Gagal membuat order. Coba lagi." |
| Network error | Tampilkan "Tidak ada koneksi internet" |
| Promo code invalid | Tampilkan error di field "Kode tidak valid atau sudah kadaluarsa" |

---

## 8. Acceptance Criteria

### UI/UX
- [ ] Header sticky dengan back button
- [ ] Upload foto: 2 button (galeri + kamera)
- [ ] Photo preview grid (max 10, bisa hapus)
- [ ] Alamat survey: chevron kanan, navigate ke Address Picker
- [ ] Tanggal survey: button pill merah, buka Date Time Picker
- [ ] Budget: dropdown dengan 6 options
- [ ] Kode pesanan: text input optional
- [ ] Promo banner: gradient abu, harga coret + button CTA
- [ ] Termasuk & disclamer: checklist dan warning
- [ ] Tahu dari mana: dropdown 7 options
- [ ] Jenis bangunan: 3 chips selectable
- [ ] Deskripsi pekerjaan: textarea 500 char
- [ ] Bottom button: sticky, disabled kalau form invalid

### Functionality
- [ ] Form validation: semua field required ter-check
- [ ] Error message: scroll ke field error + tampilkan text merah
- [ ] Upload foto: max 10, compress kalau > 2MB
- [ ] Submit form: POST ke backend
- [ ] Backend return order_id + payment_url
- [ ] Navigate ke Payment screen dengan order_id
- [ ] Promo code validation di backend

### Performance
- [ ] Photo upload tidak block UI (loading indicator)
- [ ] Form submit < 3 detik (dengan loading state)
- [ ] Smooth scroll (60fps)

---

**Version:** 1.0.0
**Last updated:** 2026-04-21