# PRD 17 — Halaman Promo (Voucher Page)

> Halaman promo untuk input kode voucher dan lihat daftar voucher aktif user.
> Referensi visual: screenshot GoKang "Promo" page.

---

## 1. Overview

Halaman Promo memungkinkan user untuk:
1. Input kode promo manual
2. Melihat daftar voucher yang sudah dimiliki/aktif
3. State kosong jika belum ada voucher

**Flow:**
```
Bottom Nav → Tap "Promo" → Halaman Promo
  ├── Input kode promo → Validasi → Voucher ditambahkan ke list
  └── List voucher aktif (atau empty state)
```

---

## 2. Screen Layout

### 2.1 Overview

```
┌─────────────────────────────────────┐
│              Promo                  │ ← Header center
├─────────────────────────────────────┤
│                                     │
│ 🏷️  Masukkan kode promo disini   >  │ ← Input bar (tap to open modal)
│                                     │
├─────────────────────────────────────┤
│                                     │
│    [STATE KOSONG atau LIST]         │
│                                     │
└─────────────────────────────────────┘
```

---

## 3. Component Specs

### 3.1 Header

**Spec:**
- Title: "Promo" — center
- Font: Poppins_700Bold, 18px
- Color: #111827
- Background: white
- Border bottom: 1px #E5E7EB
- Padding top: safe area (48px)
- No back button (ini tab page)

---

### 3.2 Promo Code Input Bar

```
┌──────────────────────────────────────────┐
│ 🏷️  Masukkan kode promo disini        >  │
└──────────────────────────────────────────┘
```

**Spec:**
- Shape: pill / capsule (border radius 28px)
- Border: 1px #E5E7EB
- Background: white
- Padding: 14px 20px
- Margin: 16px
- Height: 56px

**Content:**
- Left: Badge icon 🏷️ (dark red/maroon badge dengan %)
  - Size: 32px
  - Emoji: 🏷️ atau custom view dengan badge merah gelap
- Text: "Masukkan kode promo disini"
  - Font: Poppins_500Medium, 15px
  - Color: #111827
- Right: Chevron → (ChevronRight icon)
  - Color: #9CA3AF
  - Size: 20px

**Behavior:**
- Seluruh bar adalah TouchableOpacity
- onPress → buka modal input kode promo

**Style (match screenshot):**
- Shadow sangat subtle (bukan card yang menonjol)
- Border tipis, background putih
- Margin horizontal 16px

---

### 3.3 STATE KOSONG (Empty State)

Tampil saat user tidak punya voucher aktif.

```
┌─────────────────────────────────────┐
│                                     │
│                                     │
│         [Ilustrasi Open Box]        │
│         Kotak merah terbuka         │
│         + Panah biru diagonal       │
│                                     │
│         Belum Ada Voucher           │
│                                     │
│  Kamu belum memiliki voucher aktif  │
│      yang dapat digunakan           │
│                                     │
└─────────────────────────────────────┘
```

