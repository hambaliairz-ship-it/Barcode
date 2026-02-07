# Role
Anda adalah Senior Fullstack Developer yang ahli dalam efisiensi sistem Cloud dan AI.

# Goal
Perbaiki error API Gemini dan implementasikan sistem Caching untuk menghemat kuota AI pada aplikasi "RzValor".

# Instruksi Teknis Utama:

1. **Fix API Connection:**
   - Gunakan endpoint stable `v1` (bukan v1beta).
   - Pastikan model yang dipanggil adalah "gemini-1.5-flash".
   - Implementasikan error handling: Jika API return status 429 (Quota Exhausted), tampilkan pesan user-friendly: "RzValor sedang beristirahat sejenak, coba lagi dalam beberapa menit."

2. **Smart Caching System (Hemat Kuota):**
   - Sebelum memanggil API Gemini, buat fungsi untuk mengecek database Neon (PostgreSQL).
   - Skema: Jika `barcode_data` yang sama sudah ada di tabel `Scans` dalam kurun waktu 24 jam terakhir, ambil data `analysis_result` dari database alih-alih memanggil AI lagi.
   - Gunakan Prisma atau Drizzle ORM untuk logika ini.

3. **UI/UX Modernization:**
   - Buat Bottom Navbar melayang (Floating) dengan efek Glassmorphism (bg-white/70 backdrop-blur).
   - Gunakan Framer Motion untuk animasi transisi antar menu (Home, Scan, History, Profile).
   - Tambahkan animasi 'Pulse' pada tombol Scan utama di tengah.

4. **Kamera & Scan Logic:**
   - Default kamera harus 'environment' (kamera belakang).
   - Jika hasil scan berupa URL (seperti link Kimi), jangan langsung kirim ke AI. Berikan pilihan kepada user: "Buka Link" atau "Analisis dengan AI" untuk menghemat token.

# Output yang Diharapkan:
Berikan struktur folder yang diperbarui, skema database untuk tabel caching, dan kode Server Action untuk pemanggilan AI yang sudah dilengkapi logika cache.