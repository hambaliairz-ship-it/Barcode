
import { config } from 'dotenv';
config(); // Load .env

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

if (!OPENROUTER_API_KEY) {
    console.error("❌ API Key not found in .env");
    process.exit(1);
}

const MODELS = [
    "google/gemini-2.0-flash-lite-preview-02-05:free",
    "meta-llama/llama-3.3-70b-instruct:free",
    "qwen/qwen-2.5-coder-32b-instruct:free"
];

// Mock basic test data
const barcode = "8992761136056"; // Teh Kotak example

async function testModel(model: string) {
    console.log(`\n🧪 Testing model: ${model}...`);
    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "https://rzvalor.com",
                "X-Title": "RzValor Test",
            },
            body: JSON.stringify({
                model,
                messages: [
                    {
                        role: "system",
                        content: "You are an expert product analyzer. Analyze this barcode/product. Provide output as VALID JSON only. No markdown formatting, no '```json' wrapper. Fields: name, category, description, nutrition (object), estimated_price.",
                    },
                    {
                        role: "user",
                        content: `Barcode: ${barcode}`,
                    },
                ],
            }),
        });

        if (!response.ok) {
            console.log(`❌ Failed: Status ${response.status}`);
            const text = await response.text();
            console.log(`Resource: ${text.substring(0, 200)}`);
            return;
        }

        const data = await response.json();
        // console.log("Raw Response:", JSON.stringify(data, null, 2));

        if (!data.choices || data.choices.length === 0) {
            console.log("❌ No choices returned");
            return;
        }

        const content = data.choices[0].message.content;
        console.log("📄 Content received (first 100 chars):", content.substring(0, 100).replace(/\n/g, ' '));

        // Try parsing
        let jsonStr = content;
        // Strip markdown code blocks if present
        if (content.includes("```json")) {
            jsonStr = content.split("```json")[1].split("```")[0];
        } else if (content.includes("```")) {
            jsonStr = content.split("```")[1].split("```")[0];
        }

        // Handle <think> blocks from R1 models
        jsonStr = jsonStr.replace(/<think>[\s\S]*?<\/think>/g, "").trim();

        try {
            const parsed = JSON.parse(jsonStr);
            console.log("✅ JSON Parse Success!");
            console.log("Name:", parsed.name);
        } catch (e) {
            console.log("❌ JSON Parse Failed");
            console.log("Cleaned string was:", jsonStr);
        }

    } catch (e) {
        console.error(`❌ Error executing fetch:`, e);
    }
}

async function run() {
    console.log("🚀 Starting AI Debug...");
    for (const model of MODELS) {
        await testModel(model);
    }
}

run();
