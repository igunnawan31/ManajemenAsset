// "use client";

// import React, { useEffect, useState } from "react";
// import { Html5QrcodeScanner } from "html5-qrcode";

// const QRAssetIdView = () => {
//     const [scannedResult, setScannedResult] = useState<string | null>(null);

//     useEffect(() => {
//         const scanner = new Html5QrcodeScanner(
//             "qr-reader",
//             { fps: 10, qrbox: { width: 250, height: 250 } },
//             false
//         );

//         scanner.render(
//             (decodedText) => {
//                 setScannedResult(decodedText);
//                 scanner.clear();
//             },
//             (errorMessage) => {
//                 console.log("QR Scan Error:", errorMessage);
//             }
//         );

//         return () => {
//             scanner.clear();
//         };
//     }, []);

//     return (
//         <div className="flex flex-col items-center">
//             <h2 className="text-lg font-bold mb-4">Scan QR Code</h2>
//             <div id="qr-reader" className="w-full max-w-xs"></div>
//             {scannedResult && (
//                 <p className="mt-4 text-green-500 font-bold">Scanned: {scannedResult}</p>
//             )}
//         </div>
//     );
// };

// export default QRAssetIdView;
