# PRD 12 — Booking Form Borongan (Untuk Bisnis)

> Form pemesanan layanan borongan full service untuk gedung bisnis/komersial: kantor, ruko, mall, hotel, dll.
> Referensi visual: screenshot GoKang form "Untuk Bisnis".

---

## 1. Overview

Form ini muncul setelah user tap card **"Untuk Bisnis"** di home screen (kategori Borongan Full Service).

**Flow:**
```
Home → Tap "Untuk Bisnis" → Booking Form (scroll) → Submit → Payment → Order Created
```

**Perbedaan dengan Form Rumah:**
- Ditambah **section Informasi Bisnis** (Nama Usaha, Jumlah Cabang, Jenis Bangunan Bisnis)
- Jenis Bangunan berbeda: Kantor/Ruko/Mall/Hotel/Pabrik/Lainnya
- Field lain sama: foto, alamat, tanggal, budget, referral source, deskripsi

---

## 2. Screen Layout — Booking Form (Borongan Bisnis)

### 2.1 Header (Sticky)

```
┌────────────────────────────────────────────┐
│ ← Butuh Jasa Tukang + Material?           │
│   GoKang Solusi tepat untuk bisnismu!     │
└────────────────────────────────────────────┘
```

**Spec:**
- Background: putih
- Border bottom: 1px #E5E7EB
- Back button (←): navigate back ke home
- Title: "Butuh Jasa Tukang + Material?"
  - Font: Poppins_700Bold, 20px, hitam
- Subtitle: "GoKang Solusi tepat untuk bisnismu!" (bukan "rumahmu")
  - Font: Poppins_400Regular, 14px, abu #6B7280

---

### 2.2 Section: Tahu GoKang dari mana?

SAMA dengan form Rumah (referral source multi-choice).

---

### 2.3 Section: Informasi Bisnis (NEW!)

```
┌────────────────────────────────────────────┐
│ 🏢 Informasi Bisnis*                       │
│                                            │
│ Nama Usaha*                                │
│  ┌──────────────────────────────────────┐ │
│  │ Nama Usaha                           │ │
│  └──────────────────────────────────────┘ │
│                                            │
│ Jumlah Cabang*                             │
│  ┌──────────────────────────────────────┐ │
│  │ Masukkan Jumlah Cabang             → │ │
│  └──────────────────────────────────────┘ │
│                                            │
│ Jenis Bangunan*                            │
│  ┌──────────────────────────────────────┐ │
│  │ Pilih Jenis Bangunan               → │ │
│  └──────────────────────────────────────┘ │
└────────────────────────────────────────────┘
```

**Section Heading:**
- Icon: 🏢 (building) merah
- Text: "Informasi Bisnis" + asterisk merah
- Font: Poppins_600SemiBold, 16px

**Field 1 — Nama Usaha:**
- Label: "Nama Usaha*" (14px, medium)
- Input: TextInput
  - Height: 56px
  - Border: 1.5px solid #D1D5DB
  - Border radius: 12px
  - Placeholder: "Nama Usaha"
  - Font: Poppins_400Regular, 14px
- Validasi: Required, max 100 char

**Field 2 — Jumlah Cabang:**
- Label: "Jumlah Cabang*"
- Dropdown/Picker dengan options:
  - 1 cabang
  - 2-5 cabang
  - 6-10 cabang
  - 11-20 cabang
  - Lebih dari 20 cabang
- Style: sama dengan dropdown budget
- Validasi: Required

**Field 3 — Jenis Bangunan:**
- Label: "Jenis Bangunan*"
- Dropdown dengan options:
  - Kantor
  - Ruko
  - Mall/Pusat Perbelanjaan
  - Hotel/Penginapan
  - Pabrik/Gudang
  - Restoran/Kafe
  - Lainnya (dengan input custom)
- Style: sama dengan dropdown budget
- Validasi: Required

---

### 2.4 Section: Perbaikan/Pekerjaan

SAMA dengan form Rumah (textarea deskripsi).

---

### 2.5 Section: Upload Foto Masalah

SAMA dengan form Rumah (max 10 foto).

---

### 2.6 Section: Alamat Survey

SAMA dengan form Rumah (alamat + detail patokan).

---

### 2.7 Section: Tanggal Survey

SAMA dengan form Rumah (date time picker).

---

### 2.8 Section: Budget yang kamu siapkan

SAMA dengan form Rumah (dropdown 6 options budget).

---

### 2.9 Section: Kode Pesanan

SAMA dengan form Rumah (optional promo code).

---

### 2.10 Section: Promo Survey Banner

SAMA dengan form Rumah (promo 60%, Rp250.000 → Rp100.000).

---

### 2.11 Bottom CTA (Sticky)

SAMA dengan form Rumah (button "Lanjut ke Pembayaran").

---

## 3. Form Field Order (Top to Bottom)

Urutan field di form bisnis:

1. Tahu GoKang dari mana? (referral source) *
2. **Informasi Bisnis** * (NEW section)
   - Nama Usaha *
   - Jumlah Cabang *
   - Jenis Bangunan *
3. Perbaikan/pekerjaan bangunan yang dibutuhkan
4. Masukkan Foto Masalah *
5. Alamat Survey *
6. Tanggal Survey *
7. Budget yang kamu siapkan *
8. Kode Pesanan
9. Promo Survey Banner
10. [Bottom Button] Lanjut ke Pembayaran

---

## 4. Form Validation Rules

