# PRD 18 — Halaman Chat

> Halaman chat list dengan empty state, riwayat percakapan, dan integrasi WhatsApp.
> Referensi visual: screenshot GoKang "Chat" page.

---

## 1. Overview

Halaman Chat menampilkan daftar percakapan user dengan:
1. CS (Customer Service) GoKang
2. Tukang (untuk order yang sedang aktif)

Chat diarahkan ke WhatsApp untuk komunikasi real-time, namun list percakapan ditampilkan di dalam app sebagai riwayat.

**Flow:**
```
Bottom Nav → Tap "Chat" → Halaman Chat
  ├── Empty State: Tidak ada riwayat percakapan
  └── Chat List: Daftar percakapan aktif/riwayat
      └── Tap chat item → Buka WhatsApp (deep link)
```

---

## 2. Screen Layout

### 2.1 Header

```
┌─────────────────────────────────────┐
│           Chat              [🎧]    │
└─────────────────────────────────────┘
```

**Spec:**
- Title: "Chat" — center
- Font: Poppins_700Bold, 18px
- Color: #111827
- Right icon: Headset/CS icon (🎧)
  - Size: 24px
  - onPress → buka WA ke nomor CS GoKang
- Background: white
- Border bottom: 1px #E5E7EB
- Padding top: safe area

---

### 2.2 STATE KOSONG (Empty State)

```
┌─────────────────────────────────────┐
│                                     │
│                                     │
│      [Ilustrasi Open Box]           │
│      Kotak merah + panah biru       │
│                                     │
│   Tidak ada riwayat percakapan      │
│                                     │
│  Riwayat percakapan yang kamu       │
│  miliki akan muncul di sini         │
│                                     │
└─────────────────────────────────────┘
```

**Ilustrasi:** Sama dengan empty state Pesanan & Promo (open box merah + panah biru).

**Text:**
- Title: "Tidak ada riwayat percakapan"
  - Font: Poppins_700Bold, 20px
  - Color: #111827
- Subtitle: "Riwayat percakapan yang kamu miliki akan muncul di sini"
  - Font: Poppins_400Regular, 15px
  - Color: #6B7280
  - Text align: center

---

### 2.3 STATE ADA CHAT (Chat List)

```
┌─────────────────────────────────────┐
│ ┌─────────────────────────────────┐ │
│ │ [Avatar]  CS GoKang        2m   │ │ ← Chat item
│ │           Halo! Ada yang...     │ │
│ │                          [3]    │ │ ← Unread badge
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ [Avatar]  Pak Budi (Jagoan Cat) │ │
│ │           Saya sudah tiba di... │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ [Avatar]  CS GoKang             │ │
│ │           Terima kasih...       │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

---

## 3. Chat List Item Component

### 3.1 Layout

```
┌────────────────────────────────────────────┐
│                                            │
│  [Avatar 48px]  Name              Time    │
│                 Last message   [Badge]     │
│                                            │
└────────────────────────────────────────────┘
```

### 3.2 Spec

**Container:**
- Height: 76px
- Padding: 12px 16px
- Background: white
- Border bottom: 1px #F3F4F6
- onPress → buka WhatsApp deep link

**Avatar (left):**
- Size: 48px circle
- Margin right: 12px
- Types:
  - CS GoKang: Background merah #E8272A, icon headset putih 🎧
  - Tukang: Background abu #F3F4F6, emoji sesuai jagoan

**Content (flex: 1):**

Top row:
- Name: Poppins_600SemiBold, 15px, #111827
- Time: Poppins_400Regular, 12px, #9CA3AF (right aligned)

Bottom row:
- Last message: Poppins_400Regular, 14px, #6B7280
  - Max 1 line, ellipsis
  - Jika belum dibaca: Poppins_500Medium, #374151 (sedikit lebih gelap)
- Unread badge: circle merah, white number
  - Size: 20px minimum, auto-width untuk 2 digit
  - Background: #E8272A
  - Font: Poppins_700Bold, 11px, white

**Divider:**
- 1px #F3F4F6 bottom border per item

---

## 4. Chat Types

### 4.1 CS GoKang (Customer Service)

**Selalu ada 1 entry** untuk CS GoKang — muncul sebagai item pertama.

```
┌─────────────────────────────────────┐
│ [🎧 merah]  CS GoKang         Baru  │
│             Ada pertanyaan? Kami...  │
└─────────────────────────────────────┘
```

**Behavior onPress:**
- Buka WhatsApp dengan nomor CS GoKang
- Format: `whatsapp://send?phone=6281234567890&text=Halo%20CS%20GoKang`
- Fallback: `https://wa.me/6281234567890?text=Halo%20CS%20GoKang`

