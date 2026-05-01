# PRD 09 — Auth Screens (Login, Register, OTP)

> Halaman autentikasi mobile app: Login, Register, dan OTP verification.
> Semua auth menggunakan Nomor HP + OTP (bukan email+password).
> Referensi visual: screenshot login GoKang asli.

---

## 1. Overview

### Auth Method
- **Login**: input nomor HP → kirim OTP → verify → masuk
- **Register**: input nomor HP → kirim OTP → verify → lengkapi profil → masuk
- **Tidak ada password** — semua via OTP (WhatsApp/SMS)

### Flow Diagram
```
Welcome Screen
├── Tap "Masuk" → Login Screen
│   └── Input HP → OTP Screen → Home (tabs)
│
├── Tap "Daftar" → Register Screen
│   └── Input HP → OTP Screen → Complete Profile → Home (tabs)
│
└── Tap "Lewati" → Home (guest, limited)
```

### API Endpoints (sudah dibuat di backend)
- POST `/api/v1/auth/login/send-otp` → kirim OTP login
- POST `/api/v1/auth/login/verify-otp` → verify & dapat token
- POST `/api/v1/auth/register/send-otp` → kirim OTP register
- POST `/api/v1/auth/register/verify-otp` → verify OTP register
- POST `/api/v1/auth/register/complete` → lengkapi profil & dapat token

---

## 2. Screen: Login

### Layout (dari screenshot GoKang asli)

```
┌─────────────────────────────────────┐
│ ← (back button)                    │
│                                     │
│         [Logo GoKang Merah]         │
│          GoKang                     │
│        Tukang Jagoan                │
│                                     │
│  Silakan Masuk Dengan Akun Kamu     │
│  Masukkan nomor handphone kamu      │
│  yang terdaftar                     │
│                                     │
│  Nomor HP *                         │
│  ┌─────────────────────────────┐    │
│  │ 08xx-xxxx-xxxx              │    │
│  └─────────────────────────────┘    │
│                                     │
│  ┌─────────────────────────────┐    │
│  │          Masuk              │    │
│  └─────────────────────────────┘    │
│                                     │
│                                     │
│                                     │
│                                     │
│                                     │
│                                     │
│                                     │
│  Belum punya akun? Daftar sekarang  │
└─────────────────────────────────────┘
```

### Spesifikasi Detail

**Header:**
- Back button (←) di pojok kiri atas
- onPress: navigate back ke welcome screen
- Icon: chevron-left atau arrow-left, warna hitam, ukuran 24px
- Padding: 16px

**Logo Section:**
- Logo GoKang merah (icon hexagon + text)
- "GoKang" font 28px bold merah #E8272A
- "Tukang Jagoan" font 14px medium merah #E8272A
- Center horizontal
- Margin top: 20px dari back button

**Title Section:**
- Heading: "Silakan Masuk Dengan Akun Kamu"
- Font: 20px, bold, hitam #111827
- Text align: center
- Margin top: 32px

- Subheading: "Masukkan nomor handphone kamu yang terdaftar"
- Font: 14px, regular, abu #6B7280
- Text align: center
- Margin top: 8px

**Form Section:**
- Margin top: 32px
- Padding horizontal: 24px

- Label: "Nomor HP" + asterisk merah
- Font label: 14px, medium, hitam
- Asterisk: merah #E8272A

- Input field:
  - Height: 52px
  - Border: 1.5px solid #D1D5DB
  - Border radius: 12px (rounded-xl)
  - Padding horizontal: 16px
  - Font: 16px
  - Placeholder: "08xx-xxxx-xxxx" warna #9CA3AF
  - Keyboard type: phone-pad
  - Max length: 15
  - Focus state: border merah #E8272A
  - Error state: border merah + text error di bawah

**Button "Masuk":**
- Margin top: 24px
- Background: #E8272A (merah)
- Text: "Masuk" putih, 16px, bold
- Height: 52px
- Border radius: 26px (pill shape, sangat rounded)
- Full width
- Disabled state: opacity 50% (kalau input kosong atau < 10 digit)
- Loading state: ActivityIndicator putih + text "Mengirim OTP..."
- onPress: validasi nomor → call API send-otp → navigate ke OTP screen

**Footer (sticky bottom):**
- Position: absolute bottom atau di dalam KeyboardAvoidingView
- Padding bottom: safe area + 16px
- Text: "Belum punya akun?" font 14px abu #6B7280
- Link: "Daftar sekarang" font 14px bold merah #E8272A
- onPress: navigate ke Register screen

### Validasi
- Nomor HP wajib diisi → "Nomor HP wajib diisi"
- Format: harus dimulai dengan 08 atau +62
- Minimal 10 digit, maksimal 15 digit
- Kalau API return 404 (belum terdaftar): "Nomor HP belum terdaftar. Silakan daftar dulu."

