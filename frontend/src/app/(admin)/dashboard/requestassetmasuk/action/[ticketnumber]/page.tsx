"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import DataTable from "../../../components/DataTable";
import Upper from "../../../components/Upper";

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

const DetailRequestAssetMasuk = () => {
    const { ticketnumber } = useParams();
    const [ticket, setTicket] = useState<Ticket | null>(null);
    const [assets, setAssets] = useState<AssetMoves[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
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
                const updatedAssets = data.map((asset: AssetMoves) => ({ ...asset, scanned: 1, total: 1 }));
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
            } catch (err) {
                setConfirmationMessage("Error rejecting ticket. Please try again.");
                setShowConfirmationModal(true);
            } finally {
                setIsSubmitting(false);
            }
        }, 3000);
    };

    const handleAccept = async () => {
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
                        status: "Approved",
                        dateApproved: new Date().toISOString().split("T")[0],
                    }),
                });

                if (!response.ok) {
                    throw new Error("Failed to approve ticket.");
                }

                setIsAcceptModalOpen(false);
                setConfirmationMessage("Ticket has been approved.");
                setShowConfirmationModal(true);
            } catch (err) {
                setConfirmationMessage("Error approving ticket. Please try again.");
                setShowConfirmationModal(true);
            } finally {
                setIsSubmitting(false);
            }
        }, 3000);
    };

    const handleBack = () => {
        router.push("/dashboard/requestassetmasuk");
    };

    const allAssetsScanned = assets.length > 0 && assets.every((asset) => asset.scanned === asset.total);

    const columns = [
        { key: "assetNumber", label: "Asset Number", alwaysVisible: true, className: "text-[#202B51]" },
        { key: "moveStatus", label: "Move Status", alwaysVisible: true },
    ];

    if (loading) return <div className="text-center mt-10">Loading...</div>;
    if (error) return <div className="text-center text-red-500 mt-10">{error}</div>;

    return (
        <div className="w-full max-h-full px-8 py-24">
            <Upper title="Request Asset Masuk" />
            <div className="mt-5">
                <h2 className="text-xl font-bold text-[#202B51]">{ticket?.ticketNumber}</h2>
                <p><strong>ID:</strong> {ticket?.ticketNumber}</p>
            </div>
            <div className="mt-5">
                <DataTable columns={columns} data={assets} />
            </div>
            <div className="mt-5 flex justify-between">
                <div>
                    <button className="bg-[#202B51] px-4 py-2 text-white rounded-md hover:bg-opacity-90" onClick={handleBack}>
                        &lt; Back
                    </button>
                </div>
                <div className="space-x-4">
                    {allAssetsScanned && (
                        <button
                            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                            onClick={() => setIsAccepting(true)}
                        >
                            Confirm Ticket
                        </button>
                    )}
                    <button
                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                        onClick={() => setIsRejecting(true)}
                    >
                        Reject Ticket
                    </button>
                </div>
            </div>

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
                                onClick={handleAccept}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isRejecting && (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-75 z-10">
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

            {showConfirmationModal && (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-10">
                    <div className="bg-white p-6 rounded-md shadow-lg w-[30rem] text-center">
                        <h2 className="text-lg font-bold mb-4 text-[#202B51]">Confirmation</h2>
                        <p className="text-gray-700">{confirmationMessage}</p>
                        <div className="mt-4 flex justify-center gap-4">
                            <button
                                className="px-4 py-2 bg-[#202B51] text-white rounded-md hover:bg-opacity-90"
                                onClick={() => router.push("/dashboard/requestassetmasuk")}
                            >
                                Back to List
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DetailRequestAssetMasuk;
