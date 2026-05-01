# PRD 02 — Customer Mobile App

## 1. Scope
Aplikasi mobile untuk **konsumen** memesan layanan tukang.

---

## 2. Screen Map

```
Splash
│
├── Onboarding (first time only)
│
├── Auth
│   ├── Register (phone)
│   ├── OTP Verification
│   ├── Complete Profile (name, email)
│   └── Login (phone)
│
└── Main (Bottom Tabs)
    ├── Beranda (Home)
    │   ├── Borongan Rumah → Form Survey
    │   ├── Borongan Bisnis → Form Survey
    │   ├── Pesan Tukang Saja → Pilih Jenis Jagoan
    │   └── Layanan Perbaikan + Material → Pilih Jenis Jagoan
    │
    ├── Pesanan (Orders)
    │   ├── Tab: Aktif / Selesai / Dibatalkan
    │   └── Detail Order → Tracking / Chat / Rating
    │
    ├── Promo
    │   └── List voucher & detail
    │
    ├── Chat
    │   └── List chat → Chat Detail
    │
    └── Akun (Profile)
        ├── Edit Profile
        ├── Alamat Tersimpan
        ├── Metode Pembayaran
        ├── Riwayat
        ├── Bantuan
        └── Keluar
```

---

## 3. Feature Details

### 3.1 Onboarding & Auth

#### Onboarding
- 3 slide intro (tampil 1x pertama install)
  - Slide 1: Cari tukang profesional
  - Slide 2: Harga transparan, bergaransi
  - Slide 3: Pembayaran aman via app
- Button "Mulai Sekarang" → Register

#### Register
- Input: Nomor HP (WA aktif)
- Validasi: format HP Indonesia (+62/08)
- Kirim OTP → Screen OTP (6 digit, timer 60 detik, resend button)
- OTP benar → Complete Profile (nama lengkap, email opsional)
- Selesai → masuk Home

#### Login
- Input nomor HP → kirim OTP → login
- Alternatif: login via Google (Phase 2)

---

### 3.2 Home Screen

**Layout (lihat Image 1 sebagai referensi):**

**Header (merah):**
- Status bar
- Search bar (putih, rounded, placeholder: "Mau diperbaiki apa?")
- Icon Wishlist/Favorite
- Icon Notifikasi (badge count)

**Body (putih):**
- **Info banner**: "Untuk kedatangan besok, pesan sebelum jam 3 sore"

- **Section: Borongan (Full Service)**
  - Subtitle: "Survey + Jasa + Material + Pengawasan"
  - 2 card horizontal:
    - **Untuk Rumah** (background pink, icon rumah)
    - **Untuk Bisnis** (background biru, icon gedung)

- **Section: Tukang Harian**
  - Subtitle: "Pekerjaan kecil tanpa survey"
  - 2 card horizontal:
    - **Pesan Tukang Saja** (background hijau, icon tukang)
    - **Layanan Perbaikan + Material** (background kuning, icon peralatan)

- **Bottom promo banner**: "Lengkapi Email Akun Anda" (dismissable)

- **Floating chip**: "Bacaan Terbaru" (artikel blog)

**Bottom Navigation:**
- Beranda (active, icon rumah merah)
- Pesanan (icon document)
- Promo (icon diskon)
- Chat (icon bubble)
- Akun (icon user)

---

### 3.3 Browse Layanan (Pesan Tukang Saja)

**Flow:**

1. Pilih dari 4 menu Home
2. Screen "Pilih Jenis Tukang":
   - Grid 2 kolom, card setiap jenis Jagoan
   - Setiap card: icon, nama, tarif mulai
   - Total 17 jenis

3. Tap jenis → Screen "Detail Layanan":
   - Deskripsi singkat
   - Tarif harian & setengah hari
   - Daftar pekerjaan yang dilakukan
   - Rating & review tukang
   - Button "Pesan Sekarang"

4. Tap "Pesan Sekarang" → Form Booking:
   - **Durasi kerja**: Toggle (Setengah Hari / Satu Hari)
   - **Jumlah tukang**: Counter +/- (1-5)
   - **Alamat**: Pilih dari saved atau tambah baru
     - Map picker
     - Detail alamat (patokan, catatan)
   - **Jadwal**: Date picker + Time picker
     - Validasi: minimum H+1, sebelum jam 15:00 untuk besok
   - **Catatan untuk tukang**: Textarea (opsional)
   - **Kode promo**: Input + Apply button

5. Ringkasan harga:
   - Tarif tukang × durasi × jumlah
   - Diskon promo (-)
   - **Total**

6. Button "Lanjut ke Pembayaran"

7. Pilih metode pembayaran:
   - Virtual Account (BCA, BNI, BRI, Mandiri)
   - E-wallet (GoPay, OVO, DANA, ShopeePay)
   - Credit/Debit Card

8. Bayar → redirect ke halaman Midtrans → success/failed

9. Success → Screen Order Confirmation:
   - Kode order
   - Status: "Mencari Tukang Jagoan..."
   - Button "Lihat Pesanan"

