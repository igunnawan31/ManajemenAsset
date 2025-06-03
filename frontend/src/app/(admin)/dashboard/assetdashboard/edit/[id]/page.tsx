"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Upper from "../../../components/Upper";
import PopUpModal from "../../../components/PopUpModal";
import { IoCheckmarkCircleSharp, IoCloseCircleSharp } from "react-icons/io5";

interface Asset {
    id: string;
    name: string;
    locationId: string;
    assetType: string;
    itemStatus: string;
}


interface Branch {
    branchId: string;
    branchName: string;
}

const EditAssetPage = () => {
    const { id } = useParams();
    const router = useRouter();
    const [asset, setAsset] = useState<Asset | null>(null);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [modalType, setModalType] = useState<"success" | "error" | null>(null);
    const [modalMessage, setModalMessage] = useState<string>("");
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        if (!id) {
            setError("Asset ID is missing.");
            setLoading(false);
            return;
        }

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/asset/by-id/${id}`)
            .then((res) => {
                if (!res.ok) throw new Error("Asset not found");
                return res.json();
            })
            .then((data) => {
                setAsset(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setError("Failed to fetch asset");
                setLoading(false);
            });

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/branch/index`)
            .then((res) => res.json())
            .then((data) => setBranches(data))
            .catch((err) => console.error("Error fetching branches:", err));
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setAsset((prevAsset) => {
            if (!prevAsset) return prevAsset;
            return { ...prevAsset, [name]: value };
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);
    
        if (!asset) {
            setError("Asset data is missing");
            setLoading(false);
            return;
        }
    
        try {
            const formData = new FormData();
            formData.append("id", asset.id);
            formData.append("name", asset.name);
            formData.append("locationId", asset.locationId);
            formData.append("assetType", asset.assetType);
            formData.append("itemStatus", asset.itemStatus);
    
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/asset/update`, {
                method: "PUT",
                body: formData,
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to update asset");
            }
    
            setModalType("success");
            setModalMessage("Asset updated successfully!");
            setSuccess(null);
            return;
        } catch (err: any) {
            setModalType("error");
            setModalMessage(err.message || "Error Updating Asset");
        } finally {
            setLoading(false);
        }
    };

    const getBranchName = (locationId: string) => {
        const branch = branches.find(b => b.branchId === locationId);
        return branch ? branch.branchName : "Unknown Branch";
    };
    

    if (loading) return <div className="text-center mt-10">Loading...</div>;
    if (error || !asset) return <div className="text-center text-red-500 mt-10">{error}</div>;

    return (
        <div className="px-8 py-24 w-full max-h-full">
            <Upper title="Edit Asset" />
            <form onSubmit={handleSubmit} className="mt-5 bg-white p-6 rounded-lg shadow-lg space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Asset ID</label>
                    <input
                        type="text"
                        name="id"
                        value={asset.id}
                        readOnly
                        className="mt-1 p-2 border border-[#202BA5] w-full rounded-md bg-slate-300"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Nama Asset</label>
                    <input
                        type="text"
                        name="name"
                        value={asset.name}
                        readOnly
                        className="mt-1 p-2 border border-[#202BA5] w-full rounded-md bg-slate-300"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Lokasi Aset</label>
                    <input 
                        type="text"
                        name="name"
                        value={getBranchName(asset.locationId || "")}
                        readOnly
                        className="mt-1 p-2 border border-[#202BA5] w-full rounded-md bg-slate-300"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Tipe Aset</label>
                    <input 
                        type="text"
                        name="name"
                        value={asset.assetType}
                        readOnly
                        className="mt-1 p-2 border border-[#202BA5] w-full rounded-md bg-slate-300"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Status Aset</label>
                    <select
                        name="itemStatus"
                        value={asset.itemStatus}
                        onChange={handleChange}
                        className="mt-1 p-2 border border-[#202BA5] w-full rounded-md"
                    >
                        <option value="">-- Select Item Status --</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </div>

                <div className="flex justify-between mt-6">
                    <button
                        type="submit"
                        className="bg-[#202B51] text-white px-4 py-2 rounded-lg hover:bg-[#1a2344]"
                    >
                        Save Changes
                    </button>
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="bg-gray-300 text-black px-4 py-2 rounded-lg hover:bg-gray-400"
                    >
                        Cancel
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
                            onClick={() => router.push("/dashboard/assetdashboard")}
                            className="bg-[#202B51] text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                        >
                            Go to Asset Management
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
    );
};

export default EditAssetPage;
