"use client";

import Upper from "../components/Upper";
import DataTable from "../components/DataTable";
import Search from "../components/Search";
import Link from "next/link";
import { useState, useEffect } from "react";
import { IoCheckmarkCircle, IoCloseCircleSharp, IoEyeSharp, IoReaderSharp, IoTrash } from "react-icons/io5";
import PopUpModal from "../components/PopUpModal";
import { routes } from "@/lib/routes";


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
    const [filteredUsers, setFilteredUsers] = useState<User[]>(users);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 5;

    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);

    const columns = [
        { label: "id", key: "userId", alwaysVisible: true   },
        { label: "Name", key: "userName", alwaysVisible: true   },
        { label: "Email", key: "userEmail", alwaysVisible: true  },
        { label: "Branch", key: "userBranch", alwaysVisible: true  },
        { label: "Phone", key: "userPhone" },
        { label: "Role", key: "userRole", alwaysVisible: true  },
        { label: "Sub Role", key: "userSubRole", alwaysVisible: true  },
    ];

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/index`)
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
            });
    }, []);
    
    const handleSearch = (query: string) => {
        if (!query.trim()) {
            setFilteredUsers(users);
            return;
        }
    
        const filtered = users.filter((user) => {
            return [
                user.userName,
                user.userEmail,
                user.userBranch,
                user.userPhone,
                user.userRole,
                user.userSubRole
            ].some((field) => 
                typeof field === "string" && field.toLowerCase().includes(query.toLowerCase())
            );
        });
    
        setCurrentPage(1);
        setFilteredUsers(filtered);
    };

    const confirmDelete = (user: User) => {
        setUserToDelete(user);
        setShowDeletePopup(true);
    };
    
    const handleDeleteConfirmed = async () => {
        if (!userToDelete) return;
    
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/delete`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(parseInt(userToDelete.userId)),
            });
    
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to delete user. ${errorText}`);
            }
    
            setUsers(prev => prev.filter(user => user.userId !== userToDelete.userId));
            setFilteredUsers(prev => prev.filter(user => user.userId !== userToDelete.userId));
            setDeleteSuccess(`User "${userToDelete.userName}" deleted successfully.`);
        } catch (error) {
            alert("Failed to delete the user.");
        } finally {
            setShowDeletePopup(false);
            setUserToDelete(null);
        }
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  
    const handlePageChange = (page: number) => {
      setCurrentPage(page);
    };

    return (
        <div className="px-8 py-24 text-[#202B51] w-full max-h-full">
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
                    <div className="text-center text-gray-500  text-lg mt-5">Loading...</div>
                ) : error ? (
                    <div className="text-center text-red-500  text-lg mt-5">{error}</div>
                ) : filteredUsers.length > 0 ? (
                    <>
                        <DataTable
                            columns={columns}
                            data={currentUsers}
                            actions={[
                                {
                                    label: <IoEyeSharp className="text-[#202B51]" />,
                                    href: (row) => routes.dashboard.userManagement.view(row.userId),
                                    className: "rounded-full hover:bg-blue-200 p-1 text-white text-md mx-2",
                                },
                                {
                                    label: <IoReaderSharp className="text-[#202B51]" />,
                                    href: (row) => routes.dashboard.userManagement.edit(row.userId),
                                    className: "rounded-full hover:bg-blue-200 p-1 text-white text-md mx-2",
                                },
                                {
                                    label: <IoTrash className="text-red-700" />,
                                    onClick: (row) => confirmDelete(row as User),
                                    className: "rounded-full hover:bg-blue-200 p-1 text-white text-md mx-2",
                                },
                            ]}
                        />
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
                    </>
                ) : (
                    <div className="text-center text-gray-500  text-lg mt-5">No data available</div>
                )}
            </div>
            {showDeletePopup && userToDelete && (
                <PopUpModal
                    title="Confirm Delete"
                    message={`Are you sure you want to delete user "${userToDelete.userName}"?`}
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

export default UserManagement;