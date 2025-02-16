"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Search from "../components/Search";
import DataTable from "../components/DataTable";
import Upper from "../components/Upper";
import { IoEyeSharp, IoReaderSharp, IoTrash } from "react-icons/io5";

interface User {
    userId: string;
    userName: string;
    userRole: string;
    userEmail: string;
    userBranch: string;
    userPhone: string;
}

const RequestOutboundPage = () => {
    const [users, setUsers] = useState<User[]>([
        { userId: "1", userName: "igun", userRole: "Admin Pusat", userEmail: "igunnawan24@gmail.com", userBranch: "Astra International - Pusat", userPhone: "085959913761" },
        { userId: "2", userName: "igun2", userRole: "Admin Cabang", userEmail: "igunnawan25@gmail.com", userBranch: "Astra Daihatsu Motor - Perum", userPhone: "085959913762" },
        { userId: "3", userName: "igun3", userRole: "Karyawan Pusat", userEmail: "igunnawan26@gmail.com", userBranch: "Astra International - Pusat", userPhone: "085959913763" },
        { userId: "4", userName: "igun4", userRole: "Karyawan Cabang", userEmail: "igunnawan27@gmail.com", userBranch: "Astra Daihatsu Motor - Cibinong", userPhone: "085959913764" },
    ]);

    const [filteredUsers, setFilteredUsers] = useState<User[]>(users);

    const columns = [
        { key: "userId", label: "No", alwaysVisible: true },
        { key: "userName", label: "Nama User", alwaysVisible: true },
        { key: "userRole", label: "Role User", alwaysVisible: true },
        { key: "userEmail", label: "Email User", alwaysVisible: true },
        { key: "userBranch", label: "Branch User" },
        { key: "userPhone", label: "Phone User" },
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
            user.userPhone.toLowerCase().includes(query.toLowerCase())
        );
    
        setFilteredUsers(filtered);
    };

    return (
        <div className="px-8 py-24 w-full max-h-full">
            <Upper title="Request Outbound" />
            <div className="mt-5">
                <div className="flex justify-end items-end">
                    <Link href="/dashboard/requestoutbound/create">
                        <button className="bg-[#202B51] p-4 rounded-lg hover:opacity-90">
                            <span className="text-white font-sans font-bold">Create New Request Outbound</span>
                        </button>
                    </Link>
                </div>
            </div>
            <div className="mt-5">
                <Search
                    placeholder="Cari Email User/Branch User/Dll"
                    onSearch={handleSearch} 
                />
            </div>
            <div className="mt-5">
                { filteredUsers.length > 0 ? (
                    <DataTable
                        columns={columns}
                        data={filteredUsers}
                        actions={[
                            {
                                label: <IoEyeSharp className="text-[#202B51]" />,
                                href: (row) => `/dashboard/requestoutbound/view/${row.userId}`,
                                className: "rounded-full hover:bg-blue-200 p-1 text-white text-md mx-2",
                            },
                            {
                                label:  <IoReaderSharp className="text-[#202B51]" />,
                                href: (row) => `/dashboard/requestoutbound/edit/${row.userId}`,
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
    )
}

export default RequestOutboundPage;