"use client";

import Image from "next/image"
import Link from "next/link"

const Logout = () => {
    const handleClose = () => {
        window.close();
    }
    
    return (
        <div className="relative z-10 flex items-center justify-center h-full py-[15rem] overflow-hidden">
            <div className="w-full md:w-[500px] bg-white shadow-lg p-6 border border-gray-200">
                <div className="w-full flex justify-center items-center">
                    <span className="text-2xl font-sans font-medium text-[#202B51]">Thanks for Using Our Apps</span>
                </div>
                <div className="w-full flex justify-center items-center mt-5">
                    <span className="text-md text-center text-[#202B51]">Sistem Manajemen Asset Astra International</span>
                </div>
                <div className="w-full flex justify-center items-center mt-5">
                    <Image 
                        src="/image002.png"
                        width={60} 
                        height={40}
                        className="mr-2" 
                        alt="Astra International"
                    />
                    <Image 
                        src="/image001.png"
                        width={60} 
                        height={40} 
                        alt="Astra International"
                    />
                    <Image 
                        src="/image000.png"
                        width={60} 
                        height={40} 
                        alt="Astra International"
                    />
                </div>
                <div className="w-full flex justify-between items-center mt-5">
                    <Link href="/sign-in" className="mx-2 w-full">
                        <button className="w-full h-14 flex justify-center rounded-lg items-center bg-[#202B51] hover:opacity-80">
                            <span className="text-white font-sans">Back to Sign In</span>
                        </button>
                    </Link>
                    <button
                        onClick={handleClose} 
                        className="w-full h-14 flex justify-center rounded-lg items-center bg-white border-[#202B51] border-2 hover:bg-gray-100">
                        <span className="text-[#202B51] font-sans">Close</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Logout