"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { IoCaretDown } from "react-icons/io5";

const UserNavbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [isDropdownMenuOpen, setIsDropdownMenuOpen] = useState(false);
    const [isDropdownMobileOpen, setIsDropdownMobileOpen] = useState(false);
    const dropdownRef = useRef(null);
    const dropdownMobileRef = useRef(null);

    const logout = () => {
        document.cookie = "token=; path=/; domain=" + window.location.hostname + "; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
        document.cookie = "jwt=; path=/; domain=" + window.location.hostname + "; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
        document.cookie = "userSubRole=; path=/; domain=" + window.location.hostname + "; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    
        localStorage.removeItem("token");
        sessionStorage.clear();
    
        setTimeout(() => {
            window.location.href = "/";
        }, 500);
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

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownMobileRef.current && !(dropdownMobileRef.current as HTMLElement).contains(event.target as Node)) {
                setIsDropdownMobileOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <nav className="w-full p-4 bg-transparent fixed top-0 left-0 z-50">
            <div className="flex justify-between items-center max-w-7xl mx-auto">
                <div className="flex items-center space-x-6">
                    <Image 
                        src="/image002.png"
                        width={120} 
                        height={40} 
                        alt="Astra International"
                        className="transition-transform duration-300 hover:scale-105"
                    />

                    <div className="hidden md:flex space-x-6">
                        {["inbound", "outbound", "how-to-scan-qr"].map((item, index) => (
                            <Link key={index} href={`/${item}`} className="relative group">
                                <span className="text-white poppins text-sm tracking-wide capitalize transition-all duration-300 ease-in-out">
                                    {item.replace(/-/g, " ")}
                                </span>
                                <div className="absolute left-0 w-0 h-[2px] bg-white transition-all duration-300 ease-in-out group-hover:w-full"></div>
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="flex items-center space-x-3">
                    <div className="relative">
                        <div 
                            className="hidden md:flex items-center space-x-3 cursor-pointer" 
                            ref={dropdownRef} 
                            onClick={() => setIsDropdownMenuOpen(!isDropdownMenuOpen)}
                        >
                            <div className="w-8 h-8 bg-white rounded-full"></div>
                            <div>
                                <span className="text-sm poppins block">Muhamad Gunawan</span>
                                <span className="text-sm poppins block text-gray-300">Karyawan - Cabang Perum</span>
                            </div>
                            <IoCaretDown className="text-white" />
                        </div>

                        {isDropdownMenuOpen && (
                            <div 
                                className="absolute w-64 mt-5 bg-white border rounded-md shadow-lg z-50 hidden md:flex">
                                <ul className="py-2 text-sm text-gray-700 w-full">
                                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Profile</li>
                                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Settings</li>
                                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={logout}>Logout</li>
                                </ul>
                            </div>
                        )}
                    </div>

                    <button 
                        className="md:hidden text-white focus:outline-none" 
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        {menuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>

            <div className={`fixed top-0 right-0 h-full w-72 bg-black bg-opacity-90 transform ${menuOpen ? "translate-x-0" : "translate-x-full"} transition-transform duration-300 ease-in-out md:hidden`}>
                <div className="p-6 flex flex-col space-y-6">
                    <button className="text-white self-end" onClick={() => setMenuOpen(false)}>
                        <X size={28} />
                    </button>

                    {["inbound", "outbound", "how-to-scan-qr"].map((item, index) => (
                        <Link key={index} href={`/${item}`} className="text-white text-lg poppins hover:underline" onClick={() => setMenuOpen(false)}>
                            {item.replace(/-/g, " ")}
                        </Link>
                    ))}

                    <div className="relative">
                        <div 
                            className="flex items-center space-x-3 cursor-pointer" 
                            ref={dropdownMobileRef} 
                            onClick={() => setIsDropdownMobileOpen(!isDropdownMobileOpen)}
                        >
                            <div className="w-8 h-8 bg-white rounded-full"></div>
                            <div>
                                <span className="text-sm poppins block">Muhamad Gunawan</span>
                                <span className="text-sm poppins block text-gray-300">Karyawan - Cabang Perum</span>
                            </div>
                            <IoCaretDown className="text-white" />
                        </div>

                        {isDropdownMobileOpen && (
                            <div 
                                className="absolute w-64 mt-5 bg-white border rounded-md shadow-lg z-50">
                                <ul className="py-2 text-sm text-gray-700">
                                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Profile</li>
                                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Settings</li>
                                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={logout}>Logout</li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default UserNavbar;
