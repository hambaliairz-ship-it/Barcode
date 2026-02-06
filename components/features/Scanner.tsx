
"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { motion } from "framer-motion";
import { Camera, RefreshCw, X, ImagePlus } from "lucide-react";

interface ScannerProps {
    onScan: (decodedText: string) => void;
}

export function Scanner({ onScan }: ScannerProps) {
    const [isScanning, setIsScanning] = useState(false);
    const [cameras, setCameras] = useState<any[]>([]);
    const [selectedCamera, setSelectedCamera] = useState<string | null>(null);
    const scannerRef = useRef<Html5Qrcode | null>(null);

    useEffect(() => {
        // Initialize scanner instance with formats config
        const scanner = new Html5Qrcode("reader", {
            formatsToSupport: [
                Html5QrcodeSupportedFormats.QR_CODE,
                Html5QrcodeSupportedFormats.EAN_13,
                Html5QrcodeSupportedFormats.EAN_8,
                Html5QrcodeSupportedFormats.UPC_A,
                Html5QrcodeSupportedFormats.UPC_E,
                Html5QrcodeSupportedFormats.CODE_128,
                Html5QrcodeSupportedFormats.CODE_39,
            ],
            verbose: false
        });
        scannerRef.current = scanner;

        // Get cameras
        Html5Qrcode.getCameras()
            .then((devices) => {
                if (devices && devices.length) {
                    setCameras(devices);
                    // Prefer back camera if available (usually the last one or labelled 'back')
                    const backCamera = devices.find(
                        (dev) => dev.label.toLowerCase().includes("back") || dev.label.toLowerCase().includes("environment")
                    );
                    setSelectedCamera(backCamera ? backCamera.id : devices[0].id);
                }
            })
            .catch((err) => console.error("Error getting cameras", err));

        return () => {
            if (scannerRef.current?.isScanning) {
                scannerRef.current.stop().catch(console.error);
            }
            scannerRef.current?.clear();
        };
    }, []);

    const startScanning = async () => {
        if (!scannerRef.current) return;

        try {
            setIsScanning(true);
            await scannerRef.current.start(
                selectedCamera || { facingMode: "environment" },
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 },
                    aspectRatio: 1.0,
                },
                (decodedText) => {
                    onScan(decodedText);
                    stopScanning();
                },
                () => { } // Ignore errors
            );
        } catch (err) {
            console.error("Failed to start scanning", err);
            setIsScanning(false);
        }
    };

    const stopScanning = async () => {
        if (scannerRef.current?.isScanning) {
            await scannerRef.current.stop();
            setIsScanning(false);
        }
    };

    const scanFromFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];
        const scanner = scannerRef.current;

        if (!scanner) return;

        try {
            const result = await scanner.scanFile(file, true);
            onScan(result); // Pass decoded text to parent
        } catch (err) {
            console.error("Error scanning file", err);
            alert("Gagal membaca barcode dari gambar. Pastikan gambar jelas.");
        }
    };

    return (
        <div className="w-full max-w-md mx-auto p-4 flex flex-col items-center">
            {/* Scanner Container */}
            <div
                className="relative w-full aspect-square bg-slate-900 rounded-3xl overflow-hidden border border-slate-700 shadow-2xl"
            >
                {/* The actual scanner mounting point */}
                <div id="reader" className="w-full h-full" />

                {/* Overlay when not scanning */}
                {!isScanning && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/90 z-10 backdrop-blur-sm">
                        <Camera className="w-16 h-16 text-slate-700/50 mb-4" />
                        <p className="text-slate-500 text-sm">Siap untuk memindai</p>
                    </div>
                )}

                {/* Overlay Guide when Scanning */}
                {isScanning && (
                    <>
                        {/* Corner Markers */}
                        <div className="absolute inset-0 p-12 pointer-events-none">
                            <div className="w-full h-full border-2 border-blue-400/50 rounded-xl relative">
                                <div className="absolute top-0 left-0 w-8 h-8 border-l-4 border-t-4 border-blue-500 -ml-1 -mt-1" />
                                <div className="absolute top-0 right-0 w-8 h-8 border-r-4 border-t-4 border-blue-500 -mr-1 -mt-1" />
                                <div className="absolute bottom-0 left-0 w-8 h-8 border-l-4 border-b-4 border-blue-500 -ml-1 -mb-1" />
                                <div className="absolute bottom-0 right-0 w-8 h-8 border-r-4 border-b-4 border-blue-500 -mr-1 -mb-1" />

                                {/* Moving Line Animation */}
                                <motion.div
                                    animate={{ top: ["10%", "90%", "10%"] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    className="absolute left-0 right-0 h-0.5 bg-red-500/80 shadow-[0_0_10px_rgba(239,68,68,0.8)]"
                                />
                            </div>
                        </div>

                        {/* Close Button */}
                        <button
                            onClick={stopScanning}
                            className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white backdrop-blur-md z-20 hover:bg-black/70"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </>
                )}
            </div>

            {/* Button Controls */}
            {!isScanning && (
                <div className="mt-8 flex flex-col gap-4 w-full px-4">
                    {/* Camera Selector (Only show if multiple cameras) */}
                    {cameras.length > 1 && (
                        <div className="flex justify-center items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-full border border-slate-700 w-fit mx-auto mb-2">
                            <RefreshCw className="w-4 h-4 text-slate-400" />
                            <select
                                value={selectedCamera || ""}
                                onChange={(e) => setSelectedCamera(e.target.value)}
                                className="bg-transparent text-sm text-slate-300 outline-none cursor-pointer"
                            >
                                {cameras.map((cam) => (
                                    <option key={cam.id} value={cam.id} className="bg-slate-800">
                                        {cam.label || `Camera ${cam.id.slice(0, 5)}...`}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className="flex gap-4 justify-center">
                        {/* Start Camera Button */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={startScanning}
                            className="flex flex-col items-center gap-2 p-4 bg-slate-800 rounded-2xl border border-slate-700 shadow-lg hover:bg-slate-750 transition-colors flex-1"
                        >
                            <div className="w-12 h-12 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                                <Camera className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-sm font-medium text-slate-200">Kamera</span>
                        </motion.button>

                        {/* Gallery Upload Button */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => document.getElementById('qr-input-file')?.click()}
                            className="flex flex-col items-center gap-2 p-4 bg-slate-800 rounded-2xl border border-slate-700 shadow-lg hover:bg-slate-750 transition-colors flex-1"
                        >
                            <div className="w-12 h-12 rounded-full bg-linear-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                                <ImagePlus className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-sm font-medium text-slate-200">Galeri</span>
                            <input
                                type="file"
                                id="qr-input-file"
                                accept="image/*"
                                className="hidden"
                                onChange={scanFromFile}
                            />
                        </motion.button>
                    </div>
                </div>
            )}
        </div>
    );
}
