"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const Path = () => {
    const pathname = usePathname();
    const pathSegments = pathname.split("/").filter(Boolean);

    return (
        <div className="w-full flex justify-end items-end">
            <div className="flex items-center space-x-2 text-gray-600 text-sm">
                {pathSegments.map((segment, index) => {
                    const href = "/" + pathSegments.slice(0, index + 1).join("/");
                    return (
                        <span key={index} className="flex items-center">
                            <Link href={href} className="hover:underline poppins capitalize text-blue-500">
                                {decodeURIComponent(segment)}
                            </Link>
                            {index < pathSegments.length - 1 && <span className="mx-2">/</span>}
                        </span>
                    );
                })}
            </div>
        </div>
    );
};

export default Path;