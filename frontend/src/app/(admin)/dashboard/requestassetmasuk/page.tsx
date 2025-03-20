"use client";

import { useState, useEffect } from "react";
import Upper from "../components/Upper";
import Search from "../components/Search";
import DataTable from "../components/DataTable";
import { IoEyeSharp, IoReaderSharp, IoTrash } from "react-icons/io5";

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

const RequestAssetMasukPage = () => {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [activeTab, setActiveTab] = useState("tiketmasuk");
    const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedFilters, setSelectedFilters] = useState<{ [key: string]: string | null }>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [tiketMasuk, setTiketMasuk] = useState<Ticket[]>([]);
    const [ditolak, setDitolak] = useState<Ticket[]>([]);
    const [diterima, setDiterima] = useState<Ticket[]>([]);
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
                console.log("Fetched data:", data); // Check API response
                setTickets(data);
                setTiketMasuk(data.filter(ticket => ticket.approvalStatus === "Pending" && ticket.moveStatus === "Not_Started"));
                setDitolak(data.filter(ticket => ticket.approvalStatus === "Rejected" && ticket.moveStatus === "Not_Started"));
                setDiterima(data.filter(ticket => ticket.approvalStatus === "Approved" && ticket.moveStatus === "Not_Started"));
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
                        <Search placeholder="Cari Id Asset / Nama Asset / Type Asset / Status Asset / ..." onSearch={handleSearch} />
                        <div className="mt-5">
                            {tiketMasuk.length > 0 ? (
                                <DataTable
                                    columns={columns}
                                    data={tiketMasuk}
                                    actions={[
                                        {
                                            label: <IoEyeSharp className="text-[#202B51]" />,
                                            href: (row) => `/dashboard/requestassetmasuk/view/${row.id}`,
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

                {activeTab === "ditolak" && (
                    <div className="mt-5">
                        <Search placeholder="Cari Id Asset / Nama Asset / Type Asset / Status Asset / ..." onSearch={handleSearch} />
                        <div className="mt-5">
                            {ditolak.length > 0 ? (
                                <DataTable
                                    columns={columns}
                                    data={ditolak}
                                    actions={[
                                        {
                                            label: <IoEyeSharp className="text-[#202B51]" />,
                                            href: (row) => `/dashboard/requestassetmasuk/view/${row.id}`,
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

                {activeTab === "diterima" && (
                    <div className="mt-5">
                        <Search placeholder="Cari Id Asset / Nama Asset / Type Asset / Status Asset / ..." onSearch={handleSearch} />
                        <div className="mt-5">
                            {diterima.length > 0 ? (
                                <DataTable
                                    columns={columns}
                                    data={diterima}
                                    actions={[
                                        {
                                            label: <IoEyeSharp className="text-[#202B51]" />,
                                            href: (row) => `/dashboard/requestassetmasuk/view/${row.id}`,
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
            </div>
        </div>
    );
};

export default RequestAssetMasukPage;
