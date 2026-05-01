# CLAUDE.md

> **Purpose**: Primary context file for AI coding assistants (Claude Code, Cursor, Copilot).
> Read this file **first** before any task in this repository.

---

## 🎯 Project: GoKang Clone

Aplikasi marketplace jasa tukang bangunan yang menghubungkan konsumen dengan tukang terkualifikasi untuk kebutuhan perbaikan, renovasi, dan pemeliharaan bangunan di area Jabodetabek.

**Referensi asli:** https://www.gokang.id/

**Tujuan clone:** Pembelajaran + portfolio project (bukan untuk komersial).

---

## 🏗️ Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Mobile App | React Native + Expo | Expo SDK 52+ |
| Navigation | React Navigation | v6 |
| Styling | NativeWind (Tailwind for RN) | v4 |
| State Management | Zustand | latest |
| HTTP Client | Axios | latest |
| Form Handling | React Hook Form + Zod | latest |
| Backend API | Laravel | 13.x |
| PHP | - | 8.3+ |
| Database | MySQL | 8.0 |
| Auth | Laravel Sanctum (Bearer Token) | - |
| File Storage | Laravel Storage (local/S3) | - |
| Push Notification | Firebase Cloud Messaging | - |
| Maps | Google Maps SDK | - |
| Payment Gateway | Midtrans | - |

---

## 📁 Repository Structure

```
gokang-clone/
├── CLAUDE.md                    # This file - AI context primary
├── CLAUDE-CONTEXT.md            # Deep business & product context
├── README.md                    # Human-readable project overview
├── docs/
│   ├── prd/
│   │   ├── 01-overview.md
│   │   ├── 02-customer-app.md
│   │   ├── 03-tukang-app.md
│   │   ├── 04-admin-dashboard.md
│   │   └── 05-non-functional.md
│   ├── database/
│   │   ├── erd.md
│   │   └── schema.sql
│   └── api/
│       └── endpoints.md
├── backend/                     # Laravel 11 API
│   ├── app/
│   ├── database/
│   └── routes/api.php
└── mobile/                      # React Native + Expo
    ├── app/
    ├── components/
    └── services/api/
```

---

## 🧠 How to Work in This Repo (AI Instructions)

### Before writing ANY code:

1. **Always read `CLAUDE-CONTEXT.md` first** for business logic
2. **Check the relevant PRD** in `docs/prd/` for the feature
3. **Reference the ERD** in `docs/database/erd.md` for data relationships
4. **Follow API contract** in `docs/api/endpoints.md`

### When adding a new feature:

- Update the PRD first if scope changes
- Add migration before writing models
- Write API endpoint before mobile UI
- Test backend with Postman/Thunder Client before connecting mobile

### Response language:

- **Code comments**: English
- **User-facing text (UI, errors, emails)**: Bahasa Indonesia
- **Documentation**: Bahasa Indonesia
- **Variable/function names**: English
- **Database columns**: `snake_case` English

---

## 💻 Coding Conventions

### Laravel (Backend)

**Patterns:**
- Repository Pattern untuk data access
- Service Layer untuk business logic
- Form Request untuk validation
- API Resource untuk response formatting

**API Response Format (WAJIB konsisten):**

```json
// Success
{
  "success": true,
  "message": "Data berhasil diambil",
  "data": { ... }
}

// Error
{
  "success": false,
  "message": "Validasi gagal",
  "errors": {
    "email": ["Email wajib diisi"]
  }
}
```

**Route Prefix:** Semua API di `/api/v1/...`

**Auth Middleware:** Gunakan `auth:sanctum` untuk protected routes.

**Naming:**
- Controller: `OrderController` (singular + Controller)
- Model: `Order` (singular PascalCase)
- Migration: `create_orders_table`
- Table: `orders` (plural snake_case)

### React Native (Mobile)

**Structure:**
```
mobile/
├── app/                    # File-based routing (Expo Router)
│   ├── (auth)/            # Auth flow
│   ├── (tabs)/            # Main app tabs
│   └── _layout.tsx
├── components/
│   ├── ui/                # Reusable UI (Button, Input, Card)
│   └── features/          # Feature-specific components
├── services/
│   ├── api/               # Axios instance + endpoint calls
│   └── storage/           # AsyncStorage wrapper
├── store/                 # Zustand stores
├── hooks/                 # Custom hooks
├── types/                 # TypeScript types
└── utils/                 # Helpers
```

**Rules:**
- Hanya **functional components** + hooks
- TypeScript **wajib** untuk semua file
- Gunakan **NativeWind** (Tailwind) untuk styling - hindari `StyleSheet`
- State global pakai **Zustand**, state lokal pakai `useState`
- HTTP calls **selalu** via `services/api/` - jangan panggil axios langsung di component

**Component template:**