**Ilustrasi:**
- Identik dengan empty state di halaman Pesanan
- Kotak 3D merah (#E8272A) terbuka
- Panah biru diagonal ke kanan atas
- Size: 200×200px
- Posisi: center horizontal, ~40% dari atas area kosong

**Text:**
- Title: "Belum Ada Voucher"
  - Font: Poppins_700Bold, 20px
  - Color: #111827
  - Margin bottom: 12px
- Subtitle: "Kamu belum memiliki voucher aktif yang dapat digunakan"
  - Font: Poppins_400Regular, 15px
  - Color: #6B7280
  - Text align: center
  - Line height: 22px
  - Max width: 280px

---

### 3.4 STATE ADA VOUCHER (Voucher List)

Tampil setelah user berhasil input kode promo atau memiliki voucher aktif.

```
┌─────────────────────────────────────────────┐
│ ┌─────────────────────────────────────────┐ │
│ │ 🎫  SURVEY60                            │ │
│ │                                         │ │
│ │  Diskon 60% Biaya Survey                │ │
│ │  Hemat hingga Rp 150.000                │ │
│ │                                         │ │
│ │  Berlaku untuk: Borongan Rumah/Bisnis   │ │
│ │  Minimal order: Rp 100.000             │ │
│ │  Berlaku hingga: 31 Mei 2026           │ │
│ │                                         │ │
│ │  ░░░░░░░░░░░░░░░░░░░░░░░░░░░ [Pakai]  │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ ┌─────────────────────────────────────────┐ │
│ │ 🎫  NEWUSER150                          │ │
│ │                                         │ │
│ │  Diskon Rp 150.000 untuk Pengguna Baru  │ │
│ │  ...                                    │ │
│ │                                         │ │
│ │  ░░░░░░░░░░░░░░░░░░░░░░░░░░░ [Pakai]  │ │
│ └─────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

---

## 4. Voucher Card Component

### 4.1 Layout

```
┌──────────────────────────────────────────────┐
│  [Left accent]  │  [Content]                 │
│                 │                            │
│  Merah solid    │  Code: SURVEY60            │
│  8px width      │  Nama: Diskon 60% Survey   │
│  full height    │  Hemat: Rp 150.000         │
│                 │                            │
│                 │  ─────────────────         │ ← Dashed divider
│                 │                            │
│                 │  📋 Berlaku untuk: ...     │
│                 │  📋 Min. order: Rp X       │
│                 │  📅 Berlaku hingga: ...    │
│                 │                            │
│ [──────── Dashed separator ────────]        │
│                                              │
│              [Gunakan Voucher]               │ ← Full width button
└──────────────────────────────────────────────┘
```

### 4.2 Card Spec

**Container:**
- Background: white
- Border radius: 16px
- Margin: 0 16px 12px
- Shadow: 0 2px 8px rgba(0,0,0,0.08)
- Border: 1px #F3F4F6
- Overflow: hidden

**Left Accent Bar:**
- Width: 8px
- Height: 100%
- Background: #E8272A

**Main Content (padding 16px):**

**Voucher Code:**
- Font: Poppins_800ExtraBold, 18px
- Color: #E8272A
- Letter spacing: 1px
- Example: "SURVEY60"

**Voucher Name:**
- Font: Poppins_600SemiBold, 15px
- Color: #111827
- Margin top: 4px

**Discount Value:**
- Font: Poppins_400Regular, 14px
- Color: #6B7280
- Example: "Hemat hingga Rp 150.000"

**Dashed Divider:**
- Height: 1px
- Border: dashed
- Color: #E5E7EB
- Margin: 12px 0

**Details Section:**

```
📋 Berlaku untuk: Borongan Rumah & Bisnis
📋 Minimal order: Rp 100.000
📅 Berlaku hingga: 31 Mei 2026
```

- Font: Poppins_400Regular, 13px
- Color: #6B7280
- Line height: 20px
- Icon size: 14px, color abu

**Cutout/Perforation effect (opsional):**
- 2 semicircle cutout di kanan dan kiri dashed separator
- Size: 16px diameter
- Background: #F9FAFB (match screen background)
- Posisi: absolute, -8px from left dan right

**Action Button:**
- Full width dalam card
- Text: "Gunakan Voucher"
- Background: #E8272A
- Color: white
- Font: Poppins_700Bold, 15px
- Border radius: 12px (bukan pill)
- Padding: 12px
- Margin top: 12px

**Behavior onPress button:**
- Navigate ke halaman pilih order (atau booking form)
- Atau jika ada order aktif, tampilkan list order yang bisa pakai voucher

---

### 4.3 Voucher State Variants

**State: Aktif (Normal)**
- Left bar: merah #E8272A
- Background: white
- Button: merah solid

**State: Hampir Expired (< 3 hari)**
- Left bar: orange #F97316
- Badge "Segera Berakhir" di kanan atas
- Background: white

**State: Expired/Tidak Valid**
- Left bar: abu #9CA3AF
- Seluruh teks abu
- Button: abu, text "Tidak Dapat Digunakan"
- Opacity: 0.7

---

## 5. Modal: Input Kode Promo

Muncul saat tap bar "Masukkan kode promo disini".

```
┌─────────────────────────────────────┐
│          Masukkan Kode Promo        │
│                                     │
│  ┌────────────────────────────────┐ │
│  │ Kode Promo                     │ │
│  └────────────────────────────────┘ │
│                                     │
│  [      Gunakan Kode Promo       ] │
│                                     │
│ Syarat & ketentuan berlaku          │
└─────────────────────────────────────┘
```

**Modal Style:**
- Type: Bottom Sheet (slide up dari bawah)
- Height: 40% atau auto-size
- Border radius top: 24px
- Background: white
- Handle bar di atas (gray pill)

**Content:**
- Title: "Masukkan Kode Promo"
  - Font: Poppins_700Bold, 18px
  - Margin bottom: 20px

- Text Input:
  - Placeholder: "Kode Promo"
  - Border: 1.5px #D1D5DB
  - Border radius: 12px
  - Padding: 16px
  - Font: Poppins_500Medium, 16px
  - Auto UPPERCASE saat typing
  - autoCapitalize: 'characters'
  - Background: white

- Button "Gunakan Kode Promo":
  - Full width
  - Background: merah (atau abu jika input kosong)
  - Border radius: 28px
  - Padding: 16px
  - Font: Poppins_700Bold, 16px
  - Disabled jika input kosong
  - onPress → validate promo code API

- Note "Syarat & ketentuan berlaku":
  - Font: Poppins_400Regular, 12px
  - Color: #9CA3AF
  - Text align: center
  - Margin top: 12px

**Loading state saat validasi:**
- Button berubah jadi spinner
- Input disabled

**Success state:**
- Modal close
- Voucher ditambahkan ke list
- Toast/Alert: "Kode promo berhasil digunakan!"

**Error state:**
- Shake animation pada input
- Text error merah di bawah input
- Contoh error: "Kode promo tidak valid atau sudah kedaluwarsa"

---

## 6. API Integration

### 6.1 GET /api/v1/vouchers

Fetch voucher aktif milik user.

Response:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "code": "SURVEY60",
      "name": "Diskon 60% Biaya Survey",
      "description": "Hemat hingga Rp 150.000 untuk biaya survey",
      "discount_type": "percentage",
      "discount_value": 60,
      "max_discount": 150000,
      "min_order": 100000,
      "applicable_for": ["borongan_rumah", "borongan_bisnis"],
      "expires_at": "2026-05-31T23:59:59Z",
      "is_active": true,
      "is_used": false
    },
    {
      "id": 2,
      "code": "NEWUSER150",
      "name": "Diskon Pengguna Baru",
      "description": "Dapatkan diskon Rp 150.000 untuk order pertama",
      "discount_type": "fixed",
      "discount_value": 150000,
      "max_discount": 150000,
      "min_order": 200000,
      "applicable_for": ["all"],
      "expires_at": "2026-06-30T23:59:59Z",
      "is_active": true,
      "is_used": false
    }
  ]
}
```

### 6.2 POST /api/v1/vouchers/redeem

Input kode promo untuk menambahkan ke akun user.

Request:
```json
{ "code": "SURVEY60" }
```

Response (success):
```json
{
  "success": true,
  "message": "Kode promo berhasil ditambahkan!",
  "data": {
    "id": 1,
    "code": "SURVEY60",
    "name": "Diskon 60% Biaya Survey",
    "discount_type": "percentage",
    "discount_value": 60,
    "max_discount": 150000,
    "expires_at": "2026-05-31T23:59:59Z"
  }
}
```

Response (error):
```json
{
  "success": false,
  "message": "Kode promo tidak valid atau sudah kedaluwarsa"
}
```

### 6.3 Backend Controller

```php
public function index(Request $request)
{
    $user = $request->user();
    
    $vouchers = $user->vouchers()
        ->where('is_active', true)
        ->where('is_used', false)
        ->where(function($q) {
            $q->whereNull('expires_at')
              ->orWhere('expires_at', '>', now());
        })
        ->get();
    
    return response()->json([
        'success' => true,
        'data' => $vouchers,
    ]);
}

public function redeem(Request $request)
{
    $request->validate(['code' => 'required|string|uppercase']);
    
    $voucher = Voucher::where('code', $request->code)
        ->where('is_active', true)
        ->where(function($q) {
            $q->whereNull('expires_at')
              ->orWhere('expires_at', '>', now());
        })
        ->first();
    
    if (!$voucher) {
        return response()->json([
            'success' => false,
            'message' => 'Kode promo tidak valid atau sudah kedaluwarsa',
        ], 422);
    }
    
    // Check if user already has this voucher
    $user = $request->user();
    if ($user->vouchers()->where('voucher_id', $voucher->id)->exists()) {
        return response()->json([
            'success' => false,
            'message' => 'Kode promo sudah pernah digunakan',
        ], 422);
    }
    
    // Attach voucher to user
    $user->vouchers()->attach($voucher->id);
    
    return response()->json([
        'success' => true,
        'message' => 'Kode promo berhasil ditambahkan!',
        'data' => $voucher,
    ]);
}
```

---

## 7. Navigation Flow

```
Bottom Nav "Promo"
└── Halaman Promo
    ├── Empty State (tidak ada voucher)
    │   └── Tap Input Bar → Modal Input Kode
    │       ├── Input kode → tap "Gunakan"
    │       ├── Valid → Voucher tambah ke list → Modal close
    │       └── Invalid → Error message di modal
    │
    └── Voucher List (ada voucher)
        ├── Tap Input Bar → Modal Input Kode (tambah voucher baru)
        └── Tap "Gunakan Voucher" di card
            └── Navigate ke halaman pilih booking
                └── Voucher di-apply ke order
```

---

## 8. Acceptance Criteria

### Layout
- [ ] Header "Promo" center, border bottom
- [ ] Input bar: pill shape, icon badge, text, chevron
- [ ] Empty state: ilustrasi box + "Belum Ada Voucher"
- [ ] Voucher card: left accent bar merah, code, name, details, button

### Modal Input
- [ ] Slide up dari bawah (bottom sheet)
- [ ] Input auto uppercase
- [ ] Button disabled jika kosong
- [ ] Loading saat validasi
- [ ] Success: modal close, voucher muncul di list
- [ ] Error: pesan error di bawah input

### Voucher Card
- [ ] Code tebal merah (#E8272A)
- [ ] Nama voucher
- [ ] Nilai diskon/hemat
- [ ] Dashed separator
- [ ] Detail (berlaku untuk, min order, expired)
- [ ] Button "Gunakan Voucher"
- [ ] State expired: tampil abu, disabled

### API
- [ ] Fetch voucher user saat buka halaman
- [ ] POST redeem kode promo
- [ ] Handle error response
- [ ] Pull to refresh

---

## 9. File Structure

```
app/
└── (tabs)/
    └── promo.tsx           ← Main promo page

components/
└── promo/
    ├── PromoInputBar.tsx   ← Tap to open modal
    ├── PromoCodeModal.tsx  ← Bottom sheet input kode
    ├── VoucherCard.tsx     ← Single voucher card
    └── EmptyVoucher.tsx    ← Empty state

services/
└── api/
    └── vouchers.ts         ← getVouchers, redeemVoucher
```

---

**Version:** 1.0.0
**Last updated:** 2026-04-22