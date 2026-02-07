
"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";



export async function analyzeProduct(barcode: string) {
    const key = process.env.GEMINI_API_KEY;

    if (!key) {
        return { error: "Server Error: GEMINI_API_KEY is undefined. Harap tambahkan API Key di pengaturan." };
    }

    const genAI = new GoogleGenerativeAI(key);

    // Helper: Coba cari di OpenFoodFacts dulu (Gratis & Akurat untuk makanan/minuman)
    const getProductFromOpenFoodFacts = async (code: string) => {
        try {
            const res = await fetch(`https://world.openfoodfacts.org/api/v0/product/${code}.json`);
            if (!res.ok) return null;
            const data = await res.json();
            if (data.status === 1 && data.product) {
                return {
                    name: data.product.product_name || data.product.product_name_id || data.product.product_name_en,
                    brand: data.product.brands,
                    categories: data.product.categories
                };
            }
            return null;
        } catch (e) {
            console.error("OpenFoodFacts Error:", e);
            return null;
        }
    };

    // Langkah 1: Cek OpenFoodFacts
    const offData = await getProductFromOpenFoodFacts(barcode);
    console.log("OpenFoodFacts Result:", offData);

    const callGemini = async (modelName: string) => {
        const model = genAI.getGenerativeModel({ model: modelName });

        let promptProlog = "";
        if (offData) {
            promptProlog = `
            Saya sudah menemukan data awal dari database:
            Nama Produk: "${offData.name}"
            Merk: "${offData.brand}"
            Kategori: "${offData.categories}"
            
            Tolong perbaiki dan lengkapi data ini.
            `;
        } else {
            promptProlog = `
            Barcode ini TIDAK ditemukan di database OpenFoodFacts.
            HATI-HATI: Jangan menebak nama produk spesifik jika kamu tidak yakin 100%.
            Analisis berdasarkan struktur kode (GS1 Prefix) untuk menebak negara pembuatnya saja jika produk tidak dikenal.
            Jika benar-benar tidak tahu, beri nama "Produk Tidak Dikenal" dan deskripsi bahwa produk ini belum ada di data latihmu.
            `;
        }

        const prompt = `
            ${promptProlog}

            Analisis kode barcode ini: "${barcode}".
            Bertindaklah sebagai ahli produk dan logistik.
            
            Berikan respon HANYA dalam format JSON valid (RFC 8259), tanpa markdown block (\`\`\`json ... \`\`\`), dengan struktur persis ini:
            {
                "name": "Nama Produk (Singkat & Jelas)",
                "description": "Deskripsi singkat produk yang menarik (maks 2 kalimat).",
                "category": "Kategori Produk (contoh: Makanan, Elektronik, dll)",
                "nutrition": { "calories": "...", "sugar": "..." } (isi string kosong "" jika bukan makanan/minuman),
                "fun_fact": "Satu fakta unik atau menarik tentang jenis produk ini atau negara asalnya."
            }
            
            Gunakan Bahasa Indonesia yang santai tapi profesional.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        // Bersihkan markdown formatting jika AI masih bandel
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
