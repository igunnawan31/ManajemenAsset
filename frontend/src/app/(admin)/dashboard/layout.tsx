"use client";

import { useEffect, useState } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Menu from "@/app/(admin)/dashboard/components/Menu";
import NavbarAdmin from "@/app/(admin)/dashboard/components/NavbarAdmin";

type UserResponseDTO = {
  userId: number;
  userName: string;
  userEmail: string;
  userBranch: number;
  userPhone: string;
  userRole: string;
  userSubRole: string;
};

export default function AdminLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
  const [userData, setUserData] = useState<UserResponseDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
    fetchUserData();
  }, []);

    return ( 
      <div className="h-screen flex">
          <div className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] bg-[#202B51] h-screen flex flex-col">
              <div className="sticky top-0 bg-[#202B51] z-10 p-4">
                  <Link href="/dashboard" className="flex items-center justify-center gap-2 xl:justify-start">
                      <div className="flex items-center gap-2 justify-start">
                          <div className="bg-white opacity-40 p-1 hidden lg:block">
                            <Image 
                              src="/image002.png"
                              width={80} 
                              height={10} 
                              alt="Astra International"
                            />
                          </div>
                          <div className="font-sans">
                          <span className="hidden xl:block text-sm text-white font-bold">
                            {userData?.userName}
                          </span>
                          <span className="hidden xl:block text-sm text-white">
                            {userData?.userEmail}
                          </span>
                          </div>
                      </div>
                  </Link>
              </div>

              <div className="flex-1 overflow-y-auto">
                  <Menu/>
              </div>
          </div>

          <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[90%] bg-[#F7F8FA] h-screen overflow-y-auto">
              <NavbarAdmin />
              {children}
          </div>
      </div>
    );
  }
  
  
