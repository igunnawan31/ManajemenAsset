"use client";

import { useState, useEffect } from "react";
import Upper from "../components/Upper";
import Search from "../components/Search";
import DataTable from "../components/DataTable";
import { IoEyeSharp, IoReaderSharp, IoTrash, IoArrowForwardCircle, IoCafe, IoCar } from "react-icons/io5";

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

const RequestAssetMasukPage = () => {
    const [users, setUsers] = useState<UserResponseDTO | null>(null);
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [activeTab, setActiveTab] = useState("tiketmasuk");
    const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedFilters, setSelectedFilters] = useState<{ [key: string]: string | null }>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [createRequest, setCreateRequest] = useState<Ticket[]>([]);
    const [tiketMasuk, setTiketMasuk] = useState<Ticket[]>([]);
    const [ditolak, setDitolak] = useState<Ticket[]>([]);
    const [diterima, setDiterima] = useState<Ticket[]>([]);
    const [userBranch, setUserBranch] = useState<string | null>(null);
    const [branches, setBranches] = useState<Branch[]>([]);
    const itemsPerPage = 5;

    const [filteredTiketMasuk, setFilteredTiketMasuk] = useState<Ticket[]>(tiketMasuk);
    const [filteredDitolak, setFilteredDitolak] = useState<Ticket[]>(ditolak);
    const [filteredDiterima, setFilteredDiterima] = useState<Ticket[]>(diterima);

    const [currentPageTiket, setCurrentPageTiket] = useState<number>(1);
    const [currentPageReject, setCurrentPageReject] = useState<number>(1);
    const [currentPageAccept, setCurrentPageAccept] = useState<number>(1);
    const paginateData = (data: Ticket[], page: number): Ticket[] => {
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        return data.slice(start, end);
    };

    const columns = [
        { key: "ticketNumber", label: "ticketNumber", alwaysVisible: true },
        { key: "branchOrigin", label: "Branch Origin", alwaysVisible: true },
        { key: "branchDestination", label: "Branch Destination", alwaysVisible: true },
        { key: "outboundDate", label: "Outbound Date" },
        { key: "inboundDate", label: "Inbound Date" },
        { key: "dateRequested", label: "Date Requested" },
        { key: "approvalStatus", label: "Approval Status" },
        { key: "moveStatus", label: "Move Status" },
        { key: "receivedBy", label: "Received By" },
        { key: "requestedBy", label: "Requested By" },
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
        if (userBranch) {
            console.log("branch user", userBranch);
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/ticket/index`)
            .then((response) => {
                if (!response.ok) {
                    return response.text().then((text) => {
                        throw new Error(`Network response was not ok. Status: ${response.status}, ${text}`);
                    });
                }
                return response.json();
            })
            .then((data: Ticket[]) => {
                const filteredData = data.filter(ticket => 
                    ticket.branchDestination === userBranch
                );

                console.log("Fetched data:", filteredData);
                setTickets(filteredData);
                setTiketMasuk(filteredData.filter(ticket => ticket.approvalStatus === "Pending" && ticket.moveStatus === "Not_Started" && ticket.receivedBy == users?.userBranch && ticket.branchDestination === users?.userBranch));
                setDitolak(filteredData.filter(ticket => ticket.approvalStatus === "Rejected" && ticket.moveStatus === "Not_Started"  && ticket.receivedBy == users?.userBranch && ticket.branchDestination === users?.userBranch));
                setDiterima(filteredData.filter(ticket => ticket.approvalStatus === "Approved" && ticket.moveStatus === "Not_Started"  && ticket.receivedBy == users?.userBranch && ticket.branchDestination === users?.userBranch));
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                setError('Failed to fetch data. Please try again later.');
                setLoading(false);
            });
            }
        }, [userBranch]);

        useEffect(() => {
            const filterTickets = (tickets: Ticket[]) => {
            let filtered = [...tickets];
            
            if (searchQuery.trim()) {
                filtered = filtered.filter((ticket) =>
                    ticket.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    ticket.approvalStatus.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    ticket.moveStatus.toLowerCase().includes(searchQuery.toLowerCase())
                );
            }
        
            Object.keys(selectedFilters).forEach((filterType) => {
                const filterValue = selectedFilters[filterType];
                if (filterValue) {
                    filtered = filtered.filter((ticket) => (ticket as any)[filterType] === filterValue);
                }
            });
        
            return filtered;
            };
        
            setFilteredTiketMasuk(filterTickets(tiketMasuk));
            setFilteredDitolak(filterTickets(ditolak));
            setFilteredDiterima(filterTickets(diterima));
            
        }, [searchQuery, selectedFilters, tiketMasuk, ditolak, diterima]);

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
    const totalPagesTiketMasuk = Math.ceil(tiketMasuk.length / itemsPerPage);
    const totalPagesDitolak = Math.ceil(ditolak.length / itemsPerPage);
    const totalPagesDiterima = Math.ceil(diterima.length / itemsPerPage);
    
    const handlePageChangeTiketMasuk = (page: number) => {
        setCurrentPageTiket(page);
    };

    const handlePageChangeReject = (page: number) => {
        setCurrentPageReject(page);
    }

    const handlePageChangeAccept = (page: number) => {
        setCurrentPageAccept(page);
    }

    return (
        <div className="w-full max-h-full px-8 py-24">
            <Upper title="Request Asset Masuk" />
            <div className="mt-5">
                <div className="flex w-full mt-5 justify-between poppins text-xs">
                    {["tiketmasuk", "ditolak", "diterima"].map((tab) => (
                        <button
                            key={tab}
                            className={`py-6 px-6 w-full border-b-2  ${activeTab === tab ? "bg-[#202B51] text-white" : "text-black hover:bg-gray-100"}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab === "tiketmasuk" ? "Tiket Masuk" : tab === "ditolak" ? "Reject Ticket" : "Accept Ticket"}
                        </button>
                    ))}
                </div>

                {activeTab === "tiketmasuk" && (
                    <div className="mt-5">
                        <Search placeholder="Cari Ticket Number / Branch Origin / Branch Destination / Approval Status / ..." onSearch={handleSearch} />
                        <div className="mt-5">
                            {filteredTiketMasuk.length > 0 ? (
                                <>
                                    <DataTable
                                        columns={columns}
                                        data={paginateData(filteredTiketMasuk, currentPageTiket)}
                                        actions={[
                                            {
                                                label: <IoArrowForwardCircle className="text-[#202B51] text-2xl" />,
                                                href: (row) => `/dashboard/requestassetmasuk/action/${row.ticketNumber}`,
                                                className: "rounded-full hover:bg-blue-200 p-1 text-white text-md mx-2",
                                            },
                                        ]}
                                    />
                                    <div className="mt-5 flex justify-center items-center">
                                        <button
                                            className={`px-4 py-2 mx-1 rounded ${
                                                currentPageTiket === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-[#202B51] text-white hover:bg-blue-700"
                                            }`}
                                            onClick={() => handlePageChangeTiketMasuk(currentPageTiket - 1)}
                                            disabled={currentPageTiket === 1}
                                        >
                                            Previous
                                        </button>
                                        <div className="flex justify-center space-x-2">
                                            {Array.from({ length: Math.ceil(tiketMasuk.length / itemsPerPage) }, (_, index) => (
                                                <button
                                                    key={index + 1}
                                                    onClick={() => setCurrentPageTiket(index + 1)}
                                                    className={`px-4 py-2 mx-1 rounded ${currentPageTiket === index + 1 ? "bg-[#202B51] text-white" : "bg-gray-200 text-black"}`}
                                                >
                                                    {index + 1}
                                                </button>
                                            ))}
                                        </div>
                                        <button
                                            className={`px-4 py-2 mx-1 rounded ${
                                                currentPageTiket === totalPagesTiketMasuk ? "bg-gray-300 cursor-not-allowed" : "bg-[#202B51] text-white hover:bg-blue-700"
                                            }`}
                                            onClick={() => handlePageChangeTiketMasuk(currentPageTiket + 1)}
                                            disabled={currentPageTiket === totalPagesTiketMasuk}
                                        >
                                            Next
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center text-gray-500 font-poppins text-lg mt-5">
                                    {searchQuery || Object.keys(selectedFilters).length > 0 
                                    ? "No available data at this moment" 
                                    : "No data available"}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === "ditolak" && (
                    <div className="mt-5">
                        <Search placeholder="Cari Ticket Number / Branch Origin / Branch Destination / Approval Status / ..." onSearch={handleSearch} />
                        <div className="mt-5">
                            {filteredDitolak.length > 0 ? (
                                <>
                                    <DataTable
                                        columns={columns}
                                        data={paginateData(
                                            filteredDitolak.length > 0 ? filteredDitolak : ditolak, 
                                            currentPageReject
                                        )}
                                        actions={[
                                            {
                                                label: <IoEyeSharp className="text-[#202B51]" />,
                                                href: (row) => `/dashboard/requestassetmasuk/view/${row.ticketNumber}`,
                                                className: "rounded-full hover:bg-blue-200 p-1 text-white text-md mx-2",
                                            },
                                        ]}
                                    />
                                    <div className="mt-5 flex justify-center items-center">
                                    <button
                                        className={`px-4 py-2 mx-1 rounded ${
                                            currentPageReject === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-[#202B51] text-white hover:bg-blue-700"
                                        }`}
                                        onClick={() => handlePageChangeReject(currentPageReject - 1)}
                                        disabled={currentPageReject === 1}
                                    >
                                        Previous
                                    </button>
                                    <div className="flex justify-center space-x-2">
                                        {Array.from({ length: Math.ceil(ditolak.length / itemsPerPage) }, (_, index) => (
                                            <button
                                                key={index + 1}
                                                onClick={() => setCurrentPageReject(index + 1)}
                                                className={`px-4 py-2 mx-1 rounded ${currentPageReject === index + 1 ? "bg-[#202B51] text-white" : "bg-gray-200 text-black"}`}
                                            >
                                                {index + 1}
                                            </button>
                                        ))}
                                    </div>
                                    <button
                                        className={`px-4 py-2 mx-1 rounded ${
                                            currentPageReject === totalPagesDitolak ? "bg-gray-300 cursor-not-allowed" : "bg-[#202B51] text-white hover:bg-blue-700"
                                        }`}
                                        onClick={() => handlePageChangeReject(currentPageReject + 1)}
                                        disabled={currentPageReject === totalPagesDitolak}
                                    >
                                        Next
                                    </button>
                                </div>
                                </>
                            ) : (
                                <div className="text-center text-gray-500 font-poppins text-lg mt-5">
                                    {searchQuery || Object.keys(selectedFilters).length > 0 
                                    ? "No available data at this moment" 
                                    : "No data available"}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === "diterima" && (
                    <div className="mt-5">
                        <Search placeholder="Cari Ticket Number / Branch Origin / Branch Asset / Approval Status / ..." onSearch={handleSearch} />
                        <div className="mt-5">
                            {filteredDiterima.length > 0 ? (
                                <>
                                    <DataTable
                                        columns={columns}
                                        data={paginateData(
                                            filteredDiterima.length > 0 ? filteredDiterima : diterima, 
                                            currentPageAccept
                                        )}
                                        actions={[
                                            {
                                                label: <IoEyeSharp className="text-[#202B51]" />,
                                                href: (row) => `/dashboard/requestassetmasuk/view/${row.ticketNumber}`,
                                                className: "rounded-full hover:bg-blue-200 p-1 text-white text-md mx-2",
                                            },
                                        ]}
                                    />
                                    <div className="mt-5 flex justify-center items-center">
                                    <button
                                        className={`px-4 py-2 mx-1 rounded ${
                                            currentPageAccept === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-[#202B51] text-white hover:bg-blue-700"
                                        }`}
                                        onClick={() => handlePageChangeAccept(currentPageAccept - 1)}
                                        disabled={currentPageAccept === 1}
                                    >
                                        Previous
                                    </button>
                                    <div className="flex justify-center space-x-2">
                                        {Array.from({ length: Math.ceil(diterima.length / itemsPerPage) }, (_, index) => (
                                            <button
                                                key={index + 1}
                                                onClick={() => setCurrentPageAccept(index + 1)}
                                                className={`px-4 py-2 mx-1 rounded ${currentPageAccept === index + 1 ? "bg-[#202B51] text-white" : "bg-gray-200 text-black"}`}
                                            >
                                                {index + 1}
                                            </button>
                                        ))}
                                    </div>
                                    <button
                                        className={`px-4 py-2 mx-1 rounded ${
                                            currentPageAccept === totalPagesDiterima ? "bg-gray-300 cursor-not-allowed" : "bg-[#202B51] text-white hover:bg-blue-700"
                                        }`}
                                        onClick={() => handlePageChangeAccept(currentPageAccept + 1)}
                                        disabled={currentPageAccept === totalPagesDiterima}
                                    >
                                        Next
                                    </button>
                                </div>
                                </>
                            ) : (
                                <div className="text-center text-gray-500 font-poppins text-lg mt-5">
                                    {searchQuery || Object.keys(selectedFilters).length > 0 
                                    ? "No available data at this moment" 
                                    : "No data available"}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RequestAssetMasukPage;
