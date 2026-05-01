# PRD 13 — Pesan Tukang Harian (Pesan Tukang Saja)

> Flow pemesanan tukang harian tanpa material: pilih jagoan dari list/grid → form booking sederhana → submit order.
> Referensi visual: screenshot GoKang "Pesan Tukang Langsung".

---

## 1. Overview

Flow ini dimulai dari home screen, tap card **"Pesan Tukang Saja"** (kategori Tukang Harian).

**Perbedaan dengan Borongan:**
- **Tidak ada survey** — langsung eksekusi kerja
- **Tanpa material** — tukang bawa tools sendiri, user sediakan material
- **Pilih jagoan** — user pilih spesialisasi tukang (cat, keramik, listrik, dll)
- **Form lebih simple** — tidak perlu upload foto masalah, budget, promo

**Flow:**
```
Home 
└── Tap "Pesan Tukang Saja"
    └── Modal: Pilih Jagoan (list/grid view)
        └── Tap salah satu jagoan (misal: Jagoan Cat)
            └── Form Booking Tukang Harian
                └── Submit
                    └── Order Created (status: pending_assignment)
                        └── Navigate to Order Detail
```

---

## 2. Screen 1 — Pilih Jagoan (Modal)

### 2.1 Layout Overview

```
┌────────────────────────────────────────────┐
│                                         ✕  │
│ Pesan Tukang Langsung! 👷      ☰  ⊞       │
│ Pilih Tukang Jagoan yang cocok untuk      │
│ kebutuhan pekerjaan di rumahmu             │
│                                            │
│ 🔍 Cari Tukang Langsung                   │
│                                            │
│ ┌──────────────────────────────────────┐  │
│ │ 🎨 Jagoan Cat                        │  │
│ │ Bantu membuang cat lama, melakukan   │  │
│ │ cat dasar, finishing...              │  │
│ └──────────────────────────────────────┘  │
│ ┌──────────────────────────────────────┐  │
│ │ 🔶 Jagoan Keramik                    │  │
│ │ Ahli bongkar pasang keramik dan...   │  │
│ └──────────────────────────────────────┘  │
│ ...                                        │
└────────────────────────────────────────────┘
```

### 2.2 Component Spec

**Modal Container:**
- Type: Full screen modal (atau bottom sheet 90% height)
- Background: putih
- Animation: slide up dari bottom
- Close: Tap X atau swipe down

**Header:**
- Icon close (✕) kanan atas
- Title: "Pesan Tukang Langsung! 👷"
  - Font: Poppins_800ExtraBold, 24px, hitam
- Subtitle: "Pilih Tukang Jagoan yang cocok untuk kebutuhan pekerjaan di rumahmu"
  - Font: Poppins_400Regular, 14px, abu #6B7280
- View toggle (kanan title):
  - Button List (☰) — default active
  - Button Grid (⊞)
  - Active: merah #E8272A
  - Inactive: abu #9CA3AF

**Search Bar:**
- Height: 48px
- Border: 1px solid #E5E7EB
- Border radius: 24px (pill)
- Icon: 🔍 kiri
- Placeholder: "Cari Tukang Langsung"
- Font: Poppins_400Regular, 14px
- Function: Filter list by nama jagoan (real-time)

**List View (Default):**
- Layout: Vertical scroll
- Setiap item:
  - Height: auto (fit content)
  - Padding: 16px
  - Border bottom: 1px solid #F3F4F6
  - Icon kiri (circle 64px, background color dari jagoan)
  - Text kanan:
    - Nama: Poppins_700Bold, 16px, hitam
    - Deskripsi: Poppins_400Regular, 13px, abu
    - Max 2 lines, ellipsis
  - onTap: Navigate ke Form Booking dengan jagoan terpilih

