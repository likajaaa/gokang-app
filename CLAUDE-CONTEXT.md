# CLAUDE-CONTEXT.md

> **Purpose**: Context mendalam tentang bisnis, produk, user behavior, dan alur kerja GoKang.
> Baca file ini untuk **memahami WHY** di balik setiap fitur, bukan hanya **WHAT**-nya.

---

## 🏢 About GoKang (Referensi Asli)

### Perusahaan
- **Nama legal**: PT. Tenaga GoKang Indonesia
- **Berdiri**: 2020
- **HQ**: BSD City, Tangerang
- **Area layanan**: Jabodetabek (Jakarta, Bogor, Depok, Tangerang, Bekasi)

### Tagline
> "Perbaiki Bangunan, Ciptakan Pekerjaan"

### Value Proposition
Visi dua arah:
1. **Untuk konsumen**: Platform nyaman untuk cari tukang profesional dengan harga transparan
2. **Untuk tukang**: Peluang kerja berkesinambungan, peningkatan kesejahteraan

### Numbers (public)
- 2,000+ Tukang Jagoan aktif
- 17+ jenis layanan tukang
- 25+ solusi perbaikan rumah
- 5,000+ titik perbaikan per bulan
- 500+ tiket perbaikan per hari

---

## 💡 Core Business Model

**Model:** Two-sided marketplace (Consumer ↔ Service Provider)

```
Customer                     GoKang Platform                    Tukang
   │                                │                              │
   │─── Pesan layanan ─────────────>│                              │
   │<── Harga transparan ───────────│                              │
   │─── Bayar ─────────────────────>│                              │
   │                                │─── Assign order ────────────>│
   │                                │                              │
   │<────────── Tukang datang & kerja ───────────────────────────>│
   │                                │                              │
   │─── Rating & review ───────────>│─── Bayar tukang ────────────>│
```

**Revenue stream:**
1. Komisi dari setiap transaksi (biasanya 15-25%)
2. Margin dari penjualan material
3. Biaya survey untuk borongan
4. Korporat subscription (GoKang Corp)

---

## 📱 Produk GoKang

### 1. Borongan (Full Service)
Paket lengkap: **Survey + Jasa + Material + Pengawasan**

**Cocok untuk:**
- Renovasi besar (kamar, dapur, kamar mandi)
- Proyek yang butuh perencanaan matang
- Ingin hasil all-in tanpa repot

**Alur:**
1. Konsultasi via app/WA
2. Konsultan datang survey ke lokasi (berbayar, ada promo)
3. Dapat penawaran harga transparan (all-in)
4. Setuju → kerjakan → selesai
5. Bayar bertahap sesuai progress

**Sub-kategori:**
- **Untuk Rumah** (residential)
- **Untuk Bisnis** (ruko, kantor, kafe, hotel)

### 2. Tukang Harian
Pesan tukang per hari/setengah hari untuk pekerjaan kecil **tanpa survey**.

**Cocok untuk:**
- Pasang stop kontak, perbaiki pipa bocor, ganti keramik area kecil
- Customer tahu persis butuhnya apa

**Varian:**
- **Pesan Tukang Saja** (customer beli material sendiri)
- **Layanan Perbaikan + Material** (titip beli material ke tukang)

### 3. GoKang Corp
Layanan B2B untuk korporat (hotel, restoran, ritel) dengan web dashboard terpisah.

**Out of scope untuk clone MVP.**

### 4. Tukang Jagoan (Mitra)
Program rekrutmen tukang. Tukang daftar, diverifikasi, dilatih, lalu bisa terima order.

---

## 🛠️ Daftar Layanan Tukang (17 Jenis)

Dari halaman https://www.gokang.id/daftar-harga (harga 2026):

