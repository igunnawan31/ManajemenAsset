"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Upper from "../../../components/Upper";
import PopUpModal from "../../../components/PopUpModal";
import { IoCheckmarkCircleSharp, IoCloseCircleSharp } from "react-icons/io5";

interface Kota {
    kotaId: number;
    kotaName: string;
}

interface Kecamatan {
    kecamatanId: number;
    kecamatanName: string;
    kotaId: number;
}

interface Branch {
    branchId: string;
    branchName: string;
    branchEmail: string;
    branchPhone: string;
    branchLocation: string;
    kotaId: number;
    kecamatanId: number;
    parentId: number | null;
}

const EditBranchPage = () => {
    const { id } = useParams();
    const router = useRouter();
    const [branch, setBranch] = useState<Branch | null>(null);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [kotas, setKotas] = useState<Kota[]>([]);
    const [kecamatans, setKecamatans] = useState<Kecamatan[]>([]);
    const [filteredKecamatans, setFilteredKecamatans] = useState<Kecamatan[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [modalType, setModalType] = useState<"success" | "error" | null>(null);
    const [modalMessage, setModalMessage] = useState<string>("");

    useEffect(() => {
        if (!id) {
            setError("Branch ID is missing.");
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            try {
                const [branchRes, branchesRes, kotasRes, kecamatansRes] = await Promise.all([
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/branch/by-id/${id}`),
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/branch/index`),
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/kota/index`),
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/kecamatan/index`)
                ]);

                if (!branchRes.ok) throw new Error("Branch not found");
                
                const branchData = await branchRes.json();
                const branchesData = await branchesRes.json();
                const kotasData = await kotasRes.json();
                const kecamatansData = await kecamatansRes.json();

                const filteredBranches = branchesData.filter((b: Branch) => b.branchId !== id);

                setBranch(branchData);
                setBranches(filteredBranches);
                setKotas(kotasData);
                setKecamatans(kecamatansData);
                
                if (branchData.kotaId) {
                    const filtered = kecamatansData.filter((k: Kecamatan) => k.kotaId === branchData.kotaId);
                    setFilteredKecamatans(filtered);
                }

                setLoading(false);
            } catch (err) {
                console.error(err);
                setError("Failed to fetch data");
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleKotaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const kotaId = Number(e.target.value);
        const filtered = kecamatans.filter(k => k.kotaId === kotaId);
        const selectedKota = kotas.find(k => k.kotaId === kotaId);
        
        setFilteredKecamatans(filtered);
        setBranch(prev => prev ? { 
          ...prev, 
          kotaId,
          kecamatanId: 0,
          branchLocation: selectedKota ? `${prev.branchLocation.split(',')[0]}, ${selectedKota.kotaName}` : prev.branchLocation
        } : null);
      };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        
        setBranch(prev => {
            if (!prev) return null;
            
            const newValue = name === "kecamatanId" || name === "kotaId" || name === "parentId" 
                ? value === "" ? null : Number(value)
                : value;
            
            return {
                ...prev,
                [name]: newValue
            };
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
      
        if (!branch) {
            setError("Branch data is missing");
            setLoading(false);
            return;
        }
      
        // Enhanced client-side validation
        if (
            !branch.branchName?.trim() || 
            !branch.branchEmail?.trim() || 
            !branch.branchPhone?.trim() ||
            !branch.kotaId ||
            !branch.kecamatanId
        ) {
            setModalType("error");
            setModalMessage("Please fill all required fields");
            setLoading(false);
            return;
        }
      
        try {
            const selectedKota = kotas.find(k => k.kotaId === branch.kotaId);
            const selectedKecamatan = kecamatans.find(k => k.kecamatanId === branch.kecamatanId);
        
            if (!selectedKota || !selectedKecamatan) {
                throw new Error("Selected location data not found");
            }
        
            // Construct payload with proper types and validation
            const payload = {
                branchId: Number(branch.branchId),
                branchName: branch.branchName.trim(),
                branchEmail: branch.branchEmail.trim(),
                branchPhone: branch.branchPhone.trim(),
                kotaId: branch.kotaId,
                kecamatanId: branch.kecamatanId,
                branchLocation: `${selectedKecamatan.kecamatanName}, ${selectedKota.kotaName}`,
                parentId: branch.parentId === null ? null : Number(branch.parentId)
            };
      
            console.log("Submitting payload:", payload);
            
            const response = await fetch("http://localhost:5199/api/branch/update", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const contentType = response.headers.get("content-type");

            if (!response.ok) {
                let message = "Update failed";

                if (contentType?.includes("application/json")) {
                    const data = await response.json();
                    message = data.message || message;
                } else {
                    const text = await response.text();
                    message = text || message;
                }

                throw new Error(message);
            }

            setModalType("success");
            setModalMessage("Branch updated successfully!");
        } catch (err: any) {
            console.error("Update error:", err);
            setModalType("error");
            setModalMessage(err.message || "Error updating branch. Please check all fields.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center mt-10">Loading...</div>;
    if (error || !branch) return <div className="text-center text-red-500 mt-10">{error}</div>;

    return (
        <div className="px-8 py-24 w-full max-h-full">
            <Upper title="Edit branch" />
            <form onSubmit={handleSubmit} className="mt-5 bg-white p-6 rounded-lg shadow-lg space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Branch ID</label>
                    <input
                        type="text"
                        name="branchId"
                        value={branch.branchId}
                        readOnly
                        className="mt-1 p-2 border border-[#202BA5] w-full rounded-md bg-slate-300"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Branch Name</label>
                    <input
                        type="text"
                        name="branchName"
                        value={branch.branchName}
                        onChange={handleChange}
                        className="mt-1 p-2 border border-[#202BA5] w-full rounded-md"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Branch Email</label>
                    <input
                        type="email"
                        name="branchEmail"
                        value={branch.branchEmail}
                        onChange={handleChange}
                        className="mt-1 p-2 border border-[#202BA5] w-full rounded-md"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Branch Phone</label>
                    <input
                        type="text"
                        name="branchPhone"
                        value={branch.branchPhone}
                        onChange={handleChange}
                        className="mt-1 p-2 border border-[#202BA5] w-full rounded-md"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Kota</label>
                    <select
                        name="kotaId"
                        value={branch.kotaId}
                        onChange={handleKotaChange}
                        className="mt-1 p-2 border border-[#202BA5] w-full rounded-md"
                        required
                    >
                        <option value="">-- Select Kota --</option>
                        {kotas.map(kota => (
                            <option key={kota.kotaId} value={kota.kotaId}>
                                {kota.kotaName}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Kecamatan</label>
                    <select
                        name="kecamatanId"
                        value={branch.kecamatanId}
                        onChange={handleChange}
                        className="mt-1 p-2 border border-[#202BA5] w-full rounded-md"
                        required
                        disabled={!branch.kotaId}
                    >
                        <option value="">-- Select Kecamatan --</option>
                        {filteredKecamatans.map(kecamatan => (
                            <option key={kecamatan.kecamatanId} value={kecamatan.kecamatanId}>
                                {kecamatan.kecamatanName}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Parent Branch</label>
                    <select
                        name="parentId"
                        value={branch.parentId ?? ""}
                        onChange={(e) => setBranch(prev => prev ? {
                            ...prev,
                            parentId: e.target.value === "" ? null : Number(e.target.value)
                        } : null)}
                        className="mt-1 p-2 border border-[#202BA5] w-full rounded-md"
                    >
                        <option value="">-- No Parent --</option>
                        {branches.map(branch => (
                            <option key={branch.branchId} value={branch.branchId}>
                                {branch.branchName}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex justify-between mt-6">
                    <button
                        type="submit"
                        className="bg-[#202B51] text-white px-4 py-2 rounded-lg hover:bg-[#1a2344]"
                        disabled={loading}
                    >
                        {loading ? "Saving..." : "Save Changes"}
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
                        <button
                            onClick={() => router.push("/dashboard/branchmanagement")}
                            className="bg-[#202B51] text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                        >
                            Go to Branch Management
                        </button>
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

export default EditBranchPage;