"use client";

import { useState, useEffect } from "react";
import Upper from "../components/Upper";
import Search from "../components/Search";
import DataTable from "../components/DataTable";
import { IoCar, IoEyeSharp, IoReaderSharp, IoTrash } from "react-icons/io5";

interface Ticket {
    ticketNumber: string;
    branchOrigin: string;
    branchDestination: string;
    outboundDate: string;
    inboundDate: string;
    dateRequested: string;
    approvalStatus: string;
    moveStatus: string;
    receivedBy: string;
    requestedBy: string;
}

interface Branch {
    branchId: string;
    branchName: string;
}

type UserResponseDTO = {
    userId: string;
    userName: string;
    userEmail: string;
    userBranch: string;
    userPhone: string;
    userRole: string;
    userSubRole: string;
};

const PengecekanAssetKeluarPage = () => {
    const [users, setUsers] = useState<UserResponseDTO | null>(null);
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [activeTab, setActiveTab] = useState("notstarted");
    const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedFilters, setSelectedFilters] = useState<{ [key: string]: string | null }>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [notStarted, setNotStarted] = useState<Ticket[]>([]);
    const [inProgress, setInProgress] = useState<Ticket[]>([]);
    const [completed, setCompleted] = useState<Ticket[]>([]);
    const [userBranch, setUserBranch] = useState<string | null>(null);
    const [branches, setBranches] = useState<Branch[]>([]);
    const itemsPerPage = 5;

    const columns = [
        { key: "ticketNumber", label: "ticketNumber", alwaysVisible: true },
        { key: "branchOrigin", label: "Branch Origin", alwaysVisible: true },
        { key: "branchDestination", label: "Branch Destination", alwaysVisible: true },
        { key: "outboundDate", label: "Outbound Date" },
        { key: "inboundDate", label: "Inbound Date" },
        { key: "dateRequested", label: "Date Requested" },
        { key: "approvalStatus", label: "Approval Status" },
        { key: "moveStatus", label: "Move Status" },
    ];

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
            } finally {
                setLoading(false);
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
        if (!users) return;
    
        const fetchTickets = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ticket/index`);
                if (!response.ok) throw new Error("Failed to fetch tickets");
    
                const data: Ticket[] = await response.json();
                setTickets(data);
    
                setNotStarted(data.filter(ticket =>
                    ticket.approvalStatus === "Approved" &&
                    ticket.moveStatus === "Not_Started" &&
                    ticket.receivedBy === users.userBranch &&
                    ticket.branchOrigin === users.userBranch
                ));
    
                setInProgress(data.filter(ticket =>
                    ticket.approvalStatus === "Approved" &&
                    ticket.moveStatus === "In_Progress" &&
                    ticket.receivedBy === users.userBranch &&
                    ticket.branchOrigin === users.userBranch
                ));
    
                setCompleted(data.filter(ticket =>
                    ticket.approvalStatus === "Approved" &&
                    ticket.moveStatus === "Completed" &&
                    ticket.receivedBy === users.userBranch &&
                    ticket.branchOrigin === users.userBranch
                ));
            } catch (error) {
                console.error("Error fetching tickets:", error);
                setError("Failed to fetch data. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
    
        fetchTickets();
    }, [users]);

    useEffect(() => {
        let filtered = tickets;
        if (searchQuery.trim()) {
                let filtered = tickets.filter((ticket) =>
                ticket.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                ticket.branchOrigin.toLowerCase().includes(searchQuery.toLowerCase()) ||
                ticket.branchDestination.toLowerCase().includes(searchQuery.toLowerCase()) ||
                ticket.approvalStatus.toLowerCase().includes(searchQuery.toLowerCase()) ||
                ticket.moveStatus.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        Object.keys(selectedFilters).forEach((filterType) => {
            const filterValue = selectedFilters[filterType];
            if (filterValue) {
                filtered = filtered.filter((user) => (user as any)[filterType] === filterValue);
            }
        });

        setFilteredTickets(filtered);
    }, [searchQuery, selectedFilters]);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    const handleFilterChange = (type: string, value: string | null) => {
        setSelectedFilters((prev) => ({ ...prev, [type]: value }));
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentTickets = filteredTickets.slice(indexOfFirstItem, indexOfLastItem);
  
    const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);
  
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div className="px-8 py-24 text-[#202B51] w-full max-h-full">
            <Upper title="Pengecekan Asset Keluar" />
            <div className="mt-5">
                <div className="flex w-full mt-5 justify-between  text-xs">
                    {["notstarted", "inprogress", "completed"].map((tab) => (
                        <button
                            key={tab}
                            className={`py-6 px-6 w-full border-b-2  ${activeTab === tab ? "bg-[#202B51] text-white" : "text-black hover:bg-gray-100"}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab === "notstarted" ? "Belum Dikirim" : tab === "inprogress" ? "Sedang Dalam Perjalanan" : "Accept Ticket"}
                        </button>
                    ))}
                </div>

                {activeTab === "notstarted" && (
                    <div className="mt-5">
                        <Search placeholder="Cari Id Asset / Nama Asset / Type Asset / Status Asset / ..." onSearch={handleSearch} />
                        <div className="mt-5">
                            {notStarted.length > 0 ? (
                                <DataTable
                                    columns={columns}
                                    data={notStarted}
                                    actions={[
                                        {
                                            label: <IoCar className="text-[#202B51]" />,
                                            href: (row) => `/dashboard/pengecekanassetkeluar/delivery/${row.ticketNumber}`,
                                            className: "rounded-full hover:bg-blue-200 p-1 text-white text-md mx-2",
                                        },
                                    ]}
                                />
                            ) : (
                                <div className="text-center text-gray-500  text-lg mt-5">No data available</div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === "inprogress" && (
                    <div className="mt-5">
                        <Search placeholder="Cari Id Asset / Nama Asset / Type Asset / Status Asset / ..." onSearch={handleSearch} />
                        <div className="mt-5">
                            {inProgress.length > 0 ? (
                                <DataTable
                                    columns={columns}
                                    data={inProgress}
                                    actions={[
                                        {
                                            label: <IoEyeSharp className="text-[#202B51]" />,
                                            href: (row) => `/dashboard/pengecekanassetkeluar/view/${row.ticketNumber}`,
                                            className: "rounded-full hover:bg-blue-200 p-1 text-white text-md mx-2",
                                        },
                                    ]}
                                />
                            ) : (
                                <div className="text-center text-gray-500  text-lg mt-5">No data available</div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === "completed" && (
                    <div className="mt-5">
                        <Search placeholder="Cari Id Asset / Nama Asset / Type Asset / Status Asset / ..." onSearch={handleSearch} />
                        <div className="mt-5">
                            {completed.length > 0 ? (
                                <DataTable
                                    columns={columns}
                                    data={completed}
                                    actions={[
                                        {
                                            label: <IoEyeSharp className="text-[#202B51]" />,
                                            href: (row) => `/dashboard/pengecekanassetkeluar/view/${row.ticketNumber}`,
                                            className: "rounded-full hover:bg-blue-200 p-1 text-white text-md mx-2",
                                        },
                                    ]}
                                />
                            ) : (
                                <div className="text-center text-gray-500  text-lg mt-5">No data available</div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PengecekanAssetKeluarPage;
