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

    const optionsAsset = {
        responsive: true,
        plugins: {
        legend: {
            position: "top" as const,
        },
        title: {
            display: true,
            text: "Asset Overview",
        },
        },
    };

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
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/asset/index`)
            .then((res) => {
                if (!res.ok) {
                    return res.text().then((text) => {
                        throw new Error(`Status: ${res.status}, ${text}`);
                    });
                }
                return res.json();
            })
            .then((data: Asset[]) => {
                setAssets(data);
            })
        }
    })
    
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

    useEffect(() => {
        if (assets.length > 0) {
            const activeAssets = assets.filter((asset) => asset.itemStatus === "Active");
            const inactiveAssets = assets.filter((asset) => asset.itemStatus === "InActive");
            const missingAssets = assets.filter((asset) => asset.itemStatus === "Missing");

            setAsetData([activeAssets.length, inactiveAssets.length, missingAssets.length]);
        }
    }, [assets]);
    
    const [asetData, setAsetData] = useState<number[]>([0, 0, 0]);
    
    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    const inboundChartData = {
        labels: months,
        datasets: [
            {
                label: "Inbound",
                data: inboundData,
                backgroundColor: "rgba(54, 162, 235, 0.6)",
            },
        ],
    };

    const outboundChartData = {
        labels: months,
        datasets: [
            {
                label: "Outbound",
                data: outboundData,
                backgroundColor: "rgba(255, 99, 132, 0.6)",
            },
        ],
    };

    const asetChartData = {
        labels: ["Active", "Inactive", "Missing"],
        datasets: [
            {
                label: "Assets",
                data: asetData,
                backgroundColor: [
                    "rgba(54, 162, 235, 0.6)",
                    "rgba(255, 159, 64, 0.6)",
                    "rgba(75, 192, 192, 0.6)",
                ],
            },
        ],
    };

    return (
        <div className="px-8 py-24 mb-32 w-full max-h-full poppins">
            <Upper title="Dashboard Manajemen Aset" />
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
                    Asset
                </span>
                <Bar data={asetChartData} options={optionsAsset} />
            </div>
        </div>
    );
};

export default Dashboard;
