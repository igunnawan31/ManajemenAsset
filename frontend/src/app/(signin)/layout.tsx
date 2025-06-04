import type { Metadata } from "next";
import { Geist, Geist_Mono,  } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import Footer from "../component/Footer";

export default function SignInLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <section id="Home" className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0">
            <Image 
            src="/astra.jpeg" 
            layout="fill" 
            objectFit="cover" 
            alt="Background Image"
            />
        </div>

        <div className="absolute inset-0 bg-[#202B51] to-transparent opacity-60 z-5"></div>

        {children}
        <div className="z-10">
            <Footer />
        </div>
        </section>
        
      </body>
    </html>
  );
}
