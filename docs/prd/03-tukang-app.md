# PRD 03 — Tukang Mobile App

## 1. Scope
Aplikasi mobile untuk **tukang** (Tukang Jagoan) menerima dan mengerjakan order.

---

## 2. Screen Map

```
Splash
│
├── Onboarding Tukang
│
├── Auth
│   ├── Register Tukang (multi-step)
│   ├── Upload Dokumen
│   ├── Verifikasi (wait approval)
│   └── Login
│
└── Main (Bottom Tabs)
    ├── Beranda (Dashboard)
    ├── Order Masuk (New orders)
    ├── Order Aktif (Jobs in progress)
    ├── Penghasilan
    └── Akun
```

---

## 3. Registration Flow (Tukang)

### Step 1: Basic Info
- Nama lengkap
- Nomor HP (+ OTP)
- Email
- Tanggal lahir
- Alamat rumah

### Step 2: Keahlian
- Pilih jenis Jagoan (multi-select, 1-3):
  - Cat, Keramik, Listrik, Pipa, dll (17 jenis)
- Pengalaman kerja (tahun): 0-30+
- Area layanan (pilih kota)

### Step 3: Dokumen
Upload:
- Foto KTP (wajib)
- Foto selfie memegang KTP (wajib)
- Sertifikat keahlian (opsional)
- Foto diri profesional (untuk profil)

### Step 4: Bank Account
Untuk pencairan:
- Nama bank
- Nomor rekening
- Nama pemilik rekening

### Step 5: Review
- Submit → status "Menunggu Verifikasi"
- Admin verifikasi manual (1-3 hari kerja)
- Notif: Approved → bisa login & terima order
- Rejected → feedback reason, bisa re-submit

---

## 4. Feature Details

### 4.1 Beranda (Dashboard)

**Header:**
- Avatar + nama tukang
- Status toggle: **Online** / **Offline**
  - Online = bisa terima order
  - Offline = tidak dapat notif order

**Stats Cards:**
- Order hari ini: X
- Penghasilan hari ini: Rp X
- Rating rata-rata: 4.X ⭐
- Total order selesai: X

**Active Order** (kalau ada):
- Card order yang sedang berjalan
- Quick action button

**Tips & Info:**
- Tips kerja
- Pengumuman dari admin

---

### 4.2 Order Masuk

**List order yang broadcast ke tukang ini:**
- Card tiap order:
  - Jenis Jagoan
  - Alamat (jarak dari lokasi tukang)
  - Tanggal & jam kerja
  - Durasi (setengah/satu hari)
  - Estimasi pendapatan
  - Timer countdown (15 menit untuk accept)
  - Button **Terima** / **Tolak**

**Detail Order (tap card):**
- Info lengkap order
- Catatan customer
- Peta lokasi (preview)
- Button Accept/Reject

**Aturan:**
- Tukang ada 15 menit untuk respond
- Kalau tidak respond → auto-skip ke tukang lain
- Accept otomatis = kontrak

---

### 4.3 Order Aktif (In Progress)

**Timeline status yang bisa diupdate tukang:**

1. **Accepted** (auto setelah terima)
2. **On the way** — tap tombol "Berangkat"
3. **Arrived** — tap "Sudah Sampai"
4. **Working** — tap "Mulai Kerja"
   - (khusus Layanan + Material): input list material beli sebelum mulai
5. **Completed** — tap "Selesai Kerja"
   - Upload foto hasil (min 2 foto)
   - Input jam selesai aktual

**Material Input (jika Layanan + Material):**
- Tambah item: nama, qty, harga satuan
- Upload foto struk
- Total auto-calculate
- Submit → tunggu customer approve

**Chat dengan customer** — always accessible selama order aktif.

---

### 4.4 Penghasilan

**Summary Cards:**
- Saldo saat ini (bisa dicairkan)
- Penghasilan bulan ini
- Penghasilan 30 hari terakhir

**History:**
- List transaksi: tanggal, order ID, amount, status
- Filter by month

**Cairkan Saldo:**
- Minimum Rp 50.000
- Masuk ke rekening terdaftar
- Processing 1-2 hari kerja
- Riwayat pencairan

**Breakdown per Order:**
- Harga order
- Komisi platform (-15% atau sesuai)
- Bonus (+, kalau ada)
- Net earning

---

### 4.5 Akun

- Profile tukang (edit foto, bio)
- Keahlian (request tambah keahlian baru → perlu verifikasi)
- Area layanan
- Rekening bank
- Dokumen (lihat yg terupload)
- Rating & review dari customer
- Bantuan / FAQ Tukang
- Keluar

---

## 5. Rules Khusus Tukang

### Acceptance Rate
- Dihitung: (accepted / offered) × 100%
- Kalau < 70% dalam 30 hari → warning
- Kalau < 50% → suspend sementara

### Rating Rules
- Rating < 3.5 average untuk 10 order terakhir → review manual
- Complaint serius → investigasi & mungkin banned

### Cancellation oleh Tukang
- Cancel setelah accept = penalty
  - First time: warning
  - Kedua kali dalam 30 hari: suspend 7 hari
  - Ketiga: banned
- Kecuali force majeure (sakit, keluarga, dll) dengan bukti

### No-show
- Tidak datang ke lokasi = auto-cancel + penalty 50k
- Customer dapat full refund + voucher kompensasi

### Komisi Platform
- Default **15%** dari harga order
- Bisa berbeda per jenis layanan
- Material: margin diatur admin (biasanya markup 5-10%)

---

## 6. Notifications untuk Tukang

### Push (FCM)
- "Order baru: [Jenis] di [Area], Rp [Harga]" — urgent, sound
- "Order di-cancel customer"
- "Customer confirm pekerjaan selesai"
- "Saldo Rp [Amount] berhasil dicairkan"
- "Rating baru: [Stars] dari [Customer]"
- "Pengumuman dari admin"

### In-app
- Inbox message
- Order updates
- Payment events

---

## 7. Offline & Connectivity

- Tukang bisa set "Offline" → tidak dapat notif order
- Kalau GPS mati → banner warning + tidak bisa accept order
- Status "Arrived" perlu validasi GPS (dalam radius 200m dari alamat)

---

## 8. Security

- Tukang tidak boleh tahu nomor HP customer langsung (mask format)
- Chat in-app only, tidak exchange personal info
- Nomor HP tukang juga di-mask untuk customer
- Foto KTP disimpan encrypted, hanya admin yang bisa view
