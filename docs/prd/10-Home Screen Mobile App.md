# PRD 10 — Home Screen Mobile App

> Halaman utama setelah user login: search, kategori layanan (Borongan vs Harian), promo, artikel, dan quick actions.
> Referensi visual: screenshot GoKang homepage.

---

## 1. Overview

Home screen adalah **landing page** setelah login — tempat user:
- Cari layanan (search)
- Pilih kategori: Borongan (Full Service) vs Tukang Harian
- Lihat promo/banner
- Chat CS untuk konsultasi
- Baca artikel/tips

**Layout Scroll:** Header sticky → Info banner → Categories → Promo slider → CS card → Articles

---

## 2. Screen Layout — Home (Beranda Tab)

### 2.1 Header (Sticky Top)

```
┌────────────────────────────────────────────┐
│ 🔍 [Pasang Keramik...       ] ❤️  🔔      │  ← Sticky saat scroll
└────────────────────────────────────────────┘
```

**Components:**

**Search Bar:**
- Width: full minus 80px (space untuk icon kanan)
- Height: 48px
- Background: putih
- Border radius: 24px (pill shape)
- Icon: 🔍 kiri (padding-left 16px)
- Placeholder: "Pasang Keramik, Cat Rumah, dll" (abu #9CA3AF)
- onTap: navigate ke Search screen (bukan filter inline)
- Shadow: subtle drop shadow

**Icon Wishlist (❤️):**
- Position: kanan search bar, margin-left 12px
- Icon: heart outline (lucide: Heart)
- Warna: putih (karena background merah)
- Size: 24px
- onTap: navigate ke Wishlist screen (list layanan favorit)
- Badge count kalau ada item di wishlist (circle merah kecil)

**Icon Notifikasi (🔔):**
- Position: paling kanan, margin-left 12px
- Icon: bell outline (lucide: Bell)
- Warna: putih
- Size: 24px
- onTap: navigate ke Notifications screen
- Badge count kalau ada notif unread (circle merah dengan angka)

**Background Header:**
- Gradient merah: dari #E8272A (atas) ke #FF6B6B (tengah), fade ke putih (bawah)
- Height total header: 120px (search bar + padding + gradient fade)
- Safe area padding top

---

### 2.2 Info Banner (Conditional)

```
┌──────────────────────────────────────────────────┐
│ 🕐  Untuk kedatangan besok, pesan sebelum jam    │
│     3 sore                                        │
└──────────────────────────────────────────────────┘
```

**Spec:**
- Background: #DBEAFE (biru muda terang)
- Border: 1px solid #93C5FD (biru lebih gelap)
- Border radius: 12px
- Padding: 12px horizontal, 10px vertical
- Icon: clock (🕐) kiri, size 20px
- Text: 14px, regular, hitam #111827
- Margin: 16px horizontal dari edge

**Logic:**
- Tampil hanya kalau waktu server < 15:00 WIB
- Kalau jam > 15:00 → tampilkan: "Pesan sekarang untuk kedatangan lusa"
- Bisa di-dismiss dengan icon X kecil di kanan (simpan flag ke AsyncStorage)

---

### 2.3 Section: Borongan (Full Service)

```
┌────────────────────────────────────────────┐
│ Borongan (Full Service) 🏡                  │
│ Survey + Jasa + Material + Pengawasan       │
│                                             │
│  ┌──────────────┐  ┌──────────────┐        │
│  │ [🏠 Rumah]   │  │ [🏢 Bisnis]  │        │
│  │              │  │              │        │
│  │ Untuk        │  │ Untuk        │        │
│  │ Rumah        │  │ Bisnis       │        │
│  └──────────────┘  └──────────────┘        │
└────────────────────────────────────────────┘
```

**Heading:**
- Text: "Borongan (Full Service)" + emoji 🏡
- Font: 20px, bold, hitam #111827
- Margin top: 24px dari info banner

**Subheading:**
- Text: "Survey + Jasa + Material + Pengawasan"
- Font: 14px, regular, abu #6B7280
- Margin top: 4px

**Cards (2 cards horizontal):**
- Layout: row, gap 12px, padding-x 16px
- Setiap card:
  - Flex: 1 (equal width)
  - Aspect ratio: ~1:1 (sedikit landscape)
  - Border radius: 16px
  - Shadow: medium
  
  Card 1 — Untuk Rumah:
  - Background: gradient pink (#FEE2E2 → #FCA5A5)
  - Ilustrasi: rumah merah dengan atap segitiga (emoji 🏠 atau custom SVG)
  - Text: "Untuk\nRumah" — font 18px bold hitam, align left-bottom
  - Padding: 16px
  - onTap: navigate ke Service List screen dengan filter order_type=borongan + category=rumah

  Card 2 — Untuk Bisnis:
  - Background: gradient biru (#DBEAFE → #93C5FD)
  - Ilustrasi: gedung/office (emoji 🏢)
  - Text: "Untuk\nBisnis"
  - onTap: navigate ke Service List dengan filter order_type=borongan + category=bisnis

---

### 2.4 Section: Tukang Harian

```
┌────────────────────────────────────────────┐
│ Tukang Harian 👷                            │
│ Pekerjaan kecil tanpa survey                │
│                                             │
│  ┌──────────────┐  ┌──────────────┐        │
│  │ [👷 Tukang]  │  │ [🔧 Perbaik] │        │
│  │              │  │              │        │
│  │ Pesan Tukang │  │ Layanan      │        │
│  │ Saja         │  │ Perbaikan    │        │
│  │              │  │ + Material   │        │
│  └──────────────┘  └──────────────┘        │
└────────────────────────────────────────────┘
```

**Heading:**
- Text: "Tukang Harian 👷"
- Font: 20px, bold, hitam
- Margin top: 32px dari section sebelumnya

**Subheading:**
- Text: "Pekerjaan kecil tanpa survey"
- Font: 14px, regular, abu

**Cards (2 cards horizontal):**

Card 1 — Pesan Tukang Saja:
- Background: gradient hijau terang (#D1FAE5 → #6EE7B7)
- Ilustrasi: siluet tukang dengan target (emoji 👷 atau icon)
- Text: "Pesan Tukang\nSaja" — bold hitam
- onTap: navigate ke Service List dengan filter order_type=daily + materials=false

Card 2 — Layanan Perbaikan + Material:
- Background: gradient krem/kuning terang (#FEF3C7 → #FDE68A)
- Ilustrasi: toolbox merah dengan tools (🔧🔨)
- Text: "Layanan\nPerbaikan\n+ Material" (text merah untuk "Material")
- onTap: navigate ke Service List dengan filter order_type=daily + materials=true

---

### 2.5 Promo Banner Slider

```
┌────────────────────────────────────────────┐
│ [                                      ]    │
│ [   Layanan Borongan Full Service     ]    │
│ [   Tersedia Mulai 22 Mei 2025        ] ← Swipeable
│ [   👉 Pesan Sekarang                 ]    │
│                                             │
│           • • ● • •                         │  ← Dot indicator
└────────────────────────────────────────────┘
```

**Spec:**
- Horizontal scroll (swipeable)
- Auto-play: slide tiap 5 detik
- Dot indicator di bawah (active dot merah #E8272A)
- Margin top: 24px dari section Tukang Harian

**Banner Card:**
- Width: screen width - 32px (padding 16px kiri-kanan)
- Height: 180px
- Border radius: 16px
- Shadow: medium
- Background: gradient merah-oranye ATAU image dari backend
- Text overlay:
  - Badge "NEW UPDATE" kiri atas (putih bg + merah border)
  - Heading: "Layanan Borongan (Full Service)" — putih bold 24px
  - Subheading: "Tersedia Mulai 22 Mei 2025" — kuning bg + hitam text
  - CTA: "Pesan Sekarang →" — putih bold
- onTap: navigate ke promo detail atau service list borongan

**Data Source:**
- Fetch dari API: GET /api/v1/banners?position=home
- Cache di local selama 1 jam
- Kalau API fail → tampilkan banner static (hard-coded 1 promo default)

---

### 2.6 CS Consultation Card (Conditional)

```
┌────────────────────────────────────────────┐
│  👤 Ada Pertanyaan? 💬                      │
│     Yuk, konsultasi langsung dengan kami!   │
│                                             │
│     ┌──────────────────────────┐            │
│     │   Chat Sekarang          │            │
│     └──────────────────────────┘            │
└────────────────────────────────────────────┘
```

**Spec:**
- Background: gradient pink terang (#FEE2E2 → #FECACA)
- Border: 1px solid #FCA5A5
- Border radius: 16px
- Padding: 16px
- Margin: 24px horizontal, 24px top dari promo banner

**Components:**
- Avatar: circle 48px dengan icon CS / foto CS (placeholder)
- Badge hijau kecil di pojok avatar (online status)
- Heading: "Ada Pertanyaan? 💬" — bold 16px hitam
- Subheading: "Yuk, konsultasi langsung dengan kami!" — 14px abu
- Button: "Chat Sekarang" — outline merah, background putih, pill shape
  - onTap: buka WhatsApp dengan nomor CS GoKang (deep link)
    ```
    whatsapp://send?phone=628123456789&text=Halo,%20saya%20mau%20konsultasi
    ```
  - Kalau WhatsApp tidak terinstall: fallback ke web.whatsapp.com

**Logic Tampil:**
- Tampil hanya kalau user belum punya order aktif (status pending/ongoing)
- Kalau sudah punya order → hide card ini, user bisa chat via order detail

---

### 2.7 Articles Section ("Bacaan Buat Kamu")

```
┌────────────────────────────────────────────┐
│ Bacaan Buat Kamu 🤩            Lihat semua  │
│ Rekomendasi untuk bacaan kamu               │
│                                             │
│  ┌─────────────────────────┐                │
│  │ [Photo tools/project]   │                │
│  │                         │                │
│  │ Bapak di Rumah Wajib    │ ← Swipeable
│  │ Punya 9+ Alat...        │   horizontal
│  │                         │
│  │ Memiliki perkakas dasar │
│  │ di rumah sangat memb... │
│  │                         │
│  │ ┌─────────────────────┐ │
│  │ │ Baca Selengkapnya   │ │
│  │ └─────────────────────┘ │
│  └─────────────────────────┘
└────────────────────────────────────────────┘
```

**Heading:**
- Text: "Bacaan Buat Kamu 🤩" (kiri) + "Lihat semua" (kanan, merah, 14px)
- Font heading: 20px bold hitam
- Margin top: 32px dari CS card

**Subheading:**
- Text: "Rekomendasi untuk bacaan kamu"
- Font: 14px regular abu
- Margin top: 4px

**Article Cards:**
- Layout: horizontal scroll (FlatList horizontal)
- Gap: 12px antar card
- Padding kiri: 16px, padding kanan: 16px

**Single Article Card:**
- Width: 280px (fixed, tidak full screen)
- Border radius: 16px
- Background: putih
- Shadow: medium
- Overflow: hidden (supaya image rounded top)

Components per card:
1. **Image (top):**
   - Height: 160px
   - Width: full
   - Object-fit: cover
   - Source: artikel.featured_image dari API

2. **Content (padding 16px):**
   - Title: 2 lines max, ellipsis
     Font: 16px bold hitam
     Margin bottom: 8px
   
   - Snippet: 3 lines max, ellipsis
     Font: 14px regular abu #6B7280
     Margin bottom: 12px

3. **Button "Baca Selengkapnya":**
   - Background: merah #E8272A
   - Text: putih, 14px bold
   - Height: 40px
   - Border radius: 20px (pill)
   - Full width
   - onTap: navigate ke Article Detail screen dengan artikel.id

**Data Source:**
- API: GET /api/v1/articles?featured=true&limit=5
- Show 5 artikel terbaru yang di-featured
- Cache 1 jam
- Kalau API fail → hide section ini (graceful degradation)

---

### 2.8 Bottom Navigation Bar

```
┌────────────────────────────────────────────┐
│  🏠         📋        🎁       💬       👤  │
│ Beranda   Pesanan   Promo    Chat    Akun  │
└────────────────────────────────────────────┘
```

**5 Tabs:**

1. **Beranda** (aktif):
   - Icon: home solid (lucide: Home)
   - Color: merah #E8272A
   - Label: "Beranda" merah bold

2. **Pesanan**:
   - Icon: clipboard-list outline
   - Color: abu #9CA3AF (inactive)
   - Label: "Pesanan" abu
   - Badge count kalau ada order pending (angka kecil merah)
   - onTap: navigate ke Orders List screen

3. **Promo**:
   - Icon: ticket outline
   - Color: abu
   - Label: "Promo"
   - onTap: navigate ke Promos screen (list voucher aktif)

4. **Chat**:
   - Icon: message-circle outline
   - Color: abu
   - Label: "Chat"
   - Badge count kalau ada chat unread
   - onTap: navigate ke Chat List screen (list percakapan dengan tukang/CS)

5. **Akun**:
   - Icon: user outline
   - Color: abu
   - Label: "Akun"
   - onTap: navigate ke Profile screen

**Style:**
- Height: 64px + safe area bottom
- Background: putih
- Border top: 1px solid #E5E7EB
- Shadow: top shadow subtle
- Icon size: 24px
- Label font: 12px

---

## 3. Interactions & Behavior

### 3.1 Pull to Refresh
- Swipe down dari top (saat scroll position = 0)
- Tampilkan spinner
- Re-fetch:
  - Banners
  - Articles
  - Unread notification count
  - User profile (untuk greeting "Halo, [Nama]")
- Update UI setelah semua data ter-load

### 3.2 Scroll Behavior
- Header search bar **sticky** — tetap di top saat scroll
- Gradient header fade out saat scroll lebih dari 80px
- Bottom nav **always visible** (sticky bottom)

### 3.3 Deep Links
Home screen harus handle deep link:
- `gokang://home` → scroll to top
- `gokang://home/promo/{id}` → auto-scroll ke banner, auto-open promo detail
- `gokang://home/article/{id}` → navigate ke article detail

### 3.4 Loading States
- Skeleton placeholders untuk:
  - Promo banner (3 card placeholder)
  - Article cards (3 card placeholder)
- Tampilkan skeleton saat first load, hide setelah data ready

### 3.5 Error States
- Kalau API banners fail → tampilkan 1 banner static default
- Kalau API articles fail → hide section "Bacaan Buat Kamu"
- Kalau network error total → tampilkan ilustrasi + text "Tidak ada koneksi" + button "Coba Lagi"

---

## 4. API Integration

### 4.1 Endpoints

**GET /api/v1/home/data**
Response:
```json
{
  "success": true,
  "data": {
    "user": {
      "name": "Sari",
      "avatar": null
    },
    "banners": [
      {
        "id": 1,
        "title": "Layanan Borongan Full Service",
        "subtitle": "Tersedia Mulai 22 Mei 2025",
        "image_url": "https://...",
        "cta_text": "Pesan Sekarang",
        "cta_url": "/services?type=borongan"
      }
    ],
    "articles": [
      {
        "id": 1,
        "title": "Bapak di Rumah Wajib Punya 9+ Alat Pertukangan",
        "snippet": "Memiliki perkakas dasar di rumah sangat membantu...",
        "featured_image": "https://...",
        "slug": "alat-pertukangan-wajib"
      }
    ],
    "counts": {
      "unread_notifications": 3,
      "pending_orders": 1,
      "unread_chats": 0
    }
  }
}
```

**GET /api/v1/services?order_type=borongan&category=rumah**
List services untuk kategori tertentu.

**GET /api/v1/articles/{id}**
Detail artikel untuk dibaca.

### 4.2 Caching Strategy
- Home data: cache 5 menit (auto-refresh saat buka app kalau > 5 menit)
- Banners: cache 1 jam
- Articles: cache 1 jam
- Counts (notif, order, chat): no cache, always fresh

---

## 5. Navigation Flow

```
Home Screen
├── Tap Search Bar → Search Screen (input + hasil)
├── Tap Wishlist Icon → Wishlist Screen (list favorit)
├── Tap Bell Icon → Notifications Screen
├── Tap "Untuk Rumah" → Service List (filter borongan + rumah)
├── Tap "Untuk Bisnis" → Service List (filter borongan + bisnis)
├── Tap "Pesan Tukang Saja" → Service List (filter harian)
├── Tap "Layanan Perbaikan + Material" → Service List (filter harian + material)
├── Tap Banner → Promo Detail / Service List
├── Tap "Chat Sekarang" → WhatsApp deep link
├── Tap Article Card → Article Detail Screen
├── Tap "Lihat semua" (articles) → Articles List Screen
├── Bottom Nav: Pesanan → Orders List
├── Bottom Nav: Promo → Promos List
├── Bottom Nav: Chat → Chat List
└── Bottom Nav: Akun → Profile Screen
```

---

## 6. Special Features

### 6.1 Personalization (Future)
- Greeting: "Selamat pagi, Sari!" (berdasarkan waktu)
- "Terakhir kamu cari: Pasang Keramik" (dari search history)
- "Layanan Populer di Daerahmu" (berdasarkan location)

### 6.2 Smart Recommendations
- Kalau user pernah pesan "Jagoan Cat" → recommend artikel tentang cat
- Kalau ada promo voucher berlaku hari ini → tampilkan banner khusus

### 6.3 Emergency Hotline
- Floating button kanan bawah (di atas bottom nav)
- Icon: phone dengan pulse animation
- Text: "Hubungi CS"
- onTap: langsung call/WhatsApp CS
- Tampil hanya kalau user punya order status ongoing

---

## 7. Acceptance Criteria

### UI/UX
- [ ] Header sticky dengan gradient merah ke putih
- [ ] Search bar pill shape, shadow subtle
- [ ] Wishlist & notification icon dengan badge count
- [ ] Info banner biru muda conditional (jam < 15:00)
- [ ] 4 kategori card (2 borongan + 2 harian) dengan gradient warna berbeda
- [ ] Promo banner swipeable dengan auto-play 5 detik
- [ ] CS card dengan button WhatsApp deep link
- [ ] Article cards horizontal scroll, image + title + snippet + CTA
- [ ] Bottom nav 5 tabs dengan badge count di Pesanan & Chat
- [ ] Pull to refresh berfungsi
- [ ] Skeleton loading saat first load

### Functionality
- [ ] Tap search → navigate ke Search screen
- [ ] Tap kategori → navigate ke Service List dengan filter benar
- [ ] Tap banner → navigate ke detail/promo
- [ ] Tap "Chat Sekarang" → buka WhatsApp
- [ ] Tap article → navigate ke detail
- [ ] Bottom nav switch tab tanpa reload
- [ ] Badge count update real-time (dari API/WebSocket)

### API Integration
- [ ] Fetch home data saat mount
- [ ] Cache banners & articles 1 jam
- [ ] Re-fetch saat pull to refresh
- [ ] Handle error dengan graceful degradation
- [ ] Loading states tampil dengan benar

### Performance
- [ ] First paint < 1 detik
- [ ] Smooth scroll (60fps)
- [ ] Image lazy load untuk article cards
- [ ] Banner auto-play tidak block UI

---

**Version:** 1.0.0
**Last updated:** 2026-04-20