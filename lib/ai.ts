import { db } from "@/lib/db";
import { productCache } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

// Updated List of Reliable Free Models (Feb 2026 Compatible)
const MODELS = [
    "arcee-ai/trinity-large-preview:free",
    "tngtech/deepseek-r1t2-chimera:free",
    "google/gemini-2.0-pro-exp-02-05:free",
    "meta-llama/llama-3.3-70b-instruct:free",
    "google/gemini-2.0-flash-exp:free",
    "deepseek/deepseek-r1:free",
    "qwen/qwen-2.5-vl-72b-instruct:free",
    "mistralai/mistral-small-24b-instruct-2501:free",
    "microsoft/phi-3-medium-128k-instruct:free",
];

export async function* getAnalysisStream(barcodeData: string): AsyncGenerator<{ status: string; model?: string; data?: any }> {
    // 1. Check Cache
    try {
        const cached = await db
            .select()
            .from(productCache)
            .where(eq(productCache.barcodeData, barcodeData))
            .limit(1);

        if (cached.length > 0) {
            let parsedData;
            try {
                parsedData = JSON.parse(cached[0].analysisResult || "{}");
            } catch (e) {
                parsedData = {};
            }
            yield { status: "cached", model: cached[0].modelUsed || "cache", data: parsedData };
            return;
        }
    } catch (error) {
        console.error("Cache check failed:", error);
    }

    // 2. Call OpenRouter with Fallback
    let success = false;

    for (const model of MODELS) {
        yield { status: "analyzing", model };

        try {
            if (!OPENROUTER_API_KEY) throw new Error("API Key belum diset di .env");

            console.log(`[AI] Requesting ${model}...`);

            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json",
                    "HTTP-Referer": "https://rzvalor.app",
                    "X-Title": "RzValor Scanner",
                },
                body: JSON.stringify({
                    model,
                    messages: [
                        {
                            role: "system",
                            content: "Analyze this barcode/product. Response MUST be valid JSON only. Fields: name, category, description, nutrition (object), estimated_price (string). Output only JSON. No markdown.",
                        },
                        {
                            role: "user",
                            content: `Product Barcode: ${barcodeData}`,
                        },
                    ],
                }),
            });

            if (!response.ok) {
                console.warn(`[AI] ${model} failed: ${response.status}`);
                yield { status: "busy", model };
                // Wait 1.5s before retry
                await new Promise(r => setTimeout(r, 1500));
                continue;
            }

            const data = await response.json();

            if (data.choices && data.choices.length > 0) {
                let content = data.choices[0].message.content || "{}";

                // Cleanup JSON & Remove <think> blocks
                content = content.replace(/<think>[\s\S]*?<\/think>/g, "");
                content = content.replace(/```json/g, "").replace(/```/g, "").trim();

                let parsedResult;
                try {
                    parsedResult = JSON.parse(content);
                } catch (e) {
                    console.error(`[AI] JSON Parse Failed for ${model}:`, content.substring(0, 50));
                    continue;
                }

                if (!parsedResult.name) {
                    console.warn(`[AI] Model ${model} returned invalid data structure`);
                    continue;
                }

                // 3. Save to Cache
                try {
                    await db.insert(productCache).values({
                        barcodeData,
                        analysisResult: JSON.stringify(parsedResult),
                        modelUsed: model,
                    });
                } catch (dbError) {
                    console.error("Cache save failed:", dbError);
                }

                success = true;
                yield { status: "complete", model, data: parsedResult };
                return;
            }

        } catch (error) {
            console.error(`Error with model ${model}:`, error);
            yield { status: "error", model };
        }
    }

    if (!success) {
        // Fallback: Direct Gemini API (Using GEMINI_API_KEY from .env)
        const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
        if (GEMINI_API_KEY) {
            try {
                yield { status: "analyzing", model: "google-gemini-2.0-flash-direct" };
                const { GoogleGenerativeAI } = await import("@google/generative-ai");
                const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
                const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" }); // or gemini-1.5-flash

                const result = await model.generateContent(`Analyze this barcode/product: ${barcodeData}. Return VALID JSON with fields: name, category, description, nutrition (object), estimated_price. Output ONLY JSON, no markdown.`);
                const response = result.response;
                const text = response.text();

                // Cleanup JSON
                const cleanJson = text.replace(/```json/g, "").replace(/```/g, "").trim();
                const parsedResult = JSON.parse(cleanJson);

                // Save to Cache
                try {
                    await db.insert(productCache).values({
                        barcodeData,
                        analysisResult: JSON.stringify(parsedResult),
                        modelUsed: "gemini-direct",
                    });
                } catch (dbError) {
                    // Ignore cache errors
                }

                yield { status: "complete", model: "gemini-direct", data: parsedResult };
                return;

            } catch (geminiError) {
                console.error("Gemini Direct Error:", geminiError);
            }
        }

        yield { status: "failed", data: { error: "Semua server AI sedang sibuk. Mohon coba lagi dalam 1 menit." } };
    }
}
