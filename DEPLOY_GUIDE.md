# Panduan Deployment ke Vercel 🚀

Ide bagus! Menggunakan HP untuk scanner barcode memang jauh lebih efektif. Berikut langkah-langkah mudah untuk deploy ke Vercel:

## 1. Push Code ke GitHub
Karena Anda sudah menggunakan Git, kita perlu push kode ini ke GitHub terlebih dahulu.

1.  Buat Repository baru di [GitHub](https://github.com/new). Beri nama misalnya `rzvalor-scanner`.
2.  **JANGAN** centang "Add a README file" atau .gitignore (biarkan kosong).
3.  Salin perintah "push an existing repository" yang muncul. Biasanya seperti ini (ganti `USERNAME` dengan username GitHub Anda):
    ```bash
    git remote add origin https://github.com/USERNAME/rzvalor-scanner.git
    git branch -M main
    git push -u origin main
    ```
4.  Jalankan perintah tersebut di terminal VS Code Anda.

## 2. Deploy di Vercel
1.  Buka [Vercel Dashboard](https://vercel.com/dashboard).
2.  Klik **"Add New..."** -> **"Project"**.
3.  Pilih repository `rzvalor-scanner` yang baru saja Anda push, klik **Import**.

## 3. Konfigurasi Environment Variables (PENTING!)
Di halaman "Configure Project" di Vercel, jangan langsung klik Deploy.
Scroll ke bagian **Environment Variables** dan tambahkan data dari file `.env` Anda:

| Key | Value |
| --- | --- |
| `DATABASE_URL` | (Isi dengan URL Database Neon Anda) |
| `GEMINI_API_KEY` | (Isi dengan API Key Gemini Anda) |

*Pastikan tidak ada spasi tambahan saat copy-paste.*

## 4. Klik Deploy!
Setelah variable ditambahkan, klik tombol **Deploy**. Tunggu sebentar, dan aplikasi Anda akan live!

---

**Butuh bantuan untuk melakukan commit code Anda saat ini?**
Ketik perintah ini di terminal untuk menyimpan semua perubahan sebelum push:
```bash
git add .
git commit -m "Siap deploy ke Vercel"
```
Lalu lanjutkan langkah push ke GitHub.