### Keyboard Handling
- KeyboardAvoidingView (behavior: padding di iOS, height di Android)
- Saat keyboard muncul: form scroll ke atas, footer tetap visible
- Tap di luar input: dismiss keyboard

---

## 3. Screen: Register

### Layout
Hampir identik dengan Login, perbedaan:

**Heading:** "Daftar Akun Baru"
**Subheading:** "Masukkan nomor handphone aktif kamu untuk mendaftar"

**Button:** "Daftar" (bukan "Masuk")

**Footer:** "Sudah punya akun? **Masuk sekarang**"
→ onPress: navigate ke Login screen

### Validasi Tambahan
- Kalau API return 409 (sudah terdaftar): "Nomor HP sudah terdaftar. Silakan masuk."

---

## 4. Screen: OTP Verification

### Layout

```
┌─────────────────────────────────────┐
│ ← (back button)                    │
│                                     │
│         [Logo GoKang Merah]         │
│                                     │
│      Verifikasi Nomor Kamu          │
│  Kode OTP telah dikirim ke          │
│  +62812****7890                     │
│                                     │
│     ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐  │
│     │  │ │  │ │  │ │  │ │  │ │  │  │
│     └──┘ └──┘ └──┘ └──┘ └──┘ └──┘  │
│                                     │
│  Tidak menerima kode?               │
│  Kirim ulang (59 detik)             │
│                                     │
│  ┌─────────────────────────────┐    │
│  │        Verifikasi           │    │
│  └─────────────────────────────┘    │
│                                     │
└─────────────────────────────────────┘
```

### Spesifikasi Detail

**Header:**
- Back button (←) → kembali ke login/register
- Logo GoKang kecil (opsional, atau skip)

**Title:**
- Heading: "Verifikasi Nomor Kamu"
- Font: 20px, bold, hitam
- Margin top: 40px

**Phone Display:**
- Text: "Kode OTP telah dikirim ke"
- Font: 14px, regular, abu
- Nomor HP: masked format (+62812****7890)
- Font nomor: 14px, bold, hitam
- Margin top: 8px

**OTP Input (6 digit):**
- 6 kotak terpisah, horizontal center
- Setiap kotak:
  - Ukuran: 48x52px
  - Border: 1.5px solid #D1D5DB
  - Border radius: 12px
  - Font: 24px, bold, center
  - Focus: border merah #E8272A
  - Filled: background #FEE2E2 (merah sangat terang)
- Gap antar kotak: 8px
- Auto-focus ke kotak pertama saat screen mount
- Auto-advance: setelah isi 1 digit, otomatis pindah ke kotak berikutnya
- Backspace: pindah ke kotak sebelumnya
- Keyboard: number-pad
- Auto-submit: kalau 6 digit sudah terisi, otomatis trigger verify
  (atau tunggu tap button)

**Resend Timer:**
- Text: "Tidak menerima kode?"
- Font: 14px, abu
- Timer: "Kirim ulang (59 detik)" — countdown dari 60
  - Selama countdown: text abu, tidak bisa di-tap
  - Setelah countdown habis: "Kirim ulang" jadi merah bold, bisa di-tap
  - onPress: call API send-otp lagi, reset timer ke 60
- Margin top: 24px

**Button "Verifikasi":**
- Sama style dengan button "Masuk" di login
- Background merah, pill shape
- Disabled kalau belum 6 digit
- Loading state saat verify
- onPress: call API verify-otp
  - Kalau dari login flow → API verify → dapat token → navigate ke Home
  - Kalau dari register flow → API verify → navigate ke Complete Profile

**Error Handling:**
- OTP salah: shake animation pada input boxes + text merah "Kode OTP salah"
- OTP expired: "Kode sudah kadaluarsa. Kirim ulang kode baru."
- Max attempts: "Terlalu banyak percobaan. Coba lagi nanti."

---

## 5. Screen: Complete Profile (Register Only)

### Layout

```
┌─────────────────────────────────────┐
│ ← (back button)                    │
│                                     │
│         [Logo GoKang Merah]         │
│                                     │
│      Lengkapi Profil Kamu           │
│  Isi data berikut untuk             │
│  menyelesaikan pendaftaran          │
│                                     │
│  Nama Lengkap *                     │
│  ┌─────────────────────────────┐    │
│  │ Masukkan nama lengkap       │    │
│  └─────────────────────────────┘    │
│                                     │
│  Email (Opsional)                   │
│  ┌─────────────────────────────┐    │
│  │ contoh@email.com            │    │
│  └─────────────────────────────┘    │
│                                     │
│  ┌─────────────────────────────┐    │
│  │       Selesai Daftar        │    │
│  └─────────────────────────────┘    │
│                                     │
└─────────────────────────────────────┘
```

### Spesifikasi Detail

**Heading:** "Lengkapi Profil Kamu"
**Subheading:** "Isi data berikut untuk menyelesaikan pendaftaran"

**Fields:**

1. Nama Lengkap *
   - TextInput, required
   - Placeholder: "Masukkan nama lengkap"
   - Validasi: min 3 karakter
   - autoCapitalize: words

