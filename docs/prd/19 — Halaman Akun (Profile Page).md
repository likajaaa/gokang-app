# PRD 19 — Halaman Akun (Profile Page)

> Halaman profil user dengan menu navigasi dan fitur-fitur akun.
> Referensi visual: screenshot GoKang "Akun" page.

---

## 1. Overview

Halaman Akun menampilkan informasi user dan menu navigasi ke berbagai fitur akun.

**Menu Items (dari screenshot):**
1. Daftar Alamat
2. Rekening Refund
3. Ketentuan & Privasi
4. Pusat Bantuan
5. Pesanan Dikomplain
6. Beri Rating GoKang
7. Hubungi Kami

---

## 2. Screen Layout

### 2.1 Header
```
┌─────────────────────────────────────┐
│              Akun                   │
└─────────────────────────────────────┘
```
- Title: "Akun" center
- Font: Poppins_700Bold, 18px
- No back button (tab page)
- Background white, border bottom 1px #E5E7EB

---

### 2.2 Profile Section

```
┌──────────────────────────────────────────┐
│                                          │
│  [Avatar 80px]   hee                     │
│                  Email terverifikasi ✅   │
│                  ✏️ Ubah Akun             │
│                                          │
└──────────────────────────────────────────┘
```

**Avatar:**
- Size: 80px circle
- Background: #FEE2E2 (pink light)
- Default: person icon abu/merah (silhouette)
- If photo: show user photo
- Tap → upload photo

**User Name:**
- Font: Poppins_700Bold, 20px
- Color: #111827

**Email Verified Badge:**
- Background: white
- Border: 1px #E5E7EB
- Border radius: 16px
- Padding: 4px 12px
- Text: "Email terverifikasi" — Poppins_500Medium, 13px, hijau #16A34A (italic)
- Icon: ✅ verified badge hijau (right of text)
- If NOT verified: "Email belum terverifikasi" + tombol "Verifikasi"

**Ubah Akun:**
- Icon: ✏️ pensil merah
- Text: "Ubah Akun" — Poppins_600SemiBold, 14px, merah #E8272A
- Tap → navigate ke Edit Profile screen

---

### 2.3 Menu List

7 menu items dengan icon abu + label + chevron:

```
┌──────────────────────────────────────────┐
│  📍  Daftar Alamat                    >  │
├──────────────────────────────────────────┤
│  💳  Rekening Refund                  >  │
├──────────────────────────────────────────┤
│  📄  Ketentuan & Privasi              >  │
├──────────────────────────────────────────┤
│  ❓  Pusat Bantuan                    >  │
├──────────────────────────────────────────┤
│  💬  Pesanan Dikomplain               >  │
├──────────────────────────────────────────┤
│  ⭐  Beri Rating GoKang               >  │
├──────────────────────────────────────────┤
│  📞  Hubungi Kami                     >  │
└──────────────────────────────────────────┘
```

**Menu Item Spec:**
- Height: 60px
- Padding: 0 16px
- Background: white
- Border bottom: 1px #F3F4F6
- Icon: 24px, color #6B7280
- Label: Poppins_500Medium, 15px, #111827
- Chevron: ChevronRight 20px, #9CA3AF
- onPress: navigate ke page masing-masing

---

### 2.4 Logout Button

```
┌──────────────────────────────────────────┐
│           Keluar                         │
└──────────────────────────────────────────┘
```
- Full width
- Text: "Keluar" merah #E8272A
- Border: 1.5px merah
- Border radius: 28px
- Padding: 16px
- Margin: 24px 16px
- Confirmation dialog sebelum logout

---

## 3. Sub-Pages

### 3.1 Edit Profile (Ubah Akun)

**Fields:**
- Foto profil (upload)
- Nama lengkap (TextInput)
- Email (TextInput, disabled jika sudah verified)
- No. HP (TextInput, format Indonesia)
- Tanggal lahir (DatePicker, optional)

**Actions:**
- Simpan Perubahan (POST /profile/update)
- Upload foto → image picker → POST /profile/photo

**Security:**
- Email change require OTP verification
- Phone change require OTP verification

---

### 3.2 Daftar Alamat

**List saved addresses:**
```
┌──────────────────────────────────────┐
│ 🏠 Rumah (Default)            [Edit] │
│    Jl. Merdeka No. 10                │
│    Jakarta Pusat, 10110              │
├──────────────────────────────────────┤
│ 🏢 Kantor                     [Edit] │
│    Jl. Sudirman No. 45               │
│    Jakarta Selatan, 12190            │
└──────────────────────────────────────┘
[+ Tambah Alamat Baru]
```

**Features:**
- Add, edit, delete address
- Set as default
- Label: Rumah / Kantor / Lainnya

---

### 3.3 Rekening Refund

**List saved bank accounts:**
```
┌──────────────────────────────────────┐
│ 🏦 BCA                        [Edit] │
│    1234567890                        │
│    A.n. John Doe                     │
└──────────────────────────────────────┘
[+ Tambah Rekening]
```

**Fields saat tambah:**
- Bank (dropdown: BCA, Mandiri, BNI, BRI, dll)
- No. Rekening
- Nama Pemilik (harus sama dengan KTP)

**Security:**
- Rekening digunakan untuk refund jika order dibatalkan
- Verifikasi nama pemilik rekening

---

### 3.4 Ketentuan & Privasi

**Sections:**
- Syarat & Ketentuan Penggunaan
- Kebijakan Privasi
- Kebijakan Refund & Pembatalan
- Tentang GoKang

**Implementation:**
- Static content (markdown/HTML)
- Atau WebView ke URL ketentuan GoKang

