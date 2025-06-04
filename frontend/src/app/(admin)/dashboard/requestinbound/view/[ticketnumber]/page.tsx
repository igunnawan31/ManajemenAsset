"use client";

import { useState, useEffect } from "react";
import Upper from "../../../components/Upper";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";

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

const ViewRequestInbound = () => {
    const { ticketnumber } = useParams();
    const [users, setUsers] = useState<any>(null);
    const [branches, setBranches] = useState<Branch[]>([]);
    const router = useRouter();
    const [ticket, setTicket] = useState<Ticket | null>(null);
    const [branch, setBranch] = useState<Branch[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
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

    const getBranchName = (branchId: number): string => {
        const match = branch.find((b) => b.branchId === branchId);
        return match ? match.branchName : `Branch ID: ${branchId}`;
    };

    if (loading) return <p> loading... </p>;
    if (error) return <p>{error}</p>
    

    return (
        <div className="px-8 py-24 w-full max-h-full ">
            <Upper title="View Detail Request Inbound" />
            <form className="mt-5 bg-white p-6 rounded-lg shadow-md space-y-4">
                <div className="">
                    Detail Ticket
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Ticket Number</label>
                    <input
                        type="text"
                        defaultValue={ticket?.ticketNumber}
                        className="mt-1 p-2 border border-[#202BA5] w-full rounded-md focus:ring-2 focus:ring-[#202BA5]"
                        disabled
                        readOnly
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Branch Origin</label>
                    <input
                        type="text"
                        defaultValue={getBranchName(ticket!.branchOrigin)}
                        className="mt-1 p-2 border border-[#202BA5] w-full rounded-md focus:ring-2 focus:ring-[#202BA5]"
                        disabled
                        readOnly
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Branch Destination</label>
                    <input
                        type="text"
                        defaultValue={getBranchName(ticket!.branchDestination)}
                        className="mt-1 p-2 border border-[#202BA5] w-full rounded-md focus:ring-2 focus:ring-[#202BA5]"
                        disabled
                        readOnly
                    />
                </div>
                <div>
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
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <div className="mt-5">
                    Status
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Outbound Date</label>
                    <input
                        type="date"
                        defaultValue={ticket?.outboundDate}
                        className="mt-1 p-2 border border-[#202BA5] w-full rounded-md focus:ring-2 focus:ring-[#202BA5]"
                        disabled
                        readOnly
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Inbound Date</label>
                    <input
                        type="date"
                        defaultValue={ticket?.inboundDate}
                        className="mt-1 p-2 border border-[#202BA5] w-full rounded-md focus:ring-2 focus:ring-[#202BA5]"
                        disabled
                        readOnly
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Date Requested</label>
                    <input
                        type="date"
                        defaultValue={ticket?.dateRequested}
                        className="mt-1 p-2 border border-[#202BA5] w-full rounded-md focus:ring-2 focus:ring-[#202BA5]"
                        disabled
                        readOnly
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Approval Status</label>
                    <input
                        type="text"
                        defaultValue={ticket?.approvalStatus}
                        className="mt-1 p-2 border border-[#202BA5] w-full rounded-md focus:ring-2 focus:ring-[#202BA5]"
                        disabled
                        readOnly
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Move Status</label>
                    <input
                        type="text"
                        defaultValue={ticket?.moveStatus}
                        className="mt-1 p-2 border border-[#202BA5] w-full rounded-md focus:ring-2 focus:ring-[#202BA5]"
                        disabled
                        readOnly
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Requested By</label>
                    <input
                        type="text"
                        defaultValue={getBranchName(ticket!.requestedBy)}
                        className="mt-1 p-2 border border-[#202BA5] w-full rounded-md focus:ring-2 focus:ring-[#202BA5]"
                        disabled
                        readOnly
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Received By</label>
                    <input
                        type="text"
                        defaultValue={getBranchName(ticket!.receivedBy)}
                        className="mt-1 p-2 border border-[#202BA5] w-full rounded-md focus:ring-2 focus:ring-[#202BA5]"
                        disabled
                        readOnly
                    />
                </div>
            </form>
        </div>
    )
}

export default ViewRequestInbound;