
"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";



export async function analyzeProduct(barcode: string) {
    const key = process.env.GEMINI_API_KEY;

    if (!key) {
        return { error: "Server Error: GEMINI_API_KEY is undefined. Harap tambahkan API Key di pengaturan." };
    }

    const genAI = new GoogleGenerativeAI(key);

    const callGemini = async (modelName: string) => {
        const model = genAI.getGenerativeModel({ model: modelName });

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
        const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();
        return JSON.parse(cleanedText);
    };

    try {
        try {
            // Percobaan 1: Model Flash (Cepat & Hemat)
            console.log("Trying gemini-flash-latest...");
            const data = await callGemini("gemini-flash-latest");
            return { data };
        } catch (flashError: any) {
            console.warn("Flash model failed, trying Pro fallback...", flashError.message);
            // Percobaan 2: Fallback ke Model Pro
            const data = await callGemini("gemini-pro-latest");
            return { data };
        }
    } catch (error: any) {
        console.error("Gemini Error Details:", error);

        let errorMessage = "Gagal menganalisis produk dengan AI. ";

        if (error.message?.includes("API key not valid")) {
            errorMessage += "API Key tidak valid.";
        } else if (error.message?.includes("quota")) {
            errorMessage += "Kuota API habis.";
        } else if (error.message?.includes("404") || error.message?.includes("not found")) {
            errorMessage += "Model tidak ditemukan atau ketidakcocokan versi API.";
        } else {
            errorMessage += `Error: ${error.message}`;
        }

        return { error: errorMessage };
    }
}
