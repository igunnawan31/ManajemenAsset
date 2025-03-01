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

const UserView = () => {
    const { userid } = useParams();
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

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
    }, [userid]);

    if (loading) return <div className="text-center mt-10">Loading...</div>;
    if (error) return <div className="text-center text-red-500 mt-10">{error}</div>;

    return (
        <div className="px-8 py-24 w-full max-h-full">
            <Upper title="View User Details" />
            <div className="mt-5 bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-bold text-[#202B51]">{user?.userName}</h2>
                <p><strong>ID:</strong> {user?.userId}</p>
                <p><strong>Name:</strong> {user?.userName}</p>
                <p><strong>Email:</strong> {user?.userEmail}</p>
                <p><strong>Branch:</strong> {user?.userBranch}</p>
                <p><strong>Phone:</strong> {user?.userPhone}</p>
                <p><strong>Role:</strong> {user?.userRole}</p>
                <p><strong>Sub Role:</strong> {user?.userSubRole}</p>
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