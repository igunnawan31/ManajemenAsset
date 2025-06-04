"use client";

import React, { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useRouter } from "next/navigation";

const QRAssetIdView = () => {
    const [scannedResult, setScannedResult] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const scanner = new Html5QrcodeScanner(
            "qr-reader",
            { fps: 10, qrbox: { width: 400, height: 400 } },
            false
        );

        scanner.render(
            (decodedText) => {
                setScannedResult(decodedText);
                scanner.clear();
            },
            (errorMessage) => {
                console.log("QR Scan Error:", errorMessage);
            }
        );

        return () => {
            scanner.clear();
        };
    }, []);

    const back = () => {
        router.back();
    }

    return (
        <div className="w-full flex flex-col items-center ">
            <h2 className="text-lg font-bold mb-4">Scan QR Code</h2>
            <div id="qr-reader" className="w-full max-w-xs"></div>
            {scannedResult && (
                <p className="mt-4 text-green-500 font-bold">Scanned: {scannedResult}</p>
            )}
            <div className="w-full flex justify-end items-end mt-10">
                <button className="w-32 py-5 bg-white border-[#20458A] border rounded-lg text-[#20458A] hover:bg-gray-100" onClick={back}>Back</button>
                <button className="w-32 py-5 bg-[#20458A] border-[#20458A] border rounded-lg text-white ml-5 hover:bg-opacity-90">Konfirmasi</button>
            </div>
        </div>
    );
};

export default QRAssetIdView;
