"use client";

import Upper from "../components/Upper";
import DataTable from "../components/DataTable";
import Search from "../components/Search";
import Link from "next/link";
import { useState, useEffect } from "react";
import { IoEyeSharp, IoReaderSharp, IoTrash } from "react-icons/io5";

interface Asset {
    no: string;
    assetId: string;
    assetName: string;
    assetStock: string;
    assetType: string;
    assetStatus: string;
}

const NewAssetManagement = () => {
    const [assets, setAssets] = useState<Asset[]>([
        { no: "1", assetId: "AID-001-06022025", assetName: "Samsung_NOTE", assetStock: "4", assetType: "Elektronik", assetStatus: "Active" },
        { no: "2", assetId: "AID-002-06022025", assetName: "HP_JETINK", assetStock: "5", assetType: "Elektronik", assetStatus: "In-Active" }
    ]);

    const [filteredAssets, setFilteredAssets] = useState<Asset[]>(assets);
    const [statusFilter, setStatusFilter] = useState<string>("All");
    const [searchQuery, setSearchQuery] = useState<string>("");

    const columns = [
        { key: "no", label: "No", alwaysVisible: true },
        { key: "assetId", label: "Id Asset", alwaysVisible: true },
        { key: "assetName", label: "Nama Asset", alwaysVisible: true },
        { key: "assetStock", label: "Stock Asset" },
        { key: "assetType", label: "Type Asset", alwaysVisible: true },
        { key: "assetStatus", label: "Status Asset" },
    ];

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    const handleStatusFilterChange = (status: string) => {
        setStatusFilter(status);
    };
 
    useEffect(() => {
        let filtered = assets;
        if (searchQuery.trim()) {
            filtered = filtered.filter((asset) =>
                asset.assetId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                asset.assetName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                asset.assetStock.toLowerCase().includes(searchQuery.toLowerCase()) ||
                asset.assetType.toLowerCase().includes(searchQuery.toLowerCase()) ||
                asset.assetStatus.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (statusFilter !== "All") {
            filtered = filtered.filter((asset) => asset.assetStatus === statusFilter);
        }

        setFilteredAssets(filtered);
    }, [assets, searchQuery, statusFilter]);

    return (
        <div className="px-8 py-24 w-full max-h-full">
            <Upper title="Asset Management" />
            <div className="mt-5">
                <div className="flex justify-end items-end">
                    <Link href="newassetmanagement/create/">
                        <button className="bg-[#202B51] p-4 rounded-lg hover:opacity-90">
                            <span className="text-white font-sans font-bold">Create New User</span>
                        </button>
                    </Link>
                </div>
            </div>
            <div className="mt-5">
                <Search placeholder="Cari Id Asset / Nama Asset / Type Asset / Status Asset / ..." onSearch={handleSearch} />
                <div className="mt-5">
                    <label htmlFor="statusFilter" className="mr-2">Filter by Status:</label>
                    <select
                        id="statusFilter"
                        value={statusFilter}
                        onChange={(e) => handleStatusFilterChange(e.target.value)}
                        className="p-2 border rounded-lg border-[#202B51]"
                    >
                        <option value="All">All</option>
                        <option value="Active">Active</option>
                        <option value="In-Active">In-Active</option>
                    </select>
                </div>
            </div>
            <div className="mt-5">
                {filteredAssets.length > 0 ? (
                    <DataTable
                        columns={columns}
                        data={filteredAssets}
                        actions={[
                            {
                                label: <IoEyeSharp className="text-[#202B51]" />,
                                href: (row) => `/dashboard/newassetmanagement/view/${row.userId}`,
                                className: "rounded-full hover:bg-blue-200 p-1 text-white text-md mx-2",
                            },
                            {
                                label:  <IoReaderSharp className="text-[#202B51]" />,
                                href: (row) => `/dashboard/newassetmanagement/edit/${row.userId}`,
                                className: "rounded-full hover:bg-blue-200 p-1 text-white text-md mx-2",
                            },
                            {
                                label: <IoTrash className="text-red-700" />,
                                onClick: (row) => console.log("Delete user:", row.userId),
                                className: "rounded-full hover:bg-blue-200 p-1 text-white text-md mx-2",
                            },
                        ]}
                    />
                ) : (
                    <div className="text-center text-gray-500 font-poppins text-lg mt-5">No data available</div>
                )}
            </div>
        </div>
    );
}

export default NewAssetManagement;