```tsx
type Props = {
  title: string;
  onPress: () => void;
};

export default function MyButton({ title, onPress }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-primary px-4 py-3 rounded-lg"
    >
      <Text className="text-white font-semibold">{title}</Text>
    </TouchableOpacity>
  );
}
```

---

## 🎨 Design System

### Colors

```css
--primary:        #E8272A   /* Merah GoKang */
--primary-dark:   #B81E21
--primary-light:  #FEE2E2
--secondary:      #1E40AF   /* Biru untuk bisnis */
--success:        #10B981
--warning:        #F59E0B
--error:          #EF4444
--bg:             #F5F5F5
--white:          #FFFFFF
--text-primary:   #111827
--text-secondary: #6B7280
--border:         #E5E7EB
```

### Typography

- Font: **Inter** atau **SF Pro** (system default)
- Heading: Bold, 20-28px
- Body: Regular, 14-16px
- Caption: 12px

### Spacing (Tailwind scale)

- xs: 4px, sm: 8px, md: 16px, lg: 24px, xl: 32px

### Component Style Reference

- **Search bar**: Putih, rounded-full, shadow ringan, icon search kiri
- **Service Card**: Rounded-2xl, padding 16px, background warna lembut (pink/biru/hijau/kuning)
- **Bottom nav**: 5 tab (Beranda, Pesanan, Promo, Chat, Akun)
- **Primary button**: bg merah, text putih, rounded-lg, height 48px

---

## 👥 User Roles

1. **Customer** — Pengguna yang memesan layanan
2. **Tukang (Mitra)** — Penyedia layanan (Tukang Jagoan)
3. **Admin** — Pengelola platform (via web dashboard terpisah)
4. **Konsultan** — Role khusus untuk survey borongan

---

## 🚀 Core Features (MVP)

### Customer App
- [x] Registration (phone + OTP) & Login
- [x] Home dengan 4 menu utama: Borongan Rumah, Borongan Bisnis, Pesan Tukang, Layanan + Material
- [x] Browse layanan tukang (17+ jenis Jagoan)
- [x] Booking Tukang Harian (pilih jenis, tanggal, alamat, durasi)
- [x] Booking Borongan (form lengkap + survey)
- [x] Titip beli material
- [x] Order tracking (status real-time)
- [x] Chat dengan tukang
- [x] Payment (Midtrans - VA, e-wallet, credit card)
- [x] Rating & review
- [x] Riwayat pesanan
- [x] Promo & voucher

### Tukang App
- [x] Registrasi tukang (verifikasi dokumen)
- [x] Terima/tolak order
- [x] Update status pekerjaan
- [x] Input material yang dibeli
- [x] Chat dengan customer
- [x] Penghasilan & pencairan
- [x] Rating dari customer

### Admin Dashboard (Web, Laravel Blade/Filament)
- [x] Kelola users (customer, tukang, konsultan)
- [x] Verifikasi tukang baru
- [x] Kelola kategori & harga layanan
- [x] Monitor order
- [x] Kelola promo/voucher
- [x] Laporan & analytics

---

## 🔒 Security Rules

- Password minimal 8 karakter, hashing **bcrypt** (bawaan Laravel)
- Token Sanctum expire 30 hari, refresh otomatis
- Rate limiting: 60 req/min per user
- File upload max 5MB, hanya image (jpg, png, webp)
- Validasi input **selalu** di Form Request, jangan di controller
- **JANGAN PERNAH** commit file `.env` atau API keys
- Sensitive data di mobile pakai `expo-secure-store`, bukan `AsyncStorage`

---

## 🧪 Testing Strategy

- Backend: PHPUnit - minimal test untuk setiap endpoint kritis (auth, order, payment)
- Mobile: Jest + React Native Testing Library untuk logic/hooks
- Manual QA: Flow end-to-end sebelum deploy

---

## 📦 Important Dependencies

### Backend (`composer.json`)
```
laravel/framework: ^13.0
laravel/sanctum: ^4.0
intervention/image: ^3.0
midtrans/midtrans-php: ^2.5
```

### Mobile (`package.json`)
```
expo: ~52.0
expo-router: ~4.0
nativewind: ^4.0
zustand: ^5.0
axios: ^1.7
react-hook-form: ^7.5
zod: ^3.2
@react-native-async-storage/async-storage
expo-secure-store
expo-notifications
expo-location
expo-image-picker
react-native-maps
```

---

## 🚨 Things to AVOID

1. ❌ Jangan panggil axios langsung di screen component
2. ❌ Jangan pakai `StyleSheet.create` - gunakan NativeWind
3. ❌ Jangan hardcode URL API - pakai `.env` via `expo-constants`
4. ❌ Jangan commit file `.env`, `node_modules`, `vendor/`
5. ❌ Jangan buat migration yang edit kolom existing tanpa diskusi - buat migration baru
6. ❌ Jangan pakai `any` di TypeScript kecuali terpaksa
7. ❌ Jangan return response tanpa `success` flag
8. ❌ Jangan delete data - pakai soft delete (`deleted_at`)

