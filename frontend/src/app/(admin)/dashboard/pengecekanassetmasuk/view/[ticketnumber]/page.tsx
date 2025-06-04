"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import DataTable from "../../../components/DataTable";
import Upper from "../../../components/Upper";
import { Html5QrcodeScanner } from "html5-qrcode";
import { IoQrCodeOutline } from "react-icons/io5";
import { ClassNames } from "@emotion/react";

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

interface AssetMoves {
    id: string;
    ticketNumber: string;
    assetNumber: string;
    moveStatus: string;
    scanned: number;
    total: number;
}

const DetailRequestAssetKeluar = () => {
    const { ticketnumber } = useParams();
    const [ticket, setTicket] = useState<Ticket | null>(null);
    const [assets, setAssets] = useState<AssetMoves[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        if (!ticketnumber) {
            setError("Ticket Number is Missing");
            setLoading(false);
            return;
        }

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/ticket/by-id/${ticketnumber}`)
            .then((response) => response.json())
            .then((data) => setTicket(data))
            .catch(() => setError("Ticket not found"));

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/asset-move/by-TN/${ticketnumber}`)
            .then((response) => response.json())
            .then((data) => {
                const updatedAssets = data.map((asset: AssetMoves) => ({ ...asset, scanned: 0, total: 1 }));
                setAssets(updatedAssets);
            })
            .catch(() => setError("Failed to fetch assets"))
            .finally(() => setLoading(false));
    }, [ticketnumber]);

    const handleBack = () => {
        router.push("/dashboard/requestassetkeluar");
    }

    const columns = [
        { key: "assetNumber", label: "Asset Number", alwaysVisible: true, className:"text-[#202B51]"},
        { key: "moveStatus", label: "Move Status", alwaysVisible: true },
    ];

    if (loading) return <div className="text-center mt-10">Loading...</div>;
    if (error) return <div className="text-center text-red-500 mt-10">{error}</div>;

    return (
        <div className="w-full max-h-full px-8 py-24 text-[#202B51]">
            <Upper title="Request Asset Keluar" />
            <div className="mt-5">
                <h2 className="text-xl font-bold text-[#202B51]">{ticket?.ticketNumber}</h2>
                <p><strong>ID:</strong> {ticket?.ticketNumber}</p>
            </div>
            <div className="mt-5">
                <DataTable columns={columns} data={assets} />
            </div>
            <div className="mt-5 flex justify-between">
                <div>
                    <button className="bg-[#202B51] px-4 py-2 text-white rounded-md hover:bg-opacity-90" onClick={handleBack}>
                        &lt; Back
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DetailRequestAssetKeluar;
