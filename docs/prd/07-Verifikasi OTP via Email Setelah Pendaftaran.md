# PRD: Verifikasi OTP via Email Setelah Pendaftaran

| Field | Value |
|---|---|
| **Product** | GoKang Mobile App |
| **Feature** | Email OTP Verification at Registration |
| **Version** | 1.0 |
| **Status** | Draft |
| **Tanggal** | 20 April 2026 |
| **Author** | Product Team |

---

## 1. Ringkasan (Overview)

Saat ini, alur pendaftaran GoKang mengirim kode OTP ke nomor HP pengguna via SMS. Dokumen ini mendefinisikan perubahan channel pengiriman OTP dari **SMS ke Email** sebagai metode verifikasi utama (dan satu-satunya) pada saat registrasi akun baru.

### 1.1 Konteks Perubahan

Pada flow saat ini:
1. User mengisi Nama, Nomor HP, dan Email (opsional) di halaman registrasi.
2. Sistem mengirim OTP 6 digit ke Nomor HP via SMS.
3. User memasukkan OTP di halaman "Masukkan Kode OTP".

Pada flow baru:
1. User mengisi Nama, Nomor HP, dan **Email (wajib)** di halaman registrasi.
2. Sistem mengirim OTP 6 digit ke **Email** user.
3. User memasukkan OTP di halaman "Masukkan Kode OTP" (copy text diperbarui).

---

## 2. Masalah & Tujuan

### 2.1 Problem Statement
- **Biaya SMS tinggi** per pengiriman OTP, terutama di peak hours dan saat traffic registrasi naik.
- **Delivery rate SMS tidak konsisten** di beberapa operator Indonesia, menyebabkan user tidak menerima OTP dan drop-off di funnel registrasi.
- **Tidak ada audit trail** yang mudah ditelusuri jika OTP via SMS gagal terkirim.

### 2.2 Goals
| Goal | Measurement |
|---|---|
| Menurunkan biaya operasional OTP | Cost per OTP turun minimal 80% vs SMS |
| Meningkatkan delivery rate OTP | Delivery rate ≥ 98% |
| Meningkatkan completion rate registrasi | Completion rate naik minimal 5 poin persentase |
| Menyediakan audit trail yang jelas | 100% event pengiriman tercatat dan dapat di-query |

### 2.3 Non-Goals
- Tidak membahas verifikasi ulang (re-verification) untuk user existing.
- Tidak mengubah flow login (hanya flow registrasi).
- Tidak mengimplementasikan fallback SMS pada rilis v1.0.

---

## 3. User Flow & Wireframe

### 3.1 Happy Path Flow

```
[Halaman Registrasi]
  User input: Nama, Nomor HP, Email (wajib)
  → Tap "Daftar"
        │
        ▼
[Backend: Validasi input + generate OTP]
  - Cek email belum terdaftar
  - Generate 6-digit OTP
  - Simpan OTP (hashed) dengan TTL 5 menit
  - Trigger email sender
        │
        ▼
[Halaman OTP]
  Copy: "Kami telah mengirimkan kode OTP ke email
         u***r@email.com"
  - Input 6 kotak OTP
  - Tombol "Lanjutkan"
  - Timer resend: 2:00
        │
        ▼
[User input OTP] → Tap "Lanjutkan"
        │
        ▼
[Backend: Validasi OTP]
  - Match & tidak expired → akun aktif
  - Mismatch → error message
        │
        ▼
[Halaman Sukses / Home]
```

### 3.2 Perubahan UI pada Halaman Registrasi

| Field | Sebelum | Sesudah |
|---|---|---|
| Nama | Wajib | Wajib (tidak berubah) |
| Nomor HP | Wajib | Wajib (tidak berubah, disimpan untuk profil) |
| Email | Opsional | **Wajib** |
| Validasi email | - | Format RFC 5322, realtime inline error |

### 3.3 Perubahan UI pada Halaman OTP

| Elemen | Sebelum | Sesudah |
|---|---|---|
| Judul | "Masukkan Kode OTP" | "Masukkan Kode OTP" (tidak berubah) |
| Subtitle | "Kami telah mengirimkan kode OTP ke nomor HP 082xxxxxxxxx" | "Kami telah mengirimkan kode OTP ke email u\*\*\*r@email.com" |
| Ikon | Alarm clock | Ikon amplop/email (opsional, untuk memperkuat konteks) |
| Input | 6 kotak digit | 6 kotak digit (tidak berubah) |
| Timer resend | 2 menit | 2 menit (tidak berubah) |
| CTA sekunder | "Kirim ulang Kode OTP" | "Kirim ulang Kode OTP" + link "Cek folder spam" |

