# PRD 15 v2 — Article Detail Page (Match GoKang UI)

> Detail page artikel yang persis meniru tampilan GoKang asli.
> Referensi: 4 screenshot GoKang "Bacaan Buat Kamu".

---

## 1. Overview

Halaman detail artikel dengan layout **simple, clean, dan readable**. Tidak ada animated header kompleks — cukup header sticky dengan title subtitle.

**Flow:**
```
Home → Article Card → Tap "Baca Selengkapnya" → Article Detail
```

**Key Design Points dari Screenshot:**
- Header simple: ← back + "Bacaan Buat Kamu 😍" + share icon
- Title artikel BESAR di atas (bukan di overlay hero image)
- Author line: "Oleh GoKang · 05 Maret 2026"
- Hero image setelah title (rounded 12px)
- Body text paragraf dengan spacing nyaman
- H2 tebal besar untuk section baru
- Numbered list (1. Presisi Ukuran) dan bullet list
- Bold text untuk highlight
- Red underlined link ("Download aplikasi GoKang")
- Inline CTA banner (merah, gambar tukang)
- Related articles section "Inspirasi Untuk Anda 🙌"

---

## 2. Screen Layout

### 2.1 Overview

```
┌─────────────────────────────────────┐
│ ← Bacaan Buat Kamu 😍          [⋗] │ ← Header sticky
│   Rekomendasi untuk bacaan kamu    │
├─────────────────────────────────────┤
│                                     │
│ Jangan Bingung! Ini Perbedaan      │ ← Title (24px bold)
│ Keramik Cutting dan Keramik Biasa  │
│                                     │
│ Oleh GoKang · 05 Maret 2026         │ ← Author + date
│                                     │
│ ┌─────────────────────────────────┐ │
│ │                                 │ │
│ │     [HERO IMAGE]                │ │ ← Rounded image
│ │     (250px height)              │ │
│ │                                 │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Keramik masih menjadi material      │ ← Body paragraph
│ lantai yang paling banyak           │
│ digunakan pada rumah tinggal...     │
│                                     │
│ Banyak orang memilih keramik        │
│ cutting karena tampilannya...       │
│                                     │
│ ## Pengertian Keramik Cutting       │ ← H2 (22px bold)
│                                     │
│ Keramik cutting awalnya adalah      │
│ keramik biasa yang telah melalui    │
│ proses pemotongan presisi...        │
│                                     │
│ ## Perbedaan Keramik Biasa dan      │
│    Keramik Cutting                  │
│                                     │
│ ### 1. Presisi Ukuran               │ ← H3 (18px bold)
│                                     │
│ Keramik biasa dibuat melalui...     │
│                                     │
│ ### 2. Lebar Nat                    │
│                                     │
│ Keramik biasa biasanya...           │
│                                     │
│ • Bullet point 1                    │ ← List
│ • Bullet point 2                    │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ [CTA BANNER - merah]            │ │ ← Inline CTA
│ │ Segera panggil konsultan lewat  │ │
│ │ aplikasi GoKang...              │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Teks penutup artikel...             │
│                                     │
│ yuk Download aplikasi GoKang       │ ← Red underlined link
│ Sekarang!                           │
│                                     │
├─────────────────────────────────────┤
│                                     │
│ Inspirasi Untuk Anda 🙌              │ ← Related section
│ Rekomendasi untuk bacaan kamu       │
│                                     │
│ ┌──────────┐ ┌──────────┐           │
│ │ [IMAGE]  │ │ [IMAGE]  │ →         │ ← Horizontal scroll
│ │ Judul... │ │ Judul... │           │
│ │ Excerpt  │ │ Excerpt  │           │
│ └──────────┘ └──────────┘           │
└─────────────────────────────────────┘
```

---

## 3. Component Specs

### 3.1 Header (Simple Sticky)

**Spec:**
- Height: 64px + safe area top
- Background: putih
- Border bottom: 1px #E5E7EB
- Position: sticky top