| Jenis | Tarif Harian | Setengah Hari | Deskripsi |
|-------|-------------|---------------|-----------|
| Jagoan Cat | Rp 259.000 | Rp 199.000 | Cat dinding, plafon, pintu, jendela |
| Jagoan Keramik | Rp 264.000 | Rp 204.000 | Bongkar-pasang keramik lantai & dinding |
| Jagoan Listrik | Rp 259.000 | Rp 199.000 | Instalasi listrik, stop kontak, fitting lampu |
| Kenek (Asisten) | Rp 209.000 | Rp 163.000 | Asisten tukang |
| Jagoan Aluminium | Rp 259.000 | Rp 199.000 | Pintu & jendela aluminium |
| Jagoan Batu | Rp 259.000 | Rp 199.000 | Dinding, tembok, batu alam, conblock |
| Jagoan Pipa | Rp 299.000 | Rp 239.000 | Pipa bocor, saluran macet |
| Jagoan Waterproofing | Rp 299.000 | Rp 239.000 | Atap & area rentan bocor |
| Jagoan Gali | Rp 259.000 | Rp 199.000 | Segala keperluan menggali |
| Jagoan Besi (Las) | Rp 264.000 | Rp 204.000 | Las besi |
| Jagoan Genteng | Rp 299.000 | Rp 239.000 | Genteng & atap |
| Jagoan Plafon | Rp 259.000 | Rp 199.000 | Plafon rusak, berlumut, roboh |
| Konsultan | - | Rp 249.000 | Hitung kebutuhan material & tukang |
| Jagoan Sanitair | Rp 259.000 | Rp 199.000 | Wastafel, kloset, keran, shower |
| Jagoan Angkat | Rp 209.000 | Rp 163.000 | Angkat barang |
| Jagoan Listrik Perapihan | Rp 259.000 | Rp 199.000 | Rapikan kabel listrik |
| Jagoan Pipa Perapihan | Rp 299.000 | Rp 239.000 | Rapikan instalasi pipa |

**Durasi kerja:**
- Setengah hari = ~4 jam
- Satu hari = ~8 jam

---

## 👤 User Personas

### Persona 1: Ibu Rumah Tangga (Sari, 38)
- Tinggal di perumahan di Tangerang
- Butuh perbaikan rutin (ganti keramik retak, bocor dapur)
- Tech-savvy moderat (pakai Shopee, Gojek)
- Sensitif harga, suka promo
- **Pain point**: Susah cari tukang yang jujur & tepat waktu, takut ditipu harga

### Persona 2: Pekerja Kantoran (Budi, 32)
- Tinggal di apartemen di Jakarta
- Busy, jarang di rumah
- Mau renovasi kamar mandi
- Punya budget, value convenience over price
- **Pain point**: Tidak ada waktu survey tukang, butuh one-stop solution

### Persona 3: Pemilik Ruko/UKM (Pak Agus, 45)
- Punya toko & butuh pemeliharaan berkala
- Butuh yang responsif saat darurat (bocor, listrik mati)
- **Pain point**: Butuh tukang yang bisa datang cepat

### Persona 4: Tukang (Bang Madrohim, 40)
- Tukang batu dengan 15 tahun pengalaman
- Dulu andalkan mandor, order tidak pasti
- Smartphone basic
- **Pain point**: Ingin order stabil, bayaran jelas

---

## 🎯 Customer Journey

### Flow A: Pesan Tukang Harian
```
1. Buka app → landing di Home
2. Tap "Pesan Tukang Saja" (dari menu Tukang Harian)
3. Pilih jenis tukang (17 opsi)
4. Pilih durasi (setengah hari / satu hari)
5. Pilih jumlah tukang
6. Isi alamat (pakai GPS atau manual)
7. Pilih tanggal & jam mulai
8. Catatan pekerjaan (opsional)
9. Lihat ringkasan harga
10. Pilih metode pembayaran
11. Bayar
12. Nunggu tukang accept (timeout 30 menit, auto-broadcast)
13. Tukang datang → kerja → selesai
14. Konfirmasi selesai → rating → review
```

### Flow B: Pesan Borongan Full Service
```
1. Home → "Untuk Rumah" atau "Untuk Bisnis"
2. Isi form:
   - Tahu GoKang dari mana (dropdown)
   - Jenis bangunan (Apartment/Ruko/Rumah)
   - Deskripsi pekerjaan (textarea)
   - Upload foto masalah (max 10)
   - Alamat survey
   - Tanggal & waktu survey
   - Budget range (dropdown)
   - Kode promo (opsional)
3. Bayar biaya survey (Rp 100.000 dengan promo 60%)
4. Konsultan datang survey
5. Terima penawaran via app
6. Setuju → lanjut DP → pengerjaan
7. Progress update dari tim GoKang
8. Selesai → pelunasan → rating
```

### Flow C: Layanan Perbaikan + Material
```
1. Pilih jenis Jagoan
2. Pilih "Include Material" → tukang yang rekomendasi material
3. Tukang datang, assessment, kasih list material
4. Customer approve list & harga material → bayar via app
5. Tukang beli material & kerja
6. Selesai → rating
```

---

## 🧾 Business Rules (WAJIB dipatuhi dalam implementasi)

### Pricing
- Harga tukang **flat per hari/setengah hari** (bukan per jam)
- Biaya survey borongan default **Rp 250.000** (promo bisa 60% = Rp 100.000)
- Pembayaran wajib lewat app (no cash)
- Material dibayar terpisah dari jasa

