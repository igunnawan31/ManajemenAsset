"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Search from "../components/Search";
import DataTable from "../components/DataTable";
import Upper from "../components/Upper";
import { IoEyeSharp, IoReaderSharp, IoTrash, IoCar } from "react-icons/io5";

interface Ticket {
    ticketNumber: string;
    branchOrigin: string;
    branchDestination: string;
    outboundDate: string;
    inboundDate: string;
    dateRequested: string;
    approvalStatus: string;
    moveStatus: string;
}

interface AssetMove {
    id: string;
    ticketNumber: string;
    assetNumber: string;
    moveStatus: string;
    ticket: string;
    asset: string;
}

const RequestOutboundPage = () => {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [activeTab, setActiveTab] = useState("createrequestoutbound");
    const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedFilters, setSelectedFilters] = useState<{ [key: string]: string | null }>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [createRequest, setCreateRequest] = useState<Ticket[]>([]);
    const [draft, setDraft] = useState<Ticket[]>([]);
    const [delivery, setDelivery] = useState<Ticket[]>([]);
    const [userBranch, setUserBranch] = useState<string | null>(null);
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
        const userId = localStorage.getItem("userId");
        if (userId) {
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/by-id/${userId}`)
                .then(response => response.json())
                .then(userData => {
                    setUserBranch(userData.userBranch);
                })
                .catch(error => {
                    console.error('Error fetching user data:', error);
                });
        }
    }, []);

    useEffect(() => {
        if (userBranch) {
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
                        ticket.branchOrigin === userBranch
                    );
                    
                    console.log("Filtered Data:", filteredData);
                    setTickets(filteredData);
                    setDelivery(filteredData.filter(ticket => ticket.approvalStatus === "Approved"));
                    setCreateRequest(filteredData);
                    setDraft(filteredData.filter(ticket => ticket.approvalStatus === "Draft"));
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
        let filtered = tickets;
        if (searchQuery.trim()) {
            filtered = tickets.filter((ticket) =>
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

        setFilteredTickets(filtered);
    }, [searchQuery, selectedFilters, tickets]);
    
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
        <div className="px-8 py-24 w-full max-h-full">
            <Upper title="Request Outboundound" />
            <div className="mt-5">
                <div className="flex justify-end items-end">
                    <Link href="/dashboard/requestoutbound/create">
                        <button className="bg-[#202B51] p-4 rounded-lg hover:opacity-90">
                            <span className="text-white font-sans font-bold">Create New Request Outboundound</span>
                        </button>
                    </Link>
                </div>
            </div>
            <div className="flex w-full mt-5 justify-between poppins text-xs">
                {["createrequestoutbound", "draft", "delivery"].map((tab) => (
                    <button
                        key={tab}
                        className={`py-6 px-6 w-full border-b-2  ${activeTab === tab ? "bg-[#202B51] text-white" : "text-black hover:bg-gray-100"}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab === "createrequestoutbound" ? "Create New Ticket Outbound" : tab === "draft" ? "Draft Outbound Ticket" : "Delivery"}
                    </button>
                ))}
            </div>
            {activeTab === "createrequestoutbound" && (
                <div className="mt-5">
                    <Search placeholder="Cari Id Asset / Nama Asset / Type Asset / Status Asset / ..." onSearch={handleSearch} />
                    <div className="mt-5">
                        {createRequest.length > 0 ? (
                            <DataTable
                                columns={columns}
                                data={createRequest}
                                actions={[
                                    {
                                        label: <IoEyeSharp className="text-[#202B51]" />,
                                        href: (row) => `/dashboard/pengecekanassetmasuk/view/${row.id}`,
                                        className: "rounded-full hover:bg-blue-200 p-1 text-white text-md mx-2",
                                    },
                                ]}
                            />
                        ) : (
                            <div className="text-center text-gray-500 font-poppins text-lg mt-5">No data available</div>
                        )}
                    </div>
                </div>
            )}
            {activeTab === "draft" && (
                <div className="mt-5">
                    <Search placeholder="Cari Id Asset / Nama Asset / Type Asset / Status Asset / ..." onSearch={handleSearch} />
                    <div className="mt-5">
                        {draft.length > 0 ? (
                            <DataTable
                                columns={columns}
                                data={draft}
                                actions={[
                                    {
                                        label: <IoEyeSharp className="text-[#202B51]" />,
                                        href: (row) => `/dashboard/requestoutbound/view/${row.id}`,
                                        className: "rounded-full hover:bg-blue-200 p-1 text-white text-md mx-2",
                                    },
                                    {
                                        label: <IoReaderSharp className="text-[#202B51]" />,
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
            )}
            {activeTab === "delivery" && (
                <div className="mt-5">
                    <Search placeholder="Cari Id Asset / Nama Asset / Type Asset / Status Asset / ..." onSearch={handleSearch} />
                    <div className="mt-5">
                        {delivery.length > 0 ? (
                            <DataTable
                                columns={columns}
                                data={delivery}
                                actions={[
                                    {
                                        label: <IoCar className="text-[#202B51]" />,
                                        href: (row) => `/dashboard/requestoutbound/delivery/${row.id}`,
                                        className: "rounded-full hover:bg-blue-200 p-1 text-white text-md mx-2",
                                    }
                                ]}
                            />
                        ) : (
                            <div className="text-center text-gray-500 font-poppins text-lg mt-5">No data available</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default RequestOutboundPage;