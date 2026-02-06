
"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || "");

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
});

export async function analyzeProduct(barcode: string) {
    const key = process.env.GEMINI_API_KEY;
    console.log("Debug: API Key length:", key ? key.length : "undefined");

    if (!key) {
        return { error: "Server Error: GEMINI_API_KEY is undefined. Did you Redeploy after adding env vars?" };
    }

    try {
        // Prompt yang direkayasa untuk output JSON yang konsisten
        const prompt = `
      Analisis kode barcode ini: "${barcode}".
      Bertindaklah sebagai ahli produk dan nutrisi.
      
      Jika barcode ini terlihat valid (EAN/UPC), coba identifikasi produknya.
      Jika tidak diketahui secara spesifik, berikan estimasi umum berdasarkan formatnya atau katakan tidak ditemukan.
      
      Berikan respon HANYA dalam format JSON tanpa markdown block, dengan struktur:
      {
        "name": "Nama Produk (atau Unknown)",
        "description": "Deskripsi singkat produk yang menarik.",
        "category": "Kategori Produk",
        "nutrition": { "calories": "...", "sugar": "..." } (jika makanan/minuman, jika bukan kosongkan),
        "fun_fact": "Satu fakta unik atau menarik tentang jenis produk ini."
      }
      
      Gunakan Bahasa Indonesia yang santai tapi informatif.
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Membersihkan format markdown jika ada (misal ```json ... ```)
        const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();

        return { data: JSON.parse(cleanedText) };
    } catch (error: any) {
        console.error("Gemini Error Details:", error);

        let errorMessage = "Gagal menganalisis produk dengan AI. ";

        if (error.message?.includes("API key not valid")) {
            errorMessage += "API Key tidak valid (Invalid Key).";
        } else if (error.message?.includes("quota")) {
            errorMessage += "Kuota API habis (Quota Exceeded).";
        } else {
            // Return the RAW error message to ID the problem
            errorMessage += `Error Asli: ${error.message}`;
        }

        return { error: errorMessage };
    }
}