**Grid View (Alternative):**
- Layout: 4 kolom (2x2 grid per row di mobile landscape, 4x1 di portrait)
- Setiap card:
  - Width: (screen width - padding - gap) / 4
  - Aspect ratio: 1:1.2
  - Border radius: 12px
  - Shadow: subtle
  - Icon center (48px)
  - Nama below icon (center aligned, 12px, 2 lines max)
  - onTap: Navigate ke Form Booking

---

## 3. Data: List Jagoan (17 Services)

Sama dengan database `services` yang sudah ada. Fetch dari backend:

**GET /api/v1/services?category=tukang_harian**

Response:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Jagoan Cat",
      "slug": "jagoan-cat",
      "description": "Bantu membuang cat lama, melakukan cat dasar, finishing, dan segala permasalahan cat lainnya",
      "icon_url": "https://...",
      "icon_color": "#DC2626",
      "category": "tukang_harian",
      "base_price": 150000
    },
    {
      "id": 2,
      "name": "Jagoan Keramik",
      "description": "Ahli bongkar pasang keramik dan porselen untuk lantai maupun dinding",
      "icon_url": "https://...",
      "icon_color": "#F59E0B",
      "category": "tukang_harian",
      "base_price": 180000
    },
    // ... 15 jagoan lainnya
  ]
}
```

17 Jagoan (dari seeder yang sudah ada):
1. Jagoan Cat
2. Jagoan Keramik
3. Jagoan Listrik
4. Kenek (Asisten Jagoan)
5. Jagoan Aluminium Aksesoris
6. Jagoan Batu
7. Jagoan Pipa
8. Jagoan Waterproofing
9. Jagoan Gali
10. Jagoan Besi (Las)
11. Jagoan Genteng
12. Jagoan Plafon
13. Jagoan Sanitair
14. Jagoan Angkat
15. Jagoan Listrik Perapihan
16. Jagoan Pipa Perapihan
17. Jagoan AC

---

## 4. Screen 2 — Form Booking Tukang Harian

### 4.1 Layout Overview

Setelah user tap salah satu jagoan (misal: Jagoan Cat), navigate ke form booking.

```
┌────────────────────────────────────────────┐
│ ← Pesan Jagoan Cat                         │
│   Tukang profesional untuk pengecatan      │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│ 📢 Tahu GoKang dari mana?*                 │
│ [Dropdown multi-select]                    │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│ 📍 Alamat Pekerjaan*                       │
│ [Input alamat + detail]                    │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│ 📅 Tanggal & Waktu Mulai*                  │
│ [Date Time Picker]                         │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│ ⏱️ Estimasi Durasi Pekerjaan*               │
│ [Dropdown: 4 jam / 8 jam / Custom]         │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│ 🔧 Deskripsi Pekerjaan*                    │
│ [Textarea]                                 │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│ 🎫 Kode Pesanan                            │
│ [Input optional]                           │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│ 💰 Estimasi Biaya                          │
│ Rp 150.000 / hari (base price)             │
│ + Rp 0 (promo discount)                    │
│ ─────────────────────                      │
│ Total: Rp 150.000                          │
└────────────────────────────────────────────┘

