import type { Metadata } from "next";
import UserNavbar from "./usercomponent/UserNavbar";
import CardStat from "./usercomponent/CardStat";


export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
        <body>
            <div className="relative w-full h-64 md:h-80 bg-cover bg-center"
                style={{ backgroundImage: "url('/astra.jpeg')" }}>
                <div className="absolute inset-0 bg-[#202B51] bg-opacity-70"></div>
                <div className="relative z-10 flex justify-between items-center p-6 md:p-10 text-white">
                    <UserNavbar />
                </div>
                <div className="md:px-10 w-full">
                    <CardStat />
                </div>
            </div>

            <main className="2xl:px-80 py-32 bg-gray-100">
                {children}
            </main>
        </body>
    </html>
  );
}
