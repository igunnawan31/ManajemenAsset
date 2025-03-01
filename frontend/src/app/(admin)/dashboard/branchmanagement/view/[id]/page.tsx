"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Upper from "../../../components/Upper"; // Adjust path if needed

interface Branch {
    branchId: string;
    branchName: string;
    branchPhone: string;
    branchEmail: string;
    branchLocation: string;
}

const AssetView = () => {
    const { id } = useParams();
    const router = useRouter();
    const [branch, setBranch] = useState<Branch | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/branch/by-id/${id}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Asset not found");
                }
                return response.json();
            })
            .then((data) => {
                setBranch(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching asset:", error);
                setError("Asset not found.");
                setLoading(false);
            });
    }, [id]);

    if (loading) return <div className="text-center mt-10">Loading...</div>;
    if (error) return <div className="text-center text-red-500 mt-10">{error}</div>;

    return (
        <div className="px-8 py-24 w-full max-h-full">
            <Upper title="View Asset Details" />
            <div className="mt-5 bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-bold text-[#202B51]">{branch?.branchName}</h2>
                <p><strong>ID:</strong> {branch?. branchId}</p>
                <p><strong>Branch:</strong> {branch?.branchName}</p>
                <p><strong>Asset Type:</strong> {branch?.branchEmail}</p>
                <p><strong>Status:</strong> {branch?.branchPhone}</p>
                <p><strong>Status:</strong> {branch?.branchLocation}</p>
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

export default AssetView;