### Scheduling
- Untuk kedatangan besok: **pesan sebelum jam 3 sore**
- Minimal booking: H+1 dari tanggal pesan
- Jam kerja tukang: 08:00 - 17:00
- Tidak ada layanan di hari libur nasional (kecuali atur khusus)

### Cancellation
- Cancel gratis jika **> 3 jam sebelum** jadwal
- Cancel < 3 jam: charge 50% biaya tukang
- Cancel saat tukang OTW/sudah sampai: charge 100%

### Garansi
- Semua pekerjaan bergaransi **7 hari**
- Klaim garansi via app → tukang sama datang gratis
- Kecuali pekerjaan kecil yang by nature tidak bergaransi (angkat barang, dll)

### Area Layanan
- Hanya **Jabodetabek** di MVP
- Validasi alamat: cek radius dari tukang terdekat, max 25km

### Rating
- Rating 1-5 bintang
- Customer wajib rating setelah order selesai (bisa skip, muncul terus)
- Tukang dengan rating < 3.5 selama 30 hari → review internal

### Assignment Tukang
- Broadcast ke tukang dalam radius 15km pertama
- Jika tidak ada yang accept dalam 15 menit → expand radius ke 25km
- Jika masih kosong → notif ke admin untuk intervensi manual

---

## 🔔 Notifications yang Dibutuhkan

### Customer
- Order diterima tukang
- Tukang OTW (30 menit sebelum)
- Tukang sudah sampai
- Pekerjaan dimulai
- Pekerjaan selesai
- Reminder rating
- Promo & voucher baru

### Tukang
- Order baru (radius 15km)
- Order auto-cancel (tidak respond)
- Pembayaran diterima
- Pencairan berhasil
- Rating baru dari customer

---

## 🧩 Edge Cases yang Harus di-handle

1. **Tukang tidak ada yang accept** → notify admin, refund opsi
2. **Tukang cancel last minute** → auto re-assign, kompensasi customer
3. **Customer tidak ada di lokasi saat tukang datang** → wait 30 menit → charge full
4. **Pekerjaan > durasi kontrak** → tambah setengah hari / hari di app
5. **Material yang dibeli kurang/lebih** → adjust di final invoice
6. **Dispute antara customer-tukang** → escalate ke admin, chat log jadi bukti
7. **Customer ganti alamat saat order on-going** → re-calculate tarif (jika > 5km beda)

---

## 🎨 Brand Voice & UX Principles

### Tone
- Casual friendly tapi profesional
- Gunakan "kamu" bukan "Anda"
- Bahasa Indonesia, hindari inggris-inggrisan
- Kalimat pendek & jelas

### UX Principles
1. **Harga transparan** — selalu tampilkan breakdown harga sebelum bayar
2. **Status real-time** — user selalu tahu order ada di tahap mana
3. **Minimal friction** — booking idealnya < 2 menit untuk Tukang Harian
4. **Trust signals** — tampilkan rating tukang, foto verified, garansi
5. **Mobile-first** — semua flow harus nyaman di layar 6 inch

### Micro-copy Examples
- ✅ "Untuk kedatangan besok, pesan sebelum jam 3 sore"
- ✅ "Tukang Jagoan sedang dalam perjalanan"
- ✅ "Pesananmu sudah sampai di lokasi"
- ❌ "Anda diharapkan melakukan pembayaran segera" (terlalu formal)

---

## 🌍 Out of Scope (MVP)

Hal-hal yang **tidak masuk** dalam clone MVP:

- GoKang Corp (B2B dashboard)
- Multi-language (hanya Bahasa Indonesia)
- International area (hanya Jabodetabek)
- Advanced analytics untuk customer
- Referral program
- Loyalty points
- Live streaming pengerjaan
- AR untuk preview renovasi
- Marketplace material (beli material tanpa tukang)

---

## 🔗 Kompetitor untuk Dipelajari

- **Sejasa** (sejasa.com) - competitor langsung, model hampir sama
- **Panggil Tukang** - model sederhana
- **Gravel** - fokus kontraktor, 19 provinsi
- **Gomandor** - fokus AC & renovasi kost
- **Tukang.com** - desain lebih clean, fokus B2B juga

**Yang bisa dipelajari:**
- Dari Sejasa: sistem SejasaPay (e-wallet internal) — skip dulu untuk MVP
- Dari Gojek (bukan kompetitor langsung): broadcast & matching algorithm

---

**Last updated:** 2026-04-19
**Version:** 1.0.0
