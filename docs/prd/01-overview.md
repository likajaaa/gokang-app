# PRD 01 — Product Overview

## 1. Product Summary

**Product Name:** GoKang Clone
**Type:** Mobile app marketplace (jasa tukang)
**Platform:** iOS & Android (React Native)
**Target Release:** MVP dalam 3-4 bulan

## 2. Goals & Objectives

### Business Goals
- Memudahkan konsumen pesan tukang berkualitas dengan harga transparan
- Memberi peluang kerja berkesinambungan untuk tukang
- Membangun trust via sistem rating & garansi

### Product Goals (MVP)
- User bisa registrasi & login dalam < 1 menit
- User bisa selesaikan booking Tukang Harian dalam < 2 menit
- Tukang bisa terima order dalam < 5 detik setelah notif
- Tingkat order completion > 90%
- Rating rata-rata > 4.3

## 3. Target Users

| Role | Jumlah Perkiraan | Device |
|------|------------------|--------|
| Customer | 80% user base | iOS & Android |
| Tukang | 20% user base | Android (mostly) |
| Admin | 5-10 orang | Web browser |

## 4. Success Metrics

### Customer-side
- DAU (Daily Active Users)
- Conversion rate: Registrasi → First order
- Avg order value
- Repeat order rate
- NPS score

### Tukang-side
- Tukang aktif / total tukang terdaftar
- Avg earning per tukang per bulan
- Response time order (notif → accept)
- Acceptance rate

### Platform
- Order completion rate
- Complaint rate
- Dispute resolution time
- Platform uptime (target 99.5%)

## 5. Scope MVP

### In Scope
- ✅ Customer app (iOS + Android)
- ✅ Tukang app (Android)
- ✅ Admin dashboard (web)
- ✅ Payment via Midtrans (VA, e-wallet, CC)
- ✅ Push notification (FCM)
- ✅ Chat in-app (basic, text only)
- ✅ Area: Jabodetabek only

### Out of Scope (Phase 2+)
- ❌ GoKang Corp (B2B)
- ❌ Voice/video call
- ❌ Multi-language
- ❌ Referral program
- ❌ Loyalty points
- ❌ Marketplace material standalone

## 6. Timeline (High-level)

| Phase | Duration | Deliverable |
|-------|----------|-------------|
| Phase 1: Foundation | 2 minggu | Setup repo, CI/CD, database, auth |
| Phase 2: Customer App | 4 minggu | Home, browse, booking, payment |
| Phase 3: Tukang App | 3 minggu | Registration, order, tracking |
| Phase 4: Admin Dashboard | 2 minggu | User mgmt, order mgmt, reports |
| Phase 5: Integration & Testing | 2 minggu | E2E, bug fix |
| Phase 6: Beta Release | 1 minggu | Soft launch, iterate |

**Total: ~14 minggu (~3.5 bulan)**

## 7. Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Supply tukang kurang | High | Start with beberapa jenis dulu, recruit aggressively |
| Payment failure | High | Multi gateway backup, Midtrans retry |
| Tukang no-show | High | Auto re-assign, rating penalty |
| Complaint dispute | Med | Chat log sebagai bukti, CS 24/7 |
| App store rejection | Med | Follow guidelines strictly |

## 8. Dependencies

- Midtrans account (payment)
- Firebase project (FCM + Analytics)
- Google Maps API key
- Domain & hosting (backend)
- App Store & Play Store developer account
