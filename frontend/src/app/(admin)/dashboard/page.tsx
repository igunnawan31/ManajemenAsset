"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Upper from "./components/Upper";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { BorderColor } from "@mui/icons-material";
import DataTable from "./components/DataTable";
import { IoArrowForwardCircle } from "react-icons/io5";
import Link from "next/link";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

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

interface Asset {
    id: string;
    name: string;
    locationId: string;
    branchName: string;
    assetType: string;
    itemStatus: string;
}

const Dashboard = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [users, setUsers] = useState<UserResponseDTO | null>(null);
    const [userBranch, setUserBranch] = useState<string>("");
    const [assets, setAssets] = useState<Asset[]>([]);
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [inboundData, setInboundData] = useState<number[]>([]);
    const [outboundData, setOutboundData] = useState<number[]>([]);
    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
    const [yearOptions, setYearOptions] = useState<number[]>([]);
    const [tiketMasuk, setTiketMasuk] = useState<Ticket[]>([]);
    const [tiketKeluar, setTiketKeluar] = useState<Ticket[]>([]);
    const [inboundTickets, setInboundTickets] = useState<Ticket[]>([]);
    const [outboundTickets, setOutboundTickets] = useState<Ticket[]>([]);

    const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const options = {
        responsive: true,
        plugins: {
        legend: {
            position: "top" as const,
        },
        title: {
            display: true,
            text: "Ticket Overview",
        },
        },
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

    const countByMonth = (filteredTickets: Ticket[]) => {
        return months.map((_, monthIndex) => {
        return filteredTickets.filter((ticket) => {
            const date = new Date(ticket.dateRequested);
            return (
            date.getFullYear() === selectedYear &&
            date.getMonth() === monthIndex
            );
        }).length;
        });
    };

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
            setUserBranch(data.userBranch);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred");
        }
        };
        fetchUserData();
    }, []);

    useEffect(() => {
        if (userBranch) {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/ticket/index`)
            .then((res) => {
            if (!res.ok) {
                return res.text().then((text) => {
                throw new Error(`Status: ${res.status}, ${text}`);
                });
            }
            return res.json();
            })
            .then((data: Ticket[]) => {
            setTickets(data);
            const years = Array.from(new Set(data.map((t) => new Date(t.dateRequested).getFullYear())));
            setYearOptions(years.sort((a, b) => b - a));
            })
            .catch((err) => {
            console.error("Error fetching tickets:", err);
            setError("Failed to fetch ticket data.");
            })
            .finally(() => setLoading(false));
        }
    }, [userBranch]);

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
                const relevantTickets = data.filter(ticket => 
                    ticket.branchDestination === userBranch || 
                    ticket.branchOrigin === userBranch
                );

                console.log("All relevant tickets:", relevantTickets);
                setTickets(relevantTickets);
                
                const masuk = relevantTickets.filter(ticket => 
                    ticket.branchDestination === userBranch &&
                    ticket.approvalStatus === "Pending" && 
                    ticket.moveStatus === "Not_Started"
                );
                setTiketMasuk(masuk);
                console.log("Inbound tickets:", masuk);

                const keluar = relevantTickets.filter(ticket => 
                    ticket.branchOrigin === userBranch &&
                    ticket.approvalStatus === "Pending" && 
                    ticket.moveStatus === "Not_Started"
                );
                setTiketKeluar(keluar);
                console.log("Outbound tickets:", keluar);

                const years = Array.from(
                    new Set(relevantTickets.map(t => new Date(t.dateRequested).getFullYear()))
                );
                setYearOptions(years.sort((a, b) => b - a));
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
        const inbound = tickets.filter(
            (ticket) =>
                ticket.requestedBy === userBranch &&
                ticket.branchDestination === userBranch &&
                new Date(ticket.dateRequested).getFullYear() === selectedYear
        );

        const outbound = tickets.filter(
            (ticket) =>
                ticket.requestedBy === userBranch &&
                ticket.branchOrigin === userBranch &&
                new Date(ticket.dateRequested).getFullYear() === selectedYear
        );

        setInboundData(countByMonth(inbound));
        setOutboundData(countByMonth(outbound));
    }, [tickets, selectedYear, userBranch]);
    
    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    const inboundChartData = {
        labels: months,
        datasets: [
            {
                label: "Inbound",
                data: inboundData,
                backgroundColor: "rgba(32, 43, 165)",
            },
        ],
    };

    const outboundChartData = {
        labels: months,
        datasets: [
            {
                label: "Outbound",
                data: outboundData,
                borderColor: "rgba(32, 43, 165)",
                borderWidth: 2,
                backgroundColor: "rgba(255,255,255)",
            },
        ],
    };

    const formatStatus = (status: string) => {
        switch(status) {
            case "Pending": return "Menunggu";
            case "Approved": return "Disetujui";
            case "Rejected": return "Ditolak";
            default: return status;
        }
    };

    const formatMoveStatus = (status: string) => {
        switch(status) {
            case "Not_Started": return "Belum Dimulai";
            case "In_Progress": return "Dalam Proses";
            case "Completed": return "Selesai";
            default: return status;
        }
    };

    return (
        <div className="px-8 py-24 text-[#202B51] mb-32 w-full">
            <Upper title="Dashboard Manajemen Aset" />
            <div className="my-10">
                <div className="relative w-full h-64 md:h-80 bg-cover bg-center rounded-xl"
                    style={{ backgroundImage: "url('/astra.jpeg')" }}>
                    <div className="absolute inset-0 bg-[#202B51] bg-opacity-70 rounded-xl shadow-xl hover:bg-opacity-20 transition-all ease-in-out duration-300"></div>
                </div>
            </div>
            <div className="mb-6">
                <label htmlFor="year-select" className="font-semibold text-sm mr-2">Pilih Tahun:</label>
                <select
                    id="year-select"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                    className="border border-gray-300 rounded px-2 py-1 text-sm"
                    >
                    {yearOptions.map((year) => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    ))}
                </select>
            </div>
            <div className="mt-5 flex flex-col lg:flex-row gap-8">
                <div className="w-full lg:w-1/2">
                    <span className="text-[#202B51] font-bold border-b-2 border-[#202B51]">
                        Inbound
                    </span>
                    <p className="mt-2 text-sm text-gray-600 text-justify">
                        Inbound asset merupakan permintaan masuk aset ke dalam suatu branch (cabang) yang
                        biasanya dilakukan oleh tim gudang pusat atau pihak lain yang memiliki otoritas untuk
                        mendistribusikan aset. Proses ini mencakup pencatatan jenis aset, jumlah, kondisi, serta
                        waktu pengiriman ke cabang tujuan.
                    </p>
                    <Bar data={inboundChartData} options={options} className="mt-4" />
                </div>

                <div className="w-full lg:w-1/2">
                    <span className="text-[#202B51] font-bold border-b-2 border-[#202B51]">
                        Outbound
                    </span>
                    <p className="mt-2 text-sm text-gray-600 text-justify">
                        Outbound asset merupakan permintaan keluar aset dari suatu branch (cabang) yang 
                        biasanya dilakukan oleh tim gudang pusat atau pihak lain yang memiliki otoritas untuk 
                        mendistribusikan aset sesuai dengan permintaan dan kebutuhan.
                    </p>
                    <Bar data={outboundChartData} options={options} className="mt-4" />
                </div>
            </div>
            <div className="mt-5 w-full">
                <span className="text-[#202B51] font-bold border-b-2 border-b-[#202B51] mt-2">
                    Request Asset Masuk
                </span>
                <div className="mt-5">  
                    {tiketMasuk.length > 0 ? (
                        <DataTable
                            columns={columns}
                            data={tiketMasuk.map(ticket => ({
                                ...ticket,
                                dateRequested: new Date(ticket.dateRequested).toLocaleDateString(),
                                approvalStatus: formatStatus(ticket.approvalStatus),
                                moveStatus: formatMoveStatus(ticket.moveStatus),
                            }))}
                        />
                    ) : (
                        <div className="text-center py-4 text-gray-500">
                            Tidak ada data tiket masuk
                        </div>
                    )}
                </div>
                <div className="mt-5">
                    <div className="flex justify-end">
                        <Link href="/dashboard/requestassetmasuk">
                            <button className="bg-[#202B51] p-4 rounded-lg hover:opacity-90">
                                <span className="text-white font-sans font-bold">Go To Request Asset Masuk</span>
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
            <div className="mt-5 w-full">
                <span className="text-[#202B51] font-bold border-b-2 border-b-[#202B51] mt-2">
                    Request Asset Keluar
                </span>
                <div className="mt-5">  
                    {tiketKeluar.length > 0 ? (
                        <DataTable
                            columns={columns}
                            data={tiketKeluar.map(ticket => ({
                                ...ticket,
                                dateRequested: new Date(ticket.dateRequested).toLocaleDateString(),
                                approvalStatus: formatStatus(ticket.approvalStatus),
                                moveStatus: formatMoveStatus(ticket.moveStatus),
                            }))}
                        />
                    ) : (
                        <div className="text-center py-4 text-gray-500">
                            Tidak ada data tiket masuk
                        </div>
                    )}
                </div>
                <div className="mt-5">
                    <div className="flex justify-end">
                        <Link href="/dashboard/requestassetkeluar">
                            <button className="bg-[#202B51] p-4 rounded-lg hover:opacity-90">
                                <span className="text-white font-sans font-bold">Go to Request Asset Keluar</span>
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