---

## 📞 Contact & Questions

Jika ada ambiguitas dalam requirement, **tanyakan dulu** sebelum menulis kode.
Jangan asumsi - konfirmasi ke pemilik project.

---

**Last updated:** 2026-04-19
**Version:** 1.0.0

===

<laravel-boost-guidelines>
=== foundation rules ===

# Laravel Boost Guidelines

The Laravel Boost guidelines are specifically curated by Laravel maintainers for this application. These guidelines should be followed closely to ensure the best experience when building Laravel applications.

## Foundational Context

This application is a Laravel application and its main Laravel ecosystems package & versions are below. You are an expert with them all. Ensure you abide by these specific packages & versions.

- php - 8.3
- laravel/framework (LARAVEL) - v13
- laravel/prompts (PROMPTS) - v0
- laravel/sanctum (SANCTUM) - v4
- laravel/boost (BOOST) - v2
- laravel/mcp (MCP) - v0
- laravel/pail (PAIL) - v1
- laravel/pint (PINT) - v1
- pestphp/pest (PEST) - v4
- phpunit/phpunit (PHPUNIT) - v12
- tailwindcss (TAILWINDCSS) - v4

## Skills Activation

This project has domain-specific skills available. You MUST activate the relevant skill whenever you work in that domain—don't wait until you're stuck.

- `laravel-best-practices` — Apply this skill whenever writing, reviewing, or refactoring Laravel PHP code. This includes creating or modifying controllers, models, migrations, form requests, policies, jobs, scheduled commands, service classes, and Eloquent queries. Triggers for N+1 and query performance issues, caching strategies, authorization and security patterns, validation, error handling, queue and job configuration, route definitions, and architectural decisions. Also use for Laravel code reviews and refactoring existing Laravel code to follow best practices. Covers any task involving Laravel backend PHP code patterns.
- `pest-testing` — Use this skill for Pest PHP testing in Laravel projects only. Trigger whenever any test is being written, edited, fixed, or refactored — including fixing tests that broke after a code change, adding assertions, converting PHPUnit to Pest, adding datasets, and TDD workflows. Always activate when the user asks how to write something in Pest, mentions test files or directories (tests/Feature, tests/Unit, tests/Browser), or needs browser testing, smoke testing multiple pages for JS errors, or architecture tests. Covers: test()/it()/expect() syntax, datasets, mocking, browser testing (visit/click/fill), smoke testing, arch(), Livewire component tests, RefreshDatabase, and all Pest 4 features. Do not use for factories, seeders, migrations, controllers, models, or non-test PHP code.
- `tailwindcss-development` — Always invoke when the user's message includes 'tailwind' in any form. Also invoke for: building responsive grid layouts (multi-column card grids, product grids), flex/grid page structures (dashboards with sidebars, fixed topbars, mobile-toggle navs), styling UI components (cards, tables, navbars, pricing sections, forms, inputs, badges), adding dark mode variants, fixing spacing or typography, and Tailwind v3/v4 work. The core use case: writing or fixing Tailwind utility classes in HTML templates (Blade, JSX, Vue). Skip for backend PHP logic, database queries, API routes, JavaScript with no HTML/CSS component, CSS file audits, build tool configuration, and vanilla CSS.

## Conventions

- You must follow all existing code conventions used in this application. When creating or editing a file, check sibling files for the correct structure, approach, and naming.
- Use descriptive names for variables and methods. For example, `isRegisteredForDiscounts`, not `discount()`.
- Check for existing components to reuse before writing a new one.

## Verification Scripts

- Do not create verification scripts or tinker when tests cover that functionality and prove they work. Unit and feature tests are more important.

## Application Structure & Architecture

- Stick to existing directory structure; don't create new base folders without approval.
- Do not change the application's dependencies without approval.

## Frontend Bundling

- If the user doesn't see a frontend change reflected in the UI, it could mean they need to run `npm run build`, `npm run dev`, or `composer run dev`. Ask them.

## Documentation Files

- You must only create documentation files if explicitly requested by the user.

## Replies

- Be concise in your explanations - focus on what's important rather than explaining obvious details.

=== boost rules ===

# Laravel Boost

## Tools

- Laravel Boost is an MCP server with tools designed specifically for this application. Prefer Boost tools over manual alternatives like shell commands or file reads.
- Use `database-query` to run read-only queries against the database instead of writing raw SQL in tinker.
- Use `database-schema` to inspect table structure before writing migrations or models.
- Use `get-absolute-url` to resolve the correct scheme, domain, and port for project URLs. Always use this before sharing a URL with the user.
- Use `browser-logs` to read browser logs, errors, and exceptions. Only recent logs are useful, ignore old entries.

