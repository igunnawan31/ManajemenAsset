"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { IoCaretDown, IoNotifications } from "react-icons/io5";
import { useRouter } from "next/navigation"; // Import useRouter

const NavbarAdmin = () => {
    const [isDropdownMenuOpen, setIsDropdownMenuOpen] = useState(false);
    const dropdownRef = useRef(null);
    const router = useRouter(); // Initialize useRouter

    const logout = () => {
        document.cookie = "token=; path=/; domain=" + window.location.hostname + "; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
        document.cookie = "jwt=; path=/; domain=" + window.location.hostname + "; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
        document.cookie = "userSubRole=; path=/; domain=" + window.location.hostname + "; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    
        localStorage.removeItem("token");
        localStorage.removeItem("userSubRole");
        localStorage.removeItem("ally-supports-cache");
        sessionStorage.clear();
    
        setTimeout(() => {
            window.location.href = "/logout";
        }, 500);
    };

    const goToProfile = () => {
        router.push("/dashboard/profile");
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !(dropdownRef.current as HTMLElement).contains(event.target as Node)) {
                setIsDropdownMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="bg-white shadow-sm fixed w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%]">
            <div className="flex justify-end items-center p-4 bg-[#202B51]">
                <div className="flex items-center gap-4 pr-8">
                    <div className="relative cursor-pointer">
                        <IoNotifications size={32} className="text-white" />
                    </div>
                    <div className="relative" ref={dropdownRef}>
                        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setIsDropdownMenuOpen(!isDropdownMenuOpen)}>
                            <div className="bg-white rounded-full w-10 h-10 flex items-center justify-center">
                            </div>
                            <IoCaretDown className="text-white" />
                        </div>
                        {isDropdownMenuOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg">
                                <ul className="py-2 text-sm text-gray-700 poppins">
                                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={goToProfile}>Profile</li>
                                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Settings</li>
                                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={logout}>Logout</li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NavbarAdmin;