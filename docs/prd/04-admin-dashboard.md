# PRD 04 — Admin Dashboard

## 1. Scope
Web dashboard untuk **admin** mengelola platform GoKang Clone.

**Tech:** Laravel + Filament (admin panel) atau Laravel Blade + Tailwind.
**Rekomendasi:** **Filament 3** — cepat & bawaan banyak fitur.

---

## 2. Roles & Permissions

| Role | Access |
|------|--------|
| Super Admin | Semua fitur |
| Admin | Semua kecuali manage admin users |
| CS (Customer Service) | Read-only + chat/dispute handling |
| Finance | Lihat transaksi, approve pencairan |

---

## 3. Modules

### 3.1 Dashboard
**KPI Cards:**
- Total users (customer, tukang)
- Order hari ini
- Revenue hari ini / bulan ini
- Pending tukang verification
- Active disputes

**Charts:**
- Order per day (last 30 days)
- Revenue per month
- Top services
- Order status distribution

---

### 3.2 Users Management

#### Customers
- List: nama, HP, email, total order, registered date
- Filter: active / inactive / banned
- Detail: profile, order history, addresses
- Actions: ban / unban, reset password

#### Tukang
- **Pending Verification** (queue)
  - Review dokumen (KTP, selfie, sertifikat)
  - Approve / Reject (with reason)
  - Auto notif ke tukang
- **Active Tukang**
  - List: nama, HP, keahlian, rating, total order
  - Filter: by keahlian, by area
  - Detail: profile lengkap, earnings, order history
  - Actions: suspend, banned, adjust rating (super admin)

---

### 3.3 Orders Management

- List all orders
- Filter: status, date range, service type, customer, tukang
- Detail:
  - Full order info
  - Status timeline
  - Chat log
  - Payment info
  - Photos (before/after)
- Actions:
  - Force assign tukang (manual intervention)
  - Force cancel (+ refund)
  - Resolve dispute
  - Add notes

---

### 3.4 Services & Pricing

- List jenis Jagoan (17 items)
- CRUD:
  - Nama, icon, deskripsi
  - Harga harian & setengah hari
  - Active / inactive toggle
  - Daftar pekerjaan yang dilakukan
- Bulk update pricing

---

### 3.5 Areas Management

- List area layanan (Jabodetabek)
- CRUD kecamatan/kelurahan
- Set coverage radius
- Import CSV

---

### 3.6 Promos & Vouchers

- CRUD voucher:
  - Kode (unique)
  - Tipe: percentage / fixed amount
  - Value
  - Min. transaction
  - Max discount
  - Usage limit (total & per user)
  - Valid from - until
  - Applicable services (all / specific)
- Track usage

---

### 3.7 Payments & Finance

#### Transactions
- List semua pembayaran
- Filter by status (pending, success, failed, refunded)
- Reconcile with Midtrans

#### Tukang Payouts
- Request pencairan (queue)
- Approve / reject (with reason)
- Batch process (CSV export untuk bank)
- History payouts

#### Reports
- Revenue report (daily, monthly, yearly)
- Tukang earning report
- Commission report
- Export Excel/PDF

---

### 3.8 Chat & Dispute

#### Chat Log
- Lihat semua chat per order
- Search by keyword
- Flag inappropriate content

#### Disputes
- Queue customer complaints
- Assign to CS
- Status: open, investigating, resolved
- Actions: refund, compensate, ban user
- SLA tracking

---

### 3.9 Content Management

- **Banner Promo** (tampil di app)
  - Upload image, link target, schedule
- **Artikel Blog** (Bacaan Terbaru)
  - WYSIWYG editor
  - Category, tags, publish date
- **FAQ** — CRUD
- **Notifikasi Broadcast**
  - Kirim ke semua customer / tukang / segmented

---

### 3.10 System Settings

- App config (nama app, logo, kontak CS)
- Commission rate (default 15%, per service)
- Payment gateway config
- Email templates
- SMS templates
- Notifikasi templates
- Maintenance mode toggle

---

### 3.11 Admin Users (Super Admin only)

- CRUD admin accounts
- Role & permission management
- Activity log (audit trail)

---

## 4. Audit & Security

- Semua aksi admin di-log (siapa, kapan, apa)
- 2FA wajib untuk admin
- Session timeout 30 menit idle
- IP whitelist opsional
- Export data activity log

---

## 5. Technical Notes

- Base: Laravel 11 + Filament 3
- Database sama dengan API (single DB)
- Authentication: Laravel session (web-based) atau Sanctum
- UI: bawaan Filament (Tailwind, clean)
- Jika perlu custom: extend Filament Resources
