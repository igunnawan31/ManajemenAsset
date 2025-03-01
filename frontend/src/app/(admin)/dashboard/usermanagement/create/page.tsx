"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Upper from "../../components/Upper";
import { useState, useEffect } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";

// Define Role and SubRole enums
enum Role {
    Cabang = "Cabang",
    Pusat = "Pusat",
}

enum SubRole {
    Kepala_Gudang = "Kepala Gudang",
    PIC_Gudang = "PIC Gudang",
}

// Define Type for Branch
interface Branch {
    branchId: string;
    branchName: string;
}

// Define the schema using Zod
const userSchema = z.object({
    userName: z.string().min(1, "Username is required"),
    userEmail: z.string()
        .min(1, "Email is required")
        .email("Invalid email format"),
    userBranch: z.string().min(1, "Branch is required"), // Will store branchId
    userPhone: z.string().min(1, "Phone is required"),
    userRole: z.string().min(1, "Role is required"),
    userSubRole: z.string().min(1, "SubRole is required"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});

const CreatePageUser = () => {
    const [branches, setBranches] = useState<Branch[]>([]);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    useEffect(() => {
        const fetchBranches = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/branch/index`);
                const data = await response.json();
                setBranches(data);
            } catch (error) {
                console.error("Error fetching branches:", error);
                setError("Failed to load branches.");
            }
        };
        fetchBranches();
    }, []);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(userSchema),
    });

    const onSubmit = async (data: any) => {
        setError(null);
        setSuccess(null);
        
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.message || "Failed to create user");
            }

            setSuccess("User created successfully!");
        } catch (err: any) {
            setError(err.message || "An error occurred.");
        }
    };

    return (
        <div className="px-8 py-24 w-full max-h-full">
            <Upper title="Create User Management" />
            <div className="mt-5 bg-white p-6 rounded-lg shadow-md">
                <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Username</label>
                            <input
                                type="text"
                                {...register("userName")}
                                className="mt-1 p-2 border w-full rounded-md"
                                placeholder="Enter username"
                            />
                            {errors.userName?.message && (
                                <p className="text-red-500 text-xs mt-2">{errors.userName.message.toString()}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                {...register("userEmail")}
                                className="mt-1 p-2 border w-full rounded-md"
                                placeholder="Enter email"
                            />
                            {errors.userEmail?.message && (
                                <p className="text-red-500 text-xs mt-2">{errors.userEmail.message.toString()}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Branch</label>
                            <select
                                {...register("userBranch")}
                                className="mt-1 p-2 border w-full rounded-md"
                            >
                                <option value="">Select Branch</option>
                                {branches.map((branch) => (
                                    <option key={branch.branchId} value={branch.branchId}>
                                        {branch.branchName}
                                    </option>
                                ))}
                            </select>
                            {errors.userBranch?.message && (
                                <p className="text-red-500 text-xs mt-2">{errors.userBranch.message.toString()}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Phone</label>
                            <input
                                type="text"
                                {...register("userPhone")}
                                className="mt-1 p-2 border w-full rounded-md"
                                placeholder="Enter phone number"
                            />
                            {errors.userPhone?.message && (
                                <p className="text-red-500 text-xs mt-2">{errors.userPhone.message.toString()}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Role</label>
                            <select
                                {...register("userRole")}
                                className="mt-1 p-2 border w-full rounded-md"
                            >
                                <option value="">Select Role</option>
                                {Object.values(Role).map((role) => (
                                    <option key={role} value={role}>
                                        {role}
                                    </option>
                                ))}
                            </select>
                            {errors.userRole?.message && (
                                <p className="text-red-500 text-xs mt-2">{errors.userRole.message.toString()}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">SubRole</label>
                            <select
                                {...register("userSubRole")}
                                className="mt-1 p-2 border w-full rounded-md"
                            >
                                <option value="">Select SubRole</option>
                                {Object.values(SubRole).map((subRole) => (
                                    <option key={subRole} value={subRole}>
                                        {subRole}
                                    </option>
                                ))}
                            </select>
                            {errors.userSubRole?.message && (
                                <p className="text-red-500 text-xs mt-2">{errors.userSubRole.message?.toString()}</p>
                            )}
                        </div>
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <input
                                type={showPassword ? "text" : "password"} // Dynamic type
                                {...register("password")}
                                className="mt-1 p-2 border w-full rounded-md pr-10" // Added padding for icon space
                                placeholder="Enter password"
                            />
                            <button
                                type="button"
                                onClick={handleClickShowPassword}
                                className="absolute right-3 top-11 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
                            >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </button>
                            {errors.password?.message && (
                                <p className="text-red-500 text-xs mt-2">{errors.password.message.toString()}</p>
                            )}
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
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

export default CreatePageUser;
