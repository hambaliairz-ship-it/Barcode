# Role
Saya adalah Senior Fullstack Engineer dan AI Specialist. Tugas Anda adalah membantu saya membangun aplikasi "RzValor", sebuah Smart Barcode Scanner berbasis AI untuk pasar internasional.

# Tech Stack
- Framework: Next.js 16+ (App Router)
- Styling: Tailwind CSS
- Database: Neon DB (PostgreSQL)
- AI: Gemini AI SDK
- Deployment: Vercel (Edge Functions)

# Visi Produk: RzValor
RzValor bukan sekadar pemindai. Ia menggabungkan:
1. Logika: Kecepatan scan barcode/QR yang presisi.
2. Perasaan: UI/UX yang empati dan informasi produk yang etis/bermanfaat (via Gemini).
3. Perjuangan: Fitur tracking history dan pencapaian pengguna dalam manajemen inventaris/belanja.

# Tugas Awal Anda:
1. Buatkan struktur folder Next.js yang scalable untuk proyek ini.
2. Rancang Skema Database (Drizzle) untuk Neon DB yang mencakup tabel:
   - Users (Auth)
   - Scans (Barcode, Metadata, AI_Analysis)
   - Products (Cache data produk agar tidak terus-menerus memanggil API)
3. Buat implementasi dasar Client Component untuk kamera menggunakan library 'html5-qrcode'.
4. Buat API Route atau Server Action yang menghubungkan hasil scan barcode ke Gemini AI untuk mendapatkan deskripsi produk yang mendalam.

## Animasi & Micro-interactions
- Gunakan Framer Motion untuk semua transisi halaman.
- Implementasikan "Stagger Animation" pada daftar hasil scan agar muncul satu per satu dengan efek fade-in slide-up.
- Tambahkan efek "Pulse" pada tombol scanner untuk memberikan kesan bahwa AI sedang bekerja atau sedang mencari barcode.
- Berikan feedback visual berupa getaran (Haptic Feedback) sederhana dan perubahan warna border saat barcode berhasil terdeteksi.

## Bottom Navbar Specification
- Desain: Floating Navbar dengan efek 'Glassmorphism' (semi-transparan dengan backdrop-blur).
- Posisi: Melayang sedikit di atas bagian bawah layar dengan corner radius yang besar (full rounded).
- Item Navigasi:
  1. Home (Dashboard & Stats)
  2. History (Jejak Perjuangan/Riwayat Scan)
  3. Scan (Tombol Utama di Tengah - Buat lebih besar/menonjol)
  4. Insights (Logika AI - Analisis tren produk)
  5. Profile (Pengaturan)
- Aktif State: Gunakan "LayoutId" Framer Motion agar indikator aktif bisa berpindah dengan animasi sliding yang smooth.

# Aturan Coding:
- Gunakan TypeScript untuk keamanan kode.
- Pastikan UI responsif (Mobile First) karena ini aplikasi HP.
- Gunakan komponen Shadcn UI untuk estetika profesional.
- Terapkan internasionalisasi (i18n) dasar agar siap untuk pasar global.

## UI/UX Specification
- Desain: Minimalis, modern, dan intuitif.
- Color Scheme: Pastel dan monokromatik dengan warna-warna yang ringan dan tidak terlalu gelap.
- Typography: Gunakan Google Fonts dengan font yang mudah dibaca dan modern.
- Spacing: Implementasikan 'Tailwind CSS' dengan unit spacing yang konsisten (misalnya 4px, 8px, 16px, dll).
- Animasi: Implementasikan 'Framer Motion' untuk semua transisi halaman.
- Micro-interactions: Implementasikan 'Framer Motion' untuk semua micro-interactions.
- Responsive: Implementasikan 'Tailwind CSS' dengan unit responsive yang konsisten (misalnya 4px, 8px, 16px, dll).

Silakan mulai dengan memberikan struktur folder dan skema database-nya terlebih dahulu.