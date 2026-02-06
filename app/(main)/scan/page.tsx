
"use client";

import { Scanner } from "@/components/features/Scanner";
import { useState } from "react";
import { analyzeProduct } from "@/lib/actions/analyze-product";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Sparkles, AlertCircle } from "lucide-react";

export default function ScanPage() {
    const [data, setData] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [aiResult, setAiResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const handleScan = async (decodedText: string) => {
        // Prevent multiple scans while loading
        if (loading || data === decodedText) return;

        setData(decodedText);
        setLoading(true);
        setError(null);
        setAiResult(null);

        try {
            const result = await analyzeProduct(decodedText);
            if (result.error) {
                setError(result.error);
            } else {
                setAiResult(result.data);
            }
        } catch (err) {
            setError("Terjadi kesalahan sistem.");
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setData(null);
        setAiResult(null);
        setError(null);
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
                        <motion.div
                            key="result"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="w-full max-w-md space-y-4"
                        >
                            {/* Barcode Info */}
                            <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-xl flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-slate-400">Barcode Terdeteksi</p>
                                    <p className="font-mono text-lg font-bold tracking-wider">{data}</p>
                                </div>
                                <button
                                    onClick={handleReset}
                                    className="text-xs bg-slate-700 hover:bg-slate-600 px-3 py-1.5 rounded-full transition-colors"
                                >
                                    Scan Ulang
                                </button>
                            </div>

                            {/* Loading State with Skeleton */}
                            {loading && (
                                <div className="p-6 bg-slate-900/80 border border-slate-800 rounded-2xl text-center space-y-4 animate-pulse">
                                    <Loader2 className="w-10 h-10 text-blue-500 animate-spin mx-auto" />
                                    <p className="text-blue-400 font-medium">Gemini AI sedang menganalisis...</p>
                                </div>
                            )}

                            {/* Error State */}
                            {error && (
                                <div className="p-4 bg-red-950/30 border border-red-900/50 rounded-xl text-red-200 flex items-center gap-3">
                                    <AlertCircle className="w-5 h-5 shrink-0" />
                                    <p className="text-sm">{error}</p>
                                </div>
                            )}

                            {/* AI Result */}
                            {aiResult && (
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="p-6 bg-linear-to-br from-slate-900 to-slate-800 border border-purple-500/30 rounded-2xl shadow-2xl relative overflow-hidden"
                                >
                                    {/* Background Glow */}
                                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-500/20 blur-3xl rounded-full pointer-events-none" />

                                    <div className="relative z-10 space-y-4">
                                        <div>
                                            <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-[10px] uppercase font-bold rounded-md tracking-wider">
                                                {aiResult.category || "General"}
                                            </span>
                                            <h2 className="text-2xl font-bold text-white mt-1 leading-tight">
                                                {aiResult.name}
                                            </h2>
                                        </div>

                                        <p className="text-slate-300 text-sm leading-relaxed">
                                            {aiResult.description}
                                        </p>

                                        {aiResult.nutrition && Object.keys(aiResult.nutrition).length > 0 && (
                                            <div className="grid grid-cols-2 gap-2 mt-4">
                                                {Object.entries(aiResult.nutrition).map(([key, value]) => (
                                                    <div key={key} className="bg-slate-950/50 p-2 rounded-lg">
                                                        <p className="text-[10px] text-slate-500 uppercase">{key}</p>
                                                        <p className="text-sm font-semibold">{String(value)}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {aiResult.fun_fact && (
                                            <div className="mt-4 pt-4 border-t border-white/10">
                                                <p className="text-xs text-yellow-400 italic">
                                                    💡 Fun Fact: {aiResult.fun_fact}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
