"use client";

import { useState, useEffect } from "react";
import Upper from "../../../components/Upper";

interface Asset {
    no: string;
    assetId: string;
    assetName: string;
    assetType: string;
    assetLocation: string;
    assetStock: string;
    assetStatusPengelolaan: string;
}

const ViewRequestInbound = () => {
    const [assets] = useState<Asset[]>([
        { no: "1", assetId: "AID-001-100225", assetName: "Samsung2", assetType: "Elektronik", assetLocation: "Astra International - Pusat", assetStock: "4", assetStatusPengelolaan: "Active" },
        { no: "2", assetId: "AID-002-100225", assetName: "Samsung1", assetType: "Elektronik", assetLocation: "Astra International - Pusat", assetStock: "4", assetStatusPengelolaan: "Active" },
        { no: "3", assetId: "AID-003-100225", assetName: "Samsung3", assetType: "Elektronik", assetLocation: "Astra International - Pusat", assetStock: "4", assetStatusPengelolaan: "Active" },
        { no: "4", assetId: "AID-004-100225", assetName: "Kursi1", assetType: "Barang", assetLocation: "Astra International - Pusat", assetStock: "2", assetStatusPengelolaan: "Active" },
        { no: "5", assetId: "AID-005-100225", assetName: "Kursi2", assetType: "Barang", assetLocation: "Astra International - Pusat", assetStock: "2", assetStatusPengelolaan: "Active" },
        { no: "6", assetId: "AID-006-100225", assetName: "Printer", assetType: "Elektronik", assetLocation: "Astra International - Pusat", assetStock: "5", assetStatusPengelolaan: "Active" }
    ]);

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setErorr] = useState<string | null>(null);
    const [id, setId] = useState<string | null>(null);

    useEffect(() => {
        const pathname = window.location.pathname;
        const idFromPath = pathname.split("/").pop();
        setId(idFromPath || null);
    }, []);

    useEffect(() => {
        // Buat Fetching Data from API
    })

    if (loading) return <p> loading... </p>;
    if (error) return <p>{error}</p>
    

    return (
        <div className="px-8 py-24 w-full max-h-full poppins">
            <Upper title="Create Request Inbound" />

            <div className="mt-5 bg-white p-6 rounded-lg shadow-md">
                <form className="mt-5 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Asset Name</label>
                            <input
                                type="text"
                                defaultValue="AssetName"
                                className="mt-1 p-2 border border-[#202BA5] w-full rounded-md focus:ring-2 focus:ring-[#202BA5]"
                                disabled
                                placeholder="Enter asset name"
                            />
                            <label className="block text-sm font-medium text-gray-700">Asset Name</label>
                            <input
                                type="text"
                                defaultValue="AssetName"
                                className="mt-1 p-2 border border-[#202BA5] w-full rounded-md focus:ring-2 focus:ring-[#202BA5]"
                                disabled
                                placeholder="Enter asset name"
                            />
                            <label className="block text-sm font-medium text-gray-700">Asset Name</label>
                            <input
                                type="text"
                                defaultValue="AssetName"
                                className="mt-1 p-2 border border-[#202BA5] w-full rounded-md focus:ring-2 focus:ring-[#202BA5]"
                                disabled
                                placeholder="Enter asset name"
                            />
                            <label className="block text-sm font-medium text-gray-700">Asset Name</label>
                            <input
                                type="text"
                                defaultValue="AssetName"
                                className="mt-1 p-2 border border-[#202BA5] w-full rounded-md focus:ring-2 focus:ring-[#202BA5]"
                                disabled
                                placeholder="Enter asset name"
                            />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ViewRequestInbound;