[Lanjut ke Pembayaran →]
```

### 4.2 Field Details

**Header:**
- Title: "Pesan {Nama Jagoan}" (misal: "Pesan Jagoan Cat")
- Subtitle: Deskripsi singkat jagoan (dari data API)
- Back button navigate ke modal pilih jagoan

**Field 1 — Tahu GoKang dari mana?**
- SAMA dengan form Borongan (referral source multi-choice)

**Field 2 — Alamat Pekerjaan:**
- SAMA dengan form Borongan (alamat + detail patokan)

**Field 3 — Tanggal & Waktu Mulai:**
- Date picker: min besok (bukan hari ini)
- Time picker: jam mulai kerja (08:00 - 16:00)
- Format: "Selasa, 22 Apr 2026 • 08:00 WIB"

**Field 4 — Estimasi Durasi Pekerjaan:** (NEW!)
- Label: "Estimasi Durasi Pekerjaan*"
- Icon: ⏱️
- Dropdown options:
  - 4 jam (setengah hari)
  - 8 jam (1 hari penuh)
  - Custom (input manual dalam jam)
- Validasi: Required
- Logic:
  - Kalau pilih "Custom" → muncul input number untuk jam
  - Min 2 jam, max 12 jam

**Field 5 — Deskripsi Pekerjaan:**
- SAMA dengan form Borongan (textarea 500 char)
- Contoh placeholder: "Contoh: Cat ulang kamar ukuran 3x4m, warna putih broken white"

**Field 6 — Kode Pesanan:**
- Optional promo code

**Section: Estimasi Biaya** (NEW!)
- Background: abu terang #F9FAFB
- Border: 1px #E5E7EB
- Border radius: 12px
- Padding: 16px
- Breakdown:
  - Base price jagoan (dari API): Rp 150.000/hari
  - Durasi: 8 jam
  - Subtotal: Rp 150.000
  - Promo discount: - Rp 0 (kalau ada kode promo)
  - Divider
  - **Total: Rp 150.000** (bold, merah)
- NOTE: Ini estimasi. Harga final bisa berubah setelah tukang review.

**Bottom CTA:**
- Button: "Lanjut ke Pembayaran →"
- Background: merah #E8272A
- Disabled kalau ada field required kosong
- onPress: Submit order

---

## 5. Form Validation Rules

| Field | Required | Validation |
|---|---|---|
| Jagoan terpilih | ✅ | Must select from list |
| Tahu GoKang dari mana? | ✅ | Min 1 selected |
| Alamat pekerjaan | ✅ | Not empty |
| Tanggal & waktu | ✅ | Min tomorrow, 08:00-16:00 |
| Durasi pekerjaan | ✅ | 4h / 8h / Custom (2-12h) |
| Deskripsi pekerjaan | ✅ | Min 10 char, max 500 |
| Kode pesanan | ❌ | Optional |

---

## 6. API Integration

### 6.1 Backend Endpoint

**POST /api/v1/booking/tukang-harian**

Request body:
```json
{
  "order_type": "tukang_harian",
  "service_id": 1,
  "referral_sources": ["Instagram"],
  "address": "Jl. Merdeka No. 10, Jakarta Pusat",
  "address_detail": "Rumah cat hijau, dekat Alfamart",
  "work_scheduled_at": "2026-04-25T08:00:00.000Z",
  "duration_hours": 8,
  "description": "Cat ulang kamar ukuran 3x4m, warna putih broken white. Material sudah tersedia.",
  "promo_code": null
}
```

Response (success):
```json
{
  "success": true,
  "message": "Order berhasil dibuat",
  "data": {
    "order_id": 5,
    "order_code": "KGO-2026-0005",
    "service_name": "Jagoan Cat",
    "total_amount": 150000,
    "status": "pending_assignment",
    "work_scheduled_at": "2026-04-25T08:00:00.000Z"
  }
}
```

### 6.2 Database Schema

**Table: orders**

Kolom yang dipakai:
- `service_id` (foreign key ke table services)
- `order_type` = 'tukang_harian'
- `category` = NULL (karena sudah ada di service)
- `status` = 'pending_assignment' (belum ada tukang yang di-assign)
- `work_scheduled_at` (tanggal & waktu mulai kerja)
- `duration_hours` (estimasi durasi dalam jam)
- `description` (deskripsi pekerjaan)
- `address` + `address_detail`
- `referral_sources`
- `promo_code`
- `total_amount` (dari service.base_price * duration_hours / 8)

**Tidak perlu kolom tambahan** karena semua field sudah ada di schema orders yang sekarang.

---

## 7. Navigation Flow

```
Home Screen
└── Tap "Pesan Tukang Saja" card
    └── Modal: Pilih Jagoan (list/grid)
        ├── Search untuk filter
        ├── Toggle list/grid view
        └── Tap salah satu jagoan
            └── Form Booking Tukang Harian
                ├── Isi semua field
                ├── Review estimasi biaya
                └── Tap "Lanjut ke Pembayaran"
                    ├── POST /booking/tukang-harian
                    ├── Create order (status: pending_assignment)
                    └── Navigate to Payment Screen
                        └── Bayar sukses
                            └── Order status: pending_confirmation
                            └── Navigate to Order Detail