**Content:**
- Left: Back button (←) hitam, size 24px
- Center-left: 
  - Title: "Bacaan Buat Kamu 😍" (Poppins_700Bold, 16px, hitam)
  - Subtitle: "Rekomendasi untuk bacaan kamu" (Poppins_400Regular, 12px, abu #6B7280)
- Right: Share icon (⋗) hitam, size 24px

**NO transparent overlay** — header solid putih dari awal. Lebih simple dan match screenshot.

---

### 3.2 Article Title

**Position:** Di atas hero image (BUKAN overlay)

**Spec:**
- Padding: 20px horizontal, 20px top
- Font: Poppins_800ExtraBold, 24px
- Color: #111827
- Line height: 32px
- Max lines: unlimited (biasanya 2-3 baris)

---

### 3.3 Author + Date Line

**Spec:**
- Padding: 0 20px, margin bottom 16px
- Format: "Oleh **GoKang** · 05 Maret 2026"
- Font: Poppins_400Regular, 14px
- Color: #6B7280 (abu)
- "GoKang" → bold (Poppins_600SemiBold), color hitam #111827
- Separator: " · " (dot)

---

### 3.4 Hero Image

**Spec:**
- Width: full minus 40px padding
- Height: 250px
- Border radius: 12px
- Resize mode: cover
- Margin: 0 20px

**NO gradient overlay** — clean image.

---

### 3.5 Body Content (Rich Text)

**Paragraph:**
- Font: Poppins_400Regular, 15px
- Color: #111827 (hitam — bukan abu untuk kontras bagus)
- Line height: 26px
- Margin bottom: 14px
- Padding: 0 20px

**Bold text inline:**
- Font weight: Poppins_700Bold
- Color: sama #111827
- Contoh: "keramik cutting", "pemotongan presisi pada bagian tepi setelah proses produksi selesai"

**H2 (Section Heading):**
- Font: Poppins_800ExtraBold, 22px
- Color: #111827
- Margin top: 28px
- Margin bottom: 14px
- Contoh: "Pengertian Keramik Cutting", "Perbedaan Keramik Biasa dan Keramik Cutting"

**H3 (Sub-section / Numbered):**
- Font: Poppins_700Bold, 18px
- Color: #111827
- Margin top: 20px
- Margin bottom: 10px
- Format: "1. Presisi Ukuran", "2. Lebar Nat"
- Angka + judul dalam satu baris

**Bullet List:**
- Indent: 16px from paragraph
- Bullet: • (circle)
- Bullet color: #111827
- Item spacing: 8px
- Font: sama paragraph (15px)

**Red Link (Download app):**
- Color: #E8272A
- Text decoration: underline
- Font: Poppins_700Bold (tebal)
- Contoh: "Download aplikasi GoKang"

---

### 3.6 Inline CTA Banner

**Position:** Di tengah body (biasanya 1-2 per artikel)

**Spec:**
- Background: merah gradient (atau solid #E8272A)
- Border radius: 16px
- Padding: 16px
- Margin: 24px 20px
- Height: auto (biasanya 120-150px)

**Content:**
- Left: Text
  - Line 1: "Segera panggil konsultan lewat aplikasi GoKang..." (putih, Poppins_500Medium, 14px)
  - Line 2: "untuk solusi ganti keramik yang presisi dan memuaskan." (putih, 13px)
- Right: Gambar illustrasi (tukang + app mockup)
- Kalau tidak ada gambar, pakai emoji 🛠️

**Optional:**
- Tappable → navigate to service booking

---

### 3.7 Related Articles Section

**Section Header:**
- Padding: 24px 20px 16px
- Title: "Inspirasi Untuk Anda 🙌"
  - Font: Poppins_800ExtraBold, 20px
  - Color: #111827
- Subtitle: "Rekomendasi untuk bacaan kamu"
  - Font: Poppins_400Regular, 13px
  - Color: #6B7280
- Border top: 1px #F3F4F6 (light separator)

**Cards (Horizontal Scroll):**
- Card width: 300px (lebih besar dari sebelumnya)
- Card height: auto
- Margin right: 12px
- Border radius: 16px
- Background: putih
- Shadow: subtle

**Card Content:**
- Image: 300x180px, border radius 16px (top only)
- Share icon (⋗) di top-right corner (pada image overlay)
- Padding content: 16px
- Title: Poppins_700Bold, 16px, 2 lines max
- Excerpt: Poppins_400Regular, 14px, 2 lines max, abu

---

## 4. Differences dari Versi Sebelumnya

| Feature | Versi Lama | Versi Baru (Match GoKang) |
|---|---|---|
| Header | Transparent overlay animated | Simple sticky putih |
| Title position | Di overlay hero image | Di atas hero image (plain text) |
| Hero image | 400px full width | 250px rounded 12px |
| Tags/categories | Ada chips kategori | Tidak ada (cukup author line) |
| Meta info | Author + date + views + read time | Cuma "Oleh GoKang · Tanggal" |
| Content color | #374151 (abu gelap) | #111827 (hitam — lebih kontras) |
| CTA style | Pink soft card | Red banner dengan gambar |
| Related section | "📰 Artikel Terkait" | "Inspirasi Untuk Anda 🙌" |
| Bottom CTA | Sticky button bawah | TIDAK ada (cukup link inline) |

---

## 5. Data Structure (Updated)

```typescript
interface Article {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;          // Rich text dengan markdown-like syntax
  image: string;            // Hero image URL
  author_name: string;      // "GoKang" (bukan object)
  published_at: string;     // ISO date
  related_articles: Array<{
    id: number;
    slug: string;
    title: string;
    excerpt: string;        // NEW: 2 baris teaser
    image: string;
  }>;
}
```

**Catatan:**
- Tidak perlu: tags, category, read_time, views (simplified)
- Author cukup string nama (tidak perlu avatar dan object complex)

---

## 6. Content Markdown Syntax

Artikel pakai syntax markdown-like yang bisa di-parse mobile:

```
Paragraph biasa di sini.

Paragraf kedua dengan **bold text** inline.

## Heading Level 2

Paragraf setelah heading.

### 1. Numbered Section

Paragraf subsection.

### 2. Another Section

Dengan bullet list:
- Item pertama
- Item kedua
- Item ketiga

[CTA_BANNER]
Segera panggil konsultan lewat aplikasi GoKang untuk solusi ganti keramik yang presisi dan memuaskan.
[/CTA_BANNER]

Paragraf penutup dengan [link](download-app) merah.
```

**Parser harus handle:**
- `## ` → H2
- `### ` → H3 (termasuk numbered)
- `**text**` → Bold inline
- `- ` → Bullet list
- `[CTA_BANNER]...[/CTA_BANNER]` → Inline CTA card
- `[link](url)` → Red underlined link

---

## 7. Acceptance Criteria

### Layout
- [ ] Header simple: ← + title + subtitle + share
- [ ] Title artikel besar di atas image (bukan overlay)
- [ ] Author line: "Oleh GoKang · tanggal"
- [ ] Hero image rounded 250px
- [ ] Body content readable (black text, 26px line-height)
- [ ] H2 dan H3 proper hierarchy
- [ ] Numbered sections (1., 2., 3.)
- [ ] Bullet list indent correct
- [ ] Bold text inline terlihat jelas
- [ ] Red underlined link tampil
- [ ] Inline CTA banner merah dengan gambar/emoji

### Related Articles
- [ ] Section "Inspirasi Untuk Anda 🙌"
- [ ] Cards horizontal scroll
- [ ] Image + title + excerpt tampil
- [ ] Share icon di corner image
- [ ] Tappable navigate ke artikel lain

### Interaction
- [ ] Back button return
- [ ] Share button native share sheet
- [ ] Related card tap navigate
- [ ] Red link tap → action (download app / navigate)
- [ ] Smooth scroll

---

## 8. File Structure

```
app/
└── article/
    └── [slug].tsx

components/
└── article/
    ├── ArticleHeader.tsx
    ├── ArticleContent.tsx      ← Rich text parser
    ├── InlineCTABanner.tsx
    └── RelatedArticlesSection.tsx
```

---

**Version:** 2.0.0
**Last updated:** 2026-04-22