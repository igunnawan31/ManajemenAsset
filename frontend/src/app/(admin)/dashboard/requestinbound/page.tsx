"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Search from "../components/Search";
import DataTable from "../components/DataTable";
import Upper from "../components/Upper";
import { IoEyeSharp, IoReaderSharp, IoTrash } from "react-icons/io5";

interface Asset {
    no: string;
    assetId: string;
    assetName: string;
    assetType: string;
    assetLocation: string;
    assetStock: string;
    assetStatusPengelolaan: string;
}

const RequestInboundPage = () => {
    const [assets, setAssets] = useState<Asset[]>([
        { no: "1", assetId: "AID-001-100225", assetName: "Samsung2", assetType: "Elektronik", assetLocation: "Astra International - Pusat", assetStock: "4", assetStatusPengelolaan: "Active" },
        { no: "2", assetId: "AID-002-100225", assetName: "Samsung1", assetType: "Elektronik", assetLocation: "Astra International - Pusat", assetStock: "4", assetStatusPengelolaan: "Active" },
        { no: "3", assetId: "AID-003-100225", assetName: "Samsung3", assetType: "Elektronik", assetLocation: "Astra International - Pusat", assetStock: "4", assetStatusPengelolaan: "Active" },
        { no: "4", assetId: "AID-004-100225", assetName: "Kursi1", assetType: "Barang", assetLocation: "Astra International - Pusat", assetStock: "2", assetStatusPengelolaan: "Active" },
        { no: "5", assetId: "AID-005-100225", assetName: "Kursi2", assetType: "Barang", assetLocation: "Astra International - Pusat", assetStock: "2", assetStatusPengelolaan: "Active" },
        { no: "6", assetId: "AID-006-100225", assetName: "Printer", assetType: "Elektronik", assetLocation: "Astra International - Pusat", assetStock: "5", assetStatusPengelolaan: "Active" }
    ]);

    const [asset, setAsset] = useState<Asset | null>(null);

    const [filteredassets, setFilteredassets] = useState<Asset[]>(assets);

    const columns = [
        { key: "no", label: "No", alwaysVisible:true },
        { key: "assetId", label: "Id Asset", alwaysVisible: true },
        { key: "assetName", label: "Nama Asset", alwaysVisible: true },
        { key: "assetType", label: "Tipe Asset", alwaysVisible: true },
        { key: "assetLocation", label: "Lokasi Asset", alwaysVisible: true },
        { key: "assetStock", label: "Stock Asset" },
        { key: "assetStatusPengelolaan", label: "Status Asset" },
    ];

    const handleSearch = (query: string) => {
        if (!query.trim()) {
            setFilteredassets(assets);
            return;
        }
    
        const filtered = assets.filter((asset) =>
            asset.assetId.toLowerCase().includes(query.toLowerCase()) ||
            asset.assetName.toLowerCase().includes(query.toLowerCase()) ||
            asset.assetType.toLowerCase().includes(query.toLowerCase()) ||
            asset.assetLocation.toLowerCase().includes(query.toLowerCase()) ||
            asset.assetStatusPengelolaan.toLowerCase().includes(query.toLowerCase())
        );
    
        setFilteredassets(filtered);
    };

    return (
        <div className="px-8 py-24 w-full max-h-full">
            <Upper title="Request Inbound" />
            <div className="mt-5">
                <div className="flex justify-end items-end">
                    <Link href="/dashboard/requestinbound/create">
                        <button className="bg-[#202B51] p-4 rounded-lg hover:opacity-90">
                            <span className="text-white font-sans font-bold">Create New Inbound</span>
                        </button>
                    </Link>
                </div>
            </div>
            <div className="mt-5">
                <Search
                    placeholder="Cari Email asset/Branch asset/Dll"
                    onSearch={handleSearch} 
                />
            </div>
            <div className="mt-5">
                { filteredassets.length > 0 ? (
                    <DataTable
                        columns={columns}
                        data={filteredassets}
                        actions={[
                            {
                                label: <IoEyeSharp className="text-[#202B51]" />,
                                href: (row) => `/dashboard/requestinbound/view/${row.assetId}`,
                                className: "rounded-full hover:bg-blue-200 p-1 text-white text-md mx-2",
                            },
                            {
                                label: <IoTrash className="text-red-700" />,
                                onClick: (row) => console.log("Delete asset:", row.assetId),
                                className: "rounded-full hover:bg-blue-200 p-1 text-white text-md mx-2",
                            },
                        ]}
                    />
                ) : (
                    <div className="text-center text-gray-500 font-poppins text-lg mt-5">No data available</div>
                )}
            </div>
        </div>
    )
}

export default RequestInboundPage;