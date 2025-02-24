"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Upper from "../../components/Upper";
import { useState, useEffect } from "react";

const userSchema = z.object({
    userName: z.string().min(1, "Username is required"),
    userEmail: z.string()
        .min(1, "Email is required")
        .email("Invalid email format"),
    userBranch: z.string().min(1, "Branch is required"),
    userPhone: z.string().min(1, "Phone is required"),
    userRole: z.string().min(1, "Role is required"),
    userSubRole: z.string().min(1, "SubRole is required"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});

const CreatePageUser = () => {
    const [userId, setUserId] = useState<string>("");
    const [error, setError] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(userSchema),
    });

    const onSubmit = (data: any) => {
        console.log("Form Submitted:", data);
    };

    return (
        <div className="px-8 py-24 w-full max-h-full">
            <Upper title="Create User Management" />
            <div className="mt-5 bg-white p-6 rounded-lg shadow-md">
            
            <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Username</label>
                            <input type="text" {...register("userName")} className="mt-1 p-2 border w-full rounded-md" placeholder="Enter username" />
                            {errors.userName?.message && <p className="text-red-500 text-xs mt-2">{errors.userName.message.toString()}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input type="email" {...register("userEmail")} className="mt-1 p-2 border w-full rounded-md" placeholder="Enter email" />
                            {errors.userEmail?.message && <p className="text-red-500 text-xs mt-2">{errors.userEmail.message.toString()}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Branch</label>
                            <input type="text" {...register("userBranch")} className="mt-1 p-2 border w-full rounded-md" placeholder="Enter branch" />
                            {errors.userBranch?.message && <p className="text-red-500 text-xs mt-2">{errors.userBranch.message.toString()}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Phone</label>
                            <input type="text" {...register("userPhone")} className="mt-1 p-2 border w-full rounded-md" placeholder="Enter phone number" />
                            {errors.userPhone?.message && <p className="text-red-500 text-xs mt-2">{errors.userPhone.message.toString()}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Role</label>
                            <input type="text" {...register("userRole")} className="mt-1 p-2 border w-full rounded-md" placeholder="Enter role" />
                            {errors.userRole?.message && <p className="text-red-500 text-xs mt-2">{errors.userRole.message.toString()}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">SubRole</label>
                            <input type="text" {...register("userSubRole")} className="mt-1 p-2 border w-full rounded-md" placeholder="Enter sub-role" />
                            {errors.userSubRole?.message && <p className="text-red-500 text-xs mt-2">{errors.userSubRole.message?.toString()}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <input type="password" {...register("password")} className="mt-1 p-2 border w-full rounded-md" placeholder="Enter password" />
                            {errors.password?.message && <p className="text-red-500 text-xs mt-2">{errors.password.message.toString()}</p>}
                        </div>
                    </div>
                    <button type="submit" className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md">Submit</button>
                </form>
            </div>
        </div>
    )
}

export default CreatePageUser;