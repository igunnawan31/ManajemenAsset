"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Upper from "../../../components/Upper";

interface Branch {
    branchId: string;
    branchName: string;
    branchPhone: string;
    branchEmail: string;
    branchLocation: string;
    kotaId: number;
    kecamatanId: number;
}

interface Kecamatan {
    kecamatanId: number;
    kecamatanName: string;
    kotaId: number; 
}

interface Kota {
    kotaId: number;  
    kotaName: string;
}

const BranchView = () => {
    const { id } = useParams();
    const router = useRouter();
    const [branch, setBranch] = useState<Branch | null>(null);
    const [kotaName, setKotaName] = useState<string>("Loading...");
    const [kecamatanName, setKecamatanName] = useState<string>("Loading...");
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            try {
                const branchResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/branch/by-id/${id}`);
                if (!branchResponse.ok) throw new Error("Branch not found");
                const branchData = await branchResponse.json();

                const processedBranch = {
                    ...branchData,
                    kotaId: Number(branchData.kotaId),
                    kecamatanId: Number(branchData.kecamatanId)
                };
                setBranch(processedBranch);

                const [kotaResponse, kecamatanResponse] = await Promise.all([
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/kota/index`),
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/kecamatan/index`)
                ]);

                const kotaData = await kotaResponse.json();
                const kecamatanData = await kecamatanResponse.json();

                const matchedKota = kotaData.find((kota: Kota) => kota.kotaId === processedBranch.kotaId);
                setKotaName(matchedKota ? matchedKota.kotaName : "Not found");

                const matchedKecamatan = kecamatanData.find(
                    (kecamatan: Kecamatan) => kecamatan.kecamatanId === processedBranch.kecamatanId
                );
                setKecamatanName(matchedKecamatan ? matchedKecamatan.kecamatanName : "Not found");

                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setError("Failed to load branch details.");
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) return <div className="text-center mt-10">Loading...</div>;
    if (error) return <div className="text-center text-red-500 mt-10">{error}</div>;
    if (!branch) return <div className="text-center mt-10">Branch not found</div>;

    return (
        <div className="px-8 py-24 w-full max-h-full">
            <Upper title="View Branch Details" />
            <div className="mt-5 bg-white p-6 rounded-lg shadow-lg space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">ID Branch</label>
                    <input
                        type="text"
                        defaultValue={branch.branchId}
                        className="mt-1 p-2 border border-[#202BA5] w-full rounded-md focus:ring-2 focus:ring-[#202BA5]"
                        disabled
                        readOnly
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Branch Name</label>
                    <input
                        type="text"
                        defaultValue={branch.branchName}
                        className="mt-1 p-2 border border-[#202BA5] w-full rounded-md focus:ring-2 focus:ring-[#202BA5]"
                        disabled
                        readOnly
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Email Branch</label>
                    <input
                        type="text"
                        defaultValue={branch.branchEmail}
                        className="mt-1 p-2 border border-[#202BA5] w-full rounded-md focus:ring-2 focus:ring-[#202BA5]"
                        disabled
                        readOnly
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Phone Branch</label>
                    <input
                        type="text"
                        defaultValue={branch.branchPhone}
                        className="mt-1 p-2 border border-[#202BA5] w-full rounded-md focus:ring-2 focus:ring-[#202BA5]"
                        disabled
                        readOnly
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Kota</label>
                    <input
                        type="text"
                        defaultValue={kotaName}
                        className="mt-1 p-2 border border-[#202BA5] w-full rounded-md focus:ring-2 focus:ring-[#202BA5]"
                        disabled
                        readOnly
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Kecamatan</label>
                    <input
                        type="text"
                        defaultValue={kecamatanName}
                        className="mt-1 p-2 border border-[#202BA5] w-full rounded-md focus:ring-2 focus:ring-[#202BA5]"
                        disabled
                        readOnly
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Alamat</label>
                    <input
                        type="text"
                        defaultValue={branch.branchLocation}
                        className="mt-1 p-2 border border-[#202BA5] w-full rounded-md focus:ring-2 focus:ring-[#202BA5]"
                        disabled
                        readOnly
                    />
                </div>
                <button
                    onClick={() => router.back()}
                    className="mt-5 bg-[#202B51] text-white px-4 py-2 rounded-lg"
                >
                    Back
                </button>
            </div>
        </div>
    );
};

export default BranchView;