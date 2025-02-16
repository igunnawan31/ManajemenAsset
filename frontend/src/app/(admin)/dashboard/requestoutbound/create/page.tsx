"use client";

import { useState } from "react";
import Upper from "../../components/Upper";
import AssetSelector from "../../components/AssetSelector";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface Asset {
    no: string;
    assetId: string;
    assetName: string;
    assetType: string;
    assetStock: string;
    assetLocation: string;
    assetStatusPengelolaan: string;
}

const assetSchema = z.object({
    assetId: z.string().min(1, "Asset id is required"),
    assetName: z.string().min(1, "Asset name is required"),
    assetType: z.string().min(1, "Asset type is required"),
    assetStock: z.string().min(1, "Asset stock is required"),
    assetLocation: z.string().min(1, "Asset location is required"),
    assetStatusPengelolaan: z.string().min(1, "Status Pengelolaan Asset is required"),
});

const CreateRequestOutbound = () => {
    const [assets] = useState<Asset[]>([
        { no: "1", assetId: "AID-001-100225", assetName: "Samsung2", assetType: "Elektronik", assetLocation: "Astra International - Pusat", assetStock: "4", assetStatusPengelolaan: "Active" },
        { no: "2", assetId: "AID-002-100225", assetName: "Samsung1", assetType: "Elektronik", assetLocation: "Astra International - Pusat", assetStock: "4", assetStatusPengelolaan: "Active" },
        { no: "3", assetId: "AID-003-100225", assetName: "Samsung3", assetType: "Elektronik", assetLocation: "Astra International - Pusat", assetStock: "4", assetStatusPengelolaan: "Active" },
        { no: "4", assetId: "AID-004-100225", assetName: "Kursi1", assetType: "Barang", assetLocation: "Astra International - Pusat", assetStock: "2", assetStatusPengelolaan: "Active" },
        { no: "5", assetId: "AID-005-100225", assetName: "Kursi2", assetType: "Barang", assetLocation: "Astra International - Pusat", assetStock: "2", assetStatusPengelolaan: "Active" },
        { no: "6", assetId: "AID-006-100225", assetName: "Printer", assetType: "Elektronik", assetLocation: "Astra International - Pusat", assetStock: "5", assetStatusPengelolaan: "Active" }
    ]);

    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [confirmedAssets, setConfirmedAssets] = useState<Asset[]>([]);

    const handleConfirmSelection = (selectedAssets: Asset[]) => {
        setConfirmedAssets(selectedAssets);
    };

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(assetSchema),
    });

    const onSubmit = (data: any) => {
        console.log("Form Submitted:", data);
    };

    return (
        <div className="px-8 py-24 w-full max-h-full poppins">
            <Upper title="Create Request Inbound" />

            <div className="mt-5 bg-white p-6 rounded-lg shadow-md">
                <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4">

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
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
                            <label className="block text-sm font-medium text-gray-700">Asset Name</label>
                            <input
                                type="text"
                                {...register("assetName")}
                                className="mt-1 p-2 border border-[#202BA5] w-full rounded-md focus:ring-2 focus:ring-[#202BA5]"
                                placeholder="Enter asset name"
                            />
                            {errors.assetName?.message && <p className="text-red-500 text-xs mt-2">{String(errors.assetName.message)}</p>}
                        </div>
                    </div>
                        
                    <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700">Asset Name</label>
                        <button
                            type="button"
                            onClick={() => setIsPopupOpen(true)}
                            className="bg-[#20458A] text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition w-full mt-1"
                            >
                            Select Assets
                        </button>

                        {confirmedAssets.length > 0 && (
                        <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                            <h3 className="font-semibold">Confirmed Assets</h3>
                            {confirmedAssets.map((asset) => (
                                <p key={asset.assetId}>{asset.assetName}</p>
                            ))}
                        </div>
                        )}
                    </div>

                    {/* Button Form */}
                    <div className="mt-4">
                        <button
                            type="submit"
                            className="px-6 py-2 bg-[#20458A] text-white rounded-md hover:bg-blue-800 transition"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
            <AssetSelector isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} onConfirm={handleConfirmSelection} assets={assets} />
        </div>
    );
};

export default CreateRequestOutbound;
