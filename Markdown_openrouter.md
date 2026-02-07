# Role: Senior Fullstack & Database Architect

# Task: 
Membangun sistem analisis barcode yang hemat biaya, scalable internasional, dan memiliki UI transparan.

# 1. Skema Database Neon (Drizzle/Prisma):
Buatkan tabel `ProductCache` untuk menyimpan hasil scan:
- `id`: Primary Key
- `barcode_data`: String (Index) - Data hasil scan (URL/GTIN)
- `analysis_result`: Text - Hasil JSON dari AI
- `model_used`: String - Nama model yang memberikan hasil
- `created_at`: Timestamp - Untuk validasi cache (misal: refresh tiap 7 hari)

# 2. Logika Backend (services/aiProvider.ts):
- Hubungkan ke OpenRouter menggunakan API Key dari `process.env.OPENROUTER_API_KEY`.
- Buat fungsi `getAnalysis(data)` dengan alur:
  1. Cek tabel `ProductCache`. Jika data ditemukan, return data cache (Hemat Token 100%).
  2. Jika tidak ada, panggil OpenRouter dengan urutan model GRATIS:
     - "tng/deepseek-r1t2-chimera:free"
     - "meta/llama-3.3-70b-instruct:free"
     - "upstage/solar-pro-3:free"
  3. Gunakan Logic Fallback: Jika model pertama gagal, otomatis pindah ke model berikutnya.
  4. Simpan hasil sukses ke `ProductCache`.

# 3. UI/UX Modern (components/ScannerOverlay.tsx):
- Tambahkan status teks dinamis di bawah area scan: "Menganalisis dengan [Active Model Name]...".
- Gunakan Framer Motion untuk transisi status:
  - Saat mulai: "Menghubungkan ke AI..."
  - Saat gagal/pindah model: "Model sibuk, mencoba model cadangan..."
  - Saat sukses: Tampilkan hasil dengan animasi slide-up.

# 4. Environment Config:
Pastikan aplikasi membaca API Key secara aman dari file .env.

Berikan kode lengkap yang sudah tergabung antar database, logic API, dan UI status.