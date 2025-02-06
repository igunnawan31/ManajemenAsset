import type { Metadata } from "next";
import { Poppins, Geist, Geist_Mono } from "next/font/google";
import { Roboto } from 'next/font/google'
import Link from "next/link";
import Image from "next/image";
import Menu from "@/app/(admin)/dashboard/components/Menu";
import NavbarAdmin from "@/app/(admin)/dashboard/components/NavbarAdmin";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const roboto = Roboto({
  weight: '400',
  subsets: ['latin'],
})

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins", // Define CSS variable
});

export default function AdminLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return ( 
      <div className="h-screen flex">
          <div className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] bg-[#202B51] h-screen flex flex-col">
              <div className="sticky top-0 bg-[#202B51] z-10 p-4">
                  <Link href="/dashboard" className="flex items-center justify-center gap-2 xl:justify-start">
                      <div className="flex items-center gap-2 justify-start">
                          <div className="bg-white rounded-full w-10 h-10 flex items-center justify-center cursor-pointer">
                              {/* <Image src={"/message.png"} alt="" width={10} height={10}></Image> */}
                          </div>
                          <div className="font-sans">
                              <span className="hidden xl:block text-sm text-white text-bold">Muhamad Gunawan</span>
                              <span className="hidden xl:block text-sm text-white">igunnawan24@admin.ac.id</span>
                          </div>
                      </div>
                  </Link>
              </div>

              <div className="flex-1 overflow-y-auto">
                  <Menu/>
              </div>
          </div>

          <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] bg-[#F7F8FA] h-screen overflow-y-auto">
              <NavbarAdmin />
              {children}
          </div>
      </div>
    );
  }
  
  
