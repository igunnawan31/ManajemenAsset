"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import DataTable from "../../../components/DataTable";
import Upper from "../../../components/Upper";
import { Html5QrcodeScanner } from "html5-qrcode";
import { IoQrCodeOutline } from "react-icons/io5";
import { ClassNames } from "@emotion/react";

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

const DetailAcceptTicketPengecekanAssetMasuk = () => {
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

    const [isRejecting, setIsRejecting] = useState(false);
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [rejectClassification, setRejectClassification] = useState("");
    const [rejectReason, setRejectReason] = useState("");
    const [rejectError, setRejectError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [isAccepting, setIsAccepting] = useState(false);
    const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
    
    const [confirmationMessage, setConfirmationMessage] = useState<string | null>(null);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);

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

    const handleReject = async () => {
        if (!rejectClassification || !rejectReason) {
            setRejectError("Please fill out all required fields.");
            return;
        }
    
        setIsSubmitting(true);
    
        setTimeout(async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ticket/approval`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        ticketNumber: ticket?.ticketNumber,
                        status: "Rejected",
                        rejectClassification,
                        rejectReason,
                    }),
                });
    
                if (!response.ok) {
                    throw new Error("Failed to reject ticket.");
                }

                setIsRejectModalOpen(false);
                setConfirmationMessage("Ticket has been rejected.");
                setShowConfirmationModal(true);
                router.push("/dashboard/pengecekanassetmasuk");
            } catch (err) {
                setConfirmationMessage("Error rejecting ticket. Please try again.");
                setShowConfirmationModal(true);
            } finally {
                setIsSubmitting(false);
            }
        }, 3000);
    };
    
    const handleSubmit = async () => {
        setIsSubmitting(true);
    
        const scannedAssets = assets.filter((asset) => asset.scanned > 0);
        const missingAssets = assets.filter((asset) => asset.scanned === 0);
    
        try {
            for (const asset of scannedAssets) {
                await fetch(`${process.env.NEXT_PUBLIC_API_URL}/asset-move/single-update`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        assetMoveId: parseInt(asset.id),
                        status: "Arrived",
                    }),
                });
            }
    
            for (const asset of missingAssets) {
                await fetch(`${process.env.NEXT_PUBLIC_API_URL}/asset-move/single-update`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        assetMoveId: parseInt(asset.id),
                        status: "Missing",
                    }),
                });
            }
    
            const ticketResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ticket/update-move`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ticketNumber: ticket?.ticketNumber,
                    status: "Completed",
                }),
            });
    
            if (!ticketResponse.ok) {
                throw new Error("Failed to update ticket status");
            }
    
            setConfirmationMessage("Ticket successfully completed.");
            setShowConfirmationModal(true);
        } catch (err) {
            console.error(err);
            setConfirmationMessage("Error completing ticket. Please try again.");
            setShowConfirmationModal(true);
        } finally {
            setIsSubmitting(false);
        }
    };

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
        router.push("/dashboard/pengecekanassetmasuk");
    }

    const allAssetsScanned = assets.length > 0 && assets.every((asset) => asset.scanned === asset.total);

    const columns = [
        { key: "assetNumber", label: "Asset Number", alwaysVisible: true, className:"text-[#202B51]"},
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
        <div className="w-full max-h-full px-8 py-24 text-[#202B51]">
            <Upper title="Accept Ticket Pengecekan Asset Masuk" />
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
                    {assets.some((asset) => asset.scanned > 0) && (
                        <button
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                        >
                            Submit Ticket
                        </button>
                    )}
                    <button
                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                        onClick={() => setIsRejecting(true)}
                    >
                        Reject Ticket
                    </button>
                    {isAccepting && (
                        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-75 z-10">
                            <div className="bg-white p-6 rounded-md shadow-lg w-[30rem]">
                                <h2 className="text-xl font-bold mb-4 text-[#202B51]">Confirm Ticket</h2>
                                <p className="text-gray-700">Are you sure you want to confirm this ticket?</p>

                                <div className="mt-4 flex justify-between">
                                    <button
                                        className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                                        onClick={() => setIsAccepting(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                                        onClick={handleSubmit}
                                    >
                                        Confirm
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    {isRejecting && (
                        <div className="fixed top-0 -left-4 w-full h-full flex items-center justify-center bg-black bg-opacity-75 z-10">
                            <div className="bg-white p-6 rounded-md shadow-lg w-[30rem]">
                                <h2 className="text-xl font-bold mb-4 text-[#202B51]">Reject Ticket</h2>
                                
                                <label className="block mb-2 font-medium">Reject Classification</label>
                                <select
                                    className="w-full p-2 border rounded-md border-[#202B51]"
                                    value={rejectClassification}
                                    onChange={(e) => setRejectClassification(e.target.value)}
                                >
                                    <option value="">Select Classification</option>
                                    <option value="ITEM_UNAVAILABLE">Item Unavailable</option>
                                    <option value="DUPLICATE_TICKET">Duplicate Ticket</option>
                                    <option value="WRONG_PROCUREMENT">Wrong Procurement</option>
                                    <option value="INSUFFICIENT_STOCK">Insufficient Stock</option>
                                    <option value="INVALID_REQUEST">Invalid Request</option>
                                    <option value="DESTINATION_ISSUE">Destination Issue</option>
                                    <option value="SECURITY_RESTRICTION">Security Restriction</option>
                                    <option value="LOGISTICS_PROBLEM">Logistics Problem</option>
                                </select>

                                <label className="block mt-4 mb-2 font-medium">Reject Reason</label>
                                <textarea
                                    className="w-full p-2 border rounded-md border-[#202B51]"
                                    placeholder="Provide a reason..."
                                    value={rejectReason}
                                    onChange={(e) => setRejectReason(e.target.value)}
                                />

                                <div className="mt-4 flex justify-between">
                                    <button
                                        className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                                        onClick={() => setIsRejecting(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                                        onClick={handleReject}
                                    >
                                        I am sure to decline this ticket
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {isScanning && (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-75 z-10">
                    <div className="bg-white p-5 rounded-md shadow-lg relative w-[35rem]">
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
            {showConfirmationModal && (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-10">
                    <div className="bg-white p-6 rounded-md shadow-lg w-[30rem] text-center">
                        <h2 className="text-lg font-bold mb-4 text-[#202B51]">Confirmation</h2>
                        <p className="text-gray-700">{confirmationMessage}</p>

                        <div className="mt-4">
                            <button
                                className="px-4 py-2 bg-[#202B51] text-white rounded-md hover:bg-opacity-90"
                                onClick={() => {
                                    setShowConfirmationModal(false);
                                    router.push("/dashboard/pengecekanassetmasuk");
                                }}
                            >
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DetailAcceptTicketPengecekanAssetMasuk;
