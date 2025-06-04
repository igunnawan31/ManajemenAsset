"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import TableUser from "../../usercomponent/TableUser";
import Pagination from "../../usercomponent/PaginationUser";

interface Ticket {

}
type User = {
    userId: string;
    userName: string;
    userRole: string;
    userEmail: string;
    userBranch: string;
    userPhone: string;
};

const ticketInboundView = () => {
    const { ticketid } = useParams();
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedFilters, setSelectedFilters] = useState<{ [key: string]: string | null }>({});
    const totalItems = 500;
    const [itemsPerPage, setItemsPerPage] = useState(25);
    const [currentPage, setCurrentPage] = useState(1);
    const router = useRouter();
    const [ticket, setTicket] = useState<Ticket | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

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

    const back = () => {
        router.push("/userdashboard/inbound");
    }

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

    const handleFilterChange = (type: string, value: string | null) => {
        setSelectedFilters((prev) => ({ ...prev, [type]: value }));
    };

    return (
        <div className="mt-5 px-6 w-full h-full ">
            <button onClick={back} className="text-white cursor-pointer px-5 bg-[#20458A] hover:bg-opacity-80 p-5 rounded-lg">&lt; Back</button>
            <div className="w-full mt-10 flex justify-start items-center">
                <div className="text-gray-400">
                    Ticket Number
                </div>
                <div className="bg-[#20458A] p-5 ml-10 text-white font-bold">
                    TN-001-200
                </div>
            </div>
            <div className="mt-5 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-[#20458A]">Username</label>
                        <input
                            type="text"
                            className="mt-1 p-2 border w-full rounded-md border-[#20458A]"
                            placeholder="Enter username"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[#20458A]">Email</label>
                        <input
                            type="email"
                            className="mt-1 p-2 border w-full rounded-md border-[#20458A]"
                            placeholder="Enter email"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[#20458A]">Email</label>
                        <input
                            type="email"
                            className="mt-1 p-2 border w-full rounded-md border-[#20458A]"
                            placeholder="Enter email"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[#20458A]">Email</label>
                        <input
                            type="email"
                            className="mt-1 p-2 border w-full rounded-md border-[#20458A]"
                            placeholder="Enter email"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[#20458A]">Email</label>
                        <input
                            type="email"
                            className="mt-1 p-2 border w-full rounded-md border-[#20458A]"
                            placeholder="Enter email"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[#20458A]">Email</label>
                        <input
                            type="email"
                            className="mt-1 p-2 border w-full rounded-md border-[#20458A]"
                            placeholder="Enter email"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[#20458A]">Email</label>
                        <input
                            type="email"
                            className="mt-1 p-2 border w-full rounded-md border-[#20458A]"
                            placeholder="Enter email"
                        />
                    </div>
                </div>
            </div>
            <div className="w-full mt-10 flex justify-start items-center">
                <div className="text-gray-400">
                    Details ticket on Asset
                </div>
            </div>
            <div className="py-5">
                {filteredUsers.length > 0 ? (
                        <TableUser columns={columns} data={filteredUsers} />
                    ) : (
                        <div className="text-center text-gray-500  text-lg mt-5">No data available</div>
                    )
                }
            </div>
            <Pagination
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={setItemsPerPage}
            />
        </div>
        
    )
}

export default ticketInboundView;