### 3.4 Wireframe Tekstual Halaman OTP Baru

```
┌───────────────────────────────────┐
│ ←                                 │
│                                   │
│ [📧 icon]                          │
│                                   │
│ Masukkan Kode OTP                 │
│                                   │
│ Kami telah mengirimkan kode OTP   │
│ ke email u***r@gmail.com          │
│                                   │
│ [ ] [ ] [ ] [ ] [ ] [ ]           │
│                                   │
│ ┌─────────────────────────────┐   │
│ │       Lanjutkan             │   │
│ └─────────────────────────────┘   │
│                                   │
│ Kirim ulang Kode OTP (1:53)       │
│ Tidak menerima email? Cek spam    │
└───────────────────────────────────┘
```

---

## 4. Functional Requirements

### 4.1 Registration Form
- **FR-1.1** Email menjadi field wajib; tombol "Daftar" disabled sampai semua field wajib valid.
- **FR-1.2** Validasi format email client-side (regex RFC 5322 simplified) dan server-side.
- **FR-1.3** Normalisasi email: trim whitespace, lowercase seluruh string sebelum disimpan.
- **FR-1.4** Cek duplikasi email di database sebelum submit OTP. Jika sudah terdaftar dan aktif, tampilkan error: "Email sudah terdaftar. Silakan masuk."
- **FR-1.5** Jika email terdaftar tetapi belum terverifikasi, izinkan re-trigger OTP (overwrite OTP sebelumnya).

### 4.2 OTP Generation
- **FR-2.1** OTP adalah 6 digit numerik, dibangkitkan dengan cryptographically secure RNG.
- **FR-2.2** OTP di-hash (SHA-256 + salt atau bcrypt) sebelum disimpan di database; tidak pernah disimpan dalam plaintext.
- **FR-2.3** Masa berlaku OTP: **5 menit** sejak waktu generate.
- **FR-2.4** Satu email hanya boleh memiliki satu OTP aktif; OTP baru menginvalidasi OTP lama.

### 4.3 Email Delivery
- **FR-3.1** Email OTP dikirim melalui transactional email provider (contoh: SendGrid, AWS SES, Mailgun — keputusan final di fase technical design).
- **FR-3.2** Template email harus mengandung: nama user, kode OTP, masa berlaku, disclaimer "jangan bagikan kode ini", dan kontak support.
- **FR-3.3** Email dikirim dari domain resmi (contoh: `no-reply@gokang.id`) dengan SPF, DKIM, dan DMARC yang valid.
- **FR-3.4** Waktu delivery target: ≤ 10 detik dari tap "Daftar" sampai email masuk inbox user (P95).

### 4.4 OTP Verification
- **FR-4.1** User input 6 digit OTP, tombol "Lanjutkan" aktif ketika semua digit terisi.
- **FR-4.2** Verifikasi dilakukan server-side dengan membandingkan hash OTP.
- **FR-4.3** Maksimum **5 percobaan salah** per OTP; setelah itu OTP otomatis invalid dan user harus request baru.
- **FR-4.4** Setelah verifikasi berhasil, OTP langsung di-invalidate (one-time use).

### 4.5 Resend OTP
- **FR-5.1** Tombol "Kirim ulang" hanya aktif setelah 2 menit dari pengiriman sebelumnya.
- **FR-5.2** Maksimum **3 kali resend** per sesi registrasi (per email per jam).
- **FR-5.3** Setiap resend menghasilkan OTP baru, OTP sebelumnya di-invalidate.

---

## 5. Technical Requirements & API Spec

### 5.1 Arsitektur Ringkas

```
Mobile App ──▶ API Gateway ──▶ Auth Service ──▶ OTP Service ──▶ Email Provider
                                   │                │
                                   ▼                ▼
                              User DB          OTP Cache (Redis)
```

### 5.2 API Endpoints

#### POST `/api/v1/auth/register`

**Request body:**
```json
{
  "name": "Budi Santoso",
  "phone": "082310965681",
  "email": "budi@example.com"
}
```

**Response 200:**
```json
{
  "status": "success",
  "data": {
    "registration_token": "eyJhbGciOiJIUzI1...",
    "email_masked": "b***i@example.com",
    "otp_expires_in": 300,
    "resend_available_in": 120
  }
}
```

**Response 409 (email sudah terdaftar):**
```json
{
  "status": "error",
  "code": "EMAIL_ALREADY_REGISTERED",
  "message": "Email sudah terdaftar. Silakan masuk."
}
```

#### POST `/api/v1/auth/verify-otp`

**Request body:**
```json
{
  "registration_token": "eyJhbGciOiJIUzI1...",
  "otp": "482913"
}
```

