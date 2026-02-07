"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

export async function checkAiStatus() {
    const key = process.env.GEMINI_API_KEY;

    if (!key) {
        return { status: "error", message: "API Key Missing" };
    }

    try {
        const genAI = new GoogleGenerativeAI(key);
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        // Very simple ping/check
        const result = await model.generateContent("ping");
        const response = await result.response;

        if (response) {
            return { status: "online", message: "AI is ready" };
        }
        return { status: "warning", message: "AI responded with empty content" };
    } catch (error: any) {
        console.error("AI Check Failed:", error);
        return {
            status: "offline",
            message: error.message?.includes("404")
                ? "Versioning Error (404)"
                : error.message?.includes("quota")
                    ? "Quota Exceeded"
                    : "Down"
        };
    }
}
