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

const RequestInboundPage = () => {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [activeTab, setActiveTab] = useState("createrequestinbound");
    const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedFilters, setSelectedFilters] = useState<{ [key: string]: string | null }>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [createRequest, setCreateRequest] = useState<Ticket[]>([]);
    const [draft, setDraft] = useState<Ticket[]>([]);
    const [delivery, setDelivery] = useState<Ticket[]>([]);
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
                    console.log("Fetched Data:", data);
                    setTickets(data);
                    setDelivery(data.filter(ticket => ticket.approvalStatus === "Approved"));
                    setCreateRequest(data);
                    setDraft(data.filter(ticket => ticket.approvalStatus === "Draft"));
                    console.log("Delivery Data:", data.filter(ticket => ticket.approvalStatus === "Approved")); // Log filtered data
                    setLoading(false);
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                    setError('Failed to fetch data. Please try again later.');
                    setLoading(false);
                });
        }, []);

    useEffect(() => {
        let filtered = tickets;
        if (searchQuery.trim()) {
                let filtered = tickets.filter((ticket) =>
                ticket.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
        <div className="px-8 py-24 w-full max-h-full">
            <Upper title="Request Inbound" />
            <div className="mt-5">
                <div className="flex justify-end items-end">
                    <Link href="/dashboard/requestinbound/create">
                        <button className="bg-[#202B51] p-4 rounded-lg hover:opacity-90">
                            <span className="text-white font-sans font-bold">Create New Request Inbound</span>
                        </button>
                    </Link>
                </div>
            </div>
            <div className="flex w-full mt-5 justify-between poppins text-xs">
                {["createrequestinbound", "draft", "delivery"].map((tab) => (
                    <button
                        key={tab}
                        className={`py-6 px-6 w-full border-b-2  ${activeTab === tab ? "bg-[#202B51] text-white" : "text-black hover:bg-gray-100"}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab === "createrequestinbound" ? "Create New Ticket Inbound" : tab === "draft" ? "Draft Inbound Ticket" : "Delivery"}
                    </button>
                ))}
            </div>
            {activeTab === "createrequestinbound" && (
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
                                        href: (row) => `/dashboard/requestinbound/view/${row.id}`,
                                        className: "rounded-full hover:bg-blue-200 p-1 text-white text-md mx-2",
                                    },
                                    {
                                        label: <IoReaderSharp className="text-[#202B51]" />,
                                        href: (row) => `/dashboard/requestinbound/edit/${row.userId}`,
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
                                        href: (row) => `/dashboard/requestinbound/delivery/${row.id}`,
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

export default RequestInboundPage;