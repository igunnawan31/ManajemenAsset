"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Search from "../components/Search";
import DataTable from "../components/DataTable";
import Upper from "../components/Upper";
import { IoEyeSharp, IoReaderSharp, IoTrash, IoCar, IoCloseCircleSharp, IoCheckmarkCircle } from "react-icons/io5";
import PopUpModal from "../components/PopUpModal";

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

interface AssetMove {
    id: string;
    ticketNumber: string;
    assetNumber: string;
    moveStatus: string;
    ticket: string;
    asset: string;
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

interface Branch {
    branchId: string;
    branchName: string;
}

const RequestOutboundPage = () => {
    const [users, setUsers] = useState<UserResponseDTO | null>(null);
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
    const [branches, setBranches] = useState<Branch[]>([]);
    const itemsPerPage = 5;

    const [ticketToDelete, setTicketToDelete] = useState<Ticket | null>(null);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);

    const [currentPageCreate, setCurrentPageCreate] = useState<number>(1);
    const [currentPageDraft, setCurrentPageDraft] = useState<number>(1);
    const [currentPageDelivery, setCurrentPageDelivery] = useState<number>(1);
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

    const fetchTickets = async () => {
        if (!userBranch) return;
        
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ticket/index`);
            if (!response.ok) {
                return response.text().then((text) => {
                    throw new Error(`Network response was not ok. Status: ${response.status}, ${text}`);
                });
            }
            const data: Ticket[] = await response.json();
            const filteredData = data.filter(ticket => 
                ticket.branchOrigin === userBranch
            );
            
            setTickets(filteredData);
            setDelivery(filteredData.filter(ticket => ticket.approvalStatus === "Approved" && ticket.requestedBy === users?.userBranch));
            setCreateRequest(filteredData.filter(ticket => ticket.requestedBy === users?.userBranch));
            setDraft(filteredData.filter(ticket => ticket.approvalStatus === "Draft" && ticket.requestedBy === users?.userBranch));
        } catch (error) {
            console.error('Error fetching data:', error);
            setError('Failed to fetch data. Please try again later.');
        }
    };

    useEffect(() => {
        if (userBranch) {
            fetchTickets();
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

    const confirmDelete = (ticket: Ticket) => {
        setTicketToDelete(ticket);
        setShowDeletePopup(true);
    };

    const handleDeleteConfirmed = async () => {
        if (!ticketToDelete) return;

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ticket/delete`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(ticketToDelete?.ticketNumber),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to delete branch. ${errorText}`);
            }

            setDeleteSuccess(`Ticket "${ticketToDelete.ticketNumber}" deleted successfully.`);
            await fetchTickets();
        } catch (error) {
            alert("Failed to delete the ticket.");
        } finally {
            setShowDeletePopup(false);
            setTicketToDelete(null);
        }
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentTickets = filteredTickets.slice(indexOfFirstItem, indexOfLastItem);
  
    const totalPagesCreate = Math.ceil((filteredTickets.length > 0 ? filteredTickets.length : createRequest.length) / itemsPerPage);
    const totalPagesDraft = Math.ceil(draft.length / itemsPerPage);
    const totalPagesDelivery = Math.ceil(delivery.length / itemsPerPage);
  
    const handlePageChangeCreate = (page: number) => {
        setCurrentPageCreate(page);
    };
    
    const handlePageChangeDraft = (page: number) => {
        setCurrentPageDraft(page);
    };
    
    const handlePageChangeDelivery = (page: number) => {
        setCurrentPageDelivery(page);
    };

    return (
        <div className="px-8 py-24 w-full max-h-full">
            <Upper title="Request Outbound" />
            <div className="mt-5">
                <div className="flex justify-end items-end">
                    <Link href="/dashboard/requestoutbound/create">
                        <button className="bg-[#202B51] p-4 rounded-lg hover:opacity-90">
                            <span className="text-white  font-bold">Create New Request Outbound</span>
                        </button>
                    </Link>
                </div>
            </div>
            <div className="flex w-full mt-5 justify-between  text-xs">
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
                            <>
                                <DataTable
                                    columns={columns}
                                    data={paginateData(filteredTickets.length > 0 ? filteredTickets : createRequest, currentPageCreate)}
                                    actions={[
                                        {
                                            label: <IoEyeSharp className="text-[#202B51]" />,
                                            href: (row) => `/dashboard/requestoutbound/view/${row.ticketNumber}`,
                                            className: "rounded-full hover:bg-blue-200 p-1 text-white text-md mx-2",
                                        },
                                    ]}
                                />
                                <div className="mt-5 flex justify-center items-center">
                                    <button
                                        className={`px-4 py-2 mx-1 rounded ${
                                            currentPageCreate === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-[#202B51] text-white hover:bg-blue-700"
                                        }`}
                                        onClick={() => handlePageChangeCreate(currentPageCreate - 1)}
                                        disabled={currentPageCreate === 1}
                                    >
                                        Previous
                                    </button>
                                    <div className="flex justify-center space-x-2">
                                        {Array.from({ length: Math.ceil((filteredTickets.length > 0 ? filteredTickets.length : createRequest.length) / itemsPerPage) }, (_, index) => (
                                            <button
                                                key={index + 1}
                                                onClick={() => setCurrentPageCreate(index + 1)}
                                                className={`px-4 py-2 mx-1 rounded ${currentPageCreate === index + 1 ? "bg-[#202B51] text-white" : "bg-gray-200 text-black"}`}
                                            >
                                                {index + 1}
                                            </button>
                                        ))}
                                    </div>
                                    <button
                                        className={`px-4 py-2 mx-1 rounded ${
                                            currentPageCreate === totalPagesCreate ? "bg-gray-300 cursor-not-allowed" : "bg-[#202B51] text-white hover:bg-blue-700"
                                        }`}
                                        onClick={() => handlePageChangeCreate(currentPageCreate + 1)}
                                        disabled={currentPageCreate === totalPagesCreate}
                                    >
                                        Next
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="text-center text-gray-500  text-lg mt-5">No data available</div>
                        )}
                    </div>
                </div>
            )}

            
            {activeTab === "draft" && (
                <div className="mt-5">
                    <Search placeholder="Cari Id Asset / Nama Asset / Type Asset / Status Asset / ..." onSearch={handleSearch} />
                    <div className="mt-5">
                        {draft.length > 0 ? (
                            <>
                                <DataTable
                                    columns={columns}
                                    data={paginateData(draft, currentPageDraft)}
                                    actions={[
                                        {
                                            label: <IoEyeSharp className="text-[#202B51]" />,
                                            href: (row) => `/dashboard/requestoutbound/view/${row.ticketNumber}`,
                                            className: "rounded-full hover:bg-blue-200 p-1 text-white text-md mx-2",
                                        },
                                        {
                                            label: <IoReaderSharp className="text-[#202B51]" />,
                                            href: (row) => `/dashboard/requestoutbound/draft/${row.ticketNumber}`,
                                            className: "rounded-full hover:bg-blue-200 p-1 text-white text-md mx-2",
                                        },
                                        {
                                            label: <IoTrash className="text-red-700" />,
                                            onClick: (row) => confirmDelete(row as Ticket),
                                            className: "rounded-full hover:bg-blue-200 p-1 text-white text-md mx-2",
                                        },
                                    ]}
                                />
                                <div className="mt-5 flex justify-center items-center">
                                    <button
                                        className={`px-4 py-2 mx-1 rounded ${
                                            currentPageDraft === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-[#202B51] text-white hover:bg-blue-700"
                                        }`}
                                        onClick={() => handlePageChangeDraft(currentPageDraft - 1)}
                                        disabled={currentPageDraft === 1}
                                    >
                                        Previous
                                    </button>
                                    <div className="flex justify-center space-x-2">
                                        {Array.from({ length: Math.ceil(draft.length / itemsPerPage) }, (_, index) => (
                                            <button
                                                key={index + 1}
                                                onClick={() => setCurrentPageDraft(index + 1)}
                                                className={`px-4 py-2 mx-1 rounded ${currentPageDraft === index + 1 ? "bg-[#202B51] text-white" : "bg-gray-200 text-black"}`}
                                            >
                                                {index + 1}
                                            </button>
                                        ))}
                                    </div>
                                    <button
                                        className={`px-4 py-2 mx-1 rounded ${
                                            currentPageDraft === totalPagesDraft ? "bg-gray-300 cursor-not-allowed" : "bg-[#202B51] text-white hover:bg-blue-700"
                                        }`}
                                        onClick={() => handlePageChangeDraft(currentPageDraft + 1)}
                                        disabled={currentPageDraft === totalPagesDraft}
                                    >
                                        Next
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="text-center text-gray-500  text-lg mt-5">No data available</div>
                        )}
                        {showDeletePopup && ticketToDelete && (
                            <PopUpModal
                                title="Confirm Delete"
                                message={`Are you sure you want to delete ticket "${ticketToDelete.ticketNumber}"?`}
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
                </div>
            )}
            {activeTab === "delivery" && (
                <div className="mt-5">
                    <Search placeholder="Cari Id Asset / Nama Asset / Type Asset / Status Asset / ..." onSearch={handleSearch} />
                    <div className="mt-5">
                        {delivery.length > 0 ? (
                            <>
                                <DataTable
                                    columns={columns}
                                    data={paginateData(delivery, currentPageDelivery)}
                                    actions={[
                                        {
                                            label: <IoCar className="text-[#202B51]" />,
                                            href: (row) => `/dashboard/requestoutbound/delivery/${row.ticketNumber}`,
                                            className: "rounded-full hover:bg-blue-200 p-1 text-white text-md mx-2",
                                        }
                                    ]}
                                />
                                <div className="mt-5 flex justify-center items-center">
                                    <button
                                        className={`px-4 py-2 mx-1 rounded ${
                                            currentPageDelivery === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-700"
                                        }`}
                                        onClick={() => handlePageChangeDelivery(currentPageDelivery - 1)}
                                        disabled={currentPageDelivery === 1}
                                    >
                                        Previous
                                    </button>
                                    <div className="flex justify-center space-x-2">
                                        {Array.from({ length: Math.ceil(delivery.length / itemsPerPage) }, (_, index) => (
                                            <button
                                                key={index + 1}
                                                onClick={() => setCurrentPageDelivery(index + 1)}
                                                className={`px-4 py-2 mx-1 rounded ${currentPageDelivery === index + 1 ? "bg-[#202B51] text-white" : "bg-gray-200 text-black"}`}
                                            >
                                                {index + 1}
                                            </button>
                                        ))}
                                    </div>
                                    <button
                                        className={`px-4 py-2 mx-1 rounded ${
                                            currentPageDelivery === totalPagesDelivery ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-700"
                                        }`}
                                        onClick={() => handlePageChangeDelivery(currentPageDelivery + 1)}
                                        disabled={currentPageDelivery === totalPagesDelivery}
                                    >
                                        Next
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="text-center text-gray-500  text-lg mt-5">No data available</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default RequestOutboundPage;