```

---

## 8. Differences: Tukang Harian vs Borongan

| Aspek | Borongan | Tukang Harian |
|---|---|---|
| **Flow awal** | Langsung ke form | Pilih jagoan dulu → form |
| **Upload foto** | ✅ Required (max 10) | ❌ Tidak ada |
| **Survey** | ✅ Ada tanggal survey | ❌ Langsung eksekusi |
| **Material** | ✅ Termasuk material | ❌ User sediakan |
| **Budget range** | ✅ Pilih budget | ❌ Fixed base price |
| **Jenis bangunan** | ✅ Apartment/Ruko/Rumah | ❌ Tidak perlu |
| **Informasi bisnis** | ✅ (untuk bisnis) | ❌ Tidak ada |
| **Durasi pekerjaan** | ❌ Tidak ada | ✅ 4h / 8h / Custom |
| **Promo banner** | ✅ Survey 60% | ❌ Tidak ada |
| **Estimasi biaya** | ✅ Survey Rp100k | ✅ Base price × durasi |
| **Status awal** | pending_payment | pending_assignment |

---

## 9. Acceptance Criteria

### Modal Pilih Jagoan
- [ ] Modal muncul saat tap "Pesan Tukang Saja"
- [ ] List 17 jagoan tampil dengan icon + nama + deskripsi
- [ ] Search bar filter list real-time
- [ ] Toggle list/grid view berfungsi
- [ ] Grid view: 4 kolom, icon + nama
- [ ] Tap jagoan navigate ke form dengan jagoan terpilih

### Form Booking
- [ ] Header menampilkan nama jagoan terpilih
- [ ] Field referral source (multi-choice)
- [ ] Field alamat (modal input)
- [ ] Field tanggal & waktu (date time picker)
- [ ] Field durasi (dropdown 4h/8h/Custom)
- [ ] Field deskripsi (textarea 500 char)
- [ ] Field kode pesanan (optional)
- [ ] Section estimasi biaya tampil dengan breakdown
- [ ] Button disabled kalau ada field required kosong
- [ ] Button enabled merah kalau semua valid

### API & Database
- [ ] POST /booking/tukang-harian berhasil
- [ ] Order tersimpan dengan service_id benar
- [ ] order_type = 'tukang_harian'
- [ ] status = 'pending_assignment'
- [ ] work_scheduled_at, duration_hours, description tersimpan
- [ ] total_amount = base_price (estimasi)

---

## 10. Mobile Implementation Notes

**File Structure:**
```
app/
├── services/
│   └── select-jagoan.tsx      ← Modal pilih jagoan
├── booking/
│   └── tukang-harian.tsx      ← Form booking

components/
├── services/
│   ├── JagoanListItem.tsx     ← Item list view
│   └── JagoanGridItem.tsx     ← Item grid view

services/
└── api/
    ├── services.ts            ← GET /services
    └── orders.ts              ← POST /booking/tukang-harian
```

**State Management:**
- Modal pilih jagoan: local state (selected service)
- Form booking: local state (form fields)
- Pass selected service via route params

**Reusable Components:**
- Referral source picker (dari form Borongan)
- Address input modal (dari form Borongan)
- Date time picker (dari form Borongan)
- Promo code input (dari form Borongan)

**New Components:**
- JagoanListItem (list view dengan icon kiri)
- JagoanGridItem (grid card 4 kolom)
- DurationPicker (dropdown + custom input)
- PriceBreakdown (estimasi biaya card)

---

**Version:** 1.0.0
**Last updated:** 2026-04-21