**Response 200:**
```json
{
  "status": "success",
  "data": {
    "access_token": "...",
    "refresh_token": "...",
    "user": { "id": "...", "name": "...", "email": "..." }
  }
}
```

**Response 400 (OTP salah):**
```json
{
  "status": "error",
  "code": "INVALID_OTP",
  "message": "Kode OTP salah",
  "attempts_remaining": 3
}
```

**Response 410 (OTP expired):**
```json
{
  "status": "error",
  "code": "OTP_EXPIRED",
  "message": "Kode OTP sudah kadaluarsa. Silakan kirim ulang."
}
```

#### POST `/api/v1/auth/resend-otp`

**Request body:**
```json
{
  "registration_token": "eyJhbGciOiJIUzI1..."
}
```

**Response 200:**
```json
{
  "status": "success",
  "data": {
    "otp_expires_in": 300,
    "resend_available_in": 120,
    "resend_count": 1,
    "resend_limit": 3
  }
}
```

### 5.3 Data Model

**Table `registration_otp` (atau Redis key `otp:{email}`):**

| Field | Type | Description |
|---|---|---|
| id / key | UUID / string | Primary key |
| email | string | Normalized email |
| otp_hash | string | Hashed OTP (bcrypt) |
| attempts | integer | Jumlah percobaan salah |
| resend_count | integer | Jumlah resend dalam 1 jam |
| created_at | timestamp | Waktu generate |
| expires_at | timestamp | created_at + 5 menit |
| verified_at | timestamp (nullable) | Waktu sukses verifikasi |

### 5.4 Email Template (Contoh)

```
Subject: Kode Verifikasi GoKang: 482913

Halo {{nama}},

Terima kasih sudah mendaftar di GoKang!

Kode verifikasi kamu adalah:

    482913

Kode ini berlaku selama 5 menit.

Demi keamanan akun, JANGAN BAGIKAN kode ini kepada siapa pun,
termasuk pihak yang mengaku dari GoKang.

Jika kamu tidak merasa mendaftar, abaikan email ini.

Butuh bantuan? Hubungi support@gokang.id

Tim GoKang
```

---

## 6. Security & Rate Limiting

### 6.1 Security Controls
- **SC-1** OTP disimpan hanya dalam bentuk hash; plaintext hanya ada saat pengiriman email.
- **SC-2** `registration_token` adalah JWT berusia 10 menit yang mengikat sesi registrasi ke device/IP tertentu.
- **SC-3** Semua komunikasi via HTTPS (TLS 1.2+).
- **SC-4** Email dikirim dengan SPF, DKIM, DMARC untuk mencegah spoofing.
- **SC-5** Logging tidak boleh merekam OTP plaintext, password, atau PII sensitif.
- **SC-6** PII (email, phone) di-encrypt at-rest menggunakan AES-256.

### 6.2 Rate Limiting

| Scope | Limit |
|---|---|
| Registration attempts per IP | 10 per jam |
| Registration attempts per email | 5 per jam |
| OTP verify attempts per OTP | 5 (hard cap) |
| Resend OTP per email | 3 per jam |
| Resend interval minimum | 120 detik |

### 6.3 Abuse Prevention
- **AP-1** Deteksi signup velocity anomaly (contoh: 50 registrasi dari IP yang sama dalam 5 menit) → auto-block IP.
- **AP-2** CAPTCHA (invisible reCAPTCHA v3 atau hCaptcha) ditampilkan jika IP mencapai threshold suspicious.
- **AP-3** Monitoring bounce rate email; jika > 5%, alert ke tim engineering.

---

## 7. Edge Cases & Error Handling

| # | Skenario | Behavior yang Diharapkan |
|---|---|---|
| E1 | User input email dengan format salah | Error inline: "Format email tidak valid" |
| E2 | Email sudah terdaftar dan aktif | Error: "Email sudah terdaftar. Silakan masuk." + link ke halaman login |
| E3 | Email terdaftar tapi belum terverifikasi | Kirim ulang OTP, lanjut ke halaman OTP |
| E4 | Email bounce (invalid/tidak ada) | Setelah 30 detik tanpa verifikasi, tampilkan banner: "Email tidak terkirim? Periksa alamat email kamu." + CTA edit email |
| E5 | User tutup app sebelum verifikasi | `registration_token` tetap valid 10 menit; user bisa kembali dan masukkan OTP |
| E6 | OTP expired | Error: "Kode OTP sudah kadaluarsa" + tombol "Kirim ulang" aktif |
| E7 | User salah input OTP 5x | OTP di-invalidate, user harus "Kirim ulang" |
| E8 | User capai batas resend 3x | Disable tombol resend, tampilkan pesan "Batas kirim ulang tercapai. Coba lagi dalam 1 jam" |
| E9 | Email provider down | Fallback queue + retry dengan exponential backoff (3x); setelah gagal semua, tampilkan error "Kami sedang mengalami gangguan, silakan coba lagi" |
| E10 | User tidak menerima email (spam folder) | Tampilkan hint: "Tidak menerima email? Cek folder spam atau promotions" |
| E11 | Network error saat submit OTP | Retry otomatis 1x; jika gagal, toast: "Koneksi bermasalah, coba lagi" |
| E12 | User paste OTP dari email | Input harus support paste; auto-split ke 6 kotak |
| E13 | User tap "Kembali" dari halaman OTP | Konfirmasi: "Keluar dari verifikasi? OTP yang sudah dikirim akan tetap berlaku" |