---

### 3.4 Form Borongan (Referensi Image 2 & 3)

**Header:**
- Back button
- Title: "Butuh Jasa Tukang + Material?"
- Subtitle: "GoKang Solusi tepat untuk rumahmu!"

**Form Fields:**

1. **Tahu GoKang dari mana?** * (dropdown)
   - Options: Instagram, TikTok, Google, Teman, Lainnya

2. **Jenis Bangunan** * (radio buttons dengan icon)
   - Apartment / Ruko / Rumah

3. **Perbaikan/pekerjaan bangunan yang dibutuhkan** (textarea)
   - Placeholder: "Isi dengan jelas"

4. **Masukkan Foto Masalah**
   - Subtitle: "Maksimal foto diupload adalah 10 foto"
   - 2 button: "Pilih dari galeri" / "Buka kamera"
   - Preview thumbnails

5. **Alamat Survey** * (navigate to map picker)

6. **Tanggal Survey** * (date + time picker)

7. **Budget yang kamu siapkan** * (dropdown)
   - Options: < 5jt, 5-10jt, 10-25jt, 25-50jt, 50-100jt, > 100jt

8. **Kode Pesanan** (optional, input text)

**Summary Card:**
- Nama promo (e.g., "Promo Survey 60%")
- Harga coret: Rp 250.000
- Harga final: **Rp 100.000**
- Button "Lanjut Pembayaran" →

**Termasuk:**
- ✅ Diskusi dengan ahli bangunan
- ✅ Penawaran pekerjaan dengan harga terbaik

**Disclaimer:**
- ⚠️ Harap menyiapkan tangga, karena konsultan tidak membawa tangga saat survey

---

### 3.5 Orders (Pesanan)

**Tabs:**
- **Aktif** — status: pending, assigned, on_the_way, in_progress
- **Selesai** — status: completed
- **Dibatalkan** — status: cancelled, refunded

**Card tiap order:**
- Kode order (e.g., KNG-2026-0001)
- Jenis layanan
- Tanggal pengerjaan
- Alamat (shortened)
- Status badge (warna sesuai)
- Harga total
- Tap → detail

**Detail Order:**
- Timeline status:
  1. Pesanan dibuat
  2. Tukang ditemukan (dengan info tukang + rating)
  3. Tukang OTW
  4. Tukang tiba
  5. Mulai pengerjaan
  6. Pengerjaan selesai
  7. Konfirmasi customer

- Info Tukang:
  - Foto, nama, rating, jumlah order selesai
  - Button: Chat / Telepon

- Detail pesanan:
  - Jenis, durasi, jumlah tukang
  - Alamat lengkap
  - Tanggal & jam
  - Catatan
  - Rincian harga

- Actions (context-aware):
  - Pending: Batalkan pesanan
  - Completed (belum rating): Beri rating

---

### 3.6 Chat

**List Chat:**
- Avatar tukang + nama
- Preview last message
- Timestamp
- Badge unread

**Chat Detail:**
- Header: info tukang (avatar, nama, status online)
- Messages (text only di MVP)
- Input box + send button
- Tidak ada attachment di MVP (Phase 2)

**Rules:**
- Chat hanya aktif saat order running (dari accepted s/d 24 jam setelah completed)
- Setelah itu chat readonly

---

### 3.7 Rating & Review

**Trigger:** Order status = completed, belum di-rate

**Modal/Screen:**
- "Bagaimana pengalamanmu dengan Bang [Nama]?"
- 5 bintang tap
- Tag pilihan (multi-select):
  - Tepat waktu, Rapi, Profesional, Ramah, Hasil memuaskan, Komunikasi baik
- Review textarea (opsional)
- Foto hasil (opsional, max 3)
- Button "Kirim Rating"

---

### 3.8 Profile / Akun

- **Header**: Avatar, nama, nomor HP, edit button
- **Menu list**:
  - Alamat Tersimpan → CRUD alamat
  - Metode Pembayaran → saved cards (Phase 2)
  - Riwayat Pesanan → (sama dengan tab Pesanan → Selesai)
  - Voucher Saya
  - Bantuan & FAQ
  - Tentang Aplikasi
  - Kebijakan Privasi
  - Syarat & Ketentuan
  - Keluar (confirm dialog)

---

## 4. Non-Functional

### Performance
- Splash → Home: < 3 detik
- API response: < 1.5 detik (p95)
- Image upload: progressive, compress di client

### Offline Handling
- Cache last order status di AsyncStorage
- Show "Tidak ada koneksi" banner kalau offline
- Retry otomatis saat online kembali

### Accessibility
- Font size responsive (honor system settings)
- Contrast ratio minimal AA
- Semua button ada label untuk screen reader

---

## 5. Error States

| Scenario | UX Behavior |
|----------|-------------|
| No internet | Toast + retry button |
| API 500 | Friendly message + CS link |
| No tukang available | Notif → refund opsi |
| Payment failed | Back to payment selection |
| Session expired | Auto redirect to login |
| GPS off | Prompt enable location |
