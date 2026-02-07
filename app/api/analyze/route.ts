import { getAnalysisStream } from "@/lib/ai";

export async function POST(req: Request) {
    const { barcode } = await req.json();

    if (!barcode) {
        return new Response("Barcode is required", { status: 400 });
    }

    const stream = new ReadableStream({
        async start(controller) {
            const encoder = new TextEncoder();
            try {
                for await (const update of getAnalysisStream(barcode)) {
                    controller.enqueue(encoder.encode(JSON.stringify(update) + "\n"));
                }
            } catch (err) {
                controller.enqueue(encoder.encode(JSON.stringify({ status: "error", error: String(err) }) + "\n"));
            } finally {
                controller.close();
            }
        }
    });

    return new Response(stream, {
        headers: {
            "Content-Type": "application/x-ndjson",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        },
    });
}
