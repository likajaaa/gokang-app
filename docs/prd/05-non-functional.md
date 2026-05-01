# PRD 05 — Non-Functional Requirements

## 1. Performance

| Metric | Target |
|--------|--------|
| App cold start | < 3 detik |
| API response p95 | < 1.5 detik |
| Image upload | Progressive + compress client-side |
| Payment redirect | < 5 detik |
| Push notif delivery | < 10 detik |
| Concurrent users | 10.000 |
| Orders per hour | 1.000 |

## 2. Scalability

- Backend: horizontal scalable (stateless)
- Database: MySQL master + read replica (phase 2)
- File storage: S3-compatible (DO Spaces / AWS S3)
- CDN untuk static assets
- Queue: Redis + Laravel Queue Worker

## 3. Reliability

- Uptime target: **99.5%**
- Auto-restart jika crash
- Graceful degradation: payment down → notif ke user, retry logic
- Daily DB backup (7 hari retention)
- Monthly backup untuk archive

## 4. Security

### Authentication
- Password: min 8 char, bcrypt hash
- OTP: 6 digit, expire 5 menit
- Token: Sanctum bearer, expire 30 hari
- Rate limit: 60 req/min per user

### Data Protection
- HTTPS only (TLS 1.2+)
- Sensitive data encrypted at rest
- PII: nomor HP, KTP, rekening di-encrypt
- Photo KTP: S3 private bucket, signed URL only

### App Security
- Certificate pinning (mobile)
- Obfuscation build release
- No sensitive data in logs
- Jailbreak/root detection warning (Phase 2)

### Compliance
- UU PDP Indonesia (Perlindungan Data Pribadi)
- Kebijakan privasi wajib di app
- Consent untuk location, camera, gallery

## 5. Observability

### Logging
- Backend: Laravel log (daily rotation, 14 hari)
- Error tracking: Sentry
- API access log: CloudWatch / custom

### Monitoring
- Uptime monitoring: UptimeRobot / Better Uptime
- Server metrics: CPU, RAM, disk
- Database: slow query log
- Alert: Slack + email

### Analytics
- User analytics: Mixpanel / Amplitude
- Crash reporting: Sentry (mobile)
- Business analytics: custom dashboard admin

## 6. Compatibility

### Mobile
- **iOS**: 14.0+
- **Android**: API level 24 (Android 7) ke atas
- Screen: 4.7" - 6.7"
- Internet: 3G minimum

### Admin Dashboard
- Browser: Chrome, Firefox, Safari, Edge (latest 2 versions)
- Screen: 1280×720 ke atas
- Responsive desktop + tablet

## 7. Localization

- **MVP**: Bahasa Indonesia only
- Currency: IDR
- Date format: DD MMM YYYY (e.g., 19 Apr 2026)
- Timezone: WIB (GMT+7)
- Number format: 1.000.000 (titik sebagai thousand separator)

## 8. Accessibility

- Kontras teks: WCAG AA minimum
- Font size: responsive (honor system settings)
- Button tap area: min 44×44 pt
- Alt text untuk icon penting
- Screen reader support (critical flows)

## 9. Legal & Policy

### Wajib tampil di app:
- Kebijakan Privasi
- Syarat & Ketentuan
- Disclaimer garansi
- Info perusahaan (PT nama, alamat)

### Pembayaran
- Lisensi OJK tidak diperlukan (pakai Midtrans sebagai PJP)
- Invoice wajib dikirim email
- Pajak: sesuai ketentuan (PPN via Midtrans)

## 10. Deployment

### Environments
- **Development**: lokal developer
- **Staging**: staging.gokangclone.com
- **Production**: api.gokangclone.com

### CI/CD
- GitHub Actions
- Auto deploy staging on PR merge
- Manual approval untuk production
- Zero-downtime deployment (rolling)

### App Release
- Build via EAS Build (Expo)
- TestFlight (iOS) & Internal Testing (Android)
- Phased rollout production

## 11. Documentation

- README.md di root project
- API docs: Postman collection + auto-generated (Laravel API)
- Mobile: Storybook (optional)
- Ops runbook untuk deployment & incident
