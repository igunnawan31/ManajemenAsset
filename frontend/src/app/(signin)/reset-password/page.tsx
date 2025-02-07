"use client";

import Link from "next/link";
import PasswordInput from "../component/PasswordInput";
import { useState } from "react";
import { useRouter } from "next/navigation";

const ResetPasswordPage = () => {
    const [password, setPassword] = useState("");
    const [confirmationPassword, setConfirmationPassword] = useState("");
    const [error, setError] = useState("");

    const router = useRouter(); // Fixed the missing 'const'

    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmationPassword(e.target.value);

        if (password && e.target.value !== password) {
            setError("Passwords do not match");
        } else {
            setError("");
        }
    };

    const handleSubmit = () => {
        if (!password || !confirmationPassword) {
            setError("Please fill in both fields");
        } else if (password !== confirmationPassword) {
            setError("Passwords do not match");
        } else {
            setError("");
            alert("Password successfully reset!");
            
            // Redirect to sign-in page
            router.push("/sign-in");
        }
    };

    return (
        <div className="relative z-10 flex items-center justify-center h-full py-[15rem] overflow-hidden">
            <div className="w-full md:w-[500px] bg-white shadow-lg p-6 border border-gray-200">
                <div className="w-full p-3 flex justify-center items-center mt-4">
                    <span className="text-4xl font-sans text-[#202B51] font-semibold block">
                        Recover Password
                    </span>
                </div>
                <div className="w-full flex justify-center items-center">
                    <span className="text-md font-sans text-[#202B51]">
                        Reset your password and it will work perfectly
                    </span>
                </div>

                <div className="w-full mt-6">
                    <label className="block text-sm font-sans font-medium text-gray-700 mb-1">
                        Password <span className="text-red-500">*</span>
                    </label>
                    <PasswordInput
                        password={password}
                        placeholder="Enter your new password"
                        handlePassword={(e) => setPassword(e.target.value)}
                        showCapsLockOnMessage={true}
                    />
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                </div>

                <div className="w-full mt-6">
                    <label className="block text-sm font-sans font-medium text-gray-700 mb-1">
                        Confirmation Password <span className="text-red-500">*</span>
                    </label>
                    <PasswordInput
                        password={confirmationPassword}
                        placeholder="Enter confirmation password"
                        handlePassword={handleConfirmPasswordChange}
                        showCapsLockOnMessage={true}
                    />
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                </div>

                <div className="w-full mt-5">
                    <button
                        onClick={handleSubmit}
                        className="w-full p-4 rounded-lg bg-[#202B51] hover:opacity-90 hover:border-[#202B51] flex justify-center items-center"
                    >
                        <span className="font-sans text-white">Submit your new password</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
