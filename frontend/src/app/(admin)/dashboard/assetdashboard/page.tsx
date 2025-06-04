"use client";

import { useEffect, useState } from "react";
import Path from "../components/Path";
import Upper from "../components/Upper";
import Image from "next/image";
import Link from "next/link";
import Search from "../components/Search";
import DataTable from "../components/DataTable";
import { IoEyeSharp, IoReaderSharp } from "react-icons/io5";
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
    imagePath: string;
}

const AssetDashboardPage = () => {
    const [users, setUsers] = useState<any>(null);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [newAssets, setNewAssets] = useState<Asset[]>([]);
    const [userBranch, setUserBranch] = useState<string | null>(null);
    
    const [statusFilter, setStatusFilter] = useState<string>("All");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [filteredAssets, setFilteredAssets] = useState<Asset[]>(newAssets);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 5;

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
        if (users) {
            setUserBranch(users.userBranch);
        }
    }, [users]);

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
        if (userBranch) {
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/asset/index`)
            .then((response) => {
                if (!response.ok) {
                    return response.text().then((text) => {
                        throw new Error(`Network response was not ok. Status: ${response.status}, ${text}`);
                    });
                }
                return response.json();
            })
            .then((data: Asset[]) => {
                const filteredByUserBranch = data.filter(asset => 
                    asset.locationId === userBranch
                );

                console.log("Filtered Data:", filteredByUserBranch);
                setNewAssets(filteredByUserBranch);
                setFilteredAssets(filteredByUserBranch);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                setError('Failed to fetch data. Please try again later.');
                setLoading(false);
            });
        }
    }, [userBranch]);

    const columns = [
        { key: "id", label: "Id Asset", alwaysVisible: true },
        { key: "name", label: "Nama Asset", alwaysVisible: true },
        { key: "branchName", label: "Lokasi Saat ini" },
        { key: "assetType", label: "Type Asset", alwaysVisible: true },
        { key: "itemStatus", label: "Status Asset" },
        { 
            key: "imagePath", 
            label: "Image",
            render: (value: string) => {
                if (!value) return <span className="text-gray-400">No Image</span>;
                
                const imageUrl = `${process.env.NEXT_PUBLIC_API_URL}/uploads/${
                    value.replace(/\\/g, '/')
                            .replace(/.*?uploads[\\/]/, '')
                }`;
                
                return (
                    <div className="w-16 h-16 relative">
                        <Image
                            src={imageUrl}
                            alt="Asset Image"
                            fill
                            className="object-cover rounded"
                            sizes="(max-width: 768px) 100px, 150px"
                        />
                    </div>
                );
            }
        },
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
                asset.assetType.toLowerCase().includes(searchQuery.toLowerCase()) ||
                asset.itemStatus.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (statusFilter !== "All") {
            filtered = filtered.filter((asset) => 
                asset.itemStatus?.toLowerCase() === statusFilter.toLowerCase()
            );
        }

        setFilteredAssets(filtered);
        setCurrentPage(1);
    }, [newAssets, searchQuery, statusFilter]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentAssets = filteredAssets.slice(indexOfFirstItem, indexOfLastItem);
  
    const totalPages = Math.ceil(filteredAssets.length / itemsPerPage);
  
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };
    
    return (
        <div className="px-8 py-24 w-full max-h-full">
            <Upper title="Asset Dashboard" />
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
                        <option value="Inactive">Inactive</option> {/* not "In-Active" */}
                    </select>
                </div>
            </div>
            <div className="mt-5">
                {filteredAssets.length > 0 ? (
                    <DataTable
                        columns={columns}
                        data={currentAssets}
                        actions={[
                            {
                                label: <IoEyeSharp className="text-[#202B51]" />,
                                href: (row) => `/dashboard/assetdashboard/view/${row.id}`,
                                className: "rounded-full hover:bg-blue-200 p-1 text-white text-md mx-2",
                            },
                            {
                                label:  <IoReaderSharp className="text-[#202B51]" />,
                                href: (row) => `/dashboard/assetdashboard/edit/${row.id}`,
                                className: "rounded-full hover:bg-blue-200 p-1 text-white text-md mx-2",
                            }
                        ]}
                    />
                ) : (
                    <div className="text-center text-gray-500 text-lg mt-5">No data available</div>
                )}
                <div className="mt-5 flex justify-center items-center">
                    <button
                        className={`px-4 py-2 mx-1 rounded ${
                            currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-[#202B51] text-white hover:bg-blue-700"
                        }`}
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    {[...Array(totalPages)].map((_, index) => (
                        <button
                            key={index}
                            className={`px-4 py-2 mx-1 rounded ${
                                currentPage === index + 1 ? "bg-[#202B51] text-white" : "bg-gray-200 hover:bg-gray-400"
                            }`}
                            onClick={() => handlePageChange(index + 1)}
                        >
                            {index + 1}
                        </button>
                    ))}
                    <button
                        className={`px-4 py-2 mx-1 rounded ${
                            currentPage === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-[#202B51] text-white hover:bg-blue-700"
                        }`}
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AssetDashboardPage;