**Avatar:**
- Background: #E8272A (merah)
- Icon: 🎧 atau headset icon putih

---

### 4.2 Tukang (Per Order)

Muncul saat ada order dengan status aktif yang punya tukang ter-assign.

```
┌─────────────────────────────────────┐
│ [👷 abu]  Pak Budi         14.30   │
│           Jagoan Cat               │
│           Saya sudah tiba di...    │
└─────────────────────────────────────┘
```

**Behavior onPress:**
- Buka WhatsApp dengan nomor HP tukang
- Format: `whatsapp://send?phone={tukang_phone}&text=Halo%20Pak%20{nama}`

**Avatar:**
- Background: #F3F4F6 (abu muda)
- Emoji: 👷 atau sesuai service

**Sub-info:** Nama service (Jagoan Cat, Jagoan Keramik, dll)

---

## 5. WhatsApp Integration

### 5.1 Deep Link Logic

```typescript
const openWhatsApp = async (phone: string, message: string) => {
  // Format phone: remove +, spaces, dashes
  // Indonesia: 08xxx → 628xxx
  const formatted = phone
    .replace(/[^0-9]/g, '')
    .replace(/^0/, '62');

  const encodedMsg = encodeURIComponent(message);
  
  // Try native WA app first
  const waUrl = `whatsapp://send?phone=${formatted}&text=${encodedMsg}`;
  const webUrl = `https://wa.me/${formatted}?text=${encodedMsg}`;

  try {
    const canOpen = await Linking.canOpenURL(waUrl);
    if (canOpen) {
      await Linking.openURL(waUrl);
    } else {
      // Fallback to web WhatsApp
      await Linking.openURL(webUrl);
    }
  } catch (error) {
    Alert.alert('Error', 'Tidak dapat membuka WhatsApp');
  }
};
```

### 5.2 Pre-filled Messages

Per chat type:
```typescript
const CHAT_MESSAGES = {
  cs: 'Halo, saya butuh bantuan untuk pesanan saya.',
  tukang: (name: string, orderCode: string) => 
    `Halo Pak ${name}, saya ingin konfirmasi mengenai pesanan ${orderCode}.`,
  konsultasi: 'Halo, saya ingin konsultasi mengenai renovasi rumah saya.',
};
```

---

## 6. Security Considerations

### 6.1 Phone Number Masking

Nomor HP tukang **tidak ditampilkan** secara langsung di UI — hanya digunakan untuk deep link WA.

```typescript
// Jangan tampilkan: 0812-3456-7890
// Cukup tampilkan: nama tukang
// Nomor hanya dipakai di Linking.openURL

