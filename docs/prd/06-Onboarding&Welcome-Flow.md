# PRD 06 — Onboarding & Welcome Flow

> Onboarding screens yang muncul sekali saat pertama kali buka app.
> Visual terinspirasi dari landing page gokang.id — fullscreen, bold, cinematic.
> Setelah onboarding → masuk ke auth flow (register/login).

---

## 1. Tujuan

- Menyampaikan value proposition GoKang Clone dalam 3 slide
- Membangun kesan profesional & terpercaya di first impression
- Mendorong user langsung registrasi

---

## 2. Behavior

- Tampil **HANYA sekali** — saat pertama kali install/buka app
- Setelah selesai, simpan flag `hasSeenOnboarding = true` di AsyncStorage
- Kalau flag true → skip langsung ke auth check:
  - Sudah login → Home
  - Belum login → Login screen
- User bisa **swipe** kiri-kanan antar slide
- User bisa **skip** langsung ke slide terakhir (tombol "Lewati" di pojok kanan atas)

---

## 3. Screens (3 Slides)

### Slide 1 — Hero / Tagline Utama

**Layout:**
- Background: fullscreen gambar/gradient gelap (foto tukang bekerja atau rumah yang sedang direnovasi)
- Dark overlay (50-60% opacity) supaya text terbaca
- Logo GoKang Clone di atas (putih, kecil)
- Di tengah layar:
  - Heading (bold, putih, besar, font 28-32px):
    ```
    Ciptakan Jutaan
    Pekerjaan untuk Tukang
    ```
  - Subheading (regular, putih, font 16px, opacity 80%):
    ```
    Pesan tukang terkualifikasi dengan mudah
    lewat satu aplikasi
    ```
- Dot indicator di bawah (3 dot, yang aktif = merah #E8272A, sisanya putih transparan)

**Catatan visual:**
- Nuansa: hangat, profesional, trustworthy
- Warna dominan: gelap (overlay) + putih (text) + aksen merah (dot/logo)
- Jangan terlalu ramai — biarkan gambar background + text saja

---

### Slide 2 — Value Proposition

**Layout:**
- Background: warna solid putih atau gradient sangat terang
- Di tengah layar:
  - Ilustrasi/icon besar di atas (ukuran ~200x200):
    - Bisa pakai ilustrasi tukang dengan ceklis, atau
    - 3 icon kecil horizontal: shield (garansi) + price tag (transparan) + star (rating)
  - Heading (bold, hitam, font 24-28px):
    ```
    Harga Transparan
    Pekerjaan Bergaransi
    ```
  - Subheading (regular, abu-abu, font 14-16px):
    ```
    Semua tukang sudah terverifikasi dan berpengalaman.
    Garansi 7 hari untuk setiap pekerjaan.
    ```
- 3 mini feature cards (horizontal, icon + text singkat):
  - 🔒 Harga Transparan — "Tahu biaya sebelum pesan"
  - ✅ Tukang Terverifikasi — "Profesional & berpengalaman"
  - 🛡️ Bergaransi — "7 hari garansi pekerjaan"

**Catatan visual:**
- Nuansa: bersih, terang, informatif
- Warna: putih bg + teks hitam/abu + aksen merah untuk icon

---

### Slide 3 — Call to Action

**Layout:**
- Background: gradient merah (#E8272A → #B81E21) dari atas ke bawah, atau
  fullscreen image dengan overlay merah
- Di tengah layar:
  - Ilustrasi app mockup (HP dengan preview home screen) — opsional
  - Heading (bold, putih, font 24-28px):
    ```
    Semua Beres dalam
    Satu Aplikasi
    ```
  - Subheading (regular, putih, font 14-16px, opacity 85%):
    ```
    Dari konsultasi, survey, pengerjaan
    sampai pembayaran — semua di sini
    ```
- Di bawah:
  - Primary button (putih, rounded-lg, full-width, tinggi 52px):
    - Text: **"Mulai Sekarang"** (merah, bold, font 16px)
    - onPress → navigate ke Register screen
  - Secondary link (putih, underline, margin-top 16px):
    - Text: "Sudah punya akun? **Masuk**"
    - onPress → navigate ke Login screen

**Catatan visual:**
- Nuansa: bold, energetic, actionable
- Ini slide terakhir — semua mengarah ke CTA

---

## 4. Komponen Shared

### Skip Button (Slide 1 & 2 saja)
- Posisi: pojok kanan atas, padding 16px
- Text: "Lewati" (putih di slide 1, abu-abu di slide 2)
- Font: 14px, regular
- onPress → langsung ke Slide 3

### Dot Indicator
- Posisi: center horizontal, bottom 100px dari layar (di atas button area)
- 3 dot, spacing 8px
- Active: merah #E8272A, diameter 10px
- Inactive: putih/abu transparan, diameter 8px
- Animasi: fade/scale saat swipe

### Swipe Gesture
- FlatList horizontal + pagingEnabled
- Atau library: react-native-onboarding-swiper

---

## 5. Technical Notes

### Storage Flag
```typescript
// Cek di _layout.tsx atau root navigator
const hasSeenOnboarding = await AsyncStorage.getItem('hasSeenOnboarding');
if (hasSeenOnboarding === 'true') {
  // Skip ke auth check
} else {
  // Tampilkan onboarding
}

// Setelah slide 3 CTA di-tap
await AsyncStorage.setItem('hasSeenOnboarding', 'true');
```

### Navigation Flow
```
App Launch
│
├── hasSeenOnboarding = false
│   └── Onboarding (3 slides)
│       ├── "Mulai Sekarang" → Register screen
│       └── "Masuk" → Login screen
│
├── hasSeenOnboarding = true + no token
│   └── Login screen
│
└── hasSeenOnboarding = true + has token
    └── Home screen (tabs)
```

### Assets yang Dibutuhkan
- 1 background image untuk Slide 1 (foto tukang/rumah, landscape, min 1080px)
- Ilustrasi/icon set untuk Slide 2 (bisa pakai Lucide icons atau custom SVG)
- Logo GoKang Clone (putih version, SVG/PNG)
- Opsional: app mockup image untuk Slide 3

### Animations (Nice to Have)
- Slide masuk: fade-in dari bawah (text) + scale-in (image)
- Dot indicator: spring animation saat pindah slide
- Button CTA di Slide 3: subtle pulse/glow effect

---

## 6. Acceptance Criteria

- [ ] 3 onboarding slides bisa di-swipe kiri-kanan
- [ ] Dot indicator update sesuai slide aktif
- [ ] Tombol "Lewati" di slide 1 & 2, mengarah ke slide 3
- [ ] Slide 3 punya tombol "Mulai Sekarang" → ke Register
- [ ] Slide 3 punya link "Sudah punya akun? Masuk" → ke Login
- [ ] Onboarding hanya muncul 1x (flag AsyncStorage)
- [ ] Responsive di layar 4.7" sampai 6.7"
- [ ] Loading cepat (< 1 detik transition antar slide)

---

## 7. Referensi Visual

- Slide 1: Terinspirasi dari hero gokang.id — fullscreen image + overlay + bold text
- Slide 2: Clean card-based layout, mirip Gojek/Grab onboarding
- Slide 3: Bold CTA, mirip Tokopedia first-time welcome screen

---

**Version:** 1.0.0
**Last updated:** 2026-04-19