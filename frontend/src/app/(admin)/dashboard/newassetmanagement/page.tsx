"use client";

import Upper from "../components/Upper";
import DataTable from "../components/DataTable";
import Search from "../components/Search";
import Link from "next/link";
import { useState, useEffect } from "react";
import { IoEyeSharp, IoReaderSharp, IoTrash } from "react-icons/io5";

interface Asset {
    id: string;
    name: string;
    locationId: string;
    branchName: string;
    assetType: string;
    itemStatus: string;
}

const NewAssetManagement = () => {
    const [newAssets, setNewAssets] = useState<Asset[]>([]);
    const [filteredAssets, setFilteredAssets] = useState<Asset[]>(newAssets);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 5;
    const [statusFilter, setStatusFilter] = useState<string>("All");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [branches, setBranches] = useState<Record<string, string>>({});

    const [newAsset, setNewAsset] = useState<Asset | null>(null);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const [showDeletePopup, setShowDeletePopup] = useState<boolean>(false);

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/asset/index`)
            .then((response) => {
                if (!response.ok) {
                    return response.text().then((text) => {
                        throw new Error(`Network response was not ok. Status: ${response.status}, ${text}`);
                    });
                }
                return response.json();
            })
            .then((data) => {
                setNewAssets(data);
                setFilteredAssets(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                setError('Failed to fetch data. Please try again later.');
                setLoading(false);
            });
    }, []);

    const columns = [
        { key: "id", label: "Id Asset", alwaysVisible: true },
        { key: "name", label: "Nama Asset", alwaysVisible: true },
        { key: "branchName", label: "Lokasi Saat ini",},
        { key: "assetType", label: "Type Asset", alwaysVisible: true },
        { key: "itemStatus", label: "Status Asset" },
    ];

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    const handleStatusFilterChange = (status: string) => {
        setStatusFilter(status);
    };
 
    useEffect(() => {
        let filtered = newAssets;
        if (searchQuery.trim()) {
            filtered = filtered.filter((asset) =>
                asset.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                asset.locationId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                asset.assetType.toLowerCase().includes(searchQuery.toLowerCase()) ||
                asset.itemStatus.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (statusFilter !== "All") {
            filtered = filtered.filter((asset) => asset.itemStatus === statusFilter);
        }

        setFilteredAssets(filtered);
    }, [newAssets, searchQuery, statusFilter]);

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
                                href: (row) => `/dashboard/newassetmanagement/view/${row.id}`,
                                className: "rounded-full hover:bg-blue-200 p-1 text-white text-md mx-2",
                            },
                            {
                                label:  <IoReaderSharp className="text-[#202B51]" />,
                                href: (row) => `/dashboard/newassetmanagement/edit/${row.id}`,
                                className: "rounded-full hover:bg-blue-200 p-1 text-white text-md mx-2",
                            },
                            {
                                label: <IoTrash className="text-red-700" />,
                                onClick: (row) => console.log("Delete user:", row.Id),
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
