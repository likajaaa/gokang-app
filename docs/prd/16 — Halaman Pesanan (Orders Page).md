# PRD 16 — Halaman Pesanan (Orders Page)

> Halaman daftar pesanan user dengan 3 tab: Rencana, Aktif, dan Arsip.
> Referensi visual: screenshot GoKang "Pesanan" page.

---

## 1. Overview

Halaman Pesanan menampilkan semua order yang pernah dibuat user, dikelompokkan dalam 3 tab berdasarkan status.

**Flow:**
```
Bottom Nav → Tap "Pesanan" → Halaman Pesanan
  ├── Tab "Rencana"  → Order belum dimulai
  ├── Tab "Aktif"    → Order sedang berjalan
  └── Tab "Arsip"    → Order selesai/dibatalkan
```

---

## 2. Screen Layout

### 2.1 Header

```
┌─────────────────────────────────────┐
│         Pesanan              [🔍]   │
└─────────────────────────────────────┘
```

**Spec:**
- Title: "Pesanan" center
- Font: Poppins_700Bold, 18px
- Right: Search icon (🔍) untuk cari order by kode/nama layanan
- Background: putih
- Border bottom: 1px #E5E7EB

---

### 2.2 Tab Bar

```
┌─────────────────────────────────────┐
│  Rencana  │   Aktif   │   Arsip    │
│  ───────  │           │            │ ← Active indicator merah
└─────────────────────────────────────┘
```

**3 Tabs:**
- **Rencana** — Order yang belum dimulai (pending_payment, pending_survey, pending_assignment)
- **Aktif** — Order sedang berjalan (on_survey, on_progress, waiting_payment_final)
- **Arsip** — Order selesai atau dibatalkan (completed, cancelled, rejected)

**Tab Style:**
- Width: 1/3 screen each
- Active: text merah #E8272A, Poppins_700Bold, indicator merah 2px bottom
- Inactive: text abu #9CA3AF, Poppins_500Medium
- Font size: 15px

---

### 2.3 Warning Banner (All Tabs)

```
┌─────────────────────────────────────┐
│  Mohon tidak bertransaksi di luar   │
│  aplikasi.                          │
│  GoKang tidak bertanggung jawab     │
│  atas transaksi yang terjadi di     │
│  luar aplikasi                      │
└─────────────────────────────────────┘
```

**Spec:**
- Background: white
- No border/card style — plain text center
- Title: Poppins_700Bold, 16px, abu #6B7280
- Subtitle: Poppins_400Regular, 14px, abu #9CA3AF, center
- Margin: 24px dari tab bar
- Padding: 0 32px

---

### 2.4 STATE KOSONG (Empty State)

Tampil saat tab tidak ada order.

```
┌─────────────────────────────────────┐
│                                     │
│                                     │
│         🏠📦 (Ilustrasi)            │
│         Open box + arrow up         │
│                                     │
│       Belum Ada Proyek              │
│                                     │
│  Kamu belum pernah memesan          │
│  layanan atau tukang langsung       │
│                                     │
└─────────────────────────────────────┘
```

**Ilustrasi:**
- Kotak merah terbuka (open box)
- Panah biru diagonal keluar dari kotak (arah kanan atas)
- Style: 3D illustration-like
- Size: 200px × 200px
- Pakai emoji combo atau gambar asset

**Teks:**
- Title: "Belum Ada Proyek" — Poppins_700Bold, 20px, #111827
- Subtitle: "Kamu belum pernah memesan layanan atau tukang langsung" — Poppins_400Regular, 15px, abu #6B7280, center

**Posisi:**
- Vertical center dari area di bawah warning banner
- Horizontal center

**Variasi per Tab:**

| Tab | Title | Subtitle |
|---|---|---|
| Rencana | "Belum Ada Proyek" | "Kamu belum pernah memesan layanan atau tukang langsung" |
| Aktif | "Tidak Ada Pesanan Aktif" | "Saat ini tidak ada pesanan yang sedang berjalan" |
| Arsip | "Belum Ada Arsip" | "Pesanan yang selesai atau dibatalkan akan muncul di sini" |

---

### 2.5 STATE ADA ORDER (Order List)

Tampil saat tab memiliki order.

