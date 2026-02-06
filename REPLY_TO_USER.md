# Scanner Diperbaiki! 🛠️

Masalahnya "kamera terbuka tapi diam saja" kemungkinan besar karena setingannya hanya mencari **QR Code**, bukan Barcode produk.

## Apa yang saya ubah:
Saya sudah update `Scanner.tsx` untuk mengenali format barcode standar produk:
- **EAN-13 & EAN-8**: Barcode di bungkus Indomie, Snack, Minuman, dll.
- **UPC**: Standar internasional lainnya.
- **Code 128**: Sering dipakai di resi pengiriman.

## Silakan Coba Lagi:
Arahkan kamera ke barcode produk (garis-garis hitam putih), bukan QR code. Tunggu 1-2 detik dengan pencahayaan yang cukup.

Beritahu saya jika sudah berhasil ter-scan! 📸