| Field | Required | Validation |
|---|---|---|
| Tahu GoKang dari mana? | ✅ | Min 1 selected |
| Nama Usaha | ✅ | Max 100 char |
| Jumlah Cabang | ✅ | Must select 1 option |
| Jenis Bangunan | ✅ | Must select 1 option |
| Deskripsi pekerjaan | ❌ | Max 500 char |
| Foto masalah | ✅ | Min 1, max 10 foto |
| Alamat survey | ✅ | Not empty |
| Tanggal survey | ✅ | Min tomorrow, max 30 days |
| Budget | ✅ | Must select 1 option |
| Kode pesanan | ❌ | Optional |

---

## 5. API Integration

### 5.1 Backend Endpoint

**POST /api/v1/booking/borongan/bisnis**

Request body:
```json
{
  "order_type": "borongan",
  "category": "bisnis",
  "referral_sources": ["Instagram", "Rekomendasi Teman"],
  "business_name": "PT GoKang Jaya",
  "branch_count": "2-5 cabang",
  "building_type": "Kantor",
  "description": "Renovasi ruang meeting dan cat ulang seluruh kantor",
  "photos": [
    "data:image/jpeg;base64,/9j/4AAQ...",
    "data:image/jpeg;base64,..."
  ],
  "address": "Jl. Sudirman No. 45, Jakarta Pusat",
  "address_detail": "Gedung Wisma Indocement Lt. 5",
  "survey_scheduled_at": "2026-05-01T10:00:00.000Z",
  "budget": "Rp 20 juta - Rp 50 juta",
  "promo_code": "SURVEY60"
}
```

Response (success):
```json
{
  "success": true,
  "message": "Order berhasil dibuat",
  "data": {
    "order_id": 2,
    "order_code": "KGO-2026-0002",
    "total_amount": 100000,
    "status": "pending_payment",
    "payment_url": "/payment/2"
  }
}
```

---

### 5.2 Database Schema Update

**Table: orders**

Tambahkan kolom untuk bisnis:

```sql
ALTER TABLE orders ADD COLUMN business_name VARCHAR(100) NULL;
ALTER TABLE orders ADD COLUMN branch_count VARCHAR(50) NULL;
ALTER TABLE orders ADD COLUMN building_type_business VARCHAR(50) NULL;
```

Atau kalau mau flexible, pakai kolom `building_type` yang sudah ada (support rumah + bisnis).

---

## 6. Mobile Implementation

### 6.1 File Structure

```
app/
├── booking/
│   ├── borongan-rumah.tsx      ← Sudah ada
│   └── borongan-bisnis.tsx     ← Buat baru (duplicate + modif)

services/
└── api/
    └── orders.ts
        ├── createBoronganRumah()    ← Sudah ada
        └── createBoronganBisnis()   ← Tambahkan
```

### 6.2 Component Reuse

Komponen yang bisa di-reuse dari form Rumah:
- PhotoUploader
- DateTimePicker
- Modal referral source
- Modal alamat
- Modal budget
- Promo banner card

Yang perlu dibuat baru:
- Section "Informasi Bisnis" (3 fields)
- Modal jumlah cabang
- Modal jenis bangunan bisnis

---

## 7. Acceptance Criteria

### UI/UX
- [ ] Header subtitle: "GoKang Solusi tepat untuk bisnismu!"
- [ ] Section "Informasi Bisnis" tampil dengan 3 fields
- [ ] Field "Nama Usaha": TextInput biasa
- [ ] Field "Jumlah Cabang": Dropdown dengan 5 options
- [ ] Field "Jenis Bangunan": Dropdown dengan 7 options + "Lainnya"
- [ ] Semua field sama dengan form Rumah berfungsi
- [ ] Bottom button disabled kalau ada field required kosong
- [ ] Bottom button enabled merah kalau semua field valid

### Functionality
- [ ] Form validation: semua field required ter-check
- [ ] Error message: scroll ke field error
- [ ] Upload foto: max 10, compress
- [ ] Submit form: POST ke /booking/borongan/bisnis
- [ ] Backend return order_id + order_code
- [ ] Navigate ke Payment screen
- [ ] Data tersimpan di database

### Data Integrity
- [ ] Table orders: kolom category = 'bisnis'
- [ ] Table orders: business_name, branch_count, building_type_business tersimpan
- [ ] Table order_photos: foto ter-upload dan tersimpan

---

## 8. Navigation Flow

```
Home Screen
└── Tap "Untuk Bisnis" card
    └── Booking Form Borongan Bisnis (ini PRD)
        └── Tap "Lanjut Pembayaran"
            ├── Validate form
            ├── Convert photos to base64
            ├── POST /booking/borongan/bisnis
            ├── Create order (status: pending_payment)
            └── Navigate to Payment Screen
                └── Pilih metode pembayaran
                    └── Bayar sukses
                        └── Order status: pending_survey
                        └── Navigate to Order Detail
```

---

## 9. Differences Summary (Rumah vs Bisnis)

| Aspek | Form Rumah | Form Bisnis |
|---|---|---|
| Subtitle header | "untuk rumahmu!" | "untuk bisnismu!" |
| Section khusus | Jenis Bangunan (3 chips) | Informasi Bisnis (3 fields) |
| Jenis bangunan options | Apartment, Ruko, Rumah | Kantor, Ruko, Mall, Hotel, Pabrik, Restoran, Lainnya |
| Field tambahan | - | Nama Usaha, Jumlah Cabang |
| Database category | 'rumah' | 'bisnis' |
| API endpoint | /borongan/rumah | /borongan/bisnis |

Semua field lain: **IDENTIK** (foto, alamat, tanggal, budget, referral, deskripsi, promo).

---

**Version:** 1.0.0
**Last updated:** 2026-04-21