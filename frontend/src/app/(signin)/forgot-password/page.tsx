"use client";

import { useContext } from "react";
// import { GlobalContext } from "@/services/globalContext";
import { useState } from "react";
import Link from "next/link";

const ForgotPasswordpage = () => {
    // const {loading, passwordRecoveryEmailError, sendPasswordRecoveryEmail} = useContext(GlobalContext) 
    // const [emailOrUsername, setEmailOrUsername] = useState("");
    const [error, setError] = useState("");
    // const submitHandler = (e) = > {
    //     e.preventDefault()

    //     sendPasswordRecoveryEmail(emailOrUsername);
    // };

    // const isButtonDisabled = !emailOrUsername;

    return (
        <div className="relative z-10 flex items-center justify-center h-full py-[15rem] overflow-hidden">
            <div className="w-full md:w-[500px] bg-white shadow-lg p-6 border border-gray-200">
                <div className="w-full justify-start items-center">
                    <Link href="/sign-in"
                        className="text-gray-500 hover:text-[#202B51] font-sans"
                    >
                        Back to sign in
                    </Link>
                </div>
                <div className="w-full p-3 flex justify-center items-center mt-4">
                    <span className="text-4xl font-sans text-[#202B51] font-semibold block">Recover Password</span>
                </div>
                <div className="w-full flex justify-center items-center">
                    <span className="text-md font-sans text-[#202B51] ">Dont worry we got you cover</span>
                </div>
                <div className="w-full mt-6">
                    <label className="block text-sm font-sans font-medium text-gray-700 mb-1">
                        Email <span className="text-red-500">*</span>
                    </label>
                    <input
                        placeholder="Enter your email"
                        className="mt-2 w-full h-12 px-4 border-b-[#202B51] border-b-2 bg-[#F5F9FF] text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1C2C5B]"
                    />
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                </div>
                <div className="w-full mt-5">
                    <button className="w-full p-4 rounded-lg bg-[#202B51] hover:opacity-90 hover:border-[#202B51] flex justify-center items-center">
                        <span className="font-sans text-white">Sent Link to Email</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ForgotPasswordpage;