## Searching Documentation (IMPORTANT)

- Always use `search-docs` before making code changes. Do not skip this step. It returns version-specific docs based on installed packages automatically.
- Pass a `packages` array to scope results when you know which packages are relevant.
- Use multiple broad, topic-based queries: `['rate limiting', 'routing rate limiting', 'routing']`. Expect the most relevant results first.
- Do not add package names to queries because package info is already shared. Use `test resource table`, not `filament 4 test resource table`.

### Search Syntax

1. Use words for auto-stemmed AND logic: `rate limit` matches both "rate" AND "limit".
2. Use `"quoted phrases"` for exact position matching: `"infinite scroll"` requires adjacent words in order.
3. Combine words and phrases for mixed queries: `middleware "rate limit"`.
4. Use multiple queries for OR logic: `queries=["authentication", "middleware"]`.

## Artisan

- Run Artisan commands directly via the command line (e.g., `php artisan route:list`). Use `php artisan list` to discover available commands and `php artisan [command] --help` to check parameters.
- Inspect routes with `php artisan route:list`. Filter with: `--method=GET`, `--name=users`, `--path=api`, `--except-vendor`, `--only-vendor`.
- Read configuration values using dot notation: `php artisan config:show app.name`, `php artisan config:show database.default`. Or read config files directly from the `config/` directory.
- To check environment variables, read the `.env` file directly.

## Tinker

- Execute PHP in app context for debugging and testing code. Do not create models without user approval, prefer tests with factories instead. Prefer existing Artisan commands over custom tinker code.
- Always use single quotes to prevent shell expansion: `php artisan tinker --execute 'Your::code();'`
  - Double quotes for PHP strings inside: `php artisan tinker --execute 'User::where("active", true)->count();'`

=== php rules ===

# PHP

- Always use curly braces for control structures, even for single-line bodies.
- Use PHP 8 constructor property promotion: `public function __construct(public GitHub $github) { }`. Do not leave empty zero-parameter `__construct()` methods unless the constructor is private.
- Use explicit return type declarations and type hints for all method parameters: `function isAccessible(User $user, ?string $path = null): bool`
- Use TitleCase for Enum keys: `FavoritePerson`, `BestLake`, `Monthly`.
- Prefer PHPDoc blocks over inline comments. Only add inline comments for exceptionally complex logic.
- Use array shape type definitions in PHPDoc blocks.

=== deployments rules ===

# Deployment

- Laravel can be deployed using [Laravel Cloud](https://cloud.laravel.com/), which is the fastest way to deploy and scale production Laravel applications.

=== laravel/core rules ===

# Do Things the Laravel Way

- Use `php artisan make:` commands to create new files (i.e. migrations, controllers, models, etc.). You can list available Artisan commands using `php artisan list` and check their parameters with `php artisan [command] --help`.
- If you're creating a generic PHP class, use `php artisan make:class`.
- Pass `--no-interaction` to all Artisan commands to ensure they work without user input. You should also pass the correct `--options` to ensure correct behavior.

### Model Creation

- When creating new models, create useful factories and seeders for them too. Ask the user if they need any other things, using `php artisan make:model --help` to check the available options.

## APIs & Eloquent Resources

- For APIs, default to using Eloquent API Resources and API versioning unless existing API routes do not, then you should follow existing application convention.

## URL Generation

- When generating links to other pages, prefer named routes and the `route()` function.

## Testing

- When creating models for tests, use the factories for the models. Check if the factory has custom states that can be used before manually setting up the model.
- Faker: Use methods such as `$this->faker->word()` or `fake()->randomDigit()`. Follow existing conventions whether to use `$this->faker` or `fake()`.
- When creating tests, make use of `php artisan make:test [options] {name}` to create a feature test, and pass `--unit` to create a unit test. Most tests should be feature tests.

## Vite Error

- If you receive an "Illuminate\Foundation\ViteException: Unable to locate file in Vite manifest" error, you can run `npm run build` or ask the user to run `npm run dev` or `composer run dev`.

=== pint/core rules ===

# Laravel Pint Code Formatter

- If you have modified any PHP files, you must run `vendor/bin/pint --dirty --format agent` before finalizing changes to ensure your code matches the project's expected style.
- Do not run `vendor/bin/pint --test --format agent`, simply run `vendor/bin/pint --format agent` to fix any formatting issues.

=== pest/core rules ===

## Pest

- This project uses Pest for testing. Create tests: `php artisan make:test --pest {name}`.
- Run tests: `php artisan test --compact` or filter: `php artisan test --compact --filter=testName`.
- Do NOT delete tests without approval.

</laravel-boost-guidelines>