const handleChatTukang = (tukang: Tukang) => {
  openWhatsApp(tukang.phone, CHAT_MESSAGES.tukang(tukang.name, order.code));
};
```

### 6.2 Data yang Ditampilkan

**Safe to show:**
- Nama tukang (first name only)
- Nama service (Jagoan Cat)
- Preview pesan terakhir (tanpa data sensitif)
- Waktu chat

**Hidden/Protected:**
- Nomor HP tukang (tidak display, hanya untuk WA link)
- Data pribadi lainnya

### 6.3 Chat dengan CS

CS chat menggunakan nomor resmi GoKang yang di-hardcode di config — tidak perlu fetch dari API untuk menghindari manipulasi.

```typescript
// constants/config.ts
export const GOKANG_CS_PHONE = '6281234567890'; // Ganti dengan nomor CS resmi
export const GOKANG_CS_WA_URL = `https://wa.me/${GOKANG_CS_PHONE}`;
```

---

## 7. Data Structure

### 7.1 Chat Item (Local/Cached)

```typescript
interface ChatItem {
  id: string;
  type: 'cs' | 'tukang';
  name: string;
  subName?: string;        // "Jagoan Cat" untuk tukang
  avatarEmoji: string;
  avatarBg: string;
  lastMessage: string;
  lastMessageTime: string; // ISO date
  unreadCount: number;
  phone: string;           // untuk WA deep link (tidak ditampilkan)
  waMessage: string;       // pre-filled WA message
}
```

### 7.2 Chat List dari API (Optional)

```
GET /api/v1/chats
```

Response:
```json
{
  "success": true,
  "data": [
    {
      "id": "cs",
      "type": "cs",
      "name": "CS GoKang",
      "last_message": "Halo! Ada yang bisa kami bantu?",
      "last_message_at": "2026-04-22T14:30:00Z",
      "unread_count": 0
    },
    {
      "id": "tukang-1",
      "type": "tukang",
      "name": "Pak Budi",
      "sub_name": "Jagoan Cat",
      "last_message": "Saya sudah tiba di lokasi",
      "last_message_at": "2026-04-22T14:25:00Z",
      "unread_count": 2,
      "order_code": "KGO-2026-0001"
    }
  ]
}
```

**Note:** Phone number **tidak dikirim** dalam response list — hanya di-fetch saat user tap (GET /chats/{id}/contact untuk mendapat nomor WA secara on-demand dan secure).

---

## 8. Navigation Flow

```
Bottom Nav "Chat"
└── Halaman Chat
    ├── Empty State (belum ada chat)
    │   └── [Header CS icon] → Buka WA CS GoKang
    │
    └── Chat List
        ├── Item "CS GoKang" → Buka WA CS GoKang
        └── Item "Pak Budi (Jagoan Cat)" → Buka WA Tukang
            └── WhatsApp terbuka dengan pre-filled message
```

---

## 9. Acceptance Criteria

### Layout
- [ ] Header "Chat" center + headset icon kanan
- [ ] Empty state: ilustrasi + "Tidak ada riwayat percakapan"
- [ ] Chat list: avatar + nama + preview pesan + time + unread badge

### Chat Items
- [ ] CS GoKang selalu muncul di atas
- [ ] Avatar CS: merah dengan headset icon
- [ ] Avatar tukang: abu dengan emoji sesuai
- [ ] Unread badge merah muncul jika ada pesan belum dibaca
- [ ] Time format: "2m", "14:30", "Kemarin", "Senin"

### WhatsApp Integration
- [ ] Tap chat item → WhatsApp terbuka
- [ ] Pre-filled message sesuai tipe chat
- [ ] Fallback ke wa.me jika app WA tidak installed
- [ ] Nomor HP tukang tidak ditampilkan di UI

### Security
- [ ] Phone number di-mask dari display
- [ ] CS phone hardcoded (tidak dari API yang bisa dimanipulasi)
- [ ] Error handling jika WA tidak bisa dibuka

---

## 10. File Structure

```
app/
└── (tabs)/
    └── chat.tsx            ← Main chat page

components/
└── chat/
    ├── ChatListItem.tsx    ← Single chat item
    └── EmptyChat.tsx       ← Empty state

constants/
└── config.ts               ← CS phone number

utils/
└── whatsapp.ts             ← openWhatsApp() helper
```

---

**Version:** 1.0.0
**Last updated:** 2026-04-22