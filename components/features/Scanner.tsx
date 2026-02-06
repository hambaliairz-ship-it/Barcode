
"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { motion } from "framer-motion";
import { Camera, RefreshCw, X } from "lucide-react";

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
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={startScanning}
                            className="group relative flex flex-col items-center gap-3"
                        >
                            <div className="w-20 h-20 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-all">
                                <Camera className="w-10 h-10 text-white" />
                            </div>
                            <span className="text-white font-medium tracking-wide">Mulai Scan</span>
                        </motion.button>
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

            {/* Camera Selector (Only show if multiple cameras) */}
            {!isScanning && cameras.length > 1 && (
                <div className="mt-6 flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-full border border-slate-700">
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
        </div>
    );
}
