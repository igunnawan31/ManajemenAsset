"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import DataTable from "../../../components/DataTable";
import Upper from "../../../components/Upper";
import { Html5QrcodeScanner } from "html5-qrcode";
import { IoQrCodeOutline } from "react-icons/io5";

interface Ticket {
    ticketNumber: string;
    branchOrigin: string;
    branchDestination: string;
    outboundDate: string;
    inboundDate: string;
    dateRequested: string;
    approvalStatus: string;
    moveStatus: string;
    receivedBy: string;
    requestedBy: string;
}

interface AssetMoves {
    id: string;
    ticketNumber: string;
    assetNumber: string;
    moveStatus: string;
    scanned: number;
    total: number;
}

const DetailRequestAssetKeluar = () => {
    const { ticketnumber } = useParams();
    const [ticket, setTicket] = useState<Ticket | null>(null);
    const [assets, setAssets] = useState<AssetMoves[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isScanning, setIsScanning] = useState(false);
    const [scanError, setScanError] = useState<string | null>(null);
    const [successPopup, setSuccessPopup] = useState(false);
    const scannerRef = useRef<Html5QrcodeScanner | null>(null);
    const router = useRouter();

    useEffect(() => {
        if (!ticketnumber) {
            setError("Ticket Number is Missing");
            setLoading(false);
            return;
        }

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/ticket/by-id/${ticketnumber}`)
            .then((response) => response.json())
            .then((data) => setTicket(data))
            .catch(() => setError("Ticket not found"));

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/asset-move/by-TN/${ticketnumber}`)
            .then((response) => response.json())
            .then((data) => {
                const updatedAssets = data.map((asset: AssetMoves) => ({ ...asset, scanned: 0, total: 1 }));
                setAssets(updatedAssets);
            })
            .catch(() => setError("Failed to fetch assets"))
            .finally(() => setLoading(false));
    }, [ticketnumber]);

    const handleScanQR = () => {
        setIsScanning(true);
        setScanError(null);

        setTimeout(() => {
            scannerRef.current = new Html5QrcodeScanner(
                "reader",
                { fps: 10, qrbox: { width: 250, height: 250 } },
                false
            );

            scannerRef.current.render(
                (scannedData) => handleScanSuccess(scannedData),
                (err) => console.error("Scan Error:", err)
            );
        }, 500);
    };

    const handleScanSuccess = (scannedData: string) => {
        const matchedAsset = assets.find((asset) => asset.assetNumber === scannedData);
    
        if (matchedAsset) {
            setAssets((prevAssets) =>
                prevAssets.map((asset) =>
                    asset.assetNumber === scannedData && asset.scanned < asset.total
                        ? { ...asset, scanned: asset.scanned + 1 }
                        : asset
                )
            );
    
            setSuccessPopup(true);
            setTimeout(() => setSuccessPopup(false), 2000);
    
            setTimeout(() => {
                setIsScanning(false);
                if (scannerRef.current) {
                    scannerRef.current.clear();
                }
            });
        } else {
            setScanError("Scanned QR does not match any asset.");
        }
    };

    const handleBack = () => {
        router.push("/dashboard/requestassetkeluar");
    }

    const allAssetsScanned = assets.length > 0 && assets.every((asset) => asset.scanned === asset.total);

    const columns = [
        { key: "assetNumber", label: "Asset Number", alwaysVisible: true },
        { key: "moveStatus", label: "Move Status", alwaysVisible: true },
        {
            key: "scanned",
            label: "Scanned",
            alwaysVisible: true,
            render: (_: any, row: Record<string, any>) => {
                const asset = row as AssetMoves;
                return `${asset.scanned}/${asset.total}`;
            },
        },
    ];

    const actions = [
        {
            label: "Scan QR",
            onClick: () => handleScanQR(),
            className: "px-4 py-2 bg-[#202B51] text-white rounded-md hover:bg-opacity-90",
        },
    ];

    if (loading) return <div className="text-center mt-10">Loading...</div>;
    if (error) return <div className="text-center text-red-500 mt-10">{error}</div>;

    return (
        <div className="w-full max-h-full px-8 py-24">
            <Upper title="Request Asset Keluar" />
            <div className="mt-5">
                <h2 className="text-xl font-bold text-[#202B51]">{ticket?.ticketNumber}</h2>
                <p><strong>ID:</strong> {ticket?.ticketNumber}</p>
            </div>
            <div className="mt-5">
                <DataTable columns={columns} data={assets} actions={actions} />
            </div>
            <div className="mt-5 flex justify-between">
                <div>
                    <button className="bg-[#202B51] px-4 py-2 text-white rounded-md hover:bg-opacity-90" onClick={handleBack}>
                        &lt; Back
                    </button>
                </div>
                <div className="space-x-4">
                    {allAssetsScanned && (
                        <button className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
                            Confirm Ticket
                        </button>
                    )}
                    <button className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">
                        Decline Ticket
                    </button>
                </div>
            </div>

            {isScanning && (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-75 z-10">
                    <div className="bg-white p-5 rounded-md shadow-lg relative w-80">
                        <h2 className="text-lg font-bold mb-3">Scan QR Code</h2>
                        <div id="reader" className="w-full"></div>
                        {scanError && <p className="text-red-500 mt-2">{scanError}</p>}
                        <button
                            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                            onClick={() => {
                                setIsScanning(false);
                                if (scannerRef.current) {
                                    scannerRef.current.clear();
                                }
                            }}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {successPopup && (
                <div className="fixed bottom-5 right-5 bg-white border border-[#202B51] text-[#202B51] px-4 py-2 rounded-md shadow-lg transition-opacity duration-500">
                    <div className="flex justify-center items-center">
                        <IoQrCodeOutline className="mr-5" /> 
                        Asset scanned successfully!
                    </div>
                </div>
            )}
        </div>
    );
};

export default DetailRequestAssetKeluar;
