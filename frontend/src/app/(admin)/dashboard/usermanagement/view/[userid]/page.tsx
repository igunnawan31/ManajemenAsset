"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Upper from "../../../components/Upper"; // Adjust path if needed

interface User {
    userId: string;
    userName: string;
    userEmail: string;
    userBranch: string;
    userPhone: string;
    userRole: string;
    userSubRole: string;
}

interface Branch {
    branchId: string;
    branchName: string;
}

const UserView = () => {
    const { userid } = useParams();
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [branches, setBranches] = useState<Branch[]>([]);

    useEffect(() => {
        console.log("Fetching user from:", `${process.env.NEXT_PUBLIC_API_URL}/user/by-id/${userid}`);

        if (!userid) {
            setError("User ID is missing.");
            setLoading(false);
            return;
        }

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/by-id/${userid}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("User not found");
                }
                return response.json();
            })
            .then((data) => {
                console.log("Fetched user data:", data);
                if (!data) {
                    throw new Error("User not found");
                }
                setUser(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching user:", error);
                setError("User not found.");
                setLoading(false);
            });

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/branch/index`)
            .then((res) => res.json())
            .then((data) => setBranches(data))
            .catch((err) => console.error("Error fetching branches:", err));
    }, [userid]);

    const branchName = branches.find(b => b.branchId === user?.userBranch)?.branchName || "Unknown Branch";

    if (loading) return <div className="text-center mt-10">Loading...</div>;
    if (error) return <div className="text-center text-red-500 mt-10">{error}</div>;

    return (
        <div className="px-8 py-24 text-black w-full max-h-full mb-32">
            <Upper title="View User Details" />
            <div className="mt-5 bg-white p-6 rounded-lg shadow-lg space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">ID User</label>
                    <input
                        type="text"
                        defaultValue={user?.userId}
                        className="mt-1 p-2 border border-[#202BA5] w-full rounded-md focus:ring-2 focus:ring-[#202BA5]"
                        disabled
                        readOnly
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Username</label>
                    <input
                        type="text"
                        defaultValue={user?.userName}
                        className="mt-1 p-2 border border-[#202BA5] w-full rounded-md focus:ring-2 focus:ring-[#202BA5]"
                        disabled
                        readOnly
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Email User</label>
                    <input
                        type="text"
                        defaultValue={user?.userEmail}
                        className="mt-1 p-2 border border-[#202BA5] w-full rounded-md focus:ring-2 focus:ring-[#202BA5]"
                        disabled
                        readOnly
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">User Branch</label>
                    <input
                        type="text"
                        defaultValue={branchName}
                        className="mt-1 p-2 border border-[#202BA5] w-full rounded-md focus:ring-2 focus:ring-[#202BA5]"
                        disabled
                        readOnly
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Phone User</label>
                    <input
                        type="text"
                        defaultValue={user?.userPhone}
                        className="mt-1 p-2 border border-[#202BA5] w-full rounded-md focus:ring-2 focus:ring-[#202BA5]"
                        disabled
                        readOnly
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Role User</label>
                    <input
                        type="text"
                        defaultValue={user?.userRole}
                        className="mt-1 p-2 border border-[#202BA5] w-full rounded-md focus:ring-2 focus:ring-[#202BA5]"
                        disabled
                        readOnly
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Sub Role User</label>
                    <input
                        type="text"
                        defaultValue={user?.userSubRole}
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

export default UserView;