import { db } from "@/lib/db";
import { productCache } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

const MODELS = [
    "tng/deepseek-r1t2-chimera:free",
    "meta/llama-3.3-70b-instruct:free",
    "upstage/solar-pro-3:free",
];

export type AnalysisResult = {
    data: any;
    model: string;
    cached: boolean;
};

export async function* getAnalysisStream(barcodeData: string): AsyncGenerator<{ status: string; model?: string; data?: any }> {
    // 1. Check Cache
    try {
        const cached = await db
            .select()
            .from(productCache)
            .where(eq(productCache.barcodeData, barcodeData))
            .limit(1);

        if (cached.length > 0) {
            yield { status: "cached", model: cached[0].modelUsed || "unknown", data: JSON.parse(cached[0].analysisResult || "{}") };
            return;
        }
    } catch (error) {
        console.error("Cache check failed:", error);
        // Proceed to fetch if cache check fails
    }

    // 2. Call OpenRouter with Fallback
    for (const model of MODELS) {
        yield { status: "analyzing", model };

        try {
            if (!OPENROUTER_API_KEY) throw new Error("API Key missing");

            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json",
                    "HTTP-Referer": "https://rzvalor.com", // Optional
                    "X-Title": "RzValor AI Scanner", // Optional
                },
                body: JSON.stringify({
                    model,
                    messages: [
                        {
                            role: "system",
                            content: "Analyze this barcode data/product and provide a JSON response with fields: name, category, description, nutrition (if food), estimated_price. output ONLY VALID JSON.",
                        },
                        {
                            role: "user",
                            content: barcodeData,
                        },
                    ],
                }),
            });

            if (!response.ok) {
                console.warn(`Model ${model} failed with status ${response.status}`);
                yield { status: "busy", model };
                continue; // Try next model
            }

            const data = await response.json();

            if (data.choices && data.choices.length > 0) {
                const content = data.choices[0].message.content;

                // Basic JSON extraction (sometimes models add markdown blocks)
                let jsonStr = content;
                if (content.includes("```json")) {
                    jsonStr = content.split("```json")[1].split("```")[0];
                } else if (content.includes("```")) {
                    jsonStr = content.split("```")[1].split("```")[0];
                }

                let parsedResult;
                try {
                    parsedResult = JSON.parse(jsonStr);
                } catch (e) {
                    // Fallback to storing raw if parsing fails, or try next model?
                    // For now, assume success if we got content, but try to parse.
                    parsedResult = { raw: content, error: "Failed to parse JSON" };
                }

                // 3. Save to Cache
                try {
                    await db.insert(productCache).values({
                        barcodeData,
                        analysisResult: JSON.stringify(parsedResult),
                        modelUsed: model,
                    });
                } catch (dbError) {
                    console.error("Failed to save to cache:", dbError);
                }

                yield { status: "complete", model, data: parsedResult };
                return;
            }

        } catch (error) {
            console.error(`Error with model ${model}:`, error);
            yield { status: "error", model };
        }
    }

    yield { status: "failed", data: null };
}

// Helper for non-streaming usage if needed
export async function getAnalysis(barcodeData: string) {
    const generator = getAnalysisStream(barcodeData);
    let lastValue;
    for await (const value of generator) {
        lastValue = value;
    }
    return lastValue;
}
