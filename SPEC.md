# RzValor Project Specification & Context

## CRITICAL FIX: AI API Versioning (2025-02-07)
The project encountered 404 errors with Google Gemini AI `gemini-1.5-flash` due to versioning changes (v1beta to v1).

**Action Taken:**
1. **Hentikan penggunaan endpoint v1beta**: Inisialisasi model sekarang menggunakan jalur produksi `v1` melalui `@google/generative-ai` SDK versi terbaru.
2. **Dynamic Initialization**: Inisialisasi `GoogleGenerativeAI` dilakukan di dalam Server Action untuk memastikan API Key terbaru selalu digunakan dan menghindari error inisialisasi pada build-time jika env variabels belum siap.
3. **Fallback Strategy**: Implementasi logika fallback otomatis:
   - Mencoba `gemini-flash-latest` (Cepat & Hemat).
   - Jika gagal, otomatis beralih ke `gemini-pro-latest` (Lebih Pintar & Stabil).

## Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Database**: Neon (PostgreSQL) with Drizzle ORM
- **AI**: Google Gemini AI (Flash & Pro)
- **UI**: Tailwind CSS 4, Framer Motion, Lucide React
- **Scanning**: html5-qrcode

## Core Logic Patterns
- Semua aksi AI diletakkan di `lib/actions/` menggunakan model-model Gemini.
- Data disimpan di Neon untuk sinkronisasi history antar sesi.
