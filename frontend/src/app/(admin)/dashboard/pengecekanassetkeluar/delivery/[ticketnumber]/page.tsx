"use client";

import { useEffect, useState, useRef } from "react";
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

const DetailRequestAssetKeluar = () => {
    const { ticketnumber } = useParams();
    const [ticket, setTicket] = useState<Ticket | null>(null);
    const [assets, setAssets] = useState<AssetMoves[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
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
                const updatedAssets = data.map((asset: AssetMoves) => ({ ...asset, scanned: 1, total: 1 }));
                setAssets(updatedAssets);
            })
            .catch(() => setError("Failed to fetch assets"))
            .finally(() => setLoading(false));
    }, [ticketnumber]);

    const columns = [
        { key: "assetNumber", label: "Asset Number", alwaysVisible: true, className:"text-[#202B51]"},
        { key: "moveStatus", label: "Move Status", alwaysVisible: true },
        {
            key: "scanned",
            label: "Scanned",
            alwaysVisible: true,
            render: (_: any, row?: Record<string, any>) => {
                if (!row) return null;
                const asset = row as AssetMoves;
                return `${asset.scanned}/${asset.total}`;
            }
        },
    ];
    
    const handleAccept = async () => {
        setIsSubmitting(true);

        setTimeout(async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ticket/update-move`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        ticketNumber: ticket?.ticketNumber,
                        status: "In_Progress"
                    }),
                });

                if (!response.ok) {
                    throw new Error("Failed to delivered ticket.");
                }
                
                setIsAcceptModalOpen(false);
                setConfirmationMessage("Ticket has been delivered.");
                setShowConfirmationModal(true);
                router.push("/dashboard/requestassetkeluar");
            } catch (err) {
                setConfirmationMessage("Error delivered ticket. Please try again.");
                setShowConfirmationModal(true);
            } finally {
                setIsSubmitting(false);
            }
        }, 3000);
    };

    const handleBack = () => {
        router.push("/dashboard/requestassetkeluar");
    }

    if (loading) return <div className="text-center mt-10">Loading...</div>;
    if (error) return <div className="text-center text-red-500 mt-10">{error}</div>;

    return (
        <div className="w-full max-h-full px-8 py-24 text-[#202B51]">
            <Upper title="Request Asset Keluar" />
            <div className="mt-5">
                <h2 className="text-xl font-bold text-[#202B51]">{ticket?.ticketNumber}</h2>
                <p><strong>ID:</strong> {ticket?.ticketNumber}</p>
            </div>

            <div className="mt-5">
                <DataTable columns={columns} data={assets} />
            </div>

            <div className="mt-5 flex justify-between">
                <button
                    className="bg-[#202B51] px-4 py-2 text-white rounded-md hover:bg-opacity-90"
                    onClick={handleBack}
                >
                    &lt; Back
                </button>

                <button
                    className="px-4 py-2 bg-[#202B51] text-white rounded-md hover:bg-opacity-90"
                    onClick={() => setIsAcceptModalOpen(true)}
                >
                    Deliver Ticket
                </button>
            </div>

            {isAcceptModalOpen && (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-75 z-10">
                    <div className="bg-white p-6 rounded-md shadow-lg w-[30rem]">
                        <h2 className="text-xl font-bold mb-4 text-[#202B51]">Confirm Ticket</h2>
                        <p className="text-gray-700">Are you sure you want to confirm this ticket?</p>

                        <div className="mt-4 flex justify-between">
                            <button
                                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                                onClick={() => setIsAcceptModalOpen(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                                onClick={handleAccept}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Submitting..." : "Confirm"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirmation Modal */}
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
                                    router.push("/dashboard/requestinbound");
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

export default DetailRequestAssetKeluar;
