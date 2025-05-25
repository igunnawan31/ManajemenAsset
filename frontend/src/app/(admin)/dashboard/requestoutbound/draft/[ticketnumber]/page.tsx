"use client";

import { useState, useEffect } from "react";
import Upper from "../../../components/Upper";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import PopUpModal from "../../../components/PopUpModal";
import { IoCheckmarkCircleSharp, IoCloseCircleSharp } from "react-icons/io5";
import AssetSelector from "../../../components/AssetSelector";

interface Ticket {
    ticketNumber: string,
    branchOrigin: number,
    branchDestination: number,
    outboundDate: string,
    inboundDate: string,
    dateRequested: string,
    approvalStatus: string,
    moveStatus: string,
    requestedBy: number,
    receivedBy: number,
    rejectReason: string,
    rejectClassification: string,
    requestReason: string
}

interface Branch {
    branchId: number;
    branchName: string;
}

interface Asset {
    id: string;
    name: string;
    locationId: string;
    branchName: string;
    assetType: string;
    itemStatus: string;
}

interface AssetMove {
    id: string;
    ticketNumber: string;
    assetNumber: string;
    moveStatus: string;
    asset?: Asset;
}

const DraftUpdateRequestOutbound = () => {
    const { ticketnumber } = useParams();
    const [users, setUsers] = useState<any>(null);
    const [branches, setBranches] = useState<Branch[]>([]);
    const router = useRouter();
    const [ticket, setTicket] = useState<Ticket | null>(null);
    const [branch, setBranch] = useState<Branch[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [modalType, setModalType] = useState<"success" | "error" | null>(null);
    const [modalMessage, setModalMessage] = useState<string>("");
    const [success, setSuccess] = useState<string | null>(null);
    const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
    const [assets, setAssets] = useState<Asset[]>([]);
    const [confirmedAssets, setConfirmedAssets] = useState<Asset[]>([]);
    const [assetMoves, setAssetMoves] = useState<AssetMove[]>([]);

    useEffect(() => {
        const fetchUserData = async () => {
            const userId = localStorage.getItem("userId");
            if (!userId) {
                setError("No user ID found. Please log in.");
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/by-id/${userId}`);
                if (!response.ok) throw new Error("Failed to fetch user data");

                const data = await response.json();
                console.log("User data from API:", data);
                setUsers(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "An unknown error occurred");
            } finally {
                setLoading(false);
            }
        };

        const fetchBranches = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/branch/index`);
                if (!response.ok) throw new Error("Failed to fetch branches");

                const data = await response.json();
                setBranches(data);
            } catch (err) {
                console.error("Error fetching branches:", err);
            }
        };

        fetchUserData();
        fetchBranches();
    }, []);

    useEffect(() => {
        if (!ticketnumber) {
            setError("Ticket Number is Missing");
            setLoading(false);
            return;
        }

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/ticket/by-id/${ticketnumber}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Ticket Not Found");
                }
                return response.json();
            })
            .then((data) => {
                if(!data) { 
                    throw new Error("Ticket Not Found");
                }
                setTicket(data);
            })
            .catch((error) => {
                setError("Ticket Not Found");
                setLoading(false);
            });
        
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/branch/index`)
            .then((response) => response.json())
            .then((data) => setBranch(data))
            .catch((err) => console.error("Error fetching branches:", err));

        const fetchAssetMoves = async () => {
            try {
                const movesResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/asset-move/by-TN/${ticketnumber}`);
                if (!movesResponse.ok) throw new Error("Failed to fetch asset moves");
                
                const moves: AssetMove[] = await movesResponse.json();
                setAssetMoves(moves);
                
                const assetsWithDetails = await Promise.all(
                    moves.map(async (move) => {
                        try {
                            const assetResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/asset/by-id/${move.assetNumber}`);
                            if (!assetResponse.ok) return null;
                            const assetData = await assetResponse.json();
                            return { ...move, asset: assetData };
                        } catch (error) {
                            console.error(`Failed to fetch asset ${move.assetNumber}:`, error);
                            return null;
                        }
                    })
                );

                const validAssets = assetsWithDetails
                    .filter(move => move !== null && move.asset !== null)
                    .map(move => move!.asset);
                
                setConfirmedAssets(validAssets);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching asset moves:", error);
                setLoading(false);
            }
        };

        if (ticketnumber) {
            fetchAssetMoves();
        }
    }, [ticketnumber]);

    useEffect(() => {
        if (!users?.userBranch || !branches.length) return;
    
        const fetchAvailableAssets = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/asset/available/${users.userBranch}`);
                if (!response.ok) throw new Error(`Failed to fetch available assets`);
    
                const data: Asset[] = await response.json();
                
                const availableAssets = data.filter(asset => 
                    !confirmedAssets.some(a => a.id === asset.id)
                );
                
                setAssets(availableAssets);
            } catch (err) {
                console.error("Error fetching available assets:", err);
            }
        };
    
        fetchAvailableAssets();
    }, [users?.userBranch, branches, confirmedAssets]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setTicket((prevTicket) => {
            if (!prevTicket) return prevTicket;
            return { ...prevTicket, [name]: value };
        });
    }

    const handleConfirmSelection = (newSelectedAssets: Asset[]) => {
        const updatedAssets = [...confirmedAssets, ...newSelectedAssets];
        
        const uniqueAssets = updatedAssets.filter(
            (asset, index, self) => index === self.findIndex(a => a.id === asset.id)
        );
        
        setConfirmedAssets(uniqueAssets);
        setIsPopupOpen(false);
    };

    const handleRemoveAsset = (assetId: string) => {
        setConfirmedAssets(prev => prev.filter(asset => asset.id !== assetId));
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        if (!ticket) {
            setError("Ticket data is missing");
            setLoading(false);
            return;
        }

        try {
            const payload = {
                ticketNumber: ticket.ticketNumber,
                branchOrigin: ticket.branchOrigin,
                branchDestination: ticket.branchDestination,
                requestedBy: ticket.requestedBy,
                receivedBy: ticket.receivedBy,
                assetNumbers: confirmedAssets.map(asset => asset.id),
            };

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ticket/publish`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            console.log("Response status:", response.status);
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error("Error details:", errorData);
                throw new Error(errorData.message || "Failed to update ticket");
            }

            const result = await response.json();
            setModalType("success");
            setModalMessage(result.message || "Ticket and assets updated successfully!");
        } catch (err: any) {
            console.error("Submission error:", err);
            setModalType("error");
            setModalMessage(err.message || "Error updating ticket and assets");
        } finally {
            setLoading(false);
        }
    };

    const getBranchName = (branchId: number): string => {
        const match = branch.find((b) => b.branchId === branchId);
        return match ? match.branchName : `Branch ID: ${branchId}`;
    };

    if (loading) return <div className="text-center mt-10">Loading...</div>;
    if (error || !ticket) return <div className="text-center text-red-500 mt-10">{error}</div>;
    

    return (
        <div className="px-8 py-24 w-full max-h-full poppins mb-24">
            <Upper title="Edit Detail Request Outbound" />
            <form onSubmit={handleSubmit} className="mt-5 bg-white p-6 rounded-lg shadow-md space-y-4">
                <div className="mt-5">
                    Detail Ticket
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Ticket Number</label>
                    <input
                        type="text"
                        defaultValue={ticket?.ticketNumber}
                        className="mt-1 p-2 border border-[#202BA5] w-full rounded-md focus:ring-2 focus:ring-[#202BA5] bg-gray-200"
                        disabled
                        readOnly
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Branch Origin</label>
                    <input
                        type="text"
                        name="branchOrigin"
                        defaultValue={getBranchName(ticket!.branchOrigin)}
                        className="mt-1 p-2 border border-[#202BA5] w-full rounded-md focus:ring-2 focus:ring-[#202BA5] bg-gray-200"
                        disabled
                        readOnly
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Branch Destination
                    </label>
                    <select
                        name="branchDestination"
                        value={ticket.branchDestination}
                        onChange={handleChange}
                        className="mt-1 p-2 border border-[#202BA5] w-full rounded-md"
                    >
                        {branch.map((b) => (
                            <option key={b.branchId} value={b.branchId}>
                                {b.branchName}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Select Assets</label>
                    <button
                        type="button"
                        onClick={() => setIsPopupOpen(true)}
                        className="bg-[#20458A] text-white px-4 py-[0.6rem] rounded-lg hover:bg-blue-700 transition w-full mt-1"
                    >
                        {confirmedAssets.length > 0 ? "Add More Assets" : "Select Assets"}
                    </button>
                    {confirmedAssets.length > 0 && (
                        <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                            <h3 className="font-semibold mb-2">Assets to Move ({confirmedAssets.length})</h3>
                            <div className="space-y-2 max-h-60 overflow-y-auto">
                                {confirmedAssets.map((asset) => (
                                    <div key={asset.id} className="flex justify-between items-center p-3 bg-white rounded-lg border">
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium truncate">ID: {asset.id}</p>
                                            <p className="text-sm text-gray-600 truncate">Name: {asset.name}</p>
                                            <p className="text-sm text-gray-600">Type: {asset.assetType}</p>
                                            <p className="text-sm text-gray-600">Status: {asset.itemStatus}</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveAsset(asset.id)}
                                            className="ml-4 text-red-500 hover:text-red-700 text-sm font-medium p-1"
                                            title="Remove asset"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <AssetSelector 
                    isOpen={isPopupOpen}
                    onClose={() => setIsPopupOpen(false)}
                    onConfirm={handleConfirmSelection}
                    assets={assets}
                />
                <div className="mt-5">
                    Status
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Outbound Date / Tanggal Pengiriman
                    </label>
                    <input
                        type="date"
                        name="outboundDate"
                        defaultValue={ticket.outboundDate}
                        className="mt-1 p-2 border border-[#202BA5] w-full rounded-md bg-gray-200"
                        disabled
                        readOnly
                    />
                    </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Inbound Date / Tanggal Penerimaan
                    </label>
                    <input
                        type="date"
                        name="inboundDate"
                        defaultValue={ticket.inboundDate}
                        className="mt-1 p-2 border border-[#202BA5] w-full rounded-md bg-gray-200"
                        disabled
                        readOnly
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Approval Status
                    </label>
                    <input
                        name="approvalStatus"
                        value={ticket.approvalStatus}
                        className="mt-1 p-2 border border-[#202BA5] w-full rounded-md bg-gray-200"
                        disabled
                        readOnly
                    >
                    </input>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Move Status
                    </label>
                    <input
                        type="text"
                        name="moveStatus"
                        value={ticket.moveStatus}
                        className="mt-1 p-2 border border-[#202BA5] w-full rounded-md bg-gray-200"
                        disabled
                        readOnly
                    />
                </div>
                
                <div className="flex justify-end mt-6">
                    <button
                        type="submit"
                        className="bg-[#20458A] text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                        disabled={loading}
                    >
                        {loading ? "Updating..." : "Update Request"}
                    </button>
                </div>
            </form>
            {modalType === "success" && (
                <PopUpModal
                    title="Success"
                    message={modalMessage}
                    icon={<IoCheckmarkCircleSharp className="text-green-500" />}
                    actions={
                    <>
                        <button
                            onClick={() => router.push("/dashboard/requestoutbound")}
                            className="bg-[#202B51] text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                        >
                            Go to Request Outbound
                        </button>
                    </>
                    }
                />
            )}

            {modalType === "error" && (
                <PopUpModal
                    title="Error"
                    message={modalMessage}
                    icon={<IoCloseCircleSharp className="text-red-500" />}
                    actions={
                    <button
                        onClick={() => setModalType(null)}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                        Close
                    </button>
                    }
                />
            )}
        </div>
    )
}

export default DraftUpdateRequestOutbound;