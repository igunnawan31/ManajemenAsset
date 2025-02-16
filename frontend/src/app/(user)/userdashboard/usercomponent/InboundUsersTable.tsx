"use client";

import { useState } from "react";

interface User {
    userId: string;
    userName: string;
    userRole: string;
    userEmail: string;
    userBranch: string;
    userPhone: string;
}

const usersData: User[] = [
    { userId: "1", userName: "igun", userRole: "Admin Pusat", userEmail: "igunnawan24@gmail.com", userBranch: "Astra International - Pusat", userPhone: "085959913761" },
    { userId: "2", userName: "igun2", userRole: "Admin Cabang", userEmail: "igunnawan25@gmail.com", userBranch: "Astra Daihatsu Motor - Perum", userPhone: "085959913762" },
    { userId: "3", userName: "igun3", userRole: "Karyawan Pusat", userEmail: "igunnawan26@gmail.com", userBranch: "Astra International - Pusat", userPhone: "085959913763" },
    { userId: "4", userName: "igun4", userRole: "Karyawan Cabang", userEmail: "igunnawan27@gmail.com", userBranch: "Astra Daihatsu Motor - Cibinong", userPhone: "085959913764" },
];

const InboundUsersTable = () => {
    const [filteredUsers, setFilteredUsers] = useState<User[]>(usersData);
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        if (!query.trim()) {
            setFilteredUsers(usersData);
            return;
        }

        setFilteredUsers(usersData.filter(user =>
            user.userName.toLowerCase().includes(query.toLowerCase()) ||
            user.userEmail.toLowerCase().includes(query.toLowerCase()) ||
            user.userBranch.toLowerCase().includes(query.toLowerCase()) ||
            user.userPhone.toLowerCase().includes(query.toLowerCase())
        ));
    };

    return (
        <div className="w-full rounded-lg shadow-lg bg-white py-10 px-5">
            <div className="w-full flex justify-between border-b-2 py-4">
                <h2 className="text-lg font-semibold">Inbound Users</h2>
                <input
                    type="text"
                    placeholder="Search a User"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="border rounded-lg px-3 py-2 w-64"
                />
            </div>
            <div className="mt-5">
                {filteredUsers.length > 0 ? (
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-200 text-left">
                                <th className="p-2">No</th>
                                <th className="p-2">Nama User</th>
                                <th className="p-2">Role User</th>
                                <th className="p-2">Email User</th>
                                <th className="p-2">Branch User</th>
                                <th className="p-2">Phone User</th>
                                <th className="p-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user, index) => (
                                <tr key={user.userId} className="border-t text-center">
                                    <td className="p-2">{index + 1}</td>
                                    <td className="p-2">{user.userName}</td>
                                    <td className="p-2">{user.userRole}</td>
                                    <td className="p-2">{user.userEmail}</td>
                                    <td className="p-2">{user.userBranch}</td>
                                    <td className="p-2">{user.userPhone}</td>
                                    <td className="p-2 flex justify-center gap-2">
                                        <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-800">View</button>
                                        <button className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500">Update</button>
                                        <button className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="text-center text-gray-500 text-lg mt-5">No users found</div>
                )}
            </div>
        </div>
    );
};

export default InboundUsersTable;
