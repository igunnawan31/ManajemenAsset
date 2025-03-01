"use client";

import { useState, useEffect } from "react";
import TableUser from "../usercomponent/TableUser";
import SearchUser from "../usercomponent/SearchUser";
import FilterDropdown from "../usercomponent/Filter";

type User = {
    userId: string;
    userName: string;
    userRole: string;
    userEmail: string;
    userBranch: string;
    userPhone: string;
};

const InboundPage = () => {
    const [activeTab, setActiveTab] = useState("inbound");
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedFilters, setSelectedFilters] = useState<{ [key: string]: string | null }>({});
    
    
    const deleteCookie = (name: string) => {
        document.cookie = `${name}=; path=/; domain=${window.location.hostname}; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=None; Secure`;
    };

    const logout = () => {
        deleteCookie("token");
        deleteCookie("jwt");
        deleteCookie("userSubRole");
    
        localStorage.removeItem("token");
        localStorage.removeItem("userSubRole");
        localStorage.removeItem("ally-supports-cache");
        sessionStorage.clear();
    
        setTimeout(() => {
            window.location.replace("/logout"); // Use replace() instead of href
        }, 500);
    };

    const users: User[] = [
        { userId: "1", userName: "igun", userRole: "Admin Pusat", userEmail: "igunnawan24@gmail.com", userBranch: "Astra International - Pusat", userPhone: "085959913761" },
        { userId: "2", userName: "igun2", userRole: "Admin Cabang", userEmail: "igunnawan25@gmail.com", userBranch: "Astra Daihatsu Motor - Perum", userPhone: "085959913762" },
    ];

    const columns = [
        { key: "userId", label: "No", alwaysVisible: true },
        { key: "userName", label: "Nama User", alwaysVisible: true },
        { key: "userRole", label: "Role User" },
        { key: "userEmail", label: "Email User" },
        { key: "userBranch", label: "Branch User" },
        { key: "userPhone", label: "Phone User" },
    ];

    useEffect(() => {
        let filtered = users.filter((user) =>
            user.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.userBranch.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.userPhone.toLowerCase().includes(searchQuery.toLowerCase())
        );

        Object.keys(selectedFilters).forEach((filterType) => {
            const filterValue = selectedFilters[filterType];
            if (filterValue) {
                filtered = filtered.filter((user) => (user as any)[filterType] === filterValue);
            }
        });

        setFilteredUsers(filtered);
    }, [searchQuery, selectedFilters]);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    const handleFilterChange = (type: string, value: string | null) => {
        setSelectedFilters((prev) => ({ ...prev, [type]: value }));
    };

    return (
        <div className="w-full rounded-lg shadow-lg bg-white py-2">
            <div className="flex w-full mt-5 justify-between px-6 poppins text-xs">
                {["inbound", "pemeriksaan", "selesai"].map((tab) => (
                    <button
                        key={tab}
                        className={`py-6 px-6 w-full border-b-2 ${activeTab === tab ? "bg-[#20458A] text-white" : "text-black hover:bg-gray-100"}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab === "inbound" ? "Inbound Masuk" : tab === "pemeriksaan" ? "Dalam Pemeriksaan" : "Pemeriksaan Selesai"}
                    </button>
                ))}
            </div>

            {activeTab === "inbound" && (
                <div className="mt-5 px-6 flex justify-between gap-3">
                    <div className="w-1/2">
                        <SearchUser placeholder="Cari Email User/Branch User/Dll" onSearch={handleSearch} />
                    </div>

                    <div onClick={logout}>
                        logout
                        </div>
                    
                    <div className="w-1/2 flex items-center justify-end">
                        <FilterDropdown
                            filters={[
                                {
                                    type: "userRole",
                                    label: "Role",
                                    options: [
                                        { label: "All Roles", value: "" },
                                        { label: "Admin Pusat", value: "Admin Pusat" },
                                        { label: "Admin Cabang", value: "Admin Cabang" },
                                    ],
                                },
                                {
                                    type: "userBranch",
                                    label: "Branch",
                                    options: [
                                        { label: "All Branches", value: "" },
                                        { label: "Astra International - Pusat", value: "Astra International - Pusat" },
                                        { label: "Astra Daihatsu Motor - Perum", value: "Astra Daihatsu Motor - Perum" },
                                    ],
                                },
                            ]}
                            onSelect={handleFilterChange}
                        />
                    </div>
                </div>
            )}

            {activeTab === "pemeriksaan" && (
                <div className="mt-5 px-6 flex justify-between gap-3">
                    <div className="w-1/2">
                        <SearchUser placeholder="Cari Email User/Branch User/Dll" onSearch={handleSearch} />
                    </div>

                    <div className="w-1/2 flex items-center justify-end">
                        <FilterDropdown
                            filters={[
                                {
                                    type: "userRole",
                                    label: "Role",
                                    options: [
                                        { label: "All Roles", value: "" },
                                        { label: "Admin Pusat", value: "Admin Pusat" },
                                        { label: "Admin Cabang", value: "Admin Cabang" },
                                    ],
                                },
                                {
                                    type: "userBranch",
                                    label: "Branch",
                                    options: [
                                        { label: "All Branches", value: "" },
                                        { label: "Astra International - Pusat", value: "Astra International - Pusat" },
                                        { label: "Astra Daihatsu Motor - Perum", value: "Astra Daihatsu Motor - Perum" },
                                    ],
                                },
                            ]}
                            onSelect={handleFilterChange}
                        />
                    </div>
                </div>
            )}

            {activeTab === "selesai" && (
                <div className="mt-5 px-6 flex justify-between gap-3">
                    <div className="w-1/2">
                        <SearchUser placeholder="Cari Email User/Branch User/Dll" onSearch={handleSearch} />
                    </div>

                    <div className="w-1/2 flex items-center justify-end">
                        <FilterDropdown
                            filters={[
                                {
                                    type: "userRole",
                                    label: "Role",
                                    options: [
                                        { label: "All Roles", value: "" },
                                        { label: "Admin Pusat", value: "Admin Pusat" },
                                        { label: "Admin Cabang", value: "Admin Cabang" },
                                    ],
                                },
                                {
                                    type: "userBranch",
                                    label: "Branch",
                                    options: [
                                        { label: "All Branches", value: "" },
                                        { label: "Astra International - Pusat", value: "Astra International - Pusat" },
                                        { label: "Astra Daihatsu Motor - Perum", value: "Astra Daihatsu Motor - Perum" },
                                    ],
                                },
                            ]}
                            onSelect={handleFilterChange}
                        />
                    </div>
                </div>
            )}

            <div className="p-5">
                {activeTab === "inbound" && (
                    filteredUsers.length > 0 ? (
                        <TableUser columns={columns} data={filteredUsers} />
                    ) : (
                        <div className="text-center text-gray-500 font-poppins text-lg mt-5">No data available</div>
                    )
                )}
                {activeTab === "pemeriksaan" && (
                    filteredUsers.length > 0 ? (
                        <TableUser columns={columns} data={filteredUsers} />
                    ) : (
                        <div className="text-center text-gray-500 font-poppins text-lg mt-5">No data available</div>
                    )
                )}
                {activeTab === "selesai" && (
                    filteredUsers.length > 0 ? (
                        <TableUser columns={columns} data={filteredUsers} />
                    ) : (
                        <div className="text-center text-gray-500 font-poppins text-lg mt-5">No data available</div>
                    )
                )}
            </div>
        </div>
    );
};

export default InboundPage;
