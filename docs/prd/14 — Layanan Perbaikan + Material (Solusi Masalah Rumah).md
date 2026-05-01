# PRD 14 — Layanan Perbaikan + Material (Solusi Masalah Rumah)

> Flow pemesanan layanan perbaikan dengan material: pilih masalah dari list/grid → form booking dengan opsi material → submit order.
> Referensi visual: screenshot GoKang "Solusi Masalah Rumah".

---

## 1. Overview

Flow ini dimulai dari home screen, tap card **"Layanan Perbaikan + Material"** (kategori Tukang Harian dengan material).

**Perbedaan dengan "Pesan Tukang Saja":**
- Header berbeda: "Solusi Masalah Rumah 🏡"
- Fokus pada masalah/solusi, bukan jagoan/keahlian
- Tambah field: **Material included** (checkbox atau dropdown)
- List berbeda: Kebocoran, Cuci Toren, Cat Rumah, dll

**Flow:**
```
Home 
└── Tap "Layanan Perbaikan + Material"
    └── Bottom Sheet: Pilih Solusi Masalah (list/grid view)
        └── Tap salah satu solusi (misal: Cat)
            └── Warning Sheet (55% height)
                └── Tap "Lanjutkan"
                    └── Form Booking Perbaikan + Material
                        └── Submit
                            └── Order Created (status: pending_payment)
```

---

## 2. Screen 1 — Pilih Solusi Masalah (Bottom Sheet)

### 2.1 Layout Overview

```
┌────────────────────────────────────────────┐
│                                         ✕  │
│ Solusi Masalah Rumah 🏡        ☰  ⊞       │
│ Tidak pusing lagi dengan masalah rumah,    │
│ solusi yang cocok ada semua di sini        │
│                                            │
│ 🔍 Cari Solusi Masalah Rumah              │
│                                            │
│ ┌──────────────────────────────────────┐  │
│ │ 💧 Kebocoran                 NEW     │  │
│ │ Jaga Rumah Bebas Bocor              │  │
│ └──────────────────────────────────────┘  │
│ ┌──────────────────────────────────────┐  │
│ │ 🔥 Cuci Toren                NEW     │  │
│ │ Toren Kotor Jadi Bersih, Air...     │  │
│ └──────────────────────────────────────┘  │
│ ...                                        │
└────────────────────────────────────────────┘
```

### 2.2 Component Spec

**Header:**
- Title: "Solusi Masalah Rumah 🏡"
  - Font: Poppins_800ExtraBold, 24px
- Subtitle: "Tidak pusing lagi dengan masalah rumah, solusi yang cocok ada semua di sini"
  - Font: Poppins_400Regular, 14px, abu #6B7280
- Toggle: List (☰) / Grid (⊞) — sama seperti Pesan Tukang

**Search Bar:**
- Placeholder: "Cari Solusi Masalah Rumah"

**List Item:**
- Badge "NEW" di kanan atas (untuk item tertentu)
  - Background: #EF4444
  - Text: "NEW" putih, Poppins_700Bold, 10px
  - Position: absolute, top-right corner

---

## 3. Data: List Solusi Masalah (25+ items)

Fetch dari backend: **GET /api/v1/solutions** atau **GET /api/v1/services?category=perbaikan**

**List berdasarkan screenshot:**

1. **Kebocoran** — Jaga Rumah Bebas Bocor
2. **Cuci Toren** (NEW) — Toren Kotor Jadi Bersih, Air Jadi Mengalir Lancar
3. **Cat** — Warnai Rumahmu
4. **Keramik** — Percantik Lantai dan Dindingmu
5. **Listrik** — Rumah Terang, Hati Senang
6. **Pipa** — Air Mengalir Lancar
7. **Toilet** — Kamar Mandi Bersih dan Nyaman
8. **Dinding/Tembok** — Dinding Kokoh dan Terjaga
9. **Plafon** — Kebutuhan Langit-langit Rumahmu
10. **Atap/Dak Beton** — Atap Pelindung Rumahmu
11. **Pintu/Jendela** — Kreasi Aksesoris Pintu dan Jendela Rumahmu
12. **Jasa Angkat** — Bantu Pindahkan Barang-barangmu
13. **Dapur** — Biar Lebih Semangat Memasak
14. **Aluminium Aksesoris** — Percantik Interior Rumahmu
15. **Conblock** — Agar Pekarangan Rumahmu Indah
16. **Kipas Angin** — Biar Rumahmu Lebih Adem
17. **Exhaust Fan** (screenshot 2)
18. **Lemari**
19. **Batu Alam**
20. **Tangki Air (Bawah Tanah)**
21. **Tangki Air** (atas)
22. **Kanopi**
23. **Water Heater**
24. **Lantai**

