"use client";

import Upper from "../../components/Upper";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Kota {
    kotaId: string;
    kotaName: string;
}

interface Kecamatan {
    kecamatanId: string;
    kecamatanName: string;
    kotaId: string;
}

const branchSchema = z.object({
    branchName: z.string().min(1, "Branch Name is required"),
    branchEmail: z.string().min(1, "Email is required").email("Invalid email format"), 
    branchPhone: z.string().min(1, "Branch Phone is required"),
    kotaId: z.string().min(1, "Kota is required"),
    kecamatanId: z.string().min(1, "Kecamatan is required"),
    branchLocation: z.string().min(1, "Alamat is required"),
    parentId: z.string().default("1"),
});

const CreatePageBranch = () => {
    const [kotas, setKotas] = useState<Kota[]>([]);
    const [kecamatans, setKecamatans] = useState<Kecamatan[]>([]);
    const [selectedKota, setSelectedKota] = useState<string>("");     
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchKotas = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/kota/index`);
                const data = await response.json();
                setKotas(data);
            } catch (error) {
                console.error("Error fetching Kotas", error);
                setError("Failed to load kotas");
            }
        };
        fetchKotas();
    }, []);

    useEffect(() => {
        const fetchKecamatans = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/kecamatan/index`);
                const data = await response.json();
                setKecamatans(data);
            } catch (error) {
                console.error("Error fetching Kecamatans", error);
                setError("Failed to load kecamatans");
            }
        };
        fetchKecamatans();
    }, []);

    const onSubmit = async (data: any) => {
        setError(null);
        setSuccess(null);
    
        try {
            console.log("Submitting Data:", data); // Log before submitting
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/branch/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ...data, parentId: "1" }),
            });
    
            const result = await response.json();
            console.log("API Response:", result);
    
            if (!response.ok) {
                throw new Error(result.message || "Failed to create branch");
            }

            setSuccess("Branch created successfully!");
            router.push("dashboard/branchmanagement/")
        } catch (err: any) {
            console.error("Error during submission:", err);
            setError(err.message || "An error occurred.");
        }
    };    

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm({
        resolver: zodResolver(branchSchema),
    });

    return (
        <div className="px-8 py-24 w-full max-h-full">
            <Upper title="Create Branch" />
            <div className="mt-5 bg-white p-6 rounded-lg shadow-md">
                <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Branch Name</label>
                            <input
                                type="text"
                                {...register("branchName")}
                                className="mt-1 p-2 border w-full rounded-md"
                                placeholder="Enter Branch Name"
                            />
                            {errors.branchName && <p className="text-red-500 text-xs mt-2">{errors.branchName.message?.toString()}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email Branch</label>
                            <input
                                type="email"
                                {...register("branchEmail")}
                                className="mt-1 p-2 border w-full rounded-md"
                                placeholder="Enter Branch Email"
                            />
                            {errors.branchEmail && <p className="text-red-500 text-xs mt-2">{errors.branchEmail.message?.toString()}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Phone Number Branch</label>
                            <input
                                type="text"
                                {...register("branchPhone")}
                                className="mt-1 p-2 border w-full rounded-md"
                                placeholder="Enter Branch Phone Number"
                            />
                            {errors.branchPhone && <p className="text-red-500 text-xs mt-2">{errors.branchPhone.message?.toString()}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Kota</label>
                            <select
                                {...register("kotaId")}
                                className="mt-1 p-2 border w-full rounded-md"
                                onChange={(e) => {
                                    const selectedValue = e.target.value;
                                    setSelectedKota(selectedValue);  // Update selectedKota
                                    setValue("kotaId", selectedValue);  // Update form state
                                    setValue("kecamatanId", ""); // Reset kecamatan when Kota changes
                                }}
                            >
                                <option value="">Select Kota</option>
                                {kotas.map((kota) => (
                                    <option key={kota.kotaId} value={kota.kotaId}>
                                        {kota.kotaName}
                                    </option>
                                ))}
                            </select>
                            {errors.kotaId && <p className="text-red-500 text-xs mt-2">{errors.kotaId.message?.toString()}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Kecamatan</label>
                            <select
                                {...register("kecamatanId")}
                                className="mt-1 p-2 border w-full rounded-md"
                            >
                                <option value="">Select Kecamatan</option>
                                {kecamatans
                                    .filter((kecamatan) => String(kecamatan.kotaId) === selectedKota) // Ensure types match
                                    .map((kecamatan) => (
                                        <option key={kecamatan.kecamatanId} value={kecamatan.kecamatanId}>
                                            {kecamatan.kecamatanName}
                                        </option>
                                    ))}
                            </select>
                            {errors.kecamatanId && <p className="text-red-500 text-xs mt-2">{errors.kecamatanId.message?.toString()}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Alamat Branch</label>
                            <input
                                type="text"
                                {...register("branchLocation")}
                                className="mt-1 p-2 border w-full rounded-md"
                                placeholder="Enter Branch Address"
                            />
                            {errors.branchLocation && <p className="text-red-500 text-xs mt-2">{errors.branchLocation.message?.toString()}</p>}
                        </div>
                    </div>
                    
                    <input type="hidden" {...register("parentId")} value="1" />

                    <button 
                        type="submit" 
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
                        onClick={() => console.log("Submit Button Clicked")}
                    >
                        Submit
                    </button>
                </form>

                {error && <p className="text-red-500 mt-4">{error}</p>}
                {success && <p className="text-green-500 mt-4">{success}</p>}
            </div>
        </div>
    );
};

export default CreatePageBranch;