```
┌─────────────────────────────────────┐
│ ┌───────────────────────────────┐   │
│ │ 🔨 Jagoan Cat           AKTIF │   │ ← Order Card
│ │                               │   │
│ │ KGO-2026-0001                 │   │
│ │ Jl. Merdeka No. 10            │   │
│ │ 📅 Senin, 27 Apr 2026         │   │
│ │ ⏱️ 8 jam                       │   │
│ │                               │   │
│ │ Rp 150.000          [Detail →]│   │
│ └───────────────────────────────┘   │
│                                     │
│ ┌───────────────────────────────┐   │
│ │ 🏠 Borongan Rumah    RENCANA  │   │
│ │                               │   │
│ │ KGO-2026-0002                 │   │
│ │ Jl. Sudirman No. 45           │   │
│ │ 📅 Survey: Selasa, 28 Apr 2026│   │
│ │                               │   │
│ │ Rp 100.000          [Detail →]│   │
│ └───────────────────────────────┘   │
└─────────────────────────────────────┘
```

---

## 3. Order Card Component

### 3.1 Layout

```
┌──────────────────────────────────────────┐
│ [Icon] Nama Layanan            [BADGE]   │
│                                          │
│ #KGO-2026-0001                          │
│                                          │
│ 📍 Alamat pekerjaan                      │
│ 📅 Senin, 27 Apr 2026 • 08:00 WIB       │
│ ⏱️ Durasi: 8 jam (tukang harian)         │
│                                          │
├──────────────────────────────────────────┤
│ Rp 150.000                  [Detail →]   │
└──────────────────────────────────────────┘
```

### 3.2 Card Spec

**Container:**
- Background: white
- Border radius: 16px
- Padding: 16px
- Margin: 0 16px 12px
- Shadow: subtle (0 2px 8px rgba(0,0,0,0.08))
- Border: 1px #F3F4F6

**Service Icon:**
- Size: 48px circle
- Background: warna per kategori
- Emoji icon di dalam

**Service Name:**
- Font: Poppins_700Bold, 16px
- Color: #111827

**Status Badge:**
- Posisi: kanan atas
- Shape: pill (border radius 12px)
- Padding: 4px 10px

Status badge colors:

| Status | Label | BG Color | Text Color |
|---|---|---|---|
| pending_payment | Menunggu Pembayaran | #FEF3C7 | #D97706 |
| pending_survey | Menunggu Survey | #DBEAFE | #2563EB |
| pending_assignment | Mencari Tukang | #EDE9FE | #7C3AED |
| on_survey | Survey Berlangsung | #DCFCE7 | #16A34A |
| on_progress | Sedang Dikerjakan | #DCFCE7 | #16A34A |
| waiting_payment_final | Menunggu Pelunasan | #FEF3C7 | #D97706 |
| completed | Selesai | #F3F4F6 | #6B7280 |
| cancelled | Dibatalkan | #FEE2E2 | #DC2626 |

**Order Code:**
- Font: Poppins_500Medium, 13px
- Color: #6B7280
- Format: "#KGO-2026-0001"

**Address:**
- Icon: 📍
- Font: Poppins_400Regular, 14px
- Color: #374151
- Max 1 line, ellipsis

**Date:**
- Icon: 📅
- Font: Poppins_400Regular, 14px
- Color: #374151
- Label berbeda per order type:
  - Tukang Harian/Perbaikan: "Jadwal: {tanggal}"
  - Borongan: "Survey: {tanggal}"

**Duration (hanya untuk tukang harian):**
- Icon: ⏱️
- Font: Poppins_400Regular, 14px

**Divider:**
- Height: 1px
- Color: #F3F4F6
- Margin: 12px 0

