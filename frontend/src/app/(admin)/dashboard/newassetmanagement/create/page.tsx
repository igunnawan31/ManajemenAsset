"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Upper from "../../components/Upper";
import { useState } from "react";
import QRCode from "qrcode";

const assetSchema = z.object({
    assetId: z.string().min(1, "Asset id is required"),
    assetName: z.string().min(1, "Asset name is required"),
    assetType: z.string().min(1, "Asset type is required"),
    assetStock: z.string().min(1, "Asset stock is required"),
    assetLocation: z.string().min(1, "Asset location is required"),
    assetStatusPengelolaan: z.string().min(1, "Status Pengelolaan Asset is required"),
});

const CreatePageNewAsset = () => {
    const [assetId, setAssetId] = useState<string>("");
    const [qrCode, setQrCode] = useState<string>("");

    const generateQrCode = async () => {
        if (!assetId.trim()) {
            alert("Please enter an asset ID first.");
            return;
        }

        try {
            const qrDataUrl = await QRCode.toDataURL(assetId);
            setQrCode(qrDataUrl);
        } catch (error) {
            console.error("Error generating QR code:", error);
        }
    };

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(assetSchema),
    });

    const onSubmit = (data: any) => {
        console.log("Form Submitted:", data);
    };

    return (
        <div className="px-8 py-24 w-full max-h-full">
            <Upper title="Create Asset Management" />
            <div className="mt-5 bg-white p-6 rounded-lg shadow-md">
            
                <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Asset ID</label>
                                <input
                                    type="text"
                                    {...register("assetId")}
                                    value={assetId}
                                    onChange={(e) => setAssetId(e.target.value)}
                                    className="mt-1 p-2 border border-[#202BA5] w-full rounded-md focus:ring-2 focus:ring-[#202BA5]"
                                    placeholder="Enter asset ID"
                                />
                                {errors.assetId?.message && (
                                    <p className="text-red-500 text-xs mt-2">{String(errors.assetId.message)}</p>
                            )} 
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Asset Name</label>
                            <input
                                type="text"
                                {...register("assetName")}
                                className="mt-1 p-2 border border-[#202BA5] w-full rounded-md focus:ring-2 focus:ring-[#202BA5]"
                                placeholder="Enter asset name"
                            />
                            {errors.assetName?.message && <p className="text-red-500 text-xs mt-2">{String(errors.assetName.message)}</p>}
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
                                <p className="text-red-500 text-xs mt-2">{String(errors.assetType.message)}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Asset Value</label>
                            <input
                                type="text"
                                {...register("assetStock")}
                                className="mt-1 p-2 border border-[#202BA5] w-full rounded-md focus:ring-2 focus:ring-[#202BA5]"
                                placeholder="Enter asset stock"
                            />
                            {errors.assetStock?.message && <p className="text-red-500 text-xs mt-2">{String(errors.assetStock.message)}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Asset Location</label>
                            <input
                                type="text"
                                {...register("assetLocation")}
                                className="mt-1 p-2 border border-[#202BA5] w-full rounded-md focus:ring-2 focus:ring-[#202BA5]"
                                placeholder="Enter asset location"
                            />
                            {errors.assetLocation?.message && <p className="text-red-500 text-xs mt-2">{String(errors.assetLocation.message)}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Asset Type</label>
                            <select
                                {...register("assetStatusPengelolaan")}
                                className="mt-1 p-2.5 border border-[#202BA5] w-full rounded-md focus:ring-2 focus:ring-[#202BA5]"
                            >
                                <option value="">Select Status Pengelolaan Asset</option>
                                <option value="Active">Active</option>
                                <option value="InActive">InActive</option>
                            </select>
                            {errors.assetType?.message && (
                                <p className="text-red-500 text-xs mt-2">{String(errors.assetType.message)}</p>
                            )}
                        </div>
                        <div>
                            <button 
                                type="button" 
                                onClick={generateQrCode}
                                className="px-4 py-2 flex bg-blue-600 text-white rounded-md hover:bg-blue-800 transition"
                            >
                                Generate QR Code
                            </button>
                            {qrCode && (
                                <div className="mt-4">
                                    <img src={qrCode} alt="QR Code" className="w-1/2 h-1/2 border rounded-md shadow-md" />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-4">
                        <button
                            type="submit"
                            className="px-6 py-2 bg-[#202BA5] text-white rounded-md hover:bg-blue-800 transition"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreatePageNewAsset;
