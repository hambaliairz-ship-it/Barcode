"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Loader2, CheckCircle2, AlertCircle, Bot } from "lucide-react";
import { useEffect, useState } from "react";

export type Status = "idle" | "analyzing" | "complete" | "error";

interface ScannerOverlayProps {
    status: Status;
    modelName?: string;
    result?: any;
    error?: string;
    onReset?: () => void;
}

export function ScannerOverlay({ status, modelName, result, error, onReset }: ScannerOverlayProps) {
    const [modelStatus, setModelStatus] = useState("Menghubungkan ke AI...");

    // Update status text based on modelName changes or specific status
    useEffect(() => {
        if (status === "analyzing") {
            if (modelName) {
                setModelStatus(`Menganalisis dengan ${modelName}...`);
            } else {
                setModelStatus("Menghubungkan ke AI...");
            }
        } else if (status === "error") {
            setModelStatus("Analisis gagal.");
        } else if (status === "complete") {
            setModelStatus("Selesai!");
        }
    }, [status, modelName]);

    // Framer Motion variants
    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
        exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
    };

    return (
        <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto mt-4 px-4">
            <AnimatePresence mode="wait">
                {status === "analyzing" && (
                    <motion.div
                        key="analyzing"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="flex flex-col items-center gap-3 p-4 bg-slate-800/80 backdrop-blur-md rounded-2xl border border-slate-700 w-full"
                    >
                        <div className="relative">
                            <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping" />
                            <Loader2 className="w-8 h-8 text-blue-400 animate-spin relative z-10" />
                        </div>
                        <p className="text-slate-200 text-sm font-medium animate-pulse">
                            {modelStatus}
                        </p>
                        {/* If switching models taking long, show fallback message */}
                        {modelName && modelName.includes("fallback") && (
                            <p className="text-amber-400 text-xs mt-1">
                                Model sibuk, mencoba model cadangan...
                            </p>
                        )}
                    </motion.div>
                )}

                {status === "error" && (
                    <motion.div
                        key="error"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="flex flex-col items-center gap-3 p-4 bg-red-500/10 backdrop-blur-md rounded-2xl border border-red-500/30 w-full"
                    >
                        <AlertCircle className="w-8 h-8 text-red-400" />
                        <p className="text-red-200 text-sm font-medium text-center">
                            {error || "Terjadi kesalahan saat memproses data."}
                        </p>
                        <button
                            onClick={onReset}
                            className="mt-2 px-4 py-2 bg-red-500/20 hovered:bg-red-500/30 rounded-lg text-xs text-red-200 transition-colors"
                        >
                            Coba Lagi
                        </button>
                    </motion.div>
                )}

                {status === "complete" && result && (
                    <motion.div
                        key="complete"
                        initial={{ y: "100%", opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: "100%", opacity: 0 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-700 p-6 rounded-t-3xl shadow-2xl z-50 max-h-[80vh] overflow-y-auto"
                    >
                        <div className="w-12 h-1.5 bg-slate-700 rounded-full mx-auto mb-6" />

                        <div className="flex items-start gap-4 mb-6">
                            <div className="p-3 bg-emerald-500/20 rounded-xl border border-emerald-500/30">
                                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white mb-1">
                                    {result.name || "Produk Terdeteksi"}
                                </h3>
                                <div className="flex items-center gap-2 text-xs text-slate-400">
                                    <Bot className="w-3 h-3" />
                                    <span>Analisis oleh: {modelName}</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {result.category && (
                                <div className="p-4 bg-slate-800 rounded-xl">
                                    <span className="text-xs text-slate-500 uppercase tracking-wider block mb-1">Kategori</span>
                                    <p className="text-slate-200 font-medium">{result.category}</p>
                                </div>
                            )}

                            {result.description && (
                                <div className="p-4 bg-slate-800 rounded-xl">
                                    <span className="text-xs text-slate-500 uppercase tracking-wider block mb-1">Deskripsi</span>
                                    <p className="text-slate-300 text-sm leading-relaxed">{result.description}</p>
                                </div>
                            )}

                            {result.nutrition && (
                                <div className="p-4 bg-slate-800 rounded-xl">
                                    <span className="text-xs text-slate-500 uppercase tracking-wider block mb-2">Nutrisi</span>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        {Object.entries(result.nutrition).map(([key, value]) => (
                                            <div key={key} className="flex justify-between border-b border-slate-700/50 pb-1 last:border-0">
                                                <span className="text-slate-400 capitalize">{key.replace(/_/g, ' ')}</span>
                                                <span className="text-slate-200 font-medium">{String(value)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {result.estimated_price && (
                                <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                                    <span className="text-xs text-blue-400 uppercase tracking-wider block mb-1">Estimasi Harga</span>
                                    <p className="text-blue-100 font-bold text-lg">{result.estimated_price}</p>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={onReset}
                            className="w-full mt-6 py-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all active:scale-95 shadow-lg shadow-blue-500/20"
                        >
                            Scan Lagi
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
