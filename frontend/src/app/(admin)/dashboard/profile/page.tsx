"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Upper from "../components/Upper";

type UserResponseDTO = {
    userId: number;
    userName: string;
    userEmail: string;
    userBranch: number;
    userPhone: string;
    userRole: string;
    userSubRole: string;
};

interface Branch {
    branchId: number;
    branchName: string;
}

const ProfilePage = () => {
    const [userData, setUserData] = useState<UserResponseDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [branches, setBranches] = useState<Branch[]>([]);
    const router = useRouter();

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
                setUserData(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "An unknown error occurred");
            } finally {
                setLoading(false);
            }
        };

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

        fetchUserData();
        fetchBranches();
    }, []);

    const getBranchName = (branchId: number) => {
        const branch = branches.find(b => b.branchId === branchId);
        return branch ? branch.branchName : "Unknown Branch";
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="px-8 py-24 w-full max-h-full">
            <Upper title="Profile Page"/>
            <div className="mt-5 bg-white p-6 rounded-lg shadow-md">
                <div className="space-y-4">
                    {userData && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">User ID</label>
                                <input
                                    type="text"
                                    defaultValue={userData.userId}
                                    className="mt-1 p-2 border border-[#202BA5] w-full rounded-md"
                                    readOnly
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">User Name</label>
                                <input
                                    type="text"
                                    defaultValue={userData.userName}
                                    className="mt-1 p-2 border border-[#202BA5] w-full rounded-md"
                                    readOnly
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Branch</label>
                                <input
                                    type="text"
                                    defaultValue={getBranchName(userData.userBranch)}
                                    className="mt-1 p-2 border border-[#202BA5] w-full rounded-md"
                                    readOnly
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Phone</label>
                                <input
                                    type="text"
                                    defaultValue={userData.userPhone}
                                    className="mt-1 p-2 border border-[#202BA5] w-full rounded-md"
                                    readOnly
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="text"
                                    defaultValue={userData.userEmail}
                                    className="mt-1 p-2 border border-[#202BA5] w-full rounded-md"
                                    readOnly
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Role</label>
                                <input
                                    type="text"
                                    defaultValue={userData.userRole}
                                    className="mt-1 p-2 border border-[#202BA5] w-full rounded-md"
                                    readOnly
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Sub Role</label>
                                <input
                                    type="text"
                                    defaultValue={userData.userSubRole}
                                    className="mt-1 p-2 border border-[#202BA5] w-full rounded-md"
                                    readOnly
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
