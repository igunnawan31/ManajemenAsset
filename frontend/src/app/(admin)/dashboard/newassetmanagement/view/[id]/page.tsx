"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Upper from "../../../components/Upper";
import QRCode from "qrcode";

interface Asset {
    id: string;
    name: string;
    locationId: string;
    assetType: string;
    itemStatus: string;
    image: string;
}

interface Branch {
    branchId: string;
    branchName: string;
}

const AssetView = () => {
    const { id } = useParams();
    const router = useRouter();
    const [asset, setAsset] = useState<Asset | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [qrCode, setQrCode] = useState<string>("");

    useEffect(() => {
        if (!id) return;

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/asset/by-id/${id}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Asset not found");
                }
                return response.json();
            })
            .then((data) => {
                setAsset(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching asset:", error);
                setError("Asset not found.");
                setLoading(false);
            });
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/branch/index`)
            .then((res) => res.json())
            .then((data) => setBranches(data))
            .catch((err) => console.error("Error fetching branches:", err));
    }, [id]);

    const branchName = branches.find(b => b.branchId === asset?.locationId)?.branchName || "Unknown Branch";

    useEffect(() => {
        if (!asset) return;
            QRCode.toDataURL(asset.id)
            .then((url) => {
                setQrCode(url);
        })
            .catch((err) => {
                console.error("Failed to generate QR code", err);
        });
    }, [asset]);

    const handleDownloadQRCode = () => {
        if (!qrCode) return;
        const link = document.createElement("a");
        link.href = qrCode;
        link.download = `${asset?.id}-qrcode.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) return <div className="text-center mt-10">Loading...</div>;
    if (error) return <div className="text-center text-red-500 mt-10">{error}</div>;

    return (
        <div className="px-8 py-24 text-black w-full max-h-full mb-32">
            <Upper title="View Asset Details" />
            <div className="mt-5 bg-white p-6 rounded-lg shadow-lg space-y-4">
                <div className="flex flex-col items-center">
                    {qrCode ? (
                        <>
                        <img
                            src={qrCode}
                            alt="QR Code"
                            className="w-48 h-48 border rounded-md shadow-md mb-2"
                        />
                        <button
                            onClick={handleDownloadQRCode}
                            className="bg-[#202B51] text-white px-4 py-2 rounded-lg"
                        >
                            Download QR Code
                        </button>
                        </>
                    ) : (
                        <p>Generating QR code...</p>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Asset Id</label>
                    <input
                        type="text"
                        defaultValue={asset?.id}
                        className="mt-1 p-2 border border-[#202BA5] w-full rounded-md focus:ring-2 focus:ring-[#202BA5]"
                        disabled
                        readOnly
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Asset Name</label>
                    <input
                        type="text"
                        defaultValue={asset?.name}
                        className="mt-1 p-2 border border-[#202BA5] w-full rounded-md focus:ring-2 focus:ring-[#202BA5]"
                        disabled
                        readOnly
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Asset Branch</label>
                    <input
                        type="text"
                        defaultValue={branchName}
                        className="mt-1 p-2 border border-[#202BA5] w-full rounded-md focus:ring-2 focus:ring-[#202BA5]"
                        disabled
                        readOnly
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Asset Type</label>
                    <input
                        type="text"
                        defaultValue={asset?.assetType}
                        className="mt-1 p-2 border border-[#202BA5] w-full rounded-md focus:ring-2 focus:ring-[#202BA5]"
                        disabled
                        readOnly
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Status Item</label>
                    <input
                        type="text"
                        defaultValue={asset?.itemStatus}
                        className="mt-1 p-2 border border-[#202BA5] w-full rounded-md focus:ring-2 focus:ring-[#202BA5]"
                        disabled
                        readOnly
                    />
                </div>

                <button
                    onClick={() => router.back()}
                    className="mt-5 bg-[#202B51] text-white px-4 py-2 rounded-lg"
                >
                    Back
                </button>
            </div>
        </div>
    );
};

export default AssetView;