2. Email (Opsional)
   - TextInput, optional
   - Placeholder: "contoh@email.com"
   - Keyboard: email-address
   - Validasi: kalau diisi harus format email valid

**Button "Selesai Daftar":**
- Merah pill shape, sama style
- onPress: call API register/complete → dapat token → navigate ke Home
- Loading state: "Mendaftarkan..."

**Setelah berhasil:**
- Simpan token ke SecureStore
- Simpan user data ke Zustand store
- Navigate ke Home (tabs) dengan router.replace
- Toast/notification: "Selamat datang di GoKang!"

---

## 6. Shared Components

### Logo Component
Reusable di semua auth screen:
```
Props: size ('small' | 'medium' | 'large')
- small: icon 32px + text 20px
- medium: icon 48px + text 28px (default)
- large: icon 64px + text 36px
```

### AuthInput Component
Reusable text input untuk auth screens:
```
Props: label, placeholder, value, onChangeText, 
       keyboardType, error, required, secureTextEntry
Features:
- Label dengan asterisk merah kalau required
- Border merah saat error
- Error message text di bawah
- Focus state border merah
```

### AuthButton Component
```
Props: title, onPress, loading, disabled, variant ('primary' | 'outline')
- primary: background merah, text putih
- outline: background putih, border merah, text merah
- Pill shape (border-radius 26px)
- Height 52px
- Loading spinner
```

---

## 7. State Management

### Auth Store (Zustand)
```typescript
interface AuthState {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
  isLoading: boolean;

  // Actions
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  
  // Async
  checkAuth: () => Promise<void>;  // cek token di SecureStore saat app launch
}
```

### Data Flow
```
1. User input phone → local state
2. Tap "Masuk" → API call (loading state)
3. API success → navigate to OTP screen (pass phone as param)
4. User input OTP → API call
5. API success → receive { user, token }
6. Save token → SecureStore (persist)
7. Save user → Zustand store (memory)
8. Navigate → Home (router.replace, no back)
```

---

## 8. API Integration

### services/api/auth.ts
```typescript
// Send OTP for login
export const sendLoginOtp = (phone: string) =>
  apiClient.post('/auth/login/send-otp', { phone });

// Verify OTP for login (returns user + token)
export const verifyLoginOtp = (phone: string, otp: string) =>
  apiClient.post('/auth/login/verify-otp', { phone, otp });

// Send OTP for register
export const sendRegisterOtp = (phone: string) =>
  apiClient.post('/auth/register/send-otp', { phone });

// Verify OTP for register
export const verifyRegisterOtp = (phone: string, otp: string) =>
  apiClient.post('/auth/register/verify-otp', { phone, otp });

// Complete registration
export const completeRegistration = (data: {
  phone: string;
  name: string;
  email?: string;
}) => apiClient.post('/auth/register/complete', data);
```

### Error Handling per Endpoint
| API Response | UI Behavior |
|---|---|
| 200 success | Navigate to next screen |
| 404 not found (login) | "Nomor HP belum terdaftar" |
| 409 conflict (register) | "Nomor HP sudah terdaftar" |
| 422 validation | Show field-level errors |
| 429 too many requests | "Terlalu banyak percobaan. Coba lagi nanti." |
| 500 server error | "Terjadi kesalahan. Coba lagi." |

---

## 9. Security

- Token disimpan di **SecureStore** (bukan AsyncStorage) — encrypted
- Nomor HP di OTP screen di-mask: +62812****7890
- OTP input tidak bisa di-paste dari clipboard lebih dari 6 digit
- Auto-clear OTP input setelah 3x salah
- Tidak log nomor HP atau OTP ke console di production

---

## 10. Acceptance Criteria

### Login
- [ ] Back button kembali ke welcome
- [ ] Logo GoKang merah di atas
- [ ] Input nomor HP dengan validasi format
- [ ] Button disabled kalau input kosong/invalid
- [ ] Loading state saat kirim OTP
- [ ] Error message dari API tampil dengan benar
- [ ] Footer "Belum punya akun? Daftar sekarang" navigate ke register
- [ ] Keyboard handling tidak overlap content

### Register
- [ ] Sama seperti login tapi heading/button berbeda
- [ ] Footer navigate ke login

### OTP
- [ ] 6 kotak input terpisah
- [ ] Auto-advance antar kotak
- [ ] Auto-submit saat 6 digit terisi
- [ ] Countdown timer 60 detik
- [ ] Resend button aktif setelah countdown habis
- [ ] Nomor HP di-mask
- [ ] Error handling: OTP salah, expired, max attempts

### Complete Profile
- [ ] Nama required, email opsional
- [ ] Validasi inline
- [ ] Setelah sukses: simpan token + navigate ke Home
- [ ] Tidak bisa back ke OTP screen (replace navigation)

---

**Version:** 1.0.0
**Last updated:** 2026-04-20