---

## 8. Success Metrics & Analytics

### 8.1 Primary Metrics (North Star)

| Metric | Baseline (SMS) | Target (Email) |
|---|---|---|
| Registration completion rate | TBD | +5 poin persentase |
| OTP delivery rate | ~92% | ≥ 98% |
| Cost per successful registration | TBD | -80% |
| Time to verify (median) | TBD | ≤ 60 detik |

### 8.2 Secondary Metrics

| Metric | Deskripsi |
|---|---|
| OTP email delivery latency (P50, P95, P99) | Dari request API sampai email delivered |
| Email open rate | % email OTP yang dibuka |
| Bounce rate | % email yang bounce (hard + soft) |
| Spam complaint rate | % email yang di-mark spam |
| Resend rate | % registrasi yang perlu resend minimal 1x |
| Failed verification rate | % OTP yang invalid sampai expired |
| Drop-off di halaman OTP | % user yang sampai halaman OTP tapi tidak verifikasi |

### 8.3 Event Tracking (Analytics)

| Event Name | Trigger | Properties |
|---|---|---|
| `registration_started` | Halaman registrasi dibuka | source, platform |
| `registration_submitted` | Tap "Daftar" | has_name, has_phone, has_email |
| `otp_email_sent` | Backend berhasil kirim email | email_domain, latency_ms |
| `otp_page_viewed` | Halaman OTP tampil | |
| `otp_submitted` | Tap "Lanjutkan" | attempt_number |
| `otp_verified_success` | OTP benar | time_to_verify_sec |
| `otp_verified_failed` | OTP salah | error_code, attempts_remaining |
| `otp_resend_requested` | Tap "Kirim ulang" | resend_count |
| `otp_expired` | OTP kadaluarsa tanpa verifikasi | |
| `registration_completed` | Akun aktif | total_time_sec, resend_count |
| `registration_abandoned` | Sesi berakhir tanpa verifikasi | last_step |

### 8.4 Dashboard
Dashboard real-time harus menampilkan: delivery rate, latency P95, bounce rate, verification success rate, resend rate, dan drop-off funnel secara harian dan per jam.

---

## 9. Rollout Plan

| Fase | Cakupan | Durasi |
|---|---|---|
| Internal testing | QA team, dummy accounts | 1 minggu |
| Beta (5% traffic) | Feature flag aktif untuk 5% user baru | 1 minggu |
| Gradual rollout | 25% → 50% → 100% | 2 minggu |
| Full launch | 100% traffic, SMS OTP di-deprecate | - |

### 9.1 Rollback Plan
Jika delivery rate < 90% atau completion rate drop > 10% selama 24 jam, aktifkan feature flag untuk fallback ke SMS OTP dalam waktu < 30 menit.

---

## 10. Open Questions

1. Email provider mana yang dipilih (SendGrid vs AWS SES vs Mailgun)? — perlu keputusan dari tim engineering & finance.
2. Apakah perlu dukungan bahasa email selain Bahasa Indonesia (misal Inggris) di v1?
3. Bagaimana handling user existing yang belum punya email terdaftar — perlu flow migrasi terpisah?
4. Apakah nomor HP tetap wajib diisi di form registrasi untuk keperluan profil/kontak mitra?

---

## 11. Appendix

### 11.1 Dependencies
- Email transactional provider (SLA ≥ 99.9%)
- Redis untuk OTP cache
- Analytics pipeline (existing)
- Feature flag system (existing)

### 11.2 Stakeholders
| Role | Nama/Tim |
|---|---|
| Product Owner | TBD |
| Engineering Lead | TBD |
| Design Lead | TBD |
| QA Lead | TBD |
| Security Review | InfoSec Team |
| Finance (cost approval) | Finance Team |