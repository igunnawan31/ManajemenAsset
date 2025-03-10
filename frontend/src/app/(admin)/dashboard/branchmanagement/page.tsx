"use client";

import Upper from "../components/Upper";
import DataTable from "../components/DataTable";
import Search from "../components/Search";
import Link from "next/link";
import { useState, useEffect } from "react";
import { IoEyeSharp, IoReaderSharp, IoTrash } from "react-icons/io5";


interface Branch {
    branchId: string;
    branchName: string;
    branchEmail: string;
    branchPhone: string;
    branchLocation: string;
}

const BranchManagement = () => {
    const [branches, setBranches] = useState<Branch[]>([]);
    const [filteredBranches, setFilteredBranches] = useState<Branch[]>(branches);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 5;

    // For Deletting
    const [branch, setBranch] = useState<Branch | null>(null);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const [showDeletePopup, setShowDeletePopup] = useState<boolean>(false);

    const columns = [
        { key: "branchId", label: "No", alwaysVisible: true },
        { key: "branchName", label: "Name branch", alwaysVisible: true },
        { key: "branchEmail", label: "Email branch", alwaysVisible: true },
        { key: "branchLocation", label: "Location branch" },
        { key: "branchPhone", label: "Phone branch" },
    ];

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/branch/index`)
            .then((response) => {
                if (!response.ok) {
                    return response.text().then((text ) => {
                        throw new Error(`Network response was not ok. Status: ${response.status}, ${text}`);
                    });
                }
                return response.json();
            })

            .then((data) => {
                setBranches(data);
                setFilteredBranches(data);
                setLoading(false);
            })

            .catch((error) => {
                setError('Failed to fetch data. Please try again later');
                setLoading(false);
            })
    }, [])

    const handleSearch = (query: string) => {
        if (!query.trim()) {
          setFilteredBranches(branches);
          return;
        }
    
        const filtered = branches.filter((branch) =>
          branch.branchName.toLowerCase().includes(query.toLowerCase()) ||
          branch.branchEmail.toLowerCase().includes(query.toLowerCase()) ||
          branch.branchPhone.toLowerCase().includes(query.toLowerCase()) ||
          branch.branchLocation.toLowerCase().includes(query.toLowerCase())
        );
        
        setCurrentPage(1);
        setFilteredBranches(filtered);
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentBranches = filteredBranches.slice(indexOfFirstItem, indexOfLastItem);
  
    const totalPages = Math.ceil(filteredBranches.length / itemsPerPage);
  
    const handlePageChange = (page: number) => {
      setCurrentPage(page);
    };

    return (
        <div className="px-8 py-24 w-full max-h-full">
            <Upper title="Branch Management" />
            <div className="mt-5">
                <div className="flex justify-end items-end">
                    <Link href="/dashboard/branchmanagement/create">
                        <button className="bg-[#202B51] p-4 rounded-lg hover:opacity-90">
                            <span className="text-white font-sans font-bold">Create New branch</span>
                        </button>
                    </Link>
                </div>
            </div>
            <div className="mt-5">
                <Search
                    placeholder="Cari Email branch / Branch branch / ..."
                    onSearch={handleSearch} 
                />
            </div>
            <div className="mt-5">
                {loading ? (
                        <div className="text-center text-gray-500 font-poppins text-lg mt-5">Loading...</div>
                    ) : error ? (
                        <div className="text-center text-red-500 font-poppins text-lg mt-5">{error}</div>
                    ) : filteredBranches.length > 0 ? (
                        <>
                            <DataTable
                                columns={columns}
                                data={currentBranches}
                                actions={[
                                    {
                                        label: <IoEyeSharp className="text-[#202B51]" />,
                                        href: (row) => `/dashboard/branchmanagement/view/${row.branchId}`,
                                        className: "rounded-full hover:bg-blue-200 p-1 text-white text-md mx-2",
                                    },
                                    {
                                        label: <IoReaderSharp className="text-[#202B51]" />,
                                        href: (row) => `/dashboard/branchmanagement/edit/${row.branchId}`,
                                        className: "rounded-full hover:bg-blue-200 p-1 text-white text-md mx-2",
                                    },
                                    {
                                        label: <IoTrash className="text-red-700" />,
                                        onClick: (row) => console.log("Delete user:", row.branchId),
                                        className: "rounded-full hover:bg-blue-200 p-1 text-white text-md mx-2",
                                    },
                                ]}
                            />
                            <div className="mt-5 flex justify-center items-center">
                                <button
                                    className={`px-4 py-2 mx-1 rounded ${
                                        currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-700"
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
                                            currentPage === index + 1 ? "bg-blue-700 text-white" : "bg-gray-200 hover:bg-gray-400"
                                        }`}
                                        onClick={() => handlePageChange(index + 1)}
                                    >
                                        {index + 1}
                                    </button>
                                ))}
                                <button
                                    className={`px-4 py-2 mx-1 rounded ${
                                        currentPage === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-700"
                                    }`}
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                >
                                    Next
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="text-center text-gray-500 font-poppins text-lg mt-5">No data available</div>
                    )}
            </div>
        </div>
    );
}

export default BranchManagement;