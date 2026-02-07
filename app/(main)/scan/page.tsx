
"use client";

import { Scanner } from "@/components/features/Scanner";
import { useState } from "react";
import { analyzeProduct } from "@/lib/actions/analyze-product";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Sparkles, AlertCircle } from "lucide-react";

import { saveScan } from "@/lib/actions/save-scan";
import { ScannerOverlay } from "@/components/ScannerOverlay";

export default function ScanPage() {
    const [data, setData] = useState<string | null>(null);
    const [status, setStatus] = useState<"idle" | "analyzing" | "complete" | "error">("idle");
    const [modelName, setModelName] = useState<string | undefined>(undefined);
    const [aiResult, setAiResult] = useState<any>(null);
    const [error, setError] = useState<string | undefined>(undefined);
    const [isUrl, setIsUrl] = useState(false);

    // Regex sederhana untuk deteksi URL
    const urlPattern = /^(http|https):\/\/[^ "]+$/;

    const handleScan = async (decodedText: string) => {
        // Prevent multiple scans while loading
        if (status === "analyzing" || data === decodedText) return;

        setData(decodedText);

        // Cek apakah ini URL?
        if (urlPattern.test(decodedText)) {
            setIsUrl(true);
            return; // Berhenti di sini, jangan analisis AI dulu
        }

        setIsUrl(false);
        processAnalysis(decodedText);
    };

    const processAnalysis = async (decodedText: string) => {
        setStatus("analyzing");
        setError(undefined);
        setAiResult(null);
        setModelName(undefined);

        try {
            const response = await fetch("/api/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ barcode: decodedText }),
            });

            if (!response.ok) throw new Error("Network response was not ok");
            if (!response.body) throw new Error("No response body");

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let jsonBuffer = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                jsonBuffer += chunk;

                const lines = jsonBuffer.split("\n");
                jsonBuffer = lines.pop() || ""; // Keep incomplete line in buffer

                for (const line of lines) {
                    if (!line.trim()) continue;
                    try {
                        const update = JSON.parse(line);

                        if (update.status === "analyzing" || update.status === "busy") {
                            setModelName(update.model);
                        } else if (update.status === "complete" || update.status === "cached") {
                            setAiResult(update.data);
                            setModelName(update.model);
                            setStatus("complete");

                            // Save to history
                            await saveScan({
                                ...update.data,
                                barcode: decodedText
                            });
                        } else if (update.status === "error" || update.status === "failed") {
                            setError(update.data?.error || "Analisis gagal. Server sibuk.");
                            setStatus("error");
                        }
                    } catch (e) {
                        console.error("Error parsing stream line", e);
                    }
                }
            }

        } catch (err) {
            console.error(err);
            setError("Terjadi kesalahan sistem.");
            setStatus("error");
        }
    };

    const handleReset = () => {
        setData(null);
        setAiResult(null);
        setError(undefined);
        setIsUrl(false);
        setStatus("idle");
        setModelName(undefined);
    };

    return (
        <div className="flex flex-col h-[80vh]">
            <div className="text-center mb-6">
                <h1 className="text-2xl font-bold bg-linear-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text inline-flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-purple-400" />
                    AI Scanner
                </h1>
                <p className="text-slate-400 text-sm">Scan barcode untuk analisa instan</p>
            </div>

            <div className="flex-1 flex flex-col items-center justify-start w-full relative">
                <AnimatePresence mode="wait">
                    {!data ? (
                        <motion.div
                            key="scanner"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full"
                        >
                            <Scanner onScan={handleScan} />
                        </motion.div>
                    ) : (
                        <div className="w-full max-w-md space-y-4">
                            {/* Barcode Info */}
                            <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-xl flex items-center justify-between gap-4">
                                <div className="min-w-0">
                                    <p className="text-xs text-slate-400">Barcode Terdeteksi</p>
                                    <p className="font-mono text-lg font-bold tracking-wider truncate">{data}</p>
                                </div>
                                <button
                                    onClick={handleReset}
                                    className="text-xs bg-slate-700 hover:bg-slate-600 px-3 py-1.5 rounded-full transition-colors shrink-0"
                                >
                                    Scan Ulang
                                </button>
                            </div>

                            {/* URL Prompt */}
                            {isUrl && status === "idle" && (
                                <div className="p-6 bg-slate-900/80 border border-blue-500/30 rounded-2xl text-center space-y-4">
                                    <p className="text-slate-300 text-sm">Ini sepertinya sebuah Link/URL website.</p>
                                    <div className="flex flex-col gap-3">
                                        <a
                                            href={data!}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="w-full py-3 bg-blue-500 hover:bg-blue-600 rounded-xl font-semibold text-white transition-colors flex items-center justify-center gap-2"
                                        >
                                            🌐 Buka Link
                                        </a>
                                        <button
                                            onClick={() => processAnalysis(data!)}
                                            className="w-full py-3 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-xl font-medium text-slate-300 transition-colors"
                                        >
                                            🤖 Tetap Analisis dengan AI
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Enhanced Overlay Component */}
                            <ScannerOverlay
                                status={status}
                                modelName={modelName}
                                result={aiResult}
                                error={error}
                                onReset={handleReset}
                            />
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
