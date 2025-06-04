"use client"; // Required for useRouter to work in Next.js 13+ with App Router

import Image from "next/image";
import { useRouter } from "next/navigation";
import Footer from "../component/Footer";

export default function RestrictedArea() {
  const router = useRouter();

  return (
    <section id="Home" className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0">
        <Image 
          src="/astra.jpeg" 
          layout="fill" 
          objectFit="cover" 
          alt="Background Image"
        />
      </div>

      <div className="absolute inset-0 bg-gray-900 to-transparent opacity-90 z-5"></div>

      <div className="relative z-10 flex items-center justify-center h-full py-[23rem]">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-wrap">
            <div className="w-full px-2 flex flex-col items-center">
              <div className="relative mb-10">
                <span className=" text-white text-2xl font-bold">
                  You do not have permission to access this area
                </span>
              </div>
              <button
                onClick={() => router.back()}
                className="mt-4 px-6 py-2 bg-white text-gray-900 font-semibold rounded-lg shadow-md hover:bg-gray-300 transition"
              >
                Go Back
              </button>
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
