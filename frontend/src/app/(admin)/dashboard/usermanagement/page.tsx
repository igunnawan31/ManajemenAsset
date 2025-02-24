"use client";

import Upper from "../components/Upper";
import DataTable from "../components/DataTable";
import Search from "../components/Search";
import Link from "next/link";
import { useState, useEffect } from "react";
import { IoEyeSharp, IoReaderSharp, IoTrash } from "react-icons/io5";


interface User {
    userId: string;
    userName: string;
    userEmail: string;
    userBranch: string;
    userPhone: string;
    userRole: string;
    userSubRole: string;
}

const UserManagement = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [filteredUsers, setFilteredUsers] = useState<User[]>(users);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const [showDeletePopup, setShowDeletePopup] = useState<boolean>(false);
    const itemsPerPage = 5;

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`)
            .then((response) => {
                if (!response.ok) {
                    return response.text().then((text) => {
                        throw new Error(`Network response was not ok. Status: ${response.status}, ${text}`);
                    });
                }
                return response.json();
            })
            
            .then((data) => {
                setUsers(data);
                setFilteredUsers(data);
                setLoading(false);
            })

            .catch((error) => {
                console.error('Error fetching data:', error);
                setError('Failed to fetch data. Please try again later.');
                setLoading(false);
            })
    })

    const columns = [
        { label: "Name", key: "userName", alwaysVisible: true   },
        { label: "Email", key: "userEmail", alwaysVisible: true  },
        { label: "Branch", key: "userBranch", alwaysVisible: true  },
        { label: "Phone", key: "userPhone" },
        { label: "Role", key: "userRole", alwaysVisible: true  },
        { label: "Sub Role", key: "userSubRole", alwaysVisible: true  },
    ];
    
    const handleSearch = (query: string) => {
        if (!query.trim()) {
          setFilteredUsers(users);
          return;
        }
    
        const filtered = users.filter((user) =>
          user.userName.toLowerCase().includes(query.toLowerCase()) ||
          user.userEmail.toLowerCase().includes(query.toLowerCase()) ||
          user.userBranch.toLowerCase().includes(query.toLowerCase()) ||
          user.userPhone.toLowerCase().includes(query.toLowerCase()) ||
          user.userRole.toLowerCase().includes(query.toLowerCase()) ||
          user.userSubRole.toLowerCase().includes(query.toLowerCase())
        );
        
        setCurrentPage(1);
        setFilteredUsers(filtered);
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  
    const handlePageChange = (page: number) => {
      setCurrentPage(page);
    };

    return (
        <div className="px-8 py-24 w-full max-h-full">
            <Upper title="User Management" />
            <div className="mt-5">
                <div className="flex justify-end">
                    <Link href="/dashboard/usermanagement/create">
                        <button className="bg-[#202B51] p-4 rounded-lg hover:opacity-90">
                            <span className="text-white font-sans font-bold">Create New User</span>
                        </button>
                    </Link>
                </div>
            </div>
            <div className="mt-5">
                <Search placeholder="Search by Name, Email, Branch, etc." onSearch={handleSearch} />
            </div>
            <div className="mt-5">
                {loading ? (
                    <div className="text-center text-gray-500 font-poppins text-lg mt-5">Loading...</div>
                ) : error ? (
                    <div className="text-center text-red-500 font-poppins text-lg mt-5">{error}</div>
                ) : filteredUsers.length > 0 ? (
                    <>
                        <DataTable
                            columns={columns}
                            data={currentUsers}
                            actions={[
                                {
                                    label: <IoEyeSharp className="text-[#202B51]" />,
                                    href: (row) => `/dashboard/usermanagement/view/${row.userId}`,
                                    className: "rounded-full hover:bg-blue-200 p-1 text-white text-md mx-2",
                                },
                                {
                                    label: <IoReaderSharp className="text-[#202B51]" />,
                                    href: (row) => `/dashboard/usermanagement/edit/${row.userId}`,
                                    className: "rounded-full hover:bg-blue-200 p-1 text-white text-md mx-2",
                                },
                                {
                                    label: <IoTrash className="text-red-700" />,
                                    onClick: (row) => console.log("Delete user:", row.userId),
                                    className: "rounded-full hover:bg-blue-200 p-1 text-white text-md mx-2",
                                },
                            ]}
                        />
                        {/* Pagination Controls */}
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

export default UserManagement;