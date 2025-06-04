"use client";

import Upper from "../components/Upper";
import DataTable from "../components/DataTable";
import Search from "../components/Search";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { IoCheckmarkCircle, IoCloseCircleSharp, IoEyeSharp, IoReaderSharp, IoTrash } from "react-icons/io5";
import PopUpModal from "../components/PopUpModal";
import { routes } from "@/lib/routes";

interface Asset {
    id: string;
    name: string;
    locationId: string;
    branchName: string;
    assetType: string;
    itemStatus: string;
    imagePath: string;
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

    const [assetToDelete, setAssetToDelete] = useState<Asset | null>(null);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);

    const [newAsset, setNewAsset] = useState<Asset | null>(null);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);

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
            filtered = filtered.filter((asset) => asset.itemStatus === statusFilter);
        }
    
        setFilteredAssets(filtered);
        setCurrentPage(1);
    }, [newAssets, searchQuery, statusFilter]);

    const confirmDelete = (asset: Asset) => {
        setAssetToDelete(asset);
        setShowDeletePopup(true);
    };
    
    const handleDeleteConfirmed = async () => {
        if (!assetToDelete) return;
    
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/asset/delete`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(parseInt(assetToDelete.id)),
            });
    
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to delete asset. ${errorText}`);
            }
    
            setNewAssets(prev => prev.filter(asset => asset.id !== assetToDelete.id));
            setFilteredAssets(prev => prev.filter(asset => asset.id !== assetToDelete.id));
            setDeleteSuccess(`Asset "${assetToDelete.name}" deleted successfully.`);
        } catch (error) {
            alert("Failed to delete the asset.");
        } finally {
            setShowDeletePopup(false);
            setAssetToDelete(null);
        }
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentAssets = filteredAssets.slice(indexOfFirstItem, indexOfLastItem);
  
    const totalPages = Math.ceil(filteredAssets.length / itemsPerPage);
  
    const handlePageChange = (page: number) => {
      setCurrentPage(page);
    };

    return (
        <div className="px-8 py-24 text-[#202B51] w-full max-h-full">
            <Upper title="Asset Management" />
            <div className="mt-5">
                <div className="flex justify-end items-end">
                    <Link href="newassetmanagement/create/">
                        <button className="bg-[#202B51] p-4 rounded-lg hover:opacity-90">
                            <span className="text-white font-sans font-bold">Create New Asset</span>
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
                        <option value="Inactive">In-Active</option>
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
                                href: (row) => routes.dashboard.newAssetManagement.view(row.id),
                                className: "rounded-full hover:bg-blue-200 p-1 text-white text-md mx-2",
                            },
                            {
                                label:  <IoReaderSharp className="text-[#202B51]" />,
                                href: (row) => routes.dashboard.newAssetManagement.edit(row.id),
                                className: "rounded-full hover:bg-blue-200 p-1 text-white text-md mx-2",
                            },
                            {
                                label: <IoTrash className="text-red-700" />,
                                onClick: (row) => confirmDelete(row as Asset),
                                className: "rounded-full hover:bg-blue-200 p-1 text-white text-md mx-2",
                            },
                        ]}
                    />
                ) : (
                    <div className="text-center text-gray-500  text-lg mt-5">No data available</div>
                )}
                <div className="mt-5 flex justify-center items-center mb-32">
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
            {showDeletePopup && assetToDelete && (
                <PopUpModal
                    title="Confirm Delete"
                    message={`Are you sure you want to delete branch "${assetToDelete.name}"?`}
                    icon={<IoCloseCircleSharp className="text-red-500" />}
                    actions={
                        <>
                            <button
                                onClick={() => setShowDeletePopup(false)}
                                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteConfirmed}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </>
                    }
                />
            )}
            {deleteSuccess && (
                <PopUpModal
                    title="Success"
                    message={deleteSuccess}
                    icon={<IoCheckmarkCircle className="text-green-500" />}
                    actions={
                        <button
                            onClick={() => setDeleteSuccess(null)}
                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                            OK
                        </button>
                    }
                />
            )}
        </div>
    );
}

export default NewAssetManagement;
