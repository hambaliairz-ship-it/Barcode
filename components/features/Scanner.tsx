
"use client";

import { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { motion } from "framer-motion";

interface ScannerProps {
    onScan: (decodedText: string) => void;
}

export function Scanner({ onScan }: ScannerProps) {
    const scannerRef = useRef<HTMLDivElement>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!scannerRef.current) return;

        const scanner = new Html5QrcodeScanner(
            "reader",
            {
                fps: 10,
                qrbox: { width: 250, height: 250 },
                aspectRatio: 1.0,
                videoConstraints: {
                    facingMode: "environment"
                },
                formatsToSupport: [
                    Html5QrcodeSupportedFormats.QR_CODE,
                    Html5QrcodeSupportedFormats.EAN_13,
                    Html5QrcodeSupportedFormats.EAN_8,
                    Html5QrcodeSupportedFormats.UPC_A,
                    Html5QrcodeSupportedFormats.UPC_E,
                    Html5QrcodeSupportedFormats.CODE_128,
                    Html5QrcodeSupportedFormats.CODE_39,
                ],
            },
      /* verbose= */ false
        );

        scanner.render(
            (decodedText) => {
                onScan(decodedText);
                scanner.clear();
            },
            (errorMessage) => {
                // Ignore errors for now as they happen frequently when nothing is detected
                // setError(errorMessage);
            }
        );

        return () => {
            scanner.clear().catch((e) => console.error("Failed to clear scanner", e));
        };
    }, [onScan]);

    return (
        <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto p-4">
            <div id="reader" ref={scannerRef} className="w-full overflow-hidden rounded-xl border-2 border-slate-800" />
            {error && <p className="text-red-500 mt-2">{error}</p>}

            <p className="mt-4 text-sm text-gray-400 text-center">
                Point camera at a barcode to scan
            </p>
        </div>
    );
}
