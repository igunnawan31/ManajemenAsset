"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Upper from "../../components/Upper";
import { useState, useEffect, useRef } from "react";
import QRCode from "qrcode";
import { useRouter } from "next/navigation";
import PopUpModal from "../../components/PopUpModal";
import { IoCheckmarkCircleSharp, IoCloseCircleSharp } from "react-icons/io5";
import ReactToPdf from 'react-to-pdf';

const assetSchema = z.object({
    id: z.string().min(1, "Asset id is required"),
    name: z.string().min(1, "Asset name is required"),
    assetType: z.string().min(1, "Asset type is required"),
    locationId: z.string().min(1, "Location is required"),
    itemStatus: z.string().min(1, "Status is required"),
});

const CreatePageNewAsset = () => {
    const [qrCode, setQrCode] = useState<string>("");
    const [branches, setBranches] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [modalType, setModalType] = useState<"success" | "error" | null>(null);
    const [modalMessage, setModalMessage] = useState<string>("");
    const router = useRouter();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const pdfRef = useRef<HTMLDivElement>(null);

    const { 
        register, 
        handleSubmit, 
        formState: { errors },
        setValue,
        watch,
        reset
    } = useForm({
        resolver: zodResolver(assetSchema),
        mode: "onSubmit"
    });

    const assetId = watch("id");
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

    const generateQrCode = async () => {
        if (!assetId.trim()) {
            setError("Please enter an asset ID first.");
            return;
        }

        try {
            const qrDataUrl = await QRCode.toDataURL(assetId);
            setQrCode(qrDataUrl);
            setError(null);
        } catch (error) {
            console.error("Error generating QR code:", error);
            setError("Failed to generate QR code");
        }
    };

    const dataURLtoFile = (dataurl: string, filename: string): File => {
        const arr = dataurl.split(',');
        const mime = arr[0].match(/:(.*?);/)![1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
    };

    const onSubmit = async (data: any) => {
        if (!qrCode) {
            setError("Please generate QR code first");
            return;
        }
    
        setLoading(true);
        setError(null);
        setSuccess(null);
    
        try {
            const qrCodeFile = dataURLtoFile(qrCode, `${data.id}_qrcode.png`);
            
            const formData = new FormData();
            formData.append("id", data.id);
            formData.append("name", data.name);
            formData.append("locationId", data.locationId);
            formData.append("assetType", data.assetType);
            formData.append("itemStatus", data.itemStatus);
            formData.append("image", qrCodeFile);
    
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/asset/create`, {
                method: "POST",
                body: formData,
            });
    
            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(errorData || "Failed to create asset");
            }

            setModalType("success");
            setModalMessage("Asset created successfully!");
            setSuccess(null);
            return;
            
        } catch (err: any) {
            setModalType("error");
            setModalMessage(err.message || "An error occurred while creating the asset");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="px-8 py-24 text-[#202B51] w-full max-h-full">
            <Upper title="Create Asset Management" />
            <div className="mt-5 bg-white p-6 rounded-lg shadow-md">
            {error && <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">{error}</div>}
            {success && <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">{success}</div>}

                <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Asset ID</label>
                            <input
                                type="text"
                                {...register("id")}
                                className="mt-1 p-2 border border-[#202BA5] w-full rounded-md focus:ring-2 focus:ring-[#202BA5]"
                                placeholder="Enter asset ID"
                            />
                            {errors.id?.message && (
                                <p className="text-red-500 text-xs mt-2">{String(errors.id.message.toString())}</p>
                            )} 
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Asset Name</label>
                            <input
                                type="text"
                                {...register("name")}
                                className="mt-1 p-2 border border-[#202BA5] w-full rounded-md focus:ring-2 focus:ring-[#202BA5]"
                                placeholder="Enter asset name"
                            />
                            {errors.name?.message && <p className="text-red-500 text-xs mt-2">{String(errors.name.message.toString())}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Asset Type</label>
                            <select
                                {...register("assetType")}
                                className="mt-1 p-2.5 border border-[#202BA5] w-full rounded-md focus:ring-2 focus:ring-[#202BA5]"
                            >
                                <option value="">Select asset type</option>
                                <option value="Electronics">Electronics</option>
                                <option value="Furniture">Furniture</option>
                                <option value="Vehicles">Vehicles</option>
                                <option value="Real Estate">Real Estate</option>
                                <option value="Office Equipment">Office Equipment</option>
                            </select>
                            {errors.assetType?.message && (
                                <p className="text-red-500 text-xs mt-2">{String(errors.assetType.message.toString())}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Location</label>
                            <select
                                {...register("locationId")}
                                className="mt-1 p-2.5 border border-[#202BA5] w-full rounded-md focus:ring-2 focus:ring-[#202BA5]"
                            >
                                <option value="">Select location</option>
                                {branches.map((branch) => (
                                    <option key={branch.branchId} value={branch.branchId}>
                                        {branch.branchName}
                                    </option>
                                ))}
                            </select>
                            {errors.locationId?.message && (
                                <p className="text-red-500 text-xs mt-2">{String(errors.locationId.message.toString())}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Status</label>
                            <select
                                {...register("itemStatus")}
                                className="mt-1 p-2.5 border border-[#202BA5] w-full rounded-md focus:ring-2 focus:ring-[#202BA5]"
                            >
                                <option value="">Select status</option>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                            {errors.itemStatus?.message && (
                                <p className="text-red-500 text-xs mt-2">{String(errors.itemStatus.message.toString())}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Generate QrCode</label>
                            <button 
                                type="button" 
                                onClick={generateQrCode}
                                className="mt-1 p-2.5 w-full flex bg-[#202B51] text-white rounded-md hover:bg-blue-800 transition"
                                disabled={!assetId}
                            >
                                Generate QR Code
                            </button>
                            {qrCode && (
                                <div className="mt-4 block">
                                    <div ref={pdfRef} className="border rounded-md p-4 shadow-md bg-white block">
                                        <div className="flex justify-center">
                                            <h2 className="text-lg font-semibold mb-2">Asset QR Code</h2>
                                        </div>
                                        <div className="flex justify-center">
                                            <img src={qrCode} alt="QR Code" className="w-1/2 h-1/2 border rounded-md shadow-md" />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-4">
                        <button
                            type="submit"
                            className="px-6 py-2 bg-[#202B51] text-white rounded-md hover:bg-blue-800 transition"
                            disabled={loading || !qrCode}
                        >
                            {loading ? "Creating..." : "Submit"}
                        </button>
                    </div>
                </form>
                {error && <p className="text-red-500 mt-4">{error}</p>}
                {success && <p className="text-green-500 mt-4">{success}</p>}
            </div>
            {modalType === "success" && (
                <PopUpModal
                    title="Success"
                    message={modalMessage}
                    icon={<IoCheckmarkCircleSharp className="text-green-500" />}
                    actions={
                    <>
                        <div className="block space-y-2">
                            <div className="flex justify-between space-x-3">
                                <button
                                    onClick={() => {
                                        setModalType(null);
                                        setQrCode("");
                                        reset();
                                }}
                                className="bg-transparent border-[#202B51] border-2 text-[#202B51] px-4 py-2 rounded-lg hover:bg-gray-100"
                                >
                                    Create Another Asset
                                </button>
                                <button
                                    onClick={() => router.push("/dashboard/newassetmanagement")}
                                    className="bg-[#202B51] text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                                >
                                    Go to Asset Management
                                </button>
                            </div>
                            <div className="">
                                <ReactToPdf targetRef={pdfRef as React.RefObject<HTMLElement>} filename="example.pdf" scale={0.8}>
                                    {({ toPdf }) => (
                                        <button onClick={toPdf}
                                            className="bg-[#202B51] w-full text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                                        >
                                            Download PDF
                                        </button>
                                    )}
                                </ReactToPdf>
                            </div>
                        </div>
                    </>
                    }
                />
            )}

            {modalType === "error" && (
                <PopUpModal
                    title="Error"
                    message={modalMessage}
                    icon={<IoCloseCircleSharp className="text-red-500" />}
                    actions={
                    <button
                        onClick={() => setModalType(null)}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                        Close
                    </button>
                    }
                />
            )}
        </div>
    );
};

export default CreatePageNewAsset;