"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Upper from "../../../components/Upper";
import PopUpModal from "../../../components/PopUpModal";
import { IoCheckmarkCircleSharp, IoCloseCircleSharp } from "react-icons/io5";

interface User {
    userId: string;
    userName: string;
    userEmail: string;
    userBranch: string;
    userPhone: string;
    userRole: string;
    userSubRole: string;
}

enum Role {
    Cabang = "Cabang",
    Pusat = "Pusat",
}

enum SubRole {
    Kepala_Gudang = "Kepala_Gudang",
    PIC_Gudang = "PIC_Gudang",
}

interface Branch {
    branchId: string;
    branchName: string;
}

const EditUserPage = () => {
    const { userid } = useParams();
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [modalType, setModalType] = useState<"success" | "error" | null>(null);
    const [modalMessage, setModalMessage] = useState<string>("");
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        if (!userid) {
            setError("User ID is missing.");
            setLoading(false);
            return;
        }

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/by-id/${userid}`)
            .then((res) => {
                if (!res.ok) throw new Error("User not found");
                return res.json();
            })
            .then((data) => {
                setUser(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setError("Failed to fetch user");
                setLoading(false);
            });

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/branch/index`)
            .then((res) => res.json())
            .then((data) => setBranches(data))
            .catch((err) => console.error("Error fetching branches:", err));
    }, [userid]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setUser((prevUser) => {
            if (!prevUser) return prevUser;
            return { ...prevUser, [name]: value };
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);
    
        if (!user) {
            setError("User data is missing");
            setLoading(false);
            return;
        }
    
        try {
            const formData = new FormData();
            formData.append("userId", user.userId);
            formData.append("userName", user.userName);
            formData.append("userEmail", user.userEmail);
            formData.append("userBranch", user.userBranch);
            formData.append("userPhone", user.userPhone);
            formData.append("userRole", user.userRole);
            formData.append("userSubRole", user.userSubRole);
    
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/update`, {
                method: "PUT",
                body: formData,
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to update user");
            }
    
            setModalType("success");
            setModalMessage("User updated successfully!");
            setSuccess(null);
            return;
        } catch (err: any) {
            setModalType("error");
            setModalMessage(err.message || "Error Updating User");
        } finally {
            setLoading(false);
        }
    };
    

    if (loading) return <div className="text-center mt-10">Loading...</div>;
    if (error || !user) return <div className="text-center text-red-500 mt-10">{error}</div>;

    return (
        <div className="px-8 py-24 w-full max-h-full">
            <Upper title="Edit User" />
            <form onSubmit={handleSubmit} className="mt-5 bg-white p-6 rounded-lg shadow-lg space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">User ID</label>
                    <input
                        type="text"
                        name="userId"
                        value={user.userId}
                        readOnly
                        className="mt-1 p-2 border border-[#202BA5] w-full rounded-md bg-slate-300"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                        type="text"
                        name="userName"
                        value={user.userName}
                        onChange={handleChange}
                        className="mt-1 p-2 border border-[#202BA5] w-full rounded-md"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        name="userEmail"
                        value={user.userEmail}
                        onChange={handleChange}
                        className="mt-1 p-2 border border-[#202BA5] w-full rounded-md"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Branch</label>
                    <select
                        name="userBranch"
                        value={user.userBranch}
                        onChange={handleChange}
                        className="mt-1 p-2 border border-[#202BA5] w-full rounded-md"
                    >
                        <option value="">-- Select Branch --</option>
                        {branches.map((branch) => (
                            <option key={branch.branchId} value={branch.branchId}>
                                {branch.branchName}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <input
                        type="text"
                        name="userPhone"
                        value={user.userPhone}
                        onChange={handleChange}
                        className="mt-1 p-2 border border-[#202BA5] w-full rounded-md"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Role</label>
                    <select
                        name="userRole"
                        value={user.userRole}
                        onChange={handleChange}
                        className="mt-1 p-2 border border-[#202BA5] w-full rounded-md"
                    >
                        <option value="">-- Select Role --</option>
                        {Object.values(Role).map((role) => (
                            <option key={role} value={role}>
                                {role}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Sub Role</label>
                    <select
                        name="userSubRole"
                        value={user.userSubRole}
                        onChange={handleChange}
                        className="mt-1 p-2 border border-[#202BA5] w-full rounded-md"
                    >
                        <option value="">-- Select Sub Role --</option>
                        {Object.values(SubRole).map((subrole) => (
                            <option key={subrole} value={subrole}>
                                {subrole.replace("_", " ")}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex justify-between mt-6">
                    <button
                        type="submit"
                        className="bg-[#202B51] text-white px-4 py-2 rounded-lg hover:bg-[#1a2344]"
                    >
                        Save Changes
                    </button>
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="bg-gray-300 text-black px-4 py-2 rounded-lg hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                </div>
            </form>
            {modalType === "success" && (
                <PopUpModal
                    title="Success"
                    message={modalMessage}
                    icon={<IoCheckmarkCircleSharp className="text-green-500" />}
                    actions={
                    <>
                        <button
                            onClick={() => router.push("/dashboard/usermanagement")}
                            className="bg-[#202B51] text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                        >
                            Go to User Management
                        </button>
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

export default EditUserPage;
