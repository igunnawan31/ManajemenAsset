"use client";

import Image from "next/image";
import Link from "next/link";
import Footer from "./component/Footer";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userSubRole, setUserSubRole] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("userSubRole");

      if (token && role) {
        setIsAuthenticated(true);
        setUserSubRole(role);
      }
    }
  }, []);

  const handleLoginClick = () => {
    if (isAuthenticated && userSubRole) {
      if (userSubRole === "Kepala_Gudang") {
        router.push("/dashboard");
      } else if (userSubRole === "PIC_Gudang") {
        router.push("/userdashboard/inbound");
      }
    } else {
      router.push("/sign-in");
    }
  };

  return (
    <section id="Home" className="relative min-h-screen overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image 
          src="/astra.jpeg" 
          layout="fill" 
          objectFit="cover" 
          alt="Background Image"
        />
      </div>

      <div className="absolute inset-0 bg-[#202B51] opacity-60 z-5"></div>

      <div className="relative z-10 flex items-center justify-center h-full py-[23rem]">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-wrap">
            <div className="w-full px-2 flex justify-center">
              <div className="relative mb-10">
                <span className="font-poppins text-white text-4xl font-bold">
                  Welcome to Sistem Manajamen Asset
                </span>
              </div>
            </div>
            <div className="w-full px-2 flex items-center justify-center mb-10">
              <div className="text-center">
                <span className="text-gray-100 font-poppins text-center text-lg">
                  Sistem Manajemen Asset Astra International berbasis QR Code untuk Karyawan Astra  
                </span>
              </div>
            </div>
            <div className="w-full px-2 flex items-center justify-center">
              <div className="text-center">
                <button
                  onClick={handleLoginClick}
                  className="bg-[#202B51] hover:border text-white hover:opacity-90 h-10 w-52 p-6 flex items-center justify-center"
                >
                  Lanjutkan Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="z-10">
        <Footer />
      </div>
    </section>
  );
}