---

### 3.5 Pusat Bantuan (FAQ)

**Categories:**
- Tentang Pesanan
- Tentang Pembayaran
- Tentang Tukang
- Tentang Akun

**Each category:**
- List FAQ accordion (expandable)
- Tap FAQ → expand jawaban

**Bottom CTA:**
- "Masih butuh bantuan?" → Chat CS (WhatsApp)

---

### 3.6 Pesanan Dikomplain

**List orders dengan status:**
- `complained` — User submit komplain

**Per item:**
- Order code
- Service name
- Tanggal komplain
- Status komplain (dalam review / resolved)
- Detail komplain

**Add Komplain:**
- Pilih order yang selesai
- Kategori masalah
- Deskripsi
- Upload foto bukti (max 5)

---

### 3.7 Beri Rating GoKang

**In-app review:**
- Rating bintang 1-5 untuk app
- Redirect ke Play Store / App Store untuk review

**Or:**
```
┌──────────────────────────────────────┐
│  ★★★★★                               │
│  Seberapa puas kamu dengan GoKang?   │
│                                      │
│  [Tulis review...]                   │
│                                      │
│  [Kirim ke Play Store]               │
└──────────────────────────────────────┘
```

---

### 3.8 Hubungi Kami

**Contact options:**
```
┌──────────────────────────────────────┐
│ WhatsApp    wa.me/6281234567890  [→] │
│ Email       cs@gokang.id         [→] │
│ Instagram   @gokang.id           [→] │
│ Website     gokang.id            [→] │
└──────────────────────────────────────┘
```

---

## 4. Security Features

### 4.1 Sensitive Data Protection

**Data yang AMAN ditampilkan:**
- Nama user (nama depan saja di greeting)
- Email (masked: he**@gmail.com)
- Status verifikasi

**Data yang MASKED:**
- No. HP: 0812-****-7890
- No. Rekening: ****-****-7890
- Tanggal lahir: tidak ditampilkan di list

**Data yang TIDAK pernah ditampilkan:**
- Password (hashed di database)
- Token autentikasi
- Nomor rekening lengkap tanpa action explisit user

### 4.2 Logout Security

```typescript
const handleLogout = async () => {
  Alert.alert(
    'Keluar',
    'Apakah kamu yakin ingin keluar dari akun ini?',
    [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Keluar',
        style: 'destructive',
        onPress: async () => {
          // 1. Revoke token di backend
          await api.post('/auth/logout');
          // 2. Clear local storage
          await SecureStore.deleteItemAsync('auth_token');
          await SecureStore.deleteItemAsync('user_data');
          // 3. Clear API headers
          delete api.defaults.headers.common['Authorization'];
          // 4. Navigate ke login
          router.replace('/auth/login');
        },
      },
    ]
  );
};
```

### 4.3 Token Storage

Gunakan `expo-secure-store` (bukan AsyncStorage) untuk menyimpan:
- auth_token
- refresh_token
- user_id

```typescript
import * as SecureStore from 'expo-secure-store';

// Simpan token
await SecureStore.setItemAsync('auth_token', token);

// Baca token
const token = await SecureStore.getItemAsync('auth_token');

// Hapus saat logout
await SecureStore.deleteItemAsync('auth_token');
```

### 4.4 API Authorization

Setiap request pakai Bearer token:
```typescript
api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
```

Token expired → auto redirect ke login.

---

## 5. API Endpoints

### GET /api/v1/profile
Response:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "hee",
    "email": "he**@gmail.com",
    "phone": "0812-****-7890",
    "email_verified": true,
    "phone_verified": false,
    "avatar_url": null,
    "created_at": "2026-01-15T10:00:00Z"
  }
}
```

### PUT /api/v1/profile/update
Request: `{ name, email, phone, birth_date }`

### POST /api/v1/profile/photo
Request: FormData dengan file foto

### POST /api/v1/auth/logout
Request: Bearer token
Response: `{ success: true, message: "Logged out" }`

---

## 6. Acceptance Criteria

### Profile Section
- [ ] Avatar circle 80px, default silhouette
- [ ] Nama user (Poppins_700Bold 20px)
- [ ] Badge "Email terverifikasi" hijau italic
- [ ] Link "Ubah Akun" merah dengan icon pensil

### Menu List
- [ ] 7 menu items tampil
- [ ] Icon abu kiri, label hitam, chevron kanan
- [ ] Tap navigate ke sub-page masing-masing
- [ ] Border separator antar item

### Logout
- [ ] Button "Keluar" merah outline
- [ ] Konfirmasi dialog sebelum logout
- [ ] Token dihapus dari secure store
- [ ] Navigate ke login setelah logout

### Security
- [ ] Token disimpan di SecureStore (bukan AsyncStorage)
- [ ] No. HP dan rekening di-masked
- [ ] Email di-masked (he**@gmail.com)
- [ ] Logout revoke token di backend

---

## 7. File Structure

```
app/
├── (tabs)/
│   └── account.tsx              ← Main profile page
├── account/
│   ├── edit-profile.tsx         ← Edit profil
│   ├── addresses.tsx            ← Daftar alamat
│   ├── refund-account.tsx       ← Rekening refund
│   ├── terms.tsx                ← Ketentuan & privasi
│   ├── help.tsx                 ← Pusat bantuan
│   ├── complaints.tsx           ← Pesanan dikomplain
│   ├── rating.tsx               ← Beri rating
│   └── contact.tsx              ← Hubungi kami

services/
└── api/
    └── profile.ts               ← getProfile, updateProfile
```

---

**Version:** 1.0.0
**Last updated:** 2026-04-22