**Footer:**
- Left: Total amount (Poppins_700Bold, 16px, merah #E8272A)
- Right: Button "Detail →" (Poppins_600SemiBold, 14px, merah, border merah)

---

## 4. Tab Content Mapping

### Tab: Rencana

Order dengan status:
- `pending_payment` — Belum bayar
- `pending_survey` — Sudah bayar, tunggu survey
- `pending_assignment` — Tunggu tukang assigned

Sort: Terbaru di atas (created_at DESC)

### Tab: Aktif

Order dengan status:
- `on_survey` — Tukang sedang survey
- `on_progress` — Tukang sedang mengerjakan
- `waiting_payment_final` — Pekerjaan selesai, tunggu pelunasan

Sort: Updated terbaru di atas

### Tab: Arsip

Order dengan status:
- `completed` — Selesai dan lunas
- `cancelled` — Dibatalkan user
- `rejected` — Ditolak sistem

Sort: completed_at atau cancelled_at DESC

---

## 5. API Integration

### 5.1 GET /api/v1/orders

Request params:
```
GET /api/v1/orders?tab=rencana
GET /api/v1/orders?tab=aktif
GET /api/v1/orders?tab=arsip
```

Response:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "order_code": "KGO-2026-0001",
      "order_type": "tukang_harian",
      "category": null,
      "status": "pending_assignment",
      "service": {
        "id": 1,
        "name": "Jagoan Cat",
        "icon_color": "#DC2626"
      },
      "address": "Jl. Merdeka No. 10, Jakarta",
      "work_scheduled_at": "2026-04-27T08:00:00Z",
      "survey_scheduled_at": null,
      "duration_hours": 8,
      "total_amount": 150000,
      "created_at": "2026-04-22T10:00:00Z"
    },
    {
      "id": 2,
      "order_code": "KGO-2026-0002",
      "order_type": "borongan",
      "category": "rumah",
      "status": "pending_payment",
      "service": null,
      "address": "Jl. Sudirman No. 45, Jakarta",
      "work_scheduled_at": null,
      "survey_scheduled_at": "2026-04-28T10:00:00Z",
      "duration_hours": null,
      "total_amount": 100000,
      "created_at": "2026-04-22T09:00:00Z"
    }
  ],
  "meta": {
    "total": 2,
    "tab_counts": {
      "rencana": 2,
      "aktif": 0,
      "arsip": 0
    }
  }
}
```

### 5.2 Backend Controller

```php
public function index(Request $request)
{
    $user = $request->user();
    $tab = $request->query('tab', 'rencana');
    
    $statusMap = [
        'rencana' => ['pending_payment', 'pending_survey', 'pending_assignment'],
        'aktif' => ['on_survey', 'on_progress', 'waiting_payment_final'],
        'arsip' => ['completed', 'cancelled', 'rejected'],
    ];
    
    $statuses = $statusMap[$tab] ?? $statusMap['rencana'];
    
    $orders = Order::where('customer_id', $user->id)
        ->whereIn('status', $statuses)
        ->with(['service'])
        ->orderBy('created_at', 'desc')
        ->get();
    
    $tabCounts = [
        'rencana' => Order::where('customer_id', $user->id)
            ->whereIn('status', $statusMap['rencana'])->count(),
        'aktif' => Order::where('customer_id', $user->id)
            ->whereIn('status', $statusMap['aktif'])->count(),
        'arsip' => Order::where('customer_id', $user->id)
            ->whereIn('status', $statusMap['arsip'])->count(),
    ];
    
    return response()->json([
        'success' => true,
        'data' => $orders,
        'meta' => [
            'total' => $orders->count(),
            'tab_counts' => $tabCounts,
        ],
    ]);
}
```

---

## 6. Navigation Flow

```
Bottom Nav "Pesanan"
└── Halaman Pesanan
    ├── Tab Rencana (default)
    │   ├── Empty State: Belum Ada Proyek
    │   └── Order List
    │       └── Tap "Detail →" → Order Detail Page
    ├── Tab Aktif
    │   ├── Empty State: Tidak Ada Pesanan Aktif
    │   └── Order List
    │       └── Tap "Detail →" → Order Detail Page
    └── Tab Arsip
        ├── Empty State: Belum Ada Arsip
        └── Order List
            └── Tap "Detail →" → Order Detail Page
```

---

## 7. Acceptance Criteria

### Header
- [ ] Title "Pesanan" center
- [ ] Search icon kanan atas
- [ ] Background putih, border bottom

### Tab Bar
- [ ] 3 tabs: Rencana, Aktif, Arsip
- [ ] Active tab: merah, underline indicator
- [ ] Inactive tab: abu
- [ ] Switch tab dengan tap

### Warning Banner
- [ ] Tampil di semua tab
- [ ] Text center
- [ ] "Mohon tidak bertransaksi di luar aplikasi"

### Empty State
- [ ] Ilustrasi open box + arrow
- [ ] Title & subtitle sesuai per tab
- [ ] Posisi center screen

### Order Card
- [ ] Icon service + nama layanan
- [ ] Status badge dengan warna sesuai
- [ ] Order code, address, date tampil
- [ ] Duration tampil (jika tukang harian)
- [ ] Total amount merah
- [ ] Button "Detail →"
- [ ] Tap card/button → navigate ke Order Detail

### Data
- [ ] API fetch per tab
- [ ] Loading state (skeleton/spinner)
- [ ] Error state
- [ ] Pull to refresh
- [ ] Tab count update saat ada order baru

---

## 8. File Structure

```
app/
└── (tabs)/
    └── orders.tsx          ← Main orders page

components/
└── orders/
    ├── OrderCard.tsx       ← Single order card
    ├── EmptyOrders.tsx     ← Empty state component
    └── WarningBanner.tsx   ← Top warning text

services/
└── api/
    └── orders.ts           ← getOrders(tab)
```

---

**Version:** 1.0.0
**Last updated:** 2026-04-22