Response format:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Kebocoran",
      "slug": "kebocoran",
      "description": "Jaga Rumah Bebas Bocor",
      "icon_url": "https://...",
      "icon_color": "#3B82F6",
      "is_new": false,
      "base_price": 200000,
      "category": "perbaikan"
    },
    {
      "id": 2,
      "name": "Cuci Toren",
      "slug": "cuci-toren",
      "description": "Toren Kotor Jadi Bersih, Air Jadi Mengalir Lancar",
      "icon_url": "https://...",
      "icon_color": "#F97316",
      "is_new": true,
      "base_price": 150000,
      "category": "perbaikan"
    },
    // ... 23 items lainnya
  ]
}
```

---

## 4. Screen 2 — Form Booking Perbaikan + Material

### 4.1 Layout Overview

Mirip dengan form Tukang Harian, tapi ada tambahan field **Material**.

```
┌────────────────────────────────────────────┐
│ ← Pesan Layanan Cat                        │
│   Solusi pengecatan rumah dengan material  │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│ 📢 Tahu GoKang dari mana?*                 │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│ 🔧 Material Included*                      │
│ [ ] Ya, sertakan material                  │
│ [x] Tidak, saya sediakan sendiri           │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│ 📍 Alamat Pekerjaan*                       │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│ 📅 Tanggal & Waktu Mulai*                  │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│ ⏱️ Estimasi Durasi Pekerjaan*               │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│ 🔧 Deskripsi Pekerjaan*                    │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│ 🎫 Kode Pesanan                            │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│ 💰 Estimasi Biaya                          │
│ Jasa tukang: Rp 150.000                    │
│ + Material: (akan dihitung setelah survey) │
│ ─────────────────────                      │
│ Total sementara: Rp 150.000                │
└────────────────────────────────────────────┘

[Lanjut ke Pembayaran →]
```

### 4.2 Field Details

**Field 1-7:** SAMA dengan Tukang Harian (referral, alamat, tanggal, durasi, deskripsi, promo).

**Field BARU — Material Included:** (antara referral dan alamat)
- Label: "Material Included*"
- Icon: 🔧 atau 📦
- Type: Checkbox atau Radio buttons
- Options:
  - ✅ Ya, sertakan material (estimasi akan dikonfirmasi setelah survey)
  - ⬜ Tidak, saya sediakan sendiri
- Default: "Tidak" (unchecked)
- Validasi: Required

**Estimasi Biaya:**
- Kalau material included = false:
  - Total = base_price × durasi
- Kalau material included = true:
  - Jasa: base_price × durasi
  - Material: "(akan dihitung setelah survey)"
  - Total: "Rp X (jasa saja, material menyusul)"
  - Note: "Tim kami akan survey terlebih dahulu untuk menghitung kebutuhan material"

---

## 5. API Integration

### 5.1 Backend Endpoint

**POST /api/v1/booking/perbaikan-material**

Request body (mirip tukang-harian + field material):
```json
{
  "service_id": 3,
  "referral_sources": ["Instagram"],
  "material_included": true,
  "address": "Jl. Merdeka No. 10, Jakarta Pusat",
  "address_detail": "Rumah cat hijau, dekat Alfamart",
  "work_scheduled_at": "2026-04-25T08:00:00.000Z",
  "duration_hours": 8,
  "description": "Cat ulang seluruh rumah, warna putih broken white",
  "promo_code": null
}
```

Response (success):
```json
{
  "success": true,
  "message": "Order berhasil dibuat",
  "data": {
    "order_id": 6,
    "order_code": "KGO-2026-0006",
    "service_name": "Cat",
    "total_amount": 150000,
    "material_included": true,
    "status": "pending_survey",
    "work_scheduled_at": "2026-04-25T08:00:00.000Z"
  }
}
```

### 5.2 Database Schema

**Table: orders**

Tambahkan kolom:
- `material_included` BOOLEAN DEFAULT false

Migration:
```sql
ALTER TABLE orders ADD COLUMN material_included BOOLEAN DEFAULT false;
```

**Status flow berbeda:**
- Kalau `material_included = false` → status: `pending_assignment` (sama seperti tukang harian)
- Kalau `material_included = true` → status: `pending_survey` (perlu survey dulu untuk hitung material)

---

## 6. Navigation Flow

```
Home Screen
└── Tap "Layanan Perbaikan + Material" card
    └── Bottom Sheet: Pilih Solusi Masalah (list/grid)
        ├── Search untuk filter
        ├── Toggle list/grid view
        └── Tap salah satu solusi (misal: Cat)
            └── Warning Sheet (55% height)
                ├── Ilustrasi tukang + warning triangle
                ├── Nama solusi: "Cat"
                ├── Pesan disclaimer
                └── Tap "Lanjutkan"
                    └── Form Booking Perbaikan + Material
                        ├── Isi semua field (termasuk material checkbox)
                        ├── Review estimasi biaya
                        └── Tap "Lanjut ke Pembayaran"
                            ├── POST /booking/perbaikan-material
                            ├── Create order
                            └── Navigate to Payment Screen
