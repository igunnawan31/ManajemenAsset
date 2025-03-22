"use client";

import { useState, useEffect } from "react";
import Upper from "../../components/Upper";
import AssetSelector from "../../components/AssetSelector";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";


interface Asset {
    id: string;
    name: string;
    locationId: string;
    branchName: string;
    assetType: string;
    itemStatus: string;
}

interface Branch {
    branchId: string;
    branchName: string;
}

type UserResponseDTO = {
    userId: string;
    userName: string;
    userEmail: string;
    userBranch: string;
    userPhone: string;
    userRole: string;
    userSubRole: string;
};

const CreateRequestInbound = () => {
    const [users, setUsers] = useState<UserResponseDTO | null>(null);
    const [assets, setAssets] = useState<Asset[]>([]);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [confirmedAssets, setConfirmedAssets] = useState<Asset[]>([]);
    const [selectedBranch, setSelectedBranch] = useState<string>("");
    const [requestDate, setRequestDate] = useState<string>(new Date().toISOString().split("T")[0]);
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const ticketSchema = z.object({
        branchOrigin: z.string().min(1, "Branch origin is required"),
        branchDestination: z.string().min(1, "Branch destination is required"),
        dateRequested: z.string().min(1, "Request date is required"),
        approvalStatus: z.string().min(1, "Approval status is required"),
        moveStatus: z.string().min(1, "Move status is required"),
        assetNumbers: z.array(z.string()).min(1, "At least one asset is required"),
    });

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

    const getBranchName = (branchId: string) => {
        const branch = branches.find(b => b.branchId === branchId);
        return branch ? branch.branchName : "Unknown Branch";
    };

    useEffect(() => {
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

        fetchBranches();
    }, []);

    useEffect(() => {
        const fetchAssets = async () => {
            if (!selectedBranch) return;
    
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/asset/by-branch/${selectedBranch}`);
                if (!response.ok) throw new Error("Failed to fetch assets");
    
                const data = await response.json();
                setAssets(data);
            } catch (err) {
                console.error("Error fetching assets:", err);
            }
        };
    
        fetchAssets();
    }, [selectedBranch]);

    const handleConfirmSelection = (selectedAssets: Asset[]) => {
        setConfirmedAssets(selectedAssets);
    };

    const handleRemoveAsset = (assetId: string) => {
        setConfirmedAssets((prev) => prev.filter(asset => asset.id !== assetId));
    };

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(ticketSchema),
    });

    const onSubmit = async (data: any, status: string) => {
        console.log("Form data:", data); // Debugging line
        console.log("Status:", status); // Debugging line
        setError(null);
        setSuccess(null);
    
        const payload = {
            branchOrigin: parseInt(data.branchOrigin, 10), // Convert to int
            branchDestination: parseInt(data.branchDestination, 10), // Convert to int
            dateRequested: data.dateRequested, // Ensure this is in the correct format
            approvalStatus: status,
            moveStatus: "Not_Started", // Default value
            assetNumbers: confirmedAssets.map(asset => asset.id), // Map to asset IDs
        };
    
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ticket/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });
    
            const result = await response.json();
    
            if (!response.ok) {
                throw new Error(result.message || "Failed to create ticket");
            }
            console.log("Confirmed assets:", confirmedAssets);
            setSuccess("Ticket created successfully!");
        } catch (err: any) {
            setError(err.message || "An error occurred.");
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    
    return (
        <div className="px-8 py-24 w-full max-h-full poppins">
            <Upper title="Create Request Inbound" />

            <div className="mt-5 bg-white p-6 rounded-lg shadow-md">
                <form className="mt-5 space-y-4">

                    {/* Request Ticket */}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Branch Origin</label>
                            <select
                                className="mt-1 p-2 border border-[#202BA5] w-full rounded-md"
                                value={selectedBranch}
                                {...register("branchOrigin")}
                                onChange={(e) => setSelectedBranch(e.target.value)}
                            >
                                <option value="">Select Branch</option>
                                {branches.map((branch) => (
                                    <option key={branch.branchId} value={branch.branchId}>
                                        {branch.branchName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Branch Destination</label>
                            <input 
                                type="text"
                                defaultValue={getBranchName(users?.userBranch || "")}
                                {...register("branchDestination")}
                                className="mt-1 p-2 border border-[#202BA5] w-full rounded-md bg-gray-500 opacity-80"
                                readOnly
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Request Date</label>
                            <input
                                type="date"
                                {...register("requestDate")}
                                className="mt-1 p-2 border border-[#202BA5] w-full rounded-md bg-gray-500 opacity-80"
                                defaultValue={new Date().toISOString().split("T")[0]}
                                readOnly
                            />
                            {errors.assetName?.message && <p className="text-red-500 text-xs mt-2">{String(errors.assetName.message)}</p>}
                        </div>
                        <div>
                            <label className="hidden text-sm font-medium text-gray-700">Approval Status</label>
                            <input
                                type="date"
                                {...register("approvalStatus")}
                                className=" hidden mt-1 p-2 border border-[#202BA5] w-full rounded-md bg-gray-500 opacity-80"
                                defaultValue={""}
                                readOnly
                            />
                            {errors.assetName?.message && <p className="text-red-500 text-xs mt-2">{String(errors.assetName.message)}</p>}
                        </div>
                        <div>
                            <label className="hidden text-sm font-medium text-gray-700">Move Status</label>
                            <input
                                type="date"
                                {...register("moveStatus")}
                                className=" hidden mt-1 p-2 border border-[#202BA5] w-full rounded-md bg-gray-500 opacity-80"
                                defaultValue={"Not_Started"}
                                readOnly
                            />
                            {errors.assetName?.message && <p className="text-red-500 text-xs mt-2">{String(errors.assetName.message)}</p>}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Select Assets</label>
                        <button
                            type="button"
                            onClick={() => setIsPopupOpen(true)}
                            className="bg-[#20458A] text-white px-4 py-[0.6rem] rounded-lg hover:bg-blue-700 transition w-full mt-1"
                        >
                            Select Assets
                        </button>
                        {confirmedAssets.length > 0 && (
                            <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                                <h3 className="font-semibold">Confirmed Assets</h3>
                                {confirmedAssets.map((asset) => (
                                    <div key={asset.id} className="flex justify-between items-center">
                                        <p>{asset.name}</p>
                                        <button
                                            onClick={() => handleRemoveAsset(asset.id)}
                                            className="text-red-500 hover:underline"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="mt-4 flex gap-4">
                        <button
                            type="button" // Use "button" to prevent default form submission
                            onClick={handleSubmit((data) => onSubmit(data, "Pending"))} // Correct usage
                            className="px-6 py-2 bg-[#20458A] text-white rounded-md hover:bg-blue-800 transition"
                        >
                            Submit
                        </button>
                        <button
                            type="button" // Use "button" to prevent default form submission
                            onClick={handleSubmit((data) => onSubmit(data, "Draft"))} // Correct usage
                            className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-700 transition"
                        >
                            Draft
                        </button>
                    </div>
                </form>
                {error && <p className="text-red-500 mt-4">{error}</p>}
                {success && <p className="text-green-500 mt-4">{success}</p>}
            </div>
            <AssetSelector
                isOpen={isPopupOpen}
                onClose={() => setIsPopupOpen(false)}
                onConfirm={handleConfirmSelection}
                assets={assets}
            />
        </div>
    );
};

export default CreateRequestInbound;