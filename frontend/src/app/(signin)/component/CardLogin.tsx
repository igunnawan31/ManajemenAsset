"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import PasswordInput from "../component/PasswordInput";
import { useRouter } from "next/navigation";

const CardLogin = () => {
    const [step, setStep] = useState<"email" | "password">("email");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleNext = async () => {
        if (!email) {
            setError("Please fill in the field");
            return;
        }
    
        setLoading(true);
    
        try {
            const payload = { userEmail: email, password: password};
    
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/validate-email`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(payload),
            });
    
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Login failed");
            }
    
            setStep("password");
            setError("");
        } catch (err: any) {
            setError(err.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async () => {
        if (!password) {
            setError("Please fill in the field");
            return;
        }
    
        setLoading(true);
    
        try {
            const payload = { userEmail: email, password: password};
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(payload),
            });
    
            const data = await response.json();
    
            if (!response.ok) {
                throw new Error(data.message || "Login failed");
            }
            
            localStorage.setItem("token", data.token);
            localStorage.setItem("userSubRole", data.subRole);
            console.log(data.subRole);
            console.log(data.token);
    
            if (data.subRole === "Kepala_Gudang") {
                console.log("Redirecting to /dashboard");
                router.push("/dashboard");
            } else if (data.subRole === "PIC_Gudang") {
                console.log("Redirecting to /userdashboard");
                router.push("/userdashboard/inbound");
            }
        } catch (err: any) {
            setError(err.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <div className="w-full md:w-[500px] bg-white shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between border-b pb-4">
                <Image 
                    src="/image002.png"
                    width={120} 
                    height={40} 
                    alt="Astra International"
                />
                <span className="text-xl font-semibold text-[#202B51] font-sans">
                    Welcome to Login Page
                </span>
            </div>

            <div className="w-full mt-6">
                <label className="block text-sm font-sans font-medium text-gray-700 mb-1">
                    {step === "email" ? "Email" : "Password"} <span className="text-red-500">*</span>
                </label>
                
                {step === "email" ? (
                    <input
                        type="text"
                        placeholder="Enter your email"
                        className="mt-2 w-full h-12 px-4 border-b-[#202B51] border-b-2 bg-[#F5F9FF] text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#1C2C5B]"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                ) : (
                    <PasswordInput
                        password={password}
                        placeholder="Enter your password"
                        handlePassword={(e) => setPassword(e.target.value)}
                        showCapsLockOnMessage={true}
                    />
                )}

                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>

            {step === "password" && (
                <div className="w-full mt-4">
                    <Link href="/forgot-password" className="text-blue-500 font-sans hover:opacity-50">
                        Forgot your password?
                    </Link>
                </div>
            )}

            <div className="flex justify-between">
                <div className="flex items-center mt-6 space-x-4">
                    <Image src="/image000.png" width={50} height={50} alt="Undip Logo" />
                    <Image src="/image001.png" width={50} height={50} alt="Agit Logo" />
                </div>
                <div className="flex justify-end mt-6 space-x-4">
                    {step === "password" && (
                        <button 
                            onClick={() => setStep("email")}
                            className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg text-sm hover:bg-gray-400 transition"
                        >
                            Back
                        </button>
                    )}
                    <button
                        onClick={step === "email" ? handleNext : handleLogin}
                        className="bg-[#1C2C5B] text-white px-6 py-3 rounded-lg text-sm hover:bg-[#152142] transition"
                    >
                        {step === "email" ? "Sign In" : "Login"}
                    </button>
                </div>
            </div>

            <div className="mt-6 relative top-[1.6rem] right-[1.6rem] overflow-hidden">
                <Image 
                    src="/style1.png"
                    width={500}
                    height={80}
                    alt="Decorative Wave"
                    className="max-w-full"
                />
            </div>
        </div>
    );
}

export default CardLogin;