```

---

## 7. Differences: Pesan Tukang vs Perbaikan + Material

| Aspek | Pesan Tukang Saja | Perbaikan + Material |
|---|---|---|
| **Header** | Pesan Tukang Langsung! 👷 | Solusi Masalah Rumah 🏡 |
| **Subtitle** | Pilih Tukang Jagoan... | Tidak pusing lagi dengan masalah rumah... |
| **List** | 17 jagoan (Cat, Keramik, Listrik) | 25+ solusi (Kebocoran, Cuci Toren, Cat) |
| **Badge NEW** | Tidak ada | Ada (Cuci Toren, dll) |
| **Field Material** | ❌ Tidak ada | ✅ Checkbox "Material Included" |
| **Estimasi Biaya** | Jasa saja | Jasa + Material (menyusul) |
| **Status Order** | pending_assignment | pending_survey (kalau material=true) |
| **Database** | material_included = false | material_included = true/false |

---

## 8. Acceptance Criteria

### Bottom Sheet Pilih Solusi
- [ ] Header: "Solusi Masalah Rumah 🏡"
- [ ] Subtitle sesuai screenshot
- [ ] List 25+ solusi tampil
- [ ] Badge "NEW" tampil di item tertentu
- [ ] Search filter working
- [ ] Toggle list/grid working
- [ ] Tap solusi → warning sheet muncul

### Warning Sheet
- [ ] Sama dengan Pesan Tukang (ilustrasi + disclaimer)
- [ ] Pesan sesuai per solusi

### Form Booking
- [ ] Field material included tampil
- [ ] Checkbox/radio material working
- [ ] Kalau material=true, estimasi biaya berubah
- [ ] Field lain sama dengan Tukang Harian
- [ ] Button disabled kalau field kosong
- [ ] Submit berhasil

### API & Database
- [ ] POST /booking/perbaikan-material berhasil
- [ ] Order tersimpan dengan material_included
- [ ] Status = pending_survey kalau material=true
- [ ] Status = pending_assignment kalau material=false

---

## 9. Mobile Implementation Notes

**File Structure:**
```
app/
├── solutions/
│   └── select-solution.tsx        ← Modal pilih solusi (duplicate SelectJagoanModal)
├── booking/
│   └── perbaikan-material.tsx     ← Form booking (duplicate tukang-harian + field material)

components/
├── solutions/
│   ├── SolutionListItem.tsx       ← Item dengan badge NEW
│   └── SolutionGridItem.tsx

services/
└── api/
    ├── solutions.ts               ← GET /solutions
    └── orders.ts                  ← POST /booking/perbaikan-material
```

**Reuse dari Pesan Tukang:**
- Bottom sheet structure (90% → 55% transition)
- Warning sheet component
- Form fields (kecuali material checkbox)
- API service pattern

**New Components:**
- MaterialCheckbox (checkbox + disclaimer text)
- SolutionBadge (badge "NEW" di corner)

---

**Version:** 1.0.0
**Last updated